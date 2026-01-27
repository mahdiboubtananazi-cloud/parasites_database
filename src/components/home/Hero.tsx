import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Grid,
} from '@mui/material';
import { Search, ArrowRight, ArrowLeft, Dna, Bug, Activity, Microscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colors } from '../../theme/colors';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        minHeight: { xs: '85vh', md: '90vh' },
        display: 'flex',
        // في الموبايل: flex-start يرفع العنصر لأعلى الحاوية
        alignItems: { xs: 'flex-start', md: 'center' },
        // تقليل الـ padding لأقصى حد (فقط مسافة الناف بار)
        pt: { xs: 10, md: 0 }, 
        pb: { xs: 0, md: 0 },
      }}
    >
      {/* خلفية ناعمة */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
        background: `radial-gradient(circle at 50% 50%, ${alpha(colors.primary.main, 0.03)} 0%, transparent 50%)`,
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          
          {/* ================= النص والأزرار ================= */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ 
                textAlign: { xs: 'center', md: isRtl ? 'right' : 'left' },
                // رفع إضافي في الموبايل باستخدام مارجن سالب بسيط لتقليل الفراغ
                mt: { xs: -2, md: 0 } 
              }}
            >
              <Typography variant="h1" sx={{
                color: '#111827',
                fontWeight: 900,
                fontSize: { xs: '3.2rem', sm: '4rem', md: '4.5rem' },
                lineHeight: { xs: 1.1, md: 1.1 },
                mb: 2,
                letterSpacing: '-0.03em'
              }}>
                {t('app_title')}
              </Typography>

              <Typography variant="h6" sx={{
                color: '#4B5563',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.5,
                mb: 4,
                fontWeight: 400,
                maxWidth: { xs: '100%', md: '90%' },
                mx: { xs: 'auto', md: 0 }
              }}
            >
                {t('hero_description')}
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                justifyContent={{ xs: 'center', md: isRtl ? 'flex-start' : 'flex-start' }}
              >
                <Button
                  onClick={() => navigate('/archive')}
                  variant="contained"
                  size="large"
                  startIcon={<Search size={20} />}
                  sx={{
                    py: 1.8, px: 5, borderRadius: 50,
                    bgcolor: '#111827', 
                    color: '#fff',
                    fontSize: '1rem', fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                    boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' }
                  }}
                >
                  {t('nav_archive')}
                </Button>
                
                <Button
                  onClick={() => navigate('/add')}
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowIcon size={20} />}
                  sx={{
                    py: 1.8, px: 5, borderRadius: 50,
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    fontSize: '1rem', fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                    bgcolor: '#fff',
                    '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' }
                  }}
                >
                  {t('btn_add_sample')}
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* ================= العنصر البصري (طبق بتري مخبري) ================= */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
             <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              sx={{ position: 'relative', width: 450, height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             >
                {/* الدائرة الخارجية (الزجاج) */}
                <Box sx={{
                   position: 'relative',
                   width: 380, height: 380,
                   borderRadius: '50%',
                   background: 'linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)',
                   border: '1px solid rgba(16, 185, 129, 0.1)',
                   boxShadow: '0 20px 60px rgba(0,0,0,0.05), inset 0 0 20px rgba(16, 185, 129, 0.05)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   overflow: 'hidden' // لإخفاء العناصر التي تخرج عن الحدود
                }}>
                   
                   {/* أيقونات عائمة ترمز للطفيليات والجينات */}
                   
                   {/* 1. رمز DNA */}
                   <Box component={motion.div} 
                        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} 
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        sx={{ position: 'absolute', top: '25%', left: '25%', color: alpha(colors.primary.main, 0.2) }}>
                      <Dna size={80} />
                   </Box>

                   {/* 2. رمز حشرة/طفيلي */}
                   <Box component={motion.div} 
                        animate={{ y: [10, -10, 10], x: [-5, 5, -5] }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        sx={{ position: 'absolute', bottom: '30%', right: '25%', color: alpha('#10B981', 0.2) }}>
                      <Bug size={60} />
                   </Box>

                   {/* 3. رمز نشاط حيوي */}
                   <Box component={motion.div} 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        sx={{ position: 'absolute', color: alpha('#F59E0B', 0.2) }}>
                      <Activity size={120} />
                   </Box>

                   {/* العدسة المركزية الواضحة */}
                   <Box sx={{
                     position: 'absolute',
                     width: 120, height: 120,
                     borderRadius: '50%',
                     bgcolor: '#fff',
                     boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                     zIndex: 10
                   }}>
                      <Microscope size={50} color={colors.primary.main} />
                   </Box>
                   
                   {/* نقاط صغيرة تتحرك في الخلفية */}
                   {[...Array(8)].map((_, i) => (
                      <Box
                        key={i}
                        component={motion.div}
                        animate={{ 
                          x: [Math.random() * 100 - 50, Math.random() * -100 + 50],
                          y: [Math.random() * 100 - 50, Math.random() * -100 + 50],
                        }}
                        transition={{ duration: 5 + i, repeat: Infinity, repeatType: 'reverse' }}
                        sx={{
                          position: 'absolute',
                          width: 6, height: 6, borderRadius: '50%',
                          bgcolor: i % 2 === 0 ? colors.primary.main : '#10B981',
                          opacity: 0.4
                        }}
                      />
                   ))}
                </Box>
             </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;