// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const logger = require('../lib/logger'); // Import the logger

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const mongoConnectionString = process.env.DB_CONNECTION_STRING;


// Define rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Use cookie-parser middleware
app.use(cookieParser());

// Use csurf middleware
app.use(csurf({ cookie: true }));

// Apply rate limiting to /api/ routes
app.use('/api/', apiLimiter);

// Use cors middleware
app.use(cors());

// Connect to MongoDB using the connection string and save connection as db to be exported so it can be closed from outside
mongoose.connect(`${mongoConnectionString}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB')) // Log a message on successful connection
  .catch(err => logger.error('Could not connect to MongoDB...', { error: err })); // Log an error message on connection failure

// Listen for a 'connection' event on the socket.io instance
io.on('connection', (socket) => {
  logger.info('A user connected'); // Log a message when a user connects

  // Listen for a 'disconnect' event on the socket
  socket.on('disconnect', () => {
  logger.info('User disconnected'); // Log a message when a user disconnects
  });
});

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
  console.log('=====================>Received request at /csrf-token');
  res.json({ csrfToken: req.csrfToken() });
  logger.info('Responded to GET /csrf-token'); // Log that a response was sent
});

// Export the Express application
module.exports = { app };