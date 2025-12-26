import React from 'react';
import { Box, Container, Typography, Stack, Link, Divider, IconButton } from '@mui/material';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react'; // أيقونات للتواصل الاجتماعي
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <Box 
      sx={{ 
        bgcolor: '#020d0e', // لون غامق جداً (Dark Teal) لختام الصفحة
        color: 'rgba(255,255,255,0.7)', 
        pt: 8, 
        pb: 4, 
        borderTop: '1px solid rgba(255,255,255,0.05)' 
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, 
            gap: 8, 
            mb: 6, 
            textAlign: i18n.language === 'ar' ? 'right' : 'left' 
          }}
        >
          {/* العمود الأول: معلومات الجامعة */}
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 700, letterSpacing: 0.5 }}>
              University of Larbi Ben M'hidi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, maxWidth: '300px' }}>
              Department of Biology & Parasitology.<br/>
              Oum El Bouaghi, Algeria.
            </Typography>
            
            {/* أيقونات تواصل (زينة) */}
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <IconButton 
                  key={i} 
                  size="small" 
                  sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: colors.primary.contrastText, bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <Icon size={18} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* العمود الثاني: روابط سريعة */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 3, color: '#ffffff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Platform
            </Typography>
            <Stack spacing={1.5}>
              <Link component="button" onClick={() => navigate('/')} sx={{ color: 'inherit', textAlign: 'inherit', textDecoration: 'none', '&:hover': { color: colors.secondary.light } }}>
                {t('nav_home') || 'Home'}
              </Link>
              <Link component="button" onClick={() => navigate('/archive')} sx={{ color: 'inherit', textAlign: 'inherit', textDecoration: 'none', '&:hover': { color: colors.secondary.light } }}>
                {t('nav_archive') || 'Archive'}
              </Link>
              <Link component="button" onClick={() => navigate('/login')} sx={{ color: 'inherit', textAlign: 'inherit', textDecoration: 'none', '&:hover': { color: colors.secondary.light } }}>
                {t('btn_login') || 'Login'}
              </Link>
            </Stack>
          </Box>

          {/* العمود الثالث: التواصل */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 3, color: '#ffffff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Contact
            </Typography>
            <Link 
              href="mailto:mehdi.boubetana@gmail.com" 
              sx={{ 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                textDecoration: 'none',
                '&:hover': { color: colors.secondary.light } 
              }}
            >
              <Mail size={18} /> 
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Mehdi Boubetana</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>Developer</Typography>
              </Box>
            </Link>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
        
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" align="center" sx={{ opacity: 0.5, fontSize: '0.8rem' }}>
            © 2025 Parasites Database. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.3 }}>
            v1.0.0
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
