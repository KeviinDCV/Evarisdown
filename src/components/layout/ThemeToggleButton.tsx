// @ts-nocheck
import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion';
import { useAppTheme } from '../../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();

  return (
    <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: mode === 'dark' ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {mode === 'dark' ? (
            <Brightness7Icon sx={{ color: theme.palette.warning.light }} />
          ) : (
            <Brightness4Icon />
          )}
        </motion.div>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton; 