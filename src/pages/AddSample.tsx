import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/core/LoadingSpinner';
import { samplesApi } from '../api/samples';

const schema = yup.object({
  parasiteId: yup.number().required('الطفيلي مطلوب'),
  sampleNumber: yup.string().required('رقم العينة مطلوب'),
  hostSpecimen: yup.string(),
  collectionDate: yup.string().required('تاريخ الجمع مطلوب'),
  collectionLocation: yup.string(),
  notes: yup.string(),
});

type SampleFormData = yup.InferType<typeof schema>;

export default function AddSample() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { parasites, loading: parasitesLoading } = useParasites({ autoFetch: true });
  const { showSuccess, showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SampleFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: SampleFormData) => {
    try {
      setSubmitting(true);
      await samplesApi.create({
        parasiteId: data.parasiteId,
        sampleNumber: data.sampleNumber,
        hostSpecimen: data.hostSpecimen,
        collectionDate: data.collectionDate,
        collectionLocation: data.collectionLocation,
        notes: data.notes,
      });
      
      showSuccess('تم إضافة العينة بنجاح');
      navigate('/parasites');
    } catch (error: any) {
      showError(error?.message || 'حدث خطأ أثناء إضافة العينة');
    } finally {
      setSubmitting(false);
    }
  };

  if (parasitesLoading) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('add_sample')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sample Information
          </Typography>

          <TextField
            {...register('parasiteId', { valueAsNumber: true })}
            fullWidth
            select
            label={t('nav_parasites')}
            error={!!errors.parasiteId}
            helperText={errors.parasiteId?.message}
            margin="normal"
            required
          >
            <MenuItem value="">
              <em>Select a parasite</em>
            </MenuItem>
            {parasites.map((parasite) => (
              <MenuItem key={parasite.id} value={parasite.id}>
                {parasite.scientificName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            {...register('sampleNumber')}
            fullWidth
            label={t('sample_number')}
            error={!!errors.sampleNumber}
            helperText={errors.sampleNumber?.message}
            margin="normal"
            required
            placeholder="e.g., S-2024-001"
          />

          <TextField
            {...register('hostSpecimen')}
            fullWidth
            label={t('host_species')}
            margin="normal"
            placeholder="e.g., Human blood sample"
          />

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Collection Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('collectionDate')}
                fullWidth
                label={t('collection_date')}
                type="date"
                InputLabelProps={{ shrink: true }}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('collectionLocation')}
                fullWidth
                label={t('collection_location')}
                margin="normal"
                placeholder="e.g., Laboratory A, Room 101"
              />
            </Grid>
          </Grid>

          <TextField
            {...register('notes')}
            fullWidth
            label={t('notes')}
            multiline
            rows={5}
            margin="normal"
            placeholder="Add any additional notes about the sample..."
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              {t('submit')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={() => navigate('/parasites')}
            >
              {t('cancel')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
