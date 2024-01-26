import React from 'react'
import Component from '../components/common/login-btn';

export default function UnProtectedPage() {
  return (
    <div>
      <p>youxve been redirected to the login page.</p>
      <Component />
    </div>
  );
}