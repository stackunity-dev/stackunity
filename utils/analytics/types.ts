export interface Website {
  id: string;
  name: string;
  url: string;
  addedAt: string;
}

export interface PageView {
  page: string;
  views: number;
  avgTime: string;
  cleanPath?: string;
  isHome?: boolean;
  avgTimeSeconds?: number;
  hasDuration?: boolean;
}

export interface UserSession {
  id: string;
  websiteId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  deviceType: DeviceType;
  browser: string;
  os: string;
  referrer: string | null;
  isComplete: boolean;
  isBounce: boolean;
  pages: UserPageView[];
}

export interface UserPageView {
  id: string;
  sessionId: string;
  pageUrl: string;
  title: string;
  enterTime: string;
  exitTime: string | null;
  duration: number | null;
  scrollDepth: number;
  interactions: UserInteraction[];
}

export interface UserInteraction {
  id: string;
  pageviewId: string;
  sessionId: string;
  type: string;
  elementSelector: string;
  elementText: string;
  timestamp: string;
  value: any;
  pageUrl?: string;
}

export enum InteractionType {
  CLICK = 'click',
  HOVER = 'hover',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  INPUT_CHANGE = 'input_change',
  ERROR = 'error',
  PAGE_EXIT = 'page_exit'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}

export interface WebsiteAnalytics {
  websiteId: string;
  totalVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  avgPageDuration: number;
  durationDataQuality: number;
  avgPageTime: string;
  pageViewsWithDuration: number;
  bounceRate: number;
  bounceCount: number;
  frustratedSessions: number;
  timeOnSite: string;
  topPages: PageView[];
  trafficSources: TrafficSource[];
  devices: DeviceStats[];
  userFlows: UserFlow[];
  errorEvents: ErrorEvent[];
  userInteractions: UserInteraction[];
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface DeviceStats {
  type: DeviceType;
  count: number;
  percentage: number;
}

export interface UserFlow {
  path: string[];
  count: number;
  conversionRate: number;
}

export interface ErrorEvent {
  page: string;
  errorMessage: string;
  count: number;
  browserInfo: string;
}

export interface DeadZoneAnalysis {
  pageUrl: string;
  totalHeight: number;
  scrollDepthDistribution: ScrollDepthPoint[];
  deadZones: DeadZone[];
  visibilityScore: number;
  visibilitySegments: VisibilitySegment[];
}

export interface ScrollDepthPoint {
  depth: number;
  viewCount: number;
}

export interface DeadZone {
  startY: number;
  endY: number;
  startPercent: number;
  endPercent: number;
  elementSelectors: string[];
}

export interface VisibilitySegment {
  startPercent: number;
  endPercent: number;
  viewCount: number;
  normalizedViewCount: number;
  isDeadZone: boolean;
}

export interface EngagementMetrics {
  pageUrl: string;
  sessionCount: number;
  avgSessionDuration: number;
  overallScore: number;
  metrics: {
    interactionRate: number;
    scrollDepth: number;
    timeOnPage: number;
    returnRate: number;
  };
  factors: {
    interactionsPerMinute: number;
    scrollPercentage: number;
    averageTimeSpent: number;
    bounceRate: number;
    clickThroughRate: number;
    formCompletionRate: number;
    readingTime: number;
  };
}

export interface WebsiteWithStats extends Website {
  formattedUrl?: string;
  fullDomain?: string;
  stats: {
    visites: number;
    pages: number;
    temps: string;
    dureePageMoyenne?: string;
    qualiteDonnees?: number;
    trend?: number;
    totalInteractions?: number;
  }
}

export interface BrowserOsStats {
  name: string;
  count: number;
  percentage: number;
  type: string;
}

export interface DetailedReferrer {
  source: string;
  name: string;
  url: string;
  visits: number;
  lastVisit: string;
  sourceType?: 'social' | 'search' | 'direct' | 'referral';
  icon?: string;
  color?: string;
}