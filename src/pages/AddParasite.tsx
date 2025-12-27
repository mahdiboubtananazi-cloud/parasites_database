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
  const { user } = useAuth();
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
  const { t } = useTranslation();
  const theme = useTheme();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      showError(
        t('error_image_required', {
          defaultValue: 'الصورة المجهرية مطلوبة للتوثيق العلمي',
        }),
      );
      return;
    }

    if (!data.scientificName.trim()) {
      showError(
        t('error_scientific_name', {
          defaultValue: 'الاسم العلمي مطلوب',
        }),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const newParasite = await parasitesApi.create({
        name: data.name,
        scientific_name: data.scientificName,
        type: data.type,
        stage: data.stage,
        description: data.description,
        sample_type: data.sampleType,
        stain_color: data.stainColor,
        host: data.host || null,
        location: data.location || null,
        student_name: data.studentName,
        supervisor_name: data.supervisorName || null,
        imageFile: selectedFile,
      });

      console.log('✅ تم الحفظ بنجاح:', newParasite);
      showSuccess(
        t('success_added', {
          defaultValue: 'تمت إضافة العينة للأرشيف بنجاح',
        }),
      );

      setSelectedFile(null);
      setImagePreview(null);
      reset();
      setTimeout(() => navigate('/archive'), 1500);
    } catch (error: any) {
      console.error('❌ خطأ:', error);
      showError(
        error?.message ||
          t('error_save', {
            defaultValue:
              'حدث خطأ أثناء حفظ العينة. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
          }),
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
          t('error_image_size', {
            defaultValue: 'حجم الصورة يجب أن يكون أقل من 5 MB',
          }),
        );
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          sx={{ mb: 1 }}
        >
          {t('add_page_title', { defaultValue: 'توثيق عينة طفيلية جديدة' })}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          {t('add_page_subtitle', {
            defaultValue:
              'يرجى إدخال البيانات العلمية الدقيقة والصورة المجهرية للعينة المكتشفة',
          })}
        </Typography>
      </Box>

      {/* MAIN FORM */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
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
                    0.05,
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
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
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('scientificName', {
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      })}
                      fullWidth
                      required
                      label={t('label_scientific', {
                        defaultValue: 'الاسم العلمي (Scientific Name)',
                      })}
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
                      label={t('label_name', {
                        defaultValue: 'الاسم الشائع (Common Name)',
                      })}
                      placeholder="مثال: أميبا الزحار"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="type"
                      control={control}
                      rules={{
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_type', {
                            defaultValue: 'مجموعة الطفيلي',
                          })}
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
                      rules={{
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_stage', {
                            defaultValue: 'المرحلة التشخيصية',
                          })}
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
                      label={t('label_host', {
                        defaultValue: 'العائل / المضيف (Host)',
                      })}
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
                    0.05,
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="sampleType"
                      control={control}
                      rules={{
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_sample_type', {
                            defaultValue: 'نوع العينة',
                          })}
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
                      rules={{
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          required
                          label={t('label_stain', {
                            defaultValue: 'الصبغة المستخدمة',
                          })}
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
                      label={t('label_location', {
                        defaultValue: 'الموقع الجغرافي / المختبر',
                      })}
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

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('description')}
                      fullWidth
                      multiline
                      rows={4}
                      label={t('label_desc', {
                        defaultValue: 'الوصف المجهري والملاحظات',
                      })}
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
                    0.05,
                  )} 0%, transparent 100%)`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('studentName', {
                        required: t('error_required', { defaultValue: 'مطلوب' }),
                      })}
                      fullWidth
                      required
                      label={t('label_student', {
                        defaultValue: 'اسم الباحث / الطالب',
                      })}
                      error={!!errors.studentName}
                      helperText={errors.studentName?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('supervisorName')}
                      fullWidth
                      label={t('label_supervisor', {
                        defaultValue: 'المشرف الأكاديمي (اختياري)',
                      })}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: IMAGE UPLOAD */}
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
                    0.06,
                  )} 0%, transparent 100%)`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 2, color: '#14532d' }}
                >
                  {t('upload_image', { defaultValue: 'الصورة المجهرية' })}
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
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          borderRadius: '50%',
                        }}
                      >
                        <Upload size={32} color={theme.palette.primary.main} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#14532d' }}
                      >
                        {t('upload_hint', { defaultValue: 'اضغط لرفع صورة' })}
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
  disabled={isSubmitting || !user}
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
    fontSize: '1.05rem',
    textTransform: 'none',
    backgroundColor: '#064E3B',
    boxShadow: theme.shadows[4],
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: 1.5,                 // فراغ أفقي بين الأيقونة والنص
    '& .MuiButton-startIcon': {
      color: '#FFFFFF',
      mr: 0,                         // إزالة المارجن الافتراضي إن وجد
    },
    '& span': {
      color: '#FFFFFF',
    },
    '&:hover': {
      backgroundColor: '#022C22',
      boxShadow: theme.shadows[8],
    },
  }}
>
  <span>
    {isSubmitting
      ? t('saving', { defaultValue: 'جاري الحفظ...' })
      : t('btn_save', { defaultValue: 'حفظ في الأرشيف' })}
  </span>
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
                  {t('btn_cancel', { defaultValue: 'إلغاء' })}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
