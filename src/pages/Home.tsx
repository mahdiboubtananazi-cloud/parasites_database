import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  Link,
  Fade,
  Zoom,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Database,
  Activity,
  Mail,
  Dna,
  TestTube2,
  Globe,
  School,
  ArrowRight,
  Microscope,
} from 'lucide-react';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

// خلفية علمية للطفيليات (Microscope slides pattern)
const parasitePattern = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
    </filter>
  </defs>
  <g opacity="0.08" fill="#2d5a3d">
    <!-- Protozoa shapes -->
    <ellipse cx="40" cy="40" rx="15" ry="20" transform="rotate(20 40 40)"/>
    <ellipse cx="160" cy="40" rx="12" ry="18" transform="rotate(-30 160 40)"/>
    <ellipse cx="40" cy="160" rx="18" ry="14" transform="rotate(45 40 160)"/>
    <ellipse cx="160" cy="160" rx="16" ry="22" transform="rotate(-15 160 160)"/>
    <!-- Cell nuclei -->
    <circle cx="40" cy="40" r="5" fill="#1a3d2a"/>
    <circle cx="160" cy="40" r="4" fill="#1a3d2a"/>
    <circle cx="40" cy="160" r="6" fill="#1a3d2a"/>
    <circle cx="160" cy="160" r="5" fill="#1a3d2a"/>
    <!-- Microscope grids -->
    <line x1="0" y1="100" x2="200" y2="100" stroke="#2d5a3d" stroke-width="0.5" opacity="0.3"/>
    <line x1="100" y1="0" x2="100" y2="200" stroke="#2d5a3d" stroke-width="0.5" opacity="0.3"/>
  </g>
