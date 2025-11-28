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
} from '@mui/material';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParasites } from '../hooks/useParasites';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

const schema = yup.object({
  scientificName: yup.string().required('الاسم العلمي مطلوب'),
  commonName: yup.string().default(''),
  arabicName: yup.string().default(''),
  frenchName: yup.string().default(''),
  hostSpecies: yup.string().default(''),
  discoveryYear: yup.number().min(1900).max(new Date().getFullYear()).default(new Date().getFullYear()),
  morphologicalCharacteristics: yup.string().default(''),
  detectionMethod: yup.string().default(''),
  description: yup.string().default(''),
}).required();

interface ParasiteFormData {
  scientificName: string;
  commonName?: string;
  arabicName?: string;
  frenchName?: string;
  hostSpecies?: string;
  discoveryYear?: number;
  morphologicalCharacteristics?: string;
  detectionMethod?: string;
  description?: string;
}

export default function AddParasite() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createParasite, loading } = useParasites({ autoFetch: false });
  const { showSuccess, showError } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParasiteFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      discoveryYear: new Date().getFullYear(),
      commonName: '',
      arabicName: '',
      frenchName: '',
      hostSpecies: '',
      morphologicalCharacteristics: '',
      detectionMethod: '',
      description: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ParasiteFormData) => {
    try {
      const parasiteData = {
        ...data,
        imageUrl: imagePreview || undefined,
      };

      // @ts-ignore
      const result = await createParasite(parasiteData);

      if (result) {
        showSuccess('تم إضافة الطفيلي بنجاح');
        navigate('/parasites');
      } else {
        showError('فشل إضافة الطفيلي');
      }
    } catch (error: any) {
      showError(error?.message || 'حدث خطأ أثناء إضافة الطفيلي');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('add_parasite')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Basic Information
          </Typography>

          <TextField
            {...register('scientificName')}
            fullWidth
            label={t('scientific_name')}
            error={!!errors.scientificName}
            helperText={errors.scientificName?.message}
            margin="normal"
            required
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
              <TextField
                {...register('commonName')}
                fullWidth
                label="Common Name"
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
              <TextField
                {...register('arabicName')}
                fullWidth
                label={t('arabic_name')}
                margin="normal"
              />
            </Box>
          </Box>

          <TextField
            {...register('frenchName')}
            fullWidth
            label={t('french_name')}
            margin="normal"
          />

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Scientific Details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
              <TextField
                {...register('hostSpecies')}
                fullWidth
                label={t('host_species')}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
              <TextField
                {...register('discoveryYear', { valueAsNumber: true })}
                fullWidth
                label={t('discovery_year')}
                type="number"
                margin="normal"
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Box>
          </Box>

          <TextField
            {...register('morphologicalCharacteristics')}
            fullWidth
            label={t('morphological_characteristics')}
            multiline
            rows={4}
            margin="normal"
          />

          <TextField
            {...register('detectionMethod')}
            fullWidth
            label={t('detection_method')}
            multiline
            rows={4}
            margin="normal"
          />

          <TextField
            {...register('description')}
            fullWidth
            label={t('description')}
            multiline
            rows={5}
            margin="normal"
          />

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            {t('image')}
          </Typography>

          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Upload size={40} style={{ marginBottom: '1rem', cursor: 'pointer' }} />
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG, GIF up to 10MB
              </Typography>
            </label>
          </Box>

          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
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






