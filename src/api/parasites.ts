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
// إعدادات Storage
// ==============================================

// يمكن تغيير اسم الـ bucket من متغيرات البيئة أو استخدام القيمة الافتراضية
const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET || 'parasite-images';

// أسماء الـ buckets المحتملة للتحقق
const POSSIBLE_BUCKETS = ['parasite-images', 'parasites', 'parasite_images'];

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

  let query = supabase
    .from('parasites')
    .select('*', { count: 'exact' });

  if (status !== 'all') query = query.eq('status', status);
  if (type !== 'all') query = query.eq('type', type);
  if (stage !== 'all') query = query.eq('stage', stage);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,scientificname.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

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

const getParasiteById = async (id: string): Promise<Parasite | null> => {
  const { data, error } = await supabase
    .from('parasites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }

  return transformFromDB(data as ParasiteFromDB);
};

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
// Create / Update
// ==============================================

const uploadImage = async (image: File): Promise<string> => {
  const fileExt = image.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

  // محاولة الرفع إلى الـ bucket المحدد
  let lastError: Error | null = null;

  for (const bucketName of [
    STORAGE_BUCKET,
    ...POSSIBLE_BUCKETS.filter((b) => b !== STORAGE_BUCKET),
  ]) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        // إذا كان الخطأ "Bucket not found"، جرب الـ bucket التالي
        if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
          lastError = new Error(`Bucket "${bucketName}" not found`);
          continue;
        }
        // خطأ آخر، أرجعه مباشرة
        throw new Error(`فشل في رفع الصورة إلى ${bucketName}: ${error.message}`);
      }

      // نجح الرفع، احصل على الرابط العام
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error(`فشل في الحصول على رابط الصورة من ${bucketName}`);
      }

      return urlData.publicUrl;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // إذا لم يكن خطأ "Bucket not found"، أرجعه مباشرة
      if (
        !lastError.message.includes('not found') &&
        !lastError.message.includes('Bucket')
      ) {
        throw lastError;
      }
    }
  }

  // فشلت جميع المحاولات
  const errorMessage = lastError?.message || 'فشل في رفع الصورة';
  const suggestion = `تأكد من وجود bucket باسم "${STORAGE_BUCKET}" أو "${POSSIBLE_BUCKETS.join(
    '" أو "'
  )}" في Supabase Storage.`;
  throw new Error(`${errorMessage}. ${suggestion}`);
};

const createParasite = async (input: CreateParasiteInput): Promise<Parasite> => {
  const { image, ...parasiteData } = input;
  const dbData = transformToDB(parasiteData);

  if (image) {
    dbData.imageurl = await uploadImage(image);
  }

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

const updateParasite = async (
  id: string,
  input: UpdateParasiteInput
): Promise<Parasite> => {
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
  getPaginated: getParasitesPaginated,
  search: searchParasites,
  searchParasites,
  getById: getParasiteById,
  getFilterOptions,
  create: createParasite,
  update: updateParasite,
  delete: deleteParasite,
};

export type { Parasite, CreateParasiteInput, UpdateParasiteInput };