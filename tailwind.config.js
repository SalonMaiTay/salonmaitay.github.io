/** @type {import('tailwindcss').Config} */
module.exports = {
  // Chỉ định Tailwind quét nghiêm ngặt trong thư mục /asset/ viết thường của bạn
  content: [
    "./index.html",
    "./asset/*.js",
    "./asset/*.css"
  ],
  theme: {
    extend: {
      zIndex: {
        '25': '25',
        '30': '30',
      },
      colors: {
        zinc: {
          950: '#09090b',
        }
      }
    },
  },
  plugins: [],
}