</svg>
`;
const bgUrl = `data:image/svg+xml;base64,${btoa(parasitePattern)}`;

const Home = () => {
  const navigate = useNavigate();
  const { parasites, loading } = useParasites();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  useEffect(() => {
    document.title = t('app_title');
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  const stats = useMemo(() => {
    if (!parasites || parasites.length === 0) return { total: 0, types: 0, recent: 0 };
    const uniqueTypes = new Set(parasites.map((p) => p.type || 'Unknown'));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSamples = parasites.filter(p => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : null;
      return createdDate && createdDate >= thirtyDaysAgo;
    }).length;
    return { total: parasites.length, types: uniqueTypes.size, recent: recentSamples };
  }, [parasites]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a3d2a 0%, #2d5a3d 100%)'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#7fb896' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #0d1f15, #1a3d2a, #2d5a3d)',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      {/* خلفية علمية ثابتة */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("${bgUrl}")`,
        opacity: 0.4,
        backgroundSize: '200px 200px'
      }} />

      {/* HERO SECTION */}
      <Box sx={{ position: 'relative', pt: { xs: 10, md: 16 }, pb: { xs: 14, md: 20 }, overflow: 'hidden' }}>
        {/* Subtle gradient overlay */}
        <Box sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(127,184,150,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(45,90,61,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={800}>
            <Stack spacing={5} alignItems="center">
              
              {/* Scientific Badge */}
              <Zoom in timeout={1000}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 4,
                  py: 1.5,
                  background: 'rgba(127,184,150,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50px',
                  border: '1.5px solid rgba(127,184,150,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                  <Microscope size={20} color="#7fb896" strokeWidth={2.5} />
                  <Typography sx={{ 
                    color: '#c8e6d5', 
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}>
                    Advanced Parasitology Research
                  </Typography>
                </Box>
              </Zoom>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '5rem' },
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c8e6d5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  lineHeight: 1.1,
                  filter: 'drop-shadow(0 4px 12px rgba(127,184,150,0.3))'
                }}>
                  {t('app_title')}
                </Typography>
                
                <Typography variant="h5" sx={{
                  maxWidth: 750,
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400
                }}>
                  {t('hero_description') || "The premier digital archive for parasitology research and microscopic documentation."}
                </Typography>
              </Box>

              {/* Premium Search Bar with Parasite Theme */}
              <Paper component="form" onSubmit={handleSearch} elevation={0} sx={{
                p: '8px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 700,
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(127,184,150,0.3)',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-3px)',
                  boxShadow: '0 25px 60px -10px rgba(45,90,61,0.5)',
                  borderColor: 'rgba(127,184,150,0.5)'
                }
              }}>
                <InputAdornment position="start" sx={{ pl: 3, color: '#2d5a3d' }}>
                  <Search size={26} strokeWidth={2.5} />
                </InputAdornment>
                <TextField
                  fullWidth
                  placeholder={t('search_placeholder') || "Search by species, host, or stain..."}
                  variant="standard"
                  value={searchQuery}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { 
                      fontSize: '1.15rem', 
                      fontWeight: 600,
                      color: '#0d1f15',
                      '& input::placeholder': {
                        color: '#5a7a66',
                        opacity: 1
                      }
                    } 
                  }}
                  sx={{ px: 3 }}
                />
                <Button type="submit" variant="contained" sx={{
                  background: 'linear-gradient(135deg, #2d5a3d 0%, #1a3d2a 100%)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  px: 5,
                  py: 2,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  boxShadow: '0 10px 25px -5px rgba(45,90,61,0.5)',
                  textTransform: 'none',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)',
                    transform: 'scale(1.03)',
                    boxShadow: '0 12px 30px -5px rgba(45,90,61,0.6)'
                  }
                }}>
                  {t('btn_search')}
                </Button>
              </Paper>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* STATS CARDS - Simple & Smooth */}
      <Container maxWidth="lg" sx={{ mt: -10, mb: 16, position: 'relative', zIndex: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {[
            { icon: Database, label: 'TOTAL SAMPLES', value: stats.total, color: '#3a7050', bgColor: 'rgba(58,112,80,0.15)', borderColor: '#3a7050' },
            { icon: Dna, label: 'SPECIES TYPES', value: stats.types, color: '#5a8a6d', bgColor: 'rgba(90,138,109,0.15)', borderColor: '#5a8a6d' },
            { icon: Activity, label: 'RECENT ACTIVITY', value: stats.recent, color: '#7fb896', bgColor: 'rgba(127,184,150,0.15)', borderColor: '#7fb896' }
          ].map((stat, idx) => (
            <Fade in timeout={1000 + idx * 150} key={idx}>
              <Paper 
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  p: 5, 
                  borderRadius: 4, 
                  background: hoveredCard === idx ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${hoveredCard === idx ? stat.borderColor : 'rgba(255,255,255,0.15)'}`,
                  position: 'relative', 
                  overflow: 'hidden',
                  boxShadow: hoveredCard === idx 
                    ? `0 20px 50px -10px ${stat.color}40` 
                    : '0 10px 30px -5px rgba(0,0,0,0.3)',
                  transition: 'all 0.25s ease',
                  transform: hoveredCard === idx ? 'translateY(-6px)' : 'translateY(0)',
                  cursor: 'pointer'
                }}
              >
                {/* Top accent line */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.borderColor})`,
                  opacity: hoveredCard === idx ? 1 : 0.6,
                  transition: 'opacity 0.25s ease'
                }} />

                {/* Background icon */}
                <Box sx={{ 
                  position: 'absolute', 
                  right: -20, 
                  bottom: -20, 
                  opacity: 0.08,
                  transition: 'opacity 0.25s ease',
                  color: stat.color,
                  ...(hoveredCard === idx && { opacity: 0.12 })
                }}>
                  <stat.icon size={120} strokeWidth={1.5} />
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: stat.bgColor,
                    mb: 2.5,
                    border: `1px solid ${stat.color}30`
                  }}>
                    <stat.icon size={32} color={stat.color} strokeWidth={2} />
                  </Box>
                  
                  <Typography variant="overline" sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontWeight: 800, 
                    letterSpacing: 2,
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 1
                  }}>
                    {stat.label}
                  </Typography>
                  
                  <Typography variant="h2" sx={{ 
                    fontWeight: 900, 
                    color: '#ffffff',
                    fontSize: '3.5rem',
                    lineHeight: 1,
                    textShadow: `0 4px 12px ${stat.color}40`
                  }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          ))}
        </Box>
      </Container>

      {/* CTA SECTION - Redesigned */}
      <Container maxWidth="lg" sx={{ mb: 16 }}>
        <Fade in timeout={1400}>
          <Paper sx={{
            p: { xs: 6, md: 10 },
            background: 'linear-gradient(135deg, rgba(58,112,80,0.2) 0%, rgba(45,90,61,0.15) 100%)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(127,184,150,0.2)',
            borderRadius: 6,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 70px -20px rgba(0,0,0,0.5)'
          }}>
            {/* Decorative microscope icon */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              opacity: 0.05,
              color: '#7fb896'
            }}>
              <Microscope size={300} strokeWidth={1} />
            </Box>

            <Stack spacing={6} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ maxWidth: 700 }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 900, 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #ffffff 0%, #c8e6d5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.3
                }}>
                  Advance Research Through Collaboration
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.8,
                  fontWeight: 400
                }}>
                  Contribute to the university's growing archive. Document new samples, upload microscopic imagery, and support peer research.
                </Typography>
              </Box>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={4}
                sx={{ width: '100%', justifyContent: 'center' }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/add')}
                  startIcon={<Plus strokeWidth={2.5} />}
                  endIcon={i18n.language !== 'ar' && <ArrowRight size={20} strokeWidth={2.5} />}
                  sx={{
                    background: 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: '0 15px 40px -10px rgba(58,112,80,0.5)',
                    minWidth: { xs: '100%', sm: '220px' },
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #4a8a67 0%, #3a7050 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 50px -10px rgba(58,112,80,0.6)'
                    }
                  }}
                >
                  {t('btn_add_sample')}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/archive')}
                  startIcon={<Database strokeWidth={2.5} />}
                  sx={{
                    borderColor: 'rgba(127,184,150,0.4)',
                    borderWidth: 2,
                    color: '#ffffff',
                    fontWeight: 700,
                    px: 6,
                    py: 2.5,
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    minWidth: { xs: '100%', sm: '220px' },
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      borderColor: 'rgba(127,184,150,0.7)',
                      borderWidth: 2,
                      background: 'rgba(127,184,150,0.15)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 40px -10px rgba(127,184,150,0.3)'
                    }
                  }}
                >
                  {t('btn_browse_archive')}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </Container>

      {/* FOOTER - Unchanged (Perfect as requested) */}
      <Box sx={{ 
        background: 'linear-gradient(to bottom, rgba(13,31,21,0.9), rgba(0,0,0,0.95))',
        backdropFilter: 'blur(20px)',
        color: 'rgba(255,255,255,0.7)', 
        pt: 12, 
        pb: 6,
        borderTop: '1px solid rgba(127,184,150,0.2)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '4fr 2fr 3fr 3fr' }, 
            gap: 6,
            mb: 8,
            textAlign: i18n.language === 'ar' ? 'right' : 'left'
          }}>
            <Box>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 1.5,
                    background: 'linear-gradient(135deg, #3a7050 0%, #2d5a3d 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    boxShadow: '0 8px 24px rgba(58,112,80,0.4)'
                  }}>
                    <School size={28} color="#ffffff" strokeWidth={2} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#ffffff', lineHeight: 1.2 }}>
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

            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ 
                color: '#ffffff', mb: 3, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem'
              }}>
                Platform
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: t('btn_browse_archive'), path: '/archive' },
                  { label: t('btn_add_sample'), path: '/add' },
                  { label: t('btn_view_stats'), path: '/statistics' }
                ].map((item, idx) => (
                  <Link key={idx} component="button" onClick={() => navigate(item.path)} sx={{ 
                    color: 'inherit', textDecoration: 'none', textAlign: 'inherit', display: 'block',
                    transition: 'all 0.3s ease',
                    '&:hover': { color: '#7fb896', transform: 'translateX(5px)' }
                  }}>
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ 
                color: '#ffffff', mb: 3, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem'
              }}>
                Global Resources
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: 'CDC Parasites', url: 'https://www.cdc.gov/parasites/index.html', icon: Globe },
                  { label: 'WHO Tropical Diseases', url: 'https://www.who.int/health-topics/neglected-tropical-diseases', icon: Globe },
                  { label: 'DPDx Diagnostic', url: 'https://dpd.cdc.gov/dpdx', icon: TestTube2 }
                ].map((item, idx) => (
                  <Link key={idx} href={item.url} target="_blank" sx={{ 
                    color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': { color: '#7fb896', transform: 'translateX(5px)' }
                  }}>
                    <item.icon size={16} /> {item.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ 
                color: '#ffffff', mb: 3, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem'
              }}>
                Contact
              </Typography>
              <Paper sx={{ 
                p: 3, 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#ffffff', mb: 1.5 }}>
                  Mehdi Boubetana
                </Typography>
                <Link href="mailto:mehdi.boubetana@gmail.com" sx={{ 
                  color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1.5,
                  fontSize: '0.95rem', transition: 'color 0.3s ease',
                  '&:hover': { color: '#7fb896' }
                }}>
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

export default Home;