import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import theme from './theme/theme';
import TopNav from './components/layout/TopNav';
import Home from './pages/Home';
import Archive from './pages/Archive';
import AddParasite from './pages/AddParasite';
import ParasiteDetails from './pages/ParasiteDetails';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import ReviewParasites from './pages/ReviewParasites';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ToastProvider } from './contexts/ToastContext';



const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}><h1>404</h1></Box>
);



function App() {
  const themeObj = useTheme();
  const isMobile = useMediaQuery(themeObj.breakpoints.down('md'));



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <TopNav />
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: '#f8f7f5' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/add-parasite" element={<AddParasite />} />
          <Route path="/parasite/:id" element={<ParasiteDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/review" element={<ReviewParasites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
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