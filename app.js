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

var express    = require('express'),
  app          = express(),
  errorhandler = require('errorhandler'),
  bluemix      = require('./config/bluemix'),
  watson       = require('watson-developer-cloud'),
  extend       = require('util')._extend;

var http = require('http');
var zlib = require('zlib');
var JSONStream = require('JSONStream');
var stream = require('stream');
var Transform = stream.Transform;
var concatStream = require('concat-stream');
var request = require('request');
var parseString = require('xml2js').parseString;

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

// Setup static public directory
app.use(express.static('./public'));

// Get token from Watson using your credentials
app.get('/token', function(req, res) {
  authorization.getToken({url: credentials.url}, function(err, token) {
    if (err) {
      console.log('error:', err);
      res.status(err.code);
    }

    res.send(token);
  });
});

app.get('/wolfram',function(req,res){
  var url = "http://api.wolframalpha.com/v2/query?appid=2RJAHW-R93UGR5HW4&format=plaintext&input="+req.query.question;
  
  request.get(url,function(err, response, body) {
    
    parseString(body, function (err, result) {
      var answer;

      result.queryresult.pod.forEach(function (p){
        if (p["$"].title==="Definition") {
          answer = p.subpod[0].plaintext[0].split("|")[1];
          
          var transcript = textToSpeech.synthesize({"text": answer, "voice": req.query.voice});
          transcript.on('response', function(response) {
            if (req.query.download) {
              response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
            }
          });
          transcript.on('error', function(error) {
            console.log('Synthesize error: ', error);
          });
          transcript.pipe(res);
        }

        else {
          console.log(p["$"].title,"was not Definition");
        }

      });

    });

  });

});

app.get('/stackexchange',function(req,res){
  var url = 'http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&intitle='+req.query.question;
  var unzip = zlib.createGunzip();
  var JSONParse = JSONStream.parse("*"); 
  var JSONStringify = JSONStream.stringify();
  var filterForAnswers = new Transform();
  filterForAnswers._transform = function (chunk, encoding, next) {
    console.log(chunk.toString());
    if (chunk.is_answered) this.push(chunk.toString());
    next();
  };

  console.log(url);
  
  request.get(url,function(err, response){
    console.log('hi');
    //response.pipe(unzip).pipe(JSONParse).pipe(filterForAnswers).pipe(JSONStringify).pipe(res);
    console.log(response.body);
    res.send(response.body);
  });

});

app.get('/synthesize', function(req, res) {
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', function(response) {
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.on('error', function(error) {
    console.log('Synthesize error: ', error)
  });
  transcript.pipe(res);
});


// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);

console.log('listening at:', port);




