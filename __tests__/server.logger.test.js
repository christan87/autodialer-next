// Import the necessary modules
const request = require('supertest'); // Used for making HTTP requests in testing
const { app } = require('../server/app'); // The Express application to test
const fs = require('fs'); // Node.js file system module for reading and deleting log files
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions

// Define a test suite for the logger
describe('Logger', () => {
  // After all tests have run, delete the log files
  afterAll(() => {
    fs.unlinkSync('error.log');
    fs.unlinkSync('combined.log');
  });

  // Test that an info message is logged when a GET request is made to /api/data
  it('should log a message when a GET request is made to /api/data', async () => {
    // Make a GET request to /api/data
    await request(app).get('/api/data');

    // Read the combined.log file
    const log = fs.readFileSync('combined.log', 'utf8');

    // Check that the log contains the expected message
    expect(log).toContain('Responded to GET /api/data');
  });

  // Test that an error is logged when the MongoDB connection fails
  it('should log an error when MongoDB connection fails', async () => {
    // Temporarily replace mongoose.connect with a function that always rejects
    const originalConnect = mongoose.connect;
    mongoose.connect = () => Promise.reject(new Error('Test error'));

    // Make a GET request to /api/data
    await request(app).get('/api/data');

    // Read the error.log file
    const log = fs.readFileSync('error.log', 'utf8');

    // Check that the log contains the expected error message
    expect(log).toContain('Could not connect to MongoDB');

    // Restore the original mongoose.connect function
    mongoose.connect = originalConnect;
  });
});