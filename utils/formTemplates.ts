import type { FormField } from '../utils/studio/form-types';

interface FormTemplate {
  fields: FormField[];
  properties: {
    title: string;
    subtitle: string;
    showGoogleLogin: boolean;
    showLinkedInLogin: boolean;
    showDivider: boolean;
    dividerText: string;
  };
}

const templates: Record<string, FormTemplate> = {
  login: {
    fields: [
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        value: '',
        required: true,
        icon: 'mdi-lock-outline'
      },
      {
        type: 'checkbox',
        label: 'Remember me',
        placeholder: '',
        value: false,
        required: false
      }
    ],
    properties: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      showGoogleLogin: true,
      showLinkedInLogin: true,
      showDivider: true,
      dividerText: 'or continue with email'
    }
  },
  register: {
    fields: [
      {
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        value: '',
        required: true,
        icon: 'mdi-account-outline'
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'password',
        label: 'Password',
        placeholder: 'Create a password',
        value: '',
        required: true,
        icon: 'mdi-lock-outline'
      },
      {
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
        value: '',
        required: true,
        icon: 'mdi-lock-check-outline'
      },
      {
        type: 'select',
        label: 'Account Type',
        placeholder: 'Select your account type',
        value: '',
        options: 'Personal, Business, Enterprise',
        required: true,
        icon: 'mdi-account-tie-outline'
      },
      {
        type: 'checkbox',
        label: 'I agree to the terms and conditions',
        placeholder: '',
        value: false,
        required: true
      }
    ],
    properties: {
      title: 'Create Account',
      subtitle: 'Join our community today',
      showGoogleLogin: true,
      showLinkedInLogin: true,
      showDivider: true,
      dividerText: 'or continue with email'
    }
  },
  contact: {
    fields: [
      {
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your name',
        value: '',
        required: true,
        icon: 'mdi-account-outline'
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'select',
        label: 'Subject',
        placeholder: 'Select a subject',
        value: '',
        options: 'General Inquiry, Support, Feedback, Partnership, Other',
        required: true,
        icon: 'mdi-tag-outline'
      },
      {
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message',
        value: '',
        required: true,
        icon: 'mdi-message-outline'
      },
      {
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        placeholder: '',
        value: false,
        required: false
      }
    ],
    properties: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you',
      showGoogleLogin: false,
      showLinkedInLogin: false,
      showDivider: false,
      dividerText: ''
    }
  },
  survey: {
    fields: [
      {
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your name',
        value: '',
        required: true,
        icon: 'mdi-account-outline'
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'select',
        label: 'How did you hear about us?',
        placeholder: 'Select an option',
        value: '',
        options: 'Social Media, Search Engine, Friend, Advertisement, Other',
        required: true,
        icon: 'mdi-bullhorn-outline'
      },
      {
        type: 'radio',
        label: 'How satisfied are you with our service?',
        placeholder: '',
        value: '',
        options: 'Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied',
        required: true,
        icon: 'mdi-emoticon-outline'
      },
      {
        type: 'select',
        label: 'Which features do you use most often?',
        placeholder: 'Select multiple options',
        value: '',
        options: 'Feature A, Feature B, Feature C, Feature D, Feature E',
        required: true,
        icon: 'mdi-star-outline'
      },
      {
        type: 'textarea',
        label: 'Additional Comments',
        placeholder: 'Share your thoughts',
        value: '',
        required: false,
        icon: 'mdi-comment-outline'
      }
    ],
    properties: {
      title: 'Customer Survey',
      subtitle: 'Help us improve our service',
      showGoogleLogin: false,
      showLinkedInLogin: false,
      showDivider: false,
      dividerText: ''
    }
  },
  subscription: {
    fields: [
      {
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        value: '',
        required: true,
        icon: 'mdi-account-outline'
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'select',
        label: 'Subscription Plan',
        placeholder: 'Select a plan',
        value: '',
        options: 'Basic, Pro, Enterprise',
        required: true,
        icon: 'mdi-currency-usd'
      },
      {
        type: 'radio',
        label: 'Billing Cycle',
        placeholder: '',
        value: '',
        options: 'Monthly, Yearly',
        required: true,
        icon: 'mdi-calendar-outline'
      },
      {
        type: 'checkbox',
        label: 'I agree to the subscription terms',
        placeholder: '',
        value: false,
        required: true
      }
    ],
    properties: {
      title: 'Subscribe Now',
      subtitle: 'Choose your perfect plan',
      showGoogleLogin: true,
      showLinkedInLogin: true,
      showDivider: true,
      dividerText: 'or continue with email'
    }
  },
  feedback: {
    fields: [
      {
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your name',
        value: '',
        required: true,
        icon: 'mdi-account-outline'
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        value: '',
        required: true,
        icon: 'mdi-email-outline'
      },
      {
        type: 'radio',
        label: 'Type of Feedback',
        placeholder: '',
        value: '',
        options: 'Bug Report, Feature Request, General Feedback',
        required: true,
        icon: 'mdi-message-alert-outline'
      },
      {
        type: 'textarea',
        label: 'Description',
        placeholder: 'Describe your feedback in detail',
        value: '',
        required: true,
        icon: 'mdi-text-box-outline'
      },
      {
        type: 'checkbox',
        label: 'I would like to receive updates about this feedback',
        placeholder: '',
        value: false,
        required: false
      }
    ],
    properties: {
      title: 'Share Your Feedback',
      subtitle: 'Help us improve our product',
      showGoogleLogin: false,
      showLinkedInLogin: false,
      showDivider: false,
      dividerText: ''
    }
  }
};

export const getFormTemplate = (templateType: string): FormField[] => {
  return templates[templateType]?.fields || [];
};

export const getFormTemplateProperties = (templateType: string) => {
  return templates[templateType]?.properties || null;
}; 