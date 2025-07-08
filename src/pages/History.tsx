// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import API_BASE_URL from '../config/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

interface DownloadHistoryItem {
  id: string;
  url?: string;
  title?: string;
  format?: string;
  quality?: string;
  downloadDate: string;
  platform?: string;
  filePath?: string;
  videoInfo?: {
    title?: string;
    platform?: string;
  };
  option?: {
    format?: string;
    quality?: string;
  };
  status?: string;
}

// Clave para almacenar el historial en localStorage
const LOCAL_STORAGE_KEY = 'evaridown_history';

const History: React.FC = () => {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Función para cargar el historial: primero desde localStorage, luego desde el servidor
  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Primero intentamos cargar el historial local
      const localHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localHistory) {
        setHistory(JSON.parse(localHistory));
      }
      
      // Luego intentamos cargar desde el servidor y unificar
      try {
        const response = await axios.get(`${API_BASE_URL}/api/history`);
        
        // Transformar datos del servidor para que coincidan con nuestro formato
        const serverHistory = response.data.map((item: any) => {
          return {
            id: item.id,
            title: item.videoInfo?.title || 'Sin título',
            url: item.url || '',
            format: item.option?.format || '',
            quality: item.option?.quality || '',
            downloadDate: item.downloadDate,
            platform: item.videoInfo?.platform || '',
            filePath: item.filePath || '',
            status: item.status || 'completed'
          };
        });
        
        // Combinar historial local y del servidor (sin duplicados)
        const combinedHistory = [...serverHistory];
        
        // Actualizar estado y localStorage
        setHistory(combinedHistory);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combinedHistory));
        setError(null);
      } catch (err) {
        console.warn('No se pudo cargar el historial del servidor, usando solo el local:', err);
        // No se establece error porque al menos tenemos el historial local
      }
    } catch (err) {
      console.error('Error al cargar el historial:', err);
      setError('No se pudo cargar el historial de descargas. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Primero eliminamos del historial local
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      
      // Luego intentamos eliminar del servidor
      try {
        await axios.delete(`${API_BASE_URL}/api/history/${id}`);
        enqueueSnackbar('Elemento eliminado del historial', { variant: 'success' });
      } catch (err) {
        console.warn('No se pudo eliminar del servidor, pero se eliminó localmente:', err);
        enqueueSnackbar('Elemento eliminado del historial local', { variant: 'success' });
      }
    } catch (err) {
      console.error('Error al eliminar del historial:', err);
      enqueueSnackbar('No se pudo eliminar el elemento', { variant: 'error' });
    }
  };

  const handleDownload = (item: DownloadHistoryItem) => {
    try {
      const id = item.id;
      // Usar la ruta correcta para descargar el archivo directamente del servidor
      const downloadUrl = `${API_BASE_URL}/api/download-by-id/${id}`;
      
      // Informar al usuario
      enqueueSnackbar('Iniciando descarga del archivo...', { variant: 'info' });
      
      // Abrir en una nueva pestaña para iniciar la descarga
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error al iniciar la descarga:', error);
      enqueueSnackbar('No se pudo iniciar la descarga. Inténtalo de nuevo.', { variant: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  // Filtrar por descargas completadas para mostrar
  const completedDownloads = history.filter(item => item.status !== 'failed');

  return (
    <div className="container mx-auto py-6 space-y-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">
          Historial de Descargas
        </h1>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Cargando historial...</p>
          </div>
        ) : completedDownloads.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                No hay descargas en tu historial
              </h2>
              <p className="text-muted-foreground">
                Las descargas que realices aparecerán aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Descargas Recientes</CardTitle>
              <CardDescription>
                Lista de videos y archivos descargados recientemente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {completedDownloads.map((item, index) => (
                  <li key={item.id} className="group">
                    {index > 0 && <Separator className="mb-4" />}
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground break-all">{item.url}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {item.format || 'Formato desconocido'}
                          </span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {item.quality || 'Calidad estándar'}
                          </span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {item.platform || 'Plataforma desconocida'}
                          </span>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {formatDate(item.downloadDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <Button
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleDownload(item)}
                          className="flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Descargar
                        </Button>
                        <Button
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default History; 