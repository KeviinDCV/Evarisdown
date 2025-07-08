// @ts-nocheck
import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' 
            ? theme.palette.grey[200] 
            : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* @ts-ignore */}
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DownloadIcon sx={{ mr: 1, color: 'primary.main' }}/>
              <Typography variant="h6" color="text.primary" gutterBottom>
                EvariDown
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Descarga videos y música fácilmente desde tus plataformas favoritas.
            </Typography>
          </Grid>
          
          {/* @ts-ignore */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Navegación
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 0.5 }}>
              Inicio
            </Link>
            <Link href="/history" color="inherit" display="block" sx={{ mb: 0.5 }}>
              Historial
            </Link>
            <Link href="/about" color="inherit" display="block">
              Acerca de
            </Link>
          </Grid>
          
          {/* @ts-ignore */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Plataformas
            </Typography>
            <Typography variant="body2" component="p" color="text.secondary">
              YouTube, Instagram, TikTok,
            </Typography>
            <Typography variant="body2" component="p" color="text.secondary">
              Twitter, Facebook y más.
            </Typography>
          </Grid>
        </Grid>
        
        <Box mt={4} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
              EvariDown
            </Link>{' '}
            {currentYear}
            {'. Todos los derechos reservados.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 