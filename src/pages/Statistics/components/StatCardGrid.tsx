import React from 'react';
import { Box, Card, CardContent, Typography, Stack, useTheme } from '@mui/material';
import { Microscope, Image as ImageIcon, Users, Award, Activity, Beaker } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';

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
  const theme = useTheme();

  const cards: StatCard[] = [
    {
      title: t('stats_total_parasites', { defaultValue: 'إجمالي الطفيليات' }),
      value: stats.totalParasites,
      icon: <Microscope size={28} />,
      color: colors.primary.main,
      bgColor: `${colors.primary.main}15`,
      subtitle: t('stats_registered_samples', { defaultValue: 'عينة مسجلة' }),
    },
    {
      title: t('stats_uploaded_images', { defaultValue: 'الصور المرفوعة' }),
      value: stats.totalImages,
      icon: <ImageIcon size={28} />,
      color: colors.secondary.main,
      bgColor: `${colors.secondary.main}15`,
      subtitle: t('stats_microscopic_image', { defaultValue: 'صورة مجهرية' }),
    },
    {
      title: t('stats_researchers', { defaultValue: 'الباحثين' }),
      value: stats.totalStudents,
      icon: <Users size={28} />,
      color: '#32b8c6',
      bgColor: '#32b8c615',
      subtitle: t('stats_student_researcher', { defaultValue: 'باحث نشط' }),
    },
    {
      title: t('stats_supervisors', { defaultValue: 'المشرفين' }),
      value: stats.totalSupervisors,
      icon: <Award size={28} />,
      color: '#ffa94d',
      bgColor: '#ffa94d15',
      subtitle: t('stats_supervisor', { defaultValue: 'مشرف أكاديمي' }),
    },
    {
      title: t('stats_host_types', { defaultValue: 'أنواع العوائل' }),
      value: stats.uniqueHosts,
      icon: <Activity size={28} />,
      color: '#ff6b6b',
      bgColor: '#ff6b6b15',
      subtitle: t('stats_different_host', { defaultValue: 'عائل مختلف' }),
    },
    {
      title: t('stats_classifications', { defaultValue: 'التصنيفات' }),
      value: stats.uniqueTypes,
      icon: <Beaker size={28} />,
      color: '#52c41a',
      bgColor: '#52c41a15',
      subtitle: t('stats_type', { defaultValue: 'تصنيف فريد' }),
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
        gap: 3,
        mb: 4,
      }}
    >
      {cards.map((card, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            height: '100%',
            overflow: 'visible',
            '&:hover': {
              transform: isMobile ? 'none' : 'translateY(-5px)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              borderColor: `${card.color}40`,
            },
          }}
        >
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 0.5,
                    mb: 1,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#264653',
                    fontSize: '2rem',
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {card.value}
                </Typography>
                {card.subtitle && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: card.color,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      display: 'inline-block',
                      bgcolor: card.bgColor,
                      px: 1,
                      py: 0.2,
                      borderRadius: 1,
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                )}
              </Box>
              
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%', // دائري بالكامل
                  backgroundColor: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  boxShadow: `0 4px 12px ${card.color}20`,
                }}
              >
                {card.icon}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatCardGrid;