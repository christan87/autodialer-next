import React, { useEffect } from "react";
import withAuth from '../components/hoc/withAuth';
import { useSession } from 'next-auth/react' 

function ProtectedPage() {
  // Inside your component
const { data: session, loading } = useSession()
useEffect(() => {

  const wsUrl = process.env.WS_URL;
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    // console.log('WebSocket connection opened');
    console.log('WebSocket connection opened, readyState:', socket.readyState);
  };

  socket.onmessage = (event) => {
    console.log('Received message:', event.data);
  };

  socket.onclose = () => {
    // console.log('WebSocket connection closed');
    console.log('WebSocket connection closed, readyState:', socket.readyState);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    console.error('WebSocket readyState:', socket.readyState);
    console.error('WebSocket bufferedAmount:', socket.bufferedAmount);
  };

  // Clean up the connection when the component unmounts
  return () => {
    socket.close();
  };
}, []);

  return (
    <div>
      This is protected content. You can access this content because you are signed in.
    </div>
  )
}

export default withAuth(ProtectedPage)