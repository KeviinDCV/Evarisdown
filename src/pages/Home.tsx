// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import VideoDownloader from '../components/downloader/VideoDownloader';
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
          {/* Logo del hospital en el fondo */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-end pr-8">
            <img
              src="/Images/logo.png"
              alt="Hospital Logo"
              className="h-32 w-auto"
            />
          </div>

          <div className="relative z-10 flex items-center gap-6">
            {/* Logo principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-shrink-0"
            >
              <img
                src="/Images/logo.png"
                alt="Hospital Universitario del Valle"
                className="h-20 w-auto"
              />
            </motion.div>

            {/* Contenido textual */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-2">EvariDown</h1>
                <p className="text-lg font-medium mb-1">Hospital Universitario del Valle "Evaristo García" E.S.E</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-lg mb-4 max-w-2xl leading-relaxed">
                  Descarga videos para uso institucional, exposiciones, capacitaciones y fines educativos.
                  <span className="font-semibold"> Recuerda respetar los derechos de autor</span> y utilizar
                  este contenido únicamente para actividades autorizadas por la institución.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm font-medium">
                    Uso Institucional
                  </span>
                  <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm font-medium">
                    Fines Educativos
                  </span>
                  <span className="bg-primary-foreground/20 rounded-md px-3 py-1 text-sm font-medium">
                    Respeto de Derechos
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
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

    </div>
  );
};

export default Home; 