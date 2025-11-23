import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Container, Paper, Typography, TextField, Button, MenuItem, Grid, Stack, IconButton, CircularProgress } from '@mui/material';
import { Upload, X, Save } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

//  نفس رابط السيرفر
const API_URL = 'http://10.56.53.17:8000';

export default function AddParasite() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      showError("يرجى اختيار صورة مجهرية أولا");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('scientificName', data.scientificName);
      formData.append('type', data.type);
      formData.append('description', data.description);
      formData.append('stage', data.stage || "");
      formData.append('image', selectedFile);

      await axios.post(`${API_URL}/parasites`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showSuccess(t('success_msg'));
      setTimeout(() => navigate('/archive'), 1000);
      
    } catch (error) {
      console.error(error);
      showError("فشل الاتصال بالسيرفر.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">{t('add_page_title')}</Typography>
          <Typography color="text.secondary">{t('add_page_subtitle')}</Typography>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField {...register('name', { required: true })} fullWidth label={t('label_name')} error={!!errors.name} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField {...register('scientificName', { required: true })} fullWidth label={t('label_scientific')} dir="ltr" error={!!errors.scientificName} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField {...register('type')} select fullWidth label={t('label_type')} defaultValue="protozoa">
                    <MenuItem value="protozoa">{t('filter_protozoa')}</MenuItem>
                    <MenuItem value="helminths">{t('filter_helminths')}</MenuItem>
                    <MenuItem value="arthropods">{t('filter_arthropods')}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField {...register('stage')} fullWidth label={t('label_stage')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField {...register('description')} fullWidth multiline rows={4} label={t('label_desc')} />
                </Grid>
              </Grid>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/')} disabled={isSubmitting}>{t('btn_cancel')}</Button>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save size={18} />}>
                  {isSubmitting ? "جاري الحفظ..." : t('btn_save')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>{t('upload_image')}</Typography>
            <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 4, mb: 2, bgcolor: 'background.default', cursor: 'pointer', position: 'relative', minHeight: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => document.getElementById('image-upload')?.click()}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                  <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }} onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setImagePreview(null); }}><X size={16} /></IconButton>
                </>
              ) : (
                <>
                  <Upload size={40} color="#9CA3AF" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{t('upload_hint')}</Typography>
                </>
              )}
              <input type="file" id="image-upload" hidden accept="image/*" onChange={handleImageChange} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
