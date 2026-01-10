import React, { useMemo } from 'react';
import { Box, Container, Paper, CircularProgress, Stack, useTheme, useMediaQuery, Typography } from '@mui/material';
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

  const stats = useMemo(() => {
    if (!parasites?.length) return null;

    const approved = parasites.filter(p => p.status === 'approved');
    if (!approved.length) return null;

    // Helper: حساب التكرار لأي حقل
    const getDistribution = (field: keyof Parasite) => {
      const counts = approved.reduce((acc, p) => {
        const val = (p[field] as string) || t('not_specified', { defaultValue: 'غير محدد' });
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    };

    // Helper: حساب القيم الفريدة
    const countUnique = (field: keyof Parasite) => new Set(approved.map(p => p[field]).filter(Boolean)).size;

    const uniqueStudents = countUnique('studentName');
    
    // البيانات الشهرية
    const monthlyData = (() => {
      const months = isRtl 
        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const stats: Record<string, { parasites: number; images: number }> = {};
      const now = new Date();

      // تهيئة آخر 12 شهر
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        stats[key] = { parasites: 0, images: 0 };
      }

      approved.forEach(p => {
        if (p.createdAt) {
          const d = new Date(p.createdAt);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (stats[key]) {
            stats[key].parasites++;
            if (p.imageUrl) stats[key].images++;
          }
        }
      });

      return Object.entries(stats).map(([key, val]) => {
        const [_, m] = key.split('-');
        return { month: `${months[parseInt(m) - 1]}`, ...val };
      });
    })();

    return {
      totalParasites: approved.length,
      totalImages: approved.filter(p => p.imageUrl).length,
      totalStudents: uniqueStudents,
      totalSupervisors: countUnique('supervisorName'),
      uniqueHosts: countUnique('host'),
      uniqueTypes: countUnique('type'),
      averageParasitesPerStudent: uniqueStudents ? (approved.length / uniqueStudents).toFixed(1) : '0',
      distributions: {
        hostDistribution: getDistribution('host').slice(0, 6),
        sampleTypeDistribution: getDistribution('sampleType').slice(0, 6),
        parasiteTypes: getDistribution('type'),
        stageDistribution: getDistribution('stage'),
      },
      topResearchers: getDistribution('studentName').slice(0, 10),
      monthlyData,
    };
  }, [parasites, t, isRtl]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', bgcolor: '#f8f7f5' }}>
      <CircularProgress sx={{ color: '#3a5a40' }} />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 4 }}><Paper sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Paper></Container>
  );

  if (!stats) return <EmptyState />;

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 }, bgcolor: '#f8f7f5' }}>
      <Container maxWidth="lg">
        <StatsHeader />
        <StatCardGrid stats={stats} isMobile={isMobile} />
        <DistributionCharts distributions={stats.distributions} isMobile={isMobile} isRtl={isRtl} />
        <MonthlyTimelineChart data={stats.monthlyData} isMobile={isMobile} isRtl={isRtl} />
        <TopResearchersTable data={stats.topResearchers} totalParasites={stats.totalParasites} isMobile={isMobile} isRtl={isRtl} />
      </Container>
    </Box>
  );
};

export default Statistics;