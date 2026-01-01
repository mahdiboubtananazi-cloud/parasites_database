import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  keyframes,
} from '@mui/material';
import { Search, Microscope, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme/colors';

// Animation للإضاءة المتغيرة
const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 10px 20px rgba(11,43,38,0.15));
    opacity: 0.85;
  }
  50% {
    filter: drop-shadow(0 15px 35px rgba(11,43,38,0.3)) drop-shadow(0 0 20px rgba(58,112,80,0.2));
    opacity: 1;
  }
`;

// Animation للخلفية
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.08);
  }
`;

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: colors.background.default,
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        // تقليل المسافات على الهاتف
        pt: { xs: 1, sm: 2, md: 0 },
        pb: { xs: 2, sm: 3, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 2, sm: 3, md: 6 }}
        >
          {/* النص والأزرار */}
          <Box sx={{ width: { xs: '100%', md: '55%' }, zIndex: 2 }}>
            {/* العنوان */}
            <Typography
              variant="h1"
              sx={{
                color: colors.primary.main,
                fontWeight: 900,
                fontSize: { xs: '1.6rem', sm: '2.2rem', md: '4rem' },
                lineHeight: 1.15,
                letterSpacing: { xs: -0.5, md: -1.5 },
                mb: { xs: 1, sm: 1.5, md: 2.5 },
                textAlign: { xs: 'center', md: isRtl ? 'right' : 'left' },
              }}
            >
              {t('app_title')}
            </Typography>

            {/* الوصف */}
            <Typography
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 400,
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.2rem' },
                lineHeight: 1.6,
                mb: { xs: 2, sm: 2.5, md: 4 },
                maxWidth: '100%',
                borderLeft: isRtl ? 'none' : { xs: 'none', md: `4px solid ${colors.secondary.light}` },
                borderRight: isRtl ? { xs: 'none', md: `4px solid ${colors.secondary.light}` } : 'none',
                borderTop: { xs: `3px solid ${colors.secondary.light}`, md: 'none' },
                pl: isRtl ? 0 : { xs: 0, md: 3 },
                pr: isRtl ? { xs: 0, md: 3 } : 0,
                pt: { xs: 1, md: 0 },
                textAlign: { xs: 'center', md: isRtl ? 'right' : 'left' },
              }}
            >
              {t('hero_description')}
            </Typography>

            {/* الأزرار */}
            <Stack
              direction={{ xs: 'row', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              justifyContent={{ xs: 'center', md: isRtl ? 'flex-end' : 'flex-start' }}
              alignItems="center"
            >
              {/* زر تصفح الأرشيف */}
              <Button
                onClick={() => navigate('/archive')}
                variant="contained"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.05rem' },
                  fontWeight: 700,
                  color: '#fff',
                  bgcolor: colors.primary.main,
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.2, md: 1.5 },
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: `0 8px 25px ${colors.primary.main}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: colors.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 30px ${colors.primary.main}40`,
                  },
                }}
              >
                <Search size={isSmallMobile ? 16 : 20} />
                <span>{t('nav_archive')}</span>
              </Button>

              {/* زر إضافة عينة */}
              <Button
                onClick={() => navigate('/add')}
                variant="outlined"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.05rem' },
                  fontWeight: 700,
                  color: colors.primary.main,
                  borderColor: colors.primary.main,
                  borderWidth: 2,
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.9, sm: 1.1, md: 1.4 },
                  borderRadius: '50px',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.5 },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: colors.primary.main,
                    color: '#fff',
                    borderColor: colors.primary.main,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <span>{t('btn_add_sample')}</span>
                <ArrowIcon size={isSmallMobile ? 16 : 20} />
              </Button>
            </Stack>
          </Box>

          {/* صورة الميكروسكوب */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: { xs: '120px', sm: '160px', md: '450px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              order: { xs: -1, md: 0 },
            }}
          >
            {/* دائرة خلفية متحركة */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: '100px', sm: '140px', md: '380px' },
                height: { xs: '100px', sm: '140px', md: '380px' },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.secondary.light} 0%, ${colors.primary.light}40 50%, transparent 70%)`,
                animation: `${pulseGlow} 4s ease-in-out infinite`,
                zIndex: 0,
              }}
            />

            {/* الميكروسكوب مع Animation */}
            <Box
              sx={{
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${glow} 3s ease-in-out infinite`,
              }}
            >
              <Microscope
                size={isSmallMobile ? 90 : isMobile ? 120 : 340}
                color={colors.primary.main}
                strokeWidth={1.2}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;