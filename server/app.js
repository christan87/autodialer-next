const express = require('express');
const app = express();

// Define your custom routes here
app.get('/api/data', (req, res) => {
  // Access your database here
  // Send a response
  res.json({ message: 'Hello from the server!' });
});

module.exports = app;