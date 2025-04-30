import axios from 'axios';
import { load } from 'cheerio';

export function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '') || '/';
}

export async function crawlWebsite(url: string, maxUrls: number) {
  const visitedUrls = new Set<string>();
  const failedUrls = new Set<string>();
  const urlsToVisit = [normalizeUrl(url)];
  const baseUrl = new URL(url).origin;
  const mainUrl = normalizeUrl(url);

  const excludePatterns = [
    'cdn-cgi',
    'assets',
    'images',
    'media',
    '#',
    'mailto:',
    'tel:',
    '.pdf',
    '.jpg',
    '.png',
    '.gif',
    '.svg',
    '.css',
    '.js',
    '.ico'
  ];

  const actualMaxUrls = Math.min(maxUrls, 35);

  let attempts = 0;
  const maxAttempts = 40;

  while (urlsToVisit.length > 0 && visitedUrls.size < actualMaxUrls && attempts < maxAttempts) {
    attempts++;
    const currentUrl = urlsToVisit.shift();

    if (!currentUrl || visitedUrls.has(currentUrl) || failedUrls.has(currentUrl)) {
      continue;
    }

    if (excludePatterns.some(pattern => currentUrl.includes(pattern))) {
      continue;
    }

    try {
      const response = await axios.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0'
        },
        timeout: 20000,
        maxContentLength: 10 * 1024 * 1024,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('text/html')) {
        continue;
      }

      visitedUrls.add(currentUrl);

      const $ = load(response.data);

      const links: string[] = [];

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) links.push(href);
      });

      $('link[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) links.push(href);
      });

      $('script[src]').each((_, el) => {
        const src = $(el).attr('src');
        if (src) links.push(src);
      });

      $('img[src]').each((_, el) => {
        const src = $(el).attr('src');
        if (src) links.push(src);
      });

      const newUrls = links
        .map(link => {
          try {
            if (!link) {
              return null;
            }

            if (link.startsWith('./')) {
              link = link.substring(2);
            } else if (link.startsWith('../')) {
              const pathParts = currentUrl.split('/');
              pathParts.pop();
              link = `${pathParts.join('/')}/${link.substring(3)}`;
            }

            let fullUrl = link;
            if (link.startsWith('/')) {
              fullUrl = `${baseUrl}${link}`;
            } else if (!link.startsWith('http')) {
              fullUrl = `${baseUrl}/${link}`;
            }

            if (!fullUrl.startsWith(baseUrl)) {
              return null;
            }

            fullUrl = normalizeUrl(fullUrl);
            return fullUrl;
          } catch (e) {
            return null;
          }
        })
        .filter((link): link is string =>
          link !== null &&
          !visitedUrls.has(link) &&
          !urlsToVisit.includes(link) &&
          !failedUrls.has(link) &&
          !excludePatterns.some(pattern => link.includes(pattern))
        )
        .slice(0, 10);

      urlsToVisit.push(...newUrls);
    } catch (e) {
      failedUrls.add(currentUrl);
    }
  }

  if (visitedUrls.size === 0) {
    visitedUrls.add(mainUrl);
  }

  return Array.from(visitedUrls);
} 