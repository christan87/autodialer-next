// Import the dotenv module, which loads environment variables from a .env file into process.env
const dotenv = require("dotenv");

// Initialize an empty configuration object
const cfg = {};

// If the application is not running in the test environment, load the .env file
if (process.env.NODE_ENV !== "test") {
  dotenv.config({ path: ".env" });
} else {
  // If the application is running in the test environment, load the .env.example file
  // The silent option suppresses warnings if the file is missing
  dotenv.config({ path: ".env.example", silent: true });
}

// Set the HTTP port for the web application
// Use the PORT environment variable if it is defined, otherwise use 3000
cfg.port = process.env.PORT || 3000;

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
//
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.


// Set the Twilio account SID, TwiML application SID, caller ID, API key, and API secret from environment variables
// These values are used to authenticate with the Twilio API
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;

cfg.twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
cfg.callerId = process.env.TWILIO_CALLER_ID;

cfg.apiKey = process.env.TWILIO_API_KEY;
cfg.apiSecret = process.env.TWILIO_API_SECRET;

// Export the configuration object
// This object can be imported in other modules to access the configuration values
module.exports = cfg;
