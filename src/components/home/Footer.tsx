import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  Paper,
} from '@mui/material';
import {
  Mail,
  School,
  Globe,
  TestTube2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, rgba(13,31,21,0.9), rgba(0,0,0,0.95))',
          backdropFilter: 'blur(20px)',
          color: 'rgba(255,255,255,0.7)',
          pt: 12,
          pb: 6,
          borderTop: '1px solid rgba(127,184,150,0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '4fr 2fr 3fr 3fr' },
              gap: 6,
              mb: 8,
              textAlign: i18n.language === 'ar' ? 'right' : 'left',
            }}
          >
            {/* 1) معلومات الجامعة */}
            <Box>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5,
                      background: 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)',
                      borderRadius: 2,
                      display: 'flex',
                      boxShadow: '0 8px 24px rgba(58,112,80,0.4)',
                    }}
                  >
                    <School size={28} color="#ffffff" strokeWidth={2} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{ color: '#ffffff', lineHeight: 1.2 }}
                    >
                      University of Larbi Ben M'hidi
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
                      Oum El Bouaghi, Algeria
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="body2" sx={{ lineHeight: 1.8, maxWidth: 320, opacity: 0.8 }}>
                  Advanced Parasitology Research Platform.
                </Typography>
              </Stack>
            </Box>

            {/* 2) روابط المنصة */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{
                  color: '#ffffff',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                Platform
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: t('nav_archive') || 'Archive', path: '/archive' },
                  { label: t('nav_add') || 'Add Sample', path: '/add' },
                  { label: t('nav_stats') || 'Statistics', path: '/statistics' },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    component="button"
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      textAlign: 'inherit',
                      display: 'block',
                      transition: 'all 0.3s ease',
                      '&:hover': { color: '#7fb896', transform: 'translateX(5px)' },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            {/* 3) مصادر عالمية */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{
                  color: '#ffffff',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                Global Resources
              </Typography>
              <Stack spacing={2}>
                {[
                  {
                    label: 'CDC Parasites',
                    url: 'https://www.cdc.gov/parasites/index.html',
                    icon: Globe,
                  },
                  {
                    label: 'WHO Tropical Diseases',
                    url: 'https://www.who.int/health-topics/neglected-tropical-diseases',
                    icon: Globe,
                  },
                  {
                    label: 'DPDx Diagnostic',
                    url: 'https://dpd.cdc.gov/dpdx',
                    icon: TestTube2,
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': { color: '#7fb896', transform: 'translateX(5px)' },
                    }}
                  >
                    <item.icon size={16} /> {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            {/* 4) التواصل */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{
                  color: '#ffffff',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                Contact
              </Typography>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography variant="body1" fontWeight={700} sx={{ color: '#ffffff', mb: 1.5 }}>
                  Mehdi Boubetana
                </Typography>
                <Link
                  href="mailto:mehdi.boubetana@gmail.com"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#7fb896' },
                  }}
                >
                  <Mail size={16} /> mehdi.boubetana@gmail.com
                </Link>
              </Paper>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: 'rgba(127,184,150,0.15)' }} />

          <Typography variant="body2" align="center" sx={{ opacity: 0.5 }}>
            © 2025 Parasites Database. University of Larbi Ben M'hidi.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
