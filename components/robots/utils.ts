import type { CrawlReport, SEOAuditResult } from '../../server/api/seo-audit';
import { RobotsConfig, SchemaConfig, SiteConfig } from './types';

// Utilisation de types partiels au lieu d'héritage pour éviter les erreurs
type ExtendedSEOResult = Partial<SEOAuditResult> & {
  structuredData?: any[];
  robotsMeta?: Partial<{
    index: boolean;
    follow: boolean;
    noindex: boolean;
    nofollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noodp: boolean;
  }>;
};

type ExtendedCrawlReport = Partial<CrawlReport> & {
  seoResults?: Record<string, ExtendedSEOResult>;
};

/**
 * Remplit les configurations à partir des données d'audit SEO
 */
export const fillConfigsFromAudit = (
  report: CrawlReport,
  siteConfig: SiteConfig,
  schemaConfig: SchemaConfig,
  robotsConfig: RobotsConfig
) => {
  const extReport = report as unknown as ExtendedCrawlReport;

  // Extraction des chemins à interdire basée sur les meta robots
  if (extReport && extReport.seoResults) {
    const disallowedPaths = new Set<string>();
    Object.entries(extReport.seoResults).forEach(([url, result]: [string, any]) => {
      if (result.robotsMeta && result.robotsMeta.noindex) {
        try {
          const urlObj = new URL(url);
          disallowedPaths.add(urlObj.pathname);
        } catch (e) {
          console.error('Erreur lors du parsing de l\'URL:', url);
        }
      }
    });

    // Ajouter ces chemins à ceux déjà configurés
    if (disallowedPaths.size > 0) {
      robotsConfig.disallowedPaths = [...new Set([...robotsConfig.disallowedPaths, ...Array.from(disallowedPaths)])];
    }
  }

  // Exemples de champs à auto-remplir à partir de la page d'accueil
  const mainUrl = extReport.urlMap ? Object.keys(extReport.urlMap)[0] : '';
  const homeData = extReport.seoResults?.[mainUrl];

  if (homeData) {
    // Remplir le schéma avec les données du site
    if (homeData.title) {
      schemaConfig.name = homeData.title;
    }

    if (homeData.description) {
      schemaConfig.description = homeData.description;
    }

    // Extraire les informations structurées déjà présentes
    if (homeData.structuredData && homeData.structuredData.length > 0) {
      try {
        const existingSchema = homeData.structuredData[0];

        if (existingSchema['@type']) {
          schemaConfig.type = existingSchema['@type'];
        }

        if (existingSchema.name) {
          schemaConfig.name = existingSchema.name;
        }

        if (existingSchema.description) {
          schemaConfig.description = existingSchema.description;
        }

        if (existingSchema.url) {
          schemaConfig.url = existingSchema.url;
        }

        if (existingSchema.logo && existingSchema.logo.url) {
          schemaConfig.logo = existingSchema.logo.url;
        }

        if (existingSchema.image) {
          schemaConfig.image = typeof existingSchema.image === 'string'
            ? existingSchema.image
            : existingSchema.image.url || '';
        }

        if (existingSchema.telephone) {
          schemaConfig.telephone = existingSchema.telephone;
        }

        if (existingSchema.email) {
          schemaConfig.email = existingSchema.email;
        }
      } catch (e) {
        console.error('Erreur lors de l\'extraction des données structurées:', e);
      }
    }

    // Extraire d'autres informations utiles
    if (homeData.h1 && homeData.h1.length > 0) {
      if (!schemaConfig.name) {
        schemaConfig.name = homeData.h1[0];
      }
    }

    // Mettre à jour le domaine et le protocole si disponibles
    if (mainUrl) {
      try {
        const urlObj = new URL(mainUrl);
        siteConfig.domain = urlObj.hostname;
        siteConfig.protocol = urlObj.protocol.replace(':', '');
      } catch (e) {
        console.error('Erreur lors de l\'extraction du domaine et protocole:', e);
      }
    }

    // Récupérer les chemins détectés pour le sitemap
    // Recherche simple pour trouver un possible sitemap
    if (mainUrl && extReport.seoResults) {
      // Vérifier si une URL contenant sitemap est mentionnée
      try {
        const urlObj = new URL(mainUrl);
        const domain = urlObj.hostname;
        if (domain) {
          const possibleSitemapUrl = `/sitemap.xml`;
          robotsConfig.sitemapUrl = possibleSitemapUrl;
        }
      } catch (e) {
        console.error('Erreur lors de la recherche du sitemap:', e);
      }
    }
  }

  return { schemaConfig, robotsConfig, siteConfig };
};

