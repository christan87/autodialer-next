// Export a configuration object for Jest, a JavaScript testing framework
module.exports = {
  // An array of RegExp patterns that Jest should ignore when searching for tests
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

  // Uncomment the following line if you want to use the 'jsdom' test environment
  // 'jsdom' simulates a DOM environment for tests to run in
  // testEnvironment: 'jsdom',

  // An array of paths to modules that run some code to configure or set up the testing framework before each test
  // In this case, '<rootDir>/setupTests.js' is run before each test
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],

  // A map from regular expressions to paths to transformers
  // A transformer is a module that provides a synchronous function for transforming source files
  // In this case, any file that matches the regular expression '^.+\\.(js|jsx|ts|tsx)$' is transformed using 'babel-jest'
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // In this case, any file that matches the regular expression '\\.(css|less|scss|sass)$' is stubbed out with 'identity-obj-proxy'
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
};