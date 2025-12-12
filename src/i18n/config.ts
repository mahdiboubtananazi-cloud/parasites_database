import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "dir": "rtl",
      // ===== NAVIGATION =====
      "nav_home": "الرئيسية",
      "nav_parasites": "الأرشيف",
      "nav_add_parasite": "إضافة عينة",
      "nav_statistics": "الإحصائيات",
      "nav_login": "دخول",
      "nav_logout": "خروج",
      "nav_language": "اللغة",
      
      // ===== HOME PAGE =====
      "app_title": "أرشيف الطفيليات",
      "app_subtitle": "Academic Database",
      "hero_description": "أرشيف أكاديمي متخصص لتوثيق واكتشاف الطفيليات في المختبرات البحثية",
      "search_placeholder": "ابحث عن نوع طفيلي أو مصدر العينة...",
      "btn_search": "بحث",
      "btn_browse_archive": "استعراض الأرشيف",
      "btn_add_sample": "إضافة عينة جديدة",
      "btn_contribute": "ساهم في توسيع الأرشيف",
      
      // ===== STATISTICS =====
      "stats_title": "ساهم في توسيع الأرشيف",
      "stats_subtitle": "أضف اكتشافات جديدة ووسّع قاعدة البيانات الأكاديمية",
      "stats_total_samples": "إجمالي العينات المسجلة",
      "stats_parasite_types": "أنواع الطفيليات المكتشفة",
      "stats_recent_samples": "عينات مضافة خلال 30 يوم",
      
      // ===== ARCHIVE PAGE =====
      "archive_title": "الأرشيف العلمي",
      "archive_subtitle": "تصفح العينات الموثقة",
      "archive_empty": "لا توجد عينات حالياً",
      "filter_type": "النوع",
      "filter_stage": "المرحلة",
      "filter_all": "الكل",
      
      // ===== PARASITE DETAILS =====
      "details_scientific_name": "الاسم العلمي",
      "details_type": "النوع",
      "details_stage": "المرحلة",
      "details_description": "الوصف",
      "details_sample_type": "نوع العينة",
      "details_stain_color": "نوع الصبغة",
      "details_student_name": "اسم الطالب",
      "details_supervisor_name": "اسم المشرف",
      "details_added_date": "تاريخ الإضافة",
      "btn_back": "العودة للأرشيف",
      
      // ===== ADD PARASITE PAGE =====
      "add_title": "إضافة طفيلي جديد",
      "add_subtitle": "أدخل البيانات العلمية للعينة",
      "add_name": "الاسم العربي",
      "add_scientific_name": "الاسم العلمي",
      "add_type": "النوع",
      "add_stage": "المرحلة",
      "add_description": "الوصف",
      "add_sample_type": "نوع العينة",
      "add_stain_color": "نوع الصبغة",
      "add_student_name": "اسم الطالب",
      "add_supervisor_name": "اسم المشرف",
      "add_image": "الصورة المجهرية",
      "add_image_hint": "رفع صورة (JPG, PNG)",
      "btn_save": "حفظ",
      "btn_cancel": "إلغاء",
      
      // ===== LOGIN PAGE =====
      "login_title": "تسجيل الدخول",
      "login_email": "البريد الإلكتروني",
      "login_password": "كلمة المرور",
      "login_button": "دخول",
      "login_register": "ليس لديك حساب؟ إنشاء واحد",
      
      // ===== MESSAGES =====
      "success_added": "تمت إضافة العينة بنجاح",
      "error_loading": "خطأ في التحميل",
      "no_results": "لا توجد نتائج",
    }
  },
  en: {
    translation: {
      "dir": "ltr",
      // ===== NAVIGATION =====
      "nav_home": "Home",
      "nav_parasites": "Archive",
      "nav_add_parasite": "Add Sample",
      "nav_statistics": "Statistics",
      "nav_login": "Login",
      "nav_logout": "Logout",
      "nav_language": "Language",
      
      // ===== HOME PAGE =====
      "app_title": "Parasites Database",
      "app_subtitle": "Academic Database",
      "hero_description": "Specialized academic archive for documenting and discovering parasites in research laboratories",
      "search_placeholder": "Search parasite type or sample source...",
      "btn_search": "Search",
      "btn_browse_archive": "Browse Archive",
      "btn_add_sample": "Add New Sample",
      "btn_contribute": "Contribute to Archive",
      
      // ===== STATISTICS =====
      "stats_title": "Contribute to Archive",
      "stats_subtitle": "Add new discoveries and expand the academic database",
      "stats_total_samples": "Total Registered Samples",
      "stats_parasite_types": "Discovered Parasite Types",
      "stats_recent_samples": "Samples Added Last 30 Days",
      
      // ===== ARCHIVE PAGE =====
      "archive_title": "Scientific Archive",
      "archive_subtitle": "Browse documented samples",
      "archive_empty": "No samples currently available",
      "filter_type": "Type",
      "filter_stage": "Stage",
      "filter_all": "All",
      
      // ===== PARASITE DETAILS =====
      "details_scientific_name": "Scientific Name",
      "details_type": "Type",
      "details_stage": "Stage",
      "details_description": "Description",
      "details_sample_type": "Sample Type",
      "details_stain_color": "Stain Color",
      "details_student_name": "Student Name",
      "details_supervisor_name": "Supervisor Name",
      "details_added_date": "Added Date",
      "btn_back": "Back to Archive",
      
      // ===== ADD PARASITE PAGE =====
      "add_title": "Add New Parasite",
      "add_subtitle": "Enter scientific data for the sample",
      "add_name": "Common Name",
      "add_scientific_name": "Scientific Name",
      "add_type": "Type",
      "add_stage": "Stage",
      "add_description": "Description",
      "add_sample_type": "Sample Type",
      "add_stain_color": "Stain Color",
      "add_student_name": "Student Name",
      "add_supervisor_name": "Supervisor Name",
      "add_image": "Microscopic Image",
      "add_image_hint": "Upload image (JPG, PNG)",
      "btn_save": "Save",
      "btn_cancel": "Cancel",
      
      // ===== LOGIN PAGE =====
      "login_title": "Login",
      "login_email": "Email",
      "login_password": "Password",
      "login_button": "Login",
      "login_register": "Don't have account? Create one",
      
      // ===== MESSAGES =====
      "success_added": "Sample added successfully",
      "error_loading": "Error loading data",
      "no_results": "No results found",
    }
  },
  fr: {
    translation: {
      "dir": "ltr",
      // ===== NAVIGATION =====
      "nav_home": "Accueil",
      "nav_parasites": "Archives",
      "nav_add_parasite": "Ajouter",
      "nav_statistics": "Statistiques",
      "nav_login": "Connexion",
      "nav_logout": "Déconnexion",
      "nav_language": "Langue",
      
      // ===== HOME PAGE =====
      "app_title": "Base de Données Parasites",
      "app_subtitle": "Base Académique",
      "hero_description": "Archives académiques spécialisées pour documenter et découvrir les parasites dans les laboratoires de recherche",
      "search_placeholder": "Rechercher un type de parasite ou une source d'échantillon...",
      "btn_search": "Rechercher",
      "btn_browse_archive": "Parcourir les Archives",
      "btn_add_sample": "Ajouter un Nouvel Échantillon",
      "btn_contribute": "Contribuer aux Archives",
      
      // ===== STATISTICS =====
      "stats_title": "Contribuer aux Archives",
      "stats_subtitle": "Ajoutez de nouvelles découvertes et élargissez la base de données académique",
      "stats_total_samples": "Échantillons Enregistrés Total",
      "stats_parasite_types": "Types de Parasites Découverts",
      "stats_recent_samples": "Échantillons Ajoutés Derniers 30 Jours",
      
      // ===== ARCHIVE PAGE =====
      "archive_title": "Archives Scientifiques",
      "archive_subtitle": "Parcourir les échantillons documentés",
      "archive_empty": "Aucun échantillon disponible pour le moment",
      "filter_type": "Type",
      "filter_stage": "Stade",
      "filter_all": "Tous",
      
      // ===== PARASITE DETAILS =====
      "details_scientific_name": "Nom Scientifique",
      "details_type": "Type",
      "details_stage": "Stade",
      "details_description": "Description",
      "details_sample_type": "Type d'Échantillon",
      "details_stain_color": "Couleur de Teinture",
      "details_student_name": "Nom de l'Étudiant",
      "details_supervisor_name": "Nom du Superviseur",
      "details_added_date": "Date d'Ajout",
      "btn_back": "Retour aux Archives",
      
      // ===== ADD PARASITE PAGE =====
      "add_title": "Ajouter un Parasite",
      "add_subtitle": "Entrez les données scientifiques de l'échantillon",
      "add_name": "Nom Commun",
      "add_scientific_name": "Nom Scientifique",
      "add_type": "Type",
      "add_stage": "Stade",
      "add_description": "Description",
      "add_sample_type": "Type d'Échantillon",
      "add_stain_color": "Couleur de Teinture",
      "add_student_name": "Nom de l'Étudiant",
      "add_supervisor_name": "Nom du Superviseur",
      "add_image": "Image Microscopique",
      "add_image_hint": "Télécharger image (JPG, PNG)",
      "btn_save": "Enregistrer",
      "btn_cancel": "Annuler",
      
      // ===== LOGIN PAGE =====
      "login_title": "Connexion",
      "login_email": "Email",
      "login_password": "Mot de Passe",
      "login_button": "Se Connecter",
      "login_register": "Pas de compte? Créer un",
      
      // ===== MESSAGES =====
      "success_added": "Échantillon ajouté avec succès",
      "error_loading": "Erreur lors du chargement",
      "no_results": "Aucun résultat trouvé",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // ✅ العربية افتراضياً
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
