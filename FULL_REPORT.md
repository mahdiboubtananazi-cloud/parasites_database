# Technical Analysis Report

Generated: 2026-01-11T13:40:00.147Z

## 1. ESLint Report (Code Quality)
```json
[
  {
    "filePath": "C:\\parasites_database\\src\\App.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\api\\parasites.ts",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'uploadData' is assigned a value but never used.",
        "line": 187,
        "column": 28,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 187,
        "endColumn": 38
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "// ==============================================\r\n// src/api/parasites.ts\r\n// طبقة API للتعامل مع Supabase\r\n// ==============================================\r\n\r\nimport { supabase } from '../lib/supabase';\r\nimport {\r\n  Parasite,\r\n  ParasiteFromDB,\r\n  CreateParasiteInput,\r\n  UpdateParasiteInput,\r\n  transformFromDB,\r\n  transformArrayFromDB,\r\n  transformToDB,\r\n} from '../types/parasite';\r\n\r\n// ==============================================\r\n// إعدادات Storage\r\n// ==============================================\r\n\r\n// يمكن تغيير اسم الـ bucket من متغيرات البيئة أو استخدام القيمة الافتراضية\r\nconst STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET || 'parasite-images';\r\n\r\n// أسماء الـ buckets المحتملة للتحقق\r\nconst POSSIBLE_BUCKETS = ['parasite-images', 'parasites', 'parasite_images'];\r\n\r\n// ==============================================\r\n// أنواع Pagination\r\n// ==============================================\r\n\r\nexport interface PaginationParams {\r\n  page?: number;\r\n  limit?: number;\r\n  search?: string;\r\n  type?: string;\r\n  stage?: string;\r\n  status?: 'pending' | 'approved' | 'rejected' | 'all';\r\n}\r\n\r\nexport interface PaginatedResponse<T> {\r\n  data: T[];\r\n  pagination: {\r\n    page: number;\r\n    limit: number;\r\n    total: number;\r\n    totalPages: number;\r\n    hasNext: boolean;\r\n    hasPrev: boolean;\r\n  };\r\n}\r\n\r\n// ==============================================\r\n// دوال جلب البيانات (Read)\r\n// ==============================================\r\n\r\nconst getParasites = async (): Promise<Parasite[]> => {\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .select('*')\r\n    .order('created_at', { ascending: false });\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في جلب البيانات: ${error.message}`);\r\n  }\r\n\r\n  return transformArrayFromDB(data as ParasiteFromDB[]);\r\n};\r\n\r\nconst getParasitesPaginated = async (\r\n  params: PaginationParams = {}\r\n): Promise<PaginatedResponse<Parasite>> => {\r\n  const {\r\n    page = 1,\r\n    limit = 12,\r\n    search = '',\r\n    type = 'all',\r\n    stage = 'all',\r\n    status = 'approved',\r\n  } = params;\r\n\r\n  const from = (page - 1) * limit;\r\n  const to = from + limit - 1;\r\n\r\n  let query = supabase\r\n    .from('parasites')\r\n    .select('*', { count: 'exact' });\r\n\r\n  if (status !== 'all') query = query.eq('status', status);\r\n  if (type !== 'all') query = query.eq('type', type);\r\n  if (stage !== 'all') query = query.eq('stage', stage);\r\n\r\n  if (search) {\r\n    query = query.or(\r\n      `name.ilike.%${search}%,scientificname.ilike.%${search}%,description.ilike.%${search}%`\r\n    );\r\n  }\r\n\r\n  query = query\r\n    .order('created_at', { ascending: false })\r\n    .range(from, to);\r\n\r\n  const { data, error, count } = await query;\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في جلب البيانات: ${error.message}`);\r\n  }\r\n\r\n  const total = count || 0;\r\n  const totalPages = Math.ceil(total / limit);\r\n\r\n  return {\r\n    data: transformArrayFromDB(data as ParasiteFromDB[]),\r\n    pagination: {\r\n      page,\r\n      limit,\r\n      total,\r\n      totalPages,\r\n      hasNext: page < totalPages,\r\n      hasPrev: page > 1,\r\n    },\r\n  };\r\n};\r\n\r\nconst searchParasites = async (query: string): Promise<Parasite[]> => {\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .select('*')\r\n    .or(\r\n      `name.ilike.%${query}%,scientificname.ilike.%${query}%,description.ilike.%${query}%`\r\n    )\r\n    .order('created_at', { ascending: false });\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في البحث: ${error.message}`);\r\n  }\r\n\r\n  return transformArrayFromDB(data as ParasiteFromDB[]);\r\n};\r\n\r\nconst getParasiteById = async (id: string): Promise<Parasite | null> => {\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .select('*')\r\n    .eq('id', id)\r\n    .single();\r\n\r\n  if (error) {\r\n    if (error.code === 'PGRST116') return null;\r\n    throw new Error(`فشل في جلب البيانات: ${error.message}`);\r\n  }\r\n\r\n  return transformFromDB(data as ParasiteFromDB);\r\n};\r\n\r\nconst getFilterOptions = async (): Promise<{\r\n  types: string[];\r\n  stages: string[];\r\n}> => {\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .select('type, stage')\r\n    .eq('status', 'approved');\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في جلب الفلاتر: ${error.message}`);\r\n  }\r\n\r\n  const types = [...new Set(data?.map((p) => p.type).filter(Boolean))] as string[];\r\n  const stages = [...new Set(data?.map((p) => p.stage).filter(Boolean))] as string[];\r\n\r\n  return { types, stages };\r\n};\r\n\r\n// ==============================================\r\n// Create / Update\r\n// ==============================================\r\n\r\nconst uploadImage = async (image: File): Promise<string> => {\r\n  const fileExt = image.name.split('.').pop();\r\n  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;\r\n\r\n  // محاولة الرفع إلى الـ bucket المحدد\r\n  let lastError: Error | null = null;\r\n  \r\n  for (const bucketName of [STORAGE_BUCKET, ...POSSIBLE_BUCKETS.filter(b => b !== STORAGE_BUCKET)]) {\r\n    try {\r\n      const { error, data: uploadData } = await supabase.storage\r\n        .from(bucketName)\r\n        .upload(fileName, image, {\r\n          cacheControl: '3600',\r\n          upsert: false,\r\n        });\r\n\r\n      if (error) {\r\n        // إذا كان الخطأ \"Bucket not found\"، جرب الـ bucket التالي\r\n        if (error.message.includes('Bucket not found') || error.message.includes('not found')) {\r\n          lastError = new Error(`Bucket \"${bucketName}\" not found`);\r\n          continue;\r\n        }\r\n        // خطأ آخر، أرجعه مباشرة\r\n        throw new Error(`فشل في رفع الصورة إلى ${bucketName}: ${error.message}`);\r\n      }\r\n\r\n      // نجح الرفع، احصل على الرابط العام\r\n      const { data: urlData } = supabase.storage\r\n        .from(bucketName)\r\n        .getPublicUrl(fileName);\r\n\r\n      if (!urlData?.publicUrl) {\r\n        throw new Error(`فشل في الحصول على رابط الصورة من ${bucketName}`);\r\n      }\r\n\r\n      return urlData.publicUrl;\r\n    } catch (err) {\r\n      lastError = err instanceof Error ? err : new Error(String(err));\r\n      // إذا لم يكن خطأ \"Bucket not found\"، أرجعه مباشرة\r\n      if (!lastError.message.includes('not found') && !lastError.message.includes('Bucket')) {\r\n        throw lastError;\r\n      }\r\n    }\r\n  }\r\n\r\n  // فشلت جميع المحاولات\r\n  const errorMessage = lastError?.message || 'فشل في رفع الصورة';\r\n  const suggestion = `تأكد من وجود bucket باسم \"${STORAGE_BUCKET}\" أو \"${POSSIBLE_BUCKETS.join('\" أو \"')}\" في Supabase Storage.`;\r\n  throw new Error(`${errorMessage}. ${suggestion}`);\r\n};\r\n\r\nconst createParasite = async (input: CreateParasiteInput): Promise<Parasite> => {\r\n  const { image, ...parasiteData } = input;\r\n  const dbData = transformToDB(parasiteData);\r\n\r\n  if (image) {\r\n    dbData.imageurl = await uploadImage(image);\r\n  }\r\n\r\n  dbData.status = 'pending';\r\n\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .insert([dbData])\r\n    .select()\r\n    .single();\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في إنشاء العينة: ${error.message}`);\r\n  }\r\n\r\n  return transformFromDB(data as ParasiteFromDB);\r\n};\r\n\r\nconst updateParasite = async (\r\n  id: string,\r\n  input: UpdateParasiteInput\r\n): Promise<Parasite> => {\r\n  const { image, ...parasiteData } = input;\r\n  const dbData = transformToDB(parasiteData);\r\n\r\n  if (image) {\r\n    dbData.imageurl = await uploadImage(image);\r\n  }\r\n\r\n  const { data, error } = await supabase\r\n    .from('parasites')\r\n    .update(dbData)\r\n    .eq('id', id)\r\n    .select()\r\n    .single();\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في تحديث العينة: ${error.message}`);\r\n  }\r\n\r\n  return transformFromDB(data as ParasiteFromDB);\r\n};\r\n\r\nconst deleteParasite = async (id: string): Promise<boolean> => {\r\n  const { error } = await supabase\r\n    .from('parasites')\r\n    .delete()\r\n    .eq('id', id);\r\n\r\n  if (error) {\r\n    throw new Error(`فشل في حذف العينة: ${error.message}`);\r\n  }\r\n\r\n  return true;\r\n};\r\n\r\n// ==============================================\r\n// التصدير\r\n// ==============================================\r\n\r\nexport const parasitesApi = {\r\n  getAll: getParasites,\r\n  getParasites,\r\n  getPaginated: getParasitesPaginated,\r\n  search: searchParasites,\r\n  searchParasites,\r\n  getById: getParasiteById,\r\n  getFilterOptions,\r\n  create: createParasite,\r\n  update: updateParasite,\r\n  delete: deleteParasite,\r\n};\r\n\r\nexport type { Parasite, CreateParasiteInput, UpdateParasiteInput };\r\n",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\archive\\ParasiteCard.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\auth\\GuestRoute.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\auth\\ProtectedRoute.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\common\\Navbar.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'User' is defined but never used.",
        "line": 35,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 35,
        "endColumn": 7
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "﻿import React, { useState, useEffect } from 'react';\r\nimport {\r\n  Box,\r\n  Button,\r\n  IconButton,\r\n  useMediaQuery,\r\n  useTheme,\r\n  Stack,\r\n  Tooltip,\r\n  Drawer,\r\n  List,\r\n  ListItem,\r\n  ListItemButton,\r\n  ListItemIcon,\r\n  ListItemText,\r\n  Divider,\r\n  Paper,\r\n  Menu,\r\n  MenuItem,\r\n  Avatar,\r\n  Typography,\r\n} from '@mui/material';\r\nimport {\r\n  Microscope,\r\n  Menu as MenuIcon,\r\n  Globe,\r\n  Home,\r\n  Archive,\r\n  PlusCircle,\r\n  BarChart2,\r\n  CheckSquare,\r\n  X,\r\n  LogIn,\r\n  LogOut,\r\n  User,\r\n  ChevronDown,\r\n} from 'lucide-react';\r\nimport { useNavigate, useLocation } from 'react-router-dom';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { colors } from '../../theme/colors';\r\nimport { useAuth } from '../../hooks/useAuth';\r\n\r\nconst Navbar: React.FC = () => {\r\n  const navigate = useNavigate();\r\n  const location = useLocation();\r\n  const { t, i18n } = useTranslation();\r\n  const theme = useTheme();\r\n  const isMobile = useMediaQuery(theme.breakpoints.down('md'));\r\n  const [mobileOpen, setMobileOpen] = useState(false);\r\n  const [scrolled, setScrolled] = useState(false);\r\n  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);\r\n\r\n  const { user, logout } = useAuth();\r\n\r\n  useEffect(() => {\r\n    const handleScroll = () => {\r\n      setScrolled(window.scrollY > 20);\r\n    };\r\n    window.addEventListener('scroll', handleScroll);\r\n    return () => window.removeEventListener('scroll', handleScroll);\r\n  }, []);\r\n\r\n  const links = [\r\n    { label: t('nav_home'), path: '/', icon: <Home size={20} /> },\r\n    { label: t('nav_archive'), path: '/archive', icon: <Archive size={20} /> },\r\n    { label: t('nav_add_parasite'), path: '/add', icon: <PlusCircle size={20} /> },\r\n    { label: t('nav_statistics'), path: '/statistics', icon: <BarChart2 size={20} /> },\r\n    { label: t('nav_review'), path: '/review', icon: <CheckSquare size={20} /> },\r\n  ];\r\n\r\n  const isActive = (path: string) => location.pathname === path;\r\n\r\n  const toggleLanguage = () => {\r\n    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';\r\n    i18n.changeLanguage(newLang);\r\n    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';\r\n    document.documentElement.lang = newLang;\r\n  };\r\n\r\n  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);\r\n\r\n  const handleLogout = () => {\r\n    logout();\r\n    setUserAnchor(null);\r\n    navigate('/');\r\n  };\r\n\r\n  return (\r\n    <>\r\n      <Box\r\n        sx={{\r\n          position: 'sticky',\r\n          top: 0,\r\n          zIndex: 1200,\r\n          pt: 1.5,\r\n          pb: 1,\r\n          px: 2,\r\n          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',\r\n          backdropFilter: scrolled ? 'blur(10px)' : 'none',\r\n          borderBottom: scrolled ? `1px solid ${colors.primary.lighter}30` : 'none',\r\n          transition: 'all 0.3s ease',\r\n        }}\r\n      >\r\n        <Box\r\n          sx={{\r\n            maxWidth: 1200,\r\n            mx: 'auto',\r\n            display: 'flex',\r\n            alignItems: 'center',\r\n            justifyContent: 'space-between',\r\n          }}\r\n        >\r\n          {/* Logo */}\r\n          <Box\r\n            sx={{\r\n              display: 'flex',\r\n              alignItems: 'center',\r\n              gap: 1.5,\r\n              cursor: 'pointer',\r\n              transition: 'transform 0.2s',\r\n              '&:hover': { transform: 'scale(1.02)' },\r\n            }}\r\n            onClick={() => navigate('/')}\r\n          >\r\n            <Paper\r\n              elevation={scrolled ? 2 : 0}\r\n              sx={{\r\n                p: 0.8,\r\n                borderRadius: '50%',\r\n                bgcolor: colors.primary.main,\r\n                display: 'flex',\r\n                alignItems: 'center',\r\n                justifyContent: 'center',\r\n              }}\r\n            >\r\n              <Microscope size={20} color=\"#fff\" />\r\n            </Paper>\r\n            {!isMobile && (\r\n              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: colors.primary.main }}>\r\n                {t('app_title')}\r\n              </Typography>\r\n            )}\r\n          </Box>\r\n\r\n          {/* Desktop Links */}\r\n          {!isMobile && (\r\n            <Stack direction=\"row\" spacing={0.5} alignItems=\"center\">\r\n              {links.map((link) => (\r\n                <Button\r\n                  key={link.path}\r\n                  onClick={() => navigate(link.path)}\r\n                  sx={{\r\n                    textTransform: 'none',\r\n                    borderRadius: 999,\r\n                    px: 2,\r\n                    py: 0.7,\r\n                    fontSize: '0.88rem',\r\n                    fontWeight: isActive(link.path) ? 700 : 500,\r\n                    color: isActive(link.path) ? colors.primary.main : colors.text.secondary,\r\n                    bgcolor: isActive(link.path) ? `${colors.primary.main}10` : 'transparent',\r\n                    '&:hover': { bgcolor: `${colors.primary.main}08` },\r\n                  }}\r\n                >\r\n                  {link.label}\r\n                </Button>\r\n              ))}\r\n\r\n              <Divider orientation=\"vertical\" flexItem sx={{ height: 24, alignSelf: 'center', mx: 1 }} />\r\n\r\n              <Tooltip title={t('nav_language')}>\r\n                <IconButton onClick={toggleLanguage} size=\"small\" sx={{ color: colors.text.secondary }}>\r\n                  <Globe size={20} />\r\n                  <Typography variant=\"caption\" sx={{ ml: 0.5, fontWeight: 700 }}>\r\n                    {i18n.language === 'ar' ? 'FR' : 'AR'}\r\n                  </Typography>\r\n                </IconButton>\r\n              </Tooltip>\r\n\r\n              {user ? (\r\n                <>\r\n                  <Button\r\n                    onClick={(e) => setUserAnchor(e.currentTarget)}\r\n                    sx={{\r\n                      textTransform: 'none',\r\n                      borderRadius: 999,\r\n                      pl: 0.5,\r\n                      pr: 1.5,\r\n                      py: 0.5,\r\n                      ml: 1,\r\n                      gap: 1,\r\n                      border: `1px solid ${colors.primary.lighter}`,\r\n                      '&:hover': { bgcolor: `${colors.primary.main}05`, borderColor: colors.primary.main },\r\n                    }}\r\n                  >\r\n                    <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary.main, fontSize: '0.85rem' }}>\r\n                      {user.name?.charAt(0).toUpperCase()}\r\n                    </Avatar>\r\n                    <ChevronDown size={16} color={colors.text.secondary} />\r\n                  </Button>\r\n                  <Menu\r\n                    anchorEl={userAnchor}\r\n                    open={Boolean(userAnchor)}\r\n                    onClose={() => setUserAnchor(null)}\r\n                    PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}\r\n                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}\r\n                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}\r\n                  >\r\n                    <Box sx={{ px: 2, py: 1.5 }}>\r\n                      <Typography variant=\"subtitle2\" fontWeight={700}>{user.name}</Typography>\r\n                      <Typography variant=\"caption\" color=\"text.secondary\">{user.email}</Typography>\r\n                    </Box>\r\n                    <Divider />\r\n                    <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', gap: 1.5, mt: 0.5 }}>\r\n                      <LogOut size={16} />\r\n                      {t('nav_logout', { defaultValue: 'تسجيل خروج' })}\r\n                    </MenuItem>\r\n                  </Menu>\r\n                </>\r\n              ) : (\r\n                <Button\r\n                  variant=\"contained\"\r\n                  onClick={() => navigate('/login')}\r\n                  startIcon={<LogIn size={16} />}\r\n                  sx={{\r\n                    borderRadius: 999,\r\n                    px: 3,\r\n                    bgcolor: colors.primary.main,\r\n                    boxShadow: '0 4px 12px rgba(11, 43, 38, 0.2)',\r\n                    '&:hover': { bgcolor: colors.primary.dark, boxShadow: '0 6px 16px rgba(11, 43, 38, 0.3)' },\r\n                  }}\r\n                >\r\n                  {t('nav_login')}\r\n                </Button>\r\n              )}\r\n            </Stack>\r\n          )}\r\n\r\n          {/* Mobile Menu Button */}\r\n          {isMobile && (\r\n            <IconButton onClick={handleDrawerToggle} sx={{ color: colors.primary.main }}>\r\n              <MenuIcon size={24} />\r\n            </IconButton>\r\n          )}\r\n        </Box>\r\n      </Box>\r\n\r\n      {/* Mobile Drawer */}\r\n      <Drawer\r\n        anchor={i18n.language === 'ar' ? 'right' : 'left'}\r\n        open={mobileOpen}\r\n        onClose={handleDrawerToggle}\r\n        PaperProps={{ sx: { width: 280, bgcolor: '#fafcfb', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}\r\n      >\r\n        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>\r\n          <Stack direction=\"row\" spacing={1.5} alignItems=\"center\">\r\n            <Paper sx={{ p: 1, borderRadius: '50%', bgcolor: colors.primary.main, display: 'flex' }}>\r\n              <Microscope size={20} color=\"#fff\" />\r\n            </Paper>\r\n            <Typography variant=\"h6\" fontWeight={800} color={colors.primary.main}>\r\n              {t('app_title')}\r\n            </Typography>\r\n          </Stack>\r\n          <IconButton onClick={handleDrawerToggle} size=\"small\">\r\n            <X size={20} />\r\n          </IconButton>\r\n        </Box>\r\n\r\n        {user && (\r\n          <Box sx={{ px: 3, pb: 3 }}>\r\n            <Paper variant=\"outlined\" sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>\r\n              <Avatar sx={{ bgcolor: colors.primary.main }}>{user.name?.charAt(0)}</Avatar>\r\n              <Box sx={{ overflow: 'hidden' }}>\r\n                <Typography variant=\"subtitle2\" noWrap>{user.name}</Typography>\r\n                <Typography variant=\"caption\" color=\"text.secondary\" noWrap>{user.email}</Typography>\r\n              </Box>\r\n            </Paper>\r\n          </Box>\r\n        )}\r\n\r\n        <List sx={{ px: 2 }}>\r\n          {links.map((link) => (\r\n            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>\r\n              <ListItemButton\r\n                selected={isActive(link.path)}\r\n                onClick={() => { navigate(link.path); handleDrawerToggle(); }}\r\n                sx={{ borderRadius: 3, '&.Mui-selected': { bgcolor: `${colors.primary.main}15`, color: colors.primary.main } }}\r\n              >\r\n                <ListItemIcon sx={{ minWidth: 40, color: isActive(link.path) ? colors.primary.main : 'inherit' }}>\r\n                  {link.icon}\r\n                </ListItemIcon>\r\n                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }} />\r\n              </ListItemButton>\r\n            </ListItem>\r\n          ))}\r\n        </List>\r\n\r\n        <Box sx={{ mt: 'auto', p: 3 }}>\r\n          <Stack spacing={2}>\r\n            <Button\r\n              variant=\"outlined\"\r\n              fullWidth\r\n              startIcon={<Globe size={18} />}\r\n              onClick={toggleLanguage}\r\n              sx={{ justifyContent: 'flex-start', borderRadius: 3, color: colors.text.primary, borderColor: 'rgba(0,0,0,0.1)' }}\r\n            >\r\n              {i18n.language === 'ar' ? 'Français' : 'العربية'}\r\n            </Button>\r\n            {user ? (\r\n              <Button\r\n                variant=\"outlined\"\r\n                fullWidth\r\n                color=\"error\"\r\n                startIcon={<LogOut size={18} />}\r\n                onClick={() => { handleLogout(); handleDrawerToggle(); }}\r\n                sx={{ justifyContent: 'flex-start', borderRadius: 3 }}\r\n              >\r\n                {t('nav_logout', { defaultValue: 'تسجيل خروج' })}\r\n              </Button>\r\n            ) : (\r\n              <Button\r\n                variant=\"contained\"\r\n                fullWidth\r\n                startIcon={<LogIn size={18} />}\r\n                onClick={() => { navigate('/login'); handleDrawerToggle(); }}\r\n                sx={{ borderRadius: 3, bgcolor: colors.primary.main, boxShadow: 'none' }}\r\n              >\r\n                {t('nav_login')}\r\n              </Button>\r\n            )}\r\n          </Stack>\r\n        </Box>\r\n      </Drawer>\r\n    </>\r\n  );\r\n};\r\n\r\nexport default Navbar;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\core\\ErrorBoundary.tsx",
    "messages": [],
    "suppressedMessages": [
      {
        "ruleId": "react-refresh/only-export-components",
        "severity": 2,
        "message": "Fast refresh only works when a file only exports components. Move your component(s) to a separate file.",
        "line": 51,
        "column": 7,
        "nodeType": "Identifier",
        "messageId": "localComponents",
        "endLine": 51,
        "endColumn": 55,
        "suppressions": [
          {
            "kind": "directive",
            "justification": ""
          }
        ]
      }
    ],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\core\\LoadingSpinner.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\home\\CtaSection.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\home\\Footer.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\home\\Hero.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\components\\home\\StatsSection.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'ArrowRight' is defined but never used.",
        "line": 13,
        "column": 10,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 13,
        "endColumn": 20
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'isRtl' is assigned a value but never used.",
        "line": 31,
        "column": 9,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 31,
        "endColumn": 14
      }
    ],
    "suppressedMessages": [],
    "errorCount": 2,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "﻿import React from 'react';\r\nimport {\r\n  Box,\r\n  Container,\r\n  Typography,\r\n  Stack,\r\n  Paper,\r\n  useTheme,\r\n  useMediaQuery,\r\n  Chip,\r\n  Divider,\r\n} from '@mui/material';\r\nimport { ArrowRight, Microscope, TrendingUp, Users, ChevronRight } from 'lucide-react';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { useNavigate } from 'react-router-dom';\r\nimport { colors } from '../../theme/colors';\r\nimport { useParasites } from '../../hooks/useParasites';\r\n\r\nconst getImageUrl = (url?: string) => {\r\n  if (!url) return 'https://placehold.co/400x300?text=No+Image';\r\n  if (url.startsWith('http')) return url;\r\n  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;\r\n  return `${SUPABASE_URL}/storage/v1/object/public/parasite-images/${url}`;\r\n};\r\n\r\nconst StatsSection: React.FC = () => {\r\n  const { t, i18n } = useTranslation();\r\n  const navigate = useNavigate();\r\n  const theme = useTheme();\r\n  const isMobile = useMediaQuery(theme.breakpoints.down('md'));\r\n  const isRtl = i18n.language === 'ar';\r\n  const { parasites } = useParasites();\r\n\r\n  // 1. آخر عينة\r\n  const latestParasite = parasites && parasites.length > 0 ? parasites[0] : null;\r\n\r\n  // 2. الأكثر انتشاراً\r\n  const topType = React.useMemo(() => {\r\n    if (!parasites) return { name: 'Unknown', count: 0 };\r\n    const counts: Record<string, number> = {};\r\n    parasites.forEach(p => { if (p.type) counts[p.type] = (counts[p.type] || 0) + 1; });\r\n    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);\r\n    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : { name: 'None', count: 0 };\r\n  }, [parasites]);\r\n\r\n  // 3. عدد المساهمين الحقيقيين\r\n  const contributorsCount = React.useMemo(() => {\r\n    if (!parasites) return 0;\r\n    const uniqueUploaders = new Set(parasites.map(p => p.uploadedBy).filter(Boolean));\r\n    return uniqueUploaders.size;\r\n  }, [parasites]);\r\n\r\n  // 📱 تصميم الموبايل (بطاقة واحدة مدمجة)\r\n  if (isMobile) {\r\n    return (\r\n      <Box sx={{ py: 4, bgcolor: '#fafcfb' }}>\r\n        <Container maxWidth=\"lg\">\r\n          <Paper\r\n            elevation={0}\r\n            sx={{\r\n              p: 2.5,\r\n              borderRadius: 4,\r\n              border: `1px solid ${colors.primary.light}30`,\r\n              background: '#fff',\r\n              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',\r\n            }}\r\n          >\r\n            {/* Header */}\r\n            <Stack direction=\"row\" alignItems=\"center\" justifyContent=\"space-between\" mb={2}>\r\n              <Typography variant=\"subtitle1\" fontWeight={800} color={colors.primary.main}>\r\n                {t('stats_overview', { defaultValue: 'نظرة عامة' })}\r\n              </Typography>\r\n              <Chip label=\"Live\" size=\"small\" color=\"success\" sx={{ height: 20, fontSize: 10, fontWeight: 'bold' }} />\r\n            </Stack>\r\n\r\n            <Stack spacing={2} divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}>\r\n              \r\n              {/* 1. أحدث اكتشاف */}\r\n              <Stack direction=\"row\" spacing={2} alignItems=\"center\" onClick={() => latestParasite && navigate(`/parasite/${latestParasite.id}`)}>\r\n                {latestParasite ? (\r\n                  <Box\r\n                    component=\"img\"\r\n                    src={getImageUrl(latestParasite.imageUrl)}\r\n                    sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'cover' }}\r\n                  />\r\n                ) : (\r\n                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#f5f5f5' }} />\r\n                )}\r\n                <Box sx={{ flex: 1 }}>\r\n                  <Typography variant=\"caption\" color=\"text.secondary\" display=\"block\">\r\n                    {t('latest_addition', { defaultValue: 'أحدث إضافة' })}\r\n                  </Typography>\r\n                  <Typography variant=\"body2\" fontWeight={700} noWrap>\r\n                    {latestParasite?.scientificName || 'لا توجد بيانات'}\r\n                  </Typography>\r\n                </Box>\r\n                <ChevronRight size={16} color=\"#ccc\" />\r\n              </Stack>\r\n\r\n              {/* 2. الأكثر انتشاراً */}\r\n              <Stack direction=\"row\" spacing={2} alignItems=\"center\">\r\n                <Box sx={{ p: 1, bgcolor: `${colors.secondary.main}15`, borderRadius: 2, color: colors.secondary.main }}>\r\n                  <TrendingUp size={20} />\r\n                </Box>\r\n                <Box sx={{ flex: 1 }}>\r\n                  <Typography variant=\"caption\" color=\"text.secondary\" display=\"block\">\r\n                    {t('most_common', { defaultValue: 'الأكثر شيوعاً' })}\r\n                  </Typography>\r\n                  <Typography variant=\"body2\" fontWeight={700}>\r\n                    {topType.name} ({topType.count})\r\n                  </Typography>\r\n                </Box>\r\n              </Stack>\r\n\r\n              {/* 3. المجتمع العلمي */}\r\n              <Stack direction=\"row\" spacing={2} alignItems=\"center\" onClick={() => navigate('/statistics')}>\r\n                <Box sx={{ p: 1, bgcolor: '#32b8c615', borderRadius: 2, color: '#32b8c6' }}>\r\n                  <Users size={20} />\r\n                </Box>\r\n                <Box sx={{ flex: 1 }}>\r\n                  <Typography variant=\"caption\" color=\"text.secondary\" display=\"block\">\r\n                    {t('scientific_community', { defaultValue: 'المجتمع العلمي' })}\r\n                  </Typography>\r\n                  <Typography variant=\"body2\" fontWeight={700}>\r\n                    {contributorsCount} {t('active_researchers_count', { defaultValue: 'باحث مساهم' })}\r\n                  </Typography>\r\n                </Box>\r\n                <ChevronRight size={16} color=\"#ccc\" />\r\n              </Stack>\r\n\r\n            </Stack>\r\n          </Paper>\r\n        </Container>\r\n      </Box>\r\n    );\r\n  }\r\n\r\n  // 🖥️ تصميم الديسكتوب (3 بطاقات منفصلة)\r\n  return (\r\n    <Box sx={{ py: 8, bgcolor: '#fafcfb' }}>\r\n      <Container maxWidth=\"lg\">\r\n        <Box\r\n          sx={{\r\n            display: 'grid',\r\n            gridTemplateColumns: 'repeat(3, 1fr)',\r\n            gap: 3,\r\n          }}\r\n        >\r\n          {/* Card 1: Featured Discovery */}\r\n          <Paper\r\n            elevation={0}\r\n            onClick={() => latestParasite && navigate(`/parasite/${latestParasite.id}`)}\r\n            sx={{\r\n              p: 3,\r\n              borderRadius: 4,\r\n              border: `1px solid ${colors.primary.main}20`,\r\n              background: `linear-gradient(135deg, #fff 0%, ${colors.primary.main}05 100%)`,\r\n              cursor: 'pointer',\r\n              transition: 'all 0.3s',\r\n              '&:hover': { transform: 'translateY(-5px)', borderColor: colors.primary.main },\r\n            }}\r\n          >\r\n            <Stack spacing={2}>\r\n              <Stack direction=\"row\" justifyContent=\"space-between\">\r\n                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${colors.primary.main}15`, color: colors.primary.main }}>\r\n                  <Microscope size={24} />\r\n                </Box>\r\n                <Chip label=\"NEW\" size=\"small\" color=\"primary\" sx={{ height: 20, fontSize: 10, fontWeight: 'bold' }} />\r\n              </Stack>\r\n              <Box>\r\n                <Typography variant=\"caption\" color=\"text.secondary\" fontWeight={700} sx={{ textTransform: 'uppercase' }}>\r\n                  {t('latest_discovery', { defaultValue: 'آخر اكتشاف' })}\r\n                </Typography>\r\n                {latestParasite && (\r\n                  <Stack direction=\"row\" spacing={2} mt={1} alignItems=\"center\">\r\n                    <Box component=\"img\" src={getImageUrl(latestParasite.imageUrl)} sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover' }} />\r\n                    <Box>\r\n                      <Typography variant=\"subtitle1\" fontWeight={800} noWrap sx={{ maxWidth: 140 }}>\r\n                        {latestParasite.scientificName}\r\n                      </Typography>\r\n                      <Typography variant=\"caption\" color=\"text.secondary\">\r\n                        {new Date(latestParasite.createdAt || '').toLocaleDateString('ar-EG')}\r\n                      </Typography>\r\n                    </Box>\r\n                  </Stack>\r\n                )}\r\n              </Box>\r\n            </Stack>\r\n          </Paper>\r\n\r\n          {/* Card 2: Trending */}\r\n          <Paper\r\n            elevation={0}\r\n            onClick={() => navigate('/archive')}\r\n            sx={{\r\n              p: 3,\r\n              borderRadius: 4,\r\n              border: `1px solid ${colors.secondary.main}20`,\r\n              background: `linear-gradient(135deg, #fff 0%, ${colors.secondary.main}05 100%)`,\r\n              cursor: 'pointer',\r\n              transition: 'all 0.3s',\r\n              '&:hover': { transform: 'translateY(-5px)', borderColor: colors.secondary.main },\r\n            }}\r\n          >\r\n            <Stack spacing={2}>\r\n              <Box sx={{ p: 1, width: 'fit-content', borderRadius: 2, bgcolor: `${colors.secondary.main}15`, color: colors.secondary.main }}>\r\n                <TrendingUp size={24} />\r\n              </Box>\r\n              <Box>\r\n                <Typography variant=\"caption\" color=\"text.secondary\" fontWeight={700} sx={{ textTransform: 'uppercase' }}>\r\n                  {t('most_prevalent', { defaultValue: 'الأكثر انتشاراً' })}\r\n                </Typography>\r\n                <Typography variant=\"h4\" fontWeight={800} color={colors.secondary.main} mt={0.5}>\r\n                  {topType.name}\r\n                </Typography>\r\n                <Typography variant=\"body2\" color=\"text.secondary\">\r\n                  {topType.count} {t('records', { defaultValue: 'تسجيلات' })}\r\n                </Typography>\r\n              </Box>\r\n            </Stack>\r\n          </Paper>\r\n\r\n          {/* Card 3: Community (Real Data) */}\r\n          <Paper\r\n            elevation={0}\r\n            onClick={() => navigate('/statistics')}\r\n            sx={{\r\n              p: 3,\r\n              borderRadius: 4,\r\n              border: `1px solid #32b8c620`,\r\n              background: `linear-gradient(135deg, #fff 0%, #32b8c605 100%)`,\r\n              cursor: 'pointer',\r\n              transition: 'all 0.3s',\r\n              '&:hover': { transform: 'translateY(-5px)', borderColor: '#32b8c6' },\r\n            }}\r\n          >\r\n            <Stack spacing={2}>\r\n              <Box sx={{ p: 1, width: 'fit-content', borderRadius: 2, bgcolor: `#32b8c615`, color: '#32b8c6' }}>\r\n                <Users size={24} />\r\n              </Box>\r\n              <Box>\r\n                <Typography variant=\"caption\" color=\"text.secondary\" fontWeight={700} sx={{ textTransform: 'uppercase' }}>\r\n                  {t('active_contributors', { defaultValue: 'المساهمون النشطون' })}\r\n                </Typography>\r\n                <Typography variant=\"h4\" fontWeight={800} color=\"#32b8c6\" mt={0.5}>\r\n                  {contributorsCount}\r\n                </Typography>\r\n                <Typography variant=\"body2\" color=\"text.secondary\">\r\n                  {t('students_researchers', { defaultValue: 'طالب وباحث' })}\r\n                </Typography>\r\n              </Box>\r\n            </Stack>\r\n          </Paper>\r\n        </Box>\r\n      </Container>\r\n    </Box>\r\n  );\r\n};\r\n\r\nexport default StatsSection;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\contexts\\AuthContext.tsx",
    "messages": [],
    "suppressedMessages": [
      {
        "ruleId": "react-refresh/only-export-components",
        "severity": 2,
        "message": "Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.",
        "line": 280,
        "column": 14,
        "nodeType": "Identifier",
        "messageId": "namedExport",
        "endLine": 280,
        "endColumn": 21,
        "suppressions": [
          {
            "kind": "directive",
            "justification": ""
          }
        ]
      }
    ],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\contexts\\ToastContext.tsx",
    "messages": [],
    "suppressedMessages": [
      {
        "ruleId": "react-refresh/only-export-components",
        "severity": 2,
        "message": "Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.",
        "line": 73,
        "column": 14,
        "nodeType": "Identifier",
        "messageId": "namedExport",
        "endLine": 73,
        "endColumn": 22,
        "suppressions": [
          {
            "kind": "directive",
            "justification": ""
          }
        ]
      }
    ],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\hooks\\useAuth.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\hooks\\useParasites.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\hooks\\useParasitesQuery.ts",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'PaginatedResponse' is defined but never used.",
        "line": 5,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 5,
        "endColumn": 20
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Parasite' is defined but never used.",
        "line": 7,
        "column": 10,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 7,
        "endColumn": 18
      }
    ],
    "suppressedMessages": [],
    "errorCount": 2,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\r\nimport {\r\n  parasitesApi,\r\n  PaginationParams,\r\n  PaginatedResponse,\r\n} from '../api/parasites';\r\nimport { Parasite, CreateParasiteInput, UpdateParasiteInput } from '../types/parasite';\r\n\r\n// ==============================================\r\n// Query Keys\r\n// ==============================================\r\n\r\nexport const parasiteKeys = {\r\n  all: ['parasites'] as const,\r\n  lists: () => [...parasiteKeys.all, 'list'] as const,\r\n  list: (params: PaginationParams) => [...parasiteKeys.lists(), params] as const,\r\n  details: () => [...parasiteKeys.all, 'detail'] as const,\r\n  detail: (id: string) => [...parasiteKeys.details(), id] as const,\r\n  filters: () => [...parasiteKeys.all, 'filters'] as const,\r\n};\r\n\r\n// ==============================================\r\n// Queries\r\n// ==============================================\r\n\r\n/**\r\n * جلب جميع الطفيليات (بدون pagination)\r\n */\r\nexport const useParasitesQuery = () => {\r\n  return useQuery({\r\n    queryKey: parasiteKeys.all,\r\n    queryFn: parasitesApi.getAll,\r\n  });\r\n};\r\n\r\n/**\r\n * جلب الطفيليات مع Pagination\r\n */\r\nexport const useParasitesPaginated = (params: PaginationParams = {}) => {\r\n  return useQuery({\r\n    queryKey: parasiteKeys.list(params),\r\n    queryFn: () => parasitesApi.getPaginated(params),\r\n    placeholderData: (previousData) => previousData,\r\n  });\r\n};\r\n\r\n/**\r\n * جلب طفيلي واحد\r\n */\r\nexport const useParasiteQuery = (id: string) => {\r\n  return useQuery({\r\n    queryKey: parasiteKeys.detail(id),\r\n    queryFn: () => parasitesApi.getById(id),\r\n    enabled: !!id,\r\n  });\r\n};\r\n\r\n/**\r\n * جلب خيارات الفلاتر\r\n */\r\nexport const useFilterOptions = () => {\r\n  return useQuery({\r\n    queryKey: parasiteKeys.filters(),\r\n    queryFn: parasitesApi.getFilterOptions,\r\n    staleTime: 10 * 60 * 1000, // 10 دقائق\r\n  });\r\n};\r\n\r\n// ==============================================\r\n// Mutations\r\n// ==============================================\r\n\r\n/**\r\n * إنشاء طفيلي جديد\r\n */\r\nexport const useCreateParasite = () => {\r\n  const queryClient = useQueryClient();\r\n\r\n  return useMutation({\r\n    mutationFn: (data: CreateParasiteInput) => parasitesApi.create(data),\r\n    onSuccess: () => {\r\n      // إبطال الكاش لإعادة الجلب\r\n      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });\r\n    },\r\n  });\r\n};\r\n\r\n/**\r\n * تحديث طفيلي\r\n */\r\nexport const useUpdateParasite = () => {\r\n  const queryClient = useQueryClient();\r\n\r\n  return useMutation({\r\n    mutationFn: ({ id, data }: { id: string; data: UpdateParasiteInput }) =>\r\n      parasitesApi.update(id, data),\r\n    onSuccess: (_, { id }) => {\r\n      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });\r\n      queryClient.invalidateQueries({ queryKey: parasiteKeys.detail(id) });\r\n    },\r\n  });\r\n};\r\n\r\n/**\r\n * حذف طفيلي\r\n */\r\nexport const useDeleteParasite = () => {\r\n  const queryClient = useQueryClient();\r\n\r\n  return useMutation({\r\n    mutationFn: (id: string) => parasitesApi.delete(id),\r\n    onSuccess: () => {\r\n      queryClient.invalidateQueries({ queryKey: parasiteKeys.all });\r\n    },\r\n  });\r\n};\r\n\r\n// ==============================================\r\n// Helper Hook للتوافق مع الكود القديم\r\n// ==============================================\r\n\r\nexport const useParasites = () => {\r\n  const query = useParasitesQuery();\r\n\r\n  return {\r\n    parasites: query.data || [],\r\n    loading: query.isLoading,\r\n    error: query.error?.message || null,\r\n    refetch: query.refetch,\r\n  };\r\n};",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\i18n\\config.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\lib\\is-nav-item-active.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\lib\\queryClient.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\lib\\supabase.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\main.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\AddParasite.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Archive.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Home.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Login.tsx",
    "messages": [],
    "suppressedMessages": [
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 55,
        "column": 38,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 55,
        "endColumn": 41,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                1597,
                1600
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                1597,
                1600
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ],
        "suppressions": [
          {
            "kind": "directive",
            "justification": ""
          }
        ]
      }
    ],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ParasiteDetails.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Register.tsx",
    "messages": [],
    "suppressedMessages": [
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 63,
        "column": 38,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 63,
        "endColumn": 41,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                1832,
                1835
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                1832,
                1835
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ],
        "suppressions": [
          {
            "kind": "directive",
            "justification": ""
          }
        ]
      }
    ],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\colors.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\ActionButtons.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 9,
        "column": 33,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 9,
        "endColumn": 36,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                325,
                328
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                325,
                328
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport { Stack, Button, IconButton, Tooltip } from '@mui/material';\r\nimport { CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';\r\nimport { Parasite } from '../../../types/parasite';\r\n\r\ninterface Props {\r\n  parasite: Parasite;\r\n  isSupervisor: boolean;\r\n  onAction: (p: Parasite, type: any) => void;\r\n}\r\n\r\nexport const ActionButtons: React.FC<Props> = ({ parasite, isSupervisor, onAction }) => {\r\n  return (\r\n    <Stack spacing={1} mt={2}>\r\n      <Button \r\n        fullWidth variant=\"outlined\" size=\"small\"\r\n        onClick={() => onAction(parasite, 'view')}\r\n        startIcon={<Eye size={16} />}\r\n      >\r\n        التفاصيل\r\n      </Button>\r\n\r\n      {isSupervisor && (\r\n        <>\r\n          {parasite.status === 'pending' && (\r\n            <Stack direction=\"row\" spacing={1}>\r\n              <Button \r\n                fullWidth variant=\"contained\" color=\"success\" size=\"small\"\r\n                onClick={() => onAction(parasite, 'approve')}\r\n                startIcon={<CheckCircle size={16} />}\r\n              >\r\n                قبول\r\n              </Button>\r\n              <Button \r\n                fullWidth variant=\"contained\" color=\"error\" size=\"small\"\r\n                onClick={() => onAction(parasite, 'reject')}\r\n                startIcon={<XCircle size={16} />}\r\n              >\r\n                رفض\r\n              </Button>\r\n            </Stack>\r\n          )}\r\n\r\n          <Stack direction=\"row\" justifyContent=\"space-between\" mt={1}>\r\n            <Tooltip title=\"تعديل\">\r\n              <IconButton size=\"small\" color=\"primary\" onClick={() => onAction(parasite, 'edit')}>\r\n                <Edit size={18} />\r\n              </IconButton>\r\n            </Tooltip>\r\n            <Tooltip title=\"حذف\">\r\n              <IconButton size=\"small\" color=\"error\" onClick={() => onAction(parasite, 'delete')}>\r\n                <Trash2 size={18} />\r\n              </IconButton>\r\n            </Tooltip>\r\n          </Stack>\r\n        </>\r\n      )}\r\n    </Stack>\r\n  );\r\n};",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\Dialogs.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\EmptyState.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Box' is defined but never used.",
        "line": 2,
        "column": 10,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 2,
        "endColumn": 13
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport { Box, Typography, Paper } from '@mui/material';\r\nimport { FolderOpen } from 'lucide-react';\r\n\r\nexport const EmptyState = () => (\r\n  <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>\r\n    <FolderOpen size={64} color=\"#ccc\" style={{ marginBottom: 16 }} />\r\n    <Typography variant=\"h6\" color=\"text.secondary\">لا توجد عينات لعرضها</Typography>\r\n  </Paper>\r\n);",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\FilterBar.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Box' is defined but never used.",
        "line": 5,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 5,
        "endColumn": 6
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'SortOption' is defined but never used.",
        "line": 22,
        "column": 33,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 22,
        "endColumn": 43
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'QualityFilter' is defined but never used.",
        "line": 22,
        "column": 45,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 22,
        "endColumn": 58
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 28,
        "column": 51,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 28,
        "endColumn": 54,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                674,
                677
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                674,
                677
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'students' is defined but never used.",
        "line": 36,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 36,
        "endColumn": 11
      }
    ],
    "suppressedMessages": [],
    "errorCount": 5,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "// src/pages/ReviewParasites/components/FilterBar.tsx\r\n\r\nimport React from 'react';\r\nimport {\r\n  Box,\r\n  TextField,\r\n  FormControl,\r\n  Select,\r\n  MenuItem,\r\n  InputAdornment,\r\n  IconButton,\r\n  Tooltip,\r\n  ToggleButtonGroup,\r\n  ToggleButton,\r\n  Stack,\r\n  Paper,\r\n  alpha,\r\n} from '@mui/material';\r\nimport Grid from '@mui/material/Grid';\r\nimport { Search, RotateCcw, Grid as GridIcon, List } from 'lucide-react';\r\nimport colors from '../colors';\r\nimport { FilterState, ViewMode, SortOption, QualityFilter } from '../types';\r\n\r\ninterface FilterBarProps {\r\n  filters: FilterState;\r\n  viewMode: ViewMode;\r\n  students: string[];\r\n  onFilterChange: (key: keyof FilterState, value: any) => void;\r\n  onViewModeChange: (mode: ViewMode) => void;\r\n  onReset: () => void;\r\n}\r\n\r\nconst FilterBar: React.FC<FilterBarProps> = ({\r\n  filters,\r\n  viewMode,\r\n  students,\r\n  onFilterChange,\r\n  onViewModeChange,\r\n  onReset,\r\n}) => {\r\n  const selectStyles = {\r\n    bgcolor: colors.bgCard,\r\n    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.borderLight },\r\n    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.borderMedium },\r\n    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },\r\n  };\r\n\r\n  return (\r\n    <Paper\r\n      elevation={0}\r\n      sx={{\r\n        p: 2,\r\n        borderRadius: 3,\r\n        bgcolor: colors.bgCard,\r\n        border: `1px solid ${colors.borderLight}`,\r\n        boxShadow: colors.shadowLight,\r\n        mb: 3,\r\n      }}\r\n    >\r\n      <Grid container spacing={2} alignItems=\"center\">\r\n        {/* البحث */}\r\n        <Grid size={{ xs: 12, md: 4 }}>\r\n          <TextField\r\n            fullWidth\r\n            size=\"small\"\r\n            placeholder=\"البحث عن عينة...\"\r\n            value={filters.search}\r\n            onChange={(e) => onFilterChange('search', e.target.value)}\r\n            sx={{\r\n              '& .MuiOutlinedInput-root': {\r\n                bgcolor: colors.bgSecondary,\r\n                '& fieldset': { borderColor: colors.borderLight },\r\n                '&:hover fieldset': { borderColor: colors.borderMedium },\r\n                '&.Mui-focused fieldset': { borderColor: colors.primary },\r\n              },\r\n            }}\r\n            InputProps={{\r\n              startAdornment: (\r\n                <InputAdornment position=\"start\">\r\n                  <Search size={18} color={colors.textMuted} />\r\n                </InputAdornment>\r\n              ),\r\n            }}\r\n          />\r\n        </Grid>\r\n\r\n        {/* فلتر الحالة */}\r\n        <Grid size={{ xs: 6, sm: 4, md: 2 }}>\r\n          <FormControl fullWidth size=\"small\">\r\n            <Select\r\n              value={filters.status}\r\n              onChange={(e) => onFilterChange('status', e.target.value)}\r\n              sx={selectStyles}\r\n            >\r\n              <MenuItem value=\"all\">🔍 الكل</MenuItem>\r\n              <MenuItem value=\"pending\">⏳ قيد المراجعة</MenuItem>\r\n              <MenuItem value=\"approved\">✅ مقبولة</MenuItem>\r\n              <MenuItem value=\"rejected\">❌ مرفوضة</MenuItem>\r\n            </Select>\r\n          </FormControl>\r\n        </Grid>\r\n\r\n        {/* فلتر الجودة */}\r\n        <Grid size={{ xs: 6, sm: 4, md: 2 }}>\r\n          <FormControl fullWidth size=\"small\">\r\n            <Select\r\n              value={filters.quality}\r\n              onChange={(e) => onFilterChange('quality', e.target.value)}\r\n              sx={selectStyles}\r\n            >\r\n              <MenuItem value=\"all\">⭐ كل الجودات</MenuItem>\r\n              <MenuItem value=\"excellent\">🌟 ممتاز</MenuItem>\r\n              <MenuItem value=\"good\">👍 جيد</MenuItem>\r\n              <MenuItem value=\"poor\">⚠️ يحتاج تحسين</MenuItem>\r\n            </Select>\r\n          </FormControl>\r\n        </Grid>\r\n\r\n        {/* الترتيب */}\r\n        <Grid size={{ xs: 6, sm: 4, md: 2 }}>\r\n          <FormControl fullWidth size=\"small\">\r\n            <Select\r\n              value={filters.sort}\r\n              onChange={(e) => onFilterChange('sort', e.target.value)}\r\n              sx={selectStyles}\r\n            >\r\n              <MenuItem value=\"date\">📅 الأحدث</MenuItem>\r\n              <MenuItem value=\"quality\">⭐ الجودة</MenuItem>\r\n              <MenuItem value=\"name\">🔤 الاسم</MenuItem>\r\n            </Select>\r\n          </FormControl>\r\n        </Grid>\r\n\r\n        {/* أزرار العرض وإعادة التعيين */}\r\n        <Grid size={{ xs: 6, sm: 4, md: 2 }}>\r\n          <Stack direction=\"row\" spacing={1} justifyContent=\"flex-end\">\r\n            <ToggleButtonGroup\r\n              value={viewMode}\r\n              exclusive\r\n              onChange={(_, val) => val && onViewModeChange(val)}\r\n              size=\"small\"\r\n              sx={{\r\n                '& .MuiToggleButton-root': {\r\n                  color: colors.textMuted,\r\n                  borderColor: colors.borderLight,\r\n                  '&.Mui-selected': {\r\n                    bgcolor: alpha(colors.primary, 0.15),\r\n                    color: colors.primary,\r\n                    borderColor: colors.primary,\r\n                  },\r\n                  '&:hover': {\r\n                    bgcolor: alpha(colors.primary, 0.1),\r\n                  },\r\n                },\r\n              }}\r\n            >\r\n              <ToggleButton value=\"grid\">\r\n                <GridIcon size={18} />\r\n              </ToggleButton>\r\n              <ToggleButton value=\"list\">\r\n                <List size={18} />\r\n              </ToggleButton>\r\n            </ToggleButtonGroup>\r\n\r\n            <Tooltip title=\"إعادة تعيين الفلاتر\">\r\n              <IconButton\r\n                onClick={onReset}\r\n                sx={{\r\n                  color: colors.textMuted,\r\n                  bgcolor: alpha(colors.primary, 0.1),\r\n                  '&:hover': { bgcolor: alpha(colors.primary, 0.2) },\r\n                }}\r\n              >\r\n                <RotateCcw size={18} />\r\n              </IconButton>\r\n            </Tooltip>\r\n          </Stack>\r\n        </Grid>\r\n      </Grid>\r\n    </Paper>\r\n  );\r\n};\r\n\r\nexport default FilterBar;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\ParasiteCard.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 10,
        "column": 33,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 10,
        "endColumn": 36,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                426,
                429
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                426,
                429
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport { Card, CardMedia, CardContent, Typography, Chip, Box, Stack, IconButton, Tooltip, Divider } from '@mui/material';\r\nimport { CheckCircle, XCircle, Edit, Trash2, Eye, User } from 'lucide-react';\r\nimport { Parasite } from '../../../types/parasite';\r\nimport { getImageUrl } from '../utils';\r\n\r\ninterface Props {\r\n  parasite: Parasite;\r\n  isSupervisor: boolean;\r\n  onAction: (p: Parasite, type: any) => void;\r\n}\r\n\r\nexport const ParasiteCard: React.FC<Props> = ({ parasite, isSupervisor, onAction }) => {\r\n  return (\r\n    <Card \r\n      sx={{ \r\n        height: '100%', \r\n        display: 'flex', \r\n        flexDirection: 'column', \r\n        position: 'relative',\r\n        borderRadius: 3,\r\n        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',\r\n        transition: 'transform 0.2s',\r\n        '&:hover': { transform: 'translateY(-4px)' }\r\n      }}\r\n    >\r\n      {/* حالة العينة */}\r\n      <Chip \r\n        label={parasite.status === 'pending' ? '⏳ قيد المراجعة' : parasite.status === 'rejected' ? '❌ مرفوضة' : '✅ مقبولة'} \r\n        color={parasite.status === 'approved' ? 'success' : parasite.status === 'rejected' ? 'error' : 'warning'}\r\n        size=\"small\"\r\n        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }}\r\n      />\r\n\r\n      {/* الصورة */}\r\n      <CardMedia \r\n        component=\"img\" \r\n        height=\"200\" \r\n        image={getImageUrl(parasite)} \r\n        alt={parasite.name}\r\n        sx={{ bgcolor: '#f5f5f5', cursor: 'pointer' }}\r\n        onClick={() => onAction(parasite, 'view')}\r\n      />\r\n\r\n      <CardContent sx={{ flexGrow: 1, pb: 1 }}>\r\n        {/* التفاصيل الأساسية */}\r\n        <Typography variant=\"h6\" fontWeight=\"bold\" noWrap title={parasite.scientificName}>\r\n          {parasite.scientificName || 'بدون اسم علمي'}\r\n        </Typography>\r\n        <Typography variant=\"body2\" color=\"text.secondary\" gutterBottom>\r\n          {parasite.name || 'بدون اسم شائع'}\r\n        </Typography>\r\n\r\n        {/* معلومات الطالب */}\r\n        {isSupervisor && (\r\n          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 2, bgcolor: '#f0f7f4', p: 0.8, borderRadius: 1 }}>\r\n            <User size={14} color=\"#555\" />\r\n            <Typography variant=\"caption\" color=\"text.secondary\">\r\n              الطالب: {parasite.studentName || 'غير معروف'}\r\n            </Typography>\r\n          </Box>\r\n        )}\r\n\r\n        <Divider sx={{ my: 1 }} />\r\n\r\n        {/* أزرار التحكم - تظهر فقط للمشرف والعينات قيد المراجعة */}\r\n        <Stack direction=\"row\" justifyContent=\"space-between\" alignItems=\"center\" mt={1}>\r\n          {/* زر التفاصيل للجميع */}\r\n          <Tooltip title=\"عرض التفاصيل\">\r\n            <IconButton size=\"small\" onClick={() => onAction(parasite, 'view')}>\r\n              <Eye size={20} color=\"#555\" />\r\n            </IconButton>\r\n          </Tooltip>\r\n\r\n          {isSupervisor && (\r\n            <Stack direction=\"row\" spacing={1}>\r\n              {parasite.status === 'pending' && (\r\n                <>\r\n                  <Tooltip title=\"قبول (لِلأرشيف)\">\r\n                    <IconButton size=\"small\" sx={{ color: '#2e7d32', bgcolor: '#e8f5e9' }} onClick={() => onAction(parasite, 'approve')}>\r\n                      <CheckCircle size={20} />\r\n                    </IconButton>\r\n                  </Tooltip>\r\n                  <Tooltip title=\"رفض\">\r\n                    <IconButton size=\"small\" sx={{ color: '#d32f2f', bgcolor: '#ffebee' }} onClick={() => onAction(parasite, 'reject')}>\r\n                      <XCircle size={20} />\r\n                    </IconButton>\r\n                  </Tooltip>\r\n                </>\r\n              )}\r\n              <Tooltip title=\"تعديل\">\r\n                <IconButton size=\"small\" sx={{ color: '#1976d2', bgcolor: '#e3f2fd' }} onClick={() => onAction(parasite, 'edit')}>\r\n                  <Edit size={20} />\r\n                </IconButton>\r\n              </Tooltip>\r\n              <Tooltip title=\"حذف نهائي\">\r\n                <IconButton size=\"small\" sx={{ color: '#c62828', bgcolor: '#ffebee' }} onClick={() => onAction(parasite, 'delete')}>\r\n                  <Trash2 size={20} />\r\n                </IconButton>\r\n              </Tooltip>\r\n            </Stack>\r\n          )}\r\n        </Stack>\r\n      </CardContent>\r\n    </Card>\r\n  );\r\n};",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\ParasiteList.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\components\\StatCard.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\hooks\\useReviewLogic.ts",
    "messages": [
      {
        "ruleId": "react-hooks/exhaustive-deps",
        "severity": 1,
        "message": "React Hook useMemo has unnecessary dependencies: 'isSupervisor' and 'user'. Either exclude them or remove the dependency array.",
        "line": 87,
        "column": 6,
        "nodeType": "ArrayExpression",
        "endLine": 87,
        "endColumn": 67,
        "suggestions": [
          {
            "desc": "Update the dependencies array to be: [allParasites, statusFilter, searchQuery]",
            "fix": {
              "range": [
                3147,
                3208
              ],
              "text": "[allParasites, statusFilter, searchQuery]"
            }
          }
        ]
      }
    ],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 1,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import { useState, useMemo, useEffect } from 'react';\r\nimport { useAuth } from '../../../contexts/AuthContext';\r\nimport { useParasites } from '../../../hooks/useParasites';\r\nimport { Parasite } from '../../../types/parasite';\r\nimport { parasitesApi } from '../../../api/parasites';\r\nimport { PROFESSOR_SECRET_CODE } from '../utils';\r\n\r\nexport const useReviewLogic = () => {\r\n  const { user } = useAuth();\r\n  const { parasites: allParasites, loading, refetch } = useParasites();\r\n\r\n  // 🔍 تشخيص المشكلة في الكونسول\r\n  useEffect(() => {\r\n    if (!loading) {\r\n      console.log(\"🔍 [Debug] User ID:\", user?.id);\r\n      console.log(\"🔍 [Debug] Total Parasites:\", allParasites?.length);\r\n      if (allParasites?.length > 0) {\r\n        console.log(\"🔍 [Debug] Sample 1 UploadedBy:\", allParasites[0].uploadedBy);\r\n        console.log(\"🔍 [Debug] Status:\", allParasites[0].status);\r\n      }\r\n    }\r\n  }, [loading, user, allParasites]);\r\n\r\n  const [isVerified, setIsVerified] = useState(false);\r\n  const [secretCode, setSecretCode] = useState('');\r\n  \r\n  // الفلتر الافتراضي 'all' لنرى كل شيء\r\n  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending'); // ✅\r\n  const [searchQuery, setSearchQuery] = useState('');\r\n  \r\n  // Dialog State\r\n  const [dialogOpen, setDialogOpen] = useState(false);\r\n  const [selectedParasite, setSelectedParasite] = useState<Parasite | null>(null);\r\n  const [actionType, setActionType] = useState<'approve' | 'reject' | 'edit' | 'delete' | 'view'>('view');\r\n  const [reviewNotes, setReviewNotes] = useState('');\r\n  const [editData, setEditData] = useState<Partial<Parasite>>({});\r\n  const [isSubmitting, setIsSubmitting] = useState(false);\r\n\r\n  const isSupervisor = true; \r\n\r\n  // Verify Supervisor\r\n  useEffect(() => {\r\n    const verified = localStorage.getItem('professor_verified');\r\n    if (verified === 'true') setIsVerified(true);\r\n  }, []);\r\n\r\n  const verifyCode = () => {\r\n    if (secretCode === PROFESSOR_SECRET_CODE) {\r\n      setIsVerified(true);\r\n      localStorage.setItem('professor_verified', 'true');\r\n      return true;\r\n    }\r\n    return false;\r\n  };\r\n\r\n  // ✅ منطق الفلترة (بدون قيود المستخدم مؤقتاً)\r\n  const filteredParasites = useMemo(() => {\r\n    if (!allParasites || allParasites.length === 0) return [];\r\n    \r\n    let list = [...allParasites];\r\n\r\n    // 1. تصفية حسب الحالة (إلا إذا اخترنا الكل)\r\n    if (statusFilter !== 'all') {\r\n      list = list.filter(p => p.status === statusFilter);\r\n    }\r\n\r\n    // ❌ تم إيقاف فلتر المستخدم مؤقتاً للتجربة\r\n    // if (!isSupervisor && user) {\r\n    //   list = list.filter(p => p.uploadedBy === user.id);\r\n    // }\r\n\r\n    // 2. البحث\r\n    if (searchQuery) {\r\n      const q = searchQuery.toLowerCase();\r\n      list = list.filter(p => \r\n        (p.name && p.name.toLowerCase().includes(q)) || \r\n        (p.scientificName && p.scientificName.toLowerCase().includes(q))\r\n      );\r\n    }\r\n\r\n    // 3. الترتيب: الأحدث أولاً\r\n    return list.sort((a, b) => {\r\n      const dateA = new Date(a.createdAt || 0).getTime();\r\n      const dateB = new Date(b.createdAt || 0).getTime();\r\n      return dateB - dateA;\r\n    });\r\n  }, [allParasites, statusFilter, user, isSupervisor, searchQuery]);\r\n\r\n  // Actions\r\n  const openDialog = (parasite: Parasite, type: typeof actionType) => {\r\n    setSelectedParasite(parasite);\r\n    setActionType(type);\r\n    if (type === 'edit') setEditData({ ...parasite });\r\n    setReviewNotes(parasite.reviewNotes || '');\r\n    setDialogOpen(true);\r\n  };\r\n\r\n  const handleAction = async () => {\r\n    if (!selectedParasite) return;\r\n    setIsSubmitting(true);\r\n\r\n    try {\r\n      if (actionType === 'approve') {\r\n        await parasitesApi.update(selectedParasite.id, {\r\n          status: 'approved',\r\n          reviewedBy: user?.id,\r\n          reviewedAt: new Date().toISOString(),\r\n          reviewNotes: reviewNotes || undefined,\r\n        });\r\n      } else if (actionType === 'reject') {\r\n        await parasitesApi.update(selectedParasite.id, {\r\n          status: 'rejected',\r\n          reviewedBy: user?.id,\r\n          reviewedAt: new Date().toISOString(),\r\n          reviewNotes: reviewNotes,\r\n        });\r\n      } else if (actionType === 'edit') {\r\n        await parasitesApi.update(selectedParasite.id, editData);\r\n      } else if (actionType === 'delete') {\r\n        await parasitesApi.delete(selectedParasite.id);\r\n      }\r\n\r\n      await refetch();\r\n      setDialogOpen(false);\r\n    } catch (error) {\r\n      console.error(error);\r\n      alert('حدث خطأ أثناء العملية');\r\n    } finally {\r\n      setIsSubmitting(false);\r\n    }\r\n  };\r\n\r\n  return {\r\n    parasites: filteredParasites,\r\n    loading,\r\n    isSupervisor,\r\n    isVerified,\r\n    secretCode,\r\n    setSecretCode,\r\n    verifyCode,\r\n    filters: { statusFilter, setStatusFilter, searchQuery, setSearchQuery },\r\n    dialog: {\r\n      open: dialogOpen,\r\n      setOpen: setDialogOpen,\r\n      type: actionType,\r\n      data: selectedParasite,\r\n      openDialog,\r\n      handleAction,\r\n      isSubmitting,\r\n      notes: reviewNotes,\r\n      setNotes: setReviewNotes,\r\n      editData,\r\n      setEditData\r\n    }\r\n  };\r\n};",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\index.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'InputAdornment' is defined but never used.",
        "line": 9,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 9,
        "endColumn": 17
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Lock' is defined but never used.",
        "line": 18,
        "column": 26,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 18,
        "endColumn": 30
      }
    ],
    "suppressedMessages": [],
    "errorCount": 2,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport {\r\n  Container,\r\n  Box,\r\n  Typography,\r\n  CircularProgress,\r\n  Alert,\r\n  TextField,\r\n  InputAdornment,\r\n  Tabs,\r\n  Tab,\r\n  Stack,\r\n  Paper,\r\n  Button\r\n} from '@mui/material';\r\n// ✅ الحل هنا: استخدام Grid\r\nimport Grid from '@mui/material/Grid';\r\nimport { Search, Shield, Lock } from 'lucide-react';\r\nimport { useReviewLogic } from './hooks/useReviewLogic';\r\nimport { ParasiteCard } from './components/ParasiteCard';\r\nimport { ReviewDialog } from './components/Dialogs';\r\nimport { EmptyState } from './components/EmptyState';\r\nimport { useAuth } from '../../contexts/AuthContext';\r\n\r\nconst ReviewParasitesPage = () => {\r\n  const { user } = useAuth();\r\n  const { \r\n    parasites, loading, isSupervisor, \r\n    isVerified, secretCode, setSecretCode, verifyCode,\r\n    filters, dialog \r\n  } = useReviewLogic();\r\n\r\n  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', height: '50vh', alignItems: 'center' }}><CircularProgress /></Box>;\r\n\r\n  if (!user) return <Container sx={{ mt: 5 }}><Alert severity=\"warning\">يجب تسجيل الدخول</Alert></Container>;\r\n\r\n  // شاشة القفل للمشرفين\r\n  if (isSupervisor && !isVerified) {\r\n    return (\r\n      <Container maxWidth=\"sm\" sx={{ mt: 10 }}>\r\n        <Paper sx={{ p: 4, textAlign: 'center' }}>\r\n          <Shield size={64} style={{ margin: '0 auto 20px', color: '#1976d2' }} />\r\n          <Typography variant=\"h5\" gutterBottom>منطقة المشرفين</Typography>\r\n          <TextField\r\n            fullWidth type=\"password\" placeholder=\"أدخل الكود السري\"\r\n            value={secretCode} onChange={(e) => setSecretCode(e.target.value)}\r\n            sx={{ mb: 2 }}\r\n          />\r\n          <Button \r\n            variant=\"contained\" fullWidth \r\n            onClick={() => { if(!verifyCode()) alert('الكود خطأ'); }}\r\n          >\r\n            دخول\r\n          </Button>\r\n        </Paper>\r\n      </Container>\r\n    );\r\n  }\r\n\r\n  return (\r\n    <Container maxWidth=\"xl\" sx={{ py: 4 }}>\r\n      {/* Header & Filters */}\r\n      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>\r\n        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent=\"space-between\" alignItems=\"center\" spacing={2}>\r\n          <Box>\r\n            <Typography variant=\"h4\" fontWeight=\"bold\" color=\"primary\">\r\n              {isSupervisor ? 'لوحة المراجعة' : 'عيناتي'}\r\n            </Typography>\r\n            <Typography variant=\"body2\" color=\"text.secondary\">\r\n              {parasites.length} عينة\r\n            </Typography>\r\n          </Box>\r\n\r\n          <Stack direction=\"row\" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>\r\n            <TextField\r\n              size=\"small\"\r\n              placeholder=\"بحث...\"\r\n              value={filters.searchQuery}\r\n              onChange={(e) => filters.setSearchQuery(e.target.value)}\r\n              InputProps={{ startAdornment: <Search size={18} style={{ marginRight: 8 }} /> }}\r\n            />\r\n            <Tabs \r\n              value={filters.statusFilter} \r\n              onChange={(_, v) => filters.setStatusFilter(v)}\r\n              variant=\"scrollable\"\r\n              scrollButtons=\"auto\"\r\n            >\r\n              <Tab label=\"قيد المراجعة\" value=\"pending\" />\r\n              <Tab label=\"مقبولة\" value=\"approved\" />\r\n              <Tab label=\"مرفوضة\" value=\"rejected\" />\r\n              <Tab label=\"الكل\" value=\"all\" />\r\n            </Tabs>\r\n          </Stack>\r\n        </Stack>\r\n      </Paper>\r\n\r\n      {/* Grid Content - الحل لمشكلة TypeScript */}\r\n      {parasites.length === 0 ? (\r\n        <EmptyState />\r\n      ) : (\r\n        <Grid container spacing={3}>\r\n          {parasites.map((parasite) => (\r\n            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={parasite.id}>\r\n              <ParasiteCard \r\n                parasite={parasite} \r\n                isSupervisor={isSupervisor} \r\n                onAction={dialog.openDialog} \r\n              />\r\n            </Grid>\r\n          ))}\r\n        </Grid>\r\n      )}\r\n\r\n      {/* Dialog */}\r\n      <ReviewDialog \r\n        open={dialog.open}\r\n        onClose={() => dialog.setOpen(false)}\r\n        type={dialog.type}\r\n        parasite={dialog.data}\r\n        onConfirm={dialog.handleAction}\r\n        isSubmitting={dialog.isSubmitting}\r\n        notes={dialog.notes}\r\n        setNotes={dialog.setNotes}\r\n        editData={dialog.editData}\r\n        setEditData={dialog.setEditData}\r\n      />\r\n    </Container>\r\n  );\r\n};\r\n\r\nexport default ReviewParasitesPage;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\types.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\ReviewParasites\\utils.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\Statistics.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Stack' is defined but never used.",
        "line": 2,
        "column": 51,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 2,
        "endColumn": 56
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Typography' is defined but never used.",
        "line": 2,
        "column": 83,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 2,
        "endColumn": 93
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'_' is assigned a value but never used.",
        "line": 74,
        "column": 16,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 74,
        "endColumn": 17
      }
    ],
    "suppressedMessages": [],
    "errorCount": 3,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "﻿import React, { useMemo } from 'react';\r\nimport { Box, Container, Paper, CircularProgress, Stack, useTheme, useMediaQuery, Typography } from '@mui/material';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { useParasites } from '../../hooks/useParasites';\r\nimport { Parasite } from '../../types/parasite';\r\n\r\n// Components\r\nimport StatsHeader from './components/StatsHeader';\r\nimport StatCardGrid from './components/StatCardGrid';\r\nimport DistributionCharts from './components/DistributionCharts';\r\nimport MonthlyTimelineChart from './components/MonthlyTimelineChart';\r\nimport TopResearchersTable from './components/TopResearchersTable';\r\nimport EmptyState from './components/EmptyState';\r\n\r\nconst Statistics: React.FC = () => {\r\n  const { t, i18n } = useTranslation();\r\n  const theme = useTheme();\r\n  const isMobile = useMediaQuery(theme.breakpoints.down('md'));\r\n  const isRtl = i18n.language === 'ar';\r\n  const { parasites, loading, error } = useParasites();\r\n\r\n  const stats = useMemo(() => {\r\n    if (!parasites?.length) return null;\r\n\r\n    const approved = parasites.filter(p => p.status === 'approved');\r\n    if (!approved.length) return null;\r\n\r\n    // Helper: حساب التكرار لأي حقل\r\n    const getDistribution = (field: keyof Parasite) => {\r\n      const counts = approved.reduce((acc, p) => {\r\n        const val = (p[field] as string) || t('not_specified', { defaultValue: 'غير محدد' });\r\n        acc[val] = (acc[val] || 0) + 1;\r\n        return acc;\r\n      }, {} as Record<string, number>);\r\n      \r\n      return Object.entries(counts)\r\n        .map(([name, value]) => ({ name, value }))\r\n        .sort((a, b) => b.value - a.value);\r\n    };\r\n\r\n    // Helper: حساب القيم الفريدة\r\n    const countUnique = (field: keyof Parasite) => new Set(approved.map(p => p[field]).filter(Boolean)).size;\r\n\r\n    const uniqueStudents = countUnique('studentName');\r\n    \r\n    // البيانات الشهرية\r\n    const monthlyData = (() => {\r\n      const months = isRtl \r\n        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']\r\n        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];\r\n      \r\n      const stats: Record<string, { parasites: number; images: number }> = {};\r\n      const now = new Date();\r\n\r\n      // تهيئة آخر 12 شهر\r\n      for (let i = 11; i >= 0; i--) {\r\n        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);\r\n        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;\r\n        stats[key] = { parasites: 0, images: 0 };\r\n      }\r\n\r\n      approved.forEach(p => {\r\n        if (p.createdAt) {\r\n          const d = new Date(p.createdAt);\r\n          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;\r\n          if (stats[key]) {\r\n            stats[key].parasites++;\r\n            if (p.imageUrl) stats[key].images++;\r\n          }\r\n        }\r\n      });\r\n\r\n      return Object.entries(stats).map(([key, val]) => {\r\n        const [_, m] = key.split('-');\r\n        return { month: `${months[parseInt(m) - 1]}`, ...val };\r\n      });\r\n    })();\r\n\r\n    return {\r\n      totalParasites: approved.length,\r\n      totalImages: approved.filter(p => p.imageUrl).length,\r\n      totalStudents: uniqueStudents,\r\n      totalSupervisors: countUnique('supervisorName'),\r\n      uniqueHosts: countUnique('host'),\r\n      uniqueTypes: countUnique('type'),\r\n      averageParasitesPerStudent: uniqueStudents ? (approved.length / uniqueStudents).toFixed(1) : '0',\r\n      distributions: {\r\n        hostDistribution: getDistribution('host').slice(0, 6),\r\n        sampleTypeDistribution: getDistribution('sampleType').slice(0, 6),\r\n        parasiteTypes: getDistribution('type'),\r\n        stageDistribution: getDistribution('stage'),\r\n      },\r\n      topResearchers: getDistribution('studentName').slice(0, 10),\r\n      monthlyData,\r\n    };\r\n  }, [parasites, t, isRtl]);\r\n\r\n  if (loading) return (\r\n    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', bgcolor: '#f8f7f5' }}>\r\n      <CircularProgress sx={{ color: '#3a5a40' }} />\r\n    </Box>\r\n  );\r\n\r\n  if (error) return (\r\n    <Container sx={{ py: 4 }}><Paper sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Paper></Container>\r\n  );\r\n\r\n  if (!stats) return <EmptyState />;\r\n\r\n  return (\r\n    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 }, bgcolor: '#f8f7f5' }}>\r\n      <Container maxWidth=\"lg\">\r\n        <StatsHeader />\r\n        <StatCardGrid stats={stats} isMobile={isMobile} />\r\n        <DistributionCharts distributions={stats.distributions} isMobile={isMobile} isRtl={isRtl} />\r\n        <MonthlyTimelineChart data={stats.monthlyData} isMobile={isMobile} isRtl={isRtl} />\r\n        <TopResearchersTable data={stats.topResearchers} totalParasites={stats.totalParasites} isMobile={isMobile} isRtl={isRtl} />\r\n      </Container>\r\n    </Box>\r\n  );\r\n};\r\n\r\nexport default Statistics;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\DistributionCharts.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'PieIcon' is defined but never used.",
        "line": 16,
        "column": 62,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 16,
        "endColumn": 69
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 76,
        "column": 36,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 76,
        "endColumn": 39,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2142,
                2145
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2142,
                2145
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 82,
        "column": 28,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 82,
        "endColumn": 31,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2351,
                2354
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2351,
                2354
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 92,
        "column": 44,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 92,
        "endColumn": 47,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2792,
                2795
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2792,
                2795
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'isMobile' is defined but never used.",
        "line": 94,
        "column": 3,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 94,
        "endColumn": 11
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 98,
        "column": 53,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 98,
        "endColumn": 56,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2969,
                2972
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2969,
                2972
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 110,
        "column": 47,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 110,
        "endColumn": 50,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                3469,
                3472
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                3469,
                3472
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 129,
        "column": 40,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 129,
        "endColumn": 43,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                4005,
                4008
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                4005,
                4008
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 158,
        "column": 40,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 158,
        "endColumn": 43,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                5436,
                5439
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                5436,
                5439
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 167,
        "column": 43,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 167,
        "endColumn": 46,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                5743,
                5746
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                5743,
                5746
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      }
    ],
    "suppressedMessages": [],
    "errorCount": 10,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport { Paper, Typography, Box } from '@mui/material';\r\nimport {\r\n  PieChart,\r\n  Pie,\r\n  Cell,\r\n  BarChart,\r\n  Bar,\r\n  XAxis,\r\n  YAxis,\r\n  Tooltip,\r\n  ResponsiveContainer,\r\n  Legend,\r\n  CartesianGrid,\r\n} from 'recharts';\r\nimport { Activity, Beaker, TrendingUp, Database, PieChart as PieIcon } from 'lucide-react';\r\nimport { useTranslation } from 'react-i18next';\r\n\r\nconst COLORS = ['#2A9D8F', '#264653', '#E9C46A', '#F4A261', '#E76F51', '#8AB17D'];\r\n\r\ninterface DistributionChartsProps {\r\n  distributions: {\r\n    hostDistribution: { name: string; value: number }[];\r\n    sampleTypeDistribution: { name: string; value: number }[];\r\n    parasiteTypes: { name: string; value: number }[];\r\n    stageDistribution: { name: string; value: number }[];\r\n  };\r\n  isMobile: boolean;\r\n  isRtl: boolean;\r\n}\r\n\r\nconst DistributionCharts: React.FC<DistributionChartsProps> = ({\r\n  distributions,\r\n  isMobile,\r\n  isRtl,\r\n}) => {\r\n  const { t } = useTranslation();\r\n\r\n  const charts = [\r\n    {\r\n      title: t('stats_host_distribution', { defaultValue: 'توزيع العوائل' }),\r\n      data: distributions.hostDistribution,\r\n      icon: Activity,\r\n      type: 'pie' as const,\r\n    },\r\n    {\r\n      title: t('stats_sample_distribution', { defaultValue: 'أنواع العينات' }),\r\n      data: distributions.sampleTypeDistribution,\r\n      icon: Beaker,\r\n      type: 'pie' as const,\r\n    },\r\n    {\r\n      title: t('stats_stage_distribution', { defaultValue: 'مراحل التطور' }),\r\n      data: distributions.stageDistribution,\r\n      icon: TrendingUp,\r\n      type: 'bar' as const,\r\n    },\r\n    {\r\n      title: t('stats_type_classification', { defaultValue: 'تصنيف الطفيليات' }),\r\n      data: distributions.parasiteTypes,\r\n      icon: Database,\r\n      type: 'bar' as const,\r\n    },\r\n  ];\r\n\r\n  return (\r\n    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>\r\n      {charts.map((chart, index) => (\r\n        <DistributionChart key={index} chart={chart} isMobile={isMobile} isRtl={isRtl} />\r\n      ))}\r\n    </Box>\r\n  );\r\n};\r\n\r\n// مكون المفتاح المخصص (Custom Legend)\r\nconst CustomLegend = ({ payload }: any) => {\r\n  return (\r\n    <ul style={{ \r\n      listStyle: 'none', padding: 0, marginTop: 20, \r\n      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 \r\n    }}>\r\n      {payload.map((entry: any, index: number) => (\r\n        <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#555', fontWeight: 500 }}>\r\n          <span style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: '50%', marginRight: 6, marginLeft: 6, display: 'inline-block' }}></span>\r\n          {entry.value}\r\n        </li>\r\n      ))}\r\n    </ul>\r\n  );\r\n};\r\n\r\nconst DistributionChart: React.FC<{ chart: any; isMobile: boolean; isRtl: boolean }> = ({\r\n  chart,\r\n  isMobile,\r\n  isRtl,\r\n}) => {\r\n  const { t } = useTranslation();\r\n  const hasData = chart.data && chart.data.some((d: any) => d.value > 0);\r\n\r\n  if (!hasData) {\r\n    return (\r\n      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', borderRadius: 4 }}>\r\n        <Typography color=\"text.secondary\">{t('no_data_available', { defaultValue: 'لا تتوفر بيانات' })}</Typography>\r\n      </Paper>\r\n    );\r\n  }\r\n\r\n  const renderContent = () => {\r\n    // إعداد بيانات الألوان لكل عنصر لضمان تطابق الألوان في الـ Legend\r\n    const coloredData = chart.data.map((item: any, index: number) => ({\r\n      ...item,\r\n      fill: COLORS[index % COLORS.length]\r\n    }));\r\n\r\n    if (chart.type === 'pie') {\r\n      return (\r\n        <ResponsiveContainer width=\"100%\" height={320}>\r\n          <PieChart>\r\n            <Pie\r\n              data={coloredData}\r\n              cx=\"50%\"\r\n              cy=\"45%\"\r\n              innerRadius={60}\r\n              outerRadius={80}\r\n              paddingAngle={5}\r\n              dataKey=\"value\"\r\n              stroke=\"none\"\r\n            >\r\n              {coloredData.map((entry: any, index: number) => (\r\n                <Cell key={`cell-${index}`} fill={entry.fill} />\r\n              ))}\r\n            </Pie>\r\n            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />\r\n            <Legend content={<CustomLegend />} verticalAlign=\"bottom\" />\r\n          </PieChart>\r\n        </ResponsiveContainer>\r\n      );\r\n    }\r\n\r\n    // ✅ الحل لمشكلة BarChart Legend\r\n    // نقوم برسم الـ Legend يدوياً خارج الـ BarChart باستخدام البيانات الملونة\r\n    return (\r\n      <Box sx={{ height: 320, display: 'flex', flexDirection: 'column' }}>\r\n        <ResponsiveContainer width=\"100%\" height=\"100%\">\r\n          <BarChart\r\n            data={coloredData}\r\n            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}\r\n            barCategoryGap={20}\r\n          >\r\n            <CartesianGrid strokeDasharray=\"3 3\" vertical={false} stroke=\"#f0f0f0\" />\r\n            <XAxis dataKey=\"name\" tick={false} axisLine={false} height={0} />\r\n            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />\r\n            <Tooltip \r\n              cursor={{ fill: 'transparent' }}\r\n              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: isRtl ? 'right' : 'left' }}\r\n            />\r\n            <Bar dataKey=\"value\" radius={[8, 8, 0, 0]} name=\"القيمة\">\r\n              {coloredData.map((entry: any, index: number) => (\r\n                <Cell key={`cell-${index}`} fill={entry.fill} />\r\n              ))}\r\n            </Bar>\r\n          </BarChart>\r\n        </ResponsiveContainer>\r\n        \r\n        {/* ✅ رسم الـ Legend يدوياً هنا */}\r\n        <CustomLegend \r\n          payload={coloredData.map((item: any) => ({\r\n            value: item.name,\r\n            type: 'circle',\r\n            id: item.name,\r\n            color: item.fill\r\n          }))}\r\n        />\r\n      </Box>\r\n    );\r\n  };\r\n\r\n  const Icon = chart.icon;\r\n\r\n  return (\r\n    <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff', borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>\r\n      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid #f5f5f5', pb: 2 }}>\r\n        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(42, 157, 143, 0.1)', color: '#2A9D8F' }}><Icon size={20} /></Box>\r\n        <Typography variant=\"h6\" sx={{ fontSize: '1rem', fontWeight: 700, color: '#264653' }}>{chart.title}</Typography>\r\n      </Box>\r\n      {renderContent()}\r\n    </Paper>\r\n  );\r\n};\r\n\r\nexport default DistributionCharts;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\EmptyState.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\MonthlyTimelineChart.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\StatCardGrid.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'theme' is assigned a value but never used.",
        "line": 31,
        "column": 9,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 31,
        "endColumn": 14
      }
    ],
    "suppressedMessages": [],
    "errorCount": 1,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "﻿import React from 'react';\r\nimport { Box, Card, CardContent, Typography, Stack, useTheme } from '@mui/material';\r\nimport { Microscope, Image as ImageIcon, Users, Award, Activity, Beaker } from 'lucide-react';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { colors } from '../../../theme/colors';\r\n\r\ninterface StatCard {\r\n  title: string;\r\n  value: number | string;\r\n  icon: React.ReactNode;\r\n  color: string;\r\n  bgColor: string;\r\n  subtitle?: string;\r\n}\r\n\r\ninterface StatCardGridProps {\r\n  stats: {\r\n    totalParasites: number;\r\n    totalImages: number;\r\n    totalStudents: number;\r\n    totalSupervisors: number;\r\n    uniqueHosts: number;\r\n    uniqueTypes: number;\r\n    averageParasitesPerStudent: string;\r\n  };\r\n  isMobile: boolean;\r\n}\r\n\r\nconst StatCardGrid: React.FC<StatCardGridProps> = ({ stats, isMobile }) => {\r\n  const { t } = useTranslation();\r\n  const theme = useTheme();\r\n\r\n  const cards: StatCard[] = [\r\n    {\r\n      title: t('stats_total_parasites', { defaultValue: 'إجمالي الطفيليات' }),\r\n      value: stats.totalParasites,\r\n      icon: <Microscope size={28} />,\r\n      color: colors.primary.main,\r\n      bgColor: `${colors.primary.main}15`,\r\n      subtitle: t('stats_registered_samples', { defaultValue: 'عينة مسجلة' }),\r\n    },\r\n    {\r\n      title: t('stats_uploaded_images', { defaultValue: 'الصور المرفوعة' }),\r\n      value: stats.totalImages,\r\n      icon: <ImageIcon size={28} />,\r\n      color: colors.secondary.main,\r\n      bgColor: `${colors.secondary.main}15`,\r\n      subtitle: t('stats_microscopic_image', { defaultValue: 'صورة مجهرية' }),\r\n    },\r\n    {\r\n      title: t('stats_researchers', { defaultValue: 'الباحثين' }),\r\n      value: stats.totalStudents,\r\n      icon: <Users size={28} />,\r\n      color: '#32b8c6',\r\n      bgColor: '#32b8c615',\r\n      subtitle: t('stats_student_researcher', { defaultValue: 'باحث نشط' }),\r\n    },\r\n    {\r\n      title: t('stats_supervisors', { defaultValue: 'المشرفين' }),\r\n      value: stats.totalSupervisors,\r\n      icon: <Award size={28} />,\r\n      color: '#ffa94d',\r\n      bgColor: '#ffa94d15',\r\n      subtitle: t('stats_supervisor', { defaultValue: 'مشرف أكاديمي' }),\r\n    },\r\n    {\r\n      title: t('stats_host_types', { defaultValue: 'أنواع العوائل' }),\r\n      value: stats.uniqueHosts,\r\n      icon: <Activity size={28} />,\r\n      color: '#ff6b6b',\r\n      bgColor: '#ff6b6b15',\r\n      subtitle: t('stats_different_host', { defaultValue: 'عائل مختلف' }),\r\n    },\r\n    {\r\n      title: t('stats_classifications', { defaultValue: 'التصنيفات' }),\r\n      value: stats.uniqueTypes,\r\n      icon: <Beaker size={28} />,\r\n      color: '#52c41a',\r\n      bgColor: '#52c41a15',\r\n      subtitle: t('stats_type', { defaultValue: 'تصنيف فريد' }),\r\n    },\r\n  ];\r\n\r\n  return (\r\n    <Box\r\n      sx={{\r\n        display: 'grid',\r\n        gridTemplateColumns: {\r\n          xs: '1fr',\r\n          sm: 'repeat(2, 1fr)',\r\n          md: 'repeat(3, 1fr)',\r\n        },\r\n        gap: 3,\r\n        mb: 4,\r\n      }}\r\n    >\r\n      {cards.map((card, idx) => (\r\n        <Card\r\n          key={idx}\r\n          elevation={0}\r\n          sx={{\r\n            bgcolor: '#fff',\r\n            borderRadius: 4,\r\n            border: '1px solid rgba(0,0,0,0.06)',\r\n            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',\r\n            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',\r\n            height: '100%',\r\n            overflow: 'visible',\r\n            '&:hover': {\r\n              transform: isMobile ? 'none' : 'translateY(-5px)',\r\n              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',\r\n              borderColor: `${card.color}40`,\r\n            },\r\n          }}\r\n        >\r\n          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>\r\n            <Stack direction=\"row\" alignItems=\"flex-start\" justifyContent=\"space-between\">\r\n              <Box>\r\n                <Typography\r\n                  variant=\"subtitle2\"\r\n                  sx={{\r\n                    color: 'text.secondary',\r\n                    fontWeight: 600,\r\n                    textTransform: 'uppercase',\r\n                    fontSize: '0.75rem',\r\n                    letterSpacing: 0.5,\r\n                    mb: 1,\r\n                  }}\r\n                >\r\n                  {card.title}\r\n                </Typography>\r\n                <Typography\r\n                  variant=\"h4\"\r\n                  sx={{\r\n                    fontWeight: 800,\r\n                    color: '#264653',\r\n                    fontSize: '2rem',\r\n                    lineHeight: 1,\r\n                    mb: 0.5,\r\n                  }}\r\n                >\r\n                  {card.value}\r\n                </Typography>\r\n                {card.subtitle && (\r\n                  <Typography\r\n                    variant=\"caption\"\r\n                    sx={{\r\n                      color: card.color,\r\n                      fontWeight: 600,\r\n                      fontSize: '0.8rem',\r\n                      display: 'inline-block',\r\n                      bgcolor: card.bgColor,\r\n                      px: 1,\r\n                      py: 0.2,\r\n                      borderRadius: 1,\r\n                    }}\r\n                  >\r\n                    {card.subtitle}\r\n                  </Typography>\r\n                )}\r\n              </Box>\r\n              \r\n              <Box\r\n                sx={{\r\n                  width: 50,\r\n                  height: 50,\r\n                  borderRadius: '50%', // دائري بالكامل\r\n                  backgroundColor: card.bgColor,\r\n                  display: 'flex',\r\n                  alignItems: 'center',\r\n                  justifyContent: 'center',\r\n                  color: card.color,\r\n                  boxShadow: `0 4px 12px ${card.color}20`,\r\n                }}\r\n              >\r\n                {card.icon}\r\n              </Box>\r\n            </Stack>\r\n          </CardContent>\r\n        </Card>\r\n      ))}\r\n    </Box>\r\n  );\r\n};\r\n\r\nexport default StatCardGrid;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\StatsHeader.tsx",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\SummaryPanels.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 68,
        "column": 54,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 68,
        "endColumn": 57,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2571,
                2574
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2571,
                2574
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      },
      {
        "ruleId": "@typescript-eslint/no-explicit-any",
        "severity": 2,
        "message": "Unexpected any. Specify a different type.",
        "line": 68,
        "column": 67,
        "nodeType": "TSAnyKeyword",
        "messageId": "unexpectedAny",
        "endLine": 68,
        "endColumn": 70,
        "suggestions": [
          {
            "messageId": "suggestUnknown",
            "fix": {
              "range": [
                2584,
                2587
              ],
              "text": "unknown"
            },
            "desc": "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct."
          },
          {
            "messageId": "suggestNever",
            "fix": {
              "range": [
                2584,
                2587
              ],
              "text": "never"
            },
            "desc": "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."
          }
        ]
      }
    ],
    "suppressedMessages": [],
    "errorCount": 2,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport { Paper, Typography, Box, Stack, Divider } from '@mui/material';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { FileText, Info } from 'lucide-react';\r\nimport { colors } from '../../../theme/colors';\r\n\r\nexport interface Stats {\r\n  totalParasites: number;\r\n  totalImages: number;\r\n  totalStudents: number;\r\n  totalSupervisors: number;\r\n  uniqueHosts: number;\r\n  uniqueTypes: number;\r\n  averageParasitesPerStudent: string | number;\r\n}\r\n\r\ninterface SummaryPanelsProps {\r\n  stats: Stats;\r\n}\r\n\r\nconst SummaryPanels: React.FC<SummaryPanelsProps> = ({ stats }) => {\r\n  const { t } = useTranslation();\r\n\r\n  const imageRatio =\r\n    stats.totalParasites > 0\r\n      ? ((stats.totalImages / stats.totalParasites) * 100).toFixed(1)\r\n      : '0';\r\n\r\n  const leftItems = [\r\n    { label: t('stats_total_parasites', { defaultValue: 'إجمالي الطفيليات' }), value: stats.totalParasites, color: colors.primary.main },\r\n    { label: t('stats_uploaded_images', { defaultValue: 'الصور المرفوعة' }), value: stats.totalImages, color: colors.secondary.main },\r\n    { label: t('stats_image_ratio', { defaultValue: 'نسبة التوثيق الصوري' }), value: `${imageRatio}%`, color: colors.secondary.main },\r\n    { label: t('stats_avg_per_student', { defaultValue: 'متوسط المساهمات/باحث' }), value: stats.averageParasitesPerStudent, color: '#FF6B6B' },\r\n  ];\r\n\r\n  const rightItems = [\r\n    { label: t('stats_total_researchers', { defaultValue: 'عدد الباحثين' }), value: stats.totalStudents, color: '#748DC8' },\r\n    { label: t('stats_total_supervisors', { defaultValue: 'عدد المشرفين' }), value: stats.totalSupervisors, color: '#FFA94D' },\r\n    { label: t('stats_host_types', { defaultValue: 'أنواع العوائل' }), value: stats.uniqueHosts, color: '#FF6B6B' },\r\n    { label: t('stats_parasite_classifications', { defaultValue: 'التصنيفات المسجلة' }), value: stats.uniqueTypes, color: '#52C41A' },\r\n  ];\r\n\r\n  return (\r\n    <Box\r\n      sx={{\r\n        display: 'grid',\r\n        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },\r\n        gap: 3,\r\n        mt: 4,\r\n      }}\r\n    >\r\n      <SummaryPanel \r\n        title={t('stats_summary', { defaultValue: 'ملخص البيانات' })} \r\n        items={leftItems} \r\n        icon={FileText} \r\n        iconColor={colors.primary.main} \r\n      />\r\n      <SummaryPanel \r\n        title={t('stats_project_info', { defaultValue: 'معلومات المشروع' })} \r\n        items={rightItems} \r\n        icon={Info} \r\n        iconColor={colors.secondary.main} \r\n      />\r\n    </Box>\r\n  );\r\n};\r\n\r\nconst SummaryPanel: React.FC<{ title: string; items: any[]; icon: any; iconColor: string }> = ({ \r\n  title, items, icon: Icon, iconColor \r\n}) => (\r\n  <Paper\r\n    elevation={0}\r\n    sx={{\r\n      p: 3,\r\n      bgcolor: '#fff',\r\n      borderRadius: 4,\r\n      border: '1px solid rgba(0,0,0,0.06)',\r\n      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',\r\n      transition: 'transform 0.2s',\r\n      '&:hover': { transform: 'translateY(-2px)' }\r\n    }}\r\n  >\r\n    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid #f5f5f5', pb: 2 }}>\r\n      <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${iconColor}15`, color: iconColor }}>\r\n        <Icon size={20} />\r\n      </Box>\r\n      <Typography variant=\"h6\" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#264653' }}>\r\n        {title}\r\n      </Typography>\r\n    </Box>\r\n\r\n    <Stack spacing={2.5}>\r\n      {items.map((item, index) => (\r\n        <React.Fragment key={index}>\r\n          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\r\n            <Typography color=\"text.secondary\" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>\r\n              {item.label}\r\n            </Typography>\r\n            <Typography \r\n              sx={{ \r\n                fontWeight: 800, \r\n                color: item.color, \r\n                fontSize: '1.1rem',\r\n                bgcolor: `${item.color}10`,\r\n                px: 1.5,\r\n                py: 0.5,\r\n                borderRadius: 1.5,\r\n              }}\r\n            >\r\n              {item.value}\r\n            </Typography>\r\n          </Box>\r\n          {index < items.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}\r\n        </React.Fragment>\r\n      ))}\r\n    </Stack>\r\n  </Paper>\r\n);\r\n\r\nexport default SummaryPanels;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\TopResearchersTable.tsx",
    "messages": [
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'Award' is defined but never used.",
        "line": 6,
        "column": 17,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 6,
        "endColumn": 22
      },
      {
        "ruleId": "@typescript-eslint/no-unused-vars",
        "severity": 2,
        "message": "'isMobile' is defined but never used.",
        "line": 22,
        "column": 54,
        "nodeType": null,
        "messageId": "unusedVar",
        "endLine": 22,
        "endColumn": 62
      }
    ],
    "suppressedMessages": [],
    "errorCount": 2,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "source": "import React from 'react';\r\nimport {\r\n  Paper, Table, TableBody, TableCell, TableContainer,\r\n  TableHead, TableRow, Box, Typography, Avatar, Stack\r\n} from '@mui/material';\r\nimport { Users, Award } from 'lucide-react';\r\nimport { useTranslation } from 'react-i18next';\r\nimport { colors } from '../../../theme/colors';\r\n\r\ninterface ResearcherData {\r\n  name: string;\r\n  value: number;\r\n}\r\n\r\ninterface TopResearchersTableProps {\r\n  data: ResearcherData[];\r\n  totalParasites: number;\r\n  isMobile: boolean;\r\n  isRtl: boolean;\r\n}\r\n\r\nconst TopResearchersTable = ({ data, totalParasites, isMobile, isRtl }: TopResearchersTableProps) => {\r\n  const { t } = useTranslation();\r\n\r\n  if (!data.length) return null;\r\n\r\n  const getRankIcon = (index: number) => {\r\n    switch (index) {\r\n      case 0: return <span style={{ fontSize: 24 }}>🥇</span>;\r\n      case 1: return <span style={{ fontSize: 24 }}>🥈</span>;\r\n      case 2: return <span style={{ fontSize: 24 }}>🥉</span>;\r\n      default: return <span style={{ fontWeight: 'bold', color: '#888' }}>#{index + 1}</span>;\r\n    }\r\n  };\r\n\r\n  return (\r\n    <Paper\r\n      elevation={0}\r\n      sx={{\r\n        mt: 4,\r\n        mb: 4,\r\n        bgcolor: '#fff',\r\n        borderRadius: 4,\r\n        border: '1px solid rgba(0,0,0,0.06)',\r\n        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',\r\n        overflow: 'hidden',\r\n      }}\r\n    >\r\n      <Box sx={{ p: 3, borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 1.5 }}>\r\n        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${colors.primary.main}15`, color: colors.primary.main }}>\r\n          <Users size={20} />\r\n        </Box>\r\n        <Typography variant=\"h6\" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#264653' }}>\r\n          {t('stats_top_researchers', { defaultValue: 'أكثر الباحثين مساهمة' })}\r\n        </Typography>\r\n      </Box>\r\n\r\n      <TableContainer>\r\n        <Table>\r\n          <TableHead>\r\n            <TableRow sx={{ bgcolor: '#fafafa' }}>\r\n              <TableCell align=\"center\" sx={{ fontWeight: 700, color: '#555' }}>{t('rank', { defaultValue: 'الترتيب' })}</TableCell>\r\n              <TableCell align={isRtl ? 'right' : 'left'} sx={{ fontWeight: 700, color: '#555' }}>{t('researcher_name', { defaultValue: 'اسم الباحث' })}</TableCell>\r\n              <TableCell align=\"center\" sx={{ fontWeight: 700, color: '#555' }}>{t('samples_count', { defaultValue: 'عدد العينات' })}</TableCell>\r\n              <TableCell align=\"center\" sx={{ fontWeight: 700, color: '#555' }}>{t('percentage', { defaultValue: 'النسبة' })}</TableCell>\r\n            </TableRow>\r\n          </TableHead>\r\n          <TableBody>\r\n            {data.map((student, index) => {\r\n              const percentage = ((student.value / totalParasites) * 100).toFixed(1);\r\n              return (\r\n                <TableRow key={student.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>\r\n                  <TableCell align=\"center\">\r\n                    {getRankIcon(index)}\r\n                  </TableCell>\r\n                  \r\n                  <TableCell align={isRtl ? 'right' : 'left'}>\r\n                    <Stack direction=\"row\" alignItems=\"center\" spacing={2}>\r\n                      <Avatar \r\n                        sx={{ \r\n                          width: 32, \r\n                          height: 32, \r\n                          bgcolor: index < 3 ? colors.primary.main : '#e0e0e0',\r\n                          fontSize: 14,\r\n                          fontWeight: 'bold'\r\n                        }}\r\n                      >\r\n                        {student.name.charAt(0).toUpperCase()}\r\n                      </Avatar>\r\n                      <Typography variant=\"body2\" fontWeight={600} color=\"#333\">\r\n                        {student.name}\r\n                      </Typography>\r\n                    </Stack>\r\n                  </TableCell>\r\n\r\n                  <TableCell align=\"center\">\r\n                    <Box\r\n                      sx={{\r\n                        display: 'inline-block',\r\n                        px: 1.5,\r\n                        py: 0.5,\r\n                        bgcolor: `${colors.secondary.main}15`,\r\n                        color: colors.secondary.main,\r\n                        borderRadius: 2,\r\n                        fontWeight: 700,\r\n                        fontSize: '0.85rem',\r\n                      }}\r\n                    >\r\n                      {student.value}\r\n                    </Box>\r\n                  </TableCell>\r\n\r\n                  <TableCell align=\"center\">\r\n                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>\r\n                      <Box sx={{ width: 60, height: 6, bgcolor: '#eee', borderRadius: 3, overflow: 'hidden' }}>\r\n                        <Box \r\n                          sx={{ \r\n                            width: `${percentage}%`, \r\n                            height: '100%', \r\n                            bgcolor: index < 3 ? colors.primary.main : '#bbb',\r\n                            borderRadius: 3 \r\n                          }} \r\n                        />\r\n                      </Box>\r\n                      <Typography variant=\"caption\" fontWeight={600} color=\"text.secondary\">\r\n                        {percentage}%\r\n                      </Typography>\r\n                    </Box>\r\n                  </TableCell>\r\n                </TableRow>\r\n              );\r\n            })}\r\n          </TableBody>\r\n        </Table>\r\n      </TableContainer>\r\n    </Paper>\r\n  );\r\n};\r\n\r\nexport default TopResearchersTable;",
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\pages\\Statistics\\components\\usePageMeta.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\paths.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\theme\\colors.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\theme\\theme.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\types\\nav.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\types\\parasite.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  },
  {
    "filePath": "C:\\parasites_database\\src\\vite-env.d.ts",
    "messages": [],
    "suppressedMessages": [],
    "errorCount": 0,
    "fatalErrorCount": 0,
    "warningCount": 0,
    "fixableErrorCount": 0,
    "fixableWarningCount": 0,
    "usedDeprecatedRules": []
  }
]
```

---

## 2. Unused Dependencies (depcheck)
```
Unused dependencies
* apexcharts
* react-apexcharts
Unused devDependencies
* depcheck
* madge
* ts-prune

