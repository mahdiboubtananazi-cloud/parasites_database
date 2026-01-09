import { Parasite } from '../../types/parasite';

export const PROFESSOR_SECRET_CODE = 'PROF2024';

export const getImageUrl = (parasite: Parasite): string => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const DEFAULT_IMAGE = 'https://placehold.co/400x300?text=No+Image';
  const imageValue = parasite.imageUrl;

  if (!imageValue) return DEFAULT_IMAGE;
  if (imageValue.startsWith('http')) return imageValue;
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/parasite-images/${imageValue}`;
  }
  return DEFAULT_IMAGE;
};