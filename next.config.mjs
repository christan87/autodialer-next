/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  }
}

export default nextConfig;
