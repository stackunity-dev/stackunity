export default {
  meta: {
    title: 'Crear cuenta - StackUnity',
    description: 'Crea tu cuenta StackUnity para acceder a todas las funciones y comienza tu experiencia'
  },
  hero: {
    title: 'StackUnity - Desarrolla más rápido y mejor con StackUnity'
  },
  form: {
    title: "Crear una cuenta",
    subtitle: "Únete a StackUnity y comienza tu experiencia",
    username: {
      label: "Nombre de usuario",
      required: "Nombre de usuario requerido"
    },
    email: {
      label: "Dirección de correo electrónico",
      required: "Correo electrónico requerido",
      invalid: "Formato de correo electrónico inválido"
    },
    password: {
      label: "Contraseña",
      required: "Contraseña requerida",
      minLength: "La contraseña debe tener al menos 8 caracteres"
    },
    submit: "Crear cuenta"
  },
  features: [
    {
      title: "Plantillas Profesionales",
      description: "Un estudio con plantillas de componentes Vuetify personalizadas"
    },
    {
      title: "Análisis Detallados",
      description: "Auditoría de accesibilidad y SEO, prueba todos los aspectos de tu sitio"
    },
    {
      title: "Monitoreo y Generador SQL",
      description: "Monitoreo de sitios y generador SQL listo para usar"
    },
    {
      title: "Interfaz Limpia",
      description: "Una interfaz simple e intuitiva para un uso más fácil"
    }
  ],
  createAccount: {
    question: "¿Ya tienes una cuenta?",
    action: "Iniciar sesión"
  }
} 