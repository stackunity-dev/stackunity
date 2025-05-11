export default {
  meta: {
    title: "Pago - StackUnity",
    description: "Complete su compra para acceder a las funciones premium de StackUnity",
    keywords: "pago, checkout, StackUnity premium, pago seguro"
  },
  features: {
    advancedTools: {
      title: "Herramientas de Desarrollo Avanzadas",
      description: "Acceso a herramientas y funciones de desarrollo premium"
    },
    analytics: {
      title: "Herramientas de Análisis",
      description: "Acceso a datos de análisis completos para su sitio web"
    },
    prioritySupport: {
      title: "Soporte Prioritario",
      description: "Obtenga soporte prioritario para todas sus preguntas"
    },
    regularUpdates: {
      title: "Actualizaciones Regulares",
      description: "Manténgase al día con las últimas funciones y mejoras"
    },
    teamCollaboration: {
      title: "Colaboración en Equipo",
      description: "Trabaje sin problemas con los miembros de su equipo"
    },
    standardTools: {
      title: "Herramientas de Desarrollo Estándar",
      description: "Acceso a herramientas y funciones de desarrollo estándar"
    },
    basicSupport: {
      title: "Soporte Básico",
      description: "Obtenga soporte básico para sus preguntas"
    }
  },
  plans: {
    premium: {
      title: "Premium de por Vida",
      description: "Acceso ilimitado a todas las funciones premium"
    },
    standard: {
      title: "Estándar de por Vida",
      description: "Acceso a funciones estándar"
    },
    bestChoice: "Mejor opción",
    option: {
      standard: "Estándar",
      premium: "Premium"
    },
    tooltip: {
      lifetimeAccess: "Acceso de por vida",
      standardFeatures: "Acceso a funciones estándar",
      premiumFeatures: "Todas las funciones premium incluidas"
    }
  },
  pricing: {
    htPrice: "Precio sin IVA",
    discount: "Descuento",
    htPriceAfterDiscount: "Precio sin IVA después de descuento",
    vat: "IVA",
    totalTTC: "Total con IVA",
    oneTimePayment: "Pago único, acceso de por vida",
    youSave: "Ahorre",
    saveVsMonthly: "Ahorre 100% vs mensual"
  },
  vatInfo: {
    selfAssessment: "IVA no aplicable, Art. 283-2 del CGI - Autoliquidación del IVA",
    vatNumber: "Número de IVA",
    exportOutsideEU: "Exportación fuera de la UE - IVA no aplicable"
  },
  benefits: {
    premiumTitle: "Características Premium",
    standardTitle: "Características Estándar",
    premium: [
      "Acceso ilimitado a todas las funciones premium",
      "Soporte y actualizaciones prioritarias",
      "Herramientas avanzadas de análisis SEO",
      "Herramientas de desarrollo personalizadas",
      "Funciones de colaboración en equipo",
      "Sin tarifas recurrentes - pague una vez, use para siempre"
    ],
    standard: [
      "Acceso a funciones estándar",
      "Actualizaciones regulares",
      "Soporte básico",
      "Funciones de colaboración en equipo"
    ]
  },
  payment: {
    paymentInformation: "Información de pago",
    billingCountry: "País de facturación",
    businessCustomer: "Estoy comprando para una empresa",
    vatNumber: {
      label: "Número de IVA (para empresas de la UE)",
      placeholder: "ej. ES12345678X",
      hint: "Ingrese su número de IVA para aplicar la autoliquidación si es elegible"
    },
    promoCode: {
      label: "Código promocional",
      placeholder: "Ingrese su código promocional",
      success: "Código promocional aplicado",
      error: "Código promocional inválido o ya utilizado"
    },
    cardholderName: {
      label: "Nombre del titular",
      placeholder: "Nombre en la tarjeta"
    },
    payButton: "Pagar",
    securePayment: "Pago seguro a través de Stripe"
  },
  messages: {
    vatReverseCharge: "Autoliquidación de IVA aplicada (0% de IVA)",
    taxCalculationError: "Error al calcular los impuestos",
    paymentConfigError: "Error de configuración de pago. Por favor contacte con soporte.",
    stripeUnavailable: "Sistema de pago no disponible. Por favor, inténtelo más tarde.",
    initError: "Error al inicializar el formulario de pago. Por favor, actualice la página.",
    stripeConnectionError: "No se puede conectar a Stripe. Por favor, inténtelo de nuevo.",
    paymentSuccess: "¡Pago exitoso! Acceso premium activado y factura enviada a su correo electrónico.",
    invoiceError: "Pago exitoso, pero falló la generación de la factura. Contacte con soporte si es necesario.",
    postPaymentError: "Pago exitoso pero algunas operaciones post-pago fallaron. Por favor, actualice su página.",
    premiumUpdateError: "Pago exitoso pero falló la actualización del estado premium. Por favor, actualice la página.",
    reloginRequired: "Su estado premium ha sido actualizado. Por favor, inicie sesión nuevamente para acceder a sus funciones premium."
  },
  testimonials: {
    premium: {
      text: "StackUnity ha transformado completamente mi flujo de trabajo de desarrollo. ¡El costo es definitivamente lo que vale la pena!",
      author: "Nûr D. - Desarrollador Full Stack"
    }
  }
} 