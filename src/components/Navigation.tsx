import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  isLoggedIn: boolean;
  onLanguageChange: (lang: string) => void;
  onLogout: () => void;
}

export default function Navigation({ isLoggedIn, onLanguageChange, onLogout }: NavigationProps) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">{t('app_title')}</span>
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('nav_home')}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/parasites" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('nav_parasites')}
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/add-parasite" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav_add_parasite')}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/add-sample" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav_add_sample')}
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item language-switcher">
            <div className="language-buttons">
              <button 
                className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}
                onClick={() => {
                  onLanguageChange('ar');
                  setIsMenuOpen(false);
                }}
              >
                العربية
              </button>
              <button 
                className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`}
                onClick={() => {
                  onLanguageChange('fr');
                  setIsMenuOpen(false);
                }}
              >
                Français
              </button>
              <button 
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  onLanguageChange('en');
                  setIsMenuOpen(false);
                }}
              >
                English
              </button>
            </div>
          </li>

          {isLoggedIn ? (
            <li className="nav-item">
              <button 
                className="nav-link logout-btn"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                {t('nav_logout')}
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('nav_login')}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn" onClick={() => setIsMenuOpen(false)}>
                  {t('register')}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
