// @ts-nocheck
import React, { ReactNode, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type AnimationType = 'fadeIn' | 'slideIn' | 'scaleIn' | 'none';

interface AnimatedComponentProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  children,
  type = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Configuraciones iniciales y finales para cada tipo de animación
    const animations = {
      fadeIn: {
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0 }
      },
      slideIn: {
        from: { opacity: 0, x: -20 },
        to: { opacity: 1, x: 0 }
      },
      scaleIn: {
        from: { opacity: 0, scale: 0.95 },
        to: { opacity: 1, scale: 1 }
      },
      none: {
        from: { opacity: 1 },
        to: { opacity: 1 }
      }
    };

    const config = animations[type];

    // Establecer estado inicial
    gsap.set(element, config.from);

    // Animar al estado final
    gsap.to(element, {
      ...config.to,
      duration,
      delay,
      ease: "power2.out"
    });

  }, [type, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedComponent;