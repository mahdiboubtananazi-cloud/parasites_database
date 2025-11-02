import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import './ParasitesList.css';

interface Parasite {
  id: number;
  scientificName: string;
  arabicName?: string;
  frenchName?: string;
  hostSpecies?: string;
  discoveryYear?: number;
  imageUrl?: string;
}

export default function ParasitesList() {
  const { t, i18n } = useTranslation();
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [filteredParasites, setFilteredParasites] = useState<Parasite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHost, setFilterHost] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [hosts, setHosts] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    // Mock data
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
      },
      {
        id: 4,
        scientificName: 'Giardia lamblia',
        arabicName: 'الجيارديا',
        frenchName: 'Giardia lamblia',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2021,
        imageUrl: '/images/parasites/parasite4.png'
      },
      {
        id: 5,
        scientificName: 'Trypanosoma brucei',
        arabicName: 'التريبانوسوما',
        frenchName: 'Trypanosoma brucei',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2023,
        imageUrl: '/images/parasites/parasite1.png'
      },
      {
        id: 6,
        scientificName: 'Leishmania donovani',
        arabicName: 'الليشمانيا',
        frenchName: 'Leishmania donovani',
        hostSpecies: 'Homo sapiens',
        discoveryYear: 2022,
        imageUrl: '/images/parasites/parasite2.png'
      }
    ];

    setParasites(mockParasites);
    setFilteredParasites(mockParasites);

    // Extract unique hosts and years
    const uniqueHosts = [...new Set(mockParasites.map(p => p.hostSpecies).filter(Boolean))] as string[];
    const uniqueYears = [...new Set(mockParasites.map(p => p.discoveryYear).filter(Boolean))] as number[];
    
    setHosts(uniqueHosts);
    setYears(uniqueYears.sort((a, b) => b - a));
  }, []);

  useEffect(() => {
    let result = parasites;

    // Search filter
    if (searchTerm) {
      result = result.filter(p =>
        p.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.arabicName?.includes(searchTerm) ||
        p.frenchName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Host filter
    if (filterHost) {
      result = result.filter(p => p.hostSpecies === filterHost);
    }

    // Year filter
    if (filterYear) {
      result = result.filter(p => p.discoveryYear === parseInt(filterYear));
    }

    setFilteredParasites(result);
  }, [searchTerm, filterHost, filterYear, parasites]);

  return (
    <div className="parasites-list-page">
      <div className="page-header">
        <h1>{t('nav_parasites')}</h1>
        <p>Browse our comprehensive collection of parasites</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>{t('filter_by_host')}</label>
            <select value={filterHost} onChange={(e) => setFilterHost(e.target.value)}>
              <option value="">All Hosts</option>
              {hosts.map(host => (
                <option key={host} value={host}>{host}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('filter_by_year')}</label>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button 
            className="reset-filters"
            onClick={() => {
              setSearchTerm('');
              setFilterHost('');
              setFilterYear('');
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>Found {filteredParasites.length} parasite(s)</p>
      </div>

      {filteredParasites.length > 0 ? (
        <div className="parasites-grid">
          {filteredParasites.map((parasite) => (
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
                <p className="host"><strong>{t('host_species')}:</strong> {parasite.hostSpecies}</p>
                <p className="year"><strong>{t('discovery_year')}:</strong> {parasite.discoveryYear}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>{t('no_results')}</p>
        </div>
      )}
    </div>
  );
}
