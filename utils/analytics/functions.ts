import { useTranslations } from "../../languages";
import { DeviceType } from "./types";

const t = useTranslations('analytics')()

function getSourceColor(source: string): string {
  switch (source) {
    case 'organic_search':
      return 'success';
    case 'social_media':
      return 'info';
    case 'social_media_facebook':
      return 'blue';
    case 'social_media_twitter':
      return 'light-blue';
    case 'social_media_instagram':
      return 'purple';
    case 'social_media_linkedin':
      return 'indigo';
    case 'direct_links':
      return 'primary';
    case 'referrers':
      return 'warning';
    default:
      return 'grey';
  }
}

function getSourceIcon(source: string): string {
  switch (source) {
    case 'organic_search':
      return 'mdi-magnify';
    case 'social_media':
      return 'mdi-account-group';
    case 'social_media_facebook':
      return 'mdi-facebook';
    case 'social_media_twitter':
      return 'mdi-twitter';
    case 'social_media_instagram':
      return 'mdi-instagram';
    case 'social_media_linkedin':
      return 'mdi-linkedin';
    case 'direct_links':
      return 'mdi-link-variant';
    case 'referrers':
      return 'mdi-web';
    default:
      return 'mdi-help-circle-outline';
  }
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'organic_search':
      return t.analytics.organicSearch;
    case 'social_media':
      return t.analytics.socialMedia;
    case 'social_media_facebook':
      return 'Facebook';
    case 'social_media_twitter':
      return 'Twitter';
    case 'social_media_instagram':
      return 'Instagram';
    case 'social_media_linkedin':
      return 'LinkedIn';
    case 'direct_links':
      return t.analytics.directLinks;
    case 'referrers':
      return t.analytics.referers;
    default:
      return source;
  }
}

function getBrowserIcon(browserInfo: string): string {
  if (!browserInfo) return 'mdi-web';

  if (browserInfo.toLowerCase().includes('chrome')) return 'mdi-google-chrome';
  if (browserInfo.toLowerCase().includes('firefox')) return 'mdi-firefox';
  if (browserInfo.toLowerCase().includes('safari')) return 'mdi-apple-safari';
  if (browserInfo.toLowerCase().includes('edge')) return 'mdi-microsoft-edge';
  if (browserInfo.toLowerCase().includes('internet explorer') || browserInfo.toLowerCase().includes('ie')) return 'mdi-internet-explorer';
  if (browserInfo.toLowerCase().includes('opera')) return 'mdi-opera';
  if (browserInfo.toLowerCase().includes('brave')) return 'mdi-web';

  return 'mdi-web';
}

function getBrowserColor(browserInfo: string): string {
  if (!browserInfo) return 'grey';

  if (browserInfo.toLowerCase().includes('chrome')) return 'green';
  if (browserInfo.toLowerCase().includes('firefox')) return 'orange';
  if (browserInfo.toLowerCase().includes('safari')) return 'blue';
  if (browserInfo.toLowerCase().includes('edge')) return 'teal';
  if (browserInfo.toLowerCase().includes('internet explorer') || browserInfo.toLowerCase().includes('ie')) return 'blue-grey';
  if (browserInfo.toLowerCase().includes('opera')) return 'red';
  if (browserInfo.toLowerCase().includes('brave')) return 'orange-darken-3';

  return 'grey';
}

function getOsIcon(osInfo: string): string {
  if (!osInfo) return 'mdi-laptop';

  if (osInfo.toLowerCase().includes('windows')) return 'mdi-microsoft-windows';
  if (osInfo.toLowerCase().includes('macos')) return 'mdi-apple';
  if (osInfo.toLowerCase().includes('ios')) return 'mdi-apple-ios';
  if (osInfo.toLowerCase().includes('ipados')) return 'mdi-tablet-ipad';
  if (osInfo.toLowerCase().includes('android')) return 'mdi-android';
  if (osInfo.toLowerCase().includes('linux')) return 'mdi-linux';

  return 'mdi-laptop';
}

function getOsColor(osInfo: string): string {
  if (!osInfo) return 'grey';

  if (osInfo.toLowerCase().includes('windows')) return 'blue';
  if (osInfo.toLowerCase().includes('macos')) return 'grey-darken-2';
  if (osInfo.toLowerCase().includes('ios') || osInfo.toLowerCase().includes('ipados')) return 'blue-grey';
  if (osInfo.toLowerCase().includes('android')) return 'green';
  if (osInfo.toLowerCase().includes('linux')) return 'orange';

  return 'grey';
}

function getDeviceIcon(deviceType: string): string {
  switch (deviceType) {
    case DeviceType.DESKTOP:
      return 'mdi-laptop';
    case DeviceType.MOBILE:
      return 'mdi-cellphone';
    case DeviceType.TABLET:
      return 'mdi-tablet';
    default:
      return 'mdi-devices';
  }
}

function getDeviceLabel(deviceType: string): string {
  switch (deviceType) {
    case DeviceType.DESKTOP:
      return t.analytics?.appareil?.desktop || 'Ordinateur';
    case DeviceType.MOBILE:
      return t.analytics?.appareil?.mobile || 'Mobile';
    case DeviceType.TABLET:
      return t.analytics?.appareil?.tablet || 'Tablette';
    default:
      return t.analytics?.appareil?.inconnu || 'Inconnu';
  }
}

