import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';

// استيراد المكونات الفرعية
import HeroSection from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/home/Footer';

const Home = () => {
  const { loading } = useParasites(); // لم نعد نحتاج parasites هنا للإحصائيات
  const { t, i18n } = useTranslation();

  // ضبط عنوان الصفحة واتجاه النص
  useEffect(() => {
    document.title = t('app_title') || 'Parasites Archive';
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  // عرض شاشة التحميل
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: colors.background.default,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  // عرض الصفحة الرئيسية مجمعة
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.background.default, overflowX: 'hidden' }}>
      {/* 1. قسم الواجهة الرئيسية (Hero) */}
      <HeroSection />

      {/* 2. قسم الأرقام والإحصائيات (لم نعد نمرر props) */}
      <StatsSection />

      {/* 3. قسم الدعوة للمساهمة (CTA) */}
      <CtaSection />

      {/* 4. الذيل (Footer) */}
      <Footer />
    </Box>
  );
};

export default Home;