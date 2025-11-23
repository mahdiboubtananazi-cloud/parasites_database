import React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  // ??? ??? ?????
  const handleImageContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // ??? ??? ?????
  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!images || images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          ?? ???? ??? ?????
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ????? ??? ???? ??????? ??? ???????? ?????
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ImageList cols={3} gap={8}>
        {images.map((image, index) => (
          <ImageListItem key={index}>
            <img
              src={\data:image/jpeg;base64,\\\}
              alt={\???? ??????? \\\}
              loading="lazy"
              style={{
                borderRadius: '8px',
                filter: 'blur(2px)', // ???? ?????? ????? ???
                cursor: 'not-allowed'
              }}
              onContextMenu={handleImageContextMenu}
              onDragStart={handleImageDragStart}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              ????? ???
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageGallery;
