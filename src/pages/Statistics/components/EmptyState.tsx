import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Microscope, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/colors'; // تأكد من المسار الصحيح

const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        textAlign: 'center',
        py: { xs: 8, md: 10 },
        px: 2,
        backgroundColor: '#fff',
        borderRadius: 4,
        border: `1px dashed ${colors.primary.lighter}50`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: '50%',
          bgcolor: `${colors.primary.main}08`,
          color: colors.primary.main,
          mb: 1,
        }}
      >
        <Microscope size={64} strokeWidth={1.5} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: colors.text.primary,
          fontWeight: 700,
          fontSize: { xs: '1.1rem', md: '1.25rem' },
        }}
      >
        {t('stats_no_data_found', { defaultValue: 'لا توجد بيانات إحصائية حالياً' })}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          maxWidth: 400, 
          mx: 'auto',
          mb: 2,
          fontSize: { xs: '0.9rem', md: '1rem' } 
        }}
      >
        {t('stats_add_samples', { defaultValue: 'ابدأ بإضافة عينات وطفيليات لترى الإحصائيات والتحليلات البيانية هنا.' })}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/add')}
        startIcon={<PlusCircle size={18} />}
        sx={{
          bgcolor: colors.primary.main,
          color: '#fff',
          px: 4,
          py: 1.2,
          borderRadius: 50,
          textTransform: 'none',
          fontSize: '0.95rem',
          boxShadow: `0 8px 20px ${colors.primary.main}30`,
          '&:hover': {
            bgcolor: colors.primary.dark,
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 25px ${colors.primary.main}40`,
          },
          transition: 'all 0.3s ease',
        }}
      >
        {t('btn_add_sample', { defaultValue: 'إضافة عينة جديدة' })}
      </Button>
    </Paper>
  );
};

export default EmptyState;