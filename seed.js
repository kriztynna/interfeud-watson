var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./db');
var Question = Promise.promisifyAll(mongoose.model('Question'));

var seedQuestions = function() {
  var qs = [{
    question: 'What is partial application',
    answer: 'Partial application is when a function takes a number of arguments and returns a function that takes fewer arguments because some have already been applied.'
  }, {
    question: 'Partial application',
    answer: 'Partial application is when a function takes a number of arguments and returns a function that takes fewer arguments because some have already been applied.'
  }, {
    question: 'Is partial application',
    answer: 'Partial application is when a function takes a number of arguments and returns a function that takes fewer arguments because some have already been applied.'
  }, {
    question: 'What is arguments inside of a function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'What is argument inside of a function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'Argument inside of a function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'What is arguments inside of the function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'What is argument inside of the function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'Argument inside of a function',
    answer: 'An Array-like object containing all the arguments that were passed to it upon invocation.'
  }, {
    question: 'What is closure', 
    answer: 'Closures are functions that refer to independent variables. In other words, the function defined in the closure remembers the environment in which it was created.'
  }, {
    question: 'What is closer', 
    answer: 'Closures are functions that refer to independent variables. In other words, the function defined in the closure remembers the environment in which it was created.'
  }, {
    question: "What is scope", 
    answer: "In JavaScript, scope is the current context of execution. The context in which values and expressions are visible or can be referenced. If a variable or other expression is not in the current scope, then it is unavailable for use."
  }, {
    question: "Scope", 
    answer: "In JavaScript, scope is the current context of execution. The context in which values and expressions are visible or can be referenced. If a variable or other expression is not in the current scope, then it is unavailable for use."
  }, {
    question: "Is scope", 
    answer: "In JavaScript, scope is the current context of execution. The context in which values and expressions are visible or can be referenced. If a variable or other expression is not in the current scope, then it is unavailable for use."
  }, {
    question: "What is arity", 
    answer: "The number of arguments that a function can take."
  }, {
    question: "Is arity", 
    answer: "The number of arguments that a function can take."
  }, {
    question: "Arity", 
    answer: "The number of arguments that a function can take."
  }, {
    question: "How can you determine the arity of a function", 
    answer: "One way to determine the arity of a function is to use the dot length method on that function."
  }, {
    question: 'What is currying',
    answer: 'Currying is when a function returns another function with partial application.'
  }];

  return Question.createAsync(qs);
};

function seedDb () {
	connectToDb.then(function() {
	    Question.remove({})
	    .then(function(){return seedQuestions();})
	    .then(function(qs) {
	      console.log(chalk.green('Seeding was successful!'));
	      process.kill(0);
	    })
	    .catch(function(err) {
	        console.error(err);
	        process.kill(0);
	    });
	});
}

module.exports = seedDb;