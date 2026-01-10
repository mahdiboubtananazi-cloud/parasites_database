import React from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { UserPlus, LogIn, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';

const CtaSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  // إذا كان المستخدم مسجلاً بالفعل، لا داعي لعرض زر التسجيل
  // يمكننا عرض زر "لوحة التحكم" بدلاً منه
  if (user) {
    return (
      <Box sx={{ py: 8, bgcolor: colors.background.default }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* زخرفة خلفية */}
            <Users size={300} style={{ position: 'absolute', right: -50, top: -50, opacity: 0.1 }} />
            
            <Stack spacing={2} alignItems="center" position="relative" zIndex={1}>
              <Typography variant="h4" fontWeight={800}>
                {t('welcome_back', { defaultValue: 'مرحباً بعودتك،' })} {user.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500 }}>
                {t('dashboard_prompt', { defaultValue: 'تابع مساهماتك وشارك في تطوير المحتوى العلمي.' })}
              </Typography>
              <Button
                onClick={() => navigate('/review')}
                variant="contained"
                sx={{
                  bgcolor: '#fff',
                  color: colors.primary.main,
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  borderRadius: 50,
                  mt: 2,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                {t('go_to_dashboard', { defaultValue: 'الذهاب إلى لوحة التحكم' })}
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  // للزوار غير المسجلين
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: colors.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background: '#1a2e25', // لون غامق مميز (Dark Green)
            color: '#fff',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(26, 46, 37, 0.15)',
          }}
        >
          {/* زخرفة خلفية */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.05) 0%, transparent 20%), radial-gradient(circle at 90% 90%, rgba(255,255,255,0.05) 0%, transparent 20%)',
            }}
          />

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', mb: 1 }}>
              <Users size={40} color="#FFD700" />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.8rem', md: '2.8rem' },
                lineHeight: 1.2,
              }}
            >
              {t('join_community_title', { defaultValue: 'انضم إلى مجتمعنا الأكاديمي' })}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                maxWidth: '650px',
                lineHeight: 1.6,
              }}
            >
              {t('join_community_desc', { defaultValue: 'كن جزءاً من المشروع العلمي الرائد. سجل حسابك الآن للمساهمة في توثيق العينات ومشاركة المعرفة مع زملائك.' })}
            </Typography>

            {/* الأزرار */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                onClick={() => navigate('/register')}
                startIcon={<UserPlus size={20} />}
                sx={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#1a2e25',
                  bgcolor: '#FFD700', // لون ذهبي مميز للـ CTA
                  px: { xs: 4, md: 6 },
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    bgcolor: '#ffca28',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {t('create_account', { defaultValue: 'إنشاء حساب باحث' })}
              </Button>

              <Button
                onClick={() => navigate('/login')}
                startIcon={<LogIn size={20} />}
                sx={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  px: { xs: 4, md: 5 },
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                {t('login', { defaultValue: 'تسجيل الدخول' })}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CtaSection;