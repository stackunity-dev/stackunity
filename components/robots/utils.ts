import { RobotsConfig, SchemaConfig, SiteConfig } from './types';

export function fillConfigsFromAudit(
  report: any,
  siteConfig: SiteConfig,
  schemaConfig: SchemaConfig,
  robotsConfig: RobotsConfig
): { siteConfig: SiteConfig; schemaConfig: SchemaConfig; robotsConfig: RobotsConfig } {

  const newSiteConfig = { ...siteConfig };
  const newSchemaConfig = { ...schemaConfig };
  const newRobotsConfig = { ...robotsConfig };

  try {
    if (!report || !report.seoResults) {
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    const urls = Object.keys(report.seoResults);
    if (urls.length === 0) {
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    const mainUrl = urls[0];
    const mainPageData = report.seoResults[mainUrl];

    if (!mainPageData) {
      return { siteConfig: newSiteConfig, schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig };
    }

    if (mainPageData.technicalSEO) {

      if (mainPageData.technicalSEO.sitemapFound && mainPageData.technicalSEO.sitemapUrl) {
        try {
          const sitemapUrl = new URL(mainPageData.technicalSEO.sitemapUrl);
          newRobotsConfig.sitemapUrl = sitemapUrl.pathname;
        } catch (e) {
          newRobotsConfig.sitemapUrl = '/sitemap.xml';
        }
      }

      if (mainPageData.technicalSEO.robotsTxtFound && mainPageData.technicalSEO.robotsTxtContent) {
        const robotsContent = mainPageData.technicalSEO.robotsTxtContent;

        const disallowMatches = robotsContent.match(/Disallow:\s*([^\n]+)/g);
        if (disallowMatches) {
          const disallowedPaths = disallowMatches.map(line => {
            const path = line.replace(/Disallow:\s*/, '').trim();
            return path;
          }).filter(Boolean);

          if (disallowedPaths.length > 0) {
            newRobotsConfig.disallowedPaths = [...new Set([
              ...newRobotsConfig.disallowedPaths,
              ...disallowedPaths
            ])];
          }
        }

        const allowMatches = robotsContent.match(/Allow:\s*([^\n]+)/g);
        if (allowMatches) {
          const allowedPaths = allowMatches.map(line => {
            const path = line.replace(/Allow:\s*/, '').trim();
            return path;
          }).filter(Boolean);

          if (allowedPaths.length > 0) {
            newRobotsConfig.allowedPaths = [...new Set([
              ...newRobotsConfig.allowedPaths,
              ...allowedPaths
            ])];
          }
        }
      }
    }

    if (mainPageData.seo) {
      if (mainPageData.seo.title && !newSchemaConfig.name) {
        const title = mainPageData.seo.title;
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

      if (mainPageData.seo.description && !newSchemaConfig.description) {
        newSchemaConfig.description = mainPageData.seo.description;
      }

      if (!newSchemaConfig.url) {
        newSchemaConfig.url = mainUrl;
      }

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
    console.error('Error filling configs from audit:', error);
    return {
      siteConfig: siteConfig,
      schemaConfig: schemaConfig,
      robotsConfig: robotsConfig
    };
  }
}

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

  if (robotsConfig.crawlDelay) {
    content += `Crawl-delay: ${robotsConfig.crawlDelay}\n`;
  }

  if (robotsConfig.allowedPaths && robotsConfig.allowedPaths.length > 0) {
    robotsConfig.allowedPaths.forEach(path => {
      content += `Allow: ${path}\n`;
    });
  }

  if (robotsConfig.disallowedPaths && robotsConfig.disallowedPaths.length > 0) {
    robotsConfig.disallowedPaths.forEach(path => {
      content += `Disallow: ${path}\n`;
    });
  }

  if (robotsConfig.sitemapUrl) {
    content += `\nSitemap: ${siteConfig.protocol}://${siteConfig.domain}${robotsConfig.sitemapUrl.startsWith('/') ? robotsConfig.sitemapUrl : '/' + robotsConfig.sitemapUrl}\n`;
  }

  content += `\nHost: ${siteConfig.protocol}://${siteConfig.domain}\n`;

  return content;
};

export const generateSchemaContent = (siteConfig: SiteConfig, schemaConfig: SchemaConfig): string => {
  const fullUrl = `${siteConfig.protocol}://${siteConfig.domain}`;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': schemaConfig.type
  };

  const processValue = (value: any): any => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (typeof value === 'object' && value !== null) {
      return value;
    }

    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }

    return value;
  };

  if (schemaConfig.name) schema.name = schemaConfig.name;
  if (schemaConfig.description) schema.description = schemaConfig.description;
  if (schemaConfig.url) schema.url = schemaConfig.url;
  else if (fullUrl) schema.url = fullUrl;
  if (schemaConfig.image) schema.image = schemaConfig.image;
  if (schemaConfig.telephone) schema.telephone = schemaConfig.telephone;
  if (schemaConfig.email) schema.email = schemaConfig.email;

  if (schemaConfig.address || schemaConfig.city || schemaConfig.region) {
    if (typeof schemaConfig.address === 'string' && schemaConfig.address.startsWith('{')) {
      try {
        schema.address = JSON.parse(schemaConfig.address);
      } catch (e) {
        schema.address = {
          '@type': 'PostalAddress',
          'streetAddress': schemaConfig.address || '',
          'addressLocality': schemaConfig.city || '',
          'addressRegion': schemaConfig.region || '',
          'postalCode': schemaConfig.postalCode || '',
          'addressCountry': schemaConfig.country || 'FR'
        };
      }
    } else {
      schema.address = {
        '@type': 'PostalAddress',
        'streetAddress': schemaConfig.address || '',
        'addressLocality': schemaConfig.city || '',
        'addressRegion': schemaConfig.region || '',
        'postalCode': schemaConfig.postalCode || '',
        'addressCountry': schemaConfig.country || 'FR'
      };
    }
  }

  if (schemaConfig.latitude && schemaConfig.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      'latitude': schemaConfig.latitude,
      'longitude': schemaConfig.longitude
    };
  }

  switch (schemaConfig.type) {
    case 'Organization':
      if (schemaConfig.logo) {
        if (typeof schemaConfig.logo === 'object' && schemaConfig.logo !== null) {
          schema.logo = schemaConfig.logo;
        } else if (typeof schemaConfig.logo === 'string' && schemaConfig.logo.startsWith('{')) {
          try {
            schema.logo = JSON.parse(schemaConfig.logo);
          } catch (e) {
            schema.logo = {
              '@type': 'ImageObject',
              'url': schemaConfig.logo,
              'width': '512',
              'height': '512'
            };
          }
        } else {
          schema.logo = {
            '@type': 'ImageObject',
            'url': schemaConfig.logo,
            'width': '512',
            'height': '512'
          };
        }
      }

      if (schemaConfig.socialProfiles) {
        if (typeof schemaConfig.socialProfiles === 'string') {
          try {
            schema.sameAs = JSON.parse(schemaConfig.socialProfiles);
          } catch (e) {
          }
        } else if (Array.isArray(schemaConfig.socialProfiles) && schemaConfig.socialProfiles.length) {
          schema.sameAs = schemaConfig.socialProfiles;
        }
      }

      if (schemaConfig.foundingDate) schema.foundingDate = schemaConfig.foundingDate;
      if (schemaConfig.legalName) schema.legalName = schemaConfig.legalName;
      if (schemaConfig.numberOfEmployees) {
        if (typeof schemaConfig.numberOfEmployees === 'object') {
          schema.numberOfEmployees = schemaConfig.numberOfEmployees;
        } else {
          schema.numberOfEmployees = {
            '@type': 'QuantitativeValue',
            'value': schemaConfig.numberOfEmployees
          };
        }
      }

      if (schemaConfig.potentialAction || schemaConfig.email) {
        schema.potentialAction = {
          '@type': 'ContactAction',
          'name': 'Contact',
          'target': schemaConfig.potentialAction || `mailto:${schemaConfig.email}`
        };
      }

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

      if (schemaConfig.deliveryAvailable) schema.hasDeliveryMethod = "http://schema.org/DeliveryModeOwnFleet";
      if (schemaConfig.acceptsReservations) schema.acceptsReservations = "True";

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

      if (schemaConfig.knowsAbout && schemaConfig.knowsAbout.length) {
        schema.knowsAbout = schemaConfig.knowsAbout;
      }

      if (schemaConfig.nationality) {
        schema.nationality = {
          '@type': 'Country',
          'name': schemaConfig.nationality
        };
      }

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

      if (schemaConfig.price || schemaConfig.availability) {
        schema.offers = {
          '@type': 'Offer',
          'price': schemaConfig.price || '0',
          'priceCurrency': schemaConfig.currency || 'EUR',
          'availability': schemaConfig.availability || 'https://schema.org/InStock',
          'url': schemaConfig.url || fullUrl
        };
      }

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

      if (schemaConfig.inLanguage) schema.inLanguage = schemaConfig.inLanguage;
      if (schemaConfig.copyrightYear) schema.copyrightYear = schemaConfig.copyrightYear;

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

  try {
    const jsonSchema = JSON.stringify(schema, null, 2);
    JSON.parse(jsonSchema);

    return jsonSchema;
  } catch (error) {
    console.error('Error generating schema JSON-LD:', error);

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': schemaConfig.type,
      'name': processValue(schemaConfig.name) || 'Website',
      'url': fullUrl
    }, null, 2);
  }
}; 