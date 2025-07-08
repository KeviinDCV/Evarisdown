// @ts-nocheck
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type AnimationType = 'fadeIn' | 'slideIn' | 'scaleIn' | 'none';

interface AnimatedComponentProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

// Definiciones de variantes de animación
const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }
};

const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  children,
  type = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = ''
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations[type]}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedComponent; 