import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import './AddParasite.css';

interface AddParasiteProps {
  setIsLoggedIn?: (value: boolean) => void;
}

export default function AddParasite({}: AddParasiteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    scientificName: '',
    commonName: '',
    arabicName: '',
    frenchName: '',
    hostSpecies: '',
    morphologicalCharacteristics: '',
    detectionMethod: '',
    description: '',
    discoveryYear: new Date().getFullYear(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discoveryYear' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to add a parasite');
      navigate('/login');
      return;
    }

    // Here you would normally send the data to your backend
    console.log('Form data:', formData);
    console.log('Image file:', imageFile);

    alert('Parasite added successfully!');
    navigate('/parasites');
  };

  return (
    <div className="add-parasite-page">
      <div className="form-container">
        <h1>{t('add_parasite')}</h1>
        
        <form onSubmit={handleSubmit} className="parasite-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="scientificName">{t('scientific_name')} *</label>
              <input
                type="text"
                id="scientificName"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Plasmodium falciparum"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="commonName">Common Name</label>
                <input
                  type="text"
                  id="commonName"
                  name="commonName"
                  value={formData.commonName}
                  onChange={handleInputChange}
                  placeholder="e.g., Malaria Parasite"
                />
              </div>

              <div className="form-group">
                <label htmlFor="arabicName">{t('arabic_name')}</label>
                <input
                  type="text"
                  id="arabicName"
                  name="arabicName"
                  value={formData.arabicName}
                  onChange={handleInputChange}
                  placeholder="الاسم العربي"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="frenchName">{t('french_name')}</label>
              <input
                type="text"
                id="frenchName"
                name="frenchName"
                value={formData.frenchName}
                onChange={handleInputChange}
                placeholder="Nom français"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Scientific Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hostSpecies">{t('host_species')}</label>
                <input
                  type="text"
                  id="hostSpecies"
                  name="hostSpecies"
                  value={formData.hostSpecies}
                  onChange={handleInputChange}
                  placeholder="e.g., Homo sapiens"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discoveryYear">{t('discovery_year')}</label>
                <input
                  type="number"
                  id="discoveryYear"
                  name="discoveryYear"
                  value={formData.discoveryYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="morphologicalCharacteristics">{t('morphological_characteristics')}</label>
              <textarea
                id="morphologicalCharacteristics"
                name="morphologicalCharacteristics"
                value={formData.morphologicalCharacteristics}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the morphological features..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="detectionMethod">{t('detection_method')}</label>
              <textarea
                id="detectionMethod"
                name="detectionMethod"
                value={formData.detectionMethod}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the detection methods..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">{t('description')}</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Provide a detailed description..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>{t('image')}</h2>

            <div className="image-upload">
              <label htmlFor="imageInput" className="upload-area">
                <Upload size={40} />
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, GIF up to 10MB</span>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <p>Image preview</p>
                </div>
              )}
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
