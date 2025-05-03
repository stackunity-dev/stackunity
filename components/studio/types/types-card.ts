import { computed, reactive, ref } from 'vue';
import { useTranslations } from '../../../languages';
import { AriaProps, AriaRoleType, createAriaProps } from './types-aria';

const t = useTranslations('studioCardTemplates')();

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

const cardProperties = computed(() => reactive({
  title: t.cardProperties.title,
  subtitle: t.cardProperties.subtitle,
  text: t.cardProperties.text,
  image: t.cardProperties.image,
  icon: t.cardProperties.icon,
  elevation: t.cardProperties.elevation,
  padding: t.cardProperties.padding,
  rounded: t.cardProperties.rounded,
  loading: t.cardProperties.loading,
  disabled: t.cardProperties.disabled,
  hoverEffect: t.cardProperties.hoverEffect,
  showButtons: t.cardProperties.showButtons,
  buttonText: t.cardProperties.buttonText,
  buttonWidth: t.cardProperties.buttonWidth,
  buttonLink: t.cardProperties.buttonLink,
  buttonPosition: t.cardProperties.buttonPosition,
  buttonIcon: t.cardProperties.buttonIcon,
  showProgress: t.cardProperties.showProgress,
  progressValue: t.cardProperties.progressValue,
  indeterminate: t.cardProperties.indeterminate,
  progressWidth: t.cardProperties.progressWidth,
  progressPosition: t.cardProperties.progressPosition,
  showProgressLabel: t.cardProperties.showProgressLabel,
  progressLabelStyle: t.cardProperties.progressLabelStyle,
  progressLabelText: t.cardProperties.progressLabelText,
  showProgressBg: t.cardProperties.showProgressBg,
  showTimeline: t.cardProperties.showTimeline,
  showSparkline: t.cardProperties.showSparkline,
  sparklineData: t.cardProperties.sparklineData,
  sparklineColor: t.cardProperties.sparklineColor,
  sparklineGradient: t.cardProperties.sparklineGradient,
  sparklineLineWidth: t.cardProperties.sparklineLineWidth,
  sparklineShowLabels: t.cardProperties.sparklineShowLabels,
  sparklineLabels: t.cardProperties.sparklineLabels,
  ariaLabel: t.cardProperties.ariaLabel,
  ariaLabelledBy: t.cardProperties.ariaLabelledBy,
  ariaRole: t.cardProperties.ariaRole,
  ariaDescribedBy: t.cardProperties.ariaDescribedBy,
  ariaControls: t.cardProperties.ariaControls,
}))

const progressBgColorIndex = ref(0)
const progressBgColor = computed((): CardColor => cardColors[progressBgColorIndex.value].value)
const sparklineColorIndex = ref(1)
const sparklineColor = computed((): CardColor => cardColors[sparklineColorIndex.value].value)
const sparklineDataText = computed(() => cardProperties.value.sparklineData.join(','))
const sparklineLabelsText = computed(() => cardProperties.value.sparklineLabels.join(','))

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

export { buttonColor, buttonColorIndex, buttonVariant, buttonVariantIndex, buttonVariants, cardColor, cardColorIndex, cardColors, CardElement, cardElements, cardProperties, cardVariant, cardVariantIndex, cardVariants, iconColor, iconColorIndex, progressBgColor, progressBgColorIndex, progressColor, progressColorIndex, progressPositions, progressSize, progressSizeIndex, progressSizes, roundedIndexToValue, roundedLabels, roundedValueToIndex, sparklineColor, sparklineColorIndex, sparklineDataText, sparklineLabelsText };

