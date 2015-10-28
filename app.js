/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express');
var app          = express();
var errorhandler = require('errorhandler');
var bluemix      = require('./config/bluemix');
var watson       = require('watson-developer-cloud');
var extend       = require('util')._extend;

var request = require('request');

var parseString = require('xml2js').parseString;
var mongoose = require('mongoose');
var Question = mongoose.model('Question');

module.exports = app;

// For local development, put username and password in config
// or store in your environment
var credentialsBackup = {
  url: 'https://stream.watsonplatform.net/text-to-speech/api',
  version: 'v1',
  username: '<username>',
  password: '<password>',
  use_vcap_services: true   
};

var credentials = extend(credentialsBackup, bluemix.getServiceCreds('text_to_speech'));
//var credentials = credentialsBackup;

// Create the service wrappers
var textToSpeech = watson.text_to_speech(credentials);
var authorization = watson.authorization(credentials);

function parseWolfram (xmlResponse, callback) {
  var answer;
  parseString(xmlResponse, function (err, result) {
    if (result.queryresult.pod) {
      result.queryresult.pod.some(function (p){
        if (p["$"].title==="Result" || p["$"].title==="Current result") {
          answer = p.subpod[0].plaintext[0].split("_")[0];
          return true; 
        }
        if (p["$"].title==="Definition") {
          answer = p.subpod[0].plaintext[0].split("|")[1];
          return true; 
        }
        if (p["$"].title==="Definitions") {
          answer = p.subpod[0].plaintext[0].split("|")[2].slice(0,-2);
          return true; 
        }if (p["$"].title==="Response") {
          answer = p.subpod[0].plaintext[0];
          return true; 
        }
      });
    } 
    callback(answer);
  });
};

// Setup static public directory
app.use(express.static('./public'));

// Get token from Watson using your credentials
app.get('/token', function(req, res) {
  authorization.getToken({url: credentials.url}, function(err, token) {
    if (err) {
      console.error('error:', err);
      res.status(err.code);
    }

    res.send(token);
  });
});

app.get('/ask',function (req, res, next) {
  req.question = decodeURIComponent(req.query.text);
  Question.findOne({"question": req.question})
    .then(function(q) {
      // if the question has been recorded and an answer is known, respond with the answer
      if (q && q.answer) {
        var transcript = textToSpeech.synthesize({"text": q.answer, "voice": req.query.voice});
        transcript.on('error', function (error) {
          res.status(500).send(error);
        });
        transcript.pipe(res);
      } 
      else {
        // if the question not been recorded, add it to the db before moving on
        if (!q) Question.create({"question": req.question}).then( function () {next(); } );
        else next();
      }
    });
});

app.get('/ask',function (req,res,next){
  var url = "http://api.wolframalpha.com/v2/query?appid=2RJAHW-R93UGR5HW4&format=plaintext&input="+req.question;
  request.get(url, function(err, response, body) {
    parseWolfram(body, function (answer) {
      if (answer) {
        var transcript = textToSpeech.synthesize({"text": answer, "voice": req.query.voice});
        transcript.on('error', function (error) {
          res.status(500).send(error);
        });
        transcript.pipe(res); 
      }
      else {
        next();
      }
    }); // parse wolfram

  }); // request.get

}); // app.get

app.get('/ask',function(req,res){
  var answer = "I heard you ask "+req.question+". I don't know the answer to that question."; 
  var transcript = textToSpeech.synthesize({"text": answer, "voice": req.query.voice});
  transcript.on('error', function (error) {
    res.status(500).send(error);
  });
  transcript.pipe(res); 
});

// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}

