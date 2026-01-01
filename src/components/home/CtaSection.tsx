import React from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { ArrowRight, ArrowLeft, Microscope, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const CtaSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Box
      sx={{
        py: { xs: 5, md: 10 },
        bgcolor: colors.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* خلفية */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, ${colors.primary.light}06 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, ${colors.secondary.light}06 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: { xs: 4, md: 6 },
            background: `linear-gradient(135deg, ${colors.primary.main}06 0%, ${colors.secondary.light}10 100%)`,
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
              top: -30,
              right: isRtl ? 'auto' : -30,
              left: isRtl ? -30 : 'auto',
              opacity: 0.04,
              color: colors.primary.main,
              transform: 'rotate(-15deg)',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Microscope size={220} strokeWidth={1} />
          </Box>

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: colors.primary.dark,
                fontWeight: 900,
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
                letterSpacing: -0.5,
                lineHeight: 1.3,
              }}
            >
              {t('cta_title', { defaultValue: 'ساهم في إثراء قاعدة البيانات' })}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                maxWidth: '550px',
                lineHeight: 1.7,
              }}
            >
              {t('cta_description', { defaultValue: 'شارك في بناء أكبر مكتبة رقمية للطفيليات في الجزائر' })}
            </Typography>

            {/* الأزرار */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 1 }}
            >
              {/* زر إضافة عينة */}
              <Button
                onClick={() => navigate('/add')}
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                  color: '#fff',
                  bgcolor: colors.primary.main,
                  px: { xs: 3, md: 4 },
                  py: 1.4,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: `0 8px 25px ${colors.primary.main}25`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: colors.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 30px ${colors.primary.main}35`,
                  },
                }}
              >
                <span>{t('btn_add_sample')}</span>
                <ArrowIcon size={18} />
              </Button>

              {/* زر تصفح الأرشيف */}
              <Button
                onClick={() => navigate('/archive')}
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontWeight: 700,
                  color: colors.primary.main,
                  bgcolor: 'transparent',
                  border: `2px solid ${colors.primary.main}`,
                  px: { xs: 3, md: 4 },
                  py: 1.3,
                  borderRadius: '50px',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: colors.primary.main,
                    color: '#fff',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <FolderOpen size={18} />
                <span>{t('nav_archive')}</span>
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CtaSection;