import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export const useVideoInfo = () => {
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoInfo = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/info`, { url });
      setVideoInfo(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al obtener información del video';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetVideoInfo = () => {
    setVideoInfo(null);
    setError(null);
  };

  return {
    videoInfo,
    isLoading,
    error,
    fetchVideoInfo,
    resetVideoInfo
  };
}; 