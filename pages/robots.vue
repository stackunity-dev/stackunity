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
              <p>L'audit SEO a échoué, mais vous pouvez toujours générer du contenu avec les données actuelles.</p>
              <div class="font-weight-bold mt-1">Solutions possibles pour l'audit :</div>
              <ul>
                <li>Vérifiez que Google Chrome est installé sur le serveur</li>
                <li>L'utilisateur du serveur doit avoir les droits d'accès au fichier chrome.exe</li>
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
import { computed, ref } from 'vue';
// @ts-ignore
import { definePageMeta } from '#imports';
import CodePreview from '../components/robots/CodePreview.vue';
import RobotsConfigComponent from '../components/robots/RobotsConfig.vue';
import SchemaConfigComponent from '../components/robots/SchemaConfig.vue';
import { RobotsConfig, RobotsPreviewLine, SchemaConfig, SiteConfig } from '../components/robots/types';
import { fillConfigsFromAudit, generateRobotsContent, generateSchemaContent } from '../components/robots/utils';
import { useUserStore } from '../stores/userStore';

// Définir les métadonnées de la page
definePageMeta({
  title: 'Robots.txt & Schema.org Generator',
  description: 'Generate robots.txt files and Schema.org structured data for your website',
  middleware: 'premium',
  layout: 'dashboard',
  requiresPremium: true
});

const userStore = useUserStore();

const configTab = ref('robots');
const isLoading = ref(false);
const error = ref('');
const report = ref(null);
const generatedContent = ref('');

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

const fullUrl = computed(() => {
  return `${siteConfig.value.protocol}://${siteConfig.value.domain}`;
});

const analyzeWebsite = async () => {
  if (!siteConfig.value.domain) {
    error.value = 'Veuillez entrer un domaine valide';
    return;
  }

  const url = `${siteConfig.value.protocol}://${siteConfig.value.domain}`;
  error.value = '';
  isLoading.value = true;

  try {
    // Utiliser notre nouvelle API pour l'analyse
    console.log('Analyse du site:', url);
    const options = {
      maxDepth: 1,
      sameDomainOnly: true,
      timeout: 30000,
      useRapidApi: false, // Utiliser notre nouvelle API
      maxUrlsToAnalyze: 1
    };

    report.value = await userStore.auditSEO(url, options);

    if (report.value) {
      // Mise à jour automatique des configurations à partir des résultats de l'analyse
      fillConfigsFromAudit(report.value, siteConfig.value, robotsConfig.value, schemaConfig.value);

      // Générer automatiquement le contenu
      generateCode();
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue pendant l\'analyse';
    console.error('Erreur d\'analyse:', err);
  } finally {
    isLoading.value = false;
  }
};

const generateCode = () => {
  try {
    isLoading.value = true;
    error.value = '';

    // Si un rapport d'analyse existe et que nous n'avons pas encore généré de contenu, utilisez-le
    if (report.value && !generatedContent.value) {
      const result = fillConfigsFromAudit(report.value, siteConfig.value, robotsConfig.value, schemaConfig.value);
      // Mettre à jour les configurations avec les résultats
      Object.assign(robotsConfig.value, result.robotsConfig);
      Object.assign(schemaConfig.value, result.schemaConfig);
      Object.assign(siteConfig.value, result.siteConfig);
    }

    if (configTab.value === 'robots') {
      generatedContent.value = generateRobotsContent(siteConfig.value, robotsConfig.value);

      // Mettre à jour les lignes d'aperçu pour l'affichage
      robotsPreviewLines.value = generatedContent.value.split('\n').filter(line => line.trim() !== '').map(line => ({
        text: line,
        bold: line.startsWith('User-agent:') || line.startsWith('Sitemap:') || line.startsWith('Host:'),
        comment: line.startsWith('#')
      }));
    } else if (configTab.value === 'schema') {
      generatedContent.value = generateSchemaContent(siteConfig.value, schemaConfig.value);
    }
  } catch (e: any) {
    error.value = e.message || 'Error generating content';
    console.error('Error generating content:', e);
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour récupérer l'icône du type de schéma
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
