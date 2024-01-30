// Export a configuration object for PostCSS, a tool for transforming styles with JavaScript
module.exports = {
  // The plugins property is an object that specifies the PostCSS plugins to use
  plugins: {
    // tailwindcss is a utility-first CSS framework for rapidly building custom user interfaces
    // The empty object {} means that no additional options are provided to the tailwindcss plugin
    tailwindcss: {},

    // autoprefixer is a PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use
    // It is recommended by Google and used in Twitter and Alibaba
    // The empty object {} means that no additional options are provided to the autoprefixer plugin
    autoprefixer: {},
  },
};