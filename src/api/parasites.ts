import { supabase } from '../lib/supabase';

// تعريف الأنواع (Types) لضمان التوافق
export interface Parasite {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  category?: string;
  location?: string;
  stage?: string;
  host?: string;
  [key: string]: any; // للسماح بأي حقول إضافية
}

// --- الدوال الأساسية (Implementation) ---

const getParasites = async () => {
  console.log('🔄 Fetching parasites direct from Supabase...');
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase error:', error);
    throw error;
  }
  return data;
};

const searchParasites = async (query: string) => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) throw error;
  return data;
};

const getParasiteById = async (id: string) => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

const createParasite = async (data: any) => {
  // فصل ملف الصورة عن باقي البيانات
  const { image, ...parasiteData } = data;
  let finalImageUrl = parasiteData.image_url;

  // 1. رفع الصورة إذا وجدت
  if (image instanceof File) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('parasites')
      .upload(filePath, image);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('parasites')
      .getPublicUrl(filePath);
      
    finalImageUrl = publicUrl;
  }

  // 2. الحفظ في القاعدة
  const { data: newParasite, error } = await supabase
    .from('parasites')
    .insert([{ ...parasiteData, image_url: finalImageUrl }])
    .select()
    .single();

  if (error) throw error;
  return newParasite;
};

const updateParasite = async (id: string, data: any) => {
    // فصل ملف الصورة عن باقي البيانات
  const { image, ...parasiteData } = data;
  let finalImageUrl = parasiteData.image_url;

  // 1. رفع الصورة الجديدة إذا وجدت
  if (image instanceof File) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('parasites')
      .upload(filePath, image);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('parasites')
      .getPublicUrl(filePath);
      
    finalImageUrl = publicUrl;
  }

  const { data: updatedParasite, error } = await supabase
    .from('parasites')
    .update({ ...parasiteData, image_url: finalImageUrl })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedParasite;
};

const deleteParasite = async (id: string) => {
  const { error } = await supabase
    .from('parasites')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// --- التصدير (Export) ---

// 1. تصدير الكائن المجمّع (لإصلاح الخطأ في useParasites.ts)
export const parasitesApi = {
  getAll: getParasites,      // قد يكون الاسم القديم getAll أو getParasites
  getParasites,              // نضيف الاسمين لضمان التوافق
  search: searchParasites,
  searchParasites,
  getById: getParasiteById,
  create: createParasite,
  update: updateParasite,
  delete: deleteParasite,
};

// 2. تصدير الدوال منفردة أيضاً (للاستخدام المستقبلي)
export { 
  getParasites, 
  searchParasites, 
  getParasiteById, 
  createParasite, 
  updateParasite, 
  deleteParasite 
};
