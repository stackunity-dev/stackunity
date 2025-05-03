export default {
  navigation: {
    website: 'Sitio web',
    appearance: 'Apariencia',
    security: 'Seguridad',
    cookies: 'Cookies',
    dataPrivacy: 'Datos y Privacidad'
  },
  website: {
    title: 'Sitio web',
    info: 'Administre la configuración de su sitio web.',
    name: {
      label: 'Nombre del sitio web',
      required: 'El nombre del sitio web es obligatorio'
    },
    url: {
      label: 'URL del sitio web',
      invalid: 'La URL debe comenzar con https://'
    },
    analysis: {
      title: 'Análisis del sitio web',
      description: 'Analice su sitio para descubrir todas las URLs indexables.',
      button: 'Analizar el sitio web',
      analyzing: 'Analizando...',
      urlsDetected: 'URLs detectadas',
      noUrls: 'No se detectaron URLs',
      copy: 'Copiar',
      clear: 'Borrar',
      open: 'Abrir {url} en una nueva pestaña'
    },
    summary: {
      title: 'Resumen del análisis',
      totalPages: 'Total de páginas',
      averageLoadTime: 'Tiempo medio de carga',
      warnings: 'Advertencias'
    },
    sitemap: {
      title: 'Mapa del sitio generado',
      copy: 'Copiar mapa del sitio',
      download: 'Descargar'
    },
    save: 'Guardar'
  },
  appearance: {
    title: 'Apariencia',
    theme: {
      title: 'Tema',
      greenAmbiance: 'Ambiente verde',
      dark: 'Oscuro',
      system: 'Sistema'
    },
    save: 'Guardar'
  },
  security: {
    title: 'Seguridad',
    info: 'Administre la configuración de seguridad de su cuenta. Recomendamos usar una contraseña fuerte y cambiarla regularmente.',
    changePassword: {
      title: 'Cambiar contraseña',
      currentPassword: 'Contraseña actual',
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Confirmar nueva contraseña',
      update: 'Actualizar contraseña'
    },
    twoFactor: {
      title: 'Autenticación de dos factores',
      description: 'La autenticación de dos factores añade una capa extra de seguridad a su cuenta.',
      status: 'Estado:',
      enabled: 'Activada',
      disabled: 'Desactivada',
      setup: 'Configurar autenticación de dos factores',
      disable: 'Desactivar autenticación de dos factores',
      qrCode: 'Escanee este código QR con su aplicación de autenticación',
      confirmCode: 'Ingrese el código de 6 dígitos de su aplicación',
      confirm: 'Confirmar'
    },
    sessions: {
      title: 'Sesiones activas',
      thisDevice: 'Este dispositivo',
      lastAccess: 'Último acceso:',
      browser: 'Navegador:',
      location: 'Ubicación:',
      ip: 'IP:',
      revoke: 'Revocar',
      revokeAll: 'Revocar todas las demás'
    }
  },
  cookies: {
    title: 'Cookies',
    info: 'Administre cómo se utilizan las cookies en este sitio.',
    necessary: {
      title: 'Necesarias',
      description: 'Las cookies necesarias ayudan a hacer que un sitio web sea utilizable al habilitar funciones básicas como la navegación de páginas y el acceso a áreas seguras del sitio web. El sitio web no puede funcionar correctamente sin estas cookies.'
    },
    preferences: {
      title: 'Preferencias',
      description: 'Las cookies de preferencia permiten que un sitio web recuerde información que cambia la forma en que se comporta o se ve, como su idioma preferido o la región en la que se encuentra.'
    },
    statistics: {
      title: 'Estadísticas',
      description: 'Las cookies de estadísticas ayudan a los propietarios de sitios web a comprender cómo los visitantes interactúan con los sitios web al recopilar y reportar información de forma anónima.'
    },
    marketing: {
      title: 'Marketing',
      description: 'Las cookies de marketing se utilizan para rastrear a los visitantes en los sitios web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual y, por lo tanto, más valiosos para los editores y anunciantes externos.'
    },
    save: 'Guardar preferencias',
    deleteAll: 'Eliminar todas las cookies'
  },
  privacy: {
    title: 'Datos y Privacidad',
    info: 'Administre sus datos personales y configuración de privacidad.',
    exportData: {
      title: 'Exportar sus datos',
      description: 'Descargue una copia de sus datos personales.',
      button: 'Exportar datos'
    },
    deleteAccount: {
      title: 'Eliminar cuenta',
      description: 'Elimine permanentemente su cuenta y todos los datos asociados.',
      warning: 'Advertencia: Esta acción no se puede deshacer. Todos sus datos se eliminarán permanentemente.',
      button: 'Eliminar cuenta',
      confirm: 'Sí, eliminar mi cuenta',
      cancel: 'Cancelar',
      confirmation: 'Escriba "DELETE" para confirmar'
    },
    premiumStatus: {
      title: 'Estado de cuenta premium',
      description: 'Su estado de suscripción actual es:',
      premium: 'Premium',
      standard: 'Estándar',
      trial: 'Prueba',
      free: 'Gratuito'
    }
  },
  notifications: {
    saved: 'Configuración guardada con éxito',
    error: 'Hubo un error al guardar su configuración',
    passwordChanged: 'Contraseña actualizada con éxito',
    passwordError: 'Error al actualizar la contraseña',
    dataCopied: 'Datos copiados al portapapeles',
    sitemapDownloaded: 'Mapa del sitio descargado',
    analysisStarted: 'Análisis iniciado',
    analysisComplete: 'Análisis completado',
    accountDeleted: 'Cuenta eliminada con éxito',
    appearanceUpdated: 'Apariencia actualizada con éxito',
    cookiesDeleted: 'Todas las cookies han sido eliminadas',
    invalidUrl: 'Por favor, ingrese una URL válida que comience con https://'
  }
} 