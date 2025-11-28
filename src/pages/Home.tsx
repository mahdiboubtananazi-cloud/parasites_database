import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, Grid, alpha, useTheme,
  TextField, InputAdornment, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Database, Activity, Microscope, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useParasites } from '../hooks/useParasites';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { parasites } = useParasites();
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchTerm] = useState('');

  const stats = {
    total: parasites?.length || 0,
    types: parasites ? new Set(parasites.map(p => p.type)).size : 0
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate('/archive?search=' + searchQuery);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '600px',
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px', opacity: 0.5, zIndex: 0
      }} />

      {/* Hero Section */}
      <Box sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 }, pb: { xs: 18, md: 24 } }}>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            
            {/* Badge */}
            <Chip 
              icon={<ShieldCheck size={16} />} 
              label="Systeme de Base de Donn�es S�curis�" 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: 'primary.main', fontWeight: 600, px: 1 
              }} 
            />

            {/* Title with Gradient */}
            <Typography variant="h1" sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('hero_title')}
            </Typography>
            
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6 }}>
              ?????? ??????? ??????? ?????? ?????? ??????? ???????? ??????? ??????? ???????????.
            </Typography>

            {/* Search Bar */}
            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={0}
              sx={{
                p: '8px', display: 'flex', alignItems: 'center',
                width: '100%', maxWidth: 550, mt: 4, borderRadius: 50,
                border: '1px solid', borderColor: 'divider',
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:focus-within': { transform: 'translateY(-2px)', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.15)', borderColor: 'primary.main' }
              }}
            >
              <InputAdornment position="start" sx={{ pl: 2, color: 'text.disabled' }}>
                <Search size={22} />
              </InputAdornment>
              <TextField
                fullWidth
                placeholder="???? ?? ??? ????? ????? ?? ?????..."
                variant="standard"
                value={searchQuery}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem' } }}
                sx={{ px: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: 50, px: 4, py: 1.5, fontWeight: 'bold', boxShadow: 'none' }}
              >
                ???
              </Button>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Floating Cards Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: -12, md: -16 }, position: 'relative', zIndex: 2, mb: 10 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
          
          {/* Stats Cards */}
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
              <Paper sx={{
                p: 4, height: '100%', borderRadius: 5,
                border: '1px solid', borderColor: 'rgba(255,255,255,0.6)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' }
              }}>
                <Box sx={{ 
                  width: 50, height: 50, borderRadius: 3, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                }}>
                  <Database size={28} />
                </Box>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                  {stats.total}
                </Typography>
                <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
                  ????? ?????
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ?????? ??????? ?? ????? ????????
                </Typography>
              </Paper>
          </Box>

          <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
              <Paper sx={{
                p: 4, height: '100%', borderRadius: 5,
                border: '1px solid', borderColor: 'rgba(255,255,255,0.6)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' }
              }}>
                <Box sx={{ 
                  width: 50, height: 50, borderRadius: 3, 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                }}>
                  <Activity size={28} />
                </Box>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                  {stats.types}
                </Typography>
                <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
                  ????? ?????
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ???? ??????? ???? ????
                </Typography>
              </Paper>
          </Box>

          {/* Add Action Card */}
          <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
            <Paper
              onClick={() => navigate('/add-parasite')}
              sx={{
                p: 4, height: '100%', borderRadius: 5, cursor: 'pointer',
                bgcolor: '#0F172A', color: 'white',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.5)' }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ 
                  width: 50, height: 50, borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.15)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
                }}>
                  <Plus size={28} />
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {t('add_sample')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                  ???????? ?? ????? ???? ????? ?????? ??????? ????????.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#38BDF8', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  ???? ??????? <ChevronRight size={16} />
                </Box>
              </Box>
              
              {/* Decorative Circle */}
              <Box sx={{
                position: 'absolute', bottom: -20, right: -20, width: 150, height: 150,
                borderRadius: '50%', bgcolor: 'rgba(56, 189, 248, 0.1)', zIndex: 1
              }} />
            </Paper>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Home;



