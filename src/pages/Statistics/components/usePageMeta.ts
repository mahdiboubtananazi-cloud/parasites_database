import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const usePageMeta = (titleKey: string, defaultTitle: string) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.title = t(titleKey, { defaultValue: defaultTitle });
  }, [i18n.language, t, titleKey, defaultTitle]);
};
