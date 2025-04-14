import { CheerioSelector } from './analyzer-types';

export function analyzeSemanticStructure($: CheerioSelector): {
  score: number;
  issues: Array<{ element: string; issue: string; suggestion: string }>;
  structure: {
    hasHeader: boolean;
    hasMain: boolean;
    hasFooter: boolean;
    hasNav: boolean;
    hasArticle: boolean;
    hasSection: boolean;
    hasAside: boolean;
    hasFigure: boolean;
    validH1Usage: boolean;
    validHeadingStructure: boolean;
  };
  headingStructure: Array<{ level: number; text: string; order: number }>;
  readabilityAnalysis: {
    score: number;
    grade: string;
    wordCount: number;
    sentenceCount: number;
    complexWordCount: number;
    paragraphCount: number;
    averageSentenceLength: number;
    averageWordLength: number;
    suggestion: string;
  };
} {
  const issues: Array<{ element: string; issue: string; suggestion: string }> = [];

  const hasHeader = $('header').length > 0;
  const hasMain = $('main').length > 0;
  const hasFooter = $('footer').length > 0;
  const hasNav = $('nav').length > 0;
  const hasArticle = $('article').length > 0;
  const hasSection = $('section').length > 0;
  const hasAside = $('aside').length > 0;
  const hasFigure = $('figure').length > 0;

  if (!hasHeader) {
    issues.push({
      element: '<header>',
      issue: 'Missing headers',
      suggestion: 'Add a <header> element to contain the main header of the page'
    });
  }

  if (!hasMain) {
    issues.push({
      element: '<main>',
      issue: 'Missing main',
      suggestion: 'Add a <main> element to contain the main content of the page'
    });
  }

  if (!hasFooter) {
    issues.push({
      element: '<footer>',
      issue: 'Missing footer',
      suggestion: 'Add a <footer> element to contain the footer information'
    });
  }

  if (!hasNav && $('ul li a, ol li a').length > 5) {
    issues.push({
      element: '<nav>',
      issue: 'Missing nav',
      suggestion: 'Encapsulate the navigation lists in a <nav> element'
    });
  }

  const headings: Array<{ level: number; text: string; order: number }> = [];
  let headingOrder = 0;

  for (let i = 1; i <= 6; i++) {
    $(`h${i}`).each((index, el) => {
      headings.push({
        level: i,
        text: $(el).text().trim(),
        order: headingOrder++
      });
    });
  }

  const h1Count = $('h1').length;
  const validH1Usage = h1Count === 1;

  if (h1Count === 0) {
    issues.push({
      element: '<h1>',
      issue: 'Missing h1',
      suggestion: 'Add a unique <h1> element containing the main title of the page'
    });
  } else if (h1Count > 1) {
    issues.push({
      element: '<h1>',
      issue: 'Multiple h1 elements found',
      suggestion: 'Limit the use of h1 to a single element per page for the title hierarchy'
    });
  }

  let validHeadingStructure = true;
  let lastLevel = 0;

  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];

    if (i === 0 && current.level !== 1) {
      validHeadingStructure = false;
      issues.push({
        element: `<h${current.level}>`,
        issue: 'The first title is not an h1',
        suggestion: 'Start the title hierarchy with an <h1> element'
      });
    } else if (i > 0) {
      if (current.level > lastLevel + 1) {
        validHeadingStructure = false;
        issues.push({
          element: `<h${current.level}>`,
          issue: `Title level jump in the title hierarchy (from h${lastLevel} to h${current.level})`,
          suggestion: `Use a level h${lastLevel + 1} before using h${current.level}`
        });
      }
    }

    lastLevel = current.level;
  }

  const divCount = $('div').length;
  const semanticElements = $('header, main, footer, section, article, aside, nav').length;

  if (divCount > semanticElements * 5 && semanticElements < 5) {
    issues.push({
      element: '<div>',
      issue: 'Excessive use of divs instead of semantic elements',
      suggestion: 'Replace divs with appropriate semantic elements (section, article, etc.) when possible'
    });
  }

  if ($('ul, ol').find('li:empty').length > 0) {
    issues.push({
      element: '<li>',
      issue: 'Empty list items',
      suggestion: 'Remove or fill empty list items'
    });
  }

  if ($('table').length > 0 && $('table th').length === 0) {
    issues.push({
      element: '<table>',
      issue: 'Table used without headers',
      suggestion: 'Add <th> headers to tables or use CSS for layout instead of tables'
    });
  }

  const text = $('p, h1, h2, h3, h4, h5, h6, li, td, caption, figcaption').text().trim();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+\s/g).filter(sentence => sentence.length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const paragraphs = $('p').length;
  const paragraphCount = Math.max(1, paragraphs);

  const complexWords = words.filter(word => {
    const syllables = countSyllables(word);
    return syllables >= 3;
  });
  const complexWordCount = complexWords.length;

  const averageSentenceLength = wordCount / sentenceCount;
  const averageWordLength = words.join('').length / wordCount;
  const readabilityScore = calculateReadabilityScore(text);

  let grade = '';
  let readabilitySuggestion = '';

  if (readabilityScore > 90) {
    grade = 'Very easy to read (primary level)';
    readabilitySuggestion = 'The text is very accessible, suitable for a wide audience.';
  } else if (readabilityScore > 80) {
    grade = 'Easy to read (college level)';
    readabilitySuggestion = 'The text is well adapted to the general public.';
  } else if (readabilityScore > 70) {
    grade = 'Easy to read (high school level)';
    readabilitySuggestion = 'The text is accessible to most adult readers.';
  } else if (readabilityScore > 60) {
    grade = 'Standard (baccalaureate level)';
    readabilitySuggestion = 'Consider simplifying some long phrases to improve readability.';
  } else if (readabilityScore > 50) {
    grade = 'Difficult (license level)';
    readabilitySuggestion = 'Shorten phrases and simplify vocabulary to reach a wider audience.';
  } else if (readabilityScore > 30) {
    grade = 'Difficult (master or specialist level)';
    readabilitySuggestion = 'The text is complex. Divide long phrases and replace technical terms.';
  } else {
    grade = 'Very difficult (expert level)';
    readabilitySuggestion = 'The text is very complex. Rewrite to significantly improve readability.';
  }

  if (complexWordCount / wordCount > 0.2) {
    readabilitySuggestion += ' Replace some complex words with simpler synonyms.';
  }

  if (averageSentenceLength > 25) {
    readabilitySuggestion += ' The sentences are too long (average: ' +
      averageSentenceLength.toFixed(1) + ' words). Aim for 15-20 words per sentence.';
  }

  let structureScore = 100;

  structureScore -= issues.length * 5;

  structureScore += (hasHeader ? 5 : 0) +
    (hasMain ? 5 : 0) +
    (hasFooter ? 5 : 0) +
    (hasNav ? 5 : 0) +
    (hasArticle || hasSection ? 5 : 0);

  structureScore -= (!validH1Usage ? 15 : 0) +
    (!validHeadingStructure ? 10 : 0);

  structureScore = Math.max(0, Math.min(100, structureScore));

  return {
    score: structureScore,
    issues,
    structure: {
      hasHeader,
      hasMain,
      hasFooter,
      hasNav,
      hasArticle,
      hasSection,
      hasAside,
      hasFigure,
      validH1Usage,
      validHeadingStructure
    },
    headingStructure: headings,
    readabilityAnalysis: {
      score: readabilityScore,
      grade,
      wordCount,
      sentenceCount,
      complexWordCount,
      paragraphCount,
      averageSentenceLength,
      averageWordLength,
      suggestion: readabilitySuggestion
    }
  };
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = countSyllables(text);

  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function countSyllables(text: string): number {
  return text.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[^aeiouy]+/g, ' ')
    .trim()
    .split(' ')
    .length;
} 