/**
 * This module contains Jest tests for the Twilio routes in an Express app.
 * The `supertest` library is used to make HTTP requests to the app.
 * The `twillioHandler` module is mocked to isolate the routes being tested.
 */

// Import the necessary modules
const request = require('supertest');
const express = require('express');
const twillioRoutes = require('../../../../server/api/routers/twillioRoutes');
const { tokenGenerator, voiceResponse } = require("../../../../server/lib/twillioHandler");

// Mock the twillioHandler module
jest.mock("../../../../server/lib/twillioHandler");

// Create an instance of an Express app
const app = express();
app.use(express.json());
app.use('/', twillioRoutes);

/**
 * This test suite contains tests for the Twilio routes.
 */
describe('Twillio Routes', () => {
  /**
   * This test checks the GET /token route.
   * It mocks the `tokenGenerator` function to return a test token,
   * and then checks that the route returns this token.
   */
  test('GET /token', async () => {
    const token = 'test_token';
    tokenGenerator.mockReturnValue(token);

    const response = await request(app).get('/token');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(token);
  });

  /**
   * This test checks the POST /voice route.
   * It mocks the `voiceResponse` function to return a test TwiML response,
   * and then checks that the route returns this response with the correct content type.
   * It also checks that `voiceResponse` was called with the correct parameters.
   */
  test('POST /voice', async () => {
    const voiceRes = '<Response></Response>';
    voiceResponse.mockReturnValue(voiceRes);

    const response = await request(app)
      .post('/voice')
      .send({ To: '1234567890', From: '0987654321' });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(voiceRes);
    expect(response.header['content-type']).toMatch(/^text\/xml/);
    expect(voiceResponse).toHaveBeenCalledWith({ To: '1234567890', From: '0987654321' });
  });
});