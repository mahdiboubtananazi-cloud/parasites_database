import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector'; // أضف هذا إذا أردت اكتشاف اللغة تلقائياً
import arTranslations from './locales/ar.json';
import frTranslations from './locales/fr.json';

const resources = {
  ar: { translation: arTranslations },
  fr: { translation: frTranslations },
};

// تحديد اللغة الافتراضية بناءً على التخزين أو المتصفح
const savedLanguage = localStorage.getItem('i18nextLng');
const defaultLanguage = savedLanguage || (navigator.language.startsWith('ar') ? 'ar' : 'fr');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'fr', // إذا لم توجد الترجمة، استخدم الفرنسية
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: true, // الأفضل تفعيلها إذا كنت تستخدم Suspense
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// تحديث اتجاه الصفحة عند تغيير اللغة
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('i18nextLng', lng);
});

// تعيين الاتجاه الأولي
document.documentElement.lang = defaultLanguage;
document.documentElement.dir = defaultLanguage === 'ar' ? 'rtl' : 'ltr';

export default i18n;