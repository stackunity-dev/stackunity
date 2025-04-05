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

export function fillConfigsFromAudit(
  report: any,
  siteConfig: SiteConfig,
  schemaConfig: SchemaConfig,
  robotsConfig: RobotsConfig
): { siteConfig: SiteConfig; schemaConfig: SchemaConfig; robotsConfig: RobotsConfig } {

  // Cloner les configs pour éviter la modification directe
  const newSiteConfig = { ...siteConfig };
  const newSchemaConfig = { ...schemaConfig };
  const newRobotsConfig = { ...robotsConfig };

  try {
    if (!report || !report.seoResults) {
      console.log('Rapport invalide ou vide');
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    // Trouver la page principale dans les résultats (généralement la première)
    const urls = Object.keys(report.seoResults);
    if (urls.length === 0) {
      console.log('Aucune URL analysée dans le rapport');
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    // Utiliser uniquement la page principale comme source de données
    const mainUrl = urls[0];
    const mainPageData = report.seoResults[mainUrl];
    console.log('Analyse des données de la page principale:', mainUrl);

    if (!mainPageData) {
      console.log('Données non trouvées pour', mainUrl);
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    // Récupérer les données de sitemap et robots.txt de la page principale uniquement
    if (mainPageData.technicalSEO) {
      console.log('Données techniques SEO trouvées pour', mainUrl);

      // Sitemap
      if (mainPageData.technicalSEO.sitemapFound && mainPageData.technicalSEO.sitemapUrl) {
        try {
          const sitemapUrl = new URL(mainPageData.technicalSEO.sitemapUrl);
          newRobotsConfig.sitemapUrl = sitemapUrl.pathname;
          console.log('Sitemap trouvé:', newRobotsConfig.sitemapUrl);
        } catch (e) {
          console.error('Erreur lors du parsing de l\'URL du sitemap:', e);
          // Utiliser le chemin par défaut
          newRobotsConfig.sitemapUrl = '/sitemap.xml';
        }
      }

      // Robots.txt
      if (mainPageData.technicalSEO.robotsTxtFound && mainPageData.technicalSEO.robotsTxtContent) {
        console.log('Robots.txt trouvé pour', mainUrl);
        const robotsContent = mainPageData.technicalSEO.robotsTxtContent;

        // Extraire les chemins Disallow
        const disallowMatches = robotsContent.match(/Disallow:\s*([^\n]+)/g);
        if (disallowMatches) {
          const disallowedPaths = disallowMatches.map(line => {
            const path = line.replace(/Disallow:\s*/, '').trim();
            return path;
          }).filter(Boolean); // Filtrer les valeurs vides

          if (disallowedPaths.length > 0) {
            // Fusionner avec les chemins existants et supprimer les doublons
            newRobotsConfig.disallowedPaths = [...new Set([
              ...newRobotsConfig.disallowedPaths,
              ...disallowedPaths
            ])];
          }
        }

        // Extraire les chemins Allow
        const allowMatches = robotsContent.match(/Allow:\s*([^\n]+)/g);
        if (allowMatches) {
          const allowedPaths = allowMatches.map(line => {
            const path = line.replace(/Allow:\s*/, '').trim();
            return path;
          }).filter(Boolean); // Filtrer les valeurs vides

          if (allowedPaths.length > 0) {
            // Fusionner avec les chemins existants et supprimer les doublons
            newRobotsConfig.allowedPaths = [...new Set([
              ...newRobotsConfig.allowedPaths,
              ...allowedPaths
            ])];
          }
        }
      }
    }

    // Configuration du Schema.org
    if (mainPageData.seo) {
      // Titre du site
      if (mainPageData.seo.title && !newSchemaConfig.name) {
        // Extraire un nom raisonnable du titre
        const title = mainPageData.seo.title;
        // Si le titre contient un séparateur, prendre la première partie
        const separators = ['-', '|', ':', '•', '·', '—'];
        let name = title;

        for (const separator of separators) {
          if (title.includes(separator)) {
            const parts = title.split(separator);
            name = parts[0].trim();
            break;
          }
        }

        newSchemaConfig.name = name;
      }

      // Description
      if (mainPageData.seo.description && !newSchemaConfig.description) {
        newSchemaConfig.description = mainPageData.seo.description;
      }

      // URL
      if (!newSchemaConfig.url) {
        newSchemaConfig.url = mainUrl;
      }

      // Extraire des données pour Schema.org si disponibles
      if (mainPageData.schemaOrg && mainPageData.schemaOrg.contactInfo) {
        const contactInfo = mainPageData.schemaOrg.contactInfo;

        if (contactInfo.telephone && !newSchemaConfig.telephone) {
          newSchemaConfig.telephone = contactInfo.telephone;
        }

        if (contactInfo.email && !newSchemaConfig.email) {
          newSchemaConfig.email = contactInfo.email;
        }

        if (contactInfo.address && !newSchemaConfig.address) {
          newSchemaConfig.address = contactInfo.address;
        }
      }
    }

    return {
      siteConfig: newSiteConfig,
      schemaConfig: newSchemaConfig,
      robotsConfig: newRobotsConfig
    };
  } catch (error) {
    console.error('Erreur lors du remplissage des configurations à partir de l\'audit:', error);
    return {
      siteConfig: siteConfig,
      schemaConfig: schemaConfig,
      robotsConfig: robotsConfig
    };
  }
}

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