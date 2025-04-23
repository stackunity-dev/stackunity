import { ref } from "vue";
import type { VForm } from "vuetify/components";

interface FormField {
  type: string;
  label: string;
  placeholder: string;
  value: any;
  options?: string;
  required: boolean;
  icon?: string;
  counter?: boolean;
}

type FormVariant = 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled';
type FormDensity = 'default' | 'comfortable' | 'compact';
type MessageLocation = 'bottom' | 'top';
type ButtonVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
type ColorValue = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';

interface FormProperties {
  variant: FormVariant;
  density: FormDensity;
  color: ColorValue;
  disabled: boolean;
  readonly: boolean;
  persistentPlaceholder: boolean;
  validateOnBlur: boolean;
  validateOnInput: boolean;
  successMessage: string;
  errorMessage: string;
  messageLocation: MessageLocation;
  submitButtonText: string;
  cancelButtonText: string;
  submitButtonColor: ColorValue;
  cancelButtonColor: ColorValue;
  buttonVariant: ButtonVariant;
  blockButtons: boolean;
  title: string;
  subtitle: string;
  showGoogleLogin: boolean;
  googleLoginText: string;
  showLinkedInLogin: boolean;
  linkedInLoginText: string;
  showDivider: boolean;
  dividerText: string;
  googleButtonVariant: ButtonVariant;
  googleButtonColor: ColorValue;
  googleButtonSize: 'small' | 'default' | 'large' | 'x-large';
  googleButtonRounded: boolean;
  googleButtonElevation: number;
  linkedInButtonVariant: ButtonVariant;
  linkedInButtonColor: ColorValue;
  linkedInButtonSize: 'small' | 'default' | 'large' | 'x-large';
  linkedInButtonRounded: boolean;
  linkedInButtonElevation: number;
}


const form = ref<InstanceType<typeof VForm> | null>(null);
const formValid = ref(false);

const fieldTypes = [
  'text',
  'password',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'email'
];

const fieldVariants: FormVariant[] = ['outlined', 'filled', 'plain', 'underlined', 'solo'];
const densityOptions: FormDensity[] = ['default', 'comfortable', 'compact'];
const messageLocations: MessageLocation[] = ['bottom', 'top'];
const buttonVariants: ButtonVariant[] = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'];

const colors = [
  { text: 'Default', value: 'default' },
  { text: 'Primary', value: 'primary' },
  { text: 'Secondary', value: 'secondary' },
  { text: 'Success', value: 'success' },
  { text: 'Info', value: 'info' },
  { text: 'Warning', value: 'warning' },
  { text: 'Error', value: 'error' }
] as const;

const formFields = ref<FormField[]>([
  {
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    value: '',
    required: true
  },
  {
    type: 'select',
    label: 'Subject',
    placeholder: 'Select a subject',
    value: '',
    options: 'Information, Support, Other',
    required: true
  },
  {
    type: 'textarea',
    label: 'Message',
    placeholder: 'Enter your message',
    value: '',
    required: true
  }
]);

const formProperties = ref<FormProperties>({
  variant: 'outlined',
  density: 'default',
  color: 'primary',
  disabled: false,
  readonly: false,
  persistentPlaceholder: false,
  validateOnBlur: true,
  validateOnInput: false,
  successMessage: 'Form submitted successfully!',
  errorMessage: 'Please correct the errors in the form.',
  messageLocation: 'bottom',
  submitButtonText: 'Submit',
  cancelButtonText: 'Reset',
  submitButtonColor: 'primary',
  cancelButtonColor: 'secondary',
  buttonVariant: 'tonal',
  blockButtons: false,
  title: 'Form Title',
  subtitle: 'Optional subtitle',
  showGoogleLogin: false,
  googleLoginText: 'Sign in with Google',
  showLinkedInLogin: false,
  linkedInLoginText: 'Sign in with LinkedIn',
  showDivider: true,
  dividerText: 'or continue with email',
  googleButtonVariant: 'outlined',
  googleButtonColor: 'default',
  googleButtonSize: 'large',
  googleButtonRounded: true,
  googleButtonElevation: 0,
  linkedInButtonVariant: 'outlined',
  linkedInButtonColor: 'default',
  linkedInButtonSize: 'large',
  linkedInButtonRounded: true,
  linkedInButtonElevation: 0
});

export { form, formValid, fieldTypes, fieldVariants, densityOptions, messageLocations, buttonVariants, colors, formFields, formProperties };
