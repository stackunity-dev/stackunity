export interface RobotsConfig {
  userAgent: string;
  customUserAgent: string;
  crawlDelay: string;
  disallowedPaths: string[];
  allowedPaths: string[];
  sitemapUrl: string;
  contact?: string;
}

export interface SchemaProperty {
  key: string;
  label: string;
  icon: string;
  type?: 'image' | 'date' | 'chips' | 'restaurant-options' | 'text';
  color?: string;
}

export interface SchemaConfig {
  type: string;
  name: string;
  description: string;
  url: string;
  image: string;
  telephone: string;
  email: string;
  address: string;
  logo: string;
  socialProfiles: string[];
  foundingDate: string;
  legalName: string;
  numberOfEmployees: string;
  jobTitle: string;
  givenName: string;
  familyName: string;
  birthDate: string;
  worksFor: string;
  alumniOf: string;
  price: string;
  currency: string;
  availability: string;
  brand: string;
  category: string;
  sku: string;
  gtin: string;
  mpn: string;
  color: string;
  material: string;
  headline: string;
  author: string;
  datePublished: string;
  dateModified: string;
  publisher: string;
  keywords: string;
  articleSection: string;
  articleBody: string;
  openingHours: string;
  priceRange: string;
  areaServed: string;
  hasMap: string;
  geo: string;
  faxNumber: string;
  aggregateRating: string;
  potentialAction: string;
  inLanguage: string;
  copyrightYear: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  performer: string;
  offers: string;
  eventStatus: string;
  eventAttendanceMode: string;
  servesCuisine: string;
  menu: string;
  acceptsReservations: boolean;
  driveThrough: boolean;
  deliveryAvailable: boolean;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  ratingValue?: string;
  ratingCount?: string;
  reviewCount?: string;
  nationality?: string;
  knowsAbout?: string[];
  weight?: string;
  locationName?: string;
  publisherLogo?: string;
  organizerUrl?: string;
  offerPrice?: string;
  offerAvailability?: string;
  offerUrl?: string;
  offerValidFrom?: string;
  [key: string]: any;
}

export interface SiteConfig {
  domain: string;
  protocol: string;
}

export interface RobotsPreviewLine {
  text: string;
  bold: boolean;
  comment: boolean;
}

export interface SchemaOrgSuggestion {
  type: string;
  properties: Record<string, any>;
  template: string;
}

export interface SchemaOrg {
  suggestions: SchemaOrgSuggestion[];
}

export interface ExtendedSEOResult {
  seo?: any;
  schemaOrg?: SchemaOrg;
  [key: string]: any;
}

export const typePropertiesConfig: Record<string, SchemaProperty[]> = {
  Organization: [
    { key: 'foundingDate', label: 'Date of incorporation', icon: 'mdi-calendar', type: 'date' },
    { key: 'legalName', label: 'Legal name', icon: 'mdi-domain' },
    { key: 'numberOfEmployees', label: 'Number of employees', icon: 'mdi-account-group' }
  ],
  Person: [
    { key: 'jobTitle', label: 'Job title', icon: 'mdi-badge-account' },
    { key: 'givenName', label: 'First name', icon: 'mdi-account' },
    { key: 'familyName', label: 'Last name', icon: 'mdi-account' },
    { key: 'birthDate', label: 'Date of birth', icon: 'mdi-calendar', type: 'date' }
  ],
  Product: [
    { key: 'price', label: 'Price', icon: 'mdi-currency-usd' },
    { key: 'brand', label: 'Brand', icon: 'mdi-tag' },
    { key: 'category', label: 'Category', icon: 'mdi-shape' }
  ],
  Article: [
    { key: 'headline', label: 'Title', icon: 'mdi-format-title' },
    { key: 'author', label: 'Author', icon: 'mdi-account-edit' },
    { key: 'datePublished', label: 'Date of publication', icon: 'mdi-calendar', type: 'date' }
  ],
  LocalBusiness: [
    { key: 'openingHours', label: 'Opening hours', icon: 'mdi-clock-outline' },
    { key: 'priceRange', label: 'Price range', icon: 'mdi-currency-usd' }
  ],
  WebSite: [
    { key: 'potentialAction', label: 'Search URL', icon: 'mdi-magnify' },
    { key: 'inLanguage', label: 'Languages', icon: 'mdi-translate' }
  ],
  Event: [
    { key: 'startDate', label: 'Start date', icon: 'mdi-calendar', type: 'date' },
    { key: 'endDate', label: 'End date', icon: 'mdi-calendar', type: 'date' },
    { key: 'location', label: 'Location', icon: 'mdi-map-marker' }
  ],
}; 