//  env.test.js
// This test checks if environment variables are loaded correctly.
test('loads environment variables', () => {
  // Set a test environment variable
  process.env.TEST_VAR = 'test';

  // Load environment variables from a .env file into process.env
  // This is done using the dotenv package
  require('dotenv').config();

  // Check if the TEST_VAR environment variable has been set correctly
  // The expect function is used to check if the actual value matches the expected value
  // In this case, it checks if process.env.TEST_VAR equals 'test'
  expect(process.env.TEST_VAR).toEqual('test');
});