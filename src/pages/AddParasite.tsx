// src/pages/AddParasite.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';
import { Upload, X, Save } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// API configuration
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

type FormValues = {
  name: string;
  scientificName: string;
  type: string;
  stage?: string;
  description?: string;
};

export default function AddParasite() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة الإرسال الرئيسية
  const onSubmit = async (data: FormValues) => {
    // تحقق من وجود الصورة
    if (!selectedFile) {
      showError('الرجاء اختيار صورة قبل المتابعة');
      return;
    }

    setIsSubmitting(true);

    try {
      // أنشئ FormData وأضف البيانات والملف
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('scientificName', data.scientificName);
      formData.append('type', data.type);
      formData.append('stage', data.stage || '');
      formData.append('description', data.description || '');
      
      // أضف الصورة (الملف نفسه، مهم جداً!)
      formData.append('image', selectedFile);

      // أرسل للسيرفر
      const response = await axios.post(
        `${API_URL}/parasites`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: API_TIMEOUT,
        }
      );

      console.log('✅ تم الحفظ بنجاح:', response.data);
      showSuccess(t('success_msg'));
      
      // انتظر ثانية ثم انقل للأرشيف
      setTimeout(() => navigate('/archive'), 1000);
      
    } catch (error: any) {
      console.error('❌ خطأ:', error.response?.data || error.message);
      showError('حدث خطأ أثناء حفظ العينة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // عند اختيار صورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // اعرض معاينة الصورة
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* العنوان */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t('add_page_title')}
          </Typography>
          <Typography color="text.secondary">{t('add_page_subtitle')}</Typography>
        </Box>
      </Stack>

      {/* المحتوى الرئيسي */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
          gap: 4,
        }}
      >
        {/* النموذج (اليسار) */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' } }}>
          <Paper sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* الحقول */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3,
                }}
              >
                {/* الاسم */}
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                  <TextField
                    {...register('name', { required: 'الاسم مطلوب' })}
                    fullWidth
                    label={t('label_name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Box>

                {/* الاسم العلمي */}
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                  <TextField
                    {...register('scientificName', { required: 'الاسم العلمي مطلوب' })}
                    fullWidth
                    label={t('label_scientific')}
                    dir="ltr"
                    error={!!errors.scientificName}
                    helperText={errors.scientificName?.message}
                  />
                </Box>

                {/* النوع */}
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                  <TextField
                    {...register('type', { required: 'النوع مطلوب' })}
                    select
                    fullWidth
                    label={t('label_type')}
                    defaultValue="protozoa"
                    error={!!errors.type}
                  >
                    <MenuItem value="protozoa">{t('filter_protozoa')}</MenuItem>
                    <MenuItem value="helminths">{t('filter_helminths')}</MenuItem>
                    <MenuItem value="arthropods">{t('filter_arthropods')}</MenuItem>
                  </TextField>
                </Box>

                {/* المرحلة */}
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                  <TextField
                    {...register('stage')}
                    fullWidth
                    label={t('label_stage')}
                  />
                </Box>

                {/* الوصف */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    {...register('description')}
                    fullWidth
                    multiline
                    rows={4}
                    label={t('label_desc')}
                  />
                </Box>
              </Box>

              {/* الأزرار */}
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  {t('btn_cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save size={18} />
                    )
                  }
                >
                  {isSubmitting ? 'جاري الحفظ...' : t('btn_save')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* منطقة رفع الصورة (اليمين) */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {t('upload_image')}
            </Typography>

            {/* منطقة الرفع */}
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                mb: 2,
                bgcolor: 'background.default',
                cursor: 'pointer',
                position: 'relative',
                minHeight: 250,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <>
                  {/* معاينة الصورة */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                  />
                  {/* زر حذف الصورة */}
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X size={16} />
                  </IconButton>
                </>
              ) : (
                <>
                  {/* رسالة بدون صورة */}
                  <Upload size={40} color="#9CA3AF" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {t('upload_hint')}
                  </Typography>
                </>
              )}

              {/* حقل الملف المخفي */}
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
