import React from "react";
import withAuth from '../components/hoc/withAuth';

function ProtectedPage() {
  return (
    <div>
      This is protected content. You can access this content because you are signed in.
    </div>
  )
}

export default withAuth(ProtectedPage)