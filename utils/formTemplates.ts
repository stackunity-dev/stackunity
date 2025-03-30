// Définition des templates de formulaire
export const formTemplates = {
  contact: [
    {
      type: 'text',
      label: 'Name',
      placeholder: 'Enter your full name',
      value: '',
      required: true,
      icon: 'mdi-account'
    },
    {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email address',
      value: '',
      required: true,
      icon: 'mdi-email'
    },
    {
      type: 'select',
      label: 'Subject',
      placeholder: 'Select a subject',
      value: '',
      options: 'General Inquiry, Support Request, Feedback, Other',
      required: true,
      icon: 'mdi-help-circle'
    },
    {
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message',
      value: '',
      required: true,
      icon: 'mdi-message-text'
    }
  ],

  login: [
    {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email address',
      value: '',
      required: true,
      icon: 'mdi-email'
    },
    {
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      value: '',
      required: true,
      icon: 'mdi-lock'
    },
    {
      type: 'checkbox',
      label: 'Remember me',
      placeholder: '',
      value: false,
      required: false
    }
  ],

  register: [
    {
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      value: '',
      required: true,
      icon: 'mdi-account'
    },
    {
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      value: '',
      required: true,
      icon: 'mdi-account'
    },
    {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email address',
      value: '',
      required: true,
      icon: 'mdi-email'
    },
    {
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      value: '',
      required: true,
      icon: 'mdi-lock'
    },
    {
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      value: '',
      required: true,
      icon: 'mdi-lock-check'
    },
    {
      type: 'checkbox',
      label: 'I agree to the Terms and Conditions',
      placeholder: '',
      value: false,
      required: true
    }
  ],

  survey: [
    {
      type: 'text',
      label: 'Name',
      placeholder: 'Enter your name (optional)',
      value: '',
      required: false,
      icon: 'mdi-account'
    },
    {
      type: 'select',
      label: 'How did you hear about us?',
      placeholder: 'Select an option',
      value: '',
      options: 'Social Media, Friend/Colleague, Search Engine, Advertisement, Other',
      required: true,
      icon: 'mdi-help-circle'
    },
    {
      type: 'radio',
      label: 'How would you rate our service?',
      placeholder: '',
      value: '',
      options: 'Excellent, Good, Average, Poor, Very Poor',
      required: true,
      icon: 'mdi-star'
    },
    {
      type: 'textarea',
      label: 'Additional Comments',
      placeholder: 'Please share any additional feedback',
      value: '',
      required: false,
      icon: 'mdi-comment-text-outline'
    }
  ]
};

// Fonction pour obtenir un template spécifique
export const getFormTemplate = (templateName: string) => {
  return JSON.parse(JSON.stringify(formTemplates[templateName as keyof typeof formTemplates] || []));
}; 