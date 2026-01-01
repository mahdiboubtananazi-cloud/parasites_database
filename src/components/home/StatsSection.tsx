import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, Stack, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Microscope, Layers, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

interface Stats {
  total: number;
  types: number;
  recent: number;
}

interface StatsSectionProps {
  stats: Stats;
}

// Hook للـ Count-up Animation
const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, hasStarted]);

  return { count, ref };
};

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const totalCounter = useCountUp(stats.total, 1500);
  const typesCounter = useCountUp(stats.types, 1200);
  const recentCounter = useCountUp(stats.recent, 1400);

  const statsConfig = [
    {
      key: 'total',
      label: t('stats_total_parasites'),
      value: totalCounter.count,
      suffix: '+',
      icon: Microscope,
      color: colors.primary.main,
    },
    {
      key: 'types',
      label: t('stats_unique_types'),
      value: typesCounter.count,
      suffix: '',
      icon: Layers,
      color: colors.secondary.main,
    },
    {
      key: 'recent',
      label: t('stats_sample_registered'),
      value: recentCounter.count,
      suffix: '',
      icon: Clock,
      color: '#32b8c6',
    },
  ];

  // على الهاتف: بطاقة واحدة تحتوي كل الإحصائيات
  if (isMobile) {
    return (
      <Box
        ref={totalCounter.ref}
        sx={{
          py: { xs: 4, sm: 5 },
          bgcolor: colors.background.default,
          borderTop: `1px solid ${colors.primary.lighter}15`,
          borderBottom: `1px solid ${colors.primary.lighter}15`,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${colors.primary.main}08 0%, ${colors.secondary.light}12 100%)`,
              border: `1px solid ${colors.primary.lighter}20`,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              divider={
                <Box
                  sx={{
                    width: '1px',
                    height: '50px',
                    bgcolor: `${colors.primary.lighter}30`,
                  }}
                />
              }
            >
              {statsConfig.map((item) => {
                const Icon = item.icon;
                return (
                  <Box key={item.key} sx={{ textAlign: 'center' }}>
                    <Icon size={24} color={item.color} style={{ marginBottom: 8 }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.8rem',
                        color: colors.primary.main,
                        lineHeight: 1,
                      }}
                    >
                      {item.value}{item.suffix}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        display: 'block',
                        mt: 0.5,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  // على الديسكتوب: 3 بطاقات منفصلة
  return (
    <Box
      sx={{
        py: { md: 8 },
        bgcolor: colors.background.default,
        borderTop: `1px solid ${colors.primary.lighter}15`,
        borderBottom: `1px solid ${colors.primary.lighter}15`,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="center"
          spacing={4}
        >
          {statsConfig.map((item) => {
            const Icon = item.icon;
            return (
              <Paper
                key={item.key}
                ref={item.key === 'total' ? totalCounter.ref : undefined}
                elevation={0}
                sx={{
                  flex: 1,
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${item.color}08 0%, ${item.color}04 100%)`,
                  border: `1px solid ${item.color}15`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 15px 40px ${item.color}12`,
                    borderColor: `${item.color}30`,
                  },
                }}
              >
                {/* الأيقونة */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    bgcolor: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: `0 8px 20px ${item.color}25`,
                  }}
                >
                  <Icon size={26} color="#fff" strokeWidth={2} />
                </Box>

                {/* الرقم */}
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: '3rem',
                    color: colors.primary.main,
                    lineHeight: 1,
                    mb: 1,
                    letterSpacing: -1,
                  }}
                >
                  {item.value}
                  {item.suffix}
                </Typography>

                {/* العنوان */}
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  {item.label}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
};

export default StatsSection;