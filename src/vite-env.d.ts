/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // أضف أي متغيّرات بيئة أخرى تستخدمها هنا، مثلاً:
  // readonly VITE_STORAGE_BUCKET?: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}