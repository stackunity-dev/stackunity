export interface AnimationPreset {
  name: string;
  icon: string;
  class: string;
  cssCode: string;
}

export interface TransformValue {
  value: string;
  label: string;
}

export interface TimingValue {
  value: string;
  label: string;
}

export const transformValues: TransformValue[] = [
  { value: 'none', label: 'No transformation' },
  { value: 'translateX(-50px)', label: 'Slide left' },
  { value: 'translateX(50px)', label: 'Slide right' },
  { value: 'translateY(-50px)', label: 'Slide up' },
  { value: 'translateY(50px)', label: 'Slide down' },
  { value: 'scale(0)', label: 'Scale to 0' },
  { value: 'scale(1.5)', label: 'Scale to 150%' },
  { value: 'rotate(0deg)', label: 'Rotate 0°' },
  { value: 'rotate(360deg)', label: 'Rotate 360°' },
  { value: 'skewX(20deg)', label: 'Skew X 20°' },
  { value: 'skewY(20deg)', label: 'Skew Y 20°' }
];

export const timingFunctions: TimingValue[] = [
  { value: 'ease', label: 'Ease (default)' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
  { value: 'linear', label: 'Linear (regular)' },
  { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', label: 'Custom bounce' }
];

export const transitionProperties = [
  { value: 'background-color', label: 'Background color' },
  { value: 'color', label: 'Text color' },
  { value: 'opacity', label: 'Opacity' },
  { value: 'transform', label: 'Transformation' },
  { value: 'width', label: 'Width' },
  { value: 'height', label: 'Height' },
  { value: 'all', label: 'All properties' }
];

export function generateAnimationCSS(
  name: string,
  duration: string,
  timingFunction: string,
  fromOpacity: string,
  fromTransform: string,
  toOpacity: string,
  toTransform: string,
  iterationCount: string = ''
): string {
  return `.${name} {
  animation: ${name} ${duration} ${timingFunction} ${iterationCount};
}

@keyframes ${name} {
  from {
    opacity: ${fromOpacity};
    transform: ${fromTransform};
  }
  to {
    opacity: ${toOpacity};
    transform: ${toTransform};
  }
}`;
}

export function generateTransitionCSS(
  property: string,
  duration: string,
  timingFunction: string,
  delay: string
): string {
  let hoverCSS = '';

  switch (property) {
    case 'background-color':
      hoverCSS = 'background-color: #ff5722;';
      break;
    case 'color':
      hoverCSS = 'color: #ff5722;';
      break;
    case 'opacity':
      hoverCSS = 'opacity: 0.5;';
      break;
    case 'transform':
      hoverCSS = 'transform: scale(1.2) rotate(10deg);';
      break;
    case 'width':
      hoverCSS = 'width: 150px;';
      break;
    case 'height':
      hoverCSS = 'height: 150px;';
      break;
    case 'all':
      hoverCSS = 'background-color: #ff5722;\n  transform: scale(1.2);\n  border-radius: 50%;';
      break;
    default:
      hoverCSS = '';
  }

  return `.element {
  transition: ${property} ${duration} ${timingFunction} ${delay};
}

/* Hover state */
.element:hover {
  ${hoverCSS}
}`;
}

export function getTransitionHoverStyles(property: string): Record<string, string> {
  switch (property) {
    case 'background-color':
      return { backgroundColor: '#ff5722' };
    case 'color':
      return { color: '#ff5722' };
    case 'opacity':
      return { opacity: '0.5' };
    case 'transform':
      return { transform: 'scale(1.2) rotate(10deg)' };
    case 'width':
      return { width: '150px' };
    case 'height':
      return { height: '150px' };
    case 'all':
      return {
        backgroundColor: '#ff5722',
        transform: 'scale(1.2)',
        borderRadius: '50%'
      };
    default:
      return {};
  }
} 