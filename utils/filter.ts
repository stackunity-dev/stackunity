import { computed, ref } from "vue";

export const selectedVisionType = ref('normal');
export const filterIntensity = ref(70);

export const visionTypes = [
  {
    title: 'Normal vision',
    value: 'normal',
    icon: 'mdi-eye'
  },
  {
    title: 'Protanopia (Red-Green)',
    value: 'protanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Deuteranopia (Red-Green)',
    value: 'deuteranopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Tritanopia (Blue-Yellow)',
    value: 'tritanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Achromatopsia (B&W)',
    value: 'achromatopsia',
    icon: 'mdi-eye-off'
  },
  {
    title: 'Blur',
    value: 'blur',
    icon: 'mdi-blur'
  }
];

export const visionTypeIcon = computed(() => {
  const type = visionTypes.find(t => t.value === selectedVisionType.value);
  return type ? type.icon : 'mdi-eye';
});

export const filterStyle = computed(() => {
  const intensity = filterIntensity.value / 100;

  switch (selectedVisionType.value) {
    case 'protanopia': {
      const matrix = [
        0.367 + (1 - 0.367) * (1 - intensity), 0.633 * intensity, 0, 0, 0,
        0.333 * intensity, 0.667 + (1 - 0.667) * (1 - intensity), 0, 0, 0,
        0, 0.121 * intensity, 0.879 + (1 - 0.879) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1.1) contrast(0.95) saturate(0.9) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'deuteranopia': {
      const matrix = [
        0.625 + (1 - 0.625) * (1 - intensity), 0.375 * intensity, 0, 0, 0,
        0.7 * intensity, 0.3 + (1 - 0.3) * (1 - intensity), 0, 0, 0,
        0, 0.3 * intensity, 0.7 + (1 - 0.7) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1.05) contrast(0.97) saturate(0.95) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'tritanopia': {
      const matrix = [
        0.95 + (1 - 0.95) * (1 - intensity), 0.05 * intensity, 0, 0, 0,
        0, 0.433 + (1 - 0.433) * (1 - intensity), 0.567 * intensity, 0, 0,
        0, 0.475 * intensity, 0.525 + (1 - 0.525) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1) contrast(1.1) saturate(0.8) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'achromatopsia':
      return {
        filter: `grayscale(${intensity * 100}%)`
      };
    case 'blur':
      return {
        filter: `blur(${intensity * 3}px)`
      };
    default:
      return {};
  }
});

export const applyVisionFilter = () => {
};