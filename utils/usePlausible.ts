/**
 * 
 * 
 * 
 * @returns Fonction pour suivre des événements
 */
export function usePlausible() {
  // En supposant que le plugin Plausible est disponible globalement après installation
  // via @nuxtjs/plausible dans nuxt.config.ts
  if (process.client) {
    // @ts-ignore - l'API Plausible est injectée globalement
    const plausible = window.plausible;

    // Retourne la fonction de suivi
    return (event: string, options?: { props?: Record<string, any> }) => {
      if (plausible && typeof plausible === 'function') {
        plausible(event, options);
      } else {
        console.warn('Plausible n\'est pas disponible');
      }
    };
  }

  // Version côté serveur (no-op)
  return (event: string, options?: { props?: Record<string, any> }) => {
    // Ne fait rien côté serveur
  };
} 