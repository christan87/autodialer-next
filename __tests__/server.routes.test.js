// server.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose'); // Import mongoose
const { app, db } = require('../server/app'); // Import the mongoose connection and app

// Before all tests...
beforeAll(async () => {
    // Wait for the MongoDB connection to be established before running the tests
    await db;
  });

// After all tests...
afterAll(async () => {
    // Close the mongoose connection after the tests run
    // This is necessary to avoid Jest open handle error
    // mongoose.connection.close() must be awaited, Jest doesn't wait for the connection to close before it finishes.
    await mongoose.connection.close();  
});

// Define a test for the GET /api/data route
test('GET /api/data', async () => {
  // Send a GET request to the /api/data route using supertest
  const response = await request(app).get('/api/data');

  // Check if the response status code is 200
  expect(response.statusCode).toBe(200);

  // Check if the response body is as expected
  expect(response.body).toEqual({ message: 'Hello from the server!' });
});