/**
 * Génère le contenu du fichier robots.txt
 */
export const generateRobotsContent = (siteConfig: SiteConfig, robotsConfig: RobotsConfig): string => {
  let content = `User-agent: ${robotsConfig.userAgent !== 'All robots' ?
    (robotsConfig.userAgent === 'Custom' ? robotsConfig.customUserAgent :
      {
        'Google': 'Googlebot',
        'Bing': 'Bingbot',
        'Yahoo': 'Slurp',
        'Baidu': 'Baiduspider'
      }[robotsConfig.userAgent] || "*")
    : "*"}\n`;

  // Crawl-Delay
  if (robotsConfig.crawlDelay) {
    content += `Crawl-delay: ${robotsConfig.crawlDelay}\n`;
  }

  // Chemins autorisés
  if (robotsConfig.allowedPaths && robotsConfig.allowedPaths.length > 0) {
    robotsConfig.allowedPaths.forEach(path => {
      content += `Allow: ${path}\n`;
    });
  }

  // Chemins non autorisés
  if (robotsConfig.disallowedPaths && robotsConfig.disallowedPaths.length > 0) {
    robotsConfig.disallowedPaths.forEach(path => {
      content += `Disallow: ${path}\n`;
    });
  }

  // Sitemap
  if (robotsConfig.sitemapUrl) {
    content += `\nSitemap: ${siteConfig.protocol}://${siteConfig.domain}${robotsConfig.sitemapUrl.startsWith('/') ? robotsConfig.sitemapUrl : '/' + robotsConfig.sitemapUrl}\n`;
  }

  // Host (pour Yandex)
  content += `\nHost: ${siteConfig.protocol}://${siteConfig.domain}\n`;

  return content;
};

/**
 * Génère le contenu JSON-LD pour schema.org
 */
