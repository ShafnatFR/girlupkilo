/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dipakai modul internal (reimbursement).
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec2ff',
          400: '#59a1ff',
          500: '#327cff',
          600: '#1c5cf5',
          700: '#1648e1',
          800: '#193cb6',
          900: '#1a378f',
          950: '#152257',
        },
        // Palet publik Girl Up — magenta dengan aksen netral.
        gu: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecdd8',
          300: '#fda4bb',
          400: '#fb7197',
          500: '#f43f76',
          600: '#e11d57',
          700: '#be123f',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};