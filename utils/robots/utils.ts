import {
  BaseConfig,
  Config,
  RobotsConfig,
  RobotsSimulationResult, RobotsStats,
  RobotsTemplate, RobotsValidationResult,
  SchemaConfig,
  SchemaTemplate,
  SchemaValidationResult
} from './types';

// Templates prédéfinis pour robots.txt
export const ROBOTS_TEMPLATES: RobotsTemplate[] = [
  {
    name: 'WordPress',
    description: 'Configuration optimale pour les sites WordPress',
    recommendedFor: ['WordPress', 'CMS'],
    rules: [
      { path: '/wp-admin/', type: 'disallow', severity: 'high', category: 'admin', description: 'Protège la zone d\'administration' },
      { path: '/wp-includes/', type: 'disallow', severity: 'medium', category: 'system', description: 'Protège les fichiers système' },
      { path: '/wp-content/plugins/', type: 'disallow', severity: 'medium', category: 'plugins', description: 'Protège les plugins' },
      { path: '/wp-content/themes/', type: 'disallow', severity: 'low', category: 'themes', description: 'Protège les thèmes' },
      { path: '/xmlrpc.php', type: 'disallow', severity: 'high', category: 'security', description: 'Protège contre les attaques XML-RPC' }
    ]
  },
  {
    name: 'E-commerce',
    description: 'Configuration optimale pour les sites e-commerce',
    recommendedFor: ['E-commerce', 'Boutique en ligne'],
    rules: [
      { path: '/admin/', type: 'disallow', severity: 'high', category: 'admin', description: 'Protège la zone d\'administration' },
      { path: '/checkout/', type: 'disallow', severity: 'medium', category: 'checkout', description: 'Protège le processus de paiement' },
      { path: '/cart/', type: 'disallow', severity: 'low', category: 'cart', description: 'Protège le panier' },
      { path: '/account/', type: 'disallow', severity: 'high', category: 'user', description: 'Protège les comptes utilisateurs' }
    ]
  }
];

// Templates prédéfinis pour Schema.org
export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    name: 'Article',
    description: 'Structure pour les articles de blog',
    recommendedFor: ['Blog', 'Actualités'],
    type: {
      type: 'Article',
      description: 'Structure pour les articles de blog',
      properties: [
        { name: 'headline', value: '', required: true, description: 'Titre de l\'article' },
        { name: 'author', value: '', required: true, description: 'Auteur de l\'article' },
        { name: 'datePublished', value: '', required: true, description: 'Date de publication' },
        { name: 'image', value: '', required: false, description: 'Image principale' },
        { name: 'description', value: '', required: true, description: 'Description de l\'article' }
      ]
    }
  },
  {
    name: 'Product',
    description: 'Structure pour les produits e-commerce',
    recommendedFor: ['E-commerce', 'Boutique en ligne'],
    type: {
      type: 'Product',
      description: 'Structure pour les produits',
      properties: [
        { name: 'name', value: '', required: true, description: 'Nom du produit' },
        { name: 'description', value: '', required: true, description: 'Description du produit' },
        { name: 'image', value: '', required: true, description: 'Image du produit' },
        { name: 'offers', value: '', required: true, description: 'Prix et disponibilité' },
        { name: 'brand', value: '', required: false, description: 'Marque du produit' },
        { name: 'sku', value: '', required: false, description: 'Référence du produit' }
      ]
    }
  }
];

// Chemins sensibles courants pour robots.txt
export const SENSITIVE_PATHS = [
  { path: '/admin', severity: 'high', category: 'admin' },
  { path: '/wp-admin', severity: 'high', category: 'admin' },
  { path: '/administrator', severity: 'high', category: 'admin' },
  { path: '/login', severity: 'high', category: 'auth' },
  { path: '/register', severity: 'high', category: 'auth' },
  { path: '/api', severity: 'medium', category: 'api' },
  { path: '/config', severity: 'high', category: 'config' },
  { path: '/database', severity: 'high', category: 'database' }
];

// Validation des règles robots.txt
export function validateRobotsConfig(config: RobotsConfig): RobotsValidationResult {
  const result: RobotsValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
    suggestions: []
  };

  // Validation des chemins
  config.rules.forEach(rule => {
    if (!rule.path.startsWith('/')) {
      result.errors.push(`Le chemin "${rule.path}" doit commencer par "/"`);
    }

    if (rule.path.includes('*') && !rule.path.endsWith('*')) {
      result.warnings.push(`Le chemin "${rule.path}" contient un caractère joker qui n'est pas à la fin`);
    }

    // Vérification des chemins sensibles
    const sensitivePath = SENSITIVE_PATHS.find(sp => rule.path.includes(sp.path));
    if (sensitivePath && rule.type === 'allow') {
      result.warnings.push(`Attention : Le chemin sensible "${rule.path}" est autorisé`);
    }
  });

  // Vérification des conflits
  config.rules.forEach((rule1, i) => {
    config.rules.slice(i + 1).forEach(rule2 => {
      if (rule1.path === rule2.path && rule1.type !== rule2.type) {
        result.errors.push(`Conflit détecté : "${rule1.path}" est à la fois autorisé et interdit`);
      }
    });
  });

  result.isValid = result.errors.length === 0;
  return result;
}

