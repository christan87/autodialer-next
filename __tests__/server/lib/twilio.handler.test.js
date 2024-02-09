
// Import the dotenv module, which loads environment variables from a .env file into process.env
const dotenv = require("dotenv");

// Call dotenv.config() to load the environment variables from the .env file.
dotenv.config(); 

// Import the tokenGenerator and voiceResponse functions from the twillioHandler module.
const { tokenGenerator, voiceResponse } = require('../../../server/lib/twillioHandler');

// Import the 'generateName' function from the 'name_generator' module located in '../server/lib/' directory.
const { generateName, ADJECTIVES, FIRST_NAMES, LAST_NAMES } = require('../../../server/lib/name_generator');

// Import the config object from the twillioConstants module.
const config = require('../../../server/lib/twillioConstants');

// Use describe() to group related tests together.
describe('Twillio Handler', () => {
  // Test that the tokenGenerator function returns an object with identity and token properties.
  test('tokenGenerator should return an object with identity and token', () => {
    // Call the 'tokenGenerator' function and store the result.
    const result = tokenGenerator();
    
    // Check that the result has an 'identity' property. This is done using Jest's 'expect' function
    // and the 'toHaveProperty' matcher. If 'result' does not have an 'identity' property, the test will fail.
    expect(result).toHaveProperty('identity');

    // Check that the result has a 'token' property. If 'result' does not have a 'token' property, the test will fail.
    expect(result).toHaveProperty('token');
  });

  // Test that the voiceResponse function returns a string.
  test('voiceResponse should return TwiML instructions as a string', () => {
    // Create a request body string with a 'To' property set to the caller ID from the config object.
    // The 'encodeURIComponent' function is used to ensure that the caller ID is properly encoded for use in a URL.
    const requestBody = 'To=' + encodeURIComponent(config.callerId);

    // Call the 'voiceResponse' function with the request body and store the result.
    const result = voiceResponse(requestBody);

    // Check that the result is a string. This is done using Jest's 'expect' function and the 'toBe' matcher.
    // If 'result' is not a string, the test will fail.
    expect(typeof result).toBe('string');
  });

  // Use describe() to group related tests together.
  describe('Client Name Generator', () => {
    // Define a test for the 'generateName' function.
    test('generateName should return a string', () => {
      // Call the 'generateName' function and store the result.
      const result = generateName();

      // Check that the result is a string. This is done using Jest's 'expect' function and the 'toBe' matcher.
      // If 'result' is not a string, the test will fail.
      expect(typeof result).toBe('string');
    });
    
    test('generateName should return a string containing an adjective, a first name, and a last name', () => {
      // Call the 'generateName' function and store the result.
      const result = generateName();

      // Split the result into three parts using a regular expression. The regular expression matches three groups of characters,
      // each starting with an uppercase letter followed by zero or more lowercase letters. This is intended to split the result
      // into an adjective, a first name, and a last name.
      const parts = result.match(/([A-Z][a-z]*)([A-Z][a-z]*)([A-Z][a-z]*)/);

      // Check that the result has three parts. The 'toHaveLength' matcher is used to check the length of the 'parts' array.
      // Note that the 'match' method returns an array where the first element is the entire match, and the remaining elements
      // are the matched groups. Therefore, we expect the length of the 'parts' array to be 4.
      expect(parts).toHaveLength(4);

      // Check that each part is in the correct array. The 'toContain' matcher is used to check that an array contains a specific element.
      // Here, it's used to check that the 'ADJECTIVES' array contains the first part, the 'FIRST_NAMES' array contains the second part,
      // and the 'LAST_NAMES' array contains the third part.
      expect(ADJECTIVES).toContain(parts[1]);
      expect(FIRST_NAMES).toContain(parts[2]);
      expect(LAST_NAMES).toContain(parts[3]);
    });
  });
});



