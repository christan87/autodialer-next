import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],

  // Use JWT for session handling
  session: {
    strategy: 'jwt',
  },

  // Configure JWT
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  pages:{
    // signIn: '/auth/signin',  
    // signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: null // If set, new users will be directed here on first sign in
  },
  // ...add more options here
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}) {
      // Initial sign in
      // This callback is called whenever a JWT is created or updated.
      // When the user signs in, the `account` and `user` parameters are populated.
      // In this case, if the `account` object has an `access_token` property,
      // it's added to the `token` object.
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      // The updated `token` object is returned.
      // This will be the new JWT.
      return token;
    },
    async session({session, token}) {
      // This callback is called whenever a session is checked/updated.
      // The `session` parameter contains the current session,
      // and the `token` parameter contains the current JWT.
      // In this case, the `access_token` from the `token` object
      // is added to the `session` object and the updated `session` object is returned as the new session.
      return { ...session, access_token: token.access_token }
    },
  },
}
export default NextAuth(authOptions)