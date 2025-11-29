import React, { useEffect, useState } from 'react';
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
import { Microscope, Image as ImageIcon, Database } from 'lucide-react';
import { colors } from '../theme/colors';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const Statistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [stats, setStats] = useState({
    totalParasites: 0,
    totalImages: 0,
    totalSamples: 0,
  });

  const hostDistribution = [
    { name: 'Fish', value: 0 },
    { name: 'Birds', value: 0 },
    { name: 'Mammals', value: 0 },
    { name: 'Reptiles', value: 0 },
    { name: 'Others', value: 0 },
  ];

  const sampleSourceDistribution = [
    { name: 'Blood', value: 0 },
    { name: 'Tissue', value: 0 },
    { name: 'Feces', value: 0 },
    { name: 'Skin', value: 0 },
    { name: 'Other', value: 0 },
  ];

  const parasiteTypes = [
    { name: 'Protozoa', value: 0 },
    { name: 'Helminths', value: 0 },
    { name: 'Ectoparasites', value: 0 },
  ];

  const monthlyAdditions = [
    { month: 'Jan', parasites: 0, images: 0 },
    { month: 'Feb', parasites: 0, images: 0 },
    { month: 'Mar', parasites: 0, images: 0 },
    { month: 'Apr', parasites: 0, images: 0 },
    { month: 'May', parasites: 0, images: 0 },
    { month: 'Jun', parasites: 0, images: 0 },
  ];

  useEffect(() => {
    // API call later
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Total Parasites',
      value: stats.totalParasites,
      icon: <Microscope size={32} />,
      color: colors.primary.main,
      bgColor: `${colors.primary.main}15`,
    },
    {
      title: 'Total Images',
      value: stats.totalImages,
      icon: <ImageIcon size={32} />,
      color: colors.secondary.main,
      bgColor: `${colors.secondary.main}15`,
    },
    {
      title: 'Total Samples',
      value: stats.totalSamples,
      icon: <Database size={32} />,
      color: colors.info.main,
      bgColor: `${colors.info.main}15`,
    },
  ];

  const COLORS = [
    colors.primary.main,
    colors.secondary.main,
    colors.success.main,
    colors.warning.main,
    colors.info.main,
  ];

  return (
    <Box sx={{ py: 4, backgroundColor: colors.background.default, minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
            Archive Statistics
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Overview of parasites, samples, and images in the database
          </Typography>
        </Box>

        {/* Stat Cards - Using Flexbox */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {statCards.map((card) => (
            <Box key={card.title} sx={{ flex: '1 1 300px', minWidth: '280px' }}>
              <Card
                sx={{
                  background: '#ffffff',
                  border: `1px solid ${colors.primary.lighter}20`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(58, 90, 64, 0.12)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
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
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Charts Section - Using Flexbox */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Host Distribution */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Paper sx={{ p: 3, background: '#ffffff', borderRadius: 2, border: `1px solid ${colors.primary.lighter}20`, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>Distribution by Host Animal</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={hostDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {hostDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Sample Source */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Paper sx={{ p: 3, background: '#ffffff', borderRadius: 2, border: `1px solid ${colors.primary.lighter}20`, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>Distribution by Sample Source</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={sampleSourceDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {sampleSourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Parasite Types */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Paper sx={{ p: 3, background: '#ffffff', borderRadius: 2, border: `1px solid ${colors.primary.lighter}20`, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>Parasite Types</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={parasiteTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={colors.primary.main} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Monthly Trend */}
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
            <Paper sx={{ p: 3, background: '#ffffff', borderRadius: 2, border: `1px solid ${colors.primary.lighter}20`, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>Monthly Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyAdditions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="parasites" stroke={colors.primary.main} strokeWidth={2} />
                  <Line type="monotone" dataKey="images" stroke={colors.secondary.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Empty State */}
        {stats.totalParasites === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: colors.text.secondary }}>
              📊 No data yet. Start adding parasites and samples to see statistics!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Statistics;
