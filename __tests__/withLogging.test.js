// __tests__/withLogging.test.js
const withLogging = require('../components/hoc/withLogging'); // Import the function to be tested
const logger = require('../lib/logger'); // Import the logger module

// Mock the logger module
jest.mock('../lib/logger', () => ({
  info: jest.fn(), // Mock the info method
}));

// Define a test suite for the withLogging function
describe('withLogging', () => {
  // Test that withLogging logs the page being rendered and calls the original getServerSideProps function
  it('logs the page being rendered and calls the original getServerSideProps function', async () => {
    // Mock a getServerSideProps function
    const getServerSidePropsFunc = jest.fn().mockResolvedValue({ foo: 'bar' });
    // Define a context object to pass to the function
    const context = { resolvedUrl: '/test' };

    // Call withLogging with the mock function
    const getServerSideProps = withLogging(getServerSidePropsFunc);
    // Call the resulting function with the context
    const result = await getServerSideProps(context);

    // Check that the logger.info method was called with the correct argument
    expect(logger.info).toHaveBeenCalledWith('Rendering page: /test');
    // Check that the mock getServerSideProps function was called with the correct argument
    expect(getServerSidePropsFunc).toHaveBeenCalledWith(context);
    // Check that the resulting function returned the correct value
    expect(result).toEqual({ props: { foo: 'bar' } });
  });

  // Test that withLogging works without an original getServerSideProps function
  it('works without an original getServerSideProps function', async () => {
    // Define a context object to pass to the function
    const context = { resolvedUrl: '/test' };

    // Call withLogging without a function
    const getServerSideProps = withLogging();
    // Call the resulting function with the context
    const result = await getServerSideProps(context);

    // Check that the logger.info method was called with the correct argument
    expect(logger.info).toHaveBeenCalledWith('Rendering page: /test');
    // Check that the resulting function returned the correct value
    expect(result).toEqual({ props: {} });
  });
});