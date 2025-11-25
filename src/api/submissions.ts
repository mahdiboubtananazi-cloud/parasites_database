import apiClient from './client';

export interface ParasiteSubmission {
  id?: string;
  scientificName: string;
  commonName: string;
  hostSpecies: string;
  discoveryYear: number;
  morphologicalCharacteristics: string;
  detectionMethod: string;
  description: string;
  image?: File;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export const submissionApi = {
  // Submit a parasite
  submitParasite: async (data: FormData): Promise<ParasiteSubmission> => {
    const response = await apiClient.post<ParasiteSubmission>('/parasites/submissions', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get submissions (Admin)
  getSubmissions: async (status?: string): Promise<ParasiteSubmission[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<ParasiteSubmission[]>('/parasites/submissions', { params });
    return response.data;
  },

  // Review submission (Admin)
  reviewSubmission: async (id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<ParasiteSubmission> => {
    const response = await apiClient.patch<ParasiteSubmission>(`/parasites/submissions/${id}/review`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  // Get user submissions
  getUserSubmissions: async (): Promise<ParasiteSubmission[]> => {
    const response = await apiClient.get<ParasiteSubmission[]>('/parasites/submissions/my');
    return response.data;
  },
};