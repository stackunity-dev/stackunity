export function calculateLuminance(srgb: { red: number, green: number, blue: number }) {
  const r = Math.min(1, Math.max(0, srgb.red));
  const g = Math.min(1, Math.max(0, srgb.green));
  const b = Math.min(1, Math.max(0, srgb.blue));

  const transform = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function calculateContrastRatio(
  srgbText: { red: number, green: number, blue: number },
  srgbBackground: { red: number, green: number, blue: number }
) {
  const luminanceText = calculateLuminance(srgbText);
  const luminanceBackground = calculateLuminance(srgbBackground);
  const brighter = Math.max(luminanceText, luminanceBackground);
  const darker = Math.min(luminanceText, luminanceBackground);
  return (brighter + 0.05) / (darker + 0.05);
}

export function hslToRgb(h: number, s: number, l: number) {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    red: Math.min(1, Math.max(0, r)),
    green: Math.min(1, Math.max(0, g)),
    blue: Math.min(1, Math.max(0, b))
  };
}

export function parseColor(color: string) {
  const trimmed = color.trim();

  const hexMatch = trimmed.match(/^#?([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r, g, b;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.substr(0, 2), 16) / 255;
      g = parseInt(hex.substr(2, 2), 16) / 255;
      b = parseInt(hex.substr(4, 2), 16) / 255;
    } else {
      return null;
    }

    return { red: r, green: g, blue: b };
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (rgbMatch) {
    return {
      red: parseInt(rgbMatch[1], 10) / 255,
      green: parseInt(rgbMatch[2], 10) / 255,
      blue: parseInt(rgbMatch[3], 10) / 255
    };
  }

  const hslMatch = trimmed.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (hslMatch) {
    return hslToRgb(
      parseInt(hslMatch[1], 10) / 360,
      parseInt(hslMatch[2], 10) / 100,
      parseInt(hslMatch[3], 10) / 100
    );
  }

  if (typeof document !== 'undefined') {
    const tempEl = document.createElement('div');
    tempEl.style.color = trimmed;
    document.body.appendChild(tempEl);
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const match = computedColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    if (match) {
      return {
        red: parseInt(match[1], 10) / 255,
        green: parseInt(match[2], 10) / 255,
        blue: parseInt(match[3], 10) / 255
      };
    }
  }

  return null;
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
}

export function getIssueSeverityIcon(severity: string): string {
  switch (severity) {
    case 'high':
      return 'mdi-alert-circle';
    case 'medium':
      return 'mdi-alert';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-help-circle';
  }
}

export function getIssueSeverityColor(severity: string): string {
  switch (severity) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'grey';
  }
}
