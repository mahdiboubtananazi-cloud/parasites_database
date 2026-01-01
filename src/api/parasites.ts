// ==============================================
// src/api/parasites.ts
// طبقة API للتعامل مع Supabase
// ==============================================

import { supabase } from '../lib/supabase';
import {
  Parasite,
  ParasiteFromDB,
  CreateParasiteInput,
  UpdateParasiteInput,
  transformFromDB,
  transformArrayFromDB,
  transformToDB,
} from '../types/parasite';

// ==============================================
// دوال جلب البيانات (Read)
// ==============================================

/**
 * جلب جميع الطفيليات
 */
const getParasites = async (): Promise<Parasite[]> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }

  return transformArrayFromDB(data as ParasiteFromDB[]);
};

/**
 * البحث في الطفيليات
 */
const searchParasites = async (query: string): Promise<Parasite[]> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .ilike('name', `%${query}%`);

  if (error) {
    throw new Error(`فشل في البحث: ${error.message}`);
  }

  return transformArrayFromDB(data as ParasiteFromDB[]);
};

/**
 * جلب طفيلي بواسطة ID
 */
const getParasiteById = async (id: string): Promise<Parasite | null> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // لم يتم العثور على العنصر
    }
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }

  return transformFromDB(data as ParasiteFromDB);
};

// ==============================================
// دوال الإنشاء والتحديث (Create/Update)
// ==============================================

/**
 * رفع صورة إلى Supabase Storage
 */
const uploadImage = async (image: File): Promise<string> => {
  const fileExt = image.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('parasites')
    .upload(fileName, image);

  if (uploadError) {
    throw new Error(`فشل في رفع الصورة: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('parasites')
    .getPublicUrl(fileName);

  return publicUrl;
};

/**
 * إنشاء طفيلي جديد
 */
const createParasite = async (input: CreateParasiteInput): Promise<Parasite> => {
  // فصل الصورة عن باقي البيانات
  const { image, ...parasiteData } = input;

  // تحويل البيانات لصيغة قاعدة البيانات
  const dbData = transformToDB(parasiteData);

  // رفع الصورة إذا وجدت
  if (image) {
    dbData.imageurl = await uploadImage(image);
  }

  // الإدراج في قاعدة البيانات
  const { data, error } = await supabase
    .from('parasites')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    throw new Error(`فشل في إنشاء العينة: ${error.message}`);
  }

  return transformFromDB(data as ParasiteFromDB);
};

/**
 * تحديث طفيلي
 */
const updateParasite = async (id: string, input: UpdateParasiteInput): Promise<Parasite> => {
  // فصل الصورة عن باقي البيانات
  const { image, ...parasiteData } = input;

  // تحويل البيانات لصيغة قاعدة البيانات
  const dbData = transformToDB(parasiteData);

  // رفع الصورة الجديدة إذا وجدت
  if (image) {
    dbData.imageurl = await uploadImage(image);
  }

  // التحديث في قاعدة البيانات
  const { data, error } = await supabase
    .from('parasites')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`فشل في تحديث العينة: ${error.message}`);
  }

  return transformFromDB(data as ParasiteFromDB);
};

/**
 * حذف طفيلي
 */
const deleteParasite = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('parasites')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`فشل في حذف العينة: ${error.message}`);
  }

  return true;
};

// ==============================================
// التصدير
// ==============================================

export const parasitesApi = {
  getAll: getParasites,
  getParasites,
  search: searchParasites,
  searchParasites,
  getById: getParasiteById,
  create: createParasite,
  update: updateParasite,
  delete: deleteParasite,
};

export {
  getParasites,
  searchParasites,
  getParasiteById,
  createParasite,
  updateParasite,
  deleteParasite,
};

// تصدير الأنواع للاستخدام في أماكن أخرى
export type { Parasite, CreateParasiteInput, UpdateParasiteInput } from '../types/parasite';