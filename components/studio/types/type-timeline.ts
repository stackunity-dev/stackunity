import { computed, ref } from 'vue';
import icons from '../../../utils/icons';

interface TimelineItem {
  title: string;
  text: string;
  icon: string;
  color: string;
  time: string;
  hideOpposite: boolean;
}

const timelineIcons = ref(icons)

const colors = [
  'default',
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error'
];

const cardVariants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const;
type CardVariant = typeof cardVariants[number];
const cardVariantIndex = ref(0);
const cardVariant = computed((): CardVariant => cardVariants[cardVariantIndex.value]);

const transitions = [
  'fade',
  'slide-x-transition',
  'slide-y-transition',
  'scale-transition',
  'scroll-x-transition',
  'scroll-y-transition'
];

type TimelineAlign = 'start' | 'center' | 'end';
type TimelineDirection = 'vertical' | 'horizontal';
type TimelineSide = 'start' | 'end' | undefined;
type TitleStyle = 'regular' | 'bold' | 'italic' | 'uppercase';
type PaddingClass = 'pa-0' | 'pa-2' | 'pa-4' | 'pa-6' | 'pa-8' | 'pa-10';
type BorderRadiusClass = 'rounded-0' | 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-pill';

const timelineProperties = ref({
  align: 'center' as TimelineAlign,
  direction: 'vertical' as TimelineDirection,
  side: 'end' as TimelineSide,
  dense: false,
  lineColor: 'primary',
  lineWidth: 2,
  dotSize: 36,
  reverse: false,
  truncateLine: false,
  rounded: true,
  showCards: true,
  cardElevation: 2,
  cardColor: 'default',
  cardPadding: 'pa-4' as PaddingClass,
  cardBorderRadius: 'rounded' as BorderRadiusClass,
  cardHoverEffect: false,
  separateHeader: false,
  titleStyle: 'regular' as TitleStyle,
  animated: false,
  transition: 'fade',
  transitionDuration: 300
});

const timelineItems = ref<TimelineItem[]>([
  {
    title: 'First milestone',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: 'mdi-star',
    color: 'primary',
    time: 'January 2023',
    hideOpposite: false
  },
  {
    title: 'Second milestone',
    text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    icon: 'mdi-check',
    color: 'success',
    time: 'March 2023',
    hideOpposite: false
  },
  {
    title: 'Third milestone',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    icon: 'mdi-alert',
    color: 'warning',
    time: 'June 2023',
    hideOpposite: false
  }
]);

export { timelineIcons, colors, timelineProperties, timelineItems, cardVariants, cardVariant, transitions, cardVariantIndex };
