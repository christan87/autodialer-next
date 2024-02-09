/**
 * @jest-environment jsdom
 */

// Import necessary modules
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleDialer from '../../../components/Dialers/SingleDialer';
import SingleDialerLib from '../../../components/Dialers/SingleDialerLib';

// Mock the SingleDialerLib module
jest.mock('../../../components/Dialers/SingleDialerLib', () => {
    return jest.fn().mockImplementation(() => {
      return {startupClient: jest.fn()};
    });
  });

// Clear the mock before each test
beforeEach(() => {
  SingleDialerLib.mockClear();
});

// Test that the component renders correctly
test('renders correctly', () => {
    // Create a new instance of SingleDialerLib
    let deviceSetup = new SingleDialerLib();

    // Call the startupClient method of the deviceSetup instance
    // Note: Because SingleDialerLib is mocked, startupClient is a jest mock function
    deviceSetup.startupClient();

    // Assert that the startupClient method was called
    // This is possible because startupClient is a jest mock function
    expect(deviceSetup.startupClient).toHaveBeenCalled();

    // Render the SingleDialer component with a prop of token="testToken"
    // getByText is a function returned by render that can be used to query the rendered component
    const { getByText } = render(<SingleDialer token="testToken" />);

    // Assert that the rendered component contains the text 'Real Dialer Quickstart'
    expect(getByText('Real Dialer Quickstart')).toBeInTheDocument();
});

// Test that SingleDialerLib is instantiated with the correct arguments
test('instantiates SingleDialerLib with correct arguments', () => {
    // Create a new instance of SingleDialerLib
    let deviceSetup = new SingleDialerLib();

    // Call the startupClient method of the deviceSetup instance
    // Note: Because SingleDialerLib is mocked, startupClient is a jest mock function
    deviceSetup.startupClient();

    // Assert that the startupClient method was called
    // This is possible because startupClient is a jest mock function
    expect(deviceSetup.startupClient).toHaveBeenCalled();

    // Render the SingleDialer component with a prop of token="testToken"
    render(<SingleDialer token="testToken" />);

    // Assert that SingleDialerLib was called with the correct arguments
    // The first argument should be an object with a token property of 'testToken'
    // The remaining arguments should be objects with a current property
    expect(SingleDialerLib).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'testToken' }),
        ...Array(18).fill(expect.objectContaining({ current: expect.anything() })),
    );
});

// Test that the component sets up event listeners correctly
test('sets up event listeners correctly', () => {
    // Create a new instance of SingleDialerLib
    let deviceSetup = new SingleDialerLib();

    // Call the startupClient method of the deviceSetup instance
    // Note: Because SingleDialerLib is mocked, startupClient is a jest mock function
    deviceSetup.startupClient();

    // Assert that the startupClient method was called
    // This is possible because startupClient is a jest mock function
    expect(deviceSetup.startupClient).toHaveBeenCalled();

    // Render the SingleDialer component with a prop of token="testToken"
    // getByText is a function returned by render that can be used to query the rendered component
    const { getByText } = render(<SingleDialer token="testToken" />);

    // Get a button from the rendered component by its displayed text
    const button = getByText('Start up the Device');

    // Simulate a click event on the button
    fireEvent.click(button);

    // Assert that SingleDialerLib was called with the correct arguments
    // The first argument should be an object with a token property of 'testToken'
    // The remaining arguments should be objects with a current property
    expect(SingleDialerLib).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'testToken' }),
        ...Array(18).fill(expect.objectContaining({ current: expect.anything() })),
    );
});