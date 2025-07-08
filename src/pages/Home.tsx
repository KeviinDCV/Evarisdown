// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import VideoDownloader from '../components/downloader/VideoDownloader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../lib/utils";
import logoSvg from '../logo.svg';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8 px-4">
      {/* Banner animado */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-blue-500 p-8 text-primary-foreground mb-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${logoSvg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '200px' }} />
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">EvariDown</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-xl mb-4 max-w-xl">
              Descarga videos y música de YouTube, Instagram, TikTok y más plataformas con facilidad y rapidez.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex gap-2 flex-wrap">
              <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm">
                HD y 4K
              </span>
              <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm">
                MP3 y MP4
              </span>
              <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm">
                Sin marca de agua
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Componente principal de descarga */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <VideoDownloader />
      </motion.div>
      
      {/* Sección de características */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            ¿Por qué elegir EvariDown?
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Rápido y Fácil',
              description: 'Descarga videos y música con solo pegar la URL. No necesitas registrarte.'
            },
            {
              title: 'Alta Calidad',
              description: 'Descarga videos en alta definición (HD, Full HD, 4K) y audio en alta calidad.'
            },
            {
              title: 'Múltiples Plataformas',
              description: 'Compatible con YouTube, Instagram, TikTok, Twitter, Facebook y más.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + (index * 0.2), duration: 0.5 }}
            >
              <Card className={cn(
                "h-full transition-all hover:shadow-lg hover:-translate-y-1",
              )}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 