// Import the necessary functions from the testing-library/react package
const { render, fireEvent } = require('@testing-library/react');

// Import the custom hook that we want to test
const useSanitizedInput = require('../hooks/useSanitizedInput');

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
test('useSanitizedInput sanitizes input', () => {
  // Render the test component
  const { getByRole } = render(<TestComponent />);

  // Get the input element from the rendered component
  const input = getByRole('textbox');

  // Simulate a change event on the input element, setting its value to a potentially harmful string
  fireEvent.change(input, { target: { value: '<img src=x onerror=alert(1)>' } });

  // Check that the input's value has been sanitized by the useSanitizedInput hook
  // In this case, the harmful string should be removed, resulting in an empty string
  expect(input.value).toBe('');
});