import axios from 'axios';
import * as cheerio from 'cheerio';
import { analyzeSitePerformance, calculateAveragePerformanceScore, getOptimizationTips, OptimizationTip, PerformanceMetrics } from './performance';

export interface PerformanceData {
  url: string;
  urlsAnalyzed: string[];
  performanceResults: PerformanceMetrics[];
  averageScore: number;
  optimizationTips: OptimizationTip[];
}

export const analyzeWebsitePerformance = async (mainUrl: string, maxUrls: number = 5): Promise<PerformanceData> => {
  try {
    const urlsToCrawl = await discoverWebsiteUrls(mainUrl, maxUrls);

    const performanceResults: PerformanceMetrics[] = [];
    for (const url of urlsToCrawl) {
      const result = await analyzeSitePerformance(url);
      performanceResults.push(result);
    }

    const averageScore = calculateAveragePerformanceScore(performanceResults);

    const mainPageResult = performanceResults.find(r => r.url === mainUrl) || performanceResults[0];
    const optimizationTips = getOptimizationTips(mainPageResult);

    return {
      url: mainUrl,
      urlsAnalyzed: urlsToCrawl,
      performanceResults,
      averageScore,
      optimizationTips
    };
  } catch (error) {
    console.error('Error analyzing website performance:', error);
    throw error;
  }
};

export const discoverWebsiteUrls = async (startUrl: string, maxUrls: number): Promise<string[]> => {
  try {
    const normalizedStartUrl = normalizeUrl(startUrl);

    const urlObj = new URL(normalizedStartUrl);
    const baseDomain = urlObj.hostname;

    const discoveredUrls = new Set<string>([normalizedStartUrl]);
    const visitedUrls = new Set<string>();
    const urlQueue: string[] = [normalizedStartUrl];

    const maxIterations = Math.min(maxUrls * 2, 20);
    let iterations = 0;

    while (urlQueue.length > 0 && discoveredUrls.size < maxUrls && iterations < maxIterations) {
      const currentUrl = urlQueue.shift()!;

      visitedUrls.add(currentUrl);

      try {
        const response = await axios.get(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const $ = cheerio.load(response.data);

        $('a[href]').each((_, el) => {
          const href = $(el).attr('href');
          if (!href) return;

          try {
            const resolvedUrl = new URL(href, currentUrl).href;
            const normalizedUrl = normalizeUrl(resolvedUrl);

            // Vérifier si l'URL appartient au même domaine et n'est pas déjà traitée
            const urlObj = new URL(normalizedUrl);
            if (
              urlObj.hostname === baseDomain &&
              !visitedUrls.has(normalizedUrl) &&
              !urlQueue.includes(normalizedUrl) &&
              isValidUrl(normalizedUrl)
            ) {
              discoveredUrls.add(normalizedUrl);
              urlQueue.push(normalizedUrl);
            }
          } catch (err) {
            // Ignorer les URLs invalides
          }
        });
      } catch (err) {
        console.error(`Error crawling ${currentUrl}:`, err);
      }

      iterations++;
    }

    // Convertir le Set en Array et limiter au nombre maximum d'URLs
    return Array.from(discoveredUrls).slice(0, maxUrls);
  } catch (error) {
    console.error('Error discovering URLs:', error);
    // En cas d'erreur, retourner uniquement l'URL de départ
    return [startUrl];
  }
};

const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);

    // Supprimer les paramètres de tracking et de session
    const searchParams = urlObj.searchParams;
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'];

    paramsToRemove.forEach(param => {
      searchParams.delete(param);
    });

    // Reconstruire l'URL sans les paramètres inutiles
    urlObj.search = searchParams.toString();

    // Supprimer le fragment
    urlObj.hash = '';

    // Supprimer le trailing slash si présent
    let normalized = urlObj.toString();
    if (normalized.endsWith('/') && urlObj.pathname !== '/') {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch (e) {
    return url;
  }
};

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();

    // Exclure les extensions de fichiers non-HTML
    const excludedExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.rar', '.tar', '.gz', '.mp3', '.mp4', '.avi', '.mov',
      '.css', '.js', '.json', '.xml', '.csv', '.rss'
    ];

    for (const ext of excludedExtensions) {
      if (pathname.endsWith(ext)) {
        return false;
      }
    }

    // Exclure les URLs avec des caractères spéciaux qui indiquent des applications ou des endpoints d'API
    if (pathname.includes('api/') || pathname.includes('/wp-json/') || pathname.includes('/ajax/')) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const sendPerformanceScoreToWebsitePage = (websiteUrl: string, performanceScore: number): void => {
  try {
    // Ici nous simulons l'envoi des données à la page Website
    // Dans une implémentation réelle, on utiliserait probablement un store Pinia/Vuex
    console.log(`Performance data for ${websiteUrl} ready to be displayed: ${performanceScore}%`);

    // Emettre un événement personnalisé pour être capturé par la page website
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('performanceDataAvailable', {
        detail: {
          websiteUrl,
          performanceScore
        }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error sending performance score to website page:', error);
  }
}; 