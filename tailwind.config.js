/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        signature: ['GoldenSignature', 'sans-serif'],
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      }
    }
  }
};
