import React from 'react';
import { Paper, Typography, Box, Stack, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

interface SummaryItem {
  label: string;
  value: string | number;
  color: string;
}

interface SummaryPanelProps {
  title: string;
  items: SummaryItem[];
}

const SummaryPanels: React.FC<SummaryPanelsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const imageRatio =
    stats.totalParasites > 0
      ? ((stats.totalImages / stats.totalParasites) * 100).toFixed(1)
      : '0';

  const leftItems: SummaryItem[] = [
    { label: t('total_parasites'), value: stats.totalParasites, color: '#3a5a40' },
    { label: t('uploaded_images'), value: stats.totalImages, color: '#32b8c6' },
    { label: t('image_ratio'), value: `${imageRatio}%`, color: '#32b8c6' },
    {
      label: t('average_samples_per_researcher'),
      value: stats.averageParasitesPerStudent,
      color: '#ff6b6b',
    },
  ];

  const rightItems: SummaryItem[] = [
    { label: t('researchers_count'), value: stats.totalStudents, color: '#748dc8' },
    { label: t('supervisors_count'), value: stats.totalSupervisors, color: '#ffa94d' },
    { label: t('host_types'), value: stats.uniqueHosts, color: '#ff6b6b' },
    { label: t('parasite_classifications'), value: stats.uniqueTypes, color: '#52c41a' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: { xs: 2, md: 3 },
      }}
    >
      <SummaryPanel title={t('summary_data_statistics')} items={leftItems} />
      <SummaryPanel title={t('project_information')} items={rightItems} />
    </Box>
  );
};

const SummaryPanel: React.FC<SummaryPanelProps> = ({ title, items }) => (
  <Paper
    sx={{
      p: { xs: 2, md: 3 },
      background: 'white',
      borderRadius: { xs: 1.5, md: 2 },
      border: '1px solid #3a5a4015',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        mb: 2,
        color: '#3a5a40',
        fontSize: { xs: '0.95rem', md: '1.1rem' },
      }}
    >
      {title}
    </Typography>
    <Stack spacing={2}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}
            >
              {item.label}:
            </Typography>
            <Typography sx={{ fontWeight: 700, color: item.color }}>
              {item.value}
            </Typography>
          </Box>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  </Paper>
);

export default SummaryPanels;
