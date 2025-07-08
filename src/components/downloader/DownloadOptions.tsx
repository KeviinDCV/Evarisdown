// @ts-nocheck
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import { motion } from 'framer-motion';

interface VideoFormat {
  formatId: string;
  ext: string;
  resolution: string;
  filesize: string;
  formatNote: string;
  vcodec: string;
  acodec: string;
  isAudioOnly: boolean;
}

interface DownloadOptionsProps {
  videoInfo: {
    formats: VideoFormat[];
  };
  selectedFormat: string;
  selectedQuality: string;
  setSelectedFormat: (format: string) => void;
  setSelectedQuality: (quality: string) => void;
  onDownload: () => void;
  onBack: () => void;
  loading: boolean;
  progress: number;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  videoInfo,
  selectedFormat,
  selectedQuality,
  setSelectedFormat,
  setSelectedQuality,
  onDownload,
  onBack,
  loading,
  progress
}) => {
  // Asegurarse de que formats sea un array, incluso si es undefined o null
  const formats = videoInfo?.formats || [];
  
  // Agrupar formatos por tipo - permitir siempre selección
  const videoFormats = formats.filter(f => !f.isAudioOnly);
  const audioFormats = formats.filter(f => f.isAudioOnly);
  
  // Calidades disponibles basadas en el formato seleccionado
  const getAvailableQualities = () => {
    if (selectedFormat === 'video') {
      return [
        { value: 'highest', label: 'La mejor calidad' },
        { value: 'high', label: 'Alta (720p-1080p)' },
        { value: 'medium', label: 'Media (480p)' },
        { value: 'low', label: 'Baja (360p)' }
      ];
    } else if (selectedFormat === 'audio') {
      return [
        { value: 'best', label: 'Mejor calidad' },
        { value: 'medium', label: 'Calidad media' }
      ];
    }
    return [];
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h6" gutterBottom>
          Opciones de Descarga
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecciona el formato y la calidad que deseas descargar.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="format-select-label">Formato</InputLabel>
                <Select
                  labelId="format-select-label"
                  value={selectedFormat}
                  label="Formato"
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="" disabled>
                    Selecciona un formato
                  </MenuItem>
                  <MenuItem value="video">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VideocamIcon sx={{ mr: 1 }} />
                      Video (MP4)
                    </Box>
                  </MenuItem>
                  <MenuItem value="audio">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AudioFileIcon sx={{ mr: 1 }} />
                      Audio (MP3)
                    </Box>
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {selectedFormat === 'video' 
                    ? 'Descarga el video con audio'
                    : selectedFormat === 'audio'
                    ? 'Descarga solo el audio en formato MP3'
                    : 'Selecciona el formato que deseas descargar'}
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedFormat || loading}>
                <InputLabel id="quality-select-label">Calidad</InputLabel>
                <Select
                  labelId="quality-select-label"
                  value={selectedQuality}
                  label="Calidad"
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  disabled={!selectedFormat || loading}
                >
                  <MenuItem value="" disabled>
                    Selecciona la calidad
                  </MenuItem>
                  {getAvailableQualities().map((quality) => (
                    <MenuItem value={quality.value} key={quality.value}>
                      {quality.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {selectedFormat 
                    ? 'Selecciona la calidad deseada'
                    : 'Primero selecciona un formato'}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          
          {loading && progress > 0 && (
            <Box sx={{ mb: 3, mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Descargando: {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
        </Box>
      </motion.div>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          disabled={loading}
        >
          Atrás
        </Button>
        <Button
          onClick={onDownload}
          startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          variant="contained"
          color="primary"
          disabled={!selectedFormat || !selectedQuality || loading}
        >
          {loading ? 'Descargando...' : 'Descargar ahora'}
        </Button>
      </Box>
    </Box>
  );
};

export default DownloadOptions; 