// src/components/archive/ParasiteCard.tsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box,
  Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Parasite } from '../../types/parasite';
import { useTranslation } from 'react-i18next';

interface ParasiteCardProps {
  parasite: Parasite;
}

// دالة لإصلاح رابط الصورة
const getImageUrl = (parasite: Parasite): string => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';
  
  // نجرب كل الاحتمالات
  const imageValue = parasite.imageUrl;
  
  if (!imageValue) {
    return DEFAULT_IMAGE;
  }
  
  // إذا كان رابط كامل
  if (imageValue.startsWith('http')) {
    return imageValue;
  }
  
  // إذا كان مسار فقط - نضيف Supabase URL
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/parasites/${imageValue}`;
  }
  
  return DEFAULT_IMAGE;
};

const ParasiteCard: React.FC<ParasiteCardProps> = ({ parasite }) => {
  const { t } = useTranslation();
  const imageUrl = getImageUrl(parasite);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/parasite/${parasite.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', pt: '65%', width: '100%', bgcolor: '#FAFCFB' }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={parasite.name || parasite.scientificName || 'Parasite'}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Chip
              label={parasite.type || t('unknown', { defaultValue: 'غير محدد' })}
              size="small"
              sx={{
                bgcolor: '#DAF1DE',
                color: '#0B2B26',
                fontWeight: 600,
                fontSize: 11,
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {parasite.stage || 'N/A'}
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontFamily: `'Georgia', 'Times New Roman', serif`,
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#051F20',
              mb: 1,
            }}
          >
            {parasite.name || parasite.scientificName}
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              size="small"
              endIcon={<OpenInNewIcon fontSize="small" />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#0B2B26',
              }}
            >
              {t('view_details', { defaultValue: 'عرض التفاصيل' })}
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ParasiteCard;