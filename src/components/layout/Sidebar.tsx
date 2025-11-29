import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home as HomeIcon,
  Science as ScienceIcon,
  AddCircle as AddCircleIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Language as LanguageIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { colors, gradients } from '../../theme/colors';

const drawerWidth = 280;

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    {
      text: t('nav_home'),
      icon: <HomeIcon />,
      path: '/',
      protected: false,
    },
    {
      text: t('nav_parasites'),
      icon: <ScienceIcon />,
      path: '/parasites',
      protected: false,
    },
    ...(isAuthenticated
      ? [
          {
            text: t('nav_add_parasite'),
            icon: <AddCircleIcon />,
            path: '/add-parasite',
            protected: true,
          },
        ]
      : []),
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Logo */}
      <Toolbar
        sx={{
          background: gradients.primary,
          color: 'white',
          justifyContent: 'space-between',
          minHeight: '90px !important',
          py: 2,
          px: 2,
          boxShadow: '0 2px 8px rgba(77, 93, 83, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
            }}
          >
            <ScienceIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                lineHeight: 1.1,
                fontSize: '1rem',
              }}
            >
              Parasites
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.85, 
                fontSize: '0.65rem',
                fontWeight: 500,
              }}
            >
              Archive
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: colors.primary.light + '30' }} />

      {/* User Info Section */}
      {isAuthenticated && user && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: colors.background.default,
            }}
          >
            <Avatar
              sx={{
                background: gradients.primary,
                width: 48,
                height: 48,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                noWrap
                sx={{ fontWeight: 600, color: colors.text.primary }}
              >
                {user.name}
              </Typography>
              <Typography 
                variant="caption" 
                noWrap
                sx={{ color: colors.text.secondary }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: colors.primary.light + '30' }} />
        </>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.secondary.main}08 100%)`,
                    color: colors.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.secondary.main}15 100%)`,
                    },
                    '& .MuiListItemIcon-root': {
                      color: colors.primary.main,
                    },
                  },
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colors.primary.main}08 0%, ${colors.secondary.main}04 100%)`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? colors.primary.main : colors.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: colors.primary.light + '30' }} />

      {/* Footer Actions */}
      <Box sx={{ p: 1.5 }}>
        {!isAuthenticated ? (
          <ListItemButton
            onClick={() => handleNavigation('/login')}
            sx={{
              borderRadius: 2,
              mx: 1,
              background: `linear-gradient(135deg, ${colors.primary.main}10 0%, ${colors.secondary.main}05 100%)`,
              color: colors.primary.main,
              fontWeight: 500,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.secondary.main}10 100%)`,
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.primary.main, minWidth: 40 }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav_login')} />
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              mx: 1,
              background: 'rgba(212, 145, 77, 0.1)',
              color: colors.error.main,
              fontWeight: 500,
              '&:hover': {
                background: 'rgba(212, 145, 77, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.error.main, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav_logout')} />
          </ListItemButton>
        )}

        {/* Language Selector */}
        <ListItemButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            borderRadius: 2,
            mx: 1,
            mt: 1,
            background: `linear-gradient(135deg, ${colors.secondary.main}10 0%, ${colors.secondary.main}05 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.secondary.main}20 0%, ${colors.secondary.main}15 100%)`,
            },
          }}
        >
          <ListItemIcon sx={{ color: colors.secondary.main, minWidth: 40 }}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              i18n.language === 'ar'
                ? 'العربية'
                : i18n.language === 'fr'
                ? 'Français'
                : 'English'
            }
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          selected={i18n.language === 'ar'}
          onClick={() => handleLanguageChange('ar')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: `${colors.primary.main}15`,
              color: colors.primary.main,
            },
          }}
        >
          العربية
        </MenuItem>
        <MenuItem
          selected={i18n.language === 'fr'}
          onClick={() => handleLanguageChange('fr')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: `${colors.primary.main}15`,
              color: colors.primary.main,
            },
          }}
        >
          Français
        </MenuItem>
        <MenuItem
          selected={i18n.language === 'en'}
          onClick={() => handleLanguageChange('en')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: `${colors.primary.main}15`,
              color: colors.primary.main,
            },
          }}
        >
          English
        </MenuItem>
      </Menu>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open || false}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: colors.background.default,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.primary.light}30`,
          backgroundColor: colors.background.default,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export const SidebarToggle: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1300,
        background: gradients.primary,
        color: 'white',
        boxShadow: '0 4px 12px rgba(77, 93, 83, 0.25)',
        '&:hover': {
          background: `linear-gradient(135deg, #3a4541 0%, #5a8a6b 100%)`,
          boxShadow: '0 6px 16px rgba(77, 93, 83, 0.35)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <MenuIcon />
    </IconButton>
  );
};