function getReferrerIcon(referrer: string): string {
  const referrerLower = referrer.toLowerCase();
  if (referrerLower.includes('google')) return 'mdi-google';
  if (referrerLower.includes('facebook')) return 'mdi-facebook';
  if (referrerLower.includes('twitter')) return 'mdi-twitter';
  if (referrerLower.includes('instagram')) return 'mdi-instagram';
  if (referrerLower.includes('linkedin')) return 'mdi-linkedin';
  if (referrerLower.includes('youtube')) return 'mdi-youtube';
  if (referrerLower.includes('github')) return 'mdi-github';
  return 'mdi-web';
}

function getReferrerColor(referrer: string): string {
  const referrerLower = referrer.toLowerCase();
  if (referrerLower.includes('google')) return 'red';
  if (referrerLower.includes('facebook')) return 'blue';
  if (referrerLower.includes('twitter')) return 'light-blue';
  if (referrerLower.includes('instagram')) return 'purple';
  if (referrerLower.includes('linkedin')) return 'indigo';
  if (referrerLower.includes('youtube')) return 'red-darken-2';
  if (referrerLower.includes('github')) return 'grey-darken-3';
  return 'blue-grey';
}

// Nouvelles fonctions ajoutées pour alléger user-analytics.vue

function formatUrl(url: string): string {
  if (!url) return '';

  try {
    let cleanUrl = url.replace(/^https?:\/\//, '') || url.replace(/^http?:\/\//, '');

    if (cleanUrl === 'localhost' || cleanUrl.startsWith('localhost:') ||
      cleanUrl.startsWith('127.0.0.1') || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanUrl)) {
      return cleanUrl.split('/')[0];
    }

    cleanUrl = cleanUrl.split('/')[0];

    const parts = cleanUrl.split('.');

    if (parts.length >= 2) {
      if (parts[0] === 'www' && parts.length > 2) {
        return parts.slice(1).join('.');
      }

      const secondLevelDomains = ['co.uk', 'com.au', 'co.jp', 'co.nz', 'co.za', 'com.br', 'com.mx'];
      const lastTwoParts = parts.slice(-2).join('.');

      if (secondLevelDomains.includes(lastTwoParts) && parts.length > 2) {
        return parts.slice(-3).join('.');
      }

      if (parts.length > 2) {
        return parts.slice(-2).join('.');
      }

      return cleanUrl;
    }

    return cleanUrl;
  } catch (e) {
    return url.replace(/^https?:\/\//, '');
  }
}

function getFullDomain(url: string): string {
  if (!url) return '';
  try {
    let domain = url.replace(/^https?:\/\//, '');

    if (/^(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3})(:\d+)?/.test(domain)) {
      return domain.split('/')[0];
    }

    domain = domain.split('/')[0];
    return domain;
  } catch (e) {
    return url.replace(/^https?:\/\//, '');
  }
}

function isLocalEnvironment(url: string): boolean {
  if (!url) return false;
  const cleanUrl = url.replace(/^https?:\/\//, '');
  return cleanUrl.startsWith('localhost') ||
    cleanUrl.startsWith('127.0.0.1') ||
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanUrl);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0s';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getColorByIndex(index: number): string {
  const colors = ['primary', 'secondary', 'success', 'info', 'indigo', 'deep-purple', 'cyan', 'teal', 'amber'];
  return colors[index % colors.length];
}

function generateTrackingCode(websiteId: string): string {
  return `
<script async defer src="https://stackunity.tech/tracker.js" data-website-id="${websiteId}"></script>
  `;
}

function normalizeUrl(url: string): string {
  if (!url) return url;

  try {
    let pathname = url;
    let hostname = '';

    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
      hostname = urlObj.hostname;
    }

    pathname = pathname.split('#')[0];

    pathname = pathname.replace(/^\/(fr|en)\//, '/');

    if (!pathname || pathname === '') {
      return hostname ? hostname + '/' : '/';
    }

    pathname = pathname.replace(/\/$/, '');

    return hostname ? hostname + pathname : pathname;
  } catch (e) {
    console.error('Erreur lors de la normalisation de l\'URL:', e);
    return url;
  }
}

function formatDateToYYYYMMDD(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getChartColor(index: number): string {
  const colors = [
    '#1976D2',
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
    '#F44336',
    '#00BCD4',
    '#FFEB3B',
    '#3F51B5',
    '#E91E63',
    '#009688',
  ];

  return colors[index % colors.length];
}

function formatPagePath(url: string, cleanPath: string | null | undefined, isHome: boolean | null | undefined) {
  if (!url) return 'Unknown page';

  if (isHome) return "Landing page";

  try {
    if (cleanPath) {
      return cleanPath === '/' ? "Landing page" : cleanPath;
    }

    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path === '/' ? "Landing page" : path;
    }

    return url === '/' ? "Landing page" : url;
  } catch (e) {
    console.error('Erreur lors du formatage du chemin de page:', e);
    return url;
  }
}

export {
  formatDate, formatDateToYYYYMMDD, formatDuration, formatPagePath, formatUrl,
  generateTrackingCode,
  getBrowserColor,
  getBrowserIcon, getChartColor, getColorByIndex,
  getDeviceIcon,
  getDeviceLabel,
  getFullDomain,
  getOsColor,
  getOsIcon,
  getReferrerColor,
  getReferrerIcon,
  getSourceColor,
  getSourceIcon,
  getSourceLabel,
  isLocalEnvironment,
  normalizeUrl
};

