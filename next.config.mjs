import { createSecureHeaders } from "next-secure-headers";

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
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_SIGNING_PRIVATE_KEY: process.env.JWT_SIGNING_PRIVATE_KEY,
    DEV_SERVER_URL: process.env.DEV_SERVER_URL,
    WS_URL: process.env.WS_URL,
  },
  // This function is used to set custom HTTP headers for your Next.js application.
  async headers() {
    return [
      {
        // The 'source' property is a pattern that matches all routes in your application.
        source: "/(.*)",

        // The 'headers' property is an array of header objects.
        // The 'createSecureHeaders' function from the 'next-secure-headers' library is used to generate these headers.
        headers: createSecureHeaders({
          // The 'contentSecurityPolicy' option is used to configure the Content Security Policy (CSP) header.
          contentSecurityPolicy: {
            // The 'directives' object defines the actual CSP directives.
            directives: {
              // The 'defaultSrc' directive restricts which URLs can be loaded for various types of resources.
              // Here, it's set to only allow resources from the same origin ('self').
              defaultSrc: ["'self'"],

              // The 'styleSrc' directive restricts which URLs can be loaded for style resources.
              // Here, it's set to allow styles from the same origin, inline styles, and styles from 'https://fonts.googleapis.com'.
              styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

              // The 'scriptSrc' directive restricts which URLs can be loaded for JavaScript resources.
              // Here, it's set to allow scripts from the same origin, inline scripts, and scripts using 'eval'.
              scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],

              // The 'imgSrc' directive restricts which URLs can be loaded for image resources.
              // Here, it's set to allow images from the same origin and data URIs.
              imgSrc: ["'self'", "data:"],

              // The 'connectSrc' directive restricts which URLs can be loaded using script interfaces.
              // Here, it's set to only allow connections from the same origin and server.
              connectSrc: ["'self'", "http://localhost:4000", "wss://jx448jd6wa.execute-api.us-east-1.amazonaws.com/development/"],

              // The 'fontSrc' directive restricts which URLs can be loaded for font resources.
              // Here, it's set to allow fonts from the same origin and fonts from 'https://fonts.gstatic.com'.
              fontSrc: ["'self'", "https://fonts.gstatic.com"],
            },
          },
        }),
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/fonts/',
          outputPath: `${isServer ? '../' : ''}static/fonts/`,
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
}

export default nextConfig;
