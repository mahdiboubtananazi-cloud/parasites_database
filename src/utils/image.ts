// دالة عامة تأخذ path (لمنطق Supabase المباشر)
export const getImageUrl = (path: string | undefined): string => {
  if (!path) {
    return 'https://via.placeholder.com/600x400?text=Microscope';
  }

  if (path.startsWith('http')) {
    return path;
  }

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  return `${SUPABASE_URL}/storage/v1/object/public/parasites/${path}`;
};

// نفس منطق صفحة التفاصيل لروابط الـ API (imageurl / imageUrl)
export const fixImageUrl = (url?: string) => {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';

  if (url.startsWith('http')) {
    return url;
  }

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    'https://parasites-api-boubetana.onrender.com';

  return `${apiBase}${url}`;
};
