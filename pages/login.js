import React from 'react'
import Component from '../components/common/login-btn';
import { useSession } from 'next-auth/react'

export default function UnProtectedPage() {
  const {data:session} = useSession();
  return (
    <div>
      <p>youve been redirected to the login page.</p>
      <button onClick={() => console.log("session:=========>: ", session)}>Session</button>
      <Component />
    </div>
  );
}