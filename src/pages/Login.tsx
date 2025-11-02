import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import './Auth.css';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Login({ setIsLoggedIn }: LoginProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication
    if (formData.email && formData.password.length >= 6) {
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: formData.email.split('@')[0]
      }));
      setIsLoggedIn(true);
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <LogIn size={40} color="#667eea" />
          <h1>{t('login')}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {t('login')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t('dont_have_account')} <Link to="/register">{t('register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
