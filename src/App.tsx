import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from './theme/colors';
import { getTheme } from './theme/theme';

// الصفحات
import Home from './pages/Home';
import Archive from './pages/Archive';
import AddParasite from './pages/AddParasite';
import Login from './pages/Login';
import Register from './pages/Register';
import Statistics from './pages/Statistics/Statistics';
import ReviewParasites from './pages/ReviewParasites';
import ParasiteDetails from './pages/ParasiteDetails';

// السياقات
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// المكوّن المشترك
import Navbar from './components/common/Navbar';

// صفحة 404
const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10, color: colors.text.primary }}>
    <h1>404 - Page Not Found</h1>
  </Box>
);

function App() {
  const { i18n } = useTranslation();
  const { loading, error } = useAuth();

  const theme = useMemo(() => getTheme(i18n.language), [i18n.language]);

  // عرض شاشة التحميل أثناء تهيئة المصادقة
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: colors.background.default,
            color: colors.text.primary,
          }}
        >
          <CssBaseline />
          <CircularProgress size={60} thickness={4} sx={{ color: colors.primary.main }} />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box component="p" sx={{ color: colors.text.secondary, mb: 1 }}>
              {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </Box>
            {error && (
              <Box component="p" sx={{ color: 'error.main', fontSize: '0.875rem', mt: 1 }}>
                {error}
              </Box>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: colors.background.default,
          color: colors.text.primary,
        }}
      >
        <CssBaseline />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/parasite/:id" element={<ParasiteDetails />} />
          <Route path="/add" element={<AddParasite />} />
          <Route path="/add-parasite" element={<Navigate to="/add" replace />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/review" element={<ReviewParasites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
}

export default AppWithProviders;
