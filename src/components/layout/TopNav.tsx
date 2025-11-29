import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Microscope,
  LogOut,
  Globe,
  BarChart3,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { colors, gradients } from '../../theme/colors';

const TopNav = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setAnchorElLang(null);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Archive', path: '/archive' },
    { label: 'Add Sample', path: '/add-parasite' },
    { label: 'Statistics', path: '/statistics' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: '#ffffff',
        borderBottom: `1px solid ${colors.primary.lighter}20`,
        color: colors.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            height: 70,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo Section */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                background: gradients.primary,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(58, 90, 64, 0.2)',
              }}
            >
              <Microscope size={24} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: colors.primary.main,
                letterSpacing: '-0.5px',
              }}
            >
              Parasites Archive
            </Typography>
          </Stack>

          {/* Navigation - Desktop Only */}
          {!isMobile && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                display: 'flex',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive(item.path)
                      ? colors.primary.main
                      : colors.text.secondary,
                    fontWeight: isActive(item.path) ? 600 : 500,
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isActive(item.path)
                      ? `${colors.primary.main}10`
                      : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: `${colors.primary.main}08`,
                      color: colors.primary.main,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          {/* Right Section */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: 'flex' }}
          >
            {/* Language Selector */}
            <Tooltip title="Language">
              <IconButton
                size="small"
                onClick={(e) => setAnchorElLang(e.currentTarget)}
                sx={{
                  color: colors.primary.main,
                  '&:hover': { backgroundColor: `${colors.primary.main}10` },
                }}
              >
                <Globe size={20} />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={() => setAnchorElLang(null)}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 150,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem
                onClick={() => changeLanguage('en')}
                selected={i18n.language === 'en'}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: `${colors.primary.main}15`,
                    color: colors.primary.main,
                  },
                }}
              >
                English
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage('ar')}
                selected={i18n.language === 'ar'}
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
                onClick={() => changeLanguage('fr')}
                selected={i18n.language === 'fr'}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: `${colors.primary.main}15`,
                    color: colors.primary.main,
                  },
                }}
              >
                Français
              </MenuItem>
            </Menu>

            {/* User Section */}
            {user ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton
                    onClick={(e) => setAnchorElUser(e.currentTarget)}
                    sx={{ p: 0.5 }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        background: gradients.primary,
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <MenuItem disabled sx={{ fontSize: '0.85rem' }}>
                    {user.email}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorElUser(null);
                      logout();
                    }}
                    sx={{
                      color: colors.error.main,
                      '&:hover': {
                        backgroundColor: `${colors.error.main}10`,
                      },
                    }}
                  >
                    <LogOut size={18} style={{ marginRight: 8 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  background: gradients.primary,
                  borderRadius: '50px',
                  padding: '8px 20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: `linear-gradient(135deg, #2d4733 0%, #3a5a40 100%)`,
                    boxShadow: '0 4px 12px rgba(58, 90, 64, 0.3)',
                  },
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Tooltip title="Menu">
                <IconButton
                  onClick={onMenuClick}
                  sx={{
                    color: colors.primary.main,
                    '&:hover': {
                      backgroundColor: `${colors.primary.main}10`,
                    },
                  }}
                >
                  <MenuIcon size={24} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNav;
