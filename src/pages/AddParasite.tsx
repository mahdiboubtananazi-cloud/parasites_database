import React, { useState, useEffect } from 'react';
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
  Grid,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { Upload, X, Save, Microscope, FileText, User, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;


const PARASITE_TYPES = [
  { value: 'Protozoa', label: 'Protozoa (الأوليات)' },
  { value: 'Helminths', label: 'Helminths (الديدان)' },
  { value: 'Arthropods', label: 'Arthropods (المفصليات)' },
  { value: 'Fungi', label: 'Fungi (الفطريات)' },
  { value: 'Other', label: 'Other (أخرى)' },
];


const STAGES = [
  { value: 'Cyst', label: 'Cyst (كيس)' },
  { value: 'Trophozoite', label: 'Trophozoite (متغذي)' },
  { value: 'Egg', label: 'Egg (بيضة)' },
  { value: 'Larva', label: 'Larva (يرقة)' },
  { value: 'Adult', label: 'Adult (بالغ)' },
  { value: 'Oocyst', label: 'Oocyst (الكيس الحوضي)' },
];


const SAMPLE_TYPES = [
  { value: 'Stool', label: 'Stool (براز)' },
  { value: 'Blood', label: 'Blood (دم)' },
  { value: 'Urine', label: 'Urine (بول)' },
  { value: 'Tissue', label: 'Tissue (نسيج)' },
  { value: 'Sputum', label: 'Sputum (بلغم)' },
  { value: 'Water', label: 'Water (ماء)' },
  { value: 'Soil', label: 'Soil (تربة)' },
];


const STAINS = [
  { value: 'Iodine', label: 'Iodine (اليود)' },
  { value: 'Giemsa', label: 'Giemsa (جيمسا)' },
  { value: 'Trichrome', label: 'Trichrome (ثلاثي الألوان)' },
  { value: 'Modified Acid-Fast', label: 'Modified Acid-Fast' },
  { value: 'H&E', label: 'Hematoxylin & Eosin (الهيماتوكسيلين)' },
  { value: 'Wet Mount', label: 'Wet Mount (بدون صبغة)' },
];


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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      studentName: useAuth().user?.name || '',
    },
  });

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.title = t('add_parasite_title', { defaultValue: 'إضافة عينة' });
  }, [t, i18n.language, isRtl]);

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      showError(
        t('error_image_required') ||
        'الصورة المجهرية مطلوبة للتوثيق العلمي'
      );
      return;
    }

    if (!data.scientificName.trim()) {
      showError(
        t('error_scientific_name_required') ||
        'الاسم العلمي مطلوب'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('name', data.name);
      formDataPayload.append('scientificName', data.scientificName);
      formDataPayload.append('type', data.type);
      formDataPayload.append('stage', data.stage);
      formDataPayload.append('description', data.description);
      formDataPayload.append('sampleType', data.sampleType);
      formDataPayload.append('stainColor', data.stainColor);
      formDataPayload.append('host', data.host || '');
      formDataPayload.append('location', data.location || '');
      formDataPayload.append('studentName', data.studentName);
      formDataPayload.append('supervisorName', data.supervisorName || '');
      formDataPayload.append('uploaded_by', data.studentName);
      formDataPayload.append('image', selectedFile);

      const response = await axios.post(
        `${API_URL}/parasites`,
        formDataPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: API_TIMEOUT,
        }
      );

      console.log('✅ تم الحفظ بنجاح:', response.data);
      showSuccess(
        t('success_parasite_added') ||
        'تمت إضافة العينة للأرشيف بنجاح'
      );

      setTimeout(() => navigate('/archive'), 1500);
    } catch (error: any) {
      console.error('❌ خطأ:', error.response?.data || error.message);
      showError(
        error.response?.data?.message ||
        t('error_save_parasite') ||
        'حدث خطأ أثناء حفظ العينة'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showError(
          t('error_image_size') ||
          'حجم الصورة يجب أن يكون أقل من 5 MB'
        );
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
        backgroundColor: alpha('#3a5a40', 0.02),
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* ===== HEADER ===== */}
        <Box sx={{ mb: { xs: 3, md: 5 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              mb: 1,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('add_parasite_title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('add_parasite_subtitle')}
          </Typography>
        </Box>

        {/* ===== INFO ALERT ===== */}
        <Alert
          icon={<AlertCircle size={20} />}
          severity="info"
          sx={{
            mb: 4,
            borderRadius: 2,
            borderLeft: `4px solid ${theme.palette.info.main}`,
          }}
        >
          <Typography variant="body2">
            {t('add_parasite_hint')}
          </Typography>
        </Alert>

        {/* ===== MAIN FORM ===== */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* ===== LEFT COLUMN: FORM FIELDS ===== */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                {/* بطاقة 1: التصنيف العلمي */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 1.5, md: 2.5 },
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )} 0%, transparent 100%)`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: { xs: 1.5, md: 2.5 } }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        borderRadius: 1.5,
                      }}
                    >
                      <Microscope
                        size={22}
                        color={theme.palette.primary.main}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' } }}
                    >
                      {t('section_scientific_classification')}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: { xs: 1.5, md: 2.5 } }} />

                  <Grid container spacing={2}>
                    {/* الاسم العلمي */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        {...register('scientificName', {
                          required: t('error_required'),
                        })}
                        fullWidth
                        required
                        label={t('label_scientific_name')}
                        placeholder="e.g. Entamoeba histolytica"
                        error={!!errors.scientificName}
                        helperText={errors.scientificName?.message}
                        sx={{
                          '& .MuiInputBase-input': { fontStyle: 'italic' },
                        }}
                      />
                    </Grid>

                    {/* الاسم الشائع */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('name')}
                        fullWidth
                        label={t('label_common_name')}
                        placeholder={t('placeholder_common_name')}
                      />
                    </Grid>

                    {/* النوع */}
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
                              <MenuItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* المرحلة */}
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
                              <MenuItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* العائل/المضيف */}
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

                {/* بطاقة 2: بيانات العينة والفحص */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 1.5, md: 2.5 },
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )} 0%, transparent 100%)`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: { xs: 1.5, md: 2.5 } }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        borderRadius: 1.5,
                      }}
                    >
                      <FileText
                        size={22}
                        color={theme.palette.primary.main}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' } }}
                    >
                      {t('section_sample_examination')}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: { xs: 1.5, md: 2.5 } }} />

                  <Grid container spacing={2}>
                    {/* نوع العينة */}
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
                              <MenuItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* الصبغة المستخدمة */}
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
                              <MenuItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    {/* الموقع */}
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

                    {/* الوصف المجهري */}
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

                {/* بطاقة 3: التوثيق والمسؤولية */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 1.5, md: 2.5 },
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )} 0%, transparent 100%)`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: { xs: 1.5, md: 2.5 } }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        borderRadius: 1.5,
                      }}
                    >
                      <User
                        size={22}
                        color={theme.palette.primary.main}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' } }}
                    >
                      {t('section_documentation')}
                    </Typography>
                  </Stack>

                  <Divider sx={{ mb: { xs: 1.5, md: 2.5 } }} />

                  <Grid container spacing={2}>
                    {/* اسم الباحث */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        {...register('studentName', {
                          required: t('error_required'),
                        })}
                        fullWidth
                        required
                        label={t('label_researcher_name')}
                        error={!!errors.studentName}
                        helperText={errors.studentName?.message}
                      />
                    </Grid>

                    {/* المشرف */}
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

            {/* ===== RIGHT COLUMN: IMAGE UPLOAD ===== */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                {/* Image Upload Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: { xs: 1.5, md: 2.5 },
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${alpha(
                      '#10B981',
                      0.05
                    )} 0%, transparent 100%)`,
                    position: 'sticky',
                    top: 20,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mb: 2,
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                    }}
                  >
                    {t('label_microscopic_image')}
                  </Typography>

                  <Box
                    onClick={() =>
                      document.getElementById('image-upload')?.click()
                    }
                    sx={{
                      border: `2px dashed ${
                        imagePreview
                          ? theme.palette.success.main
                          : theme.palette.divider
                      }`,
                      borderRadius: 2,
                      p: 3,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      position: 'relative',
                      minHeight: 280,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
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
                            [isRtl ? 'left' : 'right']: 8,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                          }}
                        >
                          <X size={18} />
                        </IconButton>
                      </>
                    ) : (
                      <Stack alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: '50%',
                          }}
                        >
                          <Upload
                            size={32}
                            color={theme.palette.primary.main}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          {t('hint_click_to_upload')}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.disabled"
                        >
                          JPG, PNG (Max 5MB)
                        </Typography>
                      </Stack>
                    )}

                    <input
                      type="file"
                      id="image-upload"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Box>
                </Paper>

                {/* Action Buttons */}
                <Stack spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Save size={20} />
                      )
                    }
                    sx={{
                      py: { xs: 1.25, md: 1.5 },
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      boxShadow: theme.shadows[4],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        transform: 'none',
                      },
                    }}
                  >
                    {isSubmitting
                      ? t('btn_saving')
                      : t('btn_save_archive')}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/archive')}
                    disabled={isSubmitting}
                    sx={{
                      py: { xs: 1.25, md: 1.5 },
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1rem' },
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
    </Box>
  );
}