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
                    <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
                      <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-robot</v-icon>
                        Robots.txt Settings
                      </div>

                      <v-select v-model="robotsConfig.userAgent"
                        :items="['All robots', 'Google', 'Bing', 'Yahoo', 'Baidu', 'Custom']" label="User Agent"
                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-robot" class="mb-4"></v-select>

                      <v-text-field v-if="robotsConfig.userAgent === 'Custom'" v-model="robotsConfig.customUserAgent"
                        label="Custom User Agent" variant="outlined" density="comfortable"
                        prepend-inner-icon="mdi-robot-outline" class="mb-4"></v-text-field>

                      <v-text-field v-model="robotsConfig.crawlDelay" label="Crawl Delay (seconds)" variant="outlined"
                        density="comfortable" type="number" prepend-inner-icon="mdi-timer"
                        hint="Leave empty for no delay" persistent-hint class="mb-4"></v-text-field>
                    </v-card>

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

                      <v-text-field v-model="robotsConfig.sitemapUrl" label="Sitemap URL" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-sitemap" placeholder="/sitemap.xml"
                        class="mb-4"></v-text-field>
                    </v-card>
                  </v-window-item>

                  <v-window-item value="schema">
                    <v-card variant="outlined" class="pa-4 rounded-lg">
                      <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-code-json</v-icon>
                        Schema.org Settings
                      </div>

                      <v-select v-model="schemaConfig.type"
                        :items="['Organization', 'WebSite', 'LocalBusiness', 'Person', 'Product', 'Event', 'Article', 'Restaurant']"
                        label="Schema Type" variant="outlined" density="comfortable" prepend-inner-icon="mdi-shape"
                        class="mb-4"></v-select>

                      <v-text-field v-model="schemaConfig.name" label="Name" variant="outlined" density="comfortable"
                        prepend-inner-icon="mdi-rename" class="mb-4"></v-text-field>

                      <v-textarea v-model="schemaConfig.description" label="Description" variant="outlined"
                        density="comfortable" prepend-inner-icon="mdi-text" auto-grow rows="3"
                        class="mb-4"></v-textarea>

                      <v-text-field v-model="schemaConfig.url" label="URL" variant="outlined" density="comfortable"
                        prepend-inner-icon="mdi-link" class="mb-4"></v-text-field>

                      <!-- Propriétés communes -->
                      <v-list-item v-if="schemaConfig.image" prepend-icon="mdi-image">
                        <v-list-item-title>Image</v-list-item-title>
                        <v-list-item-subtitle>
                          <div class="d-flex align-center">
                            <img :src="schemaConfig.image" alt="Image" class="mr-2"
                              style="height: 32px; max-width: 120px; object-fit: contain;">
                            <span class="text-caption text-truncate">{{ schemaConfig.image }}</span>
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item v-if="schemaConfig.telephone" prepend-icon="mdi-phone">
                        <v-list-item-title>Téléphone</v-list-item-title>
                        <v-list-item-subtitle>{{ schemaConfig.telephone }}</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item v-if="schemaConfig.email" prepend-icon="mdi-email">
                        <v-list-item-title>Email</v-list-item-title>
                        <v-list-item-subtitle>{{ schemaConfig.email }}</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item v-if="schemaConfig.address" prepend-icon="mdi-map-marker">
                        <v-list-item-title>Adresse</v-list-item-title>
                        <v-list-item-subtitle>{{ schemaConfig.address }}</v-list-item-subtitle>
                      </v-list-item>

                      <!-- Propriétés spécifiques par type -->
                      <template v-if="schemaConfig.type === 'Organization'">
                        <v-list-item v-if="schemaConfig.logo" prepend-icon="mdi-image">
                          <v-list-item-title>Logo</v-list-item-title>
                          <v-list-item-subtitle>
                            <div class="d-flex align-center">
                              <img :src="schemaConfig.logo" alt="Logo" class="mr-2"
                                style="height: 32px; max-width: 120px; object-fit: contain;">
                              <span class="text-caption text-truncate">{{ schemaConfig.logo }}</span>
                            </div>
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.socialProfiles?.length" prepend-icon="mdi-account-group">
                          <v-list-item-title>Profils sociaux</v-list-item-title>
                          <v-list-item-subtitle>
                            <v-chip-group>
                              <v-chip v-for="(profile, index) in schemaConfig.socialProfiles" :key="index" size="small"
                                color="primary" variant="outlined">
                                {{ getNetworkName(profile) }}
                              </v-chip>
                            </v-chip-group>
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.foundingDate" prepend-icon="mdi-calendar">
                          <v-list-item-title>Date de création</v-list-item-title>
                          <v-list-item-subtitle>{{ formatDate(schemaConfig.foundingDate) }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.legalName" prepend-icon="mdi-office-building">
                          <v-list-item-title>Nom légal</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.legalName }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.numberOfEmployees" prepend-icon="mdi-account-group">
                          <v-list-item-title>Nombre d'employés</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.numberOfEmployees }}</v-list-item-subtitle>
                        </v-list-item>
                      </template>

                      <template v-if="schemaConfig.type === 'Person'">
                        <v-list-item v-if="schemaConfig.jobTitle" prepend-icon="mdi-badge-account">
                          <v-list-item-title>Titre du poste</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.jobTitle }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.givenName" prepend-icon="mdi-account">
                          <v-list-item-title>Prénom</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.givenName }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.familyName" prepend-icon="mdi-account">
                          <v-list-item-title>Nom</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.familyName }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.birthDate" prepend-icon="mdi-calendar">
                          <v-list-item-title>Date de naissance</v-list-item-title>
                          <v-list-item-subtitle>{{ formatDate(schemaConfig.birthDate) }}</v-list-item-subtitle>
                        </v-list-item>
                      </template>

                      <template v-if="schemaConfig.type === 'Restaurant'">
                        <v-list-item v-if="schemaConfig.servesCuisine" prepend-icon="mdi-food">
                          <v-list-item-title>Type de cuisine</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.servesCuisine }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.menu" prepend-icon="mdi-menu">
                          <v-list-item-title>Menu</v-list-item-title>
                          <v-list-item-subtitle>{{ schemaConfig.menu }}</v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="schemaConfig.acceptsReservations !== undefined"
                          prepend-icon="mdi-checkbox-marked-circle-outline">
                          <v-list-item-title>Options</v-list-item-title>
                          <v-list-item-subtitle>
                            <v-chip-group>
                              <v-chip v-if="schemaConfig.acceptsReservations" size="small" color="success"
                                variant="outlined">
                                Réservations acceptées
                              </v-chip>
                              <v-chip v-if="schemaConfig.driveThrough" size="small" color="primary" variant="outlined">
                                Drive-through
                              </v-chip>
                              <v-chip v-if="schemaConfig.deliveryAvailable" size="small" color="secondary"
                                variant="outlined">
                                Livraison disponible
                              </v-chip>
                            </v-chip-group>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-card>
                  </v-window-item>
                </v-window>

                <div class="d-flex justify-space-between mt-4">
                  <v-btn color="primary" @click="generateContent" size="large" :loading="isLoading" elevation="2">
                    <v-icon start>mdi-cog</v-icon>
                    {{ isLoading ? 'Analyzing...' : 'Generate' }}
                  </v-btn>

                  <v-btn color="secondary" @click="downloadFile" :disabled="!generatedContent" variant="outlined"
                    elevation="1">
                    <v-icon start>mdi-download</v-icon>
                    Download
                  </v-btn>
                </div>

                <v-alert v-if="error" type="error" class="mt-4" elevation="2">
                  {{ error }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="8">
            <v-card class="rounded-lg" elevation="3">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">{{ configTab === 'robots' ? 'mdi-robot' : 'mdi-code-json' }}</v-icon>
                {{ configTab === 'robots' ? 'Robots.txt' : 'Schema.org JSON-LD' }} Preview
                <v-spacer></v-spacer>
                <v-btn v-if="generatedContent" icon="mdi-content-copy" color="white" variant="text"
                  @click="copyToClipboard"></v-btn>
              </v-card-title>

              <v-card-text class="pa-4">
                <div v-if="!generatedContent" class="text-center pa-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-code-brackets</v-icon>
                  <div class="text-h6 mt-4 text-grey">No Content Generated</div>
                  <div class="text-body-1 text-grey-darken-1">Configure settings and click 'Generate' to see the output
                  </div>
                </div>

                <template v-else>
                  <div class="d-flex mb-4">
                    <v-tabs v-model="previewTab" color="primary" class="rounded-lg">
                      <v-tab value="code" class="py-3 px-4">
                        <v-icon start>mdi-code-tags</v-icon>
                        Code
                      </v-tab>
                      <v-tab value="preview" class="py-3 px-4">
                        <v-icon start>mdi-eye</v-icon>
                        Visual Preview
                      </v-tab>
                    </v-tabs>
                  </div>

                  <v-window v-model="previewTab">
                    <v-window-item value="code">
                      <pre class="content-preview">
                        <code>{{ generatedContent }}</code>
                      </pre>
                    </v-window-item>

                    <v-window-item value="preview">
                      <div v-if="configTab === 'robots'" class="robots-preview">
                        <v-list class="rounded-lg">
                          <v-list-item v-for="(line, index) in robotsPreviewLines" :key="index">
                            <v-list-item-title :class="{ 'font-weight-bold': line.bold, 'text-grey': line.comment }">
                              {{ line.text }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>

                      <div v-else-if="configTab === 'schema'" class="schema-preview">
                        <v-card variant="outlined" class="pa-4 rounded-lg">
                          <div class="d-flex align-center mb-4">
                            <v-avatar color="primary" class="mr-3">
                              <v-icon color="white" size="large">{{ getSchemaIcon() }}</v-icon>
                            </v-avatar>
                            <div>
                              <div class="text-h6">{{ schemaConfig.name || 'Nom non défini' }}</div>
                              <div class="text-subtitle-2">{{ schemaConfig.type }}</div>
                            </div>
                          </div>

                          <v-divider class="mb-4"></v-divider>

                          <div class="schema-data">
                            <v-list class="rounded-lg">
                              <!-- Propriétés de base -->
                              <v-list-item prepend-icon="mdi-text-box">
                                <v-list-item-title>Description</v-list-item-title>
                                <v-list-item-subtitle>{{ schemaConfig.description || 'Aucune description fournie'
                                }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item prepend-icon="mdi-link">
                                <v-list-item-title>URL</v-list-item-title>
                                <v-list-item-subtitle>{{ schemaConfig.url || fullUrl || 'Aucune URL fournie'
                                }}</v-list-item-subtitle>
                              </v-list-item>

                              <!-- Propriétés communes -->
                              <v-list-item v-if="schemaConfig.image" prepend-icon="mdi-image">
                                <v-list-item-title>Image</v-list-item-title>
                                <v-list-item-subtitle>
                                  <div class="d-flex align-center">
                                    <img :src="schemaConfig.image" alt="Image" class="mr-2"
                                      style="height: 32px; max-width: 120px; object-fit: contain;">
                                    <span class="text-caption text-truncate">{{ schemaConfig.image }}</span>
                                  </div>
                                </v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item v-if="schemaConfig.telephone" prepend-icon="mdi-phone">
                                <v-list-item-title>Téléphone</v-list-item-title>
                                <v-list-item-subtitle>{{ schemaConfig.telephone }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item v-if="schemaConfig.email" prepend-icon="mdi-email">
                                <v-list-item-title>Email</v-list-item-title>
                                <v-list-item-subtitle>{{ schemaConfig.email }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item v-if="schemaConfig.address" prepend-icon="mdi-map-marker">
                                <v-list-item-title>Adresse</v-list-item-title>
                                <v-list-item-subtitle>{{ schemaConfig.address }}</v-list-item-subtitle>
                              </v-list-item>

                              <!-- Propriétés spécifiques par type -->
                              <template v-if="schemaConfig.type === 'Organization'">
                                <v-list-item v-if="schemaConfig.logo" prepend-icon="mdi-image">
                                  <v-list-item-title>Logo</v-list-item-title>
                                  <v-list-item-subtitle>
                                    <div class="d-flex align-center">
                                      <img :src="schemaConfig.logo" alt="Logo" class="mr-2"
                                        style="height: 32px; max-width: 120px; object-fit: contain;">
                                      <span class="text-caption text-truncate">{{ schemaConfig.logo }}</span>
                                    </div>
                                  </v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.socialProfiles?.length"
                                  prepend-icon="mdi-account-group">
                                  <v-list-item-title>Profils sociaux</v-list-item-title>
                                  <v-list-item-subtitle>
                                    <v-chip-group>
                                      <v-chip v-for="(profile, index) in schemaConfig.socialProfiles" :key="index"
                                        size="small" color="primary" variant="outlined">
                                        {{ getNetworkName(profile) }}
                                      </v-chip>
                                    </v-chip-group>
                                  </v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.foundingDate" prepend-icon="mdi-calendar">
                                  <v-list-item-title>Date de création</v-list-item-title>
                                  <v-list-item-subtitle>{{ formatDate(schemaConfig.foundingDate)
                                    }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.legalName" prepend-icon="mdi-office-building">
                                  <v-list-item-title>Nom légal</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.legalName }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.numberOfEmployees" prepend-icon="mdi-account-group">
                                  <v-list-item-title>Nombre d'employés</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.numberOfEmployees }}</v-list-item-subtitle>
                                </v-list-item>
                              </template>

                              <template v-if="schemaConfig.type === 'Person'">
                                <v-list-item v-if="schemaConfig.jobTitle" prepend-icon="mdi-badge-account">
                                  <v-list-item-title>Titre du poste</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.jobTitle }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.givenName" prepend-icon="mdi-account">
                                  <v-list-item-title>Prénom</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.givenName }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.familyName" prepend-icon="mdi-account">
                                  <v-list-item-title>Nom</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.familyName }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.birthDate" prepend-icon="mdi-calendar">
                                  <v-list-item-title>Date de naissance</v-list-item-title>
                                  <v-list-item-subtitle>{{ formatDate(schemaConfig.birthDate) }}</v-list-item-subtitle>
                                </v-list-item>
                              </template>

                              <template v-if="schemaConfig.type === 'Restaurant'">
                                <v-list-item v-if="schemaConfig.servesCuisine" prepend-icon="mdi-food">
                                  <v-list-item-title>Type de cuisine</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.servesCuisine }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.menu" prepend-icon="mdi-menu">
                                  <v-list-item-title>Menu</v-list-item-title>
                                  <v-list-item-subtitle>{{ schemaConfig.menu }}</v-list-item-subtitle>
                                </v-list-item>

                                <v-list-item v-if="schemaConfig.acceptsReservations !== undefined"
                                  prepend-icon="mdi-checkbox-marked-circle-outline">
                                  <v-list-item-title>Options</v-list-item-title>
                                  <v-list-item-subtitle>
                                    <v-chip-group>
                                      <v-chip v-if="schemaConfig.acceptsReservations" size="small" color="success"
                                        variant="outlined">
                                        Réservations acceptées
                                      </v-chip>
                                      <v-chip v-if="schemaConfig.driveThrough" size="small" color="primary"
                                        variant="outlined">
                                        Drive-through
                                      </v-chip>
                                      <v-chip v-if="schemaConfig.deliveryAvailable" size="small" color="secondary"
                                        variant="outlined">
                                        Livraison disponible
                                      </v-chip>
                                    </v-chip-group>
                                  </v-list-item-subtitle>
                                </v-list-item>
                              </template>
                            </v-list>
                          </div>
                        </v-card>
                      </div>
                    </v-window-item>
                  </v-window>

                  <v-divider class="my-4"></v-divider>

                  <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Integration Instructions
                  </div>
                  <v-alert type="info" variant="tonal" class="mb-4 rounded-lg" elevation="1">
                    <div class="text-subtitle-2 font-weight-bold mb-2">
                      {{ configTab === 'robots' ? 'How to use robots.txt' : 'How to add Schema.org to your website' }}
                    </div>

                    <div v-if="configTab === 'robots'" class="text-body-2">
                      <ol>
                        <li>Download the generated robots.txt file</li>
                        <li>Upload it to the root directory of your website</li>
                        <li>Verify it works by accessing <code>{{ fullUrl }}/robots.txt</code></li>
                      </ol>
                    </div>

                    <div v-else class="text-body-2">
                      <ol>
                        <li>Copy the generated JSON-LD code</li>
                        <li>Add it to the <code>&lt;head&gt;</code> section of your website</li>
                        <li>Verify it with <a href="https://validator.schema.org/" target="_blank"
                            class="text-decoration-none">Schema.org Validator</a> or <a
                            href="https://search.google.com/test/rich-results" target="_blank"
                            class="text-decoration-none">Google Rich
                            Results Test</a></li>
                      </ol>
                    </div>
                  </v-alert>
                </template>
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
import type { CrawlReport } from '~/server/api/seo-audit';
import { useUserStore } from '~/stores/userStore';

definePageMeta({
  layout: 'dashboard',
  requiresPremium: true
});

useHead({
  title: 'Robots.txt & Schema.org Generator',
  meta: [
    { name: 'description', content: 'Generate robots.txt files and Schema.org structured data for your website' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Robots.txt & Schema.org Generator' },
    { name: 'og:description', content: 'Generate robots.txt files and Schema.org structured data for your website' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
});

const userStore = useUserStore();

const configTab = ref('robots');
const previewTab = ref('code');
const isLoading = ref(false);
const error = ref('');
const report = ref<CrawlReport | null>(null);

const siteConfig = ref({
  domain: '',
  protocol: 'https'
});

const robotsConfig = ref({
  userAgent: 'All robots',
  customUserAgent: '',
  crawlDelay: '',
  disallowedPaths: ['/admin', '/private', '/login', '/wp-admin'] as string[],
  allowedPaths: [] as string[],
  sitemapUrl: '/sitemap.xml'
});

interface SchemaProperty {
  key: string;
  label: string;
  icon: string;
  type?: 'image' | 'date' | 'chips' | 'restaurant-options';
  color?: string;
}

interface SchemaConfig {
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
}

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
  currency: 'USD',
  availability: 'InStock',
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
  deliveryAvailable: false
});

const newDisallowedPath = ref('');
const newAllowedPath = ref('');
const generatedContent = ref('');

const fullUrl = computed(() => {
  if (!siteConfig.value.domain) return '';
  return `${siteConfig.value.protocol}://${siteConfig.value.domain}`;
});

const schemaDataPreview = computed(() => {
  if (!generatedContent.value || configTab.value !== 'schema') return null;
  try {
    console.log('Contenu brut généré:', generatedContent.value);
    if (!generatedContent.value.trim().startsWith('{')) return null;
    const parsedData = JSON.parse(generatedContent.value);
    console.log('Données parsées:', parsedData);
    return parsedData;
  } catch (e) {
    console.error('Erreur lors du parsing des données schema:', e);
    return null;
  }
});

function fillSchemaFromAudit(report: CrawlReport) {
  // Exemples de champs à auto-remplir à partir de la page d'accueil
  const homeData = report.seoResults?.['https://portfolionurdjedd.com'];
  if (homeData) {
    // On récupère le titre s'il est défini
    if (homeData.title) {
      schemaConfig.value.name = homeData.title;
    }
    // On récupère la description s'il y en a une
    if (homeData.description) {
      schemaConfig.value.description = homeData.description;
    }
    // Vous pouvez ajouter d'autres champs (par ex. h1, etc.)
    // if (homeData.h1 && homeData.h1.length > 0) {
    //   schemaConfig.value.name = homeData.h1[0];
    // }
  }
}

const robotsPreviewLines = computed(() => {
  if (!generatedContent.value || configTab.value !== 'robots') return [];
  return generatedContent.value.split('\n').map(line => ({
    text: line,
    bold: line.startsWith('User-agent:') || line.startsWith('Allow:') || line.startsWith('Disallow:'),
    comment: line.startsWith('#')
  }));
});

const getSchemaIcon = () => {
  const icons: Record<string, string> = {
    Organization: 'mdi-office-building',
    Person: 'mdi-account',
    Product: 'mdi-package-variant',
    Article: 'mdi-newspaper',
    LocalBusiness: 'mdi-store',
    WebSite: 'mdi-web',
    Event: 'mdi-calendar',
    Restaurant: 'mdi-food'
  };
  return icons[schemaConfig.value.type] || 'mdi-shape';
};

const getNetworkName = (url: string) => {
  const networks: Record<string, string> = {
    'facebook.com': 'Facebook',
    'twitter.com': 'Twitter',
    'linkedin.com': 'LinkedIn',
    'instagram.com': 'Instagram',
    'youtube.com': 'YouTube'
  };

  try {
    const domain = new URL(url).hostname;
    return networks[domain] || domain;
  } catch {
    return 'Social';
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const addDisallowedPath = () => {
  if (newDisallowedPath.value && !robotsConfig.value.disallowedPaths.includes(newDisallowedPath.value)) {
    robotsConfig.value.disallowedPaths.push(newDisallowedPath.value);
    newDisallowedPath.value = '';
  }
};

const removeDisallowedPath = (index: number) => {
  robotsConfig.value.disallowedPaths.splice(index, 1);
};

const addAllowedPath = () => {
  if (newAllowedPath.value && !robotsConfig.value.allowedPaths.includes(newAllowedPath.value)) {
    robotsConfig.value.allowedPaths.push(newAllowedPath.value);
    newAllowedPath.value = '';
  }
};

const removeAllowedPath = (index: number) => {
  robotsConfig.value.allowedPaths.splice(index, 1);
};

const generateContent = async () => {
  if (!siteConfig.value.domain) {
    error.value = 'Veuillez entrer un domaine valide';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    // Effectuer l'audit SEO
    console.log('Démarrage de l\'audit SEO pour:', fullUrl.value);
    report.value = await userStore.auditSEO(fullUrl.value);
    console.log('Résultats de l\'audit SEO:', report.value);

    // Mise à jour des chemins interdits basée sur les meta robots
    if (report.value && report.value.seoResults) {
      const disallowedPaths = new Set<string>();
      Object.entries(report.value.seoResults).forEach(([url, result]: [string, any]) => {
        if (result.robotsMeta && result.robotsMeta.noindex) {
          try {
            const urlObj = new URL(url);
            disallowedPaths.add(urlObj.pathname);
          } catch (e) {
            console.error('Erreur lors du parsing de l\'URL:', url);
          }
        }
      });
      robotsConfig.value.disallowedPaths = Array.from(disallowedPaths);
    }

    // Remplir les champs du schéma à partir de l'audit
    if (report.value) {
      fillSchemaFromAudit(report.value);
    }

    if (configTab.value === 'robots') {
      generatedContent.value = generateRobotsTxt();
    } else {
      generatedContent.value = generateSchemaOrg();
    }
  } catch (e: any) {
    console.error('Erreur lors de la génération:', e);
    error.value = e.message || 'Une erreur est survenue lors de la génération';
  } finally {
    isLoading.value = false;
  }
};

const generateRobotsTxt = () => {
  const lines: string[] = [];

  // User-agent
  if (robotsConfig.value.userAgent === 'Custom') {
    lines.push(`User-agent: ${robotsConfig.value.customUserAgent}`);
  } else {
    lines.push(`User-agent: ${robotsConfig.value.userAgent === 'All robots' ? '*' : robotsConfig.value.userAgent}`);
  }

  // Crawl-delay
  if (robotsConfig.value.crawlDelay) {
    lines.push(`Crawl-delay: ${robotsConfig.value.crawlDelay}`);
  }

  // Sitemap
  if (robotsConfig.value.sitemapUrl) {
    lines.push(`Sitemap: ${fullUrl.value}${robotsConfig.value.sitemapUrl}`);
  }

  // Chemins interdits par défaut
  const defaultDisallowedPaths = [
    '/admin',
    '/private',
    '/login',
    '/admin'
  ];

  // Ajouter les chemins interdits par défaut
  defaultDisallowedPaths.forEach(path => {
    lines.push(`Disallow: ${path}`);
  });

  // Ajouter les chemins interdits personnalisés
  robotsConfig.value.disallowedPaths.forEach(path => {
    if (!defaultDisallowedPaths.includes(path)) {
      lines.push(`Disallow: ${path}`);
    }
  });

  // Ajouter les chemins autorisés
  robotsConfig.value.allowedPaths.forEach(path => {
    lines.push(`Allow: ${path}`);
  });

  // Ajouter une ligne vide à la fin
  lines.push('');

  return lines.join('\n');
};

const generateSchemaOrg = () => {
  console.log('Configuration schema actuelle:', schemaConfig.value);
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': schemaConfig.value.type,
    name: schemaConfig.value.name,
    description: schemaConfig.value.description,
    url: schemaConfig.value.url || fullUrl.value
  };

  // Propriétés communes à tous les types
  if (schemaConfig.value.image) schema.image = schemaConfig.value.image;
  if (schemaConfig.value.telephone) schema.telephone = schemaConfig.value.telephone;
  if (schemaConfig.value.email) schema.email = schemaConfig.value.email;
  if (schemaConfig.value.address) schema.address = schemaConfig.value.address;

  switch (schemaConfig.value.type) {
    case 'Organization':
      if (schemaConfig.value.logo) schema.logo = schemaConfig.value.logo;
      if (schemaConfig.value.socialProfiles.length) {
        schema.sameAs = schemaConfig.value.socialProfiles;
      }
      if (schemaConfig.value.foundingDate) schema.foundingDate = schemaConfig.value.foundingDate;
      if (schemaConfig.value.legalName) schema.legalName = schemaConfig.value.legalName;
      if (schemaConfig.value.numberOfEmployees) schema.numberOfEmployees = schemaConfig.value.numberOfEmployees;
      break;

    case 'Person':
      if (schemaConfig.value.jobTitle) schema.jobTitle = schemaConfig.value.jobTitle;
      if (schemaConfig.value.givenName) schema.givenName = schemaConfig.value.givenName;
      if (schemaConfig.value.familyName) schema.familyName = schemaConfig.value.familyName;
      if (schemaConfig.value.birthDate) schema.birthDate = schemaConfig.value.birthDate;
      if (schemaConfig.value.worksFor) schema.worksFor = schemaConfig.value.worksFor;
      if (schemaConfig.value.alumniOf) schema.alumniOf = schemaConfig.value.alumniOf;
      break;

    case 'Product':
      schema.offers = {
        '@type': 'Offer',
        price: schemaConfig.value.price,
        priceCurrency: schemaConfig.value.currency,
        availability: `https://schema.org/${schemaConfig.value.availability}`,
        url: schemaConfig.value.url || fullUrl.value
      };
      if (schemaConfig.value.brand) schema.brand = schemaConfig.value.brand;
      if (schemaConfig.value.category) schema.category = schemaConfig.value.category;
      if (schemaConfig.value.sku) schema.sku = schemaConfig.value.sku;
      if (schemaConfig.value.gtin) schema.gtin = schemaConfig.value.gtin;
      if (schemaConfig.value.mpn) schema.mpn = schemaConfig.value.mpn;
      if (schemaConfig.value.color) schema.color = schemaConfig.value.color;
      if (schemaConfig.value.material) schema.material = schemaConfig.value.material;
      break;

    case 'Article':
      if (schemaConfig.value.headline) schema.headline = schemaConfig.value.headline;
      if (schemaConfig.value.author) schema.author = schemaConfig.value.author;
      if (schemaConfig.value.datePublished) schema.datePublished = schemaConfig.value.datePublished;
      if (schemaConfig.value.dateModified) schema.dateModified = schemaConfig.value.dateModified;
      if (schemaConfig.value.publisher) schema.publisher = schemaConfig.value.publisher;
      if (schemaConfig.value.keywords) schema.keywords = schemaConfig.value.keywords;
      if (schemaConfig.value.articleSection) schema.articleSection = schemaConfig.value.articleSection;
      if (schemaConfig.value.articleBody) schema.articleBody = schemaConfig.value.articleBody;
      break;

    case 'LocalBusiness':
      if (schemaConfig.value.openingHours) schema.openingHours = schemaConfig.value.openingHours;
      if (schemaConfig.value.priceRange) schema.priceRange = schemaConfig.value.priceRange;
      if (schemaConfig.value.areaServed) schema.areaServed = schemaConfig.value.areaServed;
      if (schemaConfig.value.hasMap) schema.hasMap = schemaConfig.value.hasMap;
      if (schemaConfig.value.geo) schema.geo = schemaConfig.value.geo;
      if (schemaConfig.value.faxNumber) schema.faxNumber = schemaConfig.value.faxNumber;
      if (schemaConfig.value.aggregateRating) schema.aggregateRating = schemaConfig.value.aggregateRating;
      break;

    case 'WebSite':
      if (schemaConfig.value.potentialAction) {
        schema.potentialAction = {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: schemaConfig.value.potentialAction
          }
        };
      }
      if (schemaConfig.value.inLanguage) schema.inLanguage = schemaConfig.value.inLanguage;
      if (schemaConfig.value.copyrightYear) schema.copyrightYear = schemaConfig.value.copyrightYear;
      break;

    case 'Event':
      if (schemaConfig.value.startDate) schema.startDate = schemaConfig.value.startDate;
      if (schemaConfig.value.endDate) schema.endDate = schemaConfig.value.endDate;
      if (schemaConfig.value.location) schema.location = schemaConfig.value.location;
      if (schemaConfig.value.organizer) schema.organizer = schemaConfig.value.organizer;
      if (schemaConfig.value.performer) schema.performer = schemaConfig.value.performer;
      if (schemaConfig.value.offers) schema.offers = schemaConfig.value.offers;
      if (schemaConfig.value.eventStatus) schema.eventStatus = schemaConfig.value.eventStatus;
      if (schemaConfig.value.eventAttendanceMode) schema.eventAttendanceMode = schemaConfig.value.eventAttendanceMode;
      break;

    case 'Restaurant':
      if (schemaConfig.value.servesCuisine) schema.servesCuisine = schemaConfig.value.servesCuisine;
      if (schemaConfig.value.menu) schema.menu = schemaConfig.value.menu;
      if (schemaConfig.value.acceptsReservations) schema.acceptsReservations = schemaConfig.value.acceptsReservations;
      if (schemaConfig.value.driveThrough) schema.driveThrough = schemaConfig.value.driveThrough;
      if (schemaConfig.value.deliveryAvailable) schema.deliveryAvailable = schemaConfig.value.deliveryAvailable;
      break;
  }

  const jsonString = JSON.stringify(schema, null, 2);
  console.log('JSON final généré:', jsonString);
  return jsonString;
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedContent.value);
  } catch (e) {
    console.error('Erreur lors de la copie:', e);
  }
};

