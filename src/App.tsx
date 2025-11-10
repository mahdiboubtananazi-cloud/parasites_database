import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// استيراد الصفحات بأسمائها الصحيحة
import Home from './pages/Home';
import ParasitesList from './pages/ParasitesList';
import AddSample from './pages/AddSample';
import ParasiteDetail from './pages/ParasiteDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// تيم بسيط مع دعم العربية
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1e3a8a', // أزرق الجامعة
    },
    secondary: {
      main: '#dc2626', // أحمر علمي
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Arial", sans-serif',
  },
});

// مكون تنقل بسيط
function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* هيدر بسيط */}
      <header style={{
        backgroundColor: '#1e3a8a',
        color: 'white',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>ParasiteDB</h1>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>قاعدة بيانات عينات الطفيليات - جامعة العربي بن مهيدي</p>
      </header>

      {/* شريط تنقل */}
      <nav style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <a href="/" style={{ margin: '0 1rem', color: '#1e3a8a', textDecoration: 'none' }}>الرئيسية</a>
        <a href="/parasites" style={{ margin: '0 1rem', color: '#1e3a8a', textDecoration: 'none' }}>الطفيليات</a>
        <a href="/add-sample" style={{ margin: '0 1rem', color: '#1e3a8a', textDecoration: 'none' }}>إضافة عينة</a>
        <a href="/login" style={{ margin: '0 1rem', color: '#1e3a8a', textDecoration: 'none' }}>تسجيل الدخول</a>
      </nav>

      {/* المحتوى الرئيسي */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SimpleLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parasites" element={<ParasitesList />} />
            <Route path="/add-sample" element={<AddSample />} />
            <Route path="/parasite/:id" element={<ParasiteDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </SimpleLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;