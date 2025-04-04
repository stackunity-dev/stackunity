<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">

        <v-row>
          <v-col cols="12" lg="4">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-cog</v-icon>
                Configuration
              </v-card-title>
              <v-card-text class="pa-4">
                <v-text-field v-model="targetUrl" label="Website URL" variant="outlined" prepend-inner-icon="mdi-web"
                  placeholder="https://example.com" class="mb-4"></v-text-field>

                <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = null">
                  <div class="d-flex flex-column">
                    <div class="text-subtitle-1 font-weight-bold mb-1">
                      Erreur lors de l'audit SEO
                    </div>
                    <div>{{ error }}</div>
                    <div v-if="error && error.includes('Chrome') || error.includes('chromium')"
                      class="mt-2 text-caption">
                      <v-divider class="my-2"></v-divider>
                      <div class="font-weight-bold">Solutions possibles :</div>
                      <ul>
                        <li>Vérifiez que Google Chrome est installé sur le serveur dans un des chemins standards</li>
                        <li>Sur Windows, Chrome doit être installé dans "C:\Program
                          Files\Google\Chrome\Application\chrome.exe"</li>
                        <li>L'utilisateur du serveur doit avoir les droits d'accès au fichier chrome.exe</li>
                      </ul>
                    </div>
                  </div>
                </v-alert>

                <v-expansion-panels variant="accordion">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <div class="d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-tune</v-icon>
                        Advanced Options
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-slider v-model="options.maxDepth" :min="1" :max="5" :step="1" label="Maximum Depth"
                        thumb-label></v-slider>

                      <v-switch v-model="options.sameDomainOnly" label="Same Domain Only" color="primary" hide-details
                        class="mb-4"></v-switch>

                      <v-switch v-model="options.analyzeMultiplePages" label="Analyze Multiple Pages" color="primary"
                        hide-details class="mb-4"></v-switch>

                      <v-switch v-model="options.scrapeAllUrls" label="Analyze Entire Domain" color="primary"
                        hide-details class="mb-4"></v-switch>

                      <v-switch v-model="options.useRapidApi" label="Use Advanced Analysis (RapidAPI)" color="primary"
                        hide-details class="mb-4"></v-switch>

                      <v-text-field v-model="options.maxUrlsToAnalyze" type="number" label="Max URLs to Analyze"
                        variant="outlined" density="comfortable" class="mb-2" hide-details
                        :disabled="!options.scrapeAllUrls && !options.analyzeMultiplePages"></v-text-field>

                      <v-text-field v-model="options.timeout" type="number" label="Timeout (ms)" variant="outlined"
                        density="comfortable" class="mb-2" hide-details></v-text-field>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <div class="d-flex justify-space-between align-center mt-4">
                  <v-btn color="primary" :loading="auditing" @click="startAudit" size="large">
                    <v-icon start>mdi-magnify</v-icon>
                    Start Audit
                  </v-btn>
                  <v-btn v-if="auditing" color="error" variant="outlined" @click="stopAudit">Stop</v-btn>
                </div>
              </v-card-text>
            </v-card>

            <v-card v-if="report" class="mt-4 rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list v-if="report && report.summary">
                  <template v-for="(item, index) in summaryItems" :key="index">
                    <v-divider v-if="index === 3 || index === 6 || index === 9" class="my-2"></v-divider>
                    <v-list-item :prepend-icon="item.icon">
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.value(report) }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-list>
                <v-alert v-else type="info" class="mt-2">
                  Chargement du résumé...
                </v-alert>

                <v-btn color="primary" block class="mt-4" prepend-icon="mdi-file-pdf-box" @click="generatePDFReport">
                  Generate PDF Report
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="8">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-format-list-checks</v-icon>
                Audit Results
                <v-spacer></v-spacer>
                <v-progress-circular v-if="auditing" indeterminate color="white"></v-progress-circular>
              </v-card-title>

              <v-card-text class="pa-4">
                <template v-if="!auditing && !report">
                  <div class="text-center pa-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
                    <div class="text-h6 mt-4 text-grey">No Results</div>
                    <div class="text-body-1 text-grey-darken-1">Configure and start an audit to see results
                    </div>
                  </div>
                </template>

                <template v-else-if="report">
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(result, url) in report.seoResults" :key="url"
                      :class="result.warnings.length === 0 ? 'result-success' : result.warnings.length < 3 ? 'result-warning' : 'result-error'">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon
                            :color="result.warnings.length === 0 ? 'success' : result.warnings.length < 3 ? 'warning' : 'error'"
                            class="mr-2">
                            {{ result.warnings.length === 0 ? 'mdi-check-circle' : result.warnings.length < 3
                              ? 'mdi-alert' : 'mdi-alert-circle' }} </v-icon>
                              <div>
                                <div class="text-subtitle-1">{{ parseUrl(url).pathname }}</div>
                                <div class="text-caption text-grey">{{ parseUrl(url).host }}</div>
                              </div>
                              <v-spacer></v-spacer>
                              <v-chip
                                :color="result.warnings.length === 0 ? 'success' : result.warnings.length < 3 ? 'warning' : 'error'"
                                size="small" class="ml-2">
                                {{ result.warnings.length }} issue(s)
                              </v-chip>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-tabs v-model="activeTab" color="primary" grow>
                          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
                            <v-icon start>{{ tab.icon }}</v-icon>
                            {{ tab.label }}
                            <v-chip
                              v-if="(tab.value === 'warnings' || tab.value === 'overview') && result.warnings?.length"
                              size="x-small" class="ml-1" :color="tab.value === 'warnings' ? 'error' : 'primary'">
                              {{ result.warnings.length }}
                            </v-chip>
                          </v-tab>
                        </v-tabs>

                        <v-window v-model="activeTab">
                          <v-window-item value="overview">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-star</v-icon>
                                    Global Score
                                  </v-card-title>
                                  <v-card-text>
                                    <div class="d-flex align-center">
                                      <v-progress-circular :model-value="calculateOverallScore(result)"
                                        :color="getScoreColor(calculateOverallScore(result))" size="64" class="mr-4">
                                        {{ calculateOverallScore(result) }}%
                                      </v-progress-circular>
                                      <div>
                                        <div class="text-h6">{{ getScoreStatus(calculateOverallScore(result)) }}</div>
                                        <div class="text-caption text-grey">{{
                                          getScoreDescription(calculateOverallScore(result)) }}</div>
                                      </div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-alert</v-icon>
                                    Critical Issues
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact" v-if="getCriticalIssues(result).length > 0">
                                      <v-list-item v-for="(critical, index) in getCriticalIssues(result)" :key="index"
                                        :color="critical.severity">
                                        <v-list-item-title>{{ critical.title }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ critical.description }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                    <div v-else class="d-flex flex-column align-center justify-center py-4">
                                      <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
                                      <div class="text-body-1 text-medium-emphasis">No critical issues found</div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="technical">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-speedometer</v-icon>
                                    Performance
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item>
                                        <v-list-item-title>Loading Time</v-list-item-title>
                                        <v-list-item-subtitle>{{ (result.loadTime / 1000).toFixed(2)
                                        }}s</v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item v-for="(vital, name) in result.coreWebVitals" :key="name">
                                        <template v-if="isDisplayableVital(name)">
                                          <v-list-item-title>{{ getCoreWebVitalName(name) }}</v-list-item-title>
                                          <v-list-item-subtitle>
                                            {{ formatVitalValue(vital, name) }}
                                            <v-chip size="x-small"
                                              :color="getVitalScoreColor(result.coreWebVitals[name + 'Score'])"
                                              v-if="result.coreWebVitals[name + 'Score']">
                                              {{ result.coreWebVitals[name + 'Score'] }}%
                                            </v-chip>
                                          </v-list-item-subtitle>
                                        </template>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-cellphone</v-icon>
                                    Mobile Compatibility
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item>
                                        <v-list-item-title>Viewport</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ result.mobileCompatibility.hasViewport ? 'Present' : 'Missing' }}
                                          <v-chip size="x-small"
                                            :color="result.mobileCompatibility.hasViewport ? 'success' : 'error'"
                                            class="ml-2">
                                            {{ result.mobileCompatibility.hasViewport ? 'OK' : 'Fix Required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item>
                                        <v-list-item-title>Touch Targets</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ result.mobileCompatibility.smallTouchTargets }} small touch areas
                                          <v-chip size="x-small"
                                            :color="result.mobileCompatibility.smallTouchTargets === 0 ? 'success' : 'warning'"
                                            class="ml-2">{{ result.mobileCompatibility.smallTouchTargets === 0 ? 'OK' :
                                              'Needs Improvement' }}</v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>

                              <v-col cols="12">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-code-tags</v-icon>
                                    Technical SEO
                                  </v-card-title>
                                  <v-card-text>
                                    <v-row>
                                      <v-col cols="12" md="4">
                                        <v-list density="compact">
                                          <v-list-item>
                                            <v-list-item-title>Sitemap</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ result.technicalSEO?.sitemapFound ? 'Found' : 'Not found' }}
                                              <v-chip size="x-small"
                                                :color="result.technicalSEO?.sitemapFound ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ result.technicalSEO?.sitemapFound ? 'OK' : 'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item v-if="result.technicalSEO?.sitemapFound">
                                            <v-list-item-title>Sitemap URL</v-list-item-title>
                                            <v-list-item-subtitle>
                                              <a :href="result.technicalSEO?.sitemapUrl" target="_blank"
                                                class="text-decoration-none">
                                                {{ result.technicalSEO?.sitemapUrl }}
                                                <v-icon size="x-small">mdi-open-in-new</v-icon>
                                              </a>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item v-if="result.technicalSEO?.sitemapFound">
                                            <v-list-item-title>URLs in sitemap</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ result.technicalSEO?.sitemapUrls || 'Unknown' }}
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-list density="compact">
                                          <v-list-item>
                                            <v-list-item-title>Meta Description</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ result.description ? result.description.length + ' characters' :
                                                'Not defined' }}
                                              <v-chip size="x-small"
                                                :color="!result.description ? 'error' : (result.description.length < 50) ? 'warning' : (result.description.length > 160) ? 'warning' : 'success'"
                                                class="ml-2">
                                                {{ !result.description ? 'Missing' : (result.description.length < 50)
                                                  ? 'Too short' : (result.description.length > 160) ? 'Too long' :
                                                    'Optimal' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item>
                                            <v-list-item-title>Robots.txt</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ result.technicalSEO?.robotsTxtFound ? 'Found' : 'Not found' }}
                                              <v-chip size="x-small"
                                                :color="result.technicalSEO?.robotsTxtFound ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ result.technicalSEO?.robotsTxtFound ? 'OK' : 'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item v-if="result.technicalSEO?.robotsTxtFound">
                                            <v-list-item-title>Content</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-btn size="x-small" variant="text" color="primary" class="pa-0"
                                                @click="showRobotsTxtDialog(result.technicalSEO?.robotsTxtContent)">
                                                View content
                                                <v-icon size="small" end>mdi-eye</v-icon>
                                              </v-btn>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-list density="compact">
                                          <v-list-item>
                                            <v-list-item-title>Schema.org</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ Object.keys(result.technicalSEO?.schemaTypeCount || {}).length > 0 ?
                                                'Found' : 'Not found' }}
                                              <v-chip size="x-small"
                                                :color="Object.keys(result.technicalSEO?.schemaTypeCount || {}).length > 0 ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ Object.keys(result.technicalSEO?.schemaTypeCount || {}).length > 0 ?
                                                  'OK' : 'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item v-for="(count, type) in result.technicalSEO?.schemaTypeCount"
                                            :key="type">
                                            <v-list-item-title>{{ type }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ count }} instance(s)
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="content">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-format-header-1</v-icon>
                                    Heading Structure
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item v-for="(h1, index) in result.headingStructure.h1" :key="index">
                                        <v-list-item-title>H1 {{ index + 1 }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ h1 }}</v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item v-for="(h2, index) in result.headingStructure.h2" :key="index">
                                        <v-list-item-title>H2 {{ index + 1 }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ h2 }}</v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item v-for="(h3, index) in result.headingStructure.h3" :key="index">
                                        <v-list-item-title>H3 {{ index + 1 }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ h3 }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-image</v-icon>
                                    Images
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact" v-if="result.imageAlt && result.imageAlt.length > 0">
                                      <v-list-item v-for="(img, index) in result.imageAlt" :key="index">
                                        <v-list-item-title>Image {{ index + 1 }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ img.alt || 'No alt text' }}
                                          <v-chip size="x-small" :color="img.alt ? 'success' : 'error'" class="ml-2">
                                            {{ img.alt ? 'OK' : 'Missing' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                    <div v-else class="pa-4 text-center">
                                      <v-icon size="36" color="grey-lighten-1">mdi-image-off</v-icon>
                                      <div class="text-body-2 text-grey mt-2">No images detected on this page</div>
                                      <v-chip size="small" color="info" class="mt-2">Tip: Add relevant images with alt
                                        attributes</v-chip>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="metatags">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-robot</v-icon>
                                    Robots Meta
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item>
                                        <v-list-item-title>Indexing</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ getRobotsMeta(result).index ? 'Allowed' : 'Forbidden' }}
                                          <v-chip size="x-small"
                                            :color="getRobotsMeta(result).index ? 'success' : 'warning'" class="ml-2">
                                            {{ getRobotsMeta(result).index ? 'OK' : 'Check Required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item>
                                        <v-list-item-title>Link Following</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ getRobotsMeta(result).follow ? 'Allowed' : 'Forbidden' }}
                                          <v-chip size="x-small"
                                            :color="getRobotsMeta(result).follow ? 'success' : 'warning'" class="ml-2">
                                            {{ getRobotsMeta(result).follow ? 'OK' : 'Check Required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-share-variant</v-icon>
                                    Social Tags
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item v-for="(tag, tagIndex) in result.socialTags.ogTags"
                                        :key="'og-' + tagIndex">
                                        <v-list-item-title>{{ tag.property || 'og:tag' }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ tag.content || '-' }}</v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item v-for="(tag, tagIndex) in result.socialTags.twitterTags"
                                        :key="'twitter-' + tagIndex">
                                        <v-list-item-title>{{ tag.name || 'twitter:tag' }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ tag.content || '-' }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="security">
                            <v-row>
                              <v-col cols="12">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-shield-check</v-icon>
                                    Security
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item>
                                        <v-list-item-title>HTTPS</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ result.securityChecks.https ? 'Active' : 'Not active' }}
                                          <v-chip size="x-small"
                                            :color="result.securityChecks.https ? 'success' : 'error'" class="ml-2">
                                            {{ result.securityChecks.https ? 'OK' : 'Activation Required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item v-for="header in result.securityChecks.securityHeaders"
                                        :key="header.name">
                                        <v-list-item-title>{{ header.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ header.value }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="warnings">
                            <v-row>
                              <v-col cols="12">
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-alert-circle</v-icon>
                                    Warnings List
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list v-if="result.warnings && result.warnings.length > 0">
                                      <v-list-item v-for="(warning, index) in result.warnings" :key="index">
                                        <template v-slot:prepend>
                                          <v-icon
                                            :color="typeof warning === 'string' ? 'warning' : getWarningSeverityColor(warning.severity)"
                                            class="mr-2">
                                            {{ typeof warning === 'string' ? 'mdi-alert' :
                                              getWarningSeverityIcon(warning.severity) }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>{{ typeof warning === 'string' ? warning : warning.message
                                        }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ typeof warning === 'string' ? 'General warning' :
                                          getWarningImpactDescription(warning.type)
                                        }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                    <div v-else class="text-center pa-4">
                                      <v-icon size="48" color="success">mdi-check-circle</v-icon>
                                      <div class="text-h6 mt-2">No warnings detected</div>
                                      <div class="text-body-2 text-grey">This page appears to be well optimized</div>
                                    </div>
                                  </v-card-text>
                                </v-card>

                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-2 d-flex align-center">
                                    <v-icon start color="primary">mdi-chart-bar</v-icon>
                                    Performance Analysis
                                  </v-card-title>
                                  <v-card-text>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-card class="mb-3">
                                          <v-card-text>
                                            <div class="d-flex justify-space-around flex-wrap">
                                              <div class="text-center pa-2">
                                                <div class="text-subtitle-2 mb-2">Overall Performance</div>
                                                <v-progress-circular :model-value="getPerformanceScore(result)"
                                                  :color="getPerformanceColor(getPerformanceScore(result))" size="100"
                                                  width="10" class="mb-2">
                                                  <template v-slot:default>
                                                    <strong class="text-h5">{{ Math.round(getPerformanceScore(result))
                                                    }}%</strong>
                                                  </template>
                                                </v-progress-circular>
                                                <div class="text-caption mt-2">
                                                  <v-chip size="x-small"
                                                    :color="getPerformanceColor(getPerformanceScore(result))">
                                                    {{ getPerformanceScore(result) >= 90 ? 'Excellent' :
                                                      getPerformanceScore(result) >= 70 ? 'Good' :
                                                        getPerformanceScore(result) >= 50 ? 'Average' : 'Poor' }}
                                                  </v-chip>
                                                </div>
                                              </div>

                                              <div class="text-center pa-2">
                                                <div class="text-subtitle-2 mb-2">Mobile Optimization</div>
                                                <v-progress-circular :model-value="getMobileScore(result)"
                                                  :color="getPerformanceColor(getMobileScore(result))" size="100"
                                                  width="10" class="mb-2">
                                                  <template v-slot:default>
                                                    <strong class="text-h5">{{ Math.round(getMobileScore(result))
                                                    }}%</strong>
                                                  </template>
                                                </v-progress-circular>
                                                <div class="text-caption mt-2">
                                                  <v-chip size="x-small"
                                                    :color="getPerformanceColor(getMobileScore(result))">
                                                    {{ getMobileScore(result) >= 90 ? 'Excellent' :
                                                      getMobileScore(result) >= 70 ? 'Good' :
                                                        getMobileScore(result) >= 50 ? 'Average' : 'Poor' }}
                                                  </v-chip>
                                                </div>
                                              </div>

                                              <div class="text-center pa-2">
                                                <div class="text-subtitle-2 mb-2">SEO Optimization</div>
                                                <v-progress-circular :model-value="getSEOScore(result)"
                                                  :color="getPerformanceColor(getSEOScore(result))" size="100"
                                                  width="10" class="mb-2">
                                                  <template v-slot:default>
                                                    <strong class="text-h5">{{ Math.round(getSEOScore(result))
                                                    }}%</strong>
                                                  </template>
                                                </v-progress-circular>
                                                <div class="text-caption mt-2">
                                                  <v-chip size="x-small"
                                                    :color="getPerformanceColor(getSEOScore(result))">
                                                    {{ getSEOScore(result) >= 90 ? 'Excellent' : getSEOScore(result) >=
                                                      70 ? 'Good' :
                                                      getSEOScore(result) >= 50 ? 'Average' : 'Poor' }}
                                                  </v-chip>
                                                </div>
                                              </div>
                                            </div>
                                          </v-card-text>
                                        </v-card>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="action">
                            <v-row>
                              <v-col cols="12">
                                <v-card-title class="text-subtitle-1">
                                  <v-icon start>mdi-checkbox-marked-circle-outline</v-icon>
                                  SEO Action Plan
                                </v-card-title>

                                <v-card-subtitle class="px-0 text-primary font-weight-bold">
                                  Priority Recommendations
                                </v-card-subtitle>

                                <div v-if="getActionItems(result).high.length > 0">
                                  <v-timeline density="compact" align="start">
                                    <v-timeline-item v-for="(item, i) in getActionItems(result).high" :key="i"
                                      size="small" dot-color="error">
                                      <div class="d-flex">
                                        <div class="flex-grow-1">
                                          <div class="text-subtitle-2">{{ item.title }}</div>
                                          <div class="text-body-2 text-grey">{{ item.description }}</div>
                                          <div v-if="item.code"
                                            class="mt-2 pa-2 bg-grey-lighten-4 rounded code-snippet">
                                            <code>{{ item.code }}</code>
                                          </div>
                                        </div>
                                        <v-chip class="ml-2" color="error" size="small">High Priority</v-chip>
                                      </div>
                                    </v-timeline-item>
                                  </v-timeline>
                                </div>
                                <div v-else class="text-center pa-2">
                                  <v-icon color="success">mdi-check-circle</v-icon>
                                  <span class="ml-2">No high-priority actions needed</span>
                                </div>
                              </v-col>
                            </v-row>

                            <v-divider class="my-3"></v-divider>

                            <v-row>
                              <v-col cols="12">
                                <v-card-subtitle class="px-0 font-weight-bold">
                                  Recommended Improvements
                                </v-card-subtitle>

                                <div v-if="getActionItems(result).medium.length > 0">
                                  <v-list density="compact">
                                    <v-list-item v-for="(item, i) in getActionItems(result).medium" :key="i"
                                      :prepend-icon="item.icon || 'mdi-alert'" :title="item.title"
                                      :subtitle="item.description" lines="two">
                                      <template v-slot:append>
                                        <v-chip color="warning" size="x-small">Medium</v-chip>
                                      </template>
                                    </v-list-item>
                                  </v-list>
                                </div>
                                <div v-else class="text-center pa-2">
                                  <span>No medium-priority improvements needed</span>
                                </div>
                              </v-col>
                            </v-row>

                            <v-divider class="my-3"></v-divider>

                            <v-row>
                              <v-col cols="12">
                                <v-card-subtitle class="px-0 font-weight-bold text-primary">
                                  Ranking Impact
                                </v-card-subtitle>

                                <v-card outlined class="pa-3 mb-3 ranking-impact">
                                  <div class="d-flex align-center">
                                    <v-icon :color="getRankingImpactColor(result)" size="large" class="mr-3">{{
                                      getRankingImpactIcon(result)
                                    }}</v-icon>
                                    <div>
                                      <div class="text-h6">{{ getRankingImpactTitle(result) }}</div>
                                      <div class="text-body-2">{{ getRankingImpactDescription(result) }}</div>
                                    </div>
                                  </div>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>
                        </v-window>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-btn :disabled="!report" @click="generateSitemap" color="secondary" class="mr-2">
                  Generate Sitemap
                </v-btn>
                <v-btn :disabled="!report" @click="previewSitemap" color="info">
                  Preview Sitemap
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showSitemapPreview" max-width="900" persistent scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <div>
            <v-icon start>mdi-xml</v-icon>
            Preview sitemap.xml
            <v-chip class="ml-2" size="small" color="primary">{{ report?.visitedURLs.length || 0 }} URLs</v-chip>
          </div>
          <v-btn icon @click="showSitemapPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-tabs v-model="sitemapPreviewTab">
            <v-tab value="code">XML Code</v-tab>
            <v-tab value="preview">Preview</v-tab>
          </v-tabs>

          <v-window v-model="sitemapPreviewTab">
            <v-window-item value="code">
              <pre class="sitemap-preview pa-4 bg-grey-darken-4">
            <code>{{ sitemapPreview }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="preview">
              <div class="pa-4">
                <h3>URLs included in the sitemap ({{ report?.visitedURLs.length || 0 }})</h3>
                <v-list>
                  <v-list-item v-for="(url, i) in report?.visitedURLs" :key="i">
                    <v-list-item-title>
                      {{ url }}
                      <v-chip size="x-small" class="ml-2" :color="url === targetUrl ? 'primary' : 'secondary'">
                        {{ url === targetUrl ? '1.0' : '0.8' }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <h3 class="mt-4">Images included in the sitemap</h3>
                <div v-if="getTotalImagesInSitemap() > 0" class="d-flex flex-wrap">
                  <v-chip class="ma-1" size="small" color="info">
                    Total: {{ getTotalImagesInSitemap() }} images
                  </v-chip>
                  <v-chip class="ma-1" size="small" :color="getMissingAltImagesCount() > 0 ? 'error' : 'success'">
                    {{ getMissingAltImagesCount() }} images without alt attribute
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip color="warning">No images detected</v-chip>
                </div>

                <h3 class="mt-4">Videos included in the sitemap</h3>
                <div v-if="getTotalVideosInSitemap() > 0" class="d-flex flex-wrap">
                  <v-chip class="ma-1" size="small" color="info">
                    Total: {{ getTotalVideosInSitemap() }} videos
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip color="warning">No videos detected</v-chip>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" prepend-icon="mdi-download" @click="downloadSitemap">
            Download sitemap.xml
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showSitemapPreview = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="robotsTxtDialog" width="600">
      <v-card>
        <v-card-title class="bg-primary text-white py-3 px-4">
          <v-icon color="white" class="mr-2">mdi-robot</v-icon>
          robots.txt Content
        </v-card-title>
        <v-card-text class="pa-4">
          <v-alert type="info" variant="tonal" class="mb-4">
            The robots.txt file tells search engines which pages they can and cannot crawl on your site.
          </v-alert>
          <v-sheet class="pa-3 bg-grey-lighten-4 rounded" style="white-space: pre-wrap; font-family: monospace;">
            {{ robotsTxtContent }}
          </v-sheet>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="robotsTxtDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import {
  getCriticalIssues,
  getMobileScore,
  getPerformanceColor,
  getRankingImpactColor,
  getRankingImpactDescription,
  getRankingImpactIcon,
  getRankingImpactTitle,
  getRobotsMeta,
  getScoreColor,
  getScoreDescription,
  getScoreStatus,
  getWarningImpactDescription,
  getWarningSeverityColor,
  getWarningSeverityIcon,
  parseUrl
} from '../utils/seoAuditUtils';

useHead({
  title: 'SEO Audit Tool',
  meta: [
    { name: 'description', content: 'Analyze your website and get SEO optimization recommendations' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'SEO Audit Tool' },
    { name: 'og:description', content: 'Analyze your website and get SEO optimization recommendations' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
});

definePageMeta({
  layout: 'dashboard',
  requiresPremium: true
});

interface SEOResult {
  warnings: Array<string | { severity: string; message: string }>;
  loadTime: number;
  description: string;
  coreWebVitals: Record<string, any>;
  mobileCompatibility: {
    hasViewport: boolean;
    smallTouchTargets: number;
  };
  technicalSEO: {
    sitemapFound: boolean;
    sitemapUrl?: string;
    sitemapUrls?: number;
    robotsTxtFound: boolean;
    robotsTxtContent?: string;
    schemaTypeCount: Record<string, number>;
  };
  headingStructure: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  socialTags: {
    ogTags: Array<{ property: string; content: string }>;
    twitterTags: Array<{ name: string; content: string }>;
  };
  securityChecks: {
    https: boolean;
    securityHeaders: Array<{ name: string; value: string }>;
  };
  imageAlt: Array<{
    alt?: string;
    src?: string;
    title?: string;
    width?: number;
    height?: number;
  }>;
  videoInfo?: Array<{
    src: string;
    length?: number;
    thumbnail?: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
  }>;
}

interface SEOReport {
  seoResults: Record<string, SEOResult>;
  summary?: {
    totalPages: number;
    averageLoadTime: number;
    totalWarnings: number;
    missingTitles: number;
    missingDescriptions: number;
    missingAltTags: number;
    averageFCP: number;
    averageLCP: number;
    averageTTFB: number;
    pagesWithStructuredData: number;
    pagesWithSocialTags: number;
    mobileCompatiblePages: number;
    securePages: number;
  };
  visitedURLs: string[];
}

const report = ref<SEOReport | null>(null);
const targetUrl = ref('');
const auditing = ref(false);
const error = ref<string | null>(null);
const showSitemapPreview = ref(false);
const sitemapPreview = ref('');
const sitemapPreviewTab = ref('code');

const userStore = useUserStore();
const url = ref('');
const loading = ref(false);
const showAdvancedOptions = ref(false);
const depthLevel = ref(1);
const maxUrls = ref(20);
const sameDomainOnly = ref(true);
const useAdvancedApi = ref(true);

interface AuditOptions {
  maxDepth: number;
  sameDomainOnly: boolean;
  timeout: number;
  analyzeMultiplePages: boolean;
  scrapeAllUrls: boolean;
  useRapidApi: boolean;
  maxUrlsToAnalyze: number;
}

const options = ref<AuditOptions>({
  maxDepth: 2,
  sameDomainOnly: true,
  timeout: 30000,
  analyzeMultiplePages: false,
  scrapeAllUrls: false,
  useRapidApi: true,
  maxUrlsToAnalyze: 20
});

const activeTab = ref('overview');

const tabs = [
  { value: 'overview', icon: 'mdi-view-dashboard', label: 'Overview' },
  { value: 'technical', icon: 'mdi-tools', label: 'Technical Analysis' },
  { value: 'content', icon: 'mdi-file-document', label: 'Content' },
  { value: 'metatags', icon: 'mdi-tag-multiple', label: 'Meta Tags' },
  { value: 'security', icon: 'mdi-shield', label: 'Security' },
  { value: 'warnings', icon: 'mdi-alert', label: 'Warnings' },
  { value: 'action', icon: 'mdi-checkbox-marked-circle-outline', label: 'SEO Action Plan' }
];

const robotsTxtDialog = ref(false);
const robotsTxtContent = ref('');

const startAudit = async () => {
  if (!targetUrl.value) {
    error.value = 'Please enter a URL';
    return;
  }

  try {
    error.value = null;
    auditing.value = true;
    report.value = null;

    console.log('Démarrage de l\'audit SEO pour:', targetUrl.value);
    console.log('Options:', options.value);
    console.log('Token disponible:', !!userStore.token);

    report.value = await userStore.auditSEO(targetUrl.value, options.value);
    console.log('Audit SEO terminé, résultat:', !!report.value);
    if (report.value) {
      console.log('Pages analysées:', report.value.summary?.totalPages || 'N/A');
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred during the audit';
    console.error('Error during audit:', err);
  } finally {
    auditing.value = false;
  }
};

const stopAudit = () => {
  auditing.value = false;
};

const generatePDFReport = async () => {
  try {
    const response = await fetch('/api/seo-audit.pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        url: targetUrl.value,
        report: report.value
      })
    });

    if (!response.ok) {
      error.value = 'Error generating PDF';
      throw new Error('Error generating PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.pdf`;

    if (document.body) {
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    error.value = err.message || 'Error generating PDF';
  }
};

const generateSitemapXML = () => {
  if (!report.value) return '';

  const urls = Object.keys(report.value.seoResults);
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls.map(url => {
    const pageData = report.value!.seoResults[url];

    const imageXML = pageData.imageAlt.length > 0
      ? pageData.imageAlt.map(img => {
        if (!img.src || img.src.startsWith('data:') || !img.src.match(/^(http|https):\/\//)) {
          return '';
        }
        return `
    <image:image>
      <image:loc>${img.src}</image:loc>
      ${img.title ? `<image:title><![CDATA[${img.title}]]></image:title>` : img.alt ? `<image:title><![CDATA[${img.alt}]]></image:title>` : ''}
      ${img.width && img.height ? `<image:caption>Image size: ${img.width}x${img.height}</image:caption>` : ''}
    </image:image>`;
      }).join('')
      : '';

    const videoXML = pageData.videoInfo && pageData.videoInfo.length > 0
      ? pageData.videoInfo.map(video => {
        if (!video.src || !video.src.match(/^(http|https):\/\//)) {
          return '';
        }

        return `
    <video:video>
      <video:thumbnail_loc>${video.thumbnail || url}</video:thumbnail_loc>
      <video:title>${video.title || 'Video'}</video:title>
      <video:description>${video.description || 'Video content'}</video:description>
      <video:content_loc>${video.src}</video:content_loc>
      ${video.width && video.height ? `<video:width>${video.width}</video:width>
      <video:height>${video.height}</video:height>` : ''}
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`;
      }).join('')
      : '';

    const ogTitle = pageData.socialTags.ogTags.find(tag => tag.property === 'og:title')?.content;
    const ogDesc = pageData.socialTags.ogTags.find(tag => tag.property === 'og:description')?.content;

    const urlDepth = (url.match(/\//g) || []).length - 2;
    const priority = Math.max(0.1, url === targetUrl.value ? 1.0 : 1.0 - (urlDepth * 0.2)).toFixed(1);

    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imageXML}${videoXML}
  </url>`;
  }).join('')}
</urlset>`;
};

const previewSitemap = () => {
  sitemapPreview.value = generateSitemapXML();
  showSitemapPreview.value = true;
};

const downloadSitemap = () => {
  const xml = generateSitemapXML();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';

  if (document.body) {
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

const generateSitemap = downloadSitemap;

const getTotalImagesInSitemap = (): number => {
  if (!report.value) return 0;
  return Object.values(report.value.seoResults).reduce((total, page: SEOResult) =>
    total + (page.imageAlt?.length || 0), 0);
};

const getMissingAltImagesCount = (): number => {
  if (!report.value) return 0;
  return Object.values(report.value.seoResults).reduce((total, page: SEOResult) => {
    return total + (page.imageAlt?.filter(img => !img.alt)?.length || 0);
  }, 0);
};

const getTotalVideosInSitemap = (): number => {
  if (!report.value) return 0;
  return Object.values(report.value.seoResults).reduce((total, page: SEOResult) => {
    return total + (page.videoInfo?.length || 0);
  }, 0);
};

const summaryItems = [
  {
    icon: 'mdi-file-document-multiple',
    title: 'Pages Analyzed',
    value: (report: any) => report?.summary?.totalPages ?? 0,
  },
  {
    icon: 'mdi-clock',
    title: 'Average Load Time',
    value: (report: any) => `${((report?.summary?.averageLoadTime ?? 0) / 1000).toFixed(2)}s`,
  },
  {
    icon: 'mdi-alert',
    title: 'Warnings',
    value: (report: any) => report?.summary?.totalWarnings ?? 0,
  },
  {
    icon: 'mdi-format-title',
    title: 'Pages Without Title',
    value: (report: any) => report?.summary?.missingTitles ?? 0,
  },
  {
    icon: 'mdi-text-box',
    title: 'Pages Without Description',
    value: (report: any) => report?.summary?.missingDescriptions ?? 0,
  },
  {
    icon: 'mdi-image',
    title: 'Images Without Alt',
    value: (report: any) => report?.summary?.missingAltTags ?? 0,
  },
  {
    icon: 'mdi-speedometer',
    title: 'First Contentful Paint',
    value: (report: any) => `${((report?.summary?.averageFCP ?? 0) / 1000).toFixed(2)}s`,
  },
  {
    icon: 'mdi-page-layout-body',
    title: 'Largest Contentful Paint',
    value: (report: any) => `${((report?.summary?.averageLCP ?? 0) / 1000).toFixed(2)}s`
  },
  {
    icon: 'mdi-timer',
    title: 'Time to First Byte',
    value: (report: any) => `${((report?.summary?.averageTTFB ?? 0) / 1000).toFixed(2)}s`
  },
  {
    icon: 'mdi-code-json',
    title: 'Structured Data',
    value: (report: any) => {
      const pages = report?.summary?.totalPages ?? 1;
      const pagesWithData = report?.summary?.pagesWithStructuredData ?? 0;
      return `${Math.round((pagesWithData / pages) * 100)}% of pages`;
    }
  },
  {
    icon: 'mdi-share-variant',
    title: 'Social Media Tags',
    value: (report: any) => {
      const pages = report?.summary?.totalPages ?? 1;
      const pagesWithTags = report?.summary?.pagesWithSocialTags ?? 0;
      return `${Math.round((pagesWithTags / pages) * 100)}% of pages`;
    }
  },
  {
    icon: 'mdi-cellphone',
    title: 'Mobile Compatibility',
    value: (report: any) => {
      const pages = report?.summary?.totalPages ?? 1;
      const mobilePages = report?.summary?.mobileCompatiblePages ?? 0;
      return `${Math.round((mobilePages / pages) * 100)}% of pages`;
    }
  },
  {
    icon: 'mdi-shield-check',
    title: 'HTTPS Security',
    value: (report: any) => {
      const pages = report?.summary?.totalPages ?? 1;
      const securePages = report?.summary?.securePages ?? 0;
      return `${Math.round((securePages / pages) * 100)}% of pages`;
    }
  }
];

const showRobotsTxtDialog = (content: string) => {
  robotsTxtContent.value = content || 'No content available';
  robotsTxtDialog.value = true;
};

function isDisplayableVital(name: string): boolean {
  const displayableVitals = [
    'FCP', 'LCP', 'TTFB', 'speedIndex', 'timeToInteractive',
    'totalBlockingTime', 'cumulativeLayoutShift', 'performanceScore'
  ];
  return displayableVitals.includes(name);
}

function formatVitalValue(value: number | undefined, name: string): string {
  if (value === undefined || value === 0) return 'N/A';

  if (name === 'cumulativeLayoutShift') {
    return value.toFixed(3);
  }
  return (value / 1000).toFixed(2) + 's';
}

function getVitalScoreColor(score: number | undefined): string {
  if (!score) return 'grey';
  if (score >= 90) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

function getCoreWebVitalName(name: string): string {
  const names: Record<string, string> = {
    FCP: 'First Contentful Paint',
    LCP: 'Largest Contentful Paint',
    TTFB: 'Time to First Byte',
    speedIndex: 'Speed Index',
    timeToInteractive: 'Time to Interactive',
    totalBlockingTime: 'Total Blocking Time',
    cumulativeLayoutShift: 'Cumulative Layout Shift',
    performanceScore: 'Performance Score'
  };
  return names[name] || name;
}

function calculateOverallScore(result: any): number {
  if (!result) return 0;

  const performanceScore = result.coreWebVitals?.performanceScore || 0;
  const contentScore = result.contentStats?.wordCount > 300 ? 100 : (result.contentStats?.wordCount / 3);
  const technicalScore = result.securityChecks?.https ? 100 : 50;

  return Math.round((performanceScore + contentScore + technicalScore) / 3);
}

function getPerformanceScore(result: any): number {
  if (!result?.coreWebVitals) return 0;
  return result.coreWebVitals.performanceScore || 0;
}

function getSEOScore(result: any): number {
  if (!result) return 0;

  let score = 100;

  // Réduire le score en fonction des problèmes trouvés
  if (!result.title) score -= 20;
  if (!result.description) score -= 15;
  if (!result.h1 || result.h1.length === 0) score -= 15;
  if (result.imageAlt.some(img => !img.alt)) score -= 10;
  if (!result.mobileCompatibility.hasViewport) score -= 10;
  if (!result.securityChecks.https) score -= 15;

  // Réduire le score en fonction du nombre d'avertissements
  score -= Math.min(result.warnings.length * 5, 30);

  return Math.max(0, score);
}

function getActionItems(result: any): { high: any[], medium: any[] } {
  if (!result) return { high: [], medium: [] };

  const actionItems = {
    high: [] as any[],
    medium: [] as any[]
  };

  // Vérification du titre
  if (!result.title) {
    actionItems.high.push({
      title: 'Titre manquant',
      description: 'Ajoutez un titre unique et descriptif à votre page',
      icon: 'mdi-format-title'
    });
  } else if (result.title.length < 30 || result.title.length > 60) {
    actionItems.medium.push({
      title: 'Optimisation du titre',
      description: 'Le titre devrait faire entre 30 et 60 caractères',
      icon: 'mdi-format-title'
    });
  }

  // Vérification de la méta description
  if (!result.description) {
    actionItems.high.push({
      title: 'Meta description manquante',
      description: 'Ajoutez une meta description pertinente',
      icon: 'mdi-text-box'
    });
  } else if (result.description.length < 120 || result.description.length > 160) {
    actionItems.medium.push({
      title: 'Optimisation de la meta description',
      description: 'La meta description devrait faire entre 120 et 160 caractères',
      icon: 'mdi-text-box'
    });
  }

  // Vérification des images
  const imagesWithoutAlt = result.imageAlt.filter((img: any) => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    actionItems.high.push({
      title: 'Images sans attribut alt',
      description: `${imagesWithoutAlt.length} image(s) n'ont pas d'attribut alt`,
      icon: 'mdi-image'
    });
  }

  // Vérification de la structure des titres
  if (!result.h1 || result.h1.length === 0) {
    actionItems.high.push({
      title: 'H1 manquant',
      description: 'Ajoutez un titre H1 principal à votre page',
      icon: 'mdi-format-header-1'
    });
  } else if (result.h1.length > 1) {
    actionItems.medium.push({
      title: 'Multiple H1',
      description: 'Une page ne devrait avoir qu\'un seul titre H1',
      icon: 'mdi-format-header-1'
    });
  }

  // Vérification HTTPS
  if (!result.securityChecks.https) {
    actionItems.high.push({
      title: 'HTTPS non activé',
      description: 'Activez HTTPS pour sécuriser votre site',
      icon: 'mdi-shield'
    });
  }

  // Vérification mobile
  if (!result.mobileCompatibility.hasViewport) {
    actionItems.high.push({
      title: 'Viewport meta manquant',
      description: 'Ajoutez une balise viewport pour l\'affichage mobile',
      icon: 'mdi-cellphone'
    });
  }

  return actionItems;
}

onBeforeUnmount(() => {
  if (auditing.value) {
    stopAudit();
  }

  report.value = null;
  error.value = null;

  robotsTxtDialog.value = false;
  showSitemapPreview.value = false;
});

async function analyzeSite() {
  if (!url.value) {
    error.value = 'Veuillez entrer une URL valide';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    // Utiliser notre nouvelle API au lieu de l'API RapidAPI
    if (!useAdvancedApi.value) {
      // Utiliser notre nouvelle API avec les fonctionnalités améliorées
      await seoStore.analyzeSiteWithLocalApi(url.value);
    } else {
      // Utiliser l'analyse multi-pages existante si nécessaire
      await seoStore.analyzeSitePages(url.value, depthLevel.value, sameDomainOnly.value, maxUrls.value);
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue pendant l\'analyse';
    console.error('Erreur d\'analyse:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Code existant
});
</script>

<style>
.v-timeline--dense.v-timeline .v-timeline-item .v-timeline-item__body {
  max-width: calc(100% - 24px);
}

.result-success {
  border-left: 4px solid var(--v-success-base) !important;
}

.result-warning {
  border-left: 4px solid var(--v-warning-base) !important;
}

.result-error {
  border-left: 4px solid var(--v-error-base) !important;
}

.page-analysis {
  max-height: 600px;
  overflow-y: auto;
}

.sitemap-preview {
  max-height: 60vh;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.sitemap-preview code {
  display: block;
  padding: 8px;
}

.progress-label {
  font-weight: bold;
}

.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.warning-card {
  border-left: 4px solid var(--v-error-base);
}

.critical-issue {
  background-color: rgba(244, 67, 54, 0.05);
}

.highlight-metric {
  font-weight: bold;
  font-size: 1.1em;
}

.ranking-impact {
  border-left: 4px solid var(--v-primary-base);
  transition: all 0.3s ease;
}

.ranking-impact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.ranking-impact.outlined {
  border: 1px solid #e0e0e0;
}

.code-snippet {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.9em;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.code-snippet:hover {
  background-color: #f0f0f0;
}

.v-timeline-item__body {
  margin-bottom: 12px;
}
</style>