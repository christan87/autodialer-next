// Import the Router function from the express module.
const Router = require("express").Router;

// Import the tokenGenerator and voiceResponse functions from the twillioHandler module.
const { tokenGenerator, voiceResponse } = require("../../lib/twillioHandler");

// Create a new router.
const router = new Router();

// Define a GET route at the path "/token".
// When a GET request is made to this path, the tokenGenerator function is called and a twilio api token will be sent as the response.
router.get("/token", (req, res) => {
  res.send(tokenGenerator());
});

// Define a POST route at the path "/voice".
// This route is hit when the Twilio API makes a POST request to your server after a voice call is initiated.
// The request (req) object contains information about the HTTP request that triggered the route.
router.post("/voice", (req, res) => {    
  // Set the "Content-Type" header of the response to "text/xml".
  // This is necessary because the response will be in TwiML (Twilio Markup Language), which is a set of XML instructions.
  res.set("Content-Type", "text/xml");

  // Call the voiceResponse function with the request body as the argument.
  // The request body contains parameters that provide information about the call, such as the phone number of the caller and the called.
  // The voiceResponse function is responsible for generating the TwiML instructions that tell Twilio how to handle the call.
  // The return value of the voiceResponse function (the TwiML instructions) is sent as the response to the Twilio API.
  res.send(voiceResponse(req.body));
});

// Export the router.
module.exports = router;