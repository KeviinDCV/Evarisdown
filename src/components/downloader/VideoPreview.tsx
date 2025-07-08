// @ts-nocheck
import React from 'react';
import { Box, Typography, Button, Paper, Chip, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';

interface VideoPreviewProps {
  videoInfo: {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    platform: string;
  };
  onNext: () => void;
  onBack: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoInfo, onNext, onBack }) => {
  const { title, thumbnail, duration, author, platform } = videoInfo;

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 3, 
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box 
              component="img"
              src={thumbnail || '/placeholder-image.jpg'}
              alt={title}
              sx={{
                width: '100%',
                maxHeight: { xs: '200px', sm: '300px', md: '350px' },
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                p: 2
              }}
            >
              <Chip 
                label={platform}
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {title || 'Sin título'}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {author || 'Autor desconocido'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {duration || 'Duración desconocida'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Atrás
        </Button>
        <Button
          onClick={onNext}
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          color="primary"
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default VideoPreview; 