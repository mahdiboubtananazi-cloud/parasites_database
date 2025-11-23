import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "welcome": "مرحباً بك في قاعدة البيانات",
      "archive": "الأرشيف",
      "login": "تسجيل الدخول",
      "email": "البريد الإلكتروني",
      "password": "كلمة المرور",
      "register": "إنشاء حساب جديد",
      "dont_have_account": "ليس لديك حساب؟",
      "loading": "جاري التحميل...",
      "success": "عملية ناجحة",
      "error": "حدث خطأ",
      "search": "بحث",
      "logout": "تسجيل خروج",
      "my_account": "حسابي"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "archive": "Archive",
      "login": "Login",
      "email": "Email",
      "password": "Password",
      "register": "Register",
      "dont_have_account": "Don't have an account?",
      "loading": "Loading...",
      "success": "Success",
      "error": "Error",
      "search": "Search",
      "logout": "Logout",
      "my_account": "My Account"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    interpolation: { escapeValue: false }
  });

export default i18n;
