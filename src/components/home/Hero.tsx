import React from 'react';
import { Box, Container, Typography, Stack, InputBase, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Search, Microscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const HeroSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: colors.background.default,
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, md: 0 },
        pb: { xs: 8, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={6}
        >
          {/* ===== 1. النص والبحث ===== */}
          <Box sx={{ width: { xs: '100%', md: '55%' }, zIndex: 2 }}>
            
            {/* العنوان الضخم */}
            <Typography
              variant="h1"
              sx={{
                color: colors.primary.main,
                fontWeight: 900,
                fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                lineHeight: 0.9,
                letterSpacing: -2,
                mb: 3,
                textTransform: 'uppercase',
              }}
            >
              PARASITOLOGY
              <br />
              <Box component="span" sx={{ color: colors.secondary.light }}>ARCHIVE</Box>
            </Typography>

            {/* الجملة الملهمة */}
            <Typography
              variant="h6"
              sx={{
                color: colors.text.secondary,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                lineHeight: 1.6,
                mb: 6,
                maxWidth: '90%',
                fontStyle: 'italic',
                borderLeft: `4px solid ${colors.secondary.light}`,
                pl: 3,
              }}
            >
              "Unveiling the invisible world, one sample at a time. Preserving knowledge for the future of medicine."
            </Typography>

            {/* شريط البحث الاحترافي المصغر */}
            <Box
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', md: '420px' },
                height: '56px',
                bgcolor: '#fff',
                borderRadius: '50px',
                boxShadow: '0 8px 30px rgba(11, 43, 38, 0.08)',
                border: `1px solid ${colors.primary.lighter}20`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(11, 43, 38, 0.12)',
                  borderColor: colors.primary.light,
                },
                pl: 3,
                pr: 1,
              }}
            >
              <InputBase
                placeholder={t('search_placeholder') || 'Search by scientific name...'}
                sx={{
                  flex: 1,
                  fontSize: '1rem',
                  color: colors.text.primary,
                  '& input::placeholder': {
                    color: colors.text.secondary,
                    opacity: 0.7,
                  },
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  bgcolor: colors.primary.main,
                  color: '#fff',
                  width: '40px',
                  height: '40px',
                  '&:hover': { bgcolor: colors.primary.light },
                }}
              >
                <Search size={20} />
              </IconButton>
            </Box>

          </Box>

          {/* ===== 2. صورة الميكروسكوب الأخضر الداكن ===== */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: { xs: '300px', md: '500px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* دائرة خلفية خفيفة */}
            <Box
              sx={{
                position: 'absolute',
                width: { xs: '250px', md: '450px' },
                height: { xs: '250px', md: '450px' },
                borderRadius: '50%',
                bgcolor: colors.secondary.light,
                opacity: 0.3,
                filter: 'blur(40px)',
                zIndex: 0,
              }}
            />

            {/* الميكروسكوب كأيقونة ضخمة (Placeholder) */}
            <Microscope 
              size={isMobile ? 200 : 380} 
              color={colors.primary.main}
              strokeWidth={1}
              style={{ zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(11,43,38,0.2))' }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
