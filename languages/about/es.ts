export default {
  meta: {
    title: 'Acerca de & Contacto - StackUnity',
    description: 'Aprende más sobre StackUnity y ponte en contacto con nuestro equipo para cualquier consulta o soporte.',
    keywords: 'StackUnity, acerca de, contacto, misión, valores, desarrollo web, equipo, soporte, desarrolladores, accesibilidad',
    author: 'StackUnity'
  },
  nav: {
    backToHome: 'Volver a la página principal'
  },
  about: {
    title: 'Acerca de StackUnity',
    subtitle: 'Tu kit de herramientas de desarrollo todo en uno',
    mission: {
      title: 'Nuestra Misión',
      content: 'En StackUnity, nuestra misión es capacitar a los desarrolladores proporcionándoles las herramientas que necesitan para crear aplicaciones web excepcionales, reduciendo la complejidad y el tiempo de desarrollo. Creemos que el desarrollo web debe ser accesible para todos, desde principiantes hasta expertos, y que las herramientas adecuadas pueden marcar la diferencia en la calidad y eficiencia del trabajo de un desarrollador.'
    },
    quote: {
      content: "Nuestra visión es crear un ecosistema donde cada desarrollador pueda transformar fácilmente sus ideas en aplicaciones web funcionales, hermosas y de alto rendimiento, sin tener que dominar una multitud de herramientas diferentes.",
      author: "Nûr Djedidi, Fundador"
    },
    team: {
      title: 'Nuestro Equipo',
      content: 'Somos un equipo apasionado de desarrolladores, diseñadores y entusiastas de la tecnología comprometidos con la creación de soluciones intuitivas y efectivas para la comunidad de desarrollo. Nuestros diversos antecedentes y experiencia nos permiten comprender los desafíos que enfrentan los desarrolladores modernos.'
    },
    values: {
      title: 'Nuestros Valores',
      items: [
        {
          title: 'Innovación',
          content: 'Estamos constantemente buscando nuevas formas de mejorar nuestra plataforma y ofrecer más valor a nuestros usuarios.',
          icon: 'mdi-lightbulb-on',
          color: 'info'
        },
        {
          title: 'Simplicidad',
          content: 'Creemos que las mejores herramientas son aquellas que son fáciles de usar, a la vez que son potentes y flexibles.',
          icon: 'mdi-leaf',
          color: 'success'
        },
        {
          title: 'Excelencia',
          content: 'Nos esforzamos por proporcionar herramientas de la más alta calidad, confiables y eficientes para nuestros usuarios.',
          icon: 'mdi-trophy',
          color: 'warning'
        },
        {
          title: 'Comunidad',
          content: 'Valoramos la colaboración y el apoyo mutuo dentro de nuestra comunidad de desarrolladores.',
          icon: 'mdi-account-group',
          color: 'primary'
        }
      ]
    },
    getInTouch: {
      title: 'Contacta con Nosotros',
      content: '¿Tienes preguntas sobre StackUnity o quieres saber más sobre nuestra empresa? No dudes en ponerte en contacto con nosotros.',
      button: 'Contáctanos'
    }
  },
  contact: {
    title: 'Contáctanos',
    subtitle: 'Siempre estamos felices de escuchar tus preguntas, comentarios o sugerencias. Rellena el formulario a continuación y nos pondremos en contacto contigo lo antes posible.',
    form: {
      name: 'Tu nombre',
      email: 'Tu correo electrónico',
      subject: 'Asunto',
      subjects: {
        general: 'Pregunta general',
        technical: 'Soporte técnico',
        feature: 'Solicitud de función',
        bug: 'Reporte de error',
        partnership: 'Asociación',
        other: 'Otro',
      },
      message: 'Tu mensaje',
      submit: 'Enviar mensaje',
      sending: 'Enviando...',
      successTitle: '¡Mensaje enviado!',
      successMessage: '¡Tu mensaje ha sido enviado con éxito! Te responderemos pronto.',
      errorTitle: 'Error',
      errorMessage: 'Se produjo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.',
      required: 'Campo requerido',
      invalidEmail: 'Por favor, introduce una dirección de correo electrónico válida',
      fillAllFields: 'Por favor, completa todos los campos.'
    },
    info: {
      title: 'Otras formas de contactarnos',
      email: {
        title: 'Envíanos un correo electrónico',
        content: 'Para consultas generales: hello@stackunity.com',
        support: 'Para soporte técnico: support@stackunity.com'
      },
      social: {
        title: 'Redes sociales',
        content: 'Síguenos en redes sociales para actualizaciones, consejos y más.'
      },
      office: {
        title: 'Nuestra Oficina',
        content: 'StackUnity HQ, 123 Tech Avenue, San Francisco, CA 94107'
      }
    },
    faq: {
      title: 'Preguntas frecuentes',
      questions: [
        {
          question: '¿Qué es StackUnity?',
          answer: 'StackUnity es un kit de herramientas completo para el desarrollo web que proporciona una variedad de utilidades para desarrolladores web, incluyendo pruebas de API, diseño de bases de datos, validación de accesibilidad y más.'
        },
        {
          question: '¿Cómo empiezo con StackUnity?',
          answer: 'Simplemente crea una cuenta gratuita y podrás comenzar a usar nuestras herramientas básicas de inmediato. Para acceder a funciones premium, consulta nuestras opciones de suscripción.'
        },
        {
          question: '¿Existe un plan gratuito disponible?',
          answer: 'Sí, StackUnity ofrece un nivel gratuito que incluye funcionalidad básica. Las funciones premium están disponibles a través de nuestros planes de suscripción de pago.'
        },
        {
          question: '¿Cómo puedo informar de un problema o sugerir una función?',
          answer: 'Puedes enviar problemas o solicitudes de funciones a través de nuestro formulario de contacto o enviando un correo electrónico a support@stackunity.com.'
        }
      ]
    }
  },
  footer: {
    copyright: "Todos los derechos reservados."
  }
} 