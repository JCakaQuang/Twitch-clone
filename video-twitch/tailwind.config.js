/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // hoặc 'media' nếu muốn tự động theo hệ thống
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Tùy chọn thêm các biến custom
    },
  },
  plugins: [],
}
