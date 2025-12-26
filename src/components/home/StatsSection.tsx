import React from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { Database, Dna, Activity } from 'lucide-react';
import { colors } from '../../theme/colors';

interface Stats {
  total: number;
  types: number;
  recent: number;
}

interface StatsSectionProps {
  stats: Stats;
}

const statsConfig = [
  {
    key: 'total',
    label: 'TOTAL SAMPLES',
    getValue: (s: Stats) => s.total,
    suffix: '+',
  },
  {
    key: 'types',
    label: 'SPECIES TYPES',
    getValue: (s: Stats) => s.types,
    suffix: '',
  },
  {
    key: 'recent',
    label: 'RECENT ACTIVITY',
    getValue: (s: Stats) => s.recent,
    suffix: ' new',
  },
];

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 }, 
        bgcolor: colors.background.default,
        borderTop: `1px solid ${colors.primary.lighter}15`, // خط فاصل خفيف جداً
        borderBottom: `1px solid ${colors.primary.lighter}15`
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-around" // توزيع متساوي
          divider={
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                display: { xs: 'none', md: 'block' }, // إخفاء الخط العمودي في الموبايل
                borderColor: `${colors.primary.lighter}30`,
                height: '60px',
                alignSelf: 'center'
              }} 
            />
          }
          spacing={{ xs: 6, md: 0 }}
        >
          {statsConfig.map((item) => {
            const value = item.getValue(stats);

            return (
              <Box 
                key={item.key} 
                sx={{ 
                  textAlign: 'center', 
                  width: { xs: '100%', md: 'auto' } // عرض كامل في الموبايل
                }}
              >
                {/* الرقم الضخم العائم */}
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '3.5rem', md: '4.5rem' }, // حجم ضخم جداً
                    color: colors.primary.main,
                    lineHeight: 1,
                    mb: 1,
                    letterSpacing: -2,
                  }}
                >
                  {value}{item.suffix}
                </Typography>

                {/* العنوان الصغير تحته */}
                <Typography
                  variant="overline"
                  sx={{
                    color: colors.text.secondary,
                    fontWeight: 700,
                    letterSpacing: 2,
                    fontSize: '0.8rem',
                    display: 'block',
                    opacity: 0.8
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
};

export default StatsSection;