const downloadFile = () => {
  const blob = new Blob([generatedContent.value], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = configTab.value === 'robots' ? 'robots.txt' : 'schema.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const commonProperties: Partial<Record<keyof SchemaConfig, string>> = {
  image: 'mdi-image',
  telephone: 'mdi-phone',
  email: 'mdi-email',
  address: 'mdi-map-marker'
} as const;

const typeSpecificProperties: Record<string, SchemaProperty[]> = {
  Organization: [
    { key: 'logo', label: 'Logo', icon: 'mdi-image', type: 'image' },
    { key: 'socialProfiles', label: 'Profils sociaux', icon: 'mdi-account-group', type: 'chips', color: 'primary' },
    { key: 'foundingDate', label: 'Date de création', icon: 'mdi-calendar', type: 'date' },
    { key: 'legalName', label: 'Nom légal', icon: 'mdi-office-building' },
    { key: 'numberOfEmployees', label: 'Nombre d\'employés', icon: 'mdi-account-group' }
  ],
  Person: [
    { key: 'jobTitle', label: 'Titre du poste', icon: 'mdi-badge-account' },
    { key: 'givenName', label: 'Prénom', icon: 'mdi-account' },
    { key: 'familyName', label: 'Nom', icon: 'mdi-account' },
    { key: 'birthDate', label: 'Date de naissance', icon: 'mdi-calendar', type: 'date' }
  ],
  Product: [
    { key: 'price', label: 'Prix', icon: 'mdi-currency-usd' },
    { key: 'brand', label: 'Marque', icon: 'mdi-tag' },
    { key: 'category', label: 'Catégorie', icon: 'mdi-shape' }
  ],
  Article: [
    { key: 'headline', label: 'Titre', icon: 'mdi-format-title' },
    { key: 'author', label: 'Auteur', icon: 'mdi-account-edit' },
    { key: 'datePublished', label: 'Date de publication', icon: 'mdi-calendar', type: 'date' }
  ],
  LocalBusiness: [
    { key: 'openingHours', label: 'Horaires d\'ouverture', icon: 'mdi-clock-outline' },
    { key: 'priceRange', label: 'Fourchette de prix', icon: 'mdi-currency-usd' }
  ],
  WebSite: [
    { key: 'potentialAction', label: 'URL de recherche', icon: 'mdi-magnify' },
    { key: 'inLanguage', label: 'Langues', icon: 'mdi-translate' }
  ],
  Event: [
    { key: 'startDate', label: 'Date de début', icon: 'mdi-calendar', type: 'date' },
    { key: 'endDate', label: 'Date de fin', icon: 'mdi-calendar', type: 'date' },
    { key: 'location', label: 'Lieu', icon: 'mdi-map-marker' }
  ],
  Restaurant: [
    { key: 'servesCuisine', label: 'Type de cuisine', icon: 'mdi-food' },
    { key: 'menu', label: 'Menu', icon: 'mdi-menu' },
    { key: 'options', label: 'Options', icon: 'mdi-checkbox-marked-circle-outline', type: 'restaurant-options' }
  ]
} as const;

const isSchemaKey = (key: string): key is keyof SchemaConfig => {
  return key in schemaConfig.value;
};

const getSchemaValue = (key: string) => {
  if (isSchemaKey(key)) {
    return schemaConfig.value[key];
  }
  return undefined;
};

const getPropertyLabel = (key: string): string => {
  const labels: Record<string, string> = {
    image: 'Image',
    telephone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    logo: 'Logo',
    socialProfiles: 'Profils sociaux',
    foundingDate: 'Date de création',
    legalName: 'Nom légal',
    numberOfEmployees: 'Nombre d\'employés',
    jobTitle: 'Titre du poste',
    givenName: 'Prénom',
    familyName: 'Nom',
    birthDate: 'Date de naissance',
    worksFor: 'Travaille pour',
    alumniOf: 'Ancien de',
    price: 'Prix',
    currency: 'Devise',
    availability: 'Disponibilité',
    brand: 'Marque',
    category: 'Catégorie',
    sku: 'Référence (SKU)',
    gtin: 'GTIN',
    mpn: 'MPN',
    color: 'Couleur',
    material: 'Matériau',
    headline: 'Titre',
    author: 'Auteur',
    datePublished: 'Date de publication',
    dateModified: 'Date de modification',
    publisher: 'Éditeur',
    keywords: 'Mots-clés',
    articleSection: 'Section',
    articleBody: 'Contenu',
    openingHours: 'Horaires d\'ouverture',
    priceRange: 'Fourchette de prix',
    areaServed: 'Zone desservie',
    hasMap: 'URL de la carte',
    geo: 'Coordonnées géographiques',
    faxNumber: 'Numéro de fax',
    aggregateRating: 'Note moyenne',
    potentialAction: 'URL de recherche',
    inLanguage: 'Langues',
    copyrightYear: 'Année de copyright',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    location: 'Lieu',
    organizer: 'Organisateur',
    performer: 'Artiste/Performer',
    offers: 'Offres',
    eventStatus: 'Statut de l\'événement',
    eventAttendanceMode: 'Mode de participation',
    servesCuisine: 'Type de cuisine',
    menu: 'URL du menu',
    acceptsReservations: 'Accepte les réservations',
    smokingAllowed: 'Fumeur autorisé',
    servesAlcohol: 'Service d\'alcool',
    driveThrough: 'Drive-through',
    deliveryAvailable: 'Livraison disponible'
  };
  return labels[key] || key;
};
</script>

<style scoped>
.content-preview {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  white-space: pre-wrap;
  max-height: 500px;
  overflow-y: auto;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
}

.schema-preview {
  max-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0;
}

.robots-preview {
  max-height: 500px;
  overflow-y: auto;
  font-family: monospace;
}
</style>
