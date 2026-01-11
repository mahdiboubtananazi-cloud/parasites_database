import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';

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

const TopResearchersTable: React.FC<TopResearchersTableProps> = ({
  data,
  totalParasites,
  isMobile,
  isRtl,
}) => {
  const { t } = useTranslation();

  // isMobile غير مستخدم حاليًا لكن نبقيه في التوقيع للتوافق
  void isMobile;

  if (!data.length) return null;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <span style={{ fontSize: 24 }}>🥇</span>;
      case 1:
        return <span style={{ fontSize: 24 }}>🥈</span>;
      case 2:
        return <span style={{ fontSize: 24 }}>🥉</span>;
      default:
        return (
          <span style={{ fontWeight: 'bold', color: '#888' }}>
            #{index + 1}
          </span>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        mb: 4,
        bgcolor: '#fff',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: `${colors.primary.main}15`,
            color: colors.primary.main,
          }}
        >
          <Users size={20} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#264653' }}
        >
          {t('stats_top_researchers', {
            defaultValue: 'أكثر الباحثين مساهمة',
          })}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: '#555' }}
              >
                {t('rank', { defaultValue: 'الترتيب' })}
              </TableCell>
              <TableCell
                align={isRtl ? 'right' : 'left'}
                sx={{ fontWeight: 700, color: '#555' }}
              >
                {t('researcher_name', { defaultValue: 'اسم الباحث' })}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: '#555' }}
              >
                {t('samples_count', { defaultValue: 'عدد العينات' })}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: '#555' }}
              >
                {t('percentage', { defaultValue: 'النسبة' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student, index) => {
              const percentage = (
                (student.value / totalParasites) *
                100
              ).toFixed(1);
              return (
                <TableRow
                  key={student.name}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="center">{getRankIcon(index)}</TableCell>

                  <TableCell align={isRtl ? 'right' : 'left'}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor:
                            index < 3 ? colors.primary.main : '#e0e0e0',
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#333"
                      >
                        {student.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        bgcolor: `${colors.secondary.main}15`,
                        color: colors.secondary.main,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {student.value}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 6,
                          bgcolor: '#eee',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            height: '100%',
                            bgcolor:
                              index < 3 ? colors.primary.main : '#bbb',
                            borderRadius: 3,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
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