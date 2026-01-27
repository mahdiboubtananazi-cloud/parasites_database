import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { UserPlus, ArrowRight, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const CtaSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="md">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            background: 'linear-gradient(135deg, #134E4A 0%, #0F3D39 100%)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 6 },
            textAlign: 'center',
            boxShadow: '0 10px 30px -5px rgba(19, 78, 74, 0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* زخرفة خفيفة */}
          <Box 
            sx={{
              position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.05) 0%, transparent 25%)',
              zIndex: 0
            }} 
          />
          
          <Box sx={{ position: 'relative', zIndex: 10 }}>
            
            {/* الشارة العلوية */}
            <Stack direction="row" justifyContent="center" mb={2}>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                bgcolor: 'rgba(255,255,255,0.1)',
                px: 1.5, py: 0.5, borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <ShieldCheck size={16} color="#FFFFFF" />
                <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t('secure_access', { defaultValue: 'Accès Réservé' })}
                </Typography>
              </Box>
            </Stack>

            {/* العنوان */}
            <Typography 
              variant="h4"
              sx={{ 
                fontWeight: 700, mb: 4, color: '#FFFFFF',
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              {user ? t('welcome_back_user', { name: user.name }) : t('join_community_title')}
            </Typography>

            {/* الأزرار مع تعديل المسافات */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center" 
              alignItems="center"
              sx={{ width: '100%' }}
            >
              {user ? (
                <Button
                  onClick={() => navigate('/add')}
                  variant="contained"
                  sx={{
                    bgcolor: '#FFFFFF', color: '#134E4A',
                    px: 4, py: 1.2, borderRadius: 2, fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { bgcolor: '#F0FDF4' },
                    // إضافة مسافة للأيقونة
                    '& .MuiButton-endIcon': { marginLeft: '12px' }
                  }}
                  endIcon={<ArrowRight size={18} />}
                >
                  {t('start_now')}
                </Button>
              ) : (
                <>
                  {/* زر إنشاء حساب */}
                  <Button
                    onClick={() => navigate('/register')}
                    variant="contained"
                    startIcon={<UserPlus size={18} />}
                    sx={{
                      bgcolor: '#FFFFFF !important', 
                      color: '#134E4A !important',
                      px: 4, py: 1.2,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      width: { xs: '100%', sm: 'auto' },
                      boxShadow: '0 4px 12px rgb(254, 249, 249)',
                      '&:hover': { bgcolor: '#f1f5f9 !important', transform: 'translateY(-1px)' },
                      
                      // === هنا المسافة السحرية بين الأيقونة والكلمة ===
                      '& .MuiButton-startIcon': { marginRight: '12px' } 
                    }}
                  >
                    {t('create_account')}
                  </Button>
                  
                  {/* زر الدخول (أبيض ناصع) */}
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outlined"
                    startIcon={<LogIn size={18} />}
                    sx={{
                      color: '#FFFFFF !important', // أبيض ناصع للكتابة
                      borderColor: 'rgba(255,255,255,0.5)',
                      px: 4, py: 1.2,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': { 
                        borderColor: '#FFFFFF', 
                        bgcolor: 'rgba(255,255,255,0.1)'
                      },
                      
                      // === هنا المسافة السحرية بين الأيقونة والكلمة ===
                      '& .MuiButton-startIcon': { marginRight: '13px' } 
                    }}
                  >
                    {t('login')}
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CtaSection;