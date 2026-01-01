// ==============================================
// src/types/parasite.ts
// مصدر الحقيقة الوحيد لجميع أنواع الطفيليات
// ==============================================

/**
 * الحقول كما تأتي من قاعدة البيانات
 * ملاحظة: قاعدة البيانات تستخدم camelCase بدون فواصل
 */
export interface ParasiteFromDB {
  id: string;
  name: string;
  scientificname?: string;
  type?: string;
  stage?: string;
  description?: string;
  imageurl?: string;
  sampletype?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdat?: string;
  created_at?: string;
  uploaded_by?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

/**
 * الحقول للاستخدام في التطبيق (camelCase قياسي)
 */
export interface Parasite {
  id: string;
  name: string;
  scientificName?: string;
  commonName?: string;
  type?: string;
  stage?: string;
  description?: string;
  imageUrl?: string;
  host?: string;
  location?: string;
  sampleType?: string;
  stainColor?: string;
  studentName?: string;
  supervisorName?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
  uploadedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

/**
 * البيانات المطلوبة لإنشاء طفيلي جديد
 */
export interface CreateParasiteInput {
  name: string;
  scientificName?: string;
  commonName?: string;
  type: string;
  stage: string;
  description?: string;
  image?: File;
  host?: string;
  location?: string;
  sampleType?: string;
  stainColor?: string;
  studentName: string;
  supervisorName?: string;
}

/**
 * البيانات المطلوبة لتحديث طفيلي
 */
export interface UpdateParasiteInput {
  name?: string;
  scientificName?: string;
  commonName?: string;
  type?: string;
  stage?: string;
  description?: string;
  image?: File;
  host?: string;
  location?: string;
  sampleType?: string;
  stainColor?: string;
  studentName?: string;
  supervisorName?: string;
}

/**
 * فلاتر البحث
 */
export interface ParasiteFilter {
  search: string;
  type: string | 'all';
  stage: string | 'all';
  sampleType?: string | 'all';
  stainColor?: string | 'all';
}

// ==============================================
// دوال التحويل (Transformers)
// ==============================================

/**
 * تحويل من قاعدة البيانات إلى التطبيق
 * قاعدة البيانات تستخدم: imageurl, scientificname, sampletype, createdat
 */
export function transformFromDB(data: ParasiteFromDB): Parasite {
  return {
    id: data.id,
    name: data.name,
    scientificName: data.scientificname,
    type: data.type,
    stage: data.stage,
    description: data.description,
    imageUrl: data.imageurl,
    sampleType: data.sampletype,
    createdAt: data.created_at || data.createdat,
    status: data.status,
    uploadedBy: data.uploaded_by,
    reviewedBy: data.reviewed_by,
    reviewedAt: data.reviewed_at,
    reviewNotes: data.review_notes,
  };
}

/**
 * تحويل من التطبيق إلى قاعدة البيانات
 */
export function transformToDB(data: CreateParasiteInput | UpdateParasiteInput): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if ('name' in data && data.name !== undefined) result.name = data.name;
  if ('scientificName' in data && data.scientificName !== undefined) result.scientificname = data.scientificName;
  if ('type' in data && data.type !== undefined) result.type = data.type;
  if ('stage' in data && data.stage !== undefined) result.stage = data.stage;
  if ('description' in data && data.description !== undefined) result.description = data.description;
  if ('sampleType' in data && data.sampleType !== undefined) result.sampletype = data.sampleType;

  return result;
}

/**
 * تحويل مصفوفة من قاعدة البيانات
 */
export function transformArrayFromDB(dataArray: ParasiteFromDB[]): Parasite[] {
  return dataArray.map(transformFromDB);
}