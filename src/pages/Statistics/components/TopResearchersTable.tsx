import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Box, Typography
} from '@mui/material';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResearcherData {
  name: string;
  value: number;
}

interface TopResearchersTableProps {
  data: ResearcherData[];
  totalParasites: number;
  isMobile: boolean;
  isRtl: boolean;
}

const TopResearchersTable = ({ data, totalParasites, isMobile, isRtl }: TopResearchersTableProps) => {
  const { t } = useTranslation();

  if (!data.length) return null;

  return (
    <Paper sx={{ mb: { xs: 3, md: 4 }, background: 'white', borderRadius: { xs: 1.5, md: 2 }, border: '1px solid #3a5a4015', overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #3a5a4015' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700, color: '#3a5a40',
            display: 'flex', alignItems: 'center', gap: 1,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
          }}
        >
          <Users size={20} />
          {t('table_top_researchers')}
        </Typography>
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3a5a4010' }}>
              <TableCell sx={{ fontWeight: 700, color: '#3a5a40', textAlign: isRtl ? 'right' : 'left' }}>{t('rank')}</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3a5a40', textAlign: isRtl ? 'right' : 'left' }}>{t('researcher_name')}</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3a5a40', textAlign: 'center' }}>{t('samples_count')}</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3a5a40', textAlign: 'center' }}>{t('percentage')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student, index) => {
              const percentage = ((student.value / totalParasites) * 100).toFixed(1);
              return (
                <TableRow key={student.name} sx={{ '&:hover': { backgroundColor: '#3a5a4008' }, borderBottom: '1px solid #3a5a4015' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#3a5a40', textAlign: isRtl ? 'right' : 'left' }}># {index + 1}</TableCell>
                  <TableCell sx={{ textAlign: isRtl ? 'right' : 'left', fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                    {student.name}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={student.value}
                      color="primary" variant="outlined" size={isMobile ? 'small' : 'medium'}
                      sx={{ fontWeight: 700, borderColor: '#32b8c6', color: '#32b8c6' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
                      <Box sx={{ width: isMobile ? '100%' : '100px', height: '8px', backgroundColor: '#3a5a4015', borderRadius: '4px', overflow: 'hidden' }}>
                        <Box sx={{ width: `${percentage}%`, height: '100%', backgroundColor: '#32b8c6', transition: 'width 0.3s ease' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#3a5a40', minWidth: '40px', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {percentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TopResearchersTable;
