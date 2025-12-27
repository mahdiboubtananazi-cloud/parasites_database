import React from 'react';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { Microscope, Image as ImageIcon, Users, Award, Activity, Beaker } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}

interface StatCardGridProps {
  stats: {
    totalParasites: number;
    totalImages: number;
    totalStudents: number;
    totalSupervisors: number;
    uniqueHosts: number;
    uniqueTypes: number;
    averageParasitesPerStudent: string;
  };
  isMobile: boolean;
}

const StatCardGrid: React.FC<StatCardGridProps> = ({ stats, isMobile }) => {
  const { t } = useTranslation();

  const cards: StatCard[] = [
    {
      title: t('stats_total_parasites'),
      value: stats.totalParasites,
      icon: <Microscope size={32} />,
      color: '#3a5a40',
      bgColor: '#3a5a4015',
      subtitle: t('stats_registered_samples'),
    },
    {
      title: t('stats_uploaded_images'),
      value: stats.totalImages,
      icon: <ImageIcon size={32} />,
      color: '#32b8c6',
      bgColor: '#32b8c615',
      subtitle: t('stats_microscopic_image'),
    },
    {
      title: t('stats_researchers'),
      value: stats.totalStudents,
      icon: <Users size={32} />,
      color: '#748dc8',
      bgColor: '#748dc815',
      subtitle: t('stats_student_researcher'),
    },
    {
      title: t('stats_supervisors'),
      value: stats.totalSupervisors,
      icon: <Award size={32} />,
      color: '#ffa94d',
      bgColor: '#ffa94d15',
      subtitle: t('stats_supervisor'),
    },
    {
      title: t('stats_host_types'),
      value: stats.uniqueHosts,
      icon: <Activity size={32} />,
      color: '#ff6b6b',
      bgColor: '#ff6b6b15',
      subtitle: t('stats_different_host'),
    },
    {
      title: t('stats_classifications'),
      value: stats.uniqueTypes,
      icon: <Beaker size={32} />,
      color: '#52c41a',
      bgColor: '#52c41a15',
      subtitle: t('stats_type'),
    },
  ];

  return (
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
      {cards.map((card, idx) => (
        <Card
          key={idx}
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
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
  );
};

export default StatCardGrid;
