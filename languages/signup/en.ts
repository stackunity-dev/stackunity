export default {
  meta: {
    title: 'Create Account - StackUnity',
    description: 'Create your StackUnity account to access all features, and start your experience'
  },
  hero: {
    title: 'StackUnity - Develop faster and better with StackUnity'
  },
  form: {
    title: "Create an account",
    subtitle: "Join StackUnity and start your experience",
    username: {
      label: "Username",
      required: "Username required"
    },
    email: {
      label: "Email address",
      required: "Email required",
      invalid: "Invalid email format"
    },
    password: {
      label: "Password",
      required: "Password required",
      minLength: "Password must contain at least 8 characters"
    },
    submit: "Create account"
  },
  features: [
    {
      title: "Professional Templates",
      description: "A studio with customized Vuetify component templates"
    },
    {
      title: "Detailed Analytics",
      description: "Accessibility and SEO audit, test all aspects of your site"
    },
    {
      title: "Monitoring and SQL Generator",
      description: "Site monitoring and a ready-to-use SQL generator"
    },
    {
      title: "Clean Interface",
      description: "A simple and intuitive interface for easier use"
    }
  ],
  createAccount: {
    question: "Already have an account?",
    action: "Sign in"
  }
} 