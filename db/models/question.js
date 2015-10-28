'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	question: {type: String},
	answer: {type: String}
});

mongoose.model('Question', schema);
