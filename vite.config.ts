import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ هذا السطر يسمح بالوصول عبر الشبكة (Wi-Fi)
    port: 5173, // تثبيت المنفذ
  }
})
