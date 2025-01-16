import { text } from 'body-parser';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'mona': ['Mona Sans'],
      },
      fontWeight: {
        thin: '100',
        normal: '400',
        bold: '700',
        medium: '500'
      },
      colors: {
        primary: {
          100: '#cb3bff',
          200: '#091330'
        },
        secondary: {
          100: '#0B1739',
          400: '#333b4e',
        },
        neutral: {
          100: '#aeb9e1',
          400: '#AEB9E1',
          500: '#F3F3F3',
          800: '#081029',
          900: '#091029'
        },
      },
      dropShadow: {
        glow: [
          "0 0 2px #fff",
          "0 0 3px #fff",
          "0 0 8px #bc13fe",
          "0 0 12px #bc13fe",
          "0 0 16px #bc13fe",
        ],
        whiteGlow: [
          "0 0 2px #fff",
          "0 0 3px #fff",
          "0 0 8px #00c2ff",
          "0 0 12px #00c2ff",
          "0 0 16px #00c2ff",
        ]
      }
    },
  },
  plugins: [],
}

