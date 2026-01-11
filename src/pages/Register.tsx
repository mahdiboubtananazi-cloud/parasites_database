import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { UserPlus as UserPlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

const schema = yup
  .object({
    name: yup
      .string()
      .required('الاسم مطلوب')
      .min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: yup
      .string()
      .email('البريد الإلكتروني غير صحيح')
      .required('البريد الإلكتروني مطلوب'),
    password: yup
      .string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .required('كلمة المرور مطلوبة'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
      .required('تأكيد كلمة المرور مطلوب'),
  })
  .required();

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const { showError, showSuccess } = useToast();
  const [apiError, setApiError] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError('');
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      showSuccess(t('success') + ' - تم إنشاء الحساب بنجاح');
      navigate('/');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'حدث خطأ أثناء إنشاء الحساب';
      setApiError(errorMessage);
      showError(errorMessage);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message={t('loading')} />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <UserPlusIcon size={48} color="#1e3a8a" style={{ marginBottom: '1rem' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {t('register')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            أنشئ حساباً جديداً للوصول إلى قاعدة البيانات
          </Typography>
        </Box>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('name')}
            fullWidth
            label={t('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
            autoComplete="name"
            autoFocus
          />

          <TextField
            {...register('email')}
            fullWidth
            label={t('email')}
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            autoComplete="email"
          />

          <TextField
            {...register('password')}
            fullWidth
            label={t('password')}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            autoComplete="new-password"
          />

          <TextField
            {...register('confirmPassword')}
            fullWidth
            label="تأكيد كلمة المرور"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            margin="normal"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {t('register')}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              {t('already_have_account')}{' '}
              <MuiLink component={Link} to="/login" underline="hover">
                {t('login')}
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}