// db.test.js
const mongoose = require('mongoose');

// Mock the mongoose module using Jest's jest.mock function
// This replaces the mongoose.connect function with a mock function that returns a resolved promise
jest.mock('mongoose', () => ({
  connect: jest.fn().mockReturnValue(Promise.resolve()),
}));

// Define a test using Jest's test function
test('connects to MongoDB', async () => {
  // Import the server/app module, which should call mongoose.connect
  // Because mongoose.connect has been mocked, this won't actually establish a MongoDB connection
  await require('../server/app');

  // Check if mongoose.connect has been called with the correct arguments
  // The expect function is used to check if the actual value matches the expected value
  // In this case, it checks if mongoose.connect has been called with 
  // process.env.DB_CONNECTION_STRING as the first argument and any object as the second argument
  expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_CONNECTION_STRING, expect.any(Object));
});