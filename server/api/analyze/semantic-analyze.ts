import { load } from 'cheerio'
import { createError, defineEventHandler, readBody } from 'h3'
import fetch from 'node-fetch'
import {
  analyzeSemanticStructure
} from './semantic-analyzer'
import {
  analyzeAriaAttributes,
  analyzeMetaTags
} from './website-analyzer'


function analyzeHtmlStructure($: ReturnType<typeof load>): {
  totalElements: number;
  semanticElements: number;
  divCount: number;
  semanticRatio: number;
  topElements: Record<string, number>;
  tree: Array<any>;
  flatTree: Array<{ tag: string, children: number, depth: number }>;
} {
  const totalElements = $('*').length;

  const semanticElements = $('header, main, footer, article, section, nav, aside, figure, figcaption').length;

  const divCount = $('div').length;

  const semanticRatio = semanticElements / totalElements;

  const elementCounts: Record<string, number> = {};
  $('*').each(function () {
    const tagName = $(this).prop('tagName')?.toLowerCase() || '';
    elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
  });

  const topElements: Record<string, number> = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<string, number>);

  const buildTree = (element: any, depth: number): any => {
    const $element = $(element);
    const children = $element.children().toArray().map(child => buildTree(child, depth + 1));

    return {
      tag: $element.prop('tagName')?.toLowerCase() || '',
      id: $element.attr('id') || undefined,
      class: $element.attr('class') || undefined,
      childCount: children.length,
      depth: depth,
      children: children
    };
  };

  const rootElements = $('html').toArray();
  const tree = rootElements.map(element => buildTree(element, 0));

  const flatTree: Array<{ tag: string, children: number, depth: number }> = [];

  const flattenTree = (node: any) => {
    flatTree.push({
      tag: node.tag,
      children: node.childCount,
      depth: node.depth
    });

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => flattenTree(child));
    }
  };

  tree.forEach(node => flattenTree(node));

  return {
    totalElements,
    semanticElements,
    divCount,
    semanticRatio,
    topElements,
    tree,
    flatTree
  };
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const url = body.url as string;
    const type = body.type as string || 'semantic';

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required',
      })
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DevroidBot/1.0; +https://devroid.app)'
        }
      })

      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          statusMessage: `Failed to fetch URL: ${response.statusText}`,
        })
      }

      const html = await response.text()
      const $ = load(html)

      switch (type) {
        case 'semantic':
          return analyzeSemanticStructure($)
        case 'meta':
          return analyzeMetaTags($, url)
        case 'aria':
          return analyzeAriaAttributes($)
        case 'structure':
          return analyzeHtmlStructure($)
        case 'all':
          return {
            semantic: analyzeSemanticStructure($),
            meta: analyzeMetaTags($, url),
            aria: analyzeAriaAttributes($),
            structure: analyzeHtmlStructure($)
          }
        default:
          return analyzeSemanticStructure($)
      }
    } catch (error: any) {
      console.error(`Error analyzing ${url}:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: `Error analyzing URL: ${error.message}`,
      })
    }
  } catch (error: any) {
    console.error('Authentication error:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}) 