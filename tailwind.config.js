/** @type {import('tailwindcss').Config} */
require('dotenv').config();

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: process.env.VITE_COLOR_PRIMARY || '#174BDE',
        secondary: process.env.VITE_COLOR_SECONDARY || '#72EDF2',
        gray:{
          100:'#F2F4F7',
          200:'#E4E7EC',
          300:'#D0D5DD',
          400:'#98A2B3',
          500:'#667085',
          600:'#475467',
          700:'#344054',
          800:'#182230',
          900:'#101828'
        }
      },
      
    },
    fontFamily: {
      display: ["Inter", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
    fontSize: {
      xs: ["0.75rem", "1.125rem"],
      sm: ["0.875rem", "1.25rem"],
      md: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.75rem"],
      xl: ["1.25rem", "1.875rem"],
      "display-xs": ["1.5rem", "2rem"],
      "display-sm": ["1.875rem", "2.375rem"],
      "display-md": ["2.25rem", "2.75rem"],
      "display-lg": ["3rem", "3.75rem"],
      "display-xl": ["3.75rem", "4.5rem"],
      "display-2xl": ["4.5rem", "5.625rem"],
    },
  },
  plugins: [],
};