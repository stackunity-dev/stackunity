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

                        <!-- Templates prédéfinis -->
                        <v-select v-model="selectedRobotsTemplate" :items="robotsTemplates" item-title="name"
                          item-value="value" label="Templates prédéfinis" variant="outlined" density="comfortable"
                          class="mb-4" @update:model-value="applyRobotsTemplate">
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                              </template>
                              <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                            </v-list-item>
                          </template>
                        </v-select>

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

                    <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
                      <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-code-json</v-icon>
                        Templates Schema.org
                      </div>

                      <v-select v-model="selectedSchemaTemplate" :items="schemaTemplates" item-title="name"
                        item-value="value" label="predefined templates" variant="outlined" density="comfortable"
                        class="mb-4" @update:model-value="applySchemaTemplate">
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                            </template>
                            <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-card>
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

const isClient = process.env.CLIENT;

if (isClient) {
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
      schemaConfig.value.description = `Official site of ${domain}`;
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

  try {
    isLoading.value = true;
    error.value = '';

    const url = `${siteConfig.value.protocol}://${siteConfig.value.domain}`;

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

        if (report.value) {
          const reportData = report.value as any;
          if (reportData.seoResults && Object.keys(reportData.seoResults).length > 0) {
            const mainUrl = Object.keys(reportData.seoResults)[0];
            const mainResult = reportData.seoResults[mainUrl];

            if (mainResult && mainResult.technicalSEO) {

              if (mainResult.technicalSEO.sitemapFound && mainResult.technicalSEO.sitemapUrl) {
                try {
                  const sitemapUrl = new URL(mainResult.technicalSEO.sitemapUrl);
                  robotsConfig.value.sitemapUrl = sitemapUrl.pathname;
                } catch (e) {
                  robotsConfig.value.sitemapUrl = '/sitemap.xml';
                }
              }

              if (mainResult.technicalSEO.robotsTxtFound && mainResult.technicalSEO.robotsTxtContent) {
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
    error.value = e.message || 'An error occurred while generating content.';
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

const robotsTemplates = ref([
  {
    name: 'WordPress',
    description: 'Optimal configuration for WordPress sites',
    icon: 'mdi-wordpress',
    color: 'blue',
    config: {
      userAgent: '*',
      customUserAgent: '',
      crawlDelay: '10',
      sitemapUrl: '/sitemap.xml',
      contact: 'webmaster@example.com'
    },
    rules: [
      { path: '/wp-admin/', type: 'disallow', severity: 'high', category: 'admin', description: 'Protège la zone d\'administration' },
      { path: '/wp-includes/', type: 'disallow', severity: 'medium', category: 'system', description: 'Protège les fichiers système' },
      { path: '/wp-content/plugins/', type: 'disallow', severity: 'medium', category: 'plugins', description: 'Protège les plugins' },
      { path: '/wp-content/themes/', type: 'disallow', severity: 'low', category: 'themes', description: 'Protège les thèmes' },
      { path: '/xmlrpc.php', type: 'disallow', severity: 'high', category: 'security', description: 'Protège contre les attaques XML-RPC' },
      { path: '/wp-login.php', type: 'disallow', severity: 'high', category: 'auth', description: 'Protège la page de connexion' },
      { path: '/wp-register.php', type: 'disallow', severity: 'high', category: 'auth', description: 'Protège la page d\'inscription' },
      { path: '/wp-cron.php', type: 'disallow', severity: 'medium', category: 'system', description: 'Protège le cron WordPress' },
      { path: '/wp-trackback.php', type: 'disallow', severity: 'medium', category: 'system', description: 'Protège le trackback' },
      { path: '/wp-comments-post.php', type: 'disallow', severity: 'medium', category: 'comments', description: 'Protège la soumission des commentaires' },
      { path: '/wp-json/', type: 'disallow', severity: 'medium', category: 'api', description: 'Protège l\'API REST' },
      { path: '/wp-content/uploads/', type: 'allow', severity: 'low', category: 'media', description: 'Autorise l\'accès aux médias' },
      { path: '/wp-content/cache/', type: 'disallow', severity: 'medium', category: 'cache', description: 'Protège le cache' }
    ]
  },
  {
    name: 'E-commerce',
    description: 'Optimal configuration for e-commerce sites',
    icon: 'mdi-cart',
    color: 'green',
    config: {
      userAgent: '*',
      customUserAgent: '',
      crawlDelay: '5',
      sitemapUrl: '/sitemap.xml',
      contact: 'webmaster@example.com'
    },
    rules: [
      { path: '/admin/', type: 'disallow', severity: 'high', category: 'admin', description: 'Protège la zone d\'administration' },
      { path: '/checkout/', type: 'disallow', severity: 'medium', category: 'checkout', description: 'Protège le processus de paiement' },
      { path: '/cart/', type: 'disallow', severity: 'low', category: 'cart', description: 'Protège le panier' },
      { path: '/account/', type: 'disallow', severity: 'high', category: 'user', description: 'Protège les comptes utilisateurs' },
      { path: '/wishlist/', type: 'disallow', severity: 'low', category: 'user', description: 'Protège les listes de souhaits' },
      { path: '/compare/', type: 'disallow', severity: 'low', category: 'user', description: 'Protège la comparaison de produits' },
      { path: '/search/', type: 'allow', severity: 'low', category: 'search', description: 'Autorise l\'accès à la recherche' },
      { path: '/catalog/', type: 'allow', severity: 'low', category: 'catalog', description: 'Autorise l\'accès au catalogue' },
      { path: '/product/', type: 'allow', severity: 'low', category: 'products', description: 'Autorise l\'accès aux produits' },
      { path: '/category/', type: 'allow', severity: 'low', category: 'categories', description: 'Autorise l\'accès aux catégories' },
      { path: '/api/', type: 'disallow', severity: 'high', category: 'api', description: 'Protège l\'API' },
      { path: '/media/', type: 'allow', severity: 'low', category: 'media', description: 'Autorise l\'accès aux médias' },
      { path: '/static/', type: 'allow', severity: 'low', category: 'static', description: 'Autorise l\'accès aux fichiers statiques' }
    ]
  },
  {
    name: 'Blog',
    description: 'Optimal configuration for blogs',
    icon: 'mdi-post',
    color: 'purple',
    config: {
      userAgent: '*',
      customUserAgent: '',
      crawlDelay: '3',
      sitemapUrl: '/sitemap.xml',
      contact: 'webmaster@example.com'
    },
    rules: [
      { path: '/admin/', type: 'disallow', severity: 'high', category: 'admin', description: 'Protège la zone d\'administration' },
      { path: '/login/', type: 'disallow', severity: 'high', category: 'auth', description: 'Protège la page de connexion' },
      { path: '/register/', type: 'disallow', severity: 'high', category: 'auth', description: 'Protège la page d\'inscription' },
      { path: '/search/', type: 'allow', severity: 'low', category: 'search', description: 'Autorise l\'accès à la recherche' },
      { path: '/tag/', type: 'allow', severity: 'low', category: 'tags', description: 'Autorise l\'accès aux tags' },
      { path: '/category/', type: 'allow', severity: 'low', category: 'categories', description: 'Autorise l\'accès aux catégories' },
      { path: '/author/', type: 'allow', severity: 'low', category: 'authors', description: 'Autorise l\'accès aux auteurs' },
      { path: '/feed/', type: 'allow', severity: 'low', category: 'feeds', description: 'Autorise l\'accès aux flux RSS' },
      { path: '/comments/', type: 'disallow', severity: 'medium', category: 'comments', description: 'Protège les commentaires' },
      { path: '/api/', type: 'disallow', severity: 'high', category: 'api', description: 'Protège l\'API' },
      { path: '/media/', type: 'allow', severity: 'low', category: 'media', description: 'Autorise l\'accès aux médias' },
      { path: '/static/', type: 'allow', severity: 'low', category: 'static', description: 'Autorise l\'accès aux fichiers statiques' }
    ]
  }
]);

const schemaTemplates = ref([
  {
    name: 'Article',
    description: 'Structure for blog articles',
    icon: 'mdi-newspaper',
    color: 'orange',
    type: {
      type: 'Article',
      description: 'Structure for blog articles',
      properties: [
        { name: 'headline', value: 'Titre de l\'article', required: true, description: 'Titre de l\'article' },
        { name: 'author', value: 'Nom de l\'auteur', required: true, description: 'Auteur de l\'article' },
        { name: 'datePublished', value: new Date().toISOString(), required: true, description: 'Date de publication' },
        { name: 'dateModified', value: new Date().toISOString(), required: false, description: 'Date de modification' },
        { name: 'image', value: 'https://example.com/image.jpg', required: false, description: 'Image principale' },
        { name: 'description', value: 'Description de l\'article', required: true, description: 'Description de l\'article' },
        { name: 'articleBody', value: 'Contenu de l\'article', required: true, description: 'Contenu de l\'article' },
        { name: 'publisher', value: 'Nom de l\'éditeur', required: true, description: 'Éditeur de l\'article' },
        { name: 'keywords', value: 'mot-clé1, mot-clé2, mot-clé3', required: false, description: 'Mots-clés de l\'article' },
        { name: 'articleSection', value: 'Catégorie', required: false, description: 'Section de l\'article' },
        { name: 'inLanguage', value: 'fr', required: false, description: 'Langue de l\'article' }
      ]
    }
  },
  {
    name: 'Product',
    description: 'Structure for e-commerce products',
    icon: 'mdi-package-variant',
    color: 'green',
    type: {
      type: 'Product',
      description: 'Structure for e-commerce products',
      properties: [
        { name: 'name', value: 'Product name', required: true, description: 'Product name' },
        { name: 'description', value: 'Product description', required: true, description: 'Product description' },
        { name: 'image', value: 'https://example.com/product.jpg', required: true, description: 'Product image' },
        { name: 'offers', value: '{"@type": "Offer", "price": "0.00", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"}', required: true, description: 'Price and availability' },
        { name: 'brand', value: 'Brand', required: false, description: 'Product brand' },
        { name: 'sku', value: 'SKU123', required: false, description: 'Product reference' },
        { name: 'gtin', value: '123456789012', required: false, description: 'Product GTIN' },
        { name: 'mpn', value: 'MPN123', required: false, description: 'Product manufacturer part number' },
        { name: 'color', value: 'Black', required: false, description: 'Product color' },
        { name: 'material', value: 'Cotton', required: false, description: 'Product material' },
        { name: 'weight', value: '1.5 kg', required: false, description: 'Product weight' },
        { name: 'category', value: 'Category', required: false, description: 'Product category' },
        { name: 'aggregateRating', value: '{"@type": "AggregateRating", "ratingValue": "4.5", "reviewCount": "100"}', required: false, description: 'Product average rating' }
      ]
    }
  },
  {
    name: 'Organization',
    description: 'Structure for organizations',
    icon: 'mdi-office-building',
    color: 'blue',
    type: {
      type: 'Organization',
      description: 'Structure for organizations',
      properties: [
        { name: 'name', value: 'Organization name', required: true, description: 'Organization name' },
        { name: 'description', value: 'Organization description', required: true, description: 'Organization description' },
        { name: 'url', value: 'https://example.com', required: true, description: 'Website URL' },
        { name: 'logo', value: { '@type': 'ImageObject', url: 'https://example.com/logo.png' }, required: true, description: 'Organization logo' },
        { name: 'image', value: 'https://example.com/image.jpg', required: false, description: 'Organization image' },
        { name: 'telephone', value: '+33 1 23 45 67 89', required: false, description: 'Phone number' },
        { name: 'email', value: 'contact@example.com', required: false, description: 'Email address' },
        { name: 'address', value: { '@type': 'PostalAddress', streetAddress: '123 rue Example', addressLocality: 'Paris', postalCode: '75000', addressCountry: 'FR' }, required: false, description: 'Postal address' },
        { name: 'foundingDate', value: '2020-01-01', required: false, description: 'Creation date' },
        { name: 'legalName', value: 'Legal organization name', required: false, description: 'Legal organization name' },
        { name: 'numberOfEmployees', value: '50', required: false, description: 'Number of employees' },
        { name: 'socialProfiles', value: '["https://facebook.com/example", "https://twitter.com/example"]', required: false, description: 'Profils sociaux' }
      ]
    }
  },
  {
    name: 'LocalBusiness',
    description: 'Structure for local business',
    icon: 'mdi-store',
    color: 'cyan',
    type: {
      type: 'LocalBusiness',
      description: 'Structure pour les entreprises locales',
      properties: [
        { name: 'name', value: 'Business name', required: true, description: 'Business name' },
        { name: 'description', value: 'Business description', required: true, description: 'Business description' },
        { name: 'url', value: 'https://example.com', required: true, description: 'Website URL' },
        { name: 'logo', value: 'https://example.com/logo.png', required: true, description: 'Business logo' },
        { name: 'image', value: 'https://example.com/image.jpg', required: false, description: 'Business image' },
        { name: 'telephone', value: '+33 1 23 45 67 89', required: true, description: 'Phone number' },
        { name: 'email', value: 'contact@example.com', required: false, description: 'Email address' },
        { name: 'address', value: { '@type': 'PostalAddress', streetAddress: '123 rue Example', addressLocality: 'Paris', postalCode: '75000', addressCountry: 'FR' }, required: true, description: 'Postal address' },
        { name: 'openingHours', value: 'Mo-Fr 09:00-18:00', required: false, description: 'Opening hours' },
        { name: 'priceRange', value: '€€', required: false, description: 'Price range' },
        { name: 'areaServed', value: 'Paris and region parisienne', required: false, description: 'Served area' },
        { name: 'hasMap', value: 'https://maps.google.com/?q=48.8566,2.3522', required: false, description: 'Link to the map' },
        { name: 'geo', value: '{"@type": "GeoCoordinates", "latitude": 48.8566, "longitude": 2.3522}', required: false, description: 'Geographic coordinates' }
      ]
    }
  }
]);

const selectedRobotsTemplate = ref(null);
const selectedSchemaTemplate = ref(null);

const applyRobotsTemplate = async () => {
  if (selectedRobotsTemplate.value) {
    try {
      const template = robotsTemplates.value.find(t => t.name === selectedRobotsTemplate.value);
      if (template) {
        robotsConfig.value = {
          userAgent: template.config.userAgent,
          customUserAgent: template.config.customUserAgent,
          crawlDelay: template.config.crawlDelay,
          sitemapUrl: template.config.sitemapUrl,
          contact: template.config.contact,
          disallowedPaths: [],
          allowedPaths: []
        };

        template.rules.forEach(rule => {
          if (rule.type === 'disallow') {
            robotsConfig.value.disallowedPaths.push(rule.path);
          } else if (rule.type === 'allow') {
            robotsConfig.value.allowedPaths.push(rule.path);
          }
        });

        generatePreviewContent();
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du template:', error);
    }
  }
};

const applySchemaTemplate = async () => {
  if (selectedSchemaTemplate.value) {
    try {
      const template = schemaTemplates.value.find(t => t.name === selectedSchemaTemplate.value);
      if (template) {
        schemaConfig.value = {
          ...schemaConfig.value,
          type: template.type.type
        };

        template.type.properties.forEach(prop => {
          schemaConfig.value[prop.name] = prop.value;
        });

        generatePreviewContent();
      }
    } catch (error) {
      console.error('Error applying template:', error);
    }
  }
};
</script>

<style scoped></style>
