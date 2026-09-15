/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ayush: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        saffron: {
          500: '#FF9933',
          600: '#ea580c',
        },
        navy: {
          900: '#000080',
          950: '#001a33',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'radial-ayush': 'radial-gradient(circle at 50% 0%, #064e3b 0%, #020617 75%)',
        'radial-intl': 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 75%)',
      },
    },
  },
  plugins: [],
};
