import React from 'react';
import { Box, Container, Typography, Stack, InputBase, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Search, Microscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const HeroSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: colors.background.default,
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 4, md: 0 },
        pb: { xs: 6, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 4, md: 6 }}
        >
          {/* النص والبحث */}
          <Box sx={{ width: { xs: '100%', md: '55%' }, zIndex: 2 }}>
            {/* العنوان الضخم */}
            <Typography
              variant="h1"
              sx={{
                color: colors.primary.main,
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.8rem', md: '4.5rem' },
                lineHeight: 1.1,
                letterSpacing: { xs: -1, md: -1.5 },
                mb: { xs: 2, md: 3 },
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              {t('app_title')}
            </Typography>

            {/* الجملة الملهمة */}
            <Typography
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 400,
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' },
                lineHeight: 1.6,
                mb: { xs: 3, md: 6 },
                maxWidth: '100%',
                borderLeft: { xs: 'none', md: `4px solid ${colors.secondary.light}` },
                borderTop: { xs: `3px solid ${colors.secondary.light}`, md: 'none' },
                pl: { xs: 0, md: 3 },
                pt: { xs: 2, md: 0 },
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              {t('hero_description')}
            </Typography>

            {/* شريط البحث */}
            <Box
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: { xs: '100%', md: '420px' },
                height: { xs: '50px', md: '56px' },
                bgcolor: '#fff',
                borderRadius: '50px',
                boxShadow: '0 8px 30px rgba(11, 43, 38, 0.08)',
                border: `1px solid ${colors.primary.lighter}20`,
                transition: 'all 0.3s ease',
                mx: { xs: 'auto', md: 0 },
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(11, 43, 38, 0.12)',
                  borderColor: colors.primary.light,
                },
                pl: { xs: 2, md: 3 },
                pr: 1,
              }}
            >
              <InputBase
                placeholder={t('search_placeholder')}
                sx={{
                  flex: 1,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: colors.text.primary,
                  '& input::placeholder': {
                    color: colors.text.secondary,
                    opacity: 0.7,
                    fontSize: { xs: '0.85rem', md: '1rem' },
                  },
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  bgcolor: colors.primary.main,
                  color: '#fff',
                  width: { xs: '36px', md: '40px' },
                  height: { xs: '36px', md: '40px' },
                  '&:hover': { bgcolor: colors.primary.light },
                }}
              >
                <Search size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* صورة الميكروسكوب */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: { xs: '180px', sm: '250px', md: '500px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              order: { xs: -1, md: 0 },
            }}
          >
            {/* دائرة خلفية */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: '150px', sm: '200px', md: '450px' },
                height: { xs: '150px', sm: '200px', md: '450px' },
                borderRadius: '50%',
                bgcolor: colors.secondary.light,
                opacity: 0.3,
                filter: 'blur(40px)',
                zIndex: 0,
              }}
            />

            {/* الميكروسكوب */}
            <Microscope
              size={isSmallMobile ? 120 : isMobile ? 160 : 380}
              color={colors.primary.main}
              strokeWidth={1}
              style={{ 
                zIndex: 1, 
                filter: 'drop-shadow(0 20px 30px rgba(11,43,38,0.2))',
                opacity: isSmallMobile ? 0.8 : 1,
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
