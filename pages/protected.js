import React from "react";
import withAuth from '../components/hoc/withAuth';
import { useSession } from 'next-auth/react' 
const io = require('socket.io-client');

function ProtectedPage() {
  // Inside your component
const { data: session, loading } = useSession()
const socket = io('http://localhost:4000/dev', { path: '/dev', query: { token: session.access_token } });
  return (
    <div>
      This is protected content. You can access this content because you are signed in.
    </div>
  )
}

export default withAuth(ProtectedPage)