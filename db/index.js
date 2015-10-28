'use strict';
var Promise = require('bluebird');
var path = require('path');
var chalk = require('chalk');

var prodURI;
if (process.env.VCAP_SERVICES) {
	prodURI = JSON.parse(process.env.VCAP_SERVICES).mongolab[0].credentials.uri;
}

var DATABASE_URI = prodURI || "mongodb://localhost:27017/interfeud";

var mongoose = require('mongoose');
var db = mongoose.connect(DATABASE_URI).connection;

// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./models');

var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(function () {
    console.log(chalk.green('MongoDB connection opened!'));
});

module.exports = startDbPromise;
