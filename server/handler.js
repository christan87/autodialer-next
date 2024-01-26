// Import the 'serverless-http' module. This module allows you to wrap your 
// Express application in a function that can be used by AWS Lambda.
const serverless = require('serverless-http');

// Import your Express application from the 'app.js' file.
const {app} = require('./app');

// Export a new function that wraps your Express application. This function 
// can be used as a handler for AWS Lambda. When AWS Lambda invokes this 
// handler, it will run your Express application.
module.exports.server = serverless(app);