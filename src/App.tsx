import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import TopNav from './components/layout/TopNav';
import Home from './pages/Home';
import Archive from './pages/Archive';
import AddParasite from './pages/AddParasite';
import ParasiteDetails from './pages/ParasiteDetails';
import Dashboard from './pages/Dashboard'; //  استيراد جديد
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}><h1>404</h1></Box>
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
              <Route path="/add-parasite" element={<AddParasite />} />
              <Route path="/parasites/:id" element={<ParasiteDetails />} />
              <Route path="/dashboard" element={<Dashboard />} /> {/*  مسار لوحة التحكم */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
