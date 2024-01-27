// logger.js
// Import the winston library, which is used for logging
const winston = require('winston');

// Create a new winston logger
const logger = winston.createLogger({
  // Set the default level of logs to 'info'
  level: 'info',

  // Use the JSON format for outputting logs
  format: winston.format.json(),

  // Add a default meta data to all logs. In this case, the service is 'user-service'
  defaultMeta: { service: 'user-service' },

  // Define the transports for the logger. Transports are essentially storage devices for your logs.
  // Here, we define two file transports: one for error logs and one for all logs (combined).
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),

    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production, also log to the `console` with the format `simple`
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Export the logger so it can be used in other parts of the application
module.exports = logger;