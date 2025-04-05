<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <v-alert type="info" variant="tonal" icon="mdi-information-outline" class="mb-6" closable elevation="2">
          <div class="d-flex align-center">
            <div>
              <div class="text-subtitle-1 font-weight-bold mb-1">
                Data Privacy Notice
              </div>
              <div class="text-body-2">
                No data is collected or stored on our servers during the generation process. All content is processed
                locally in your browser.
              </div>
            </div>
          </div>
        </v-alert>

        <v-alert v-if="error" type="error" variant="tonal" icon="mdi-alert-circle" class="mt-4 mb-4" closable>
          <div class="d-flex flex-column">
            <div>{{ error }}</div>
            <div v-if="error && (error.includes('Chrome') || error.includes('chromium'))" class="mt-2 text-caption">
              <v-divider class="my-2"></v-divider>
              <div class="font-weight-bold">Information :</div>
              <p>The SEO audit failed, but you can still generate content with the current data.</p>
              <div class="font-weight-bold mt-1">Possible solutions for the audit:</div>
              <ul>
                <li>Check that Google Chrome is installed on the server</li>
                <li>The server user must have access to the chrome.exe file</li>
              </ul>
            </div>
          </div>
        </v-alert>

        <v-row>
          <v-col cols="12" lg="4">
            <v-card class="rounded-lg" elevation="3">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-cog</v-icon>
                Configuration
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                  <v-icon color="primary" class="mr-2">mdi-web</v-icon>
                  Website Information
                </div>
                <v-text-field v-model="siteConfig.domain" label="Website Domain" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-web" placeholder="example.com"
                  hint="Enter your website domain without protocol (http/https)" persistent-hint
                  class="mb-4"></v-text-field>

                <v-select v-model="siteConfig.protocol" :items="['https', 'http']" label="Protocol" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-shield-lock" class="mb-4"></v-select>

                <v-switch v-model="skipApiAnalysis" label="Generate without site analysis (use only input data)"
                  color="primary" hint="Enable this option if the site analysis fails" persistent-hint class="mb-4">
                </v-switch>

                <v-tabs v-model="configTab" color="primary" align-tabs="center" class="mb-4 rounded-lg">
                  <v-tab value="robots" class="py-3 px-4">
                    <v-icon start>mdi-robot</v-icon>
                    Robots.txt
                  </v-tab>
                  <v-tab value="schema" class="py-3 px-4">
                    <v-icon start>mdi-code-json</v-icon>
                    Schema.org
                  </v-tab>
                </v-tabs>

                <v-window v-model="configTab">
                  <v-window-item value="robots">
                    <div>
                      <RobotsConfigComponent :robots-config="robotsConfig" />

                      <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
                        <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-folder</v-icon>
                          Path Management
                        </div>

                        <v-expansion-panels variant="accordion" class="mb-4 rounded-lg">
                          <v-expansion-panel>
                            <v-expansion-panel-title class="rounded-t-lg">
                              <div class="d-flex align-center">
                                <v-icon color="error" class="mr-2">mdi-block-helper</v-icon>
                                Disallowed Paths
                                <v-chip color="error" size="small" class="ml-2">
                                  {{ robotsConfig.disallowedPaths.length }}
                                </v-chip>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-list>
                                <v-list-item v-for="(path, index) in robotsConfig.disallowedPaths" :key="index">
                                  <template v-slot:prepend>
                                    <v-icon color="error">mdi-block-helper</v-icon>
                                  </template>
                                  <v-list-item-title>{{ path }}</v-list-item-title>
                                  <template v-slot:append>
                                    <v-btn icon="mdi-delete" variant="text" color="error" density="comfortable"
                                      @click="removeDisallowedPath(index)"></v-btn>
                                  </template>
                                </v-list-item>
                              </v-list>

                              <div class="d-flex align-center mt-4">
                                <v-text-field v-model="newDisallowedPath" label="Path to disallow" variant="outlined"
                                  density="comfortable" placeholder="/admin" class="mr-2" hide-details></v-text-field>
                                <v-btn color="error" icon="mdi-plus" @click="addDisallowedPath"
                                  :disabled="!newDisallowedPath"></v-btn>
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>

                          <v-expansion-panel>
                            <v-expansion-panel-title>
                              <div class="d-flex align-center">
                                <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
                                Allowed Paths
                                <v-chip color="success" size="small" class="ml-2">
                                  {{ robotsConfig.allowedPaths.length }}
                                </v-chip>
                              </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-list>
                                <v-list-item v-for="(path, index) in robotsConfig.allowedPaths" :key="index">
                                  <template v-slot:prepend>
                                    <v-icon color="success">mdi-check-circle</v-icon>
                                  </template>
                                  <v-list-item-title>{{ path }}</v-list-item-title>
                                  <template v-slot:append>
                                    <v-btn icon="mdi-delete" variant="text" color="error" density="comfortable"
                                      @click="removeAllowedPath(index)"></v-btn>
                                  </template>
                                </v-list-item>
                              </v-list>

                              <div class="d-flex align-center mt-4">
                                <v-text-field v-model="newAllowedPath" label="Path to allow" variant="outlined"
                                  density="comfortable" placeholder="/public" class="mr-2" hide-details></v-text-field>
                                <v-btn color="success" icon="mdi-plus" @click="addAllowedPath"
                                  :disabled="!newAllowedPath"></v-btn>
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-card>
                    </div>
                  </v-window-item>

                  <v-window-item value="schema">
                    <SchemaConfigComponent :schema-config="schemaConfig" />
                  </v-window-item>
                </v-window>

                <div class="d-flex justify-end mt-4">
                  <v-btn color="primary" size="large" prepend-icon="mdi-play" :loading="isLoading"
                    @click="analyzeWebsite">
                    {{ isLoading ? 'Analysing...' : 'Generate Content' }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="8">
            <v-card class="rounded-lg" elevation="3" v-if="generatedContent">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-file-document</v-icon>
                Generated Code
              </v-card-title>

              <CodePreview :code="generatedContent" :is-robots="configTab === 'robots'" :schema-type="schemaConfig.type"
                :robots-lines="robotsPreviewLines" />
            </v-card>

            <v-card class="rounded-lg mt-6" v-if="!generatedContent">
              <v-card-text class="pa-0">
                <div class="d-flex flex-column align-center justify-center pa-10">
                  <v-icon color="grey-lighten-1" size="64" class="mb-4">mdi-file-document-outline</v-icon>
                  <span class="text-h6 text-grey-darken-1">Configure your settings</span>
                  <span class="text-subtitle-1 text-grey-darken-1">and click "Generate"</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import CodePreview from '../components/robots/CodePreview.vue';
import RobotsConfigComponent from '../components/robots/RobotsConfig.vue';
import SchemaConfigComponent from '../components/robots/SchemaConfig.vue';
import { RobotsConfig, RobotsPreviewLine, SchemaConfig, SiteConfig } from '../components/robots/types';
import { fillConfigsFromAudit, generateRobotsContent, generateSchemaContent } from '../components/robots/utils';

import { useUserStore } from '../stores/userStore';

definePageMeta({
  middleware: 'premium',
  layout: 'dashboard',
  requiresPremium: true
});

useHead({
  title: 'Robots.txt & Schema.org Generator',
  meta: [
    { name: 'description', content: 'Generate robots.txt files and Schema.org structured data for your website' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});

if (process.client) {
  window.addEventListener('error', (event) => {
    if (event.target && (event.target as HTMLElement).tagName === 'SCRIPT') {
      const src = (event.target as HTMLScriptElement).src || '';
      if (src.includes('plausible') || src.includes('analytics')) {
        console.warn('Analytics script blocked by adblocker:', src);
        event.preventDefault();
      }
    }
  }, true);
}

const userStore = useUserStore();


const configTab = ref('robots');
const isLoading = ref(false);
const error = ref('');
const report = ref(null);
const generatedContent = ref('');
const skipApiAnalysis = ref(false);

const siteConfig = ref<SiteConfig>({
  domain: '',
  protocol: 'https'
});

const robotsConfig = ref<RobotsConfig>({
  userAgent: 'All robots',
  customUserAgent: '',
  crawlDelay: '',
  disallowedPaths: ['/admin', '/private', '/login', '/wp-admin'] as string[],
  allowedPaths: [] as string[],
  sitemapUrl: '/sitemap.xml',
  contact: ''
});

const schemaConfig = ref<SchemaConfig>({
  type: 'Organization',
  name: '',
  description: '',
  url: '',
  image: '',
  telephone: '',
  email: '',
  address: '',
  logo: '',
  socialProfiles: [],
  foundingDate: '',
  legalName: '',
  numberOfEmployees: '',
  jobTitle: '',
  givenName: '',
  familyName: '',
  birthDate: '',
  worksFor: '',
  alumniOf: '',
  price: '',
  currency: '',
  availability: '',
  brand: '',
  category: '',
  sku: '',
  gtin: '',
  mpn: '',
  color: '',
  material: '',
  headline: '',
  author: '',
  datePublished: '',
  dateModified: '',
  publisher: '',
  keywords: '',
  articleSection: '',
  articleBody: '',
  openingHours: '',
  priceRange: '',
  areaServed: '',
  hasMap: '',
  geo: '',
  faxNumber: '',
  aggregateRating: '',
  potentialAction: '',
  inLanguage: '',
  copyrightYear: '',
  startDate: '',
  endDate: '',
  location: '',
  organizer: '',
  performer: '',
  offers: '',
  eventStatus: '',
  eventAttendanceMode: '',
  servesCuisine: '',
  menu: '',
  acceptsReservations: false,
  driveThrough: false,
  deliveryAvailable: false,
  city: '',
  region: '',
  postalCode: '',
  country: '',
  latitude: '',
  longitude: '',
  ratingValue: '',
  ratingCount: '',
  reviewCount: '',
  nationality: '',
  knowsAbout: [],
  weight: '',
  locationName: '',
  publisherLogo: '',
  organizerUrl: '',
  offerPrice: '',
  offerAvailability: '',
  offerUrl: '',
  offerValidFrom: ''
});

const newDisallowedPath = ref('');
const newAllowedPath = ref('');

const addDisallowedPath = () => {
  if (newDisallowedPath.value) {
    robotsConfig.value.disallowedPaths.push(newDisallowedPath.value);
    newDisallowedPath.value = '';
  }
};

const removeDisallowedPath = (index: number) => {
  robotsConfig.value.disallowedPaths.splice(index, 1);
};

const addAllowedPath = () => {
  if (newAllowedPath.value) {
    robotsConfig.value.allowedPaths.push(newAllowedPath.value);
    newAllowedPath.value = '';
  }
};

const removeAllowedPath = (index: number) => {
  robotsConfig.value.allowedPaths.splice(index, 1);
};

const fillDefaultConfigs = () => {
  if (!siteConfig.value.domain) {
    return;
  }

  try {
    const domain = siteConfig.value.domain.replace(/^www\./, '');

    if (!schemaConfig.value.name) {
      schemaConfig.value.name = domain;
    }

    if (!schemaConfig.value.description) {
      schemaConfig.value.description = `Site officiel de ${domain}`;
    }

    if (!schemaConfig.value.url) {
      schemaConfig.value.url = `${siteConfig.value.protocol}://${siteConfig.value.domain}`;
    }

    const commonDisallowedPaths = ['/admin', '/wp-admin', '/login', '/private', '/cgi-bin', '/wp-includes', '/backend'];
    commonDisallowedPaths.forEach(path => {
      if (!robotsConfig.value.disallowedPaths.includes(path)) {
        robotsConfig.value.disallowedPaths.push(path);
      }
    });

    if (!robotsConfig.value.sitemapUrl) {
      robotsConfig.value.sitemapUrl = '/sitemap.xml';
    }

    console.log('Default configurations applied');
  } catch (e) {
    console.error('Error applying default configurations:', e);
  }
};

const analyzeWebsite = async () => {
  if (!siteConfig.value.domain) {
    error.value = 'Please enter a valid domain.';
    return;
  }

  const startTime = performance.now();
  const generationType = configTab.value === 'robots' ? 'robots.txt' : 'schema.org';

  try {
    isLoading.value = true;
    error.value = '';

    const url = `${siteConfig.value.protocol}://${siteConfig.value.domain}`;
    console.log('URL to analyze:', url);

    const options = {
      maxDepth: 1,
      sameDomainOnly: true,
      timeout: 30000,
      checkSitemap: true,
      checkRobotsTxt: true,
      maxUrlsToAnalyze: 5
    };

    if (!skipApiAnalysis.value) {
      try {
        report.value = await userStore.auditSEO(url, options);
        console.log('Report received:', report.value);

        if (report.value) {
          const reportData = report.value as any;
          if (reportData.seoResults && Object.keys(reportData.seoResults).length > 0) {
            const mainUrl = Object.keys(reportData.seoResults)[0];
            const mainResult = reportData.seoResults[mainUrl];

            if (mainResult && mainResult.technicalSEO) {
              console.log('Technical SEO data found:', mainResult.technicalSEO);

              if (mainResult.technicalSEO.sitemapFound && mainResult.technicalSEO.sitemapUrl) {
                try {
                  const sitemapUrl = new URL(mainResult.technicalSEO.sitemapUrl);
                  robotsConfig.value.sitemapUrl = sitemapUrl.pathname;
                  console.log('Sitemap found:', robotsConfig.value.sitemapUrl);
                } catch (e) {
                  robotsConfig.value.sitemapUrl = '/sitemap.xml';
                }
              }

              if (mainResult.technicalSEO.robotsTxtFound && mainResult.technicalSEO.robotsTxtContent) {
                console.log('Robots.txt found:', mainResult.technicalSEO.robotsTxtContent);
                const robotsContent = mainResult.technicalSEO.robotsTxtContent;

                const disallowMatches = robotsContent.match(/Disallow:\s*([^\n]+)/g);
                if (disallowMatches) {
                  const disallowedPaths = disallowMatches.map(line => {
                    const path = line.replace(/Disallow:\s*/, '').trim();
                    return path;
                  });

                  if (disallowedPaths.length > 0) {
                    robotsConfig.value.disallowedPaths = [...new Set([...robotsConfig.value.disallowedPaths, ...disallowedPaths])];
                  }
                }

                const allowMatches = robotsContent.match(/Allow:\s*([^\n]+)/g);
                if (allowMatches) {
                  const allowedPaths = allowMatches.map(line => {
                    const path = line.replace(/Allow:\s*/, '').trim();
                    return path;
                  });

                  if (allowedPaths.length > 0) {
                    robotsConfig.value.allowedPaths = [...new Set([...robotsConfig.value.allowedPaths, ...allowedPaths])];
                  }
                }
              }
            }
          }

          const { schemaConfig: newSchemaConfig, robotsConfig: newRobotsConfig, siteConfig: newSiteConfig } =
            fillConfigsFromAudit(report.value, siteConfig.value, schemaConfig.value, robotsConfig.value);

          schemaConfig.value = newSchemaConfig;
          robotsConfig.value = newRobotsConfig;
          siteConfig.value = newSiteConfig;
        }
      } catch (auditError: any) {
        console.error('Error during SEO audit:', auditError);

        let errorMessage = 'An error occurred during site analysis';

        if (auditError.message) {
          if (auditError.message.includes('500')) {
            errorMessage = 'The analysis server encountered an error (500). This may be due to server overload or a problem with the site being analyzed.';
          } else if (auditError.message.includes('404')) {
            errorMessage = 'The requested site was not found (404). Check that the URL is correct and the site is accessible.';
          } else if (auditError.message.includes('ERR_CONNECTION_REFUSED') || auditError.message.includes('Failed to fetch')) {
            errorMessage = 'Impossible to connect to the site. Ensure the site is accessible and your internet connection is working.';
          } else if (auditError.message.includes('TIMEOUT')) {
            errorMessage = 'The analysis took too long and was interrupted. Try analyzing a smaller site or increase the timeout.';
          } else {
            errorMessage = `The site analysis failed: ${auditError.message}`;
          }
        }

        error.value = `${errorMessage} You can still generate content with the current settings.`;

        fillDefaultConfigs();
      }
    } else {
      console.log('API analysis disabled - using input data');
      fillDefaultConfigs();
    }

    generatePreviewContent();

    if (error.value && generatedContent.value) {
      error.value = `Warning: ${error.value}`;
    }

    const endTime = performance.now();
    console.log(`The site analysis took ${Math.round(endTime - startTime)}ms`);
  } catch (e) {
    console.error('Error during site analysis:', e);
    error.value = e.message || 'An error occurred during site analysis.';

    fillDefaultConfigs();

    try {
      generatePreviewContent();
    } catch (contentError) {
      console.error('Impossible de générer le contenu:', contentError);
    }

    const endTime = performance.now();
    console.log(`Operation ended in ${Math.round(endTime - startTime)}ms with error`);
  } finally {
    isLoading.value = false;
  }
};

const formatRobotsPreview = (content: string): RobotsPreviewLine[] => {
  if (!content) return [];

  return content.split('\n').map(line => {
    const isUserAgent = line.startsWith('User-agent:');
    const isDisallow = line.startsWith('Disallow:');
    const isAllow = line.startsWith('Allow:');
    const isSitemap = line.startsWith('Sitemap:');
    const isCrawlDelay = line.startsWith('Crawl-delay:');
    const isHost = line.startsWith('Host:');

    let type = 'default';
    if (isUserAgent) type = 'user-agent';
    else if (isDisallow) type = 'disallow';
    else if (isAllow) type = 'allow';
    else if (isSitemap) type = 'sitemap';
    else if (isCrawlDelay) type = 'crawl-delay';
    else if (isHost) type = 'host';

    return {
      content: line,
      type,
      text: line,
      bold: isUserAgent || isDisallow || isAllow || isSitemap || isCrawlDelay,
      comment: line.trim().startsWith('#')
    };
  });
};

const generatePreviewContent = () => {
  try {
    if (configTab.value === 'robots') {
      generatedContent.value = generateRobotsContent(siteConfig.value, robotsConfig.value);
      robotsPreviewLines.value = formatRobotsPreview(generatedContent.value);
    } else {
      generatedContent.value = generateSchemaContent(siteConfig.value, schemaConfig.value);
    }
  } catch (e) {
    console.error('Erreur lors de la génération de contenu:', e);
    error.value = e.message || 'Une erreur est survenue lors de la génération du contenu.';
  }
};

const getSchemaIcon = () => {
  const icons: Record<string, { icon: string; color: string }> = {
    Organization: { icon: 'mdi-office-building', color: 'blue' },
    Person: { icon: 'mdi-account', color: 'purple' },
    Product: { icon: 'mdi-package-variant', color: 'green' },
    Article: { icon: 'mdi-newspaper', color: 'orange' },
    LocalBusiness: { icon: 'mdi-store', color: 'cyan' },
    WebSite: { icon: 'mdi-web', color: 'indigo' },
    Event: { icon: 'mdi-calendar', color: 'red' },
    Restaurant: { icon: 'mdi-food', color: 'amber' }
  };
  return icons[schemaConfig.value.type] || { icon: 'mdi-shape', color: 'primary' };
};

const robotsPreviewLines = ref<RobotsPreviewLine[]>([]);
</script>

<style scoped></style>
