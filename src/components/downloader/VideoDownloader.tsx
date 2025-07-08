// @ts-nocheck
import React, { useState, FormEvent } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  CardMedia,
  Skeleton,
  FormHelperText
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import { useVideoInfo } from '../../hooks/useVideoInfo';
import { useSnackbar } from 'notistack';
import API_BASE_URL from '../../config/apiConfig';
import { useTheme } from 'next-themes';

interface VideoDownloaderProps {
  onDownloadComplete?: (videoInfo: any) => void;
}

const VideoDownloader: React.FC<VideoDownloaderProps> = ({ onDownloadComplete }) => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('highest');
  const [isLoading, setIsLoading] = useState(false);
  const { videoInfo, isLoading: isLoadingInfo, fetchVideoInfo, resetVideoInfo } = useVideoInfo();
  const { enqueueSnackbar } = useSnackbar();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const showToast = (message, severity) => {
    enqueueSnackbar(message, { variant: severity });
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    if (videoInfo) {
      resetVideoInfo();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      showToast('Por favor ingresa una URL válida', 'error');
      return;
    }

    let currentVideoInfo = videoInfo;
    if (!currentVideoInfo) {
      try {
        currentVideoInfo = await fetchVideoInfo(url);
        if (!currentVideoInfo) throw new Error('No se recibió información del video');
      } catch (error) {
        showToast(error.message || 'No se pudo obtener información del video', 'error');
        return;
      }
    }

    setIsLoading(true);
    try {
      showToast('Iniciando descarga. Este proceso puede tardar unos minutos...', 'info');
      
      // Determinar la opción de descarga basada en el formato seleccionado
      let optionId = 'opt-720'; // Valor por defecto (calidad media)
      
      if (format === 'mp3') {
        optionId = 'opt-audio';
      } else if (format === 'mp4') {
        // Mapear la calidad seleccionada al optionId correcto
        switch(quality) {
          case 'highest':
            optionId = 'opt-best';  // 4K/máxima calidad
            break;
          case 'medium':
            optionId = 'opt-720';   // HD (720p)
            break;
          case 'low':
            optionId = 'opt-480';   // SD (480p)
            break;
          default:
            optionId = 'opt-720';   // Por defecto usar HD
        }
      }
      
      console.log(`Formato seleccionado: ${format}, Quality: ${quality}, optionId: ${optionId}`);
      
      const response = await axios.post(`${API_BASE_URL}/api/download`, {
        url,
        videoInfo: currentVideoInfo,
        videoId: currentVideoInfo.id,
        optionId: optionId,
        format, // Mantener para información
        quality, // Mantener para información
        downloadDirectly: true,
      });

      if (response.data.success) {
        const downloadId = response.data.downloadId;
        const downloadUrl = `${API_BASE_URL}/api/download-direct/${downloadId}`;
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', ''); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast(`Descarga iniciada correctamente en formato ${format.toUpperCase()}`, 'success');
        
        if (onDownloadComplete) {
          onDownloadComplete(currentVideoInfo);
        }
      } else {
        throw new Error(response.data.error || 'Error en la respuesta del servidor');
      }
    } catch (error: any) {
      console.error('Error al descargar:', error);
      
      // Extraer mensaje de error más claro
      let errorMessage = 'No se pudo procesar la descarga';
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
        
        // Proporcionar mensajes más amigables según el error
        if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
          errorMessage = 'La descarga tardó demasiado tiempo. Intenta con una calidad menor o prueba más tarde.';
        } else if (errorMessage.includes('not available')) {
          errorMessage = 'Este video no está disponible para descarga. Puede estar restringido o ser privado.';
        } else if (errorMessage.includes('copyright')) {
          errorMessage = 'No se puede descargar debido a restricciones de derechos de autor.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '100%',
        borderRadius: '16px',
        bgcolor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'background.paper',
        color: isDarkMode ? 'rgb(230, 230, 230)' : 'inherit',
        overflow: 'hidden',
        '.MuiFormLabel-root, .MuiInputBase-input, .MuiTypography-root, .MuiFormHelperText-root': {
          color: isDarkMode ? 'rgb(210, 210, 210)' : 'inherit'
        },
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: isDarkMode ? 'rgba(200, 200, 200, 0.3)' : undefined
        },
        '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: isDarkMode ? 'rgba(200, 200, 200, 0.5)' : undefined
        }
      }}
    >
      <CardHeader
        title="Descargar Video o Audio"
        titleTypographyProps={{ 
          variant: 'h5', 
          fontWeight: 'bold',
          sx: { color: isDarkMode ? 'rgb(240, 240, 240)' : 'inherit' }
        }}
        sx={{ pb: 1, pt: 3, px: { xs: 2, md: 3 } }}
      />
      <CardContent sx={{ pt: 1, px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Input URL */}
            <FormControl fullWidth variant="outlined">
              <TextField
                id="url"
                label="URL del Video"
                placeholder="Pega aquí la URL (YouTube, TikTok, Instagram...)"
                value={url}
                onChange={handleUrlChange}
                disabled={isLoading}
                fullWidth
                required
                sx={{ 
                  maxWidth: '100%',
                  '& .MuiInputBase-root': {
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 40, 0.6)' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(200, 200, 200)' : undefined
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color={isDarkMode ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText>Ingresa la URL de YouTube, TikTok, Instagram, etc.</FormHelperText>
            </FormControl>

            {/* Placeholder o Miniatura + Info */}
            {isLoadingInfo && (
              <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: '8px' }} />
            )}

            {videoInfo && !isLoadingInfo && (
              <Box sx={{ mt: 1 }}>
                {videoInfo.thumbnail && (
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 200,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      mb: 1.5
                    }}
                    image={videoInfo.thumbnail}
                    alt={`Miniatura de ${videoInfo.title}`}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 'medium', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {videoInfo.title}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                  Plataforma: {videoInfo.platform}
                </Typography>
              </Box>
            )}

            <Divider sx={{ 
              my: 1,
              borderColor: isDarkMode ? 'rgba(200, 200, 200, 0.15)' : undefined 
            }} />

            {/* Opciones */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ width: '100%', maxWidth: '100%' }} 
            >
              <FormControl 
                component="fieldset" 
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>Formato</FormLabel>
                <RadioGroup
                  row
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  name="format-radio-group"
                  sx={{ justifyContent: 'flex-start', flexWrap: 'wrap' }} 
                >
                  <FormControlLabel value="mp4" control={<Radio size="small" />} label="Video (MP4)" disabled={isLoading} />
                  <FormControlLabel value="mp3" control={<Radio size="small" />} label="Audio (MP3)" disabled={isLoading} />
                </RadioGroup>
              </FormControl>

              {format === 'mp4' && (
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ minWidth: { sm: 150 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  <FormLabel htmlFor="quality" sx={{ mb: 1, fontSize: '0.875rem' }}>Calidad (Video)</FormLabel>
                  <Select
                    id="quality"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    disabled={isLoading}
                    labelId="quality-label"
                  >
                    <MenuItem value="highest">Más Alta</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="low">Baja</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>

            {/* Botón Descargar */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={isLoading || isLoadingInfo || !url}
              startIcon={isLoading || isLoadingInfo ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
              fullWidth
              sx={{ 
                mt: 3, 
                py: 1.5, 
                fontWeight: 'bold',
                bgcolor: isDarkMode ? 'primary.dark' : 'primary.main',
                color: '#ffffff',
                '&:hover': {
                  bgcolor: isDarkMode ? 'primary.main' : 'primary.dark',
                }
              }}
            >
              {isLoading || isLoadingInfo ? 'Procesando...' : 'Descargar'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoDownloader; 