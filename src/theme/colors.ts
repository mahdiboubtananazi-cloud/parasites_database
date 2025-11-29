export const colors = {
  primary: {
    main: '#3a5a40',      // Hunter Green
    light: '#588157',     // Fern
    lighter: '#a3b18a',   // Dry Sage
    dark: '#2d4733',      // أغمق
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#588157',      // Fern
    light: '#a3b18a',     // Dry Sage
    dark: '#3a5a40',      // Hunter Green
    contrastText: '#ffffff',
  },
  error: {
    main: '#c1666b',      // Red-brown (من نفس الـ palette)
    light: '#d4a5a5',
    dark: '#8b3a3a',
  },
  warning: {
    main: '#9d8189',      // Mauve (متناسق)
    light: '#b5a3a0',
    dark: '#6b5863',
  },
  success: {
    main: '#588157',      // Fern
    light: '#a3b18a',
    dark: '#3a5a40',
  },
  info: {
    main: '#3a5a40',
    light: '#588157',
    dark: '#2d4733',
  },
  background: {
    default: '#f5f3f0',   // أفتح قليلاً من Dust Grey للـ contrast
    paper: '#ffffff',     // أبيض نقي للـ cards
  },
  text: {
    primary: '#344e41',   // Pine Teal - أسود مخضر
    secondary: '#588157', // Fern - أخف
  },
};

export const gradients = {
  primary: `linear-gradient(135deg, #3a5a40 0%, #588157 100%)`,
  secondary: `linear-gradient(135deg, #588157 0%, #a3b18a 100%)`,
  accent: `linear-gradient(135deg, #344e41 0%, #3a5a40 100%)`,
};
