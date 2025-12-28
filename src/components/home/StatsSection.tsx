import React from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
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

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { t } = useTranslation();

  const statsConfig = [
    {
      key: 'total',
      label: t('stats_total_parasites'),
      value: stats.total,
      suffix: '+',
    },
    {
      key: 'types',
      label: t('stats_unique_types'),
      value: stats.types,
      suffix: '',
    },
    {
      key: 'recent',
      label: t('stats_sample_registered'),
      value: stats.recent,
      suffix: '',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: colors.background.default,
        borderTop: `1px solid ${colors.primary.lighter}15`,
        borderBottom: `1px solid ${colors.primary.lighter}15`
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-around"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: 'none', md: 'block' },
                borderColor: `${colors.primary.lighter}30`,
                height: '60px',
                alignSelf: 'center'
              }}
            />
          }
          spacing={{ xs: 6, md: 0 }}
        >
          {statsConfig.map((item) => (
            <Box
              key={item.key} 
              sx={{
                textAlign: 'center',
                width: { xs: '100%', md: 'auto' }
              }}
            >
              {/* الرقم الضخم */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '3.5rem', md: '4.5rem' },
                  color: colors.primary.main,
                  lineHeight: 1,
                  mb: 1,
                  letterSpacing: -2,
                }}
              >
                {item.value}{item.suffix}
              </Typography>

              {/* العنوان */}
              <Typography
                variant="overline"
                sx={{
                  color: colors.text.secondary,
                  fontWeight: 700,
                  letterSpacing: 2,
                  fontSize: '0.8rem',
                  display: 'block',
                  opacity: 0.8
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default StatsSection;
