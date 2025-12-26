export const colors = {
  primary: {
    main: '#0B2B26',      // أخضر غامق جداً (للعناصر الرئيسية والأزرار)
    light: '#163832',     // أخضر متوسط
    lighter: '#235347',   // أخضر غابي
    dark: '#051F20',      // أغمق درجة (للنصوص المهمة)
    contrastText: '#FAFCFB', // نص أبيض فوق الأزرار الغامقة
  },
  secondary: {
    main: '#235347',
    light: '#8EB69B',
    dark: '#0B2B26',
    contrastText: '#ffffff',
  },
  background: {
    default: '#FAFCFB',   // الخلفية فاتحة جداً (أبيض مائل للأخضر الخفيف جداً)
    paper: '#FFFFFF',     // خلفية البطاقات بيضاء نقية
    subtle: '#DAF1DE',    // لون أخضر فاتح جداً للفواصل أو الخلفيات الثانوية
  },
  text: {
    primary: '#051F20',   // النص الأساسي غامق جداً (ليكون واضحاً على الخلفية الفاتحة)
    secondary: '#374151', // نص ثانوي رمادي غامق
  },
  action: {
    active: '#0B2B26',
    hover: '#163832',
  },
  error: { main: '#d32f2f' },
  warning: { main: '#f59e0b' },
  success: { main: '#10b981' },
  info: { main: '#0288d1' },
};

export const gradients = {
  primary: 'linear-gradient(135deg, #0B2B26 0%, #163832 100%)', // تدرج غامق للأزرار
  surface: 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFB 100%)', // تدرج فاتح للخلفيات
};
