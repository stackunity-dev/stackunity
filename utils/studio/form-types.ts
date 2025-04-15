export interface FormField {
  type: string;
  label: string;
  placeholder: string;
  value: any;
  options?: string;
  required: boolean;
  icon?: string;
  counter?: boolean;
}

export type FormVariant = 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled';
export type FormDensity = 'default' | 'comfortable' | 'compact';
export type MessageLocation = 'bottom' | 'top';
export type ButtonVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
export type ColorValue = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';

export interface FormProperties {
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
