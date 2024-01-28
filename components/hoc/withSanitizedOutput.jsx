// Import React and the DOMPurify library
import React from 'react';
import DOMPurify from 'dompurify';

// Define a HOC called withSanitizedOutput
function withSanitizedOutput(WrappedComponent) {
  // Return a new component
  const WithSanitizedOutput = function(props) {
    // Create a new object to hold the sanitized props
    const sanitizedProps = {};

    // Loop over the props and sanitize each one
    for (const key in props) {
      // If the prop is a string, sanitize it
      if (typeof props[key] === 'string') {
        sanitizedProps[key] = DOMPurify.sanitize(props[key]);
      } else {
        // If the prop is not a string, just copy it over
        sanitizedProps[key] = props[key];
      }
    }

    // Render the wrapped component with the sanitized props
    return <WrappedComponent {...sanitizedProps} />;
  };

  WithSanitizedOutput.displayName = `WithSanitizedOutput(${getDisplayName(WrappedComponent)})`;

  return WithSanitizedOutput;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Export the withSanitizedOutput HOC
export default withSanitizedOutput;