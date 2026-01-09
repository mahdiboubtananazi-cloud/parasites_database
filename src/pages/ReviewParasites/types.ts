// src/pages/ReviewParasites/types.ts

export interface ReviewComment {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: 'professor' | 'admin' | 'student';
    content: string;
    type: 'feedback' | 'suggestion' | 'issue' | 'approval';
    createdAt: string;
  }
  
  export interface QualityScore {
    imageQuality: number;
    dataCompleteness: number;
    scientificAccuracy: number;
    overall: number;
  }
  
  export type StatusType = 'pending' | 'approved' | 'rejected' | 'archived';
  export type DialogMode = 'view' | 'edit' | 'approve' | 'reject' | 'delete' | null;
  export type ViewMode = 'grid' | 'list';
  export type SortOption = 'date' | 'quality' | 'name';
  export type QualityFilter = 'all' | 'excellent' | 'good' | 'poor';
  
  export interface FilterState {
    status: 'all' | StatusType;
    quality: QualityFilter;
    student: string;
    search: string;
    sort: SortOption;
  }
  
  export interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }