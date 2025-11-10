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
import { universityColors } from '../../theme/colors';

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
          {
            text: t('nav_add_sample'),
            icon: <AddCircleIcon />,
            path: '/add-sample',
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
      {/* Header */}
      <Toolbar
        sx={{
          background: `linear-gradient(135deg, ${universityColors.primary.main} 0%, ${universityColors.primary.light} 100%)`,
          color: 'white',
          justifyContent: 'space-between',
          minHeight: '80px !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              ParasiteDB
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
              {t('app_subtitle')}
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      {/* User Info */}
      {isAuthenticated && user && (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'background.light',
            }}
          >
            <Avatar
              sx={{
                bgcolor: universityColors.primary.main,
                width: 48,
                height: 48,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: `${universityColors.primary.main}15`,
                    color: universityColors.primary.main,
                    '&:hover': {
                      bgcolor: `${universityColors.primary.main}25`,
                    },
                    '& .MuiListItemIcon-root': {
                      color: universityColors.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? universityColors.primary.main : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Footer Actions */}
      <Box sx={{ p: 1 }}>
        {!isAuthenticated ? (
          <ListItemButton
            onClick={() => handleNavigation('/login')}
            sx={{
              borderRadius: 2,
              mx: 1,
            }}
          >
            <ListItemIcon>
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
              color: 'error.main',
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
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
          }}
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={i18n.language === 'ar' ? 'العربية' : i18n.language === 'fr' ? 'Français' : 'English'}
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
        >
          العربية
        </MenuItem>
        <MenuItem
          selected={i18n.language === 'fr'}
          onClick={() => handleLanguageChange('fr')}
        >
          Français
        </MenuItem>
        <MenuItem
          selected={i18n.language === 'en'}
          onClick={() => handleLanguageChange('en')}
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
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
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
          borderRight: '1px solid',
          borderColor: 'divider',
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
        bgcolor: 'background.paper',
        boxShadow: 2,
        '&:hover': {
          bgcolor: 'background.paper',
        },
      }}
    >
      <MenuIcon />
    </IconButton>
  );
};

