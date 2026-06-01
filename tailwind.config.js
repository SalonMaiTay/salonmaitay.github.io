/** @type {import('tailwindcss').Config} */
module.exports = {
  // Điền chính xác đường dẫn này để Tailwind không bỏ sót bất kỳ class nào trong file js
  content: [
    "./index.html",
    "./asset/main.js",          // Quét trực tiếp file logic chính
    "./asset/iOS.js",           // Quét file giao diện bổ trợ
    "./asset/**/*.js"           // Dự phòng quét toàn bộ file js khác trong thư mục asset
  ],
  theme: {
    extend: {
      // Đăng ký cứng các class z-index tùy biến để không bao giờ bị xóa nhầm
      zIndex: {
        '25': '25',
        '30': '30',
      }
    },
  },
  plugins: [],
}