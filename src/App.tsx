import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ParasitesList from './pages/ParasitesList';
import ParasiteDetail from './pages/ParasiteDetail';
import AddParasite from './pages/AddParasite';
import AddSample from './pages/AddSample';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    // Set initial direction
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <div className={`app ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Navigation 
          isLoggedIn={isLoggedIn} 
          onLanguageChange={handleLanguageChange}
          onLogout={() => setIsLoggedIn(false)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parasites" element={<ParasitesList />} />
            <Route path="/parasites/:id" element={<ParasiteDetail />} />
            <Route path="/add-parasite" element={<AddParasite setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/add-sample" element={<AddSample setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
