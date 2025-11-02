import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Microscope, Database, Users, BookOpen } from 'lucide-react';
import './Home.css';

interface Parasite {
  id: number;
  scientificName: string;
  arabicName?: string;
  frenchName?: string;
  hostSpecies?: string;
  discoveryYear?: number;
  imageUrl?: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [totalParasites, setTotalParasites] = useState(0);
  const [totalSamples, setTotalSamples] = useState(0);

  useEffect(() => {
    // Fetch parasites data
    const mockParasites: Parasite[] = [
      {
        id: 1,
        scientificName: 'Plasmodium falciparum',
        arabicName: 'البلازموديوم',
        frenchName: 'Plasmodium falciparum',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2020,
        imageUrl: '/images/parasites/parasite1.png'
      },
      {
        id: 2,
        scientificName: 'Ascaris lumbricoides',
        arabicName: 'الإسكارس',
        frenchName: 'Ascaris lumbricoides',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2021,
        imageUrl: '/images/parasites/parasite2.png'
      },
      {
        id: 3,
        scientificName: 'Entamoeba histolytica',
        arabicName: 'الإنتاميبا',
        frenchName: 'Entamoeba histolytica',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2022,
        imageUrl: '/images/parasites/parasite3.png'
      }
    ];

    setParasites(mockParasites.slice(0, 3));
    setTotalParasites(mockParasites.length);
    setTotalSamples(15);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{t('app_title')}</h1>
          <p>{t('welcome_subtitle')}</p>
          <Link to="/parasites" className="cta-button">
            {t('nav_parasites')}
          </Link>
        </div>
        <div className="hero-image">
          <Microscope size={120} color="#667eea" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <Database size={40} color="#667eea" />
          <h3>{totalParasites}</h3>
          <p>{t('total_parasites')}</p>
        </div>
        <div className="stat-card">
          <BookOpen size={40} color="#764ba2" />
          <h3>{totalSamples}</h3>
          <p>{t('total_samples')}</p>
        </div>
        <div className="stat-card">
          <Users size={40} color="#667eea" />
          <h3>50+</h3>
          <p>Researchers</p>
        </div>
        <div className="stat-card">
          <Microscope size={40} color="#764ba2" />
          <h3>100%</h3>
          <p>Digital Archive</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>{t('app_title')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Microscope size={50} color="#667eea" />
            <h3>{t('nav_parasites')}</h3>
            <p>Browse and search through our comprehensive collection of parasites with detailed scientific information and microscopic images.</p>
          </div>
          <div className="feature-card">
            <Database size={50} color="#764ba2" />
            <h3>{t('nav_samples')}</h3>
            <p>Access detailed information about collected samples, including collection dates, locations, and host species.</p>
          </div>
          <div className="feature-card">
            <BookOpen size={50} color="#667eea" />
            <h3>Scientific Data</h3>
            <p>View morphological characteristics, detection methods, and scientific descriptions in multiple languages.</p>
          </div>
        </div>
      </section>

      {/* Recent Additions */}
      <section className="recent-additions">
        <h2>{t('recent_additions')}</h2>
        <div className="parasites-grid">
          {parasites.map((parasite) => (
            <Link 
              key={parasite.id} 
              to={`/parasites/${parasite.id}`}
              className="parasite-card"
            >
              <div className="parasite-image">
                <img 
                  src={parasite.imageUrl || '/images/placeholder.png'} 
                  alt={parasite.scientificName}
                />
              </div>
              <div className="parasite-info">
                <h3>{parasite.scientificName}</h3>
                {i18n.language === 'ar' && parasite.arabicName && (
                  <p className="arabic-name">{parasite.arabicName}</p>
                )}
                {i18n.language === 'fr' && parasite.frenchName && (
                  <p className="french-name">{parasite.frenchName}</p>
                )}
                <p className="host">{t('host_species')}: {parasite.hostSpecies}</p>
                <p className="year">{t('discovery_year')}: {parasite.discoveryYear}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/parasites" className="view-all-button">
          {t('view_details')} →
        </Link>
      </section>
    </div>
  );
}
