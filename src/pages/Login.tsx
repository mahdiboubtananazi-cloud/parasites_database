import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { LogIn as LogInIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/core/LoadingSpinner';

const schema = yup.object({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { showError, showSuccess } = useToast();
  const [apiError, setApiError] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError('');
      await login(data);
      showSuccess(t('success') + ' - تم تسجيل الدخول بنجاح');
      
      // Redirect to the page user was trying to access, or home
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'حدث خطأ أثناء تسجيل الدخول';
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
          <LogInIcon size={48} color="#1e3a8a" style={{ marginBottom: '1rem' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {t('login')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            سجل الدخول للوصول إلى قاعدة البيانات
          </Typography>
        </Box>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('email')}
            fullWidth
            label={t('email')}
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            autoComplete="email"
            autoFocus
          />

          <TextField
            {...register('password')}
            fullWidth
            label={t('password')}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {t('login')}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              {t('dont_have_account')}{' '}
              <MuiLink component={Link} to="/register" underline="hover">
                {t('register')}
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
