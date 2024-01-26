import { useSession, signIn } from 'next-auth/react'

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession()
    const loading = status === 'loading'
    if (loading) {
      return <div>Loading...</div>
    }

    if (!session) {
      signIn() // Redirects to the login page
      return <div>You are being redirected...</div>
    }

    // If the user is authenticated, render the passed in component
    return <Component {...props} />
  }
}