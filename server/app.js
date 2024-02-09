// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const logger = require('../lib/logger'); // Import the logger

const app = express();
const mongoConnectionString = process.env.DB_CONNECTION_STRING;

// Import routers
const twillioRoutes = require('./api/routers/twillioRoutes');

// This line of code is initializing CSRF (Cross-Site Request Forgery) protection middleware. 
const csrfProtection = csurf({ cookie: true });

// Define a rate limiter middleware using the express-rate-limit library
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // The time window for which the rate limit applies. Here, it's set to 15 minutes.
  max: 100, // The maximum number of requests that a client can make in the defined time window. Here, it's set to 100 requests per 15 minutes.
  message: 'Too many requests, please try again later.' // The message to send back to the client when they hit the rate limit.
});

// Apply the CORS middleware to the Express application
/* 
This enables Cross-Origin Resource Sharing (CORS) for all routes in the application. 
CORS is a mechanism that allows many resources (e.g., fonts, JavaScript, etc.) on a web page to be requested from another domain outside the domain from which the resource originated.
*/
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser());

// Enable CSRF protection for all routes except Twilio's
app.use((req, res, next) => {
  if (req.path.startsWith('/twillio')) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

// Apply the rate limiter middleware to routes that start with '/api/'
/* 
This applies the rate limiter to all routes that start with '/api/'. 
The rate limiter middleware (apiLimiter) was defined earlier and it limits each client to a certain number of requests in a specified time window.
*/
app.use('/api/', apiLimiter);


// Use your routers
app.use('/twillio', twillioRoutes);

// Connect to MongoDB using the connection string and save connection as db to be exported so it can be closed from outside
mongoose.connect(`${mongoConnectionString}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB')) // Log a message on successful connection
  .catch(err => logger.error('Could not connect to MongoDB...', { error: err })); // Log an error message on connection failure

app.get('/', (req, res) => {
  console.log('=====================>Received request at /');
  // Rest of your route handler code...
});

// Define a route handler for GET requests to '/api/data'
app.get('/api/data', (req, res) => {
  // Access your database here
  // Send a response
  res.json({ message: 'Hello from the server!' }); // Send a JSON response with a message
  logger.info('Responded to GET /api/data'); // Log that a response was sent
});

// Define a route handler for GET requests to 'csrf-token'
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
  logger.info('Responded to GET /csrf-token'); // Log that a response was sent
});

// Export the Express application
module.exports = { app };