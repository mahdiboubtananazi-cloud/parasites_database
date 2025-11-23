import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, Container, Paper, Typography, TextField, Button, 
  MenuItem, Grid, Stack, Divider, IconButton 
} from '@mui/material';
import { Upload, X, Save, ArrowRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function AddParasite() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    console.log(data);
    showSuccess('تم إرسال الطفيلي للمراجعة بنجاح!');
    setTimeout(() => navigate('/archive'), 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">إضافة طفيلي جديد</Typography>
          <Typography color="text.secondary">أدخل البيانات العلمية الدقيقة للإضافة إلى قاعدة البيانات</Typography>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('name', { required: 'هذا الحقل مطلوب' })}
                    fullWidth
                    label="الاسم الشائع (Common Name)"
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('scientificName', { required: 'هذا الحقل مطلوب' })}
                    fullWidth
                    label="الاسم العلمي (Scientific Name)"
                    dir="ltr" //  اتجاه إنجليزي للاسم العلمي
                    error={!!errors.scientificName}
                    helperText={errors.scientificName?.message as string}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('type')}
                    select
                    fullWidth
                    label="التصنيف (Classification)"
                    defaultValue="protozoa"
                  >
                    <MenuItem value="protozoa">الأوليات (Protozoa)</MenuItem>
                    <MenuItem value="helminths">الديدان (Helminths)</MenuItem>
                    <MenuItem value="arthropods">المفصليات (Arthropods)</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('stage')}
                    fullWidth
                    label="المرحلة (Stage)"
                    placeholder="مثلاً: Cyst, Trophozoite"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('description')}
                    fullWidth
                    multiline
                    rows={4}
                    label="الوصف المجهري والتشخيص"
                    placeholder="اكتب وصفاً دقيقاً للشكل والحجم والمميزات..."
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/')}>
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<Save size={18} />}
                >
                  حفظ البيانات
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Image Upload Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>الصورة المجهرية</Typography>
            
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
                justifyContent: 'center'
              }}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} 
                  />
                  <IconButton 
                    size="small" 
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                  >
                    <X size={16} />
                  </IconButton>
                </>
              ) : (
                <>
                  <Upload size={40} color="#9CA3AF" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    اضغط لرفع صورة
                    <br />
                    JPG, PNG (Max 5MB)
                  </Typography>
                </>
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
        </Grid>
      </Grid>
    </Container>
  );
}
