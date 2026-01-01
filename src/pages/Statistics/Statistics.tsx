import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../../hooks/useParasites';
import { Parasite } from '../../types/parasite';

// Components
import StatsHeader from './components/StatsHeader';
import StatCardGrid from './components/StatCardGrid';
import DistributionCharts from './components/DistributionCharts';
import MonthlyTimelineChart from './components/MonthlyTimelineChart';
import TopResearchersTable from './components/TopResearchersTable';
import EmptyState from './components/EmptyState';

const Statistics: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isRtl = i18n.language === 'ar';

  const { parasites, loading, error } = useParasites();

  // حساب الإحصائيات
  const stats = React.useMemo(() => {
    if (!parasites || parasites.length === 0) {
      return null;
    }

    const approved = parasites.filter((p) => p.status === 'approved');

    // عدد الطلاب المختلفين
    const uniqueStudents = new Set(
      approved.map((p) => p.studentName).filter(Boolean)
    );

    // عدد المشرفين المختلفين
    const uniqueSupervisors = new Set(
      approved.map((p) => p.supervisorName).filter(Boolean)
    );

    // عدد العوائل المختلفة
    const uniqueHosts = new Set(
      approved.map((p) => p.host).filter(Boolean)
    );

    // عدد الأنواع المختلفة
    const uniqueTypes = new Set(
      approved.map((p) => p.type).filter(Boolean)
    );

    // حساب المعدل
    const avgPerStudent = uniqueStudents.size > 0
      ? (approved.length / uniqueStudents.size).toFixed(1)
      : '0';

    // توزيع حسب العائل
    const hostDistribution = Object.entries(
      approved.reduce((acc, p) => {
        const host = p.host || t('not_specified', { defaultValue: 'غير محدد' });
        acc[host] = (acc[host] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // توزيع حسب نوع العينة
    const sampleTypeDistribution = Object.entries(
      approved.reduce((acc, p) => {
        const sampleType = p.sampleType || t('not_specified', { defaultValue: 'غير محدد' });
        acc[sampleType] = (acc[sampleType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // توزيع حسب النوع
    const parasiteTypes = Object.entries(
      approved.reduce((acc, p) => {
        const type = p.type || t('not_specified', { defaultValue: 'غير محدد' });
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // توزيع حسب المرحلة
    const stageDistribution = Object.entries(
      approved.reduce((acc, p) => {
        const stage = p.stage || t('not_specified', { defaultValue: 'غير محدد' });
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // أكثر الباحثين مساهمة
    const researcherStats = Object.entries(
      approved.reduce((acc, p) => {
        const name = p.studentName || t('unknown', { defaultValue: 'غير معروف' });
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // إحصائيات شهرية
    const monthlyData = getMonthlyData(approved, i18n.language);

    return {
      totalParasites: approved.length,
      totalImages: approved.filter((p) => p.imageUrl).length,
      totalStudents: uniqueStudents.size,
      totalSupervisors: uniqueSupervisors.size,
      uniqueHosts: uniqueHosts.size,
      uniqueTypes: uniqueTypes.size,
      averageParasitesPerStudent: avgPerStudent,
      distributions: {
        hostDistribution,
        sampleTypeDistribution,
        parasiteTypes,
        stageDistribution,
      },
      topResearchers: researcherStats,
      monthlyData,
    };
  }, [parasites, t, i18n.language]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f8f7f5',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: '#3a5a40' }} />
          <Typography color="text.secondary">
            {t('loading', { defaultValue: 'جاري التحميل...' })}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  if (!stats) {
    return <EmptyState />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 5 },
        bgcolor: '#f8f7f5',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <StatsHeader />

        {/* Stat Cards */}
        <StatCardGrid
          stats={{
            totalParasites: stats.totalParasites,
            totalImages: stats.totalImages,
            totalStudents: stats.totalStudents,
            totalSupervisors: stats.totalSupervisors,
            uniqueHosts: stats.uniqueHosts,
            uniqueTypes: stats.uniqueTypes,
            averageParasitesPerStudent: stats.averageParasitesPerStudent,
          }}
          isMobile={isMobile}
        />

        {/* Distribution Charts */}
        <DistributionCharts
          distributions={stats.distributions}
          isMobile={isMobile}
          isRtl={isRtl}
        />

        {/* Monthly Timeline */}
        <MonthlyTimelineChart
          data={stats.monthlyData}
          isMobile={isMobile}
          isRtl={isRtl}
        />

        {/* Top Researchers */}
        <TopResearchersTable
          data={stats.topResearchers}
          totalParasites={stats.totalParasites}
          isMobile={isMobile}
          isRtl={isRtl}
        />
      </Container>
    </Box>
  );
};

// دالة مساعدة لحساب البيانات الشهرية
function getMonthlyData(parasites: Parasite[], language: string) {
  const monthNames = language === 'ar'
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyStats: Record<string, { parasites: number; images: number }> = {};

  // تهيئة آخر 12 شهر
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = monthNames[date.getMonth()];
    monthlyStats[key] = { parasites: 0, images: 0 };
  }

  // حساب الإحصائيات
  parasites.forEach((p) => {
    if (p.createdAt) {
      const date = new Date(p.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyStats[key]) {
        monthlyStats[key].parasites += 1;
        if (p.imageUrl) {
          monthlyStats[key].images += 1;
        }
      }
    }
  });

  // تحويل إلى مصفوفة
  return Object.entries(monthlyStats).map(([key, data]) => {
    const [year, month] = key.split('-');
    const monthIndex = parseInt(month) - 1;
    return {
      month: `${monthNames[monthIndex]} ${year}`,
      parasites: data.parasites,
      images: data.images,
    };
  });
}

export default Statistics;