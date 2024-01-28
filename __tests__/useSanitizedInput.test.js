/**
 * @jest-environment jsdom
 */

// Import necessary libraries
import React from 'react';
// Import the necessary functions from the testing-library/react package
const { render, fireEvent, waitFor } = require('@testing-library/react');


// Import the custom hook that we want to test
import useSanitizedInput from '../hooks/useSanitizedInput';

// Define a test component that uses the custom hook
// This component is a simple input field that uses the useSanitizedInput hook for its value and onChange handler
function TestComponent() {
  const [value, setValue] = useSanitizedInput('');

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

// Define a test for the useSanitizedInput hook
test('useSanitizedInput sanitizes input', async () => {
  // Render the test component
  const { getByRole } = render(<TestComponent />);

  // Get the input element from the rendered component
  const input = getByRole('textbox');

  // Simulate a change event on the input element, setting its value to a potentially harmful string
  fireEvent.change(input, { target: { value: '<img src=x onerror=alert(1)>' } });

  // Wait for the value of the input to change
  // Wait for the value of the input to change
  await waitFor(() => {
    // Check that the input's value has been sanitized by the useSanitizedInput hook
    // In this case, the harmful script should be removed, resulting in a safe string
    expect(input.value).toBe('<img src="x">');
  });
});