import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar, SidebarToggle } from './Sidebar';
import { ErrorBoundary } from '../core/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        {isMobile ? (
          <>
            <SidebarToggle onClick={handleDrawerToggle} />
            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
          </>
        ) : (
          <Sidebar />
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - 280px)` },
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

