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
  pageViewId: string;
  type: InteractionType;
  elementSelector: string;
  timestamp: string;
  value?: any;
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
  bounceRate: number;
  frustratedSessions: number;
  timeOnSite: string;
  topPages: PageView[];
  trafficSources: TrafficSource[];
  devices: DeviceStats[];
  userFlows: UserFlow[];
  errorEvents: ErrorEvent[];
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
