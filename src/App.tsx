import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import { LoadingSpinner } from './components/core/LoadingSpinner';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import theme from './theme/theme';
import './i18n/config';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const ParasitesList = lazy(() => import('./pages/ParasitesList'));
const ParasiteDetail = lazy(() => import('./pages/ParasiteDetail'));
const AddParasite = lazy(() => import('./pages/AddParasite'));
const AddSample = lazy(() => import('./pages/AddSample'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <AuthProvider>
              <ToastProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <MainLayout>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <Home />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/parasites"
                    element={
                      <MainLayout>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <ParasitesList />
                        </Suspense>
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/parasite/:id"
                    element={
                      <MainLayout>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <ParasiteDetail />
                        </Suspense>
                      </MainLayout>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/add-parasite"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Suspense fallback={<LoadingSpinner fullScreen />}>
                            <AddParasite />
                          </Suspense>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add-sample"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Suspense fallback={<LoadingSpinner fullScreen />}>
                            <AddSample />
                          </Suspense>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Guest Routes (Login/Register) */}
                  <Route
                    path="/login"
                    element={
                      <GuestRoute>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <Login />
                        </Suspense>
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <GuestRoute>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                          <Register />
                        </Suspense>
                      </GuestRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <MainLayout>
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                          <h1>404 - الصفحة غير موجودة</h1>
                          <p>الصفحة التي تبحث عنها غير موجودة.</p>
                        </div>
                      </MainLayout>
                    }
                  />
                </Routes>
              </ToastProvider>
            </AuthProvider>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
