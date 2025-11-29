import apiClient, { handleApiError } from './client';

export interface Parasite {
  id: number | string;
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
  type?: string;
  stage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateParasiteDto {
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
  type?: string;
  stage?: string;
}

export interface UpdateParasiteDto extends Partial<CreateParasiteDto> {}

export interface ParasitesResponse {
  data: Parasite[];
  total: number;
  page?: number;
  limit?: number;
}

// Mock data for development
const mockParasites: Parasite[] = [
  {
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
    microscopicImageUrl: '/images/parasites/parasite1.png',
    type: 'Protozoa',
    stage: 'Trophozoite'
  },
  {
    id: 2,
    scientificName: 'Ascaris lumbricoides',
    arabicName: 'الإسكارس',
    frenchName: 'Ascaris lumbricoides',
    commonName: 'Roundworm',
    description: 'Ascaris lumbricoides is a large parasitic nematode that infects the human small intestine.',        
    arabicDescription: 'الإسكارس هو ديدان طفيلية كبيرة تصيب الأمعاء الدقيقة للإنسان.',
    frenchDescription: 'Ascaris lumbricoides est un grand nématode parasite qui infecte l\'intestin grêle humain.', 
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Large roundworm (20-35 cm), cream-colored, thick cuticle, three lips around mouth',
    detectionMethod: 'Stool examination, Kato-Katz technique, Formalin-ether concentration',
    discoveryYear: 2021,
    imageUrl: '/images/parasites/parasite2.png',
    microscopicImageUrl: '/images/parasites/parasite2.png',
    type: 'Nematode',
    stage: 'Adult'
  },
  {
    id: 3,
    scientificName: 'Entamoeba histolytica',
    arabicName: 'الإنتاجيبا',
    frenchName: 'Entamoeba histolytica',
    commonName: 'Amoeba',
    description: 'Entamoeba histolytica is a protozoan parasite that causes amoebic dysentery and liver abscess in humans.',
    arabicDescription: 'الإنتاجيبا هي طفيلي بروتوزواني يسبب الزحار الأميبي وخراج الكبد في البشر.',
    frenchDescription: 'Entamoeba histolytica est un parasite protozoaire qui cause la dysenterie amibienne et l\'abcès hépatique chez l\'homme.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Trophozoites 15-20 μm, cysts 10-20 μm, four nuclei in mature cysts',
    detectionMethod: 'Stool microscopy, Antigen detection, Serology for invasive disease',
    discoveryYear: 2022,
    imageUrl: '/images/parasites/parasite3.png',
    microscopicImageUrl: '/images/parasites/parasite3.png',
    type: 'Protozoa',
    stage: 'Cyst'
  },
  {
    id: 4,
    scientificName: 'Giardia lamblia',
    arabicName: 'الجيارديا',
    frenchName: 'Giardia lamblia',
    commonName: 'Giardia',
    description: 'Giardia lamblia is a flagellated protozoan parasite that colonizes and reproduces in the small intestine.',
    arabicDescription: 'الجيارديا هي طفيلي بروتوزواني سوطي يستعمر ويتكاثر في الأمعاء الدقيقة.',
    frenchDescription: 'Giardia lamblia est un parasite protozoaire flagellé qui colonise et se reproduit dans l\'intestin grêle.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Pear-shaped trophozoites, two nuclei, four pairs of flagella',
    detectionMethod: 'Stool microscopy, Antigen detection, PCR',
    discoveryYear: 2021,
    imageUrl: '/images/parasites/parasite4.png',
    microscopicImageUrl: '/images/parasites/parasite4.png',
    type: 'Protozoa',
    stage: 'Trophozoite'
  },
  {
    id: 5,
    scientificName: 'Trypanosoma brucei',
    arabicName: 'التريبانوسوما',
    frenchName: 'Trypanosoma brucei',
    commonName: 'Sleeping Sickness Parasite',
    description: 'Trypanosoma brucei is a species of parasitic kinetoplastid belonging to the genus Trypanosoma.',    
    arabicDescription: 'التريبانوسوما هو نوع من الطفيليات الكينيتوبلاستيدية التي تنتمي إلى جنس التريبانوسوما.',
    frenchDescription: 'Trypanosoma brucei est une espèce de kinétoplastide parasite appartenant au genre Trypanosoma.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Elongated, flagellated protozoan, undulating membrane',
    detectionMethod: 'Blood smear, CSF examination, Serology',
    discoveryYear: 2023,
    imageUrl: '/images/parasites/parasite1.png',
    microscopicImageUrl: '/images/parasites/parasite1.png',
    type: 'Protozoa',
    stage: 'Trypomastigote'
  },
  {
    id: 6,
    scientificName: 'Leishmania donovani',
    arabicName: 'الليشمانيا',
    frenchName: 'Leishmania donovani',
    commonName: 'Leishmania',
    description: 'Leishmania donovani is a species of intracellular parasites belonging to the genus Leishmania.',    
    arabicDescription: 'الليشمانيا هو نوع من الطفيليات داخل الخلايا التي تنتمي إلى جنس الليشمانيا.',
    frenchDescription: 'Leishmania donovani est une espèce de parasites intracellulaires appartenant au genre Leishmania.',
    hostSpecies: 'Homo sapiens',
    morphologicalCharacteristics: 'Amastigotes in macrophages, promastigotes in sandfly',
    detectionMethod: 'Tissue biopsy, Bone marrow aspirate, Serology',
    discoveryYear: 2022,
    imageUrl: '/images/parasites/parasite2.png',
    microscopicImageUrl: '/images/parasites/parasite2.png',
    type: 'Protozoa',
    stage: 'Amastigote'
  },
];

// Check if we're in development mode (no API URL set)
const isDevelopment = false;

export const parasitesApi = {
  // Get all parasites
  getAll: async (params?: { page?: number; limit?: number; search?: string; host?: string; year?: number }): Promise<ParasitesResponse> => {
    try {
      if (isDevelopment) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let filtered = [...mockParasites];

        // Apply filters
        if (params?.search && params.search.length > 0) {
          const searchLower = params.search.toLowerCase();
          filtered = filtered.filter(p =>
            p.scientificName.toLowerCase().includes(searchLower) ||
            (p.arabicName && p.arabicName.includes(params.search!)) ||
            (p.frenchName && p.frenchName.toLowerCase().includes(searchLower))
          );
        }

        if (params?.host) {
          filtered = filtered.filter(p => p.hostSpecies === params.host);
        }

        if (params?.year) {
          filtered = filtered.filter(p => p.discoveryYear === params.year);
        }

        return {
          data: filtered,
          total: filtered.length,
          page: params?.page || 1,
          limit: params?.limit || filtered.length,
        };
      }

      const response = await apiClient.get<ParasitesResponse>('/parasites', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get parasite by ID
  getById: async (id: number | string): Promise<Parasite> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Convert id to number for comparison if it's a string
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        const parasite = mockParasites.find(p => p.id === numId);
        if (!parasite) {
          throw new Error('Parasite not found');
        }
        return parasite;
      }

      const response = await apiClient.get<Parasite>(`/parasites/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new parasite
  create: async (data: CreateParasiteDto): Promise<Parasite> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newParasite: Parasite = {
          id: mockParasites.length + 1,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockParasites.push(newParasite);
        return newParasite;
      }

      const response = await apiClient.post<Parasite>('/parasites', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update parasite
  update: async (id: number | string, data: UpdateParasiteDto): Promise<Parasite> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        const index = mockParasites.findIndex(p => p.id === numId);
        if (index === -1) {
          throw new Error('Parasite not found');
        }
        mockParasites[index] = { ...mockParasites[index], ...data, updatedAt: new Date().toISOString() };
        return mockParasites[index];
      }

      const response = await apiClient.put<Parasite>(`/parasites/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete parasite
  delete: async (id: number | string): Promise<void> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        const index = mockParasites.findIndex(p => p.id === numId);
        if (index === -1) {
          throw new Error('Parasite not found');
        }
        mockParasites.splice(index, 1);
        return;
      }

      await apiClient.delete(`/parasites/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

