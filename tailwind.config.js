/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./public-site/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#C7ECFA',
          200: '#A1E0F7',
          300: '#7CD4F4',
          400: '#56C7F0',
          500: '#30BCED',
          600: '#14AAE1',
          700: '#108EBC',
          800: '#0D7296',
          900: '#0A5571',
        },
        'dark': '#0A0A0A',
        'light': '#FFFBFE',
        'disabled': '#C8BFBC',
        'success': {
          100: '#AFFED1',
          200: '#72FDAE',
          300: '#4AFC97',
          400: '#22FC80',
          500: '#04F06A',
          600: '#03C959',
          700: '#028D3E',
          800: '#015124',
          900: '#002812'
        },
        'error': {
          100: '#F3B9BF',
          200: '#ED969F',
          300: '#E77480',
          400: '#E05260',
          500: '#D72638',
          600: '#BF2231',
          700: '#9C1C28',
          800: '#79151F',
          900: '#570F16',
        },
        'warning': {
          100: '#FFD9C2',
          200: '#FFC099',
          300: '#FFA770',
          400: '#FF8E47',
          500: '#FF751F',
          600: '#F55E00',
          700: '#CC4E00',
          800: '#A33F00',
          900: '#7A2F00',
        }
      },
      width: {
        'primary-col': '1440px'
      },
      maxWidth: {
        'primary-col': '1440px'
      }
    },
  },
  plugins: [],
}
