// ==============================================
// src/types/parasite.ts
// مصدر الحقيقة الوحيد لجميع أنواع الطفيليات
// ==============================================

/**
 * الحقول كما تأتي من قاعدة البيانات
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
  staincolor?: string;
  host?: string;
  location?: string;
  studentname?: string;
  supervisorname?: string;
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
  // حقول المراجعة
  status?: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
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
    host: data.host,
    location: data.location,
    sampleType: data.sampletype,
    stainColor: data.staincolor,
    studentName: data.studentname,
    supervisorName: data.supervisorname,
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
  if ('host' in data && data.host !== undefined) result.host = data.host;
  if ('location' in data && data.location !== undefined) result.location = data.location;
  if ('sampleType' in data && data.sampleType !== undefined) result.sampletype = data.sampleType;
  if ('stainColor' in data && data.stainColor !== undefined) result.staincolor = data.stainColor;
  if ('studentName' in data && data.studentName !== undefined) result.studentname = data.studentName;
  if ('supervisorName' in data && data.supervisorName !== undefined) result.supervisorname = data.supervisorName;
  
  // حقول المراجعة
  if ('status' in data && data.status !== undefined) result.status = data.status;
  if ('reviewedBy' in data && data.reviewedBy !== undefined) result.reviewed_by = data.reviewedBy;
  if ('reviewedAt' in data && data.reviewedAt !== undefined) result.reviewed_at = data.reviewedAt;
  if ('reviewNotes' in data && data.reviewNotes !== undefined) result.review_notes = data.reviewNotes;

  return result;
}

/**
 * تحويل مصفوفة من قاعدة البيانات
 */
export function transformArrayFromDB(dataArray: ParasiteFromDB[]): Parasite[] {
  return dataArray.map(transformFromDB);
}