// Validation des données Schema.org
export function validateSchemaConfig(config: SchemaConfig): SchemaValidationResult {
  const result: SchemaValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
    suggestions: []
  };

  // Vérification des propriétés requises
  const template = SCHEMA_TEMPLATES.find(t => t.type.type === config.schemaType);
  if (template) {
    template.type.properties.forEach(templateProp => {
      if (templateProp.required) {
        const prop = config.properties.find(p => p.name === templateProp.name);
        if (!prop || !prop.value) {
          result.errors.push(`La propriété "${templateProp.name}" est requise`);
        }
      }
    });
  }

  // Vérification des valeurs
  config.properties.forEach(prop => {
    if (typeof prop.value === 'string' && !prop.value.trim()) {
      result.warnings.push(`La propriété "${prop.name}" est vide`);
    }
  });

  result.isValid = result.errors.length === 0;
  return result;
}

// Simulation du comportement des robots
export function simulateRobotsAccess(config: RobotsConfig, url: string): RobotsSimulationResult {
  const urlObj = new URL(url);
  const path = urlObj.pathname;

  // Recherche de la règle correspondante
  const matchedRule = config.rules
    .sort((a, b) => b.path.length - a.path.length) // Priorité aux chemins les plus spécifiques
    .find(rule => {
      if (rule.path.endsWith('*')) {
        return path.startsWith(rule.path.slice(0, -1));
      }
      return path === rule.path;
    });

  return {
    url,
    path,
    isAllowed: !matchedRule || matchedRule.type === 'allow',
    matchedRule
  };
}

// Calcul des statistiques pour robots.txt
export function calculateRobotsStats(config: RobotsConfig): RobotsStats {
  return {
    totalRules: config.rules.length,
    allowRules: config.rules.filter(r => r.type === 'allow').length,
    disallowRules: config.rules.filter(r => r.type === 'disallow').length,
    criticalPaths: config.rules.filter(r => r.severity === 'high').length,
    sensitivePaths: config.rules.filter(r =>
      SENSITIVE_PATHS.some(sp => r.path.includes(sp.path))
    ).length,
    lastModified: new Date()
  };
}

// Application d'un template
export function applyTemplate(config: Config, template: RobotsTemplate | SchemaTemplate): Config {
  if (config.type === 'robots' && 'rules' in template) {
    return {
      ...config,
      rules: [...config.rules, ...(template as RobotsTemplate).rules],
      stats: calculateRobotsStats({
        ...config,
        rules: [...config.rules, ...(template as RobotsTemplate).rules]
      })
    };
  } else if (config.type === 'schema' && 'type' in template) {
    return {
      ...config,
      properties: [...config.properties, ...(template as SchemaTemplate).type.properties]
    };
  }
  return config;
}

// Génération du contenu robots.txt
export function generateRobotsContent(config: RobotsConfig): string {
  const lines: string[] = [];

  // User-agent
  if (config.customUserAgent) {
    lines.push(`User-agent: ${config.customUserAgent}`);
  } else {
    lines.push(`User-agent: *`);
  }

  // Crawl delay
  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`);
  }

  // Rules
  config.rules.forEach(rule => {
    lines.push(`${rule.type === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}`);
  });

  // Sitemap
  if (config.sitemap) {
    lines.push(`Sitemap: ${config.sitemap}`);
  }

  return lines.join('\n');
}

// Génération du contenu Schema.org
export const generateSchemaContent = (siteConfig: BaseConfig, config: SchemaConfig): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': config.type
  };

  // Parcourir toutes les propriétés du config
  Object.entries(config).forEach(([key, value]) => {
    // Ignorer les propriétés spéciales et vides
    if (key === 'type' || value === '' || value === null || value === undefined) {
      return;
    }

    // Si la valeur est déjà un objet, l'utiliser directement
    if (typeof value === 'object' && value !== null) {
      schema[key] = value;
    }
    // Si la valeur est une chaîne JSON, la parser
    else if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        schema[key] = JSON.parse(value);
      } catch (e) {
        schema[key] = value;
      }
    }
    // Pour les autres valeurs, les utiliser telles quelles
    else {
      schema[key] = value;
    }
  });

  return JSON.stringify(schema, null, 2);
}; 