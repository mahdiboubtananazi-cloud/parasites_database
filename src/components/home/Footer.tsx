import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { Mail, School, ChevronDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

const Footer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isRtl = i18n.language === 'ar';

  // هيكلة الروابط
  const sections = [
    {
      title: t('nav_dashboard'),
      links: [
        { label: t('nav_archive'), action: () => navigate('/archive') },
        { label: t('nav_add_parasite'), action: () => navigate('/add') },
        { label: t('nav_statistics'), action: () => navigate('/statistics') },
      ]
    },
    {
      title: t('global_resources'),
      links: [
        { label: 'CDC Parasites', href: 'https://www.cdc.gov/parasites' },
        { label: 'WHO Tropical', href: 'https://www.who.int' },
        { label: 'DPDx Diagnostic', href: 'https://dpd.cdc.gov/dpdx' },
      ]
    }
  ];

  // مكون الرابط الداخلي
  const FooterLink = ({ item }: any) => (
    <Box sx={{ mb: 2 }}>
      {item.href ? (
        <Link 
          href={item.href} target="_blank" 
          sx={{ 
            color: '#e0e0e0', // لون فاتح جداً للقراءة
            textDecoration: 'none', fontSize: '0.95rem', 
            display: 'flex', alignItems: 'center', gap: 1,
            opacity: 0.8,
            '&:hover': { color: colors.primary.main, opacity: 1 } 
          }}
        >
          {item.label} <ExternalLink size={14} />
        </Link>
      ) : (
        <Typography 
          onClick={item.action}
          sx={{ 
            color: '#e0e0e0', cursor: 'pointer', fontSize: '0.95rem',
            opacity: 0.8,
            transition: 'all 0.2s',
            '&:hover': { color: colors.primary.main, opacity: 1, transform: isRtl ? 'translateX(-5px)' : 'translateX(5px)' }
          }}
        >
          {item.label}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ 
      bgcolor: '#0a0a0a', // خلفية سوداء تقريباً لتباين عالي
      color: '#ffffff', 
      pt: 8, pb: 4, 
      borderTop: '1px solid rgba(255,255,255,0.1)' 
    }}>
      <Container maxWidth="lg">
        {/* استخدام size بدلاً من xs/item للإصدار الجديد */}
        <Grid container spacing={5}>
          
          {/* 1. معلومات التطبيق (بدون اسم الجامعة) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} mb={2} alignItems="center">
              <Box sx={{ 
                p: 1.2, 
                bgcolor: alpha(colors.primary.main, 0.15), 
                borderRadius: 2,
                display: 'flex'
              }}>
                <School size={26} color={colors.primary.main} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#fff">
                {t('app_title')}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#b0b0b0', lineHeight: 1.8, maxWidth: 300 }}>
              {t('app_subtitle')}
            </Typography>
          </Grid>

          {/* 2. الروابط (قائمة منسدلة في الموبايل، وعادية في الحاسوب) */}
          {isMobile ? (
            <Grid size={{ xs: 12 }}>
              {sections.map((section, idx) => (
                <Accordion 
                  key={idx} 
                  disableGutters 
                  elevation={0}
                  sx={{ 
                    bgcolor: 'transparent', color: '#fff', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    '&:before': { display: 'none' } 
                  }}
                >
                  <AccordionSummary expandIcon={<ChevronDown color="#fff" />} sx={{ px: 0 }}>
                    <Typography fontWeight={700} fontSize="1.1rem">{section.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pb: 2 }}>
                    {section.links.map((link, i) => <FooterLink key={i} item={link} />)}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          ) : (
            // نسخة الديسكتوب
            <>
              {sections.map((section, idx) => (
                <Grid size={{ md: 3 }} key={idx}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fff', mb: 3 }}>
                    {section.title}
                  </Typography>
                  {section.links.map((link, i) => <FooterLink key={i} item={link} />)}
                </Grid>
              ))}
            </>
          )}

          {/* 3. التواصل */}
          <Grid size={{ xs: 12, md: 2 }}>
             <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fff', mb: 3, display: { xs: 'none', md: 'block' } }}>
                {t('contact')}
             </Typography>
             
             <Box sx={{ 
               p: 2, 
               bgcolor: 'rgba(255,255,255,0.05)', 
               border: '1px solid rgba(255,255,255,0.1)', 
               borderRadius: 3, 
               display: 'flex', 
               flexDirection: 'column',
               gap: 1.5
             }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Mail size={18} color={colors.primary.main} />
                  <Typography variant="body2" fontWeight={600} color="#fff">Email Us</Typography>
                </Stack>
                <Link 
                  href="mailto:mehdi.boubetana@gmail.com" 
                  sx={{ 
                    color: '#b0b0b0', 
                    textDecoration: 'none', 
                    fontSize: '0.85rem',
                    wordBreak: 'break-all',
                    '&:hover': { color: '#fff' }
                  }}
                >
                  mehdi.boubetana@gmail.com
                </Link>
             </Box>
          </Grid>

        </Grid>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
        
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography align="center" variant="body2" color="#666">
            © {new Date().getFullYear()} {t('app_title')}. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;