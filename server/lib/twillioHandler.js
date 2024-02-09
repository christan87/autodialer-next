// Import necessary modules and configuration
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const { generateName } = require("./name_generator");
const config = require("./twillioConstants");

var identity;

// The tokenGenerator function generates a new JWT access token for Twilio.
exports.tokenGenerator = function tokenGenerator() {
  // Generate a new identity for the client using the generateName function.
  identity = generateName();
  // Create a new access token using your Twilio account SID, API key, and API secret.
  const accessToken = new AccessToken(
    config.accountSid,
    config.apiKey,
    config.apiSecret
  );

  // Set the identity of the access token.
  accessToken.identity = identity;

  // Create a new VoiceGrant which allows making and receiving calls.
  const grant = new VoiceGrant({
    outgoingApplicationSid: config.twimlAppSid,
    incomingAllow: true,
  });

  // Add the VoiceGrant to the access token.
  accessToken.addGrant(grant);

  // Return the identity and the JWT access token in a JSON response.
  // This token will be used when setting up a "Device" from the "@twilio/voice-sdk" package.
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
};

// The voiceResponse function generates TwiML instructions for an incoming call.
exports.voiceResponse = function voiceResponse(requestBody) {
  const querystring = require('querystring');
  let body = querystring.parse(requestBody.toString());
  const toNumberOrClientName = body.To;
  const callerId = config.callerId;
  let twiml = new VoiceResponse();

  
  // If the request to the /voice endpoint is TO your Twilio Number, 
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    let dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client 
    dial.client(identity);

  } else if (body.To) {
    // This is an outgoing call

    // set the callerId
    let dial = twiml.dial({ callerId });

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun 
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }

  // Return the TwiML instructions as a string.
  // These instructions will be used by the Twilio API when a voice call is initiated.
  return twiml.toString();
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  // This function checks if the given value is a valid phone number by testing it against a regular expression.
  return /^[\d\+\-\(\) ]+$/.test(number);
}
