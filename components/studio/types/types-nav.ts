import { ref } from "vue";
import icons from "../../../utils/icons";

interface AppBar {
  title: string;
  icon: string;
}
interface NavItem {
  icon: string;
  title: string;
}

interface NavHeader {
  title: string;
}

const navItems = ref<NavItem[]>([]);
const navHeader = ref<NavHeader[]>([]);
const appBar = ref<AppBar[]>([]);
const navIcons = ref(icons);

const appBarColors = ([
  { value: 'default', color: 'default' },
  { value: 'primary', color: 'primary' },
  { value: 'secondary', color: 'secondary' },
  { value: 'success', color: 'success' },
  { value: 'info', color: 'info' },
  { value: 'warning', color: 'warning' },
  { value: 'error', color: 'error' }
]);

const colors = [
  'default',
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error'
];

const navProperties = ref({
  model: true,
  addAppBar: false,
  appBarColor: 1,
  permanent: false,
  expandOnHover: false,
  location: 'left' as 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end',
  width: 256,
  color: 'default',
  elevation: 4,
  rounded: false,
  floating: false,
  rail: false,
  clipped: false,
  mobile: false,
  temporary: false,
  image: '',
  showSubheader: false,
  subheaderText: '',
  showIconItems: false,
  showLinkItem: false,
  linkIcon: '',
  linkTitle: '',
  linkUrl: '',
  linkExternal: false,
  transition: 'fade',
  transitionDuration: 250
});

export { navItems, navHeader, appBar, navIcons, appBarColors, colors, navProperties };
