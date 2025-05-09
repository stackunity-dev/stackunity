import { useTranslations } from "../../languages";
import { DeviceType } from "./types";

const t = useTranslations('analytics')()

function getSourceColor(source: string): string {
  switch (source) {
    case 'organic_search':
      return 'success';
    case 'social_media':
      return 'info';
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

  const browserInfoLower = browserInfo.toLowerCase();
  if (browserInfoLower.includes('chrome')) return 'mdi-google-chrome';
  if (browserInfoLower.includes('firefox')) return 'mdi-firefox';
  if (browserInfoLower.includes('safari')) return 'mdi-apple-safari';
  if (browserInfoLower.includes('edge')) return 'mdi-microsoft-edge';
  if (browserInfoLower.includes('explorer') || browserInfoLower.includes('ie')) return 'mdi-internet-explorer';
  if (browserInfoLower.includes('opera')) return 'mdi-opera';
  return 'mdi-web';
}

function getBrowserColor(browserInfo: string): string {
  if (!browserInfo) return 'grey';

  const browserInfoLower = browserInfo.toLowerCase();
  if (browserInfoLower.includes('chrome')) return 'green';
  if (browserInfoLower.includes('firefox')) return 'orange';
  if (browserInfoLower.includes('safari')) return 'blue';
  if (browserInfoLower.includes('edge')) return 'teal';
  if (browserInfoLower.includes('explorer') || browserInfoLower.includes('ie')) return 'blue-grey';
  if (browserInfoLower.includes('opera')) return 'red';
  return 'grey';
}

function getOsIcon(osInfo: string): string {
  if (!osInfo) return 'mdi-laptop';

  const osInfoLower = osInfo.toLowerCase();
  if (osInfoLower.includes('windows')) return 'mdi-microsoft-windows';
  if (osInfoLower.includes('mac')) return 'mdi-apple';
  if (osInfoLower.includes('ios')) return 'mdi-apple-ios';
  if (osInfoLower.includes('android')) return 'mdi-android';
  if (osInfoLower.includes('linux')) return 'mdi-linux';
  return 'mdi-laptop';
}

function getOsColor(osInfo: string): string {
  if (!osInfo) return 'grey';

  const osInfoLower = osInfo.toLowerCase();
  if (osInfoLower.includes('windows')) return 'blue';
  if (osInfoLower.includes('mac') || osInfoLower.includes('ios')) return 'grey';
  if (osInfoLower.includes('android')) return 'green';
  if (osInfoLower.includes('linux')) return 'orange';
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

export {
  formatDate,
  formatDuration, formatUrl, generateTrackingCode, getBrowserColor, getBrowserIcon, getColorByIndex, getDeviceIcon,
  getDeviceLabel, getFullDomain, getOsColor, getOsIcon, getReferrerColor,
  getReferrerIcon, getSourceColor,
  getSourceIcon,
  getSourceLabel, isLocalEnvironment
};

