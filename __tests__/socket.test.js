// socket.test.js
const io = require('socket.io');
const http = require('http');
const clientIo = require('socket.io-client');
const app = require('../server/app');

// Declare variables for the server and client
let server;
let client;

// Before each test...
beforeEach((done) => {
  // Create a new HTTP server with the Express application
  server = http.createServer(app);

  // Attach a new Socket.IO instance to the server
  io(server);

  // Start the server
  server.listen(() => {
    // Once the server is listening, get the port number
    const port = server.address().port;

    // Connect a new Socket.IO client to the server
    client = clientIo.connect(`http://localhost:${port}`);

    // Once the client is connected, call the done function to indicate that setup is complete
    client.on('connect', done);
  });
});

// After each test...
afterEach((done) => {
  // If the client is connected, disconnect it
  if (client.connected) {
    client.disconnect();
  }
  // Close the server, then call the done function to indicate that teardown is complete
  server.close(done);
});

// Test that the server correctly handles client connection and disconnection
test('handles client connection and disconnection', (done) => {
  // When the client disconnects...
  client.on('disconnect', () => {
    // Call the done function to indicate that the test is complete
    done();
  });
  // Disconnect the client
  client.disconnect();
});