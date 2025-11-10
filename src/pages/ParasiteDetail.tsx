import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  CardMedia,
  Divider,
} from '@mui/material';
import { useParasites } from '../hooks/useParasites';
import { LoadingSpinner } from '../components/core/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

export default function ParasiteDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getParasite, loading } = useParasites({ autoFetch: false });
  const { showError } = useToast();
  const [parasite, setParasite] = useState<any>(null);

  useEffect(() => {
    const fetchParasite = async () => {
      if (id) {
        try {
          const data = await getParasite(Number(id));
          if (data) {
            setParasite(data);
          } else {
            showError('Parasite not found');
            navigate('/parasites');
          }
        } catch (error) {
          showError('Failed to load parasite details');
          navigate('/parasites');
        }
      }
    };

    fetchParasite();
  }, [id]);

  if (loading || !parasite) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="lg">
      <Button
        component={Link}
        to="/parasites"
        startIcon={<ArrowLeft size={20} />}
        sx={{ mb: 3 }}
      >
        {t('back')}
      </Button>

      <Grid container spacing={4}>
        {/* Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="400"
              image={parasite.imageUrl || '/images/placeholder.png'}
              alt={parasite.scientificName}
              sx={{ borderRadius: 2, objectFit: 'cover' }}
            />
            {parasite.microscopicImageUrl && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('microscopic_image')}
                </Typography>
                <CardMedia
                  component="img"
                  height="300"
                  image={parasite.microscopicImageUrl}
                  alt={`Microscopic view of ${parasite.scientificName}`}
                  sx={{ borderRadius: 2, objectFit: 'cover', mt: 1 }}
                />
              </>
            )}
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {parasite.scientificName}
            </Typography>

            {i18n.language === 'ar' && parasite.arabicName && (
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {parasite.arabicName}
              </Typography>
            )}
            {i18n.language === 'fr' && parasite.frenchName && (
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {parasite.frenchName}
              </Typography>
            )}
            {parasite.commonName && (
              <Typography variant="h6" color="primary" gutterBottom>
                {parasite.commonName}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {t('host_species')}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {parasite.hostSpecies}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {t('discovery_year')}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {parasite.discoveryYear}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('description')}
              </Typography>
              <Typography variant="body1" paragraph>
                {i18n.language === 'ar' && parasite.arabicDescription
                  ? parasite.arabicDescription
                  : i18n.language === 'fr' && parasite.frenchDescription
                  ? parasite.frenchDescription
                  : parasite.description}
              </Typography>
            </Box>

            {parasite.morphologicalCharacteristics && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {t('morphological_characteristics')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {parasite.morphologicalCharacteristics}
                </Typography>
              </Box>
            )}

            {parasite.detectionMethod && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('detection_method')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {parasite.detectionMethod}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
