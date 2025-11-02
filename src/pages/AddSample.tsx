import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AddSample.css';

interface AddSampleProps {
  setIsLoggedIn?: (value: boolean) => void;
}

export default function AddSample({}: AddSampleProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parasiteId: '',
    sampleNumber: '',
    hostSpecimen: '',
    collectionDate: new Date().toISOString().split('T')[0],
    collectionLocation: '',
    notes: '',
  });

  const parasites = [
    { id: 1, name: 'Plasmodium falciparum' },
    { id: 2, name: 'Ascaris lumbricoides' },
    { id: 3, name: 'Entamoeba histolytica' },
    { id: 4, name: 'Giardia lamblia' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to add a sample');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.parasiteId || !formData.sampleNumber) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Sample data:', formData);
    alert('Sample added successfully!');
    navigate('/parasites');
  };

  return (
    <div className="add-sample-page">
      <div className="form-container">
        <h1>{t('add_sample')}</h1>
        
        <form onSubmit={handleSubmit} className="sample-form">
          <div className="form-section">
            <h2>Sample Information</h2>
            
            <div className="form-group">
              <label htmlFor="parasiteId">{t('nav_parasites')} *</label>
              <select
                id="parasiteId"
                name="parasiteId"
                value={formData.parasiteId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a parasite</option>
                {parasites.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sampleNumber">{t('sample_number')} *</label>
              <input
                type="text"
                id="sampleNumber"
                name="sampleNumber"
                value={formData.sampleNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g., S-2024-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hostSpecimen">{t('host_species')}</label>
              <input
                type="text"
                id="hostSpecimen"
                name="hostSpecimen"
                value={formData.hostSpecimen}
                onChange={handleInputChange}
                placeholder="e.g., Human blood sample"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Collection Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="collectionDate">{t('collection_date')}</label>
                <input
                  type="date"
                  id="collectionDate"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="collectionLocation">{t('collection_location')}</label>
                <input
                  type="text"
                  id="collectionLocation"
                  name="collectionLocation"
                  value={formData.collectionLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Laboratory A, Room 101"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">{t('notes')}</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={5}
                placeholder="Add any additional notes about the sample..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {t('submit')}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/parasites')}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
