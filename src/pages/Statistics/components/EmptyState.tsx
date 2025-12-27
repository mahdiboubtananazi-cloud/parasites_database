import React from 'react';
import { Box, Typography } from '@mui/material';
import { Microscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
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
        style={{ color: '#3a5a40', marginBottom: 16, opacity: 0.5 }}
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
  );
};

export default EmptyState;
