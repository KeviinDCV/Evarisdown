// @ts-nocheck
import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

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
    </div>
  );
};

export default Layout;