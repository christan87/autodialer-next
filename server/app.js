// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

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

// Connect to MongoDB using the connection string and save connection as db to be exported so it can be closed from outside
const db = mongoose.connect(`${mongoConnectionString}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB', db.connect)) // Log a message on successful connection
  .catch(err => console.error('Could not connect to MongoDB...', err, db.connect)); // Log an error message on connection failure

// Listen for a 'connection' event on the socket.io instance
io.on('connection', (socket) => {
  console.log('a user connected'); // Log a message when a user connects

  // Listen for a 'disconnect' event on the socket
  socket.on('disconnect', () => {
    console.log('user disconnected'); // Log a message when a user disconnects
  });
});

// Define a route handler for GET requests to '/api/data'
app.get('/api/data', (req, res) => {
  // Access your database here
  // Send a response
  res.json({ message: 'Hello from the server!' }); // Send a JSON response with a message
});

// Define a route handler for GET requests to 'csrf-token'
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Export the Express application
module.exports = { app, db };