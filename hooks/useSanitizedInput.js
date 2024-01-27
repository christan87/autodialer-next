// Import the useState and useEffect hooks from React
import { useState, useEffect } from 'react';

// Import the DOMPurify library
import DOMPurify from 'dompurify';

// Define a custom hook called useSanitizedInput
function useSanitizedInput(initialValue) {
  // Declare a state variable called value, initialized with initialValue
  // setValue is the function we'll use to update the state
  const [value, setValue] = useState(initialValue);

  // useEffect is a hook that runs side-effects in your component
  // In this case, it's used to sanitize the value state variable whenever it changes
  useEffect(() => {
    // DOMPurify.sanitize removes any potentially harmful HTML from value
    // The sanitized value is then stored back into the state
    setValue(DOMPurify.sanitize(value));
  }, [value]); // The effect depends on value, so it runs whenever value changes

  // The hook returns the current value and the function to update it
  // This is similar to the useState hook
  return [value, setValue];
}

// Export the useSanitizedInput hook as the default export of this module
export default useSanitizedInput;