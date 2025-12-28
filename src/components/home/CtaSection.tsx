import React from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { ArrowRight, Microscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const CtaSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 12, bgcolor: colors.background.default, position: 'relative', overflow: 'hidden' }}>

      {/* خلفية تزيينية */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '100%',
          background: `radial-gradient(circle, ${colors.primary.light}10 0%, transparent 70%)`,
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
            border: `1px solid ${colors.primary.light}20`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* أيقونة خلفية */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              left: -20,
              opacity: 0.06, 
              color: colors.primary.main,
              transform: 'rotate(-15deg)'
            }}
          >
            <Microscope size={200} strokeWidth={1.5} />
          </Box>

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: colors.primary.dark,
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: -1,
                lineHeight: 1.2
              }}
            >
              {t('btn_contribute')}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                mb: 4,
                fontSize: '1.15rem',
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              {t('hero_subtitle')}
            </Typography>

            {/* الزر */}
            <Button
              onClick={() => navigate('/add')}
              endIcon={<ArrowRight size={20} />}
              sx={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                bgcolor: colors.primary.main,
                px: 5,
                py: 1.8,
                borderRadius: '50px',
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(11, 43, 38, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: colors.primary.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 35px rgba(11, 43, 38, 0.25)',
                  gap: 1.5
                }
              }}
            >
              {t('btn_add_sample')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CtaSection;
