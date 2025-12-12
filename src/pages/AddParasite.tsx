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
  Grid,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { Upload, X, Save, Microscope, FileText, User, MapPin } from 'lucide-react';
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
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      showError(t('error_image_required') || 'الصورة المجهرية مطلوبة للتوثيق العلمي');
      return;
    }

    if (!data.scientificName.trim()) {
      showError(t('error_scientific_name') || 'الاسم العلمي مطلوب');
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
      showSuccess(t('success_added') || 'تمت إضافة العينة للأرشيف بنجاح');

      setTimeout(() => navigate('/archive'), 1500);
    } catch (error: any) {
      console.error('❌ خطأ:', error.response?.data || error.message);
      showError(
        error.response?.data?.message ||
        t('error_save') ||
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
        showError('حجم الصورة يجب أن يكون أقل من 5 MB');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* ===== HEADER ===== */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          sx={{ mb: 1 }}
        >
          {t('add_page_title') || 'توثيق عينة طفيلية جديدة'}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          {t('add_page_subtitle') ||
            'يرجى إدخال البيانات العلمية الدقيقة والصورة المجهرية للعينة المكتشفة'}
        </Typography>
      </Box>

      {/* ===== MAIN FORM ===== */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid container spacing={3}>
          {/* ===== LEFT COLUMN: FORM FIELDS ===== */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* بطاقة 1: التصنيف العلمي */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: 1.5,
                    }}
                  >
                    <Microscope size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    التصنيف العلمي
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  {/* الاسم العلمي */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('scientificName', {
                        required: t('error_required') || 'مطلوب',
                      })}
                      fullWidth
                      required
                      label={t('label_scientific') || 'الاسم العلمي (Scientific Name)'}
                      placeholder="e.g. Entamoeba histolytica"
                      error={!!errors.scientificName}
                      helperText={errors.scientificName?.message}
                      sx={{ '& .MuiInputBase-input': { fontStyle: 'italic' } }}
                    />
                  </Grid>

                  {/* الاسم الشائع */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('name')}
                      fullWidth
                      label={t('label_name') || 'الاسم الشائي (Common Name)'}
                      placeholder="مثال: أميبا الزحار"
                    />
                  </Grid>

                  {/* النوع */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: t('error_required') || 'مطلوب' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_type') || 'مجموعة الطفيلي'}
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

                  {/* المرحلة */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="stage"
                      control={control}
                      rules={{ required: t('error_required') || 'مطلوب' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_stage') || 'المرحلة التشخيصية'}
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

                  {/* العائل/المضيف */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('host')}
                      fullWidth
                      label="العائل / المضيف (Host)"
                      placeholder="مثال: Homo sapiens, Dog, Mosquito"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* بطاقة 2: بيانات العينة والفحص */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: 1.5,
                    }}
                  >
                    <FileText size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    بيانات العينة والفحص
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  {/* نوع العينة */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="sampleType"
                      control={control}
                      rules={{ required: t('error_required') || 'مطلوب' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_sample_type') || 'نوع العينة'}
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

                  {/* الصبغة المستخدمة */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="stainColor"
                      control={control}
                      rules={{ required: t('error_required') || 'مطلوب' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_stain') || 'الصبغة المستخدمة'}
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

                  {/* الموقع */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('location')}
                      fullWidth
                      label="الموقع الجغرافي / المختبر"
                      placeholder="مثال: مختبر الطفيليات - الجزائر"
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
                      label={t('label_desc') || 'الوصف المجهري والملاحظات'}
                      placeholder="صف الشكل الخارجي، النواة، الحركة، وأي مميزات تشخيصية مهمة..."
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* بطاقة 3: التوثيق والمسؤولية */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      borderRadius: 1.5,
                    }}
                  >
                    <User size={20} color={theme.palette.primary.main} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    التوثيق والمسؤولية
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Grid container spacing={2}>
                  {/* اسم الباحث */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('studentName', {
                        required: t('error_required') || 'مطلوب',
                      })}
                      fullWidth
                      required
                      label={t('label_student') || 'اسم الباحث / الطالب'}
                      error={!!errors.studentName}
                      helperText={errors.studentName?.message}
                    />
                  </Grid>

                  {/* المشرف */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('supervisorName')}
                      fullWidth
                      label={t('label_supervisor') || 'المشرف الأكاديمي (اختياري)'}
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
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(
                    '#10B981',
                    0.05
                  )} 0%, transparent 100%)`,
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  {t('upload_image') || 'الصورة المجهرية'}
                </Typography>

                <Box
                  onClick={() => document.getElementById('image-upload')?.click()}
                  sx={{
                    border: `2px dashed ${imagePreview ? theme.palette.success.main : theme.palette.divider}`,
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
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
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
                        <Upload size={32} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {t('upload_hint') || 'اضغط لرفع صورة'}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
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
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: theme.shadows[4],
                    '&:hover': { boxShadow: theme.shadows[8] },
                  }}
                >
                  {isSubmitting
                    ? t('saving') || 'جاري الحفظ...'
                    : t('btn_save') || 'حفظ في الأرشيف'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/archive')}
                  disabled={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {t('btn_cancel') || 'إلغاء'}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
