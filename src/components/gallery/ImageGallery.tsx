import React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  // Prevent right click (Security)
  const handleImageContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag (Security)
  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!images || images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No images available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No microscopic samples attached to this record.
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
              src={image} 
              alt={`Parasite specimen ${index + 1}`}
              loading="lazy"
              style={{
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
              onContextMenu={handleImageContextMenu}
              onDragStart={handleImageDragStart}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageGallery;