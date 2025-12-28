import React, { useMemo, useEffect } from 'react';
import { Container, Box, useMediaQuery, useTheme, CircularProgress, Stack, Typography, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../../hooks/useParasites';

type Parasite = any;

import StatsHeader from './components/StatsHeader';
import StatCardGrid from './components/StatCardGrid';
import DistributionCharts from './components/DistributionCharts';
import MonthlyTimelineChart from './components/MonthlyTimelineChart';
import TopResearchersTable from './components/TopResearchersTable';
import SummaryPanels from './components/SummaryPanels';
import EmptyState from './components/EmptyState';

export interface Stats {
  totalParasites: number;
  totalImages: number;
  totalStudents: number;
  totalSupervisors: number;
  uniqueHosts: number;
  uniqueTypes: number;
  averageParasitesPerStudent: string;
}

const Statistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();
  const { parasites, loading } = useParasites();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.title = t('stats_title');
  }, [i18n.language, isRtl, t]);

  const stats = useMemo(() => calculateStats(parasites), [parasites]);
  const distributions = useMemo(() => calculateDistributions(parasites, t), [parasites, t]);
  const monthlyTimeline = useMemo(() => calculateMonthlyTimeline(parasites, t), [parasites, t]);
  const topResearchers = useMemo(() => calculateTopResearchers(parasites, t), [parasites, t]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: alpha('#3a5a40', 0.02) }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={50} thickness={4} />
          <Typography color="text.secondary">{t('stats_loading')}</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 3, md: 4 }, backgroundColor: alpha('#3a5a40', 0.02), minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <StatsHeader />

        <StatCardGrid stats={stats} isMobile={isMobile} />

        <DistributionCharts
          distributions={distributions}
          isMobile={isMobile}
          isRtl={isRtl}
        />

        <MonthlyTimelineChart
          data={monthlyTimeline}
          isMobile={isMobile}
          isRtl={isRtl}
        />

        <TopResearchersTable 
          data={topResearchers}
          totalParasites={stats.totalParasites}
          isMobile={isMobile}
          isRtl={isRtl}
        />

        <SummaryPanels stats={stats} />

        {stats.totalParasites === 0 && <EmptyState />}
      </Container>
    </Box>
  );
};

const calculateStats = (parasites: Parasite[]): Stats => {
  if (!parasites?.length) {
    return {
      totalParasites: 0, totalImages: 0, totalStudents: 0,
      totalSupervisors: 0, uniqueHosts: 0, uniqueTypes: 0,
      averageParasitesPerStudent: '0',
    };
  }

  const uniqueStudents = new Set(parasites.map(p => p.studentName).filter(Boolean));
  const uniqueSupervisors = new Set(parasites.map(p => p.supervisorName).filter(Boolean));
  const uniqueHosts = new Set(parasites.map(p => p.host || p.hostSpecies).filter(Boolean));
  const uniqueTypes = new Set(parasites.map(p => p.type).filter(Boolean));
  const parasitesWithImages = parasites.filter(p => p.imageurl || p.imageUrl).length;

  return {
    totalParasites: parasites.length,
    totalImages: parasitesWithImages,
    totalStudents: uniqueStudents.size,
    totalSupervisors: uniqueSupervisors.size,
    uniqueHosts: uniqueHosts.size,
    uniqueTypes: uniqueTypes.size,
    averageParasitesPerStudent: uniqueStudents.size > 0
      ? (parasites.length / uniqueStudents.size).toFixed(2)
      : '0',
  };
};

const buildDistribution = (items: Parasite[], getKey: (p: Parasite) => string | undefined, unknownLabel: string) => {
  const map = new Map<string, number>();
  items.forEach(p => {
    const key = getKey(p) || unknownLabel;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

const calculateDistributions = (parasites: Parasite[], t: any) => ({
  hostDistribution: buildDistribution(parasites, p => p.host || p.hostSpecies, t('stats_no_data')),
  sampleTypeDistribution: buildDistribution(parasites, p => p.sampleType || p.sampletype, t('stats_no_data')),
  parasiteTypes: buildDistribution(parasites, p => p.type, t('stats_no_data')),
  stageDistribution: buildDistribution(parasites, p => p.stage, t('stats_no_data')),
});

const calculateMonthlyTimeline = (parasites: Parasite[], t: any) => {
  const months = [
    t('stats_month_jan') || 'يناير',
    t('stats_month_feb') || 'فبراير', 
    t('stats_month_mar') || 'مارس',
    t('stats_month_apr') || 'أبريل',
    t('stats_month_may') || 'مايو',
    t('stats_month_jun') || 'يونيو',
    t('stats_month_jul') || 'يوليو',
    t('stats_month_aug') || 'أغسطس',
    t('stats_month_sep') || 'سبتمبر',
    t('stats_month_oct') || 'أكتوبر',
    t('stats_month_nov') || 'نوفمبر',
    t('stats_month_dec') || 'ديسمبر',
  ];

  const monthMap = new Map<string, { parasites: number; images: number }>();
  months.forEach(month => monthMap.set(month, { parasites: 0, images: 0 }));

  parasites.forEach((p: Parasite) => {
    const date = new Date(p.createdAt || p.createdat || new Date());
    const month = months[date.getMonth()];
    if (month && monthMap.has(month)) {
      const current = monthMap.get(month)!;
      current.parasites += 1;
      if (p.imageurl || p.imageUrl) current.images += 1;
    }
  });

  return months.map((month) => ({
    month,
    ...monthMap.get(month)!,
  }));
};

const calculateTopResearchers = (parasites: Parasite[], t: any) => {
  const studentMap = new Map<string, number>();
  parasites.forEach((p: Parasite) => {
    const student = p.studentName || t('stats_no_data');
    studentMap.set(student, (studentMap.get(student) || 0) + 1);
  });
  return Array.from(studentMap, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

export default Statistics;
