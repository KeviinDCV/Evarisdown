// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import VideoDownloader from '../components/downloader/VideoDownloader';

const Home: React.FC = () => {
  const downloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo animación del componente de descarga
    const tl = gsap.timeline();

    tl.fromTo(downloaderRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power2.out"
      }
    );

  }, []);

  return (
    <div className="container mx-auto py-4 space-y-6 px-4">
      {/* Letrero institucional compacto */}
      <div className="mb-6 flex justify-center md:justify-end">
        <div className="max-w-lg w-full md:w-auto bg-white rounded-lg p-5 shadow-xl border border-gray-200">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">EvariDown</h2>
            <p className="text-sm font-medium text-gray-700">
              Hospital Universitario del Valle "Evaristo García" E.S.E
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Descarga videos para uso institucional, exposiciones, capacitaciones y fines educativos.
            </p>
            <p className="text-xs font-semibold text-red-600 mt-2">
              ⚠️ Recuerda respetar los derechos de autor y utilizar este contenido únicamente para actividades autorizadas por la institución.
            </p>
          </div>
        </div>
      </div>

      {/* Componente principal de descarga */}
      <div ref={downloaderRef} className="max-w-3xl mx-auto">
        <VideoDownloader />
      </div>

      {/* Logo institucional centrado */}
      <div className="flex justify-center mt-4">
        <img
          src="/Images/LOGO-HUV-COMPUESTO.png"
          alt="Hospital Universitario del Valle"
          className="h-48 w-auto object-contain"
          style={{
            mixBlendMode: 'multiply',
            filter: 'contrast(1.1) brightness(1.1)'
          }}
        />
      </div>

    </div>
  );
};

export default Home; 