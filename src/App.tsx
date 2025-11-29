import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import theme from './theme/theme';
import TopNav from './components/layout/TopNav';
import { Sidebar, SidebarToggle } from './components/layout/Sidebar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import AddParasite from './pages/AddParasite';
import ParasiteDetails from './pages/ParasiteDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}><h1>404</h1></Box>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
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
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0, overflow: 'auto' }}>
            <Sidebar open={false} onClose={() => {}} />
          </Box>
        )}

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
            width: isMobile ? '100%' : 'calc(100% - 280px)',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/add-parasite" element={<AddParasite />} />
            <Route path="/parasites/:id" element={<ParasiteDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        {/* Mobile Sidebar Toggle */}
        {isMobile && <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)} />}

        {/* Mobile Sidebar Drawer */}
        {isMobile && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
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