```

---

## 3. Unused/Unreferenced TS Exports (ts-prune)
```
\src\paths.ts:1 - paths
\src\api\parasites.ts:307 - Parasite (used in module)
\src\api\parasites.ts:307 - CreateParasiteInput (used in module)
\src\api\parasites.ts:307 - UpdateParasiteInput (used in module)
\src\hooks\useParasites.ts:92 - default
\src\hooks\useParasitesQuery.ts:13 - parasiteKeys (used in module)
\src\hooks\useParasitesQuery.ts:29 - useParasitesQuery (used in module)
\src\hooks\useParasitesQuery.ts:50 - useParasiteQuery
\src\hooks\useParasitesQuery.ts:76 - useCreateParasite
\src\hooks\useParasitesQuery.ts:91 - useUpdateParasite
\src\hooks\useParasitesQuery.ts:107 - useDeleteParasite
\src\hooks\useParasitesQuery.ts:122 - useParasites
\src\lib\is-nav-item-active.ts:3 - isNavItemActive
\src\theme\theme.ts:187 - default
\src\types\parasite.ts:105 - ParasiteFilter
\src\components\auth\GuestRoute.tsx:10 - GuestRoute
\src\components\auth\ProtectedRoute.tsx:10 - ProtectedRoute
\src\components\core\ErrorBoundary.tsx:18 - ErrorBoundary
\src\pages\ReviewParasites\colors.ts:3 - colors (used in module)
\src\pages\ReviewParasites\index.tsx:131 - default
\src\pages\ReviewParasites\types.ts:3 - ReviewComment
\src\pages\ReviewParasites\types.ts:13 - QualityScore
\src\pages\ReviewParasites\types.ts:20 - StatusType (used in module)
\src\pages\ReviewParasites\types.ts:21 - DialogMode
\src\pages\ReviewParasites\types.ts:34 - SnackbarState
\src\pages\ReviewParasites\components\ActionButtons.tsx:12 - ActionButtons
\src\pages\ReviewParasites\components\FilterBar.tsx:184 - default
\src\pages\ReviewParasites\components\StatCard.tsx:89 - default
\src\pages\Statistics\components\SummaryPanels.tsx:7 - Stats (used in module)
\src\pages\Statistics\components\SummaryPanels.tsx:120 - default
\src\pages\Statistics\components\usePageMeta.ts:9 - usePageMeta

```

---

## 4. Circular Dependencies (madge)
```
Processed 0 files (650ms) 



```

---

## Notes

- This report is auto-generated from static analysis tools.
- Open this file in Cursor and ask @Codebase to summarize and propose improvements.
