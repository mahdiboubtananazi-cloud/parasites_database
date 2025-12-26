import React, { useMemo, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';

// استيراد المكونات الفرعية التي قمنا بإنشائها
import HeroSection from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/home/Footer';

const Home = () => {
  const { parasites, loading } = useParasites();
  const { t, i18n } = useTranslation();

  // ضبط عنوان الصفحة واتجاه النص (عربي/إنجليزي)
  useEffect(() => {
    document.title = t('app_title') || 'Parasites Archive';
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  // حساب الإحصائيات (عدد العينات، الأنواع، الإضافات الحديثة)
  const stats = useMemo(() => {
    if (!parasites || parasites.length === 0) return { total: 0, types: 0, recent: 0 };

    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSamples = parasites.filter((p) => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : null;
      return createdDate && createdDate >= thirtyDaysAgo;
    }).length;

    return { total: parasites.length, types: uniqueTypes.size, recent: recentSamples };
  }, [parasites]);

  // عرض شاشة التحميل أثناء جلب البيانات
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh', 
          bgcolor: colors.background.default 
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

      {/* 2. قسم الأرقام والإحصائيات */}
      <StatsSection stats={stats} />

      {/* 3. قسم الدعوة للمساهمة (CTA) */}
      <CtaSection />

      {/* 4. الذيل (Footer) */}
      <Footer />
      
    </Box>
  );
};

export default Home;
