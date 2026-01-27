import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Chip
} from '@mui/material';
import { Microscope, TrendingUp, Users, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme/colors';
import { useParasites } from '../../hooks/useParasites';

// دالة مساعدة لتنسيق الأرقام بالطريقة الفرنسية
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

// مكون البطاقة الجديد (تصميم أكاديمي منفصل)
const StatCard = ({ icon: Icon, label, value, sub, color, onClick, isMobile }: any) => (
  <Paper
    onClick={onClick}
    elevation={0}
    sx={{
      minWidth: isMobile ? 280 : 'auto', // عرض أوسع قليلاً للقراءة
      p: 3,
      borderRadius: 3, // زوايا أقل حدة قليلاً (More Corporate)
      cursor: 'pointer',
      bgcolor: '#ffffff',
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0.06)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)', // ظل خفيف جداً
      transition: 'all 0.3s ease',
      mr: isMobile ? 2 : 0,
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        borderColor: color,
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px -10px ${alpha(color, 0.15)}`
      }
    }}
  >
    {/* شريط علوي ملون دقيق */}
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: alpha(color, 0.5), opacity: 0.8 }} />

    {/* الصف العلوي: العنوان يساراً - الأيقونة يميناً */}
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: '#64748B', // رمادي مزرق (Slate) للقراءة المريحة
          fontWeight: 600,
          textTransform: 'uppercase', // حروف كبيرة للعناوين الأكاديمية
          letterSpacing: 0.5,
          fontSize: '0.75rem'
        }}
      >
        {label}
      </Typography>
      
      <Box sx={{
        p: 1, 
        borderRadius: '50%', // دائرة بدلاً من مربع
        bgcolor: alpha(color, 0.08), 
        color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} strokeWidth={2} />
      </Box>
    </Stack>

    {/* القيمة الرقمية */}
    <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A', mb: 1, letterSpacing: -1 }}>
      {value}
    </Typography>

    {/* النص الفرعي */}
    <Stack direction="row" alignItems="center" spacing={0.5}>
       {/* نقطة صغيرة ملونة */}
       <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
       <Typography 
         variant="body2" 
         sx={{ 
           color: '#64748B', 
           fontSize: '0.85rem',
           fontWeight: 500
         }}
       >
        {sub}
      </Typography>
    </Stack>
  </Paper>
);

const StatsSection = () => {
  const { t, i18n } = useTranslation(); // نحتاج اللغة لتنسيق التاريخ
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { parasites } = useParasites();

  const latestParasite = parasites?.[0] || null;
  const latestName = latestParasite?.scientificName 
    ? latestParasite.scientificName.split(' ')[0] 
    : '--';

  const topType = React.useMemo(() => {
    if (!parasites || parasites.length === 0) return { name: '...', count: 0 };
    const counts: Record<string, number> = {};
    parasites.forEach((p) => { if (p.type) counts[p.type] = (counts[p.type] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
    return sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : { name: 'N/A', count: 0 };
  }, [parasites]);
  
  const contributors = React.useMemo(() => {
    if (!parasites) return 0;
    return new Set(parasites.map((p) => p.uploadedBy).filter(Boolean)).size;
  }, [parasites]);

  const cards = [
    {
      icon: Microscope,
      label: t('latest_discovery') || "DERNIÈRE DÉCOUVERTE",
      value: latestName,
      sub: latestParasite ? new Date(latestParasite.createdAt).toLocaleDateString('fr-FR') : '-',
      color: colors.primary.main,
      action: () => latestParasite && navigate(`/parasite/${latestParasite.id}`)
    },
    {
      icon: TrendingUp,
      label: t('most_prevalent') || "ÉCHANTILLON DOMINANT",
      value: formatNumber(topType.count), // تنسيق فرنسي
      sub: topType.name,
      color: '#F59E0B',
      action: () => navigate('/archive')
    },
    {
      icon: Users,
      label: t('active_contributors') || "CHERCHEURS ACTIFS",
      value: formatNumber(contributors), // تنسيق فرنسي
      sub: t('active_researchers_count') || "Contributeurs",
      color: '#0EA5E9',
      action: () => navigate('/statistics')
    }
  ];

  return (
    <Box sx={{ py: 6, bgcolor: '#FAFAFA' }}> {/* خلفية رمادية فاتحة جداً للتباين */}
      <Container maxWidth="lg">
        
        {/* === العنوان الجديد (بسيط وجميل) === */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2} 
          mb={4} 
          sx={{ px: { xs: 2, md: 0 } }}
        >
          {/* خط جانبي ملون */}
          <Box sx={{ 
            width: 4, 
            height: 28, 
            bgcolor: colors.primary.main, 
            borderRadius: 4 
          }} />
          
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              sx={{ color: '#1E293B', lineHeight: 1.2 }}
            >
              indicateurs Clés {/* عنوان فرنسي أكاديمي */}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mise à jour en temps réel
            </Typography>
          </Box>
        </Stack>

        {/* === شبكة البطاقات === */}
        <Box sx={{
          display: { xs: 'flex', md: 'grid' },
          gridTemplateColumns: { md: 'repeat(3, 1fr)' },
          gap: { md: 3 },
          overflowX: { xs: 'auto', md: 'visible' },
          pb: { xs: 2, md: 0 },
          mx: { xs: -2, md: 0 },
          px: { xs: 3, md: 0 }, // زيادة الحشوة الجانبية في الموبايل
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          {cards.map((card, idx) => (
            <Box key={idx} sx={{ scrollSnapAlign: 'start' }}>
               <StatCard 
                 {...card} 
                 onClick={card.action} 
                 isMobile={isMobile} 
               />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StatsSection;