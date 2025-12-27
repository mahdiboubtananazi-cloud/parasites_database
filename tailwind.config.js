/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // 👈 هذا السطر هو الأهم!
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'Cairo', 'sans-serif'],
          serif: ['Merriweather', 'serif'], // لإضافة الفخامة للأسماء العلمية
        },
        colors: {
          // ألوانك الطبية الفاخرة
          primary: '#0B2B26',
          secondary: '#163832',
          accent: '#DAF1DE',
          background: '#FAFCFB',
          text: '#051F20',
        }
      },
    },
    plugins: [],
  }
  