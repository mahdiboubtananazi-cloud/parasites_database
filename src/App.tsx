import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
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
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// المكوّن المشترك (الشريط العلوي)
import Navbar from './components/common/Navbar';

// صفحة الخطأ 404 بسيطة
const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10, color: colors.text.primary }}>
    <h1>404 - Page Not Found</h1>
  </Box>
);

function App() {
  const { i18n } = useTranslation();
  
  //  Theme ديناميكي يتغير مع اللغة
  const theme = useMemo(() => getTheme(i18n.language), [i18n.language]);

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
          {/* الرئيسية */}
          <Route path="/" element={<Home />} />

          {/* الأرشيف + تفاصيل الطفيلي */}
          <Route path="/archive" element={<Archive />} />
          <Route path="/parasite/:id" element={<ParasiteDetails />} />

          {/* إضافة عينة */}
          <Route path="/add" element={<AddParasite />} />
          <Route path="/add-parasite" element={<Navigate to="/add" replace />} />

          {/* الإحصائيات */}
          <Route path="/statistics" element={<Statistics />} />

          {/* مراجعة العينات من طرف الدكاترة */}
          <Route path="/review" element={<ReviewParasites />} />

          {/* المصادقة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 */}
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
