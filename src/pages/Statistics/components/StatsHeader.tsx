import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Microscope } from 'lucide-react';

const StatsHeader = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: { xs: 3, md: 5 } }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          color: '#3a5a40',
          mb: 1,
          fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Microscope size={32} />
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
  );
};

export default StatsHeader;
