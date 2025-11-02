import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import './ParasiteDetail.css';

interface Parasite {
  id: number;
  scientificName: string;
  arabicName?: string;
  frenchName?: string;
  commonName?: string;
  description?: string;
  arabicDescription?: string;
  frenchDescription?: string;
  hostSpecies?: string;
  morphologicalCharacteristics?: string;
  detectionMethod?: string;
  discoveryYear?: number;
  imageUrl?: string;
  microscopicImageUrl?: string;
}

const mockParasites: { [key: string]: Parasite } = {
  '1': {
    id: 1,
    scientificName: 'Plasmodium falciparum',
    arabicName: 'البلازموديوم',
    frenchName: 'Plasmodium falciparum',
    commonName: 'Malaria Parasite',
    description: 'Plasmodium falciparum is a parasitic protozoan that causes malaria in humans. It is transmitted through mosquito bites.',
    arabicDescription: 'البلازموديوم هو طفيلي بروتوزواني يسبب الملاريا في البشر. ينتقل من خلال لدغات البعوض.',
    frenchDescription: 'Plasmodium falciparum est un protozoaire parasite qui cause le paludisme chez l\'homme. Il est transmis par les piqûres de moustiques.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Ring-shaped trophozoites, multiple rings per RBC, irregular RBC shape, Maurer\'s clefts',
    detectionMethod: 'Blood smear microscopy, PCR, Rapid diagnostic tests',
    discoveryYear: 2020,
    imageUrl: '/images/parasites/parasite1.png',
    microscopicImageUrl: '/images/parasites/parasite1.png'
  },
  '2': {
    id: 2,
    scientificName: 'Ascaris lumbricoides',
    arabicName: 'الإسكارس',
    frenchName: 'Ascaris lumbricoides',
    commonName: 'Roundworm',
    description: 'Ascaris lumbricoides is a large parasitic nematode that infects the human small intestine. It is one of the most common helminthic infections worldwide.',
    arabicDescription: 'الإسكارس هو ديدان طفيلية كبيرة تصيب الأمعاء الدقيقة للإنسان. وهو من أكثر الإصابات الديدانية شيوعاً في العالم.',
    frenchDescription: 'Ascaris lumbricoides est un grand nématode parasite qui infecte l\'intestin grêle humain. C\'est l\'une des infections helminthiques les plus courantes au monde.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Large roundworm (20-35 cm), cream-colored, thick cuticle, three lips around mouth',
    detectionMethod: 'Stool examination, Kato-Katz technique, Formalin-ether concentration',
    discoveryYear: 2021,
    imageUrl: '/images/parasites/parasite2.png',
    microscopicImageUrl: '/images/parasites/parasite2.png'
  },
  '3': {
    id: 3,
    scientificName: 'Entamoeba histolytica',
    arabicName: 'الإنتاميبا',
    frenchName: 'Entamoeba histolytica',
    commonName: 'Amoeba',
    description: 'Entamoeba histolytica is a protozoan parasite that causes amoebic dysentery and liver abscess in humans.',
    arabicDescription: 'الإنتاميبا هي طفيلي بروتوزواني يسبب الزحار الأميبي وخراج الكبد في البشر.',
    frenchDescription: 'Entamoeba histolytica est un parasite protozoaire qui cause la dysenterie amibienne et l\'abcès hépatique chez l\'homme.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Trophozoites 15-20 μm, cysts 10-20 μm, four nuclei in mature cysts',
    detectionMethod: 'Stool microscopy, Antigen detection, Serology for invasive disease',
    discoveryYear: 2022,
    imageUrl: '/images/parasites/parasite3.png',
    microscopicImageUrl: '/images/parasites/parasite3.png'
  }
};

export default function ParasiteDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  
  const parasite = id ? mockParasites[id] : null;

  if (!parasite) {
    return (
      <div className="parasite-detail-page">
        <div className="error-message">
          <p>{t('no_results')}</p>
          <Link to="/parasites" className="back-button">
            <ArrowLeft size={20} />
            {t('back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="parasite-detail-page">
      <Link to="/parasites" className="back-button">
        <ArrowLeft size={20} />
        {t('back')}
      </Link>

      <div className="detail-container">
        <div className="detail-images">
          <div className="main-image">
            <img 
              src={parasite.imageUrl || '/images/placeholder.png'} 
              alt={parasite.scientificName}
            />
          </div>
          {parasite.microscopicImageUrl && (
            <div className="microscopic-image">
              <img 
                src={parasite.microscopicImageUrl} 
                alt={`Microscopic view of ${parasite.scientificName}`}
              />
              <p className="image-label">{t('microscopic_image')}</p>
            </div>
          )}
        </div>

        <div className="detail-content">
          <h1>{parasite.scientificName}</h1>
          
          {i18n.language === 'ar' && parasite.arabicName && (
            <p className="arabic-name">{parasite.arabicName}</p>
          )}
          {i18n.language === 'fr' && parasite.frenchName && (
            <p className="french-name">{parasite.frenchName}</p>
          )}
          {parasite.commonName && (
            <p className="common-name">{parasite.commonName}</p>
          )}

          <div className="info-grid">
            <div className="info-item">
              <label>{t('host_species')}</label>
              <p>{parasite.hostSpecies}</p>
            </div>
            <div className="info-item">
              <label>{t('discovery_year')}</label>
              <p>{parasite.discoveryYear}</p>
            </div>
          </div>

          <section className="detail-section">
            <h2>{t('description')}</h2>
            <p>
              {i18n.language === 'ar' && parasite.arabicDescription
                ? parasite.arabicDescription
                : i18n.language === 'fr' && parasite.frenchDescription
                ? parasite.frenchDescription
                : parasite.description}
            </p>
          </section>

          {parasite.morphologicalCharacteristics && (
            <section className="detail-section">
              <h2>{t('morphological_characteristics')}</h2>
              <p>{parasite.morphologicalCharacteristics}</p>
            </section>
          )}

          {parasite.detectionMethod && (
            <section className="detail-section">
              <h2>{t('detection_method')}</h2>
              <p>{parasite.detectionMethod}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
