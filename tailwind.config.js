/** @type {import('tailwindcss').Config} */
module.exports = {
  // The 'content' property specifies the files that Tailwind should scan to find class names
  // In this case, it's scanning all JavaScript, TypeScript, JSX, TSX, and MDX files in the 'pages', 'components', and 'app' directories
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // The 'theme' property allows you to customize Tailwind's default configuration
  // In this case, it's extending the 'backgroundImage' theme configuration
  theme: {
    extend: {
      backgroundImage: {
        // 'gradient-radial' is a custom background image that applies a radial gradient
        // The gradient stops are determined by the '--tw-gradient-stops' CSS variable
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",

        // 'gradient-conic' is a custom background image that applies a conic gradient
        // The gradient starts from 180 degrees at the center of the element
        // The gradient stops are determined by the '--tw-gradient-stops' CSS variable
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  // The 'plugins' property allows you to add custom plugins to Tailwind
  // In this case, no plugins are being added
  plugins: [],
};