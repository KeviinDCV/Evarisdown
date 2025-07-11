// @ts-nocheck
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 sm:h-16 items-center space-x-2 sm:space-x-4 sm:justify-between sm:space-x-0 px-2 sm:px-4">
        <div className="flex gap-2 sm:gap-6 md:gap-10">
          <RouterLink to="/" className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center">
              <img
                src="/Images/logo.png"
                alt="EvariDown Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
              />
            </div>
            <span className="font-bold text-lg sm:text-xl">EvariDown</span>
          </RouterLink>
          <nav className="hidden gap-6 md:flex">
            <RouterLink
              to="/history"
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-primary",
              )}
            >
              Historial
            </RouterLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
        <div className="md:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
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
              className={isOpen ? 'hidden' : 'block'}
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
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
              className={isOpen ? 'block' : 'hidden'}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="container md:hidden">
          <div className="flex flex-col space-y-3 pb-3 pt-2">
            <RouterLink
              to="/history"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Historial
            </RouterLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 