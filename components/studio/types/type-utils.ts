import { computed, ref } from 'vue';

const componentTypes = [
  { text: 'Button', value: 'button' },
  { text: 'Badge', value: 'badge' },
  { text: 'Alert', value: 'alert' },
  { text: 'Chip', value: 'chip' },
  { text: 'Date Picker', value: 'date' },
  { text: 'Data Table', value: 'table' },
  { text: 'Chart', value: 'chart' },
  { text: 'File Upload', value: 'file' },
];

const selectedType = ref('button');

type Variant = 'text' | 'outlined' | 'plain' | 'elevated' | 'tonal' | 'flat';
type Size = 'x-small' | 'small' | 'default' | 'large' | 'x-large';
type Position = 'top start' | 'top end' | 'bottom start' | 'bottom end';
type AlertType = 'success' | 'info' | 'warning' | 'error';

const variants: Variant[] = ['text', 'outlined', 'plain', 'elevated', 'tonal', 'flat'];
const sizes: Size[] = ['x-small', 'small', 'default', 'large', 'x-large'];
const positions: Position[] = ['top start', 'top end', 'bottom start', 'bottom end'];

const gradients = [
  'to top right',
  'to right',
  'to bottom right',
  'to bottom',
  'to bottom left',
  'to left',
  'to top left',
  'to top'
];

const eventTypes = [
  'click',
  'change',
  'input',
  'focus',
  'blur',
  'mouseenter',
  'mouseleave',
  'submit'
];

const transitions = [
  'none',
  'fade',
  'slide-x',
  'slide-y',
  'scale',
  'scroll-x',
  'scroll-y'
];

const buttonTypes = [
  'button',
  'submit',
  'reset'
];

const colors = [
  { text: 'Default', value: 'default' },
  { text: 'Primary', value: 'primary' },
  { text: 'Secondary', value: 'secondary' },
  { text: 'Success', value: 'success' },
  { text: 'Info', value: 'info' },
  { text: 'Warning', value: 'warning' },
  { text: 'Error', value: 'error' }
] as const;

type ColorValue = typeof colors[number]['value'];

const properties = ref({
  variant: 'elevated' as Variant,
  size: 'default' as Size,
  color: 'primary' as ColorValue,
  text: '',
  icon: '',
  description: '',
  position: 'top end' as Position,
  rounded: false,
  block: false,
  disabled: false,
  loading: false,
  href: '',
  target: '_self',
  elevation: 0,
  gradient: '',
  date: ref([]),
  landscape: false,
  multiple: false,
  fullWidth: false,
  showWeek: false,
  title: '',
  showAdjacentMonths: true,
  eventType: 'click',
  eventHandler: '',
  stopPropagation: false,
  preventDefault: false,
  transition: 'none',
  transitionDuration: 300,
  ripple: true,
  eager: false,
  closeOnContentClick: false,
  closeOnBack: false,
  buttonType: 'button',
  formAction: '',

  tableHeaders: [
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: 'Status', key: 'status', sortable: false }
  ],
  tableItems: [
    { name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { name: 'Jack Smith', email: 'jack@example.com', status: 'Pending' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' }
  ] as Record<string, string>[],
  itemsPerPage: 5,
  sortBy: 'name',
  sortOrder: 'asc' as 'asc' | 'desc',
  showSelect: false,
  showFooter: true,
  dense: false,

  chartType: 'bar',
  chartData: [12, 19, 3, 5, 2, 3],
  chartLabels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  showLegend: true,
  responsive: true,
  maintainAspectRatio: true,

  acceptTypes: 'image/*',
  maxFiles: 5,
  maxSize: 2,
  dropzoneText: 'Drop files here or click to upload',
  showPreview: true,
  autoUpload: true,
  chips: true,
  counter: true,
  validateOnSelect: true,
  returnObject: false,
});

const showIconField = computed(() => ['button', 'badge', 'alert', 'chip'].includes(selectedType.value));
const showPosition = computed(() => selectedType.value === 'badge');
const showDescription = computed(() => selectedType.value === 'alert');

const chartData = computed(() => {
  const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  return {
    labels: properties.value.chartLabels,
    datasets: [{
      label: 'Dataset',
      data: properties.value.chartData,
      backgroundColor: chartColors,
      borderColor: properties.value.chartType === 'line' ? '#36A2EB' : chartColors,
      borderWidth: 1
    }]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: properties.value.responsive,
    maintainAspectRatio: properties.value.maintainAspectRatio,
    plugins: {
      legend: {
        display: properties.value.showLegend
      }
    }
  };
});

export { componentTypes, selectedType, variants, sizes, positions, gradients, eventTypes, transitions, buttonTypes, colors, properties, showIconField, showPosition, showDescription, chartData, chartOptions, AlertType };
