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
      <footer className="py-2 sm:py-3 border-t bg-background">
        <div className="container flex flex-col items-center justify-center gap-1 px-2 sm:px-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Hospital Universitario del Valle "Evaristo García" E.S.E
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Innovación y desarrollo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;