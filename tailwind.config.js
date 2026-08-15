/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#026fc2',
          700: '#03589e',
          800: '#074b82',
          900: '#0c3f6d',
          950: '#082849',
        },
        accent: {
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
          purple: '#8b5cf6',
          indigo: '#6366f1',
        }
      },
    },
  },
  plugins: [],
};
