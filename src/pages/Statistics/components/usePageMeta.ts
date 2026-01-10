import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook لإدارة عنوان الصفحة واتجاه النص
 * @param titleKey مفتاح الترجمة للعنوان
 * @param defaultTitle العنوان الافتراضي في حال عدم وجود ترجمة
 */
export const usePageMeta = (titleKey: string, defaultTitle: string) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // 1. تحديث الاتجاه واللغة في HTML tag
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    // 2. تحديث العنوان مع اسم التطبيق
    const pageTitle = t(titleKey, { defaultValue: defaultTitle });
    const appName = t('app_title', { defaultValue: 'Parasites Archive' });
    
    document.title = `${pageTitle} | ${appName}`;

  }, [i18n.language, t, titleKey, defaultTitle]);
};