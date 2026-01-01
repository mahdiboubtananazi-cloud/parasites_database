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
  Code,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, rgba(13,31,21,0.95), rgba(0,0,0,0.98))',
          backdropFilter: 'blur(20px)',
          color: 'rgba(255,255,255,0.85)',
          pt: { xs: 6, md: 10 },
          pb: 5,
          borderTop: '1px solid rgba(127,184,150,0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 4, md: 5 },
              mb: 5,
            }}
          >
            {/* معلومات الجامعة */}
            <Box>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2.5} alignItems="flex-start">
                  <Box
                    sx={{
                      p: 1.2,
                      background: 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)',
                      borderRadius: 2,
                      display: 'flex',
                      boxShadow: '0 6px 20px rgba(58,112,80,0.35)',
                      flexShrink: 0,
                    }}
                  >
                    <School size={22} color="#ffffff" strokeWidth={2} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ color: '#ffffff', lineHeight: 1.3 }}
                    >
                      University of Larbi Ben M'hidi
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.3 }}>
                      Oum El Bouaghi, Algeria
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {t('app_subtitle')}
                </Typography>
              </Stack>
            </Box>

            {/* روابط المنصة */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  color: '#7fb896',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                {t('nav_dashboard')}
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: t('nav_archive'), path: '/archive' },
                  { label: t('nav_add_parasite'), path: '/add' },
                  { label: t('nav_statistics'), path: '/statistics' },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    component="button"
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      textAlign: isRtl ? 'right' : 'left',
                      display: 'block',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#7fb896',
                        transform: isRtl ? 'translateX(-5px)' : 'translateX(5px)',
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            {/* مصادر عالمية */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  color: '#7fb896',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                {t('global_resources', { defaultValue: 'Global Resources' })}
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'CDC Parasites', url: 'https://www.cdc.gov/parasites/index.html', icon: Globe },
                  { label: 'WHO Tropical Diseases', url: 'https://www.who.int/health-topics/neglected-tropical-diseases', icon: Globe },
                  { label: 'DPDx Diagnostic', url: 'https://dpd.cdc.gov/dpdx', icon: TestTube2 },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      flexDirection: isRtl ? 'row-reverse' : 'row',
                      justifyContent: isRtl ? 'flex-end' : 'flex-start',
                      '&:hover': {
                        color: '#7fb896',
                        transform: isRtl ? 'translateX(-5px)' : 'translateX(5px)',
                      },
                    }}
                  >
                    <item.icon size={16} style={{ flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </Stack>
            </Box>

            {/* المطور - Développeur ثابتة */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  color: '#7fb896',
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                }}
              >
                Développeur
              </Typography>
              <Paper
                sx={{
                  p: 2.5,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2.5,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <Code size={18} color="#7fb896" />
                  <Typography variant="body1" fontWeight={600} sx={{ color: '#ffffff' }}>
                    Mehdi Boubetana
                  </Typography>
                </Stack>
                <Link
                  href="mailto:mehdi.boubetana@gmail.com"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease',
                    '&:hover': { color: '#7fb896' },
                  }}
                >
                  <Mail size={16} style={{ flexShrink: 0 }} />
                  <span style={{ direction: 'ltr' }}>mehdi.boubetana@gmail.com</span>
                </Link>
              </Paper>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(127,184,150,0.15)' }} />

          {/* حقوق النشر */}
          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}
          >
            © 2025 {t('app_title')}. University of Larbi Ben M'hidi.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;