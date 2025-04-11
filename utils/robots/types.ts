// Types communs
export interface BaseConfig {
  version: number;
  lastModified: Date;
}

// Types pour robots.txt
export interface RobotsRule {
  path: string;
  type: 'allow' | 'disallow';
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface RobotsTemplate {
  name: string;
  description: string;
  rules: RobotsRule[];
  recommendedFor: string[];
}

export interface RobotsValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export interface RobotsSimulationResult {
  url: string;
  isAllowed: boolean;
  matchedRule?: RobotsRule;
  path: string;
}

export interface RobotsStats {
  totalRules: number;
  allowRules: number;
  disallowRules: number;
  criticalPaths: number;
  sensitivePaths: number;
  lastModified: Date;
}

export interface RobotsConfig extends BaseConfig {
  type: 'robots';
  userAgent: string;
  customUserAgent: string;
  crawlDelay: string;
  disallowedPaths: string[];
  allowedPaths: string[];
  sitemap: string;
  rules: RobotsRule[];
  stats: RobotsStats;
}

// Types pour Schema.org
export interface SchemaProperty {
  name: string;
  value: string | number | boolean | SchemaProperty[];
  required: boolean;
  description?: string;
}

export interface SchemaType {
  type: string;
  properties: SchemaProperty[];
  description?: string;
}

export interface SchemaTemplate {
  name: string;
  description: string;
  type: SchemaType;
  recommendedFor: string[];
}

export interface SchemaValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export interface SchemaConfig extends BaseConfig {
  type: 'schema';
  schemaType: string;
  properties: SchemaProperty[];
  validation: SchemaValidationResult;
}

// Types pour les sauvegardes
export interface ConfigBackup {
  id: string;
  config: RobotsConfig | SchemaConfig;
  createdAt: Date;
  comment?: string;
}

// Type union pour la configuration
export type Config = RobotsConfig | SchemaConfig; 