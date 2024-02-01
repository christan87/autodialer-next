import React from "react";
import withAuth from '../components/hoc/withAuth';
import { useSession } from 'next-auth/react' 

function ProtectedPage() {
  // Inside your component
const { data: session, loading } = useSession()

  return (
    <div>
      This is protected content. You can access this content because you are signed in.
    </div>
  )
}

export default withAuth(ProtectedPage)