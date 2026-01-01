import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  IconButton,
  CircularProgress,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Upload, X, Save, Microscope, FileText, User, MapPin } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { parasitesApi } from '../api/parasites';

type FormValues = {
  name: string;
  scientificName: string;
  type: string;
  stage: string;
  description: string;
  sampleType: string;
  stainColor: string;
  host?: string;
  location?: string;
  studentName: string;
  supervisorName?: string;
};

export default function AddParasite() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      studentName: user?.name || '',
    },
  });

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const theme = useTheme();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PARASITE_TYPES = [
    { value: 'Protozoa', label: 'Protozoa' },
    { value: 'Helminths', label: 'Helminths' },
    { value: 'Arthropods', label: 'Arthropods' },
    { value: 'Fungi', label: 'Fungi' },
    { value: 'Other', label: 'Other' },
  ];

  const STAGES = [
    { value: 'Cyst', label: 'Cyst' },
    { value: 'Trophozoite', label: 'Trophozoite' },
    { value: 'Egg', label: 'Egg' },
    { value: 'Larva', label: 'Larva' },
    { value: 'Adult', label: 'Adult' },
    { value: 'Oocyst', label: 'Oocyst' },
  ];

  const SAMPLE_TYPES = [
    { value: 'Stool', label: 'Stool' },
    { value: 'Blood', label: 'Blood' },
    { value: 'Urine', label: 'Urine' },
    { value: 'Tissue', label: 'Tissue' },
    { value: 'Sputum', label: 'Sputum' },
    { value: 'Water', label: 'Water' },
    { value: 'Soil', label: 'Soil' },
  ];

  const STAINS = [
    { value: 'Iodine', label: 'Iodine' },
    { value: 'Giemsa', label: 'Giemsa' },
    { value: 'Trichrome', label: 'Trichrome' },
    { value: 'Modified Acid-Fast', label: 'Modified Acid-Fast' },
    { value: 'H&E', label: 'H&E' },
    { value: 'Wet Mount', label: 'Wet Mount' },
  ];

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      showError(t('error_image_required'));
      return;
    }

    if (!data.scientificName.trim()) {
      showError(t('error_scientific_name_required'));
      return;
    }

    setIsSubmitting(true);

    try {
      // استخدام camelCase - التحويل يتم في API layer
      const newParasite = await parasitesApi.create({
        name: data.name,
        scientificName: data.scientificName,
        type: data.type,
        stage: data.stage,
        description: data.description,
        sampleType: data.sampleType,
        stainColor: data.stainColor,
        host: data.host,
        location: data.location,
        studentName: data.studentName,
        supervisorName: data.supervisorName,
        image: selectedFile,
      });

      console.log('✅ تم الحفظ بنجاح:', newParasite);
      showSuccess(t('success_parasite_added'));

      setSelectedFile(null);
      setImagePreview(null);
      reset();
      setTimeout(() => navigate('/archive'), 1500);
    } catch (error: unknown) {
      console.error('❌ خطأ:', error);
      const errorMessage = error instanceof Error ? error.message : t('error_save_parasite');
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showError(t('error_image_size'));
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 1 }}>
          {t('add_parasite_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          {t('add_parasite_subtitle')}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.15), borderRadius: 1.5 }}>
                    <Microscope size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {t('section_scientific_classification')}
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('scientificName', { required: t('error_required') })}
                      fullWidth
                      required
                      label={t('label_scientific_name')}
                      placeholder="e.g. Entamoeba histolytica"
                      error={!!errors.scientificName}
                      helperText={errors.scientificName?.message}
                      sx={{ '& .MuiInputBase-input': { fontStyle: 'italic' } }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('name')}
                      fullWidth
                      label={t('label_common_name')}
                      placeholder={t('placeholder_common_name')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: t('error_required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_parasite_group')}
                          error={!!errors.type}
                          helperText={errors.type?.message}
                        >
                          {PARASITE_TYPES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="stage"
                      control={control}
                      rules={{ required: t('error_required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_diagnostic_stage')}
                          error={!!errors.stage}
                          helperText={errors.stage?.message}
                        >
                          {STAGES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('host')}
                      fullWidth
                      label={t('label_host')}
                      placeholder={t('placeholder_host')}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.15), borderRadius: 1.5 }}>
                    <FileText size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {t('section_sample_examination')}
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="sampleType"
                      control={control}
                      rules={{ required: t('error_required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_sample_type')}
                          error={!!errors.sampleType}
                          helperText={errors.sampleType?.message}
                        >
                          {SAMPLE_TYPES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="stainColor"
                      control={control}
                      rules={{ required: t('error_required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_stain_used')}
                          error={!!errors.stainColor}
                          helperText={errors.stainColor?.message}
                        >
                          {STAINS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('location')}
                      fullWidth
                      label={t('label_location')}
                      placeholder={t('placeholder_location')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapPin size={18} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('description')}
                      fullWidth
                      multiline
                      rows={4}
                      label={t('label_microscopic_description')}
                      placeholder={t('placeholder_description')}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.15), borderRadius: 1.5 }}>
                    <User size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {t('section_documentation')}
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('studentName', { required: t('error_required') })}
                      fullWidth
                      required
                      label={t('label_researcher_name')}
                      error={!!errors.studentName}
                      helperText={errors.studentName?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('supervisorName')}
                      fullWidth
                      label={t('label_supervisor')}
                      placeholder={t('placeholder_supervisor')}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha('#10B981', 0.06)} 0%, transparent 100%)`,
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#14532d' }}>
                  {t('label_microscopic_image')}
                </Typography>

                <Box
                  onClick={() => document.getElementById('image-upload')?.click()}
                  sx={{
                    border: `2px dashed ${imagePreview ? theme.palette.success.main : theme.palette.divider}`,
                    borderRadius: 2,
                    p: 3,
                    bgcolor: alpha(theme.palette.background.default, 0.6),
                    position: 'relative',
                    minHeight: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  {imagePreview ? (
                    <>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 250,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.55)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        }}
                      >
                        <X size={18} />
                      </IconButton>
                    </>
                  ) : (
                    <Stack alignItems="center" spacing={1.5}>
                      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.12), borderRadius: '50%' }}>
                        <Upload size={32} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#14532d' }}>
                        {t('upload_hint')}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {t('upload_hint_subtext')}
                      </Typography>
                    </Stack>
                  )}

                  <input type="file" id="image-upload" hidden accept="image/*" onChange={handleImageChange} />
                </Box>
              </Paper>

              <Stack spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || !user}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    backgroundColor: '#064E3B',
                    boxShadow: theme.shadows[4],
                    '&:hover': { backgroundColor: '#022C22', boxShadow: theme.shadows[8] },
                  }}
                >
                  {isSubmitting ? t('submitting') : t('btn_save_archive')}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/archive')}
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    color: '#1f2933',
                    borderColor: '#1f2933',
                    '&:hover': {
                      borderColor: '#111827',
                      color: '#111827',
                      backgroundColor: 'rgba(15,23,42,0.04)',
                    },
                  }}
                >
                  {t('btn_cancel')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}