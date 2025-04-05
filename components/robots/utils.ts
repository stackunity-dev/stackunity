import type { WebsiteAnalysisResult } from '../../server/api/analyzer-types';
import { RobotsConfig, SchemaConfig, SiteConfig } from './types';

// Utilisation de types partiels au lieu d'héritage pour éviter les erreurs
type ExtendedSEOResult = Partial<WebsiteAnalysisResult> & {
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
  schemaOrg?: {
    suggestions: Array<{
      type: string;
      properties: Record<string, any>;
      template: string;
    }>;
  };
};

type ExtendedCrawlReport = Partial<WebsiteAnalysisResult> & {
  seoResults?: Record<string, ExtendedSEOResult>;
};

export const fillConfigsFromAudit = (
  report: any,
  siteConfig: SiteConfig,
  schemaConfig: SchemaConfig,
  robotsConfig: RobotsConfig
) => {
  const extReport = report as unknown as ExtendedCrawlReport;

  if (extReport && extReport.seoResults) {
    const disallowedPaths = new Set<string>(robotsConfig.disallowedPaths);

    Object.entries(extReport.seoResults).forEach(([url, result]: [string, any]) => {
      if (result.robotsMeta && result.robotsMeta.noindex) {
        try {
          const urlObj = new URL(url);
          disallowedPaths.add(urlObj.pathname);
        } catch (e) {
          console.error('Erreur lors du parsing de l\'URL:', url);
        }
      }

      // Utiliser les données technicalSEO pour sitemap et robots.txt
      if (result.technicalSEO) {
        // Si un sitemap est trouvé, mettre à jour le chemin
        if (result.technicalSEO.sitemapFound && result.technicalSEO.sitemapUrl) {
          try {
            const sitemapUrl = new URL(result.technicalSEO.sitemapUrl);
            robotsConfig.sitemapUrl = sitemapUrl.pathname;
          } catch (e) {
            // Si l'URL n'est pas valide, utiliser le chemin direct
            robotsConfig.sitemapUrl = '/sitemap.xml';
          }
        }

        // Si un robots.txt est trouvé, extraire les règles
        if (result.technicalSEO.robotsTxtFound && result.technicalSEO.robotsTxtContent) {
          const robotsContent = result.technicalSEO.robotsTxtContent;

          // Extraire l'agent utilisateur (User-agent)
          const userAgentMatch = robotsContent.match(/User-agent:\s*([^\n]+)/);
          if (userAgentMatch && userAgentMatch[1]) {
            const userAgent = userAgentMatch[1].trim();
            if (userAgent === '*') {
              robotsConfig.userAgent = 'All robots';
            } else if (['Googlebot', 'Bingbot', 'Slurp', 'Baiduspider'].includes(userAgent)) {
              robotsConfig.userAgent = {
                'Googlebot': 'Google',
                'Bingbot': 'Bing',
                'Slurp': 'Yahoo',
                'Baiduspider': 'Baidu'
              }[userAgent] || 'Custom';
            } else {
              robotsConfig.userAgent = 'Custom';
              robotsConfig.customUserAgent = userAgent;
            }
          }

          // Extraire le délai de crawl
          const crawlDelayMatch = robotsContent.match(/Crawl-delay:\s*([^\n]+)/);
          if (crawlDelayMatch && crawlDelayMatch[1]) {
            robotsConfig.crawlDelay = crawlDelayMatch[1].trim();
          }
        }
      }
    });

    // Mettre à jour les chemins à interdire
    if (disallowedPaths.size > 0) {
      robotsConfig.disallowedPaths = Array.from(disallowedPaths);
    }
  }

  // Exemples de champs à auto-remplir à partir de la page d'accueil
  const mainUrl = extReport.seoResults ? Object.keys(extReport.seoResults)[0] : '';
  const homeData = extReport.seoResults?.[mainUrl];

  if (homeData) {
    // Remplir le schéma avec les données du site
    if (homeData.seo?.title) {
      schemaConfig.name = homeData.seo.title;
    }

    if (homeData.seo?.description) {
      schemaConfig.description = homeData.seo.description;
    }

    // Intégrer les informations de SchemaOrg si disponibles
    if (homeData.schemaOrg && homeData.schemaOrg.suggestions && homeData.schemaOrg.suggestions.length > 0) {
      try {
        // Parcourir les suggestions pour trouver les plus pertinentes
        const organization = homeData.schemaOrg.suggestions.find((s: any) => s.type === 'Organization');
        const localBusiness = homeData.schemaOrg.suggestions.find((s: any) => s.type === 'LocalBusiness');
        const website = homeData.schemaOrg.suggestions.find((s: any) => s.type === 'WebSite');

        // Prioriser LocalBusiness, puis Organization, puis WebSite
        const bestSuggestion = localBusiness || organization || website;

        if (bestSuggestion) {
          const props = bestSuggestion.properties;

          // Adapter le type de schéma
          schemaConfig.type = bestSuggestion.type;

          // Appliquer les propriétés de base
          if (props.name) schemaConfig.name = props.name;
          if (props.description) schemaConfig.description = props.description;
          if (props.url) schemaConfig.url = props.url;

          // Informations de contact
          if (props.telephone) schemaConfig.telephone = props.telephone;
          if (props.email) schemaConfig.email = props.email;

          // Adresse
          if (props.address && props.address.streetAddress) {
            schemaConfig.address = props.address.streetAddress;
          }

          if (props.logo) {
            if (typeof props.logo === 'string') {
              schemaConfig.logo = props.logo;
            } else if (props.logo.url) {
              schemaConfig.logo = props.logo.url;
            }
          }

          if (props.image) {
            if (typeof props.image === 'string') {
              schemaConfig.image = props.image;
            } else if (props.image.url) {
              schemaConfig.image = props.image.url;
            }
          }
        }
      } catch (e) {
        console.error('Erreur lors de l\'intégration des données SchemaOrg:', e);
      }
    }

    // Extraire les informations structurées déjà présentes
    if (homeData.structuredData && homeData.structuredData.length > 0) {
      try {
        const existingSchema = homeData.structuredData[0];

        if (existingSchema['@type']) {
          // Vérifier si le type est pris en charge
          const supportedTypes = ['Organization', 'Person', 'Product', 'Article', 'LocalBusiness', 'WebSite', 'Event', 'Restaurant'];
          if (supportedTypes.includes(existingSchema['@type'])) {
            schemaConfig.type = existingSchema['@type'];
          }
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
        } else if (existingSchema.logo && typeof existingSchema.logo === 'string') {
          schemaConfig.logo = existingSchema.logo;
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

        // Extraire plus d'informations en fonction du type
        if (existingSchema['@type'] === 'Organization' || existingSchema['@type'] === 'LocalBusiness') {
          if (existingSchema.address && existingSchema.address.streetAddress) {
            schemaConfig.address = existingSchema.address.streetAddress;
            schemaConfig.city = existingSchema.address.addressLocality || '';
            schemaConfig.region = existingSchema.address.addressRegion || '';
            schemaConfig.postalCode = existingSchema.address.postalCode || '';
            schemaConfig.country = existingSchema.address.addressCountry || 'FR';
          }

          if (existingSchema.sameAs && Array.isArray(existingSchema.sameAs)) {
            schemaConfig.socialProfiles = existingSchema.sameAs;
          }
        }
      } catch (e) {
        console.error('Erreur lors de l\'extraction des données structurées:', e);
      }
    }

    // Extraire d'autres informations utiles
    if (homeData.seo?.headings && homeData.seo.headings.h1 && homeData.seo.headings.h1.length > 0) {
      if (!schemaConfig.name) {
        schemaConfig.name = homeData.seo.headings.h1[0];
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

  const sanitizeString = (str: string | undefined): string => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  };

  if (schemaConfig.name) schema.name = sanitizeString(schemaConfig.name);
  if (schemaConfig.description) schema.description = sanitizeString(schemaConfig.description);
  if (schemaConfig.url) schema.url = sanitizeString(schemaConfig.url);
  else if (fullUrl) schema.url = fullUrl;
  if (schemaConfig.image) schema.image = sanitizeString(schemaConfig.image);

  if (schemaConfig.telephone) schema.telephone = sanitizeString(schemaConfig.telephone);
  if (schemaConfig.email) schema.email = sanitizeString(schemaConfig.email);

  if (schemaConfig.address || schemaConfig.city || schemaConfig.region) {
    schema.address = {
      '@type': 'PostalAddress',
      'streetAddress': sanitizeString(schemaConfig.address) || '',
      'addressLocality': sanitizeString(schemaConfig.city) || '',
      'addressRegion': sanitizeString(schemaConfig.region) || '',
      'postalCode': sanitizeString(schemaConfig.postalCode) || '',
      'addressCountry': sanitizeString(schemaConfig.country) || 'FR'
    };
  }

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

  // Sérialisation JSON avec indentation et en s'assurant que les attributs spéciaux @context et @type sont bien formatés
  try {
    // Utiliser JSON.stringify pour une sérialisation correcte
    const jsonSchema = JSON.stringify(schema, null, 2);

    // Vérifier que le JSON est valide en le parsant à nouveau
    JSON.parse(jsonSchema);

    return jsonSchema;
  } catch (error) {
    console.error('Erreur lors de la génération du schema JSON-LD:', error);

    // En cas d'erreur, retourner un schema minimal valide
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': schemaConfig.type,
      'name': sanitizeString(schemaConfig.name) || 'Website',
      'url': fullUrl
    }, null, 2);
  }
}; 