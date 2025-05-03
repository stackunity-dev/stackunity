✅ Étapes précises pour rendre ça fonctionnel avec Cheerio + fonctions contrastes
1. Parser le HTML avec Cheerio
ts
Copier
Modifier
const cheerio = require('cheerio');
const html = '<div style="color:#fff;background:#000">Hello</div>';
const $ = cheerio.load(html);

$('div').each((i, el) => {
  const style = $(el).attr('style');
  // extraire color / background
});
2. Extraire les couleurs depuis le style inline
Utilise une fonction pour parser la string style :

ts
Copier
Modifier
function extractColors(style: string): { color?: string, backgroundColor?: string } {
  const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
  const bgMatch = style.match(/background(-color)?\s*:\s*([^;]+)/i);
  return {
    color: colorMatch?.[1]?.trim(),
    backgroundColor: bgMatch?.[2]?.trim(),
  };
}
3. Normaliser les couleurs
Pour gérer rgb, hsl, etc., utilise une lib comme chroma-js :

ts
Copier
Modifier
const chroma = require('chroma-js');

function normalizeColor(input: string): string | null {
  try {
    return chroma(input).hex(); // ex: "#FFFFFF"
  } catch {
    return null;
  }
}
4. Calculer le contraste
ts
Copier
Modifier
function getContrastRatio(fg: string, bg: string): number {
  return chroma.contrast(fg, bg); // retourne un float (ex: 4.8)
}
5. Simuler le daltonisme
Utilise la lib color-blind

ts
Copier
Modifier
const colorBlind = require('color-blind');

function simulateBlindness(hexColor: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia') {
  return colorBlind[type](hexColor); // retourne un nouveau hex
}
6. Assembler tout ça
ts
Copier
Modifier
$('div').each((i, el) => {
  const style = $(el).attr('style');
  if (!style) return;

  const { color, backgroundColor } = extractColors(style);
  const fg = normalizeColor(color);
  const bg = normalizeColor(backgroundColor);

  if (!fg || !bg) return;

  const ratio = getContrastRatio(fg, bg);

  const protanopiaFg = simulateBlindness(fg, 'protanopia');
  const protanopiaBg = simulateBlindness(bg, 'protanopia');
  const simulatedRatio = getContrastRatio(protanopiaFg, protanopiaBg);

  console.log({
    fg, bg, ratio,
    protanopia: { fg: protanopiaFg, bg: protanopiaBg, ratio: simulatedRatio }
  });
});