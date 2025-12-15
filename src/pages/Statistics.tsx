import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Microscope,
  Image as ImageIcon,
  Database,
  TrendingUp,
  Users,
  Beaker,
  Activity,
  Award,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';


interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}


interface ParasiteData {
  id: string | number;
  name?: string;
  scientificName?: string;
  type?: string;
  host?: string;
  hostSpecies?: string;
  stage?: string;
  sampleType?: string;
  sampletype?: string;
  stainColor?: string;
  studentName?: string;
  supervisorName?: string;
  location?: string;
  createdAt?: string;
  createdat?: string;
  description?: string;
  imageurl?: string;
  imageUrl?: string;
}


const Statistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { parasites, loading } = useParasites();

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.title = t('statistics_title', { defaultValue: 'الإحصائيات' });
  }, [t, i18n.language, isRtl]);


  // ✅ Calculate all statistics dynamically
  const calculatedStats = useMemo(() => {
    if (!parasites || parasites.length === 0) {
      return {
        totalParasites: 0,
        totalImages: 0,
        totalStudents: 0,
        totalSupervisors: 0,
        uniqueHosts: 0,
        uniqueTypes: 0,
        averageParasitesPerStudent: 0,
      };
    }


    const uniqueStudents = new Set(
      parasites
        .map((p: ParasiteData) => p.studentName)
        .filter((s: string) => s)
    );
    const uniqueSupervisors = new Set(
      parasites
        .map((p: ParasiteData) => p.supervisorName)
        .filter((s: string) => s)
    );
    const uniqueHosts = new Set(
      parasites
        .map((p: ParasiteData) => p.host || p.hostSpecies)
        .filter((h: string) => h)
    );
    const uniqueTypes = new Set(
      parasites.map((p: ParasiteData) => p.type).filter((t: string) => t)
    );
    const parasitesWithImages = parasites.filter(
      (p: ParasiteData) => p.imageurl || p.imageUrl
    ).length;


    return {
      totalParasites: parasites.length,
      totalImages: parasitesWithImages,
      totalStudents: uniqueStudents.size,
      totalSupervisors: uniqueSupervisors.size,
      uniqueHosts: uniqueHosts.size,
      uniqueTypes: uniqueTypes.size,
      averageParasitesPerStudent:
        uniqueStudents.size > 0
          ? (parasites.length / uniqueStudents.size).toFixed(2)
          : 0,
    };
  }, [parasites]);


  // ✅ Host Distribution
  const hostDistribution = useMemo(() => {
    const hostMap = new Map<string, number>();
    parasites.forEach((p: ParasiteData) => {
      const host = p.host || p.hostSpecies || t('unknown', { defaultValue: 'Unknown' });
      hostMap.set(host, (hostMap.get(host) || 0) + 1);
    });
    return Array.from(hostMap, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [parasites, t]);


  // ✅ Sample Type Distribution
  const sampleTypeDistribution = useMemo(() => {
    const sampleMap = new Map<string, number>();
    parasites.forEach((p: ParasiteData) => {
      const sample = p.sampleType || p.sampletype || t('unknown', { defaultValue: 'Unknown' });
      sampleMap.set(sample, (sampleMap.get(sample) || 0) + 1);
    });
    return Array.from(sampleMap, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [parasites, t]);


  // ✅ Parasite Types
  const parasiteTypes = useMemo(() => {
    const typeMap = new Map<string, number>();
    parasites.forEach((p: ParasiteData) => {
      const type = p.type || t('unknown', { defaultValue: 'Unknown' });
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });
    return Array.from(typeMap, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [parasites, t]);


  // ✅ Development Stage Distribution
  const stageDistribution = useMemo(() => {
    const stageMap = new Map<string, number>();
    parasites.forEach((p: ParasiteData) => {
      const stage = p.stage || t('unknown', { defaultValue: 'Unknown' });
      stageMap.set(stage, (stageMap.get(stage) || 0) + 1);
    });
    return Array.from(stageMap, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [parasites, t]);


  // ✅ Student Contribution (Top Researchers)
  const studentContribution = useMemo(() => {
    const studentMap = new Map<string, number>();
    parasites.forEach((p: ParasiteData) => {
      const student = p.studentName || t('unknown', { defaultValue: 'Unknown' });
      studentMap.set(student, (studentMap.get(student) || 0) + 1);
    });
    return Array.from(studentMap, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [parasites, t]);


  // ✅ Monthly Timeline
  const monthlyTimeline = useMemo(() => {
    const monthMap = new Map<string, { parasites: number; images: number }>();
    
    const months = [
      t('month_jan'), t('month_feb'), t('month_mar'), t('month_apr'),
      t('month_may'), t('month_jun'), t('month_jul'), t('month_aug'),
      t('month_sep'), t('month_oct'), t('month_nov'), t('month_dec'),
    ].map((m, i) => m || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]);


    months.forEach((month) => {
      monthMap.set(month, { parasites: 0, images: 0 });
    });


    parasites.forEach((p: ParasiteData) => {
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
  }, [parasites, t]);


  const COLORS = [
    '#3a5a40',
    '#32b8c6',
    '#ff6b6b',
    '#ffa94d',
    '#748dc8',
    '#52c41a',
    '#1890ff',
    '#eb2f96',
    '#faad14',
    '#13c2c2',
  ];


  const statCards: StatCard[] = [
    {
      title: t('stats_total_parasites'),
      value: calculatedStats.totalParasites,
      icon: <Microscope size={32} />,
      color: '#3a5a40',
      bgColor: '#3a5a4015',
      subtitle: t('stats_registered_samples'),
    },
    {
      title: t('stats_uploaded_images'),
      value: calculatedStats.totalImages,
      icon: <ImageIcon size={32} />,
      color: '#32b8c6',
      bgColor: '#32b8c615',
      subtitle: t('stats_microscopic_image'),
    },
    {
      title: t('stats_researchers'),
      value: calculatedStats.totalStudents,
      icon: <Users size={32} />,
      color: '#748dc8',
      bgColor: '#748dc815',
      subtitle: t('stats_student_researcher'),
    },
    {
      title: t('stats_supervisors'),
      value: calculatedStats.totalSupervisors,
      icon: <Award size={32} />,
      color: '#ffa94d',
      bgColor: '#ffa94d15',
      subtitle: t('stats_supervisor'),
    },
    {
      title: t('stats_host_types'),
      value: calculatedStats.uniqueHosts,
      icon: <Activity size={32} />,
      color: '#ff6b6b',
      bgColor: '#ff6b6b15',
      subtitle: t('stats_different_host'),
    },
    {
      title: t('stats_classifications'),
      value: calculatedStats.uniqueTypes,
      icon: <Beaker size={32} />,
      color: '#52c41a',
      bgColor: '#52c41a15',
      subtitle: t('stats_type'),
    },
  ];


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: alpha('#3a5a40', 0.02),
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={50} thickness={4} />
          <Typography color="text.secondary">{t('loading')}</Typography>
        </Stack>
      </Box>
    );
  }


  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        backgroundColor: alpha('#3a5a40', 0.02),
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: '#3a5a40',
              mb: 1,
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {t('statistics_title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#748dc8',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              maxWidth: 700,
            }}
          >
            {t('statistics_subtitle')}
          </Typography>
        </Box>


        {/* Stats Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, md: 2.5 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {statCards.map((card) => (
            <Card
              key={card.title}
              sx={{
                background: 'white',
                border: `2px solid ${card.color}20`,
                borderRadius: { xs: 1.5, md: 2.5 },
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  boxShadow: `0 12px 32px ${card.color}20`,
                  transform: isMobile ? 'none' : 'translateY(-6px)',
                  borderColor: `${card.color}40`,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: { xs: 50, md: 60 },
                      height: { xs: 50, md: 60 },
                      borderRadius: '14px',
                      backgroundColor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#748dc8',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        letterSpacing: '0.5px',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        color: '#3a5a40',
                        my: 0.5,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                      }}
                    >
                      {card.value}
                    </Typography>
                    {card.subtitle && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#748dc8',
                          fontSize: { xs: '0.8rem', md: '0.85rem' },
                        }}
                      >
                        {card.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>


        {/* Charts Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {/* Host Distribution */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              <Activity size={20} />
              {t('chart_host_distribution')}
            </Typography>
            {hostDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={hostDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hostDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} ${t('parasite')}`}
                    contentStyle={{
                      backgroundColor: '#f8f7f5',
                      border: '1px solid #3a5a4030',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('no_data_available')}</Typography>
              </Box>
            )}
          </Paper>


          {/* Sample Type Distribution */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              <Beaker size={20} />
              {t('chart_sample_type')}
            </Typography>
            {sampleTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sampleTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} ${t('sample')}`}
                    contentStyle={{
                      backgroundColor: '#f8f7f5',
                      border: '1px solid #3a5a4030',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('no_data_available')}</Typography>
              </Box>
            )}
          </Paper>


          {/* Stage Distribution */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              <TrendingUp size={20} />
              {t('chart_development_stage')}
            </Typography>
            {stageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a5a4020" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#748dc8' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#748dc8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8f7f5',
                      border: '1px solid #3a5a4030',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#32b8c6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('no_data_available')}</Typography>
              </Box>
            )}
          </Paper>


          {/* Parasite Types */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              <Database size={20} />
              {t('chart_parasite_types')}
            </Typography>
            {parasiteTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={parasiteTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a5a4020" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#748dc8' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#748dc8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8f7f5',
                      border: '1px solid #3a5a4030',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#ff6b6b"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('no_data_available')}</Typography>
              </Box>
            )}
          </Paper>


          {/* Monthly Timeline */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              gridColumn: { xs: '1', md: '1 / -1' },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              <BarChart3 size={20} />
              {t('chart_monthly_trends')}
            </Typography>
            {monthlyTimeline.some((m) => m.parasites > 0) ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3a5a4020" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#748dc8' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#748dc8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8f7f5',
                      border: '1px solid #3a5a4030',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="parasites"
                    stroke="#3a5a40"
                    strokeWidth={3}
                    dot={{ fill: '#3a5a40', r: 5 }}
                    activeDot={{ r: 7 }}
                    name={t('parasites')}
                  />
                  <Line
                    type="monotone"
                    dataKey="images"
                    stroke="#32b8c6"
                    strokeWidth={3}
                    dot={{ fill: '#32b8c6', r: 5 }}
                    activeDot={{ r: 7 }}
                    name={t('images')}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">
                  {t('no_monthly_data')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>


        {/* Top Researchers Table */}
        {studentContribution.length > 0 && (
          <Paper
            sx={{
              mb: { xs: 3, md: 4 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #3a5a4015' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#3a5a40',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                }}
              >
                <Users size={20} />
                {t('table_top_researchers')}
              </Typography>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#3a5a4010' }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#3a5a40',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    >
                      {t('rank')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#3a5a40',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    >
                      {t('researcher_name')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#3a5a40',
                        textAlign: 'center',
                      }}
                    >
                      {t('samples_count')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: '#3a5a40',
                        textAlign: 'center',
                      }}
                    >
                      {t('percentage')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentContribution.map((student, index) => {
                    const percentage = (
                      (student.value / calculatedStats.totalParasites) *
                      100
                    ).toFixed(1);
                    return (
                      <TableRow
                        key={student.name}
                        sx={{
                          '&:hover': { backgroundColor: '#3a5a4008' },
                          borderBottom: '1px solid #3a5a4015',
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: '#3a5a40',
                            textAlign: isRtl ? 'right' : 'left',
                          }}
                        >
                          #{index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: isRtl ? 'right' : 'left',
                            fontWeight: 500,
                            fontSize: { xs: '0.85rem', md: '1rem' },
                          }}
                        >
                          {student.name}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={student.value}
                            color="primary"
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            sx={{
                              fontWeight: 700,
                              borderColor: '#32b8c6',
                              color: '#32b8c6',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              flexDirection: isMobile ? 'column' : 'row',
                            }}
                          >
                            <Box
                              sx={{
                                width: isMobile ? '100%' : '100px',
                                height: '8px',
                                backgroundColor: '#3a5a4015',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  backgroundColor: '#32b8c6',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: '#3a5a40',
                                minWidth: '40px',
                                fontSize: { xs: '0.75rem', md: '0.85rem' },
                              }}
                            >
                              {percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}


        {/* Summary Statistics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              {t('summary_data_statistics')}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('total_parasites')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#3a5a40' }}>
                  {calculatedStats.totalParasites}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('uploaded_images')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#32b8c6' }}>
                  {calculatedStats.totalImages}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('image_ratio')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#32b8c6' }}>
                  {calculatedStats.totalParasites > 0
                    ? (
                        (calculatedStats.totalImages /
                          calculatedStats.totalParasites) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('average_samples_per_researcher')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                  {calculatedStats.averageParasitesPerStudent}
                </Typography>
              </Box>
            </Stack>
          </Paper>


          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              background: 'white',
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #3a5a4015',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#3a5a40',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
              }}
            >
              {t('project_information')}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('researchers_count')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#748dc8' }}>
                  {calculatedStats.totalStudents}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('supervisors_count')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#ffa94d' }}>
                  {calculatedStats.totalSupervisors}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('host_types')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                  {calculatedStats.uniqueHosts}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {t('parasite_classifications')}:
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#52c41a' }}>
                  {calculatedStats.uniqueTypes}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>


        {/* Empty State */}
        {calculatedStats.totalParasites === 0 && (
          <Box
            sx={{
              mt: 4,
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              backgroundColor: '#3a5a4010',
              borderRadius: { xs: 1.5, md: 2 },
            }}
          >
            <Microscope
              size={48}
              style={{ color: '#3a5a40', marginBottom: '16px', opacity: 0.5 }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#3a5a40',
                mb: 1,
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              {t('no_statistics_data')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}
            >
              {t('start_adding_samples')}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};


export default Statistics;