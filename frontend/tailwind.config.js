module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          amber: {
            500: '#f59e0b',
            600: '#d97706',
          }
        }
      },
    },
    plugins: [],
  };