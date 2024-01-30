// Import necessary modules
import React from "react"; // React library, used for building the user interface
import { useSession, signIn } from 'next-auth/react' // Functions from NextAuth for session handling and signing in

// Define a higher-order component (HOC) named withAuth
export default function withAuth(Component) {
  // This function returns another function that wraps the passed in Component
  return function AuthenticatedComponent(props) {
    // useSession is a hook provided by NextAuth that allows you to access session data
    // It returns an object with 'data' and 'status' properties
    const { data: session, status } = useSession()
    // Check if the session is loading
    const loading = status === 'loading'
    // If the session is loading, render a loading message
    if (loading) {
      return <div>Loading...</div>
    }

    // If there is no session (i.e., the user is not authenticated), sign the user in
    // signIn is a function provided by NextAuth that redirects the user to the login page
    if (!session) {
      signIn() // Redirects to the login page
      // Render a message indicating that the user is being redirected
      return <div>You are being redirected...</div>
    }

    // If the user is authenticated, render the passed in component with its props
    return <Component {...props} />
  }
}