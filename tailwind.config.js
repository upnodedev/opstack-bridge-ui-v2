/** @type {import('tailwindcss').Config} */
require('dotenv').config();

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: process.env.VITE_COLOR_PRIMARY || '#174BDE',
        secondary: process.env.VITE_COLOR_SECONDARY || '#72EDF2',
      },
    },
    fontFamily: {
      display: ["Inter", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
    fontSize: {
      xs: ["12px", "18px"],
      sm: ["14px", "20px"],
      md: ["16px", "24px"],
      lg: ["18px", "28px"],
      xl: ["20px", "30px"],
      "display-xs": ["24px", "32px"],
      "display-sm": ["30px", "38px"],
      "display-md": ["36px", "44px"],
      "display-lg": ["48px", "60px"],
      "display-xl": ["60px", "72px"],
      "display-2xl": ["72px", "90px"],
    },
  },
  plugins: [],
};
