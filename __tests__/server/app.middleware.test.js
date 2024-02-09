// Import necessary modules
const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Initialize an Express application
const app = express();

// Define a rate limiter middleware using the express-rate-limit library
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // The time window for which the rate limit applies. Here, it's set to 15 minutes.
    max: 100, // The maximum number of requests that a client can make in the defined time window. Here, it's set to 100 requests per 15 minutes.
    message: 'Too many requests, please try again later.' // The message to send back to the client when they hit the rate limit.
});

// Apply the CORS middleware to the Express application
/* 
This enables Cross-Origin Resource Sharing (CORS) for all routes in the application. 
CORS is a mechanism that allows many resources (e.g., fonts, JavaScript, etc.) on a web page to be requested from another domain outside the domain from which the resource originated.
*/
app.use(cors()); 


// Apply the rate limiter middleware to routes that start with '/api/'
/* 
This applies the rate limiter to all routes that start with '/api/'. 
The rate limiter middleware (apiLimiter) was defined earlier and it limits each client to a certain number of requests in a specified time window.
*/
app.use('/api/', apiLimiter); 

// Define a group of tests
describe('Middleware', () => {
    // Define a test for rate limiting
    test('Rate limiting', async () => {
        // Set the limit to the maximum number of requests allowed within the rate limit window
        const limit = 100; // The rate limit is set to 100 requests per 15 minutes

        let response; // Variable to hold the response from the server

        // Make more requests than the rate limit allows
        for (let i = 0; i < limit + 1; i++) {
            // Make a GET request to the '/api/someRoute' endpoint of the app
            // The response from each request is stored in the 'response' variable
            response = await request(app).get('/api/someRoute');
        }

        // After making more requests than the rate limit allows, the last request should be rejected
        // The server should respond with a status code of 429, indicating that the client has sent too many requests in a given amount of time
        expect(response.statusCode).toBe(429);
    });

    // Define a test for CORS headers
    test('CORS headers', async () => {
        // Make a GET request to the '/api/someRoute' endpoint of the app
        const response = await request(app).get('/api/someRoute');

        // Check that the Access-Control-Allow-Origin header is present in the response
        // This header is a part of CORS (Cross-Origin Resource Sharing) and allows the client to process the response if the client is running on a different origin
        expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
});