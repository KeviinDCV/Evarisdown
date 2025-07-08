// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const About: React.FC = () => {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Acerca de EvariDown
        </h1>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <CardTitle>¿Qué es EvariDown?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EvariDown es una herramienta gratuita y fácil de usar que te permite descargar videos y música de plataformas 
              populares como YouTube, Instagram, TikTok, Twitter, Facebook y muchas más.
            </p>
            <p>
              Nuestro objetivo es ofrecer una experiencia de descarga rápida y sin complicaciones, 
              permitiéndote guardar contenido en alta calidad para su visualización sin conexión.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              <CardTitle>Tecnología</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EvariDown está construido con tecnologías modernas para garantizar un rendimiento óptimo y una experiencia
              de usuario fluida.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="font-medium mb-2">Frontend:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Shadcn UI</li>
                  <li>Framer Motion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Backend:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Python</li>
                  <li>Flask</li>
                  <li>yt-dlp</li>
                  <li>FFmpeg</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M8 12h8"/>
                <path d="M12 8v8"/>
              </svg>
              <CardTitle>Uso Responsable</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EvariDown está diseñado exclusivamente para uso personal. Te recomendamos utilizar esta herramienta de manera responsable
              y ética, respetando los derechos de autor y las condiciones de servicio de las plataformas.
            </p>
            <p>
              Por favor, descarga únicamente contenido que tengas derecho a guardar, como videos con licencias
              Creative Commons, contenido propio o para el que tengas permiso explícito.
            </p>

            <Separator className="my-4" />

            <div className="text-center text-muted-foreground text-sm">
              <p>&copy; {new Date().getFullYear()} EvariDown, este proyecto es desarrollado por el Departamento de Innovación y Desarrollo.</p>
              <p className="mt-1">No estamos afiliados a ninguna de las plataformas soportadas.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default About; 