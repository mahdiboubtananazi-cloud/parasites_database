import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Stack,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  Grid, //  العودة للاستيراد القياسي
  alpha
} from '@mui/material';
import { Search, ArrowRight, Microscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParasites } from '../hooks/useParasites';

const Archive = () => {
  const navigate = useNavigate();
  const { parasites, loading, error } = useParasites();
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all');

  const filteredParasites = parasites?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classificationFilter === 'all' || p.type === classificationFilter;
    return matchesSearch && matchesClass;
  }) || [];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 4,
          mb: 4,
          position: 'sticky',
          top: 70,
          zIndex: 10,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                الأرشيف العلمي
              </Typography>
              <Typography variant="body1" color="text.secondary">
                تصفح {filteredParasites.length} عينة موثقة
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <TextField
                placeholder="بحث..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 300, bgcolor: 'white' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#9CA3AF" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={classificationFilter}
                  onChange={(e) => setClassificationFilter(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                >
                  <MenuItem value="all">الكل</MenuItem>
                  <MenuItem value="protozoa">الأوليات</MenuItem>
                  <MenuItem value="helminths">الديدان</MenuItem>
                  <MenuItem value="arthropods">المفصليات</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="xl">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 10, color: 'error.main' }}>
            <Typography variant="h6">خطأ في التحميل</Typography>
          </Box>
        ) : filteredParasites.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
            <Microscope size={64} style={{ marginBottom: 16 }} />
            <Typography variant="h5">لا توجد نتائج</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredParasites.map((parasite) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={parasite.id}>
                <Card 
                  onClick={() => navigate(`/parasites/${parasite.id}`)}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={parasite.imageUrl || 'https://placehold.co/600x400'}
                      alt={parasite.name}
                      sx={{ bgcolor: 'grey.100' }}
                    />
                    <Chip 
                      label={parasite.type} 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        fontWeight: 600,
                        color: 'primary.main'
                      }} 
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" fontWeight="bold">
                      {parasite.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                      {parasite.scientificName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {parasite.description}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      endIcon={<ArrowRight size={16} />} 
                      fullWidth 
                      sx={{ 
                        bgcolor: alpha('#0F62FE', 0.05),
                        '&:hover': { bgcolor: alpha('#0F62FE', 0.1) }
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Archive;
