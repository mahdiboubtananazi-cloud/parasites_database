import { useState, useEffect } from 'react';

export interface Parasite {
  id: string;
  name: string;
  scientificName: string;
  type: string;
  description: string;
  imageUrl?: string;
}

// بيانات وهمية للعرض
const MOCK_DATA: Parasite[] = [
  {
    id: '1',
    name: 'الأميبا الحالة للنسج',
    scientificName: 'Entamoeba histolytica',
    type: 'protozoa',
    description: 'طفيلي أولي مجهري يسبب مرض الزحار الأميبي، ينتقل عبر الطعام والماء الملوث.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Entamoeba_histolytica_01.jpg/640px-Entamoeba_histolytica_01.jpg'
  },
  {
    id: '2',
    name: 'البلهارسيا المنسونية',
    scientificName: 'Schistosoma mansoni',
    type: 'helminths',
    description: 'نوع من الديدان المثقوبة تسبب داء البلهارسيات المعوي، تعيش في الأوعية الدموية.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Schistosoma_mansoni2.jpg/640px-Schistosoma_mansoni2.jpg'
  },
  {
    id: '3',
    name: 'البعوضة الزاعجة',
    scientificName: 'Aedes aegypti',
    type: 'arthropods',
    description: 'ناقل رئيسي لعدة فيروسات منها حمى الضنك والحمى الصفراء.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Aedes_aegypti_CDC-Gathany.jpg/640px-Aedes_aegypti_CDC-Gathany.jpg'
  },
  {
    id: '4',
    name: 'الجيارديا اللمبلية',
    scientificName: 'Giardia lamblia',
    type: 'protozoa',
    description: 'طفيلي سوطي يستوطن الأمعاء الدقيقة ويسبب الإسهال وسوء الامتصاص.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Giardia_lamblia_SEM_8698_lores.jpg/640px-Giardia_lamblia_SEM_8698_lores.jpg'
  }
];

export const useParasites = () => {
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // محاكاة تأخير الشبكة (Network Delay)
    const timer = setTimeout(() => {
      setParasites(MOCK_DATA);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { parasites, loading, error };
};
