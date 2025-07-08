// @ts-nocheck
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import { SnackbarProvider } from 'notistack'; // Para notificaciones
import { ThemeProvider } from './components/ui/theme-provider';

// Configuración de future flags para React Router v7
// Esto evitará las advertencias en la consola
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Router {...router}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 