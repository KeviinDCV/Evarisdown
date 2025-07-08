/**
 * Declaraciones de módulos para resolver problemas de tipos con Chakra UI
 */

declare module '@chakra-ui/descendant' {
  export interface DescendantsManager<T, K extends Record<string, any> = Record<string, any>> {
    register: (node: T, options?: K) => void;
    unregister: (node: T) => void;
    destroy: () => void;
    // Otras propiedades y métodos...
  }

  export function useDescendants<T extends HTMLElement = HTMLElement, K extends Record<string, any> = Record<string, any>>(): {
    descendants: DescendantsManager<T, K>;
    // Otros valores devueltos...
  };

  export function useDescendant<T extends HTMLElement = HTMLElement, K extends Record<string, any> = Record<string, any>>(
    options?: K
  ): {
    index: number;
    // Otros valores devueltos...
  };

  export function createDescendantContext<T extends HTMLElement = HTMLElement, K extends Record<string, any> = Record<string, any>>();
} 