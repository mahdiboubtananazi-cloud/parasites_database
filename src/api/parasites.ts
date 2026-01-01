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
// أنواع Pagination
// ==============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  stage?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'all';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==============================================
// دوال جلب البيانات (Read)
// ==============================================

/**
 * جلب جميع الطفيليات (بدون pagination - للتوافق)
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
 * جلب الطفيليات مع Pagination والفلاتر
 */
const getParasitesPaginated = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<Parasite>> => {
  const {
    page = 1,
    limit = 12,
    search = '',
    type = 'all',
    stage = 'all',
    status = 'approved',
  } = params;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // بناء الاستعلام
  let query = supabase
    .from('parasites')
    .select('*', { count: 'exact' });

  // فلتر الحالة
  if (status !== 'all') {
    query = query.eq('status', status);
  }

  // فلتر النوع
  if (type !== 'all') {
    query = query.eq('type', type);
  }

  // فلتر المرحلة
  if (stage !== 'all') {
    query = query.eq('stage', stage);
  }

  // البحث
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,scientificname.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  // الترتيب والتقسيم
  query = query
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: transformArrayFromDB(data as ParasiteFromDB[]),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * البحث في الطفيليات
 */
const searchParasites = async (query: string): Promise<Parasite[]> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .or(
      `name.ilike.%${query}%,scientificname.ilike.%${query}%,description.ilike.%${query}%`
    )
    .order('created_at', { ascending: false });

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
      return null;
    }
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }

  return transformFromDB(data as ParasiteFromDB);
};

/**
 * جلب الأنواع المتاحة للفلاتر
 */
const getFilterOptions = async (): Promise<{
  types: string[];
  stages: string[];
}> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('type, stage')
    .eq('status', 'approved');

  if (error) {
    throw new Error(`فشل في جلب الفلاتر: ${error.message}`);
  }

  const types = [...new Set(data?.map((p) => p.type).filter(Boolean))] as string[];
  const stages = [...new Set(data?.map((p) => p.stage).filter(Boolean))] as string[];

  return { types, stages };
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
  const { image, ...parasiteData } = input;
  const dbData = transformToDB(parasiteData);

  if (image) {
    dbData.imageurl = await uploadImage(image);
  }

  // الحالة الافتراضية: قيد المراجعة
  dbData.status = 'pending';

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
  const { image, ...parasiteData } = input;
  const dbData = transformToDB(parasiteData);

  if (image) {
    dbData.imageurl = await uploadImage(image);
  }

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
  // Read
  getAll: getParasites,
  getParasites,
  getPaginated: getParasitesPaginated,
  search: searchParasites,
  searchParasites,
  getById: getParasiteById,
  getFilterOptions,
  // Create/Update/Delete
  create: createParasite,
  update: updateParasite,
  delete: deleteParasite,
};

export {
  getParasites,
  getParasitesPaginated,
  searchParasites,
  getParasiteById,
  getFilterOptions,
  createParasite,
  updateParasite,
  deleteParasite,
};

export type { Parasite, CreateParasiteInput, UpdateParasiteInput } from '../types/parasite';