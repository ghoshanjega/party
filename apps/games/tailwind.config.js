module.exports = {
  mode: 'jit',
  content: [
    // 'node_modules/daisyui/dist/**/*.js',
    // 'node_modules/react-daisyui/dist/**/*.js',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
