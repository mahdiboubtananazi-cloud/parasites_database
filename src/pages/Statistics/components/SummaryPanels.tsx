import React from 'react';
import { Paper, Typography, Box, Stack, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FileText, Info } from 'lucide-react';
import { colors } from '../../../theme/colors';

export interface Stats {
  totalParasites: number;
  totalImages: number;
  totalStudents: number;
  totalSupervisors: number;
  uniqueHosts: number;
  uniqueTypes: number;
  averageParasitesPerStudent: string | number;
}

interface SummaryPanelsProps {
  stats: Stats;
}

const SummaryPanels: React.FC<SummaryPanelsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const imageRatio =
    stats.totalParasites > 0
      ? ((stats.totalImages / stats.totalParasites) * 100).toFixed(1)
      : '0';

  const leftItems = [
    { label: t('stats_total_parasites', { defaultValue: 'إجمالي الطفيليات' }), value: stats.totalParasites, color: colors.primary.main },
    { label: t('stats_uploaded_images', { defaultValue: 'الصور المرفوعة' }), value: stats.totalImages, color: colors.secondary.main },
    { label: t('stats_image_ratio', { defaultValue: 'نسبة التوثيق الصوري' }), value: `${imageRatio}%`, color: colors.secondary.main },
    { label: t('stats_avg_per_student', { defaultValue: 'متوسط المساهمات/باحث' }), value: stats.averageParasitesPerStudent, color: '#FF6B6B' },
  ];

  const rightItems = [
    { label: t('stats_total_researchers', { defaultValue: 'عدد الباحثين' }), value: stats.totalStudents, color: '#748DC8' },
    { label: t('stats_total_supervisors', { defaultValue: 'عدد المشرفين' }), value: stats.totalSupervisors, color: '#FFA94D' },
    { label: t('stats_host_types', { defaultValue: 'أنواع العوائل' }), value: stats.uniqueHosts, color: '#FF6B6B' },
    { label: t('stats_parasite_classifications', { defaultValue: 'التصنيفات المسجلة' }), value: stats.uniqueTypes, color: '#52C41A' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mt: 4,
      }}
    >
      <SummaryPanel 
        title={t('stats_summary', { defaultValue: 'ملخص البيانات' })} 
        items={leftItems} 
        icon={FileText} 
        iconColor={colors.primary.main} 
      />
      <SummaryPanel 
        title={t('stats_project_info', { defaultValue: 'معلومات المشروع' })} 
        items={rightItems} 
        icon={Info} 
        iconColor={colors.secondary.main} 
      />
    </Box>
  );
};

const SummaryPanel: React.FC<{ title: string; items: any[]; icon: any; iconColor: string }> = ({ 
  title, items, icon: Icon, iconColor 
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      bgcolor: '#fff',
      borderRadius: 4,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-2px)' }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid #f5f5f5', pb: 2 }}>
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${iconColor}15`, color: iconColor }}>
        <Icon size={20} />
      </Box>
      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#264653' }}>
        {title}
      </Typography>
    </Box>

    <Stack spacing={2.5}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
              {item.label}
            </Typography>
            <Typography 
              sx={{ 
                fontWeight: 800, 
                color: item.color, 
                fontSize: '1.1rem',
                bgcolor: `${item.color}10`,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
              }}
            >
              {item.value}
            </Typography>
          </Box>
          {index < items.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
        </React.Fragment>
      ))}
    </Stack>
  </Paper>
);

export default SummaryPanels;