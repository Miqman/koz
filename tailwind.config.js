/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  // theme: {
  //   extend: {
  //     colors: {
  //       // Custom colors yang sesuai dengan Quasar
  //       primary: {
  //         DEFAULT: '#1976d2',
  //         50: '#e3f2fd',
  //         100: '#bbdefb',
  //         200: '#90caf9',
  //         300: '#64b5f6',
  //         400: '#42a5f5',
  //         500: '#2196f3',
  //         600: '#1e88e5',
  //         700: '#1976d2',
  //         800: '#1565c0',
  //         900: '#0d47a1',
  //       },
  //       secondary: {
  //         DEFAULT: '#26a69a',
  //         50: '#e0f2f1',
  //         100: '#b2dfdb',
  //         200: '#80cbc4',
  //         300: '#4db6ac',
  //         400: '#26a69a',
  //         500: '#009688',
  //         600: '#00897b',
  //         700: '#00796b',
  //         800: '#00695c',
  //         900: '#004d40',
  //       },
  //       accent: {
  //         DEFAULT: '#9c27b0',
  //         50: '#f3e5f5',
  //         100: '#e1bee7',
  //         200: '#ce93d8',
  //         300: '#ba68c8',
  //         400: '#ab47bc',
  //         500: '#9c27b0',
  //         600: '#8e24aa',
  //         700: '#7b1fa2',
  //         800: '#6a1b9a',
  //         900: '#4a148c',
  //       },
  //       positive: '#21ba45',
  //       negative: '#c10015',
  //       info: '#31ccec',
  //       warning: '#f2c037',
  //     },
  //     fontFamily: {
  //       sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
  //     },
  //     animation: {
  //       'fade-in': 'fadeIn 0.3s ease-in-out',
  //       'slide-up': 'slideUp 0.3s ease-out',
  //       'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
  //     },
  //     keyframes: {
  //       fadeIn: {
  //         '0%': { opacity: '0' },
  //         '100%': { opacity: '1' },
  //       },
  //       slideUp: {
  //         '0%': { transform: 'translateY(10px)', opacity: '0' },
  //         '100%': { transform: 'translateY(0)', opacity: '1' },
  //       },
  //       bounceSubtle: {
  //         '0%, 100%': { transform: 'translateY(0)' },
  //         '50%': { transform: 'translateY(-5px)' },
  //       },
  //     },
  //   },
  // },
  plugins: [],
}
