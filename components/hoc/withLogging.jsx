// utils/withLogging.js
const logger = require('../../lib/logger'); // require the logger module

// Define a higher-order function that takes another function as an argument
function withLogging(getServerSidePropsFunc) {
  // Return a new function that takes the context object as an argument
  return async (context) => {
    // Log the URL of the page being rendered
    logger.info(`Rendering page: ${context.resolvedUrl}`);

    // Initialize an empty props object
    let props = {};

    // If a getServerSideProps function was provided, call it with the context
    // and await the result
    if (getServerSidePropsFunc) {
      props = await getServerSidePropsFunc(context);
    }

    // Return the props object wrapped in an object, as required by getServerSideProps
    return { props };
  };
}
module.exports = withLogging;