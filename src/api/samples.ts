import apiClient, { handleApiError } from './client';

export interface Sample {
  id: number;
  parasiteId: number;
  sampleNumber: string;
  hostSpecimen?: string;
  collectionDate: string;
  collectionLocation?: string;
  notes?: string;
  collectedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  parasite?: {
    id: number;
    scientificName: string;
    arabicName?: string;
  };
}

export interface CreateSampleDto {
  parasiteId: number;
  sampleNumber: string;
  hostSpecimen?: string;
  collectionDate: string;
  collectionLocation?: string;
  notes?: string;
}

export interface UpdateSampleDto extends Partial<CreateSampleDto> {}

export interface SamplesResponse {
  data: Sample[];
  total: number;
  page?: number;
  limit?: number;
}

// Mock data for development
const mockSamples: Sample[] = [
  {
    id: 1,
    parasiteId: 1,
    sampleNumber: 'S-2024-001',
    hostSpecimen: 'Human blood sample',
    collectionDate: '2024-01-15',
    collectionLocation: 'Laboratory A, Room 101',
    notes: 'Sample collected from patient with malaria symptoms',
    collectedBy: 'Dr. Ahmed',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    parasiteId: 2,
    sampleNumber: 'S-2024-002',
    hostSpecimen: 'Stool sample',
    collectionDate: '2024-01-20',
    collectionLocation: 'Laboratory B, Room 205',
    notes: 'Routine screening',
    collectedBy: 'Dr. Fatima',
    createdAt: '2024-01-20T14:30:00Z',
  },
];

const isDevelopment = !import.meta.env.VITE_API_URL;

export const samplesApi = {
  // Get all samples
  getAll: async (params?: { page?: number; limit?: number; parasiteId?: number }): Promise<SamplesResponse> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filtered = [...mockSamples];
        
        if (params?.parasiteId) {
          filtered = filtered.filter(s => s.parasiteId === params.parasiteId);
        }
        
        return {
          data: filtered,
          total: filtered.length,
          page: params?.page || 1,
          limit: params?.limit || filtered.length,
        };
      }
      
      const response = await apiClient.get<SamplesResponse>('/samples', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get sample by ID
  getById: async (id: number): Promise<Sample> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const sample = mockSamples.find(s => s.id === id);
        if (!sample) {
          throw new Error('Sample not found');
        }
        return sample;
      }
      
      const response = await apiClient.get<Sample>(`/samples/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new sample
  create: async (data: CreateSampleDto): Promise<Sample> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newSample: Sample = {
          id: mockSamples.length + 1,
          ...data,
          collectedBy: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockSamples.push(newSample);
        return newSample;
      }
      
      const response = await apiClient.post<Sample>('/samples', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update sample
  update: async (id: number, data: UpdateSampleDto): Promise<Sample> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockSamples.findIndex(s => s.id === id);
        if (index === -1) {
          throw new Error('Sample not found');
        }
        mockSamples[index] = { ...mockSamples[index], ...data, updatedAt: new Date().toISOString() };
        return mockSamples[index];
      }
      
      const response = await apiClient.put<Sample>(`/samples/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete sample
  delete: async (id: number): Promise<void> => {
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = mockSamples.findIndex(s => s.id === id);
        if (index === -1) {
          throw new Error('Sample not found');
        }
        mockSamples.splice(index, 1);
        return;
      }
      
      await apiClient.delete(`/samples/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

