// Import the React library
import React from 'react';
import Head from 'next/head';

/**
 * Layout component that wraps around the main content of the page.
 *
 * This component is a Higher Order Component (HOC) that takes in children components
 * and wraps them with a common layout structure. This is useful for applying consistent
 * layout/styling across various pages in the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the layout.
 *
 * @returns {React.Element} The rendered layout component with the child components.
 */
const Layout = ({ children }) => {
    return(
        <div className='layout'>
            <Head>
                <title>James App</title>
            </Head>
            {children}
        </div>
    )
};

// Export the Layout component as the default export
export default Layout;