export const generateSchemaContent = (siteConfig: SiteConfig, schemaConfig: SchemaConfig): string => {
  const fullUrl = `${siteConfig.protocol}://${siteConfig.domain}`;

  // Structure de base du schéma
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': schemaConfig.type
  };

  // Propriétés de base communes à tous les types
  if (schemaConfig.name) schema.name = schemaConfig.name;
  if (schemaConfig.description) schema.description = schemaConfig.description;
  if (schemaConfig.url) schema.url = schemaConfig.url;
  else if (fullUrl) schema.url = fullUrl;
  if (schemaConfig.image) schema.image = schemaConfig.image;

  // Coordonnées
  if (schemaConfig.telephone) schema.telephone = schemaConfig.telephone;
  if (schemaConfig.email) schema.email = schemaConfig.email;

  // Adresse structurée
  if (schemaConfig.address || schemaConfig.city || schemaConfig.region) {
    schema.address = {
      '@type': 'PostalAddress',
      'streetAddress': schemaConfig.address || '',
      'addressLocality': schemaConfig.city || '',
      'addressRegion': schemaConfig.region || '',
      'postalCode': schemaConfig.postalCode || '',
      'addressCountry': schemaConfig.country || 'FR'
    };
  }

  // Données géographiques
  if (schemaConfig.latitude && schemaConfig.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      'latitude': schemaConfig.latitude,
      'longitude': schemaConfig.longitude
    };
  }

  // Propriétés spécifiques par type avec structure enrichie
  switch (schemaConfig.type) {
    case 'Organization':
      // Logo optimisé pour le SEO
      if (schemaConfig.logo) {
        schema.logo = {
          '@type': 'ImageObject',
          'url': schemaConfig.logo,
          'width': '512',
          'height': '512'
        };
      }

      // Profils sociaux
      if (schemaConfig.socialProfiles && schemaConfig.socialProfiles.length) {
        schema.sameAs = schemaConfig.socialProfiles;
      }

      // Informations légales et commerciales
      if (schemaConfig.foundingDate) schema.foundingDate = schemaConfig.foundingDate;
      if (schemaConfig.legalName) schema.legalName = schemaConfig.legalName;
      if (schemaConfig.numberOfEmployees) {
        schema.numberOfEmployees = {
          '@type': 'QuantitativeValue',
          'value': schemaConfig.numberOfEmployees
        };
      }

      // Action potentielle (contact)
      if (schemaConfig.potentialAction || schemaConfig.email) {
        schema.potentialAction = {
          '@type': 'ContactAction',
          'name': 'Contact',
          'target': schemaConfig.potentialAction || `mailto:${schemaConfig.email}`
        };
      }

      // Horaires d'ouverture
      if (schemaConfig.openingHours) {
        schema.openingHoursSpecification = {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00'
        };
      }

      break;

    case 'LocalBusiness':
      // Toutes les propriétés d'Organization
      if (schemaConfig.logo) {
        schema.logo = {
          '@type': 'ImageObject',
          'url': schemaConfig.logo,
          'width': '512',
          'height': '512'
        };
      }

      if (schemaConfig.socialProfiles && schemaConfig.socialProfiles.length) {
        schema.sameAs = schemaConfig.socialProfiles;
      }

      // Propriétés spécifiques aux entreprises locales
      if (schemaConfig.openingHours) {
        schema.openingHoursSpecification = {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00'
        };
      }

      if (schemaConfig.priceRange) schema.priceRange = schemaConfig.priceRange;
      if (schemaConfig.areaServed) schema.areaServed = schemaConfig.areaServed;
      if (schemaConfig.hasMap) schema.hasMap = schemaConfig.hasMap;

      // Services additionnels
      if (schemaConfig.deliveryAvailable) schema.hasDeliveryMethod = "http://schema.org/DeliveryModeOwnFleet";
      if (schemaConfig.acceptsReservations) schema.acceptsReservations = "True";

      // Avis et évaluations
      if (schemaConfig.ratingValue && schemaConfig.ratingCount) {
        schema.aggregateRating = {
          '@type': 'AggregateRating',
          'ratingValue': schemaConfig.ratingValue,
          'ratingCount': schemaConfig.ratingCount,
          'bestRating': '5'
        };
      }
      break;

    case 'Person':
      if (schemaConfig.givenName) schema.givenName = schemaConfig.givenName;
      if (schemaConfig.familyName) schema.familyName = schemaConfig.familyName;
      if (schemaConfig.jobTitle) schema.jobTitle = schemaConfig.jobTitle;
      if (schemaConfig.birthDate) schema.birthDate = schemaConfig.birthDate;
      if (schemaConfig.worksFor) {
        schema.worksFor = {
          '@type': 'Organization',
          'name': schemaConfig.worksFor
        };
      }
      if (schemaConfig.alumniOf) {
        schema.alumniOf = {
          '@type': 'Organization',
          'name': schemaConfig.alumniOf
        };
      }

      // Compétences et connaissances
      if (schemaConfig.knowsAbout && schemaConfig.knowsAbout.length) {
        schema.knowsAbout = schemaConfig.knowsAbout;
      }

      // Nationalité
      if (schemaConfig.nationality) {
        schema.nationality = {
          '@type': 'Country',
          'name': schemaConfig.nationality
        };
      }

      // Profils sociaux
      if (schemaConfig.socialProfiles && schemaConfig.socialProfiles.length) {
        schema.sameAs = schemaConfig.socialProfiles;
      }
      break;

    case 'Product':
      if (schemaConfig.brand) {
        schema.brand = {
          '@type': 'Brand',
          'name': schemaConfig.brand
        };
      }
      if (schemaConfig.category) schema.category = schemaConfig.category;
      if (schemaConfig.sku) schema.sku = schemaConfig.sku;
      if (schemaConfig.gtin) schema.gtin13 = schemaConfig.gtin;
      if (schemaConfig.mpn) schema.mpn = schemaConfig.mpn;
      if (schemaConfig.color) schema.color = schemaConfig.color;
      if (schemaConfig.material) schema.material = schemaConfig.material;
      if (schemaConfig.weight) {
        schema.weight = {
          '@type': 'QuantitativeValue',
          'value': schemaConfig.weight,
          'unitCode': 'KGM'
        };
      }

      // Offre de prix
      if (schemaConfig.price || schemaConfig.availability) {
        schema.offers = {
          '@type': 'Offer',
          'price': schemaConfig.price || '0',
          'priceCurrency': schemaConfig.currency || 'EUR',
          'availability': schemaConfig.availability || 'https://schema.org/InStock',
          'url': schemaConfig.url || fullUrl
        };
      }

      // Avis et évaluations
      if (schemaConfig.ratingValue && schemaConfig.reviewCount) {
        schema.aggregateRating = {
          '@type': 'AggregateRating',
          'ratingValue': schemaConfig.ratingValue,
          'reviewCount': schemaConfig.reviewCount,
          'bestRating': '5'
        };
      }
      break;

    case 'Article':
      if (schemaConfig.headline) schema.headline = schemaConfig.headline;
      if (schemaConfig.author) {
        schema.author = {
          '@type': 'Person',
          'name': schemaConfig.author
        };
      }
      if (schemaConfig.datePublished) schema.datePublished = schemaConfig.datePublished;
      if (schemaConfig.dateModified) schema.dateModified = schemaConfig.dateModified;
      if (schemaConfig.publisher) {
        schema.publisher = {
          '@type': 'Organization',
          'name': schemaConfig.publisher,
          'logo': schemaConfig.publisherLogo ? {
            '@type': 'ImageObject',
            'url': schemaConfig.publisherLogo
          } : undefined
        };
      }
      if (schemaConfig.keywords) schema.keywords = schemaConfig.keywords;
      if (schemaConfig.articleSection) schema.articleSection = schemaConfig.articleSection;
      if (schemaConfig.articleBody) schema.articleBody = schemaConfig.articleBody;

      // Langue et copyright
      if (schemaConfig.inLanguage) schema.inLanguage = schemaConfig.inLanguage;
      if (schemaConfig.copyrightYear) schema.copyrightYear = schemaConfig.copyrightYear;

      // Emplacement de l'image principale
      if (schemaConfig.image) {
        schema.image = {
          '@type': 'ImageObject',
          'url': schemaConfig.image,
          'width': '1200',
          'height': '630'
        };
      }
      break;

    case 'Event':
      if (schemaConfig.startDate) schema.startDate = schemaConfig.startDate;
      if (schemaConfig.endDate) schema.endDate = schemaConfig.endDate;
      if (schemaConfig.locationName || schemaConfig.address) {
        schema.location = {
          '@type': 'Place',
          'name': schemaConfig.locationName || '',
          'address': schema.address
        };

        // Ajout des coordonnées géographiques si disponibles
        if (schema.geo) {
          schema.location.geo = schema.geo;
          delete schema.geo;
        }
      }
      if (schemaConfig.organizer) {
        schema.organizer = {
          '@type': 'Organization',
          'name': schemaConfig.organizer,
          'url': schemaConfig.organizerUrl || ''
        };
      }
      if (schemaConfig.performer) {
        schema.performer = {
          '@type': 'Person',
          'name': schemaConfig.performer
        };
      }

      // Offre et disponibilité des billets
      if (schemaConfig.offerPrice || schemaConfig.offerAvailability) {
        schema.offers = {
          '@type': 'Offer',
          'price': schemaConfig.offerPrice || '0',
          'priceCurrency': schemaConfig.currency || 'EUR',
          'availability': schemaConfig.offerAvailability || 'https://schema.org/InStock',
          'url': schemaConfig.offerUrl || fullUrl,
          'validFrom': schemaConfig.offerValidFrom || schemaConfig.datePublished || ''
        };
      }

      // Statut de l'événement
      if (schemaConfig.eventStatus) schema.eventStatus = schemaConfig.eventStatus;
      if (schemaConfig.eventAttendanceMode) schema.eventAttendanceMode = schemaConfig.eventAttendanceMode;
      break;

    case 'WebSite':
      if (schemaConfig.url || fullUrl) schema.url = schemaConfig.url || fullUrl;
      if (schemaConfig.name) schema.name = schemaConfig.name;
      if (schemaConfig.description) schema.description = schemaConfig.description;
      if (schemaConfig.publisher) {
        schema.publisher = {
          '@type': 'Organization',
          'name': schemaConfig.publisher,
          'logo': schemaConfig.publisherLogo ? {
            '@type': 'ImageObject',
            'url': schemaConfig.publisherLogo
          } : undefined
        };
      }
      if (schemaConfig.inLanguage) schema.inLanguage = schemaConfig.inLanguage;

      // Recherche sur le site
      schema.potentialAction = {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${fullUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      };
      break;
  }

  return JSON.stringify(schema, null, 2);
}; 