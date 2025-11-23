import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Microscope, Database, Users, BookOpen } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import { useParasites } from '../hooks/useParasites';
import { LoadingSpinner } from '../components/core/LoadingSpinner';
import { universityColors, gradients } from '../theme/colors';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { parasites, loading, total } = useParasites({ autoFetch: true });

  const recentParasites = parasites.slice(0, 3);
  const totalSamples = 15; // Mock data for now

  if (loading && parasites.length === 0) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: gradients.hero,
          color: 'white',
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Microscope size={80} color="white" />
        </Box>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {t('app_title')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          {t('welcome_subtitle')}
        </Typography>
        <Button
          component={Link}
          to="/parasites"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: universityColors.primary.main,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          {t('nav_parasites')}
        </Button>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              background: `linear-gradient(135deg, ${universityColors.primary.main} 0%, ${universityColors.primary.light} 100%)`,
              color: 'white',
            }}
          >
            <Database size={40} style={{ margin: '0 auto 1rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {total}
            </Typography>
            <Typography variant="body2">{t('total_parasites')}</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              background: `linear-gradient(135deg, ${universityColors.secondary.main} 0%, ${universityColors.secondary.light} 100%)`,
              color: 'white',
            }}
          >
            <BookOpen size={40} style={{ margin: '0 auto 1rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalSamples}
            </Typography>
            <Typography variant="body2">{t('total_samples')}</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              background: `linear-gradient(135deg, ${universityColors.accent.green} 0%, #34d399 100%)`,
              color: 'white',
            }}
          >
            <Users size={40} style={{ margin: '0 auto 1rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              50+
            </Typography>
            <Typography variant="body2">Researchers</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              background: `linear-gradient(135deg, ${universityColors.accent.purple} 0%, #a78bfa 100%)`,
              color: 'white',
            }}
          >
            <Microscope size={40} style={{ margin: '0 auto 1rem' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              100%
            </Typography>
            <Typography variant="body2">Digital Archive</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          {t('app_title')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Microscope size={50} color={universityColors.primary.main} style={{ marginBottom: '1rem' }} />
              <Typography variant="h6" gutterBottom>
                {t('nav_parasites')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse and search through our comprehensive collection of parasites with detailed scientific information and microscopic images.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Database size={50} color={universityColors.secondary.main} style={{ marginBottom: '1rem' }} />
              <Typography variant="h6" gutterBottom>
                {t('nav_samples')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access detailed information about collected samples, including collection dates, locations, and host species.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <BookOpen size={50} color={universityColors.accent.purple} style={{ marginBottom: '1rem' }} />
              <Typography variant="h6" gutterBottom>
                Scientific Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View morphological characteristics, detection methods, and scientific descriptions in multiple languages.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Recent Additions */}
      {recentParasites.length > 0 && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            {t('recent_additions')}
          </Typography>
          <Grid container spacing={3}>
            {recentParasites.map((parasite) => (
              <Grid item xs={12} sm={6} md={4} key={parasite.id}>
                <Card
                  component={Link}
                  to={`/parasite/${parasite.id}`}
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={parasite.imageUrl || '/images/placeholder.png'}
                    alt={parasite.scientificName}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {parasite.scientificName}
                    </Typography>
                    {i18n.language === 'ar' && parasite.arabicName && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {parasite.arabicName}
                      </Typography>
                    )}
                    {i18n.language === 'fr' && parasite.frenchName && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {parasite.frenchName}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('host_species')}:</strong> {parasite.hostSpecies}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('discovery_year')}:</strong> {parasite.discoveryYear}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={Link}
              to="/parasites"
              variant="outlined"
              size="large"
            >
              {t('view_details')} →
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
