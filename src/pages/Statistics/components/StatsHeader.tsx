import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Microscope, BarChart3 } from 'lucide-react';
import { colors } from '../../../theme/colors';

const StatsHeader = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: { xs: 4, md: 6 }, position: 'relative' }}>
      
      {/* أيقونة خلفية تزيينية */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: 20,
          opacity: 0.05,
          color: colors.primary.main,
          transform: 'rotate(15deg)',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <BarChart3 size={120} strokeWidth={1} />
      </Box>

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
              color: '#fff',
              boxShadow: `0 8px 20px ${colors.primary.main}40`,
            }}
          >
            <Microscope size={32} />
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              // تدرج لوني للنص
              background: `linear-gradient(45deg, ${colors.primary.dark}, ${colors.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              letterSpacing: -0.5,
            }}
          >
            {t('stats_title', { defaultValue: 'الإحصائيات والتحليلات' })}
          </Typography>
        </Stack>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.15rem' },
            maxWidth: 700,
            lineHeight: 1.6,
            pl: { md: 9 }, // محاذاة مع العنوان (تجاوز الأيقونة)
          }}
        >
          {t('stats_subtitle', { defaultValue: 'نظرة شاملة ودقيقة على بيانات العينات، التوزيع الجغرافي، ونشاط الباحثين في المنصة.' })}
        </Typography>
      </Stack>
    </Box>
  );
};

export default StatsHeader;