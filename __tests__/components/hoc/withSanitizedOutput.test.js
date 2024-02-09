/**
 * @jest-environment jsdom
 */

// Import necessary libraries
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line
import withSanitizedOutput from '../../../components/hoc/withSanitizedOutput';

// Create a mock component to wrap
const MockComponent = ({ output }) => <div>{output}</div>;

// Wrap the mock component with the HOC
const WrappedComponent = withSanitizedOutput(MockComponent);

test('sanitizes output', () => {
  // Render the wrapped component with a script as a prop
  const { getByText } = render(<WrappedComponent output="<script>alert('XSS')</script>Hello" />);

  // Check that the script has been removed from the output
  expect(getByText('Hello')).toBeInTheDocument();
});