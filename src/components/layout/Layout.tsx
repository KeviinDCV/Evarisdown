// @ts-nocheck
import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);

  // Abrir el modal al cargar la página
  useEffect(() => {
    setOpenWelcomeModal(true);
  }, []);

  const handleCloseWelcomeModal = () => {
    setOpenWelcomeModal(false);
  };

  // Animación de flotación para la imagen
  const floatVariants = {
    float: {
      y: ["0%", "-5%", "0%"], // Movimiento vertical un poco más pronunciado
      transition: {
        duration: 3.5,      
        repeat: Infinity,    
        repeatType: "reverse",
        ease: "easeInOut"     
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-6 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EvariDown. Todos los derechos reservados.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Hecho con ❤️ por el equipo de Innovación y Desarrollo
          </p>
        </div>
      </footer>

      {/* Modal de Bienvenida */}
      <Dialog open={openWelcomeModal} onOpenChange={setOpenWelcomeModal}>
        <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Bienvenido a EvariDown</DialogTitle>
            <DialogDescription className="sr-only">
              Descarga tus videos y audios favoritos fácilmente
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            {/* Imagen Flotante */}
            <motion.div
              variants={floatVariants}
              animate="float"
              className="mb-4"
            >
              <img 
                src="/welcome-image.jpeg" 
                alt="Bienvenida"
                className="max-w-full h-auto max-h-[350px] rounded-lg mx-auto"
              />
            </motion.div>
            
            {/* Contenido del diálogo */}
            <Card className="w-full backdrop-blur-md bg-background/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">¡Bienvenido a EvariDown!</CardTitle>
                <CardDescription className="text-center">
                  Descarga tus videos y audios favoritos fácilmente.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button onClick={handleCloseWelcomeModal}>
                  Entendido
                </Button>
              </CardFooter>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;