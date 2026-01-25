import React from 'react';
import {
  Box, Container, Typography, Button, Paper, Stack, useTheme, useMediaQuery, alpha
} from '@mui/material';
import { UserPlus, LogIn, Users, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';

const CtaSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✨ بعد التسجيل - بطاقة واضحة تماماً
  if (user) {
    return (
      <Box sx={{ 
        py: { xs: 6, sm: 8, md: 10 }, 
        bgcolor: alpha(colors.primary.dark, 0.03),
        position: 'relative'
      }}>
        <Container maxWidth="sm">
          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              color: '#1a1f23',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(26,46,37,0.08)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            {/* 👑 Premium badge صغير */}
            <Box sx={{
              position: 'absolute',
              top: 16, right: 16,
              background: 'linear-gradient(45deg, #10b981, #059669)',
              p: 1, borderRadius: 2,
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              minWidth: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Crown size={16} color="white" strokeWidth={2.5} />
            </Box>

            <Stack spacing={2.5} alignItems="center">
              <Users size={isMobile ? 48 : 56} color="#10b981" />
              
              <Typography 
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ 
                  fontWeight: 800,
                  color: '#1a1f23',
                  lineHeight: 1.3,
                  fontSize: { xs: '1.4rem', md: '1.8rem' }
                }}
              >
                مرحباً {user.name} ✨
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(26,31,35,0.8)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.6,
                  px: { xs: 1, md: 2 }
                }}
              >
                {t('dashboard_prompt', { defaultValue: 'ابدأ بإضافة عينات جديدة أو راجع الإسهامات.' })}
              </Typography>

              <Button
                onClick={() => navigate('/add')}
                variant="contained"
                startIcon={<ArrowRight size={18} />}
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  px: { xs: 3, md: 4 },
                  py: 1.2,
                  borderRadius: 25,
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                  minWidth: { xs: 140, md: 180 },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.4)'
                  }
                }}
              >
                ابدأ الآن
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  // 📱 للزوار - تصميم جذاب + نصوص واضحة
  return (
    <Box sx={{ 
      py: { xs: 6, sm: 8, md: 12 }, 
      background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.04)} 0%, ${alpha(colors.primary.dark, 0.02)} 100%)`
    }}>
      <Container maxWidth={isMobile ? "sm" : "lg"}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5, md: 7 },
            borderRadius: { xs: 2.5, md: 4 },
            background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
            color: '#1a1f23',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(26,46,37,0.06)',
            border: '1px solid rgba(229,231,235,0.8)',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {/* 🎯 Icon badge */}
          <Box sx={{
            position: 'absolute',
            top: -25, left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            p: 1.5, borderRadius: '50%',
            boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
            minWidth: 60, height: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Users size={28} color="white" strokeWidth={2.5} />
          </Box>

          <Stack spacing={3} alignItems="center">
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 800,
                color: '#1a1f23',
                lineHeight: 1.3,
                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.025em'
              }}
            >
              انضم للمشرفين والطلبة
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(26,31,35,0.85)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
                maxWidth: 550,
                px: 1
              }}
            >
              سجّل حسابك لإضافة العينات العلمية، مراجعتها، والمساهمة في قاعدة البيانات
            </Typography>

            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={2} 
              sx={{ width: isMobile ? "100%" : "auto" }}
            >
              <Button
                onClick={() => navigate('/register')}
                startIcon={<UserPlus size={20} />}
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  px: { xs: 3, md: 5 },
                  py: 1.5,
                  borderRadius: 28,
                  boxShadow: '0 6px 20px rgba(16,185,129,0.3)',
                  minWidth: isMobile ? undefined : 200,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(16,185,129,0.4)'
                  }
                }}
              >
                إنشاء حساب باحث
              </Button>

              <Button
                onClick={() => navigate('/login')}
                startIcon={<LogIn size={20} />}
                size={isMobile ? "medium" : "large"}
                fullWidth={isMobile}
                variant="outlined"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  color: '#374151',
                  borderColor: 'rgba(55,65,81,0.3)',
                  borderWidth: 1.5,
                  px: { xs: 3, md: 4 },
                  py: 1.5,
                  borderRadius: 28,
                  minWidth: isMobile ? undefined : 180,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#10b981',
                    color: '#10b981',
                    backgroundColor: alpha('#10b981', 0.08),
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                لدي حساب
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CtaSection;