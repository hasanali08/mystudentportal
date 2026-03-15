/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(168, 85, 247, 0.08), 0 10px 20px -2px rgba(168, 85, 247, 0.06)',
        'soft-lg': '0 10px 25px -5px rgba(168, 85, 247, 0.15), 0 8px 10px -6px rgba(168, 85, 247, 0.1)',
        'purple': '0 4px 14px 0 rgba(168, 85, 247, 0.2)',
        'purple-lg': '0 10px 30px 0 rgba(168, 85, 247, 0.3)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
      },
    },
  },
  plugins: [],
}

