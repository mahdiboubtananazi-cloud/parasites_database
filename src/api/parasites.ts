import apiClient, { handleApiError } from './client';


export interface Parasite {
  id: number | string;
  image?: string;
  name?: string;
  scientificName: string;
  arabicName?: string;
  frenchName?: string;
  commonName?: string;
  description?: string;
  arabicDescription?: string;
  frenchDescription?: string;
  hostSpecies?: string;
  host?: string;
  morphologicalCharacteristics?: string;
  detectionMethod?: string;
  discoveryYear?: number;
  imageUrl?: string;
  imageurl?: string;
  microscopicImageUrl?: string;
  type?: string;
  stage?: string;
  sampleType?: string;
  sampletype?: string;
  stainColor?: string;
  location?: string;
  studentName?: string;
  supervisorName?: string;
  status?: string;
  createdAt?: string;
  createdat?: string;
  updatedAt?: string;
}


export interface CreateParasiteDto {
  scientificName: string;
  name?: string;
  arabicName?: string;
  frenchName?: string;
  commonName?: string;
  description?: string;
  arabicDescription?: string;
  frenchDescription?: string;
  hostSpecies?: string;
  host?: string;
  morphologicalCharacteristics?: string;
  detectionMethod?: string;
  discoveryYear?: number;
  imageUrl?: string;
  imageurl?: string;
  microscopicImageUrl?: string;
  type?: string;
  stage?: string;
  sampleType?: string;
  stainColor?: string;
  location?: string;
  studentName?: string;
  supervisorName?: string;
}


export interface UpdateParasiteDto extends Partial<CreateParasiteDto> {}


export interface ParasitesResponse {
  data: Parasite[];
  total: number;
  page?: number;
  limit?: number;
}


export const parasitesApi = {
  // Get all parasites
  getAll: async (params?: { page?: number; limit?: number; search?: string; host?: string; year?: number }): Promise<ParasitesResponse> => {
    try {
      const response = await apiClient.get<ParasitesResponse>('/parasites', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get parasite by ID
  getById: async (id: number | string): Promise<Parasite> => {
    try {
      const response = await apiClient.get<Parasite>(`/parasites/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new parasite
  create: async (data: CreateParasiteDto): Promise<Parasite> => {
    try {
      const response = await apiClient.post<Parasite>('/parasites', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update parasite
  update: async (id: number | string, data: UpdateParasiteDto): Promise<Parasite> => {
    try {
      const response = await apiClient.put<Parasite>(`/parasites/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete parasite
  delete: async (id: number | string): Promise<void> => {
    try {
      await apiClient.delete(`/parasites/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};