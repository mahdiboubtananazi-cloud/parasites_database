import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import TopNav from './components/layout/TopNav';
import Home from './pages/Home';
import Archive from './pages/Archive';
import AddParasite from './pages/AddParasite'; //  استيراد الصفحة
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// حماية المسارات (يتطلب تسجيل دخول)
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}>
    <h1>404 - الصفحة غير موجودة</h1>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <TopNav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/*  إضافة مسار إضافة طفيلي */}
              <Route 
                path="/add-parasite" 
                element={
                   // يمكن إزالة PrivateRoute مؤقتاً للتجربة إذا أردت: element={<AddParasite />}
                   <PrivateRoute><AddParasite /></PrivateRoute> 
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
