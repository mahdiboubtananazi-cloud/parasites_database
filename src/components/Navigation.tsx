import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          {t('app_title')}
        </Link>
        <div className={\"nav-menu \\"}>
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
          <li className="nav-item">
            <Link to="/add-parasite" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('nav_add_parasite')}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              {t('nav_login')}
            </Link>
          </li>
        </div>
        <div className=\"nav-toggle \\" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
