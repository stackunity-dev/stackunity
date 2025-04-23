import { AriaProps, AriaRoleType, createAriaProps } from './types-aria';
import { ref, computed } from 'vue';

interface CardElement {
  id: string;
  name: string;
  description: string;
  icon: string;
  ariaRole: AriaRoleType | null;
  ariaProps: AriaProps;
  recommendedRoles: string[];
}

type CardVariant = typeof cardVariants[number]
type CardColor = typeof cardColors[number]['value']
type ButtonVariant = typeof buttonVariants[number]
type ProgressSize = typeof progressSizes[number]
type RoundedSize = typeof roundedLabels[number]

const cardVariants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const
const cardColors = [
  { text: 'Default', value: 'default' },
  { text: 'Primary', value: 'primary' },
  { text: 'Secondary', value: 'secondary' },
  { text: 'Success', value: 'success' },
  { text: 'Info', value: 'info' },
  { text: 'Warning', value: 'warning' },
  { text: 'Error', value: 'error' }
] as const

const buttonVariants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const
const progressSizes = ['x-small', 'small', 'default', 'large', 'x-large'] as const
const roundedLabels = ['sm', 'md', 'lg', 'xl', 'pill'] as const

const iconColorIndex = ref(5)
const cardVariantIndex = ref(0)
const cardColorIndex = ref(0)
const buttonColorIndex = ref(5)
const buttonVariantIndex = ref(2)
const progressSizeIndex = ref(2)
const progressColorIndex = ref(1)

const cardVariant = computed((): CardVariant => cardVariants[cardVariantIndex.value])
const cardColor = computed((): CardColor => cardColors[cardColorIndex.value].value)
const buttonVariant = computed((): ButtonVariant => buttonVariants[buttonVariantIndex.value])
const buttonColor = computed((): CardColor => cardColors[buttonColorIndex.value].value)
const progressColor = computed((): CardColor => cardColors[progressColorIndex.value].value)
const progressSize = computed((): ProgressSize => progressSizes[progressSizeIndex.value])
const iconColor = computed((): CardColor => cardColors[iconColorIndex.value].value)

const cardProperties = ref({
  title: 'Premium features',
  subtitle: 'Unlock all UI components with a premium plan',
  text: 'Lifetime access to all premium features and updates for only 300€ one time payment',
  image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  icon: 'mdi-crown',
  elevation: 2,
  padding: 8,
  rounded: 'md' as RoundedSize,
  loading: false,
  disabled: false,
  hoverEffect: false,
  showButtons: true,
  buttonText: 'Checkout',
  buttonWidth: 0,
  buttonLink: '/checkout',
  buttonPosition: 'start',
  buttonIcon: 'mdi-cart-outline',
  showProgress: false,
  progressValue: 75,
  indeterminate: false,
  progressWidth: 6,
  progressPosition: 'inline',
  showProgressLabel: false,
  progressLabelStyle: 'value',
  progressLabelText: '',
  showProgressBg: false,
  showTimeline: false,
  showSparkline: false,
  sparklineData: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
  sparklineColor: 'primary',
  sparklineGradient: false,
  sparklineLineWidth: 2,
  sparklineShowLabels: false,
  sparklineLabels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
  ariaLabel: 'Card with a title, subtitle, text, image, sparkline, timeline, buttons, and progress',
  ariaLabelledBy: 'card-title, card-subtitle, card-text, card-image, card-sparkline, card-timeline, card-buttons, card-progress',
  ariaRole: 'region',
  ariaDescribedBy: 'card-description',
  ariaControls: 'card-actions',
})

const progressBgColorIndex = ref(0)
const progressBgColor = computed((): CardColor => cardColors[progressBgColorIndex.value].value)
const sparklineColorIndex = ref(1)
const sparklineColor = computed((): CardColor => cardColors[sparklineColorIndex.value].value)
const sparklineDataText = ref(cardProperties.value.sparklineData.join(','))
const sparklineLabelsText = ref(cardProperties.value.sparklineLabels.join(','))

const roundedIndexToValue = (index: number): RoundedSize => roundedLabels[index]
const roundedValueToIndex = (value: RoundedSize): number => roundedLabels.indexOf(value)

const progressPositions = [
  'inline',
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'absolute'
]

const cardElements = ref<CardElement[]>([
  {
    id: 'card',
    name: 'Card (main container)',
    description: 'The main container of the card',
    icon: 'mdi-card-outline',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['region', 'article', 'group', 'figure', 'presentation', 'none']
  },
  {
    id: 'button',
    name: 'Action button',
    description: 'The main button of the card',
    icon: 'mdi-button-cursor',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['button', 'link', 'menuitem', 'switch']
  },
  {
    id: 'image',
    name: 'Image',
    description: 'The image of the card',
    icon: 'mdi-image',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['img', 'presentation', 'none']
  },
  {
    id: 'title',
    name: 'Title',
    description: 'The title of the card',
    icon: 'mdi-format-title',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['heading', 'text', 'presentation', 'none']
  },
  {
    id: 'progress',
    name: 'Progress indicator',
    description: 'The circular progress indicator',
    icon: 'mdi-progress-clock',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['progressbar', 'status', 'timer']
  },
  {
    id: 'sparkline',
    name: 'Graph (sparkline)',
    description: 'The data graph',
    icon: 'mdi-chart-line',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['img', 'figure', 'graphics-document', 'presentation']
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'The timeline of activities',
    icon: 'mdi-timeline',
    ariaRole: null,
    ariaProps: createAriaProps(),
    recommendedRoles: ['list', 'feed', 'log', 'marquee']
  }
]);

export { CardElement, cardVariants, cardColors, buttonVariants, progressSizes, roundedLabels, iconColorIndex, cardVariantIndex, cardColorIndex, buttonColorIndex, buttonVariantIndex, progressSizeIndex, progressColorIndex, cardVariant, cardColor, buttonVariant, buttonColor, progressColor, progressSize, iconColor, cardProperties, progressBgColorIndex, progressBgColor, sparklineColorIndex, sparklineColor, sparklineDataText, sparklineLabelsText, progressPositions, roundedIndexToValue, roundedValueToIndex, cardElements };
