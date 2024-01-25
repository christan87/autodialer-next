/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true enables React's Strict Mode, a tool for 
  // highlighting potential problems in an application during development.
  reactStrictMode: true,

  // swcMinify: true enables the use of SWC to minify your JavaScript 
  // code. SWC is a super-fast JavaScript compiler that Next.js can use 
  // as a replacement for Babel.
  swcMinify: true,

  // makes the environment variables available in your Next.js application.
  // This is useful for exposing environment variables to your client-side code.
  env: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  }
}

export default nextConfig;
