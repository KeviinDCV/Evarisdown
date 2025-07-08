// @ts-nocheck
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  InputAdornment,
  IconButton 
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

const platformsInfo = [
  { name: 'YouTube', url: 'youtube.com/watch' },
  { name: 'TikTok', url: 'tiktok.com' },
  { name: 'Instagram', url: 'instagram.com' },
  { name: 'Twitter', url: 'twitter.com' },
  { name: 'Facebook', url: 'facebook.com' }
];

const DownloadForm: React.FC<DownloadFormProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Por favor, ingresa una URL');
      return;
    }
    
    if (!isValidUrl(url)) {
      setError('Por favor, ingresa una URL válida');
      return;
    }
    
    setError('');
    onSubmit(url);
  };

  const handleClearUrl = () => {
    setUrl('');
    setError('');
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="URL del video"
        variant="outlined"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError('');
        }}
        placeholder="https://www.youtube.com/watch?v=..."
        error={!!error}
        helperText={error}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: url && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear input"
                onClick={handleClearUrl}
                edge="end"
                disabled={loading}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
        sx={{ 
          py: 1.5, 
          mb: 4,
          borderRadius: 1.5,
          fontSize: '1rem',
        }}
      >
        {loading ? 'Procesando...' : 'Continuar'}
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
          Plataformas compatibles:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {platformsInfo.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="body2">
                  {platform.name}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        Al usar este servicio, aceptas nuestros términos de uso y confirmas que solo descargarás
        contenido para uso personal o con permiso adecuado.
      </Typography>
    </Box>
  );
};

export default DownloadForm; 