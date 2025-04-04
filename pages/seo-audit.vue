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
                  Resume loading...
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
                    <v-expansion-panel v-for="(_, url) in report.seoResults" :key="url">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <!-- Utiliser le cache pour éviter les variations de comptage -->
                          <v-icon :color="getResultStatus(getResultFromCache(url) || {}).color" class="mr-2">
                            {{ getResultStatus(getResultFromCache(url) || {}).icon }}
                          </v-icon>
                          <div>
                            <div class="text-subtitle-1">{{ parseUrl(url).pathname }}</div>
                            <div class="text-caption text-grey">{{ parseUrl(url).host }}</div>
                          </div>
                          <v-spacer></v-spacer>
                          <v-chip :color="getResultStatus(getResultFromCache(url) || {}).color" size="small"
                            class="ml-2">
                            {{ computeWarningCounts(getResultFromCache(url) || {}).total }} issue(s)
                          </v-chip>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-tabs v-model="activeTab" color="primary" grow>
                          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
                            <v-icon start>{{ tab.icon }}</v-icon>
                            {{ tab.label }}
                            <v-chip
                              v-if="(tab.value === 'warnings' || tab.value === 'overview') && getResultFromCache(url)?.warnings?.length"
                              size="x-small" class="ml-1" :color="tab.value === 'warnings' ? 'error' : 'primary'">
                              {{ getResultFromCache(url)?.warnings?.length || 0 }}
                            </v-chip>
                          </v-tab>
                        </v-tabs>

                        <v-window v-model="activeTab">
                          <!-- Utiliser partout la fonction getResultFromCache pour accéder au résultat stable -->
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
                                      <v-progress-circular
                                        :model-value="calculateOverallScore(getResultFromCache(url) || {})"
                                        :color="getScoreColor(calculateOverallScore(getResultFromCache(url) || {}))"
                                        size="64" class="mr-4">
                                        {{ calculateOverallScore(getResultFromCache(url) || {}) }}%
                                      </v-progress-circular>
                                      <div>
                                        <div class="text-h6">
                                          {{ getScoreStatus(calculateOverallScore(getResultFromCache(url) || {})) }}
                                        </div>
                                        <div class="text-caption text-grey">
                                          {{ getScoreDescription(calculateOverallScore(getResultFromCache(url) || {}))
                                          }}
                                        </div>
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
                                    <v-list density="compact"
                                      v-if="getCriticalIssues(getResultFromCache(url) || {}).length > 0">
                                      <v-list-item
                                        v-for="(critical, index) in getCriticalIssues(getResultFromCache(url) || {})"
                                        :key="index" :color="critical.severity">
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
                                        <v-list-item-subtitle>{{ ((getResultFromCache(url)?.loadTime ?? 0) /
                                          1000).toFixed(2)
                                        }}s</v-list-item-subtitle>
                                      </v-list-item>
                                      <template v-if="getResultFromCache(url)?.coreWebVitals">
                                        <v-list-item v-for="(vital, name) in getResultFromCache(url)?.coreWebVitals"
                                          :key="name">
                                          <template v-if="isDisplayableVital(name)">
                                            <v-list-item-title>{{ getCoreWebVitalName(name) }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ formatVitalValue(vital, name) }}
                                              <v-chip size="x-small"
                                                :color="getVitalScoreColor(getResultFromCache(url)?.coreWebVitals[name + 'Score'])"
                                                v-if="getResultFromCache(url)?.coreWebVitals[name + 'Score']">
                                                {{ getResultFromCache(url)?.coreWebVitals[name + 'Score'] }}%
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </template>
                                        </v-list-item>
                                      </template>
                                      <template v-else>
                                        <v-list-item>
                                          <v-list-item-title class="text-center text-grey">
                                            Aucune donnée de performance disponible
                                          </v-list-item-title>
                                        </v-list-item>
                                      </template>
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
                                          {{ getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'Present' :
                                            'Missing' }}
                                          <v-chip size="x-small"
                                            :color="getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'success' : 'error'"
                                            class="ml-2">
                                            {{ getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'OK' :
                                              'Fix required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item>
                                        <v-list-item-title>Touch Targets</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ getResultFromCache(url)?.mobileCompatibility?.smallTouchTargets ?? 0 }}
                                          small touch areas
                                          <v-chip size="x-small"
                                            :color="(getResultFromCache(url)?.mobileCompatibility?.smallTouchTargets ?? 0) === 0 ? 'success' : 'warning'"
                                            class="ml-2">{{
                                              (getResultFromCache(url)?.mobileCompatibility?.smallTouchTargets ?? 0) === 0
                                                ?
                                                'OK' :
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
                                              {{ getResultFromCache(url)?.technicalSEO?.sitemapFound ? 'Found' :
                                                'Not found' }}
                                              <v-chip size="x-small"
                                                :color="getResultFromCache(url)?.technicalSEO?.sitemapFound ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ getResultFromCache(url)?.technicalSEO?.sitemapFound ? 'OK' :
                                                  'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item
                                            v-if="getResultFromCache(url)?.technicalSEO?.sitemapFound && getResultFromCache(url)?.technicalSEO?.sitemapUrl">
                                            <v-list-item-title>Sitemap URL</v-list-item-title>
                                            <v-list-item-subtitle>
                                              <a :href="getResultFromCache(url)?.technicalSEO?.sitemapUrl"
                                                target="_blank" class="text-decoration-none">
                                                {{ getResultFromCache(url)?.technicalSEO?.sitemapUrl }}
                                                <v-icon size="x-small">mdi-open-in-new</v-icon>
                                              </a>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item
                                            v-if="getResultFromCache(url)?.technicalSEO?.sitemapFound && getResultFromCache(url)?.technicalSEO?.sitemapUrls !== undefined">
                                            <v-list-item-title>URLs in sitemap</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ getResultFromCache(url)?.technicalSEO?.sitemapUrls || 'Unknown' }}
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-list density="compact">
                                          <v-list-item>
                                            <v-list-item-title>Meta Description</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ getResultFromCache(url)?.description ?
                                                getResultFromCache(url)?.description.length + ' characters' :
                                                'Not defined' }}
                                              <v-chip size="x-small"
                                                :color="!getResultFromCache(url)?.description ? 'error' : (getResultFromCache(url)?.description.length < 50) ? 'warning' : (getResultFromCache(url)?.description.length > 160) ? 'warning' : 'success'"
                                                class="ml-2">
                                                {{ !getResultFromCache(url)?.description ? 'Missing' :
                                                  (getResultFromCache(url)?.description.length < 50) ? 'Too short' :
                                                    (getResultFromCache(url)?.description.length > 160) ? 'Too long' :
                                                      'Optimal' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item>
                                            <v-list-item-title>Robots.txt</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ getResultFromCache(url)?.technicalSEO?.robotsTxtFound ? 'Found' :
                                                'Not found' }}
                                              <v-chip size="x-small"
                                                :color="getResultFromCache(url)?.technicalSEO?.robotsTxtFound ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ getResultFromCache(url)?.technicalSEO?.robotsTxtFound ? 'OK' :
                                                  'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item
                                            v-if="getResultFromCache(url)?.technicalSEO?.robotsTxtFound && getResultFromCache(url)?.technicalSEO?.robotsTxtContent">
                                            <v-list-item-title>Content</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-btn size="x-small" variant="text" color="primary" class="pa-0"
                                                @click="showRobotsTxtDialog(getResultFromCache(url)?.technicalSEO?.robotsTxtContent || '')">
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
                                              {{ Object.keys(getResultFromCache(url)?.technicalSEO?.schemaTypeCount ||
                                                {}).length > 0 ?
                                                'Found' : 'Not found' }}
                                              <v-chip size="x-small"
                                                :color="Object.keys(getResultFromCache(url)?.technicalSEO?.schemaTypeCount || {}).length > 0 ? 'success' : 'warning'"
                                                class="ml-2">
                                                {{ Object.keys(getResultFromCache(url)?.technicalSEO?.schemaTypeCount ||
                                                  {}).length > 0 ?
                                                  'OK' : 'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item
                                            v-for="(count, type) in getResultFromCache(url)?.technicalSEO?.schemaTypeCount || {}"
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
                                      <template v-if="getResultFromCache(url)?.headingStructure?.h1?.length">
                                        <v-list-item v-for="(h1, index) in getResultFromCache(url)?.headingStructure.h1"
                                          :key="'h1-' + index">
                                          <v-list-item-title>H1 {{ index + 1 }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ h1 }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template v-if="getResultFromCache(url)?.headingStructure?.h2?.length">
                                        <v-list-item v-for="(h2, index) in getResultFromCache(url)?.headingStructure.h2"
                                          :key="'h2-' + index">
                                          <v-list-item-title>H2 {{ index + 1 }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ h2 }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template v-if="getResultFromCache(url)?.headingStructure?.h3?.length">
                                        <v-list-item v-for="(h3, index) in getResultFromCache(url)?.headingStructure.h3"
                                          :key="'h3-' + index">
                                          <v-list-item-title>H3 {{ index + 1 }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ h3 }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template
                                        v-if="!getResultFromCache(url)?.headingStructure?.h1?.length && !getResultFromCache(url)?.headingStructure?.h2?.length && !getResultFromCache(url)?.headingStructure?.h3?.length">
                                        <v-list-item>
                                          <v-list-item-title class="text-center text-grey">
                                            Aucune structure de titres trouvée
                                          </v-list-item-title>
                                        </v-list-item>
                                      </template>
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
                                    <v-list density="compact"
                                      v-if="getResultFromCache(url)?.imageAlt && getResultFromCache(url)?.imageAlt.length > 0">
                                      <v-list-item v-for="(img, index) in getResultFromCache(url)?.imageAlt"
                                        :key="index">
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
                                          {{ getRobotsMeta(getResultFromCache(url) || {}).index ? 'Allowed' :
                                            'Forbidden' }}
                                          <v-chip size="x-small"
                                            :color="getRobotsMeta(getResultFromCache(url) || {}).index ? 'success' : 'warning'"
                                            class="ml-2">
                                            {{ getRobotsMeta(getResultFromCache(url) || {}).index ? 'OK' :
                                              'Check required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item>
                                        <v-list-item-title>Link Following</v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ getRobotsMeta(getResultFromCache(url) || {}).follow ? 'Allowed' :
                                            'Forbidden' }}
                                          <v-chip size="x-small"
                                            :color="getRobotsMeta(getResultFromCache(url) || {}).follow ? 'success' : 'warning'"
                                            class="ml-2">
                                            {{ getRobotsMeta(getResultFromCache(url) || {}).follow ? 'OK' :
                                              'Check required' }}
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
                                      <template v-if="getResultFromCache(url)?.socialTags?.ogTags?.length">
                                        <v-list-item
                                          v-for="(tag, tagIndex) in getResultFromCache(url)?.socialTags.ogTags"
                                          :key="'og-' + tagIndex">
                                          <v-list-item-title>{{ tag.property || 'og:tag' }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ tag.content || '-' }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template v-if="getResultFromCache(url)?.socialTags?.twitterTags?.length">
                                        <v-list-item
                                          v-for="(tag, tagIndex) in getResultFromCache(url)?.socialTags.twitterTags"
                                          :key="'twitter-' + tagIndex">
                                          <v-list-item-title>{{ tag.name || 'twitter:tag' }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ tag.content || '-' }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template
                                        v-if="!getResultFromCache(url)?.socialTags?.ogTags?.length && !getResultFromCache(url)?.socialTags?.twitterTags?.length">
                                        <v-list-item>
                                          <v-list-item-title class="text-center text-grey">
                                            Aucun tag social trouvé
                                          </v-list-item-title>
                                        </v-list-item>
                                      </template>
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
                                          {{ getResultFromCache(url)?.securityChecks?.https ? 'Active' : 'Not active' }}
                                          <v-chip size="x-small"
                                            :color="getResultFromCache(url)?.securityChecks?.https ? 'success' : 'error'"
                                            class="ml-2">
                                            {{ getResultFromCache(url)?.securityChecks?.https ? 'OK' :
                                              'Activation required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <template v-if="getResultFromCache(url)?.securityChecks?.securityHeaders?.length">
                                        <v-list-item
                                          v-for="header in getResultFromCache(url)?.securityChecks.securityHeaders"
                                          :key="header.name">
                                          <v-list-item-title>{{ header.name }}</v-list-item-title>
                                          <v-list-item-subtitle>{{ header.value }}</v-list-item-subtitle>
                                        </v-list-item>
                                      </template>
                                      <template
                                        v-else-if="!getResultFromCache(url)?.securityChecks?.securityHeaders?.length">
                                        <v-list-item>
                                          <v-list-item-title class="text-grey text-center">
                                            Aucun en-tête de sécurité trouvé
                                          </v-list-item-title>
                                        </v-list-item>
                                      </template>
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
                                    Résumé des problèmes
                                  </v-card-title>
                                  <v-card-text>
                                    <v-row>
                                      <v-col cols="12" sm="6" md="3"
                                        v-for="(type, index) in ['critical', 'high', 'medium', 'low']" :key="index">
                                        <v-card :color="computeWarningCounts(getResultFromCache(url) || {})[type] > 0 ?
                                          (type === 'critical' || type === 'high' ? 'error' :
                                            type === 'medium' ? 'warning' : 'info') : undefined" variant="outlined">
                                          <v-card-text class="text-center">
                                            <div class="text-h4">{{ computeWarningCounts(getResultFromCache(url) ||
                                              {})[type] }}</div>
                                            <div class="text-caption">Issues {{
                                              type === 'critical' ? 'Critiques' :
                                                type === 'high' ? 'Importantes' :
                                                  type === 'medium' ? 'Moyennes' : 'Mineures'
                                            }}</div>
                                          </v-card-text>
                                        </v-card>
                                      </v-col>
                                    </v-row>

                                    <v-divider class="my-4"></v-divider>

                                    <v-list v-if="getResultFromCache(url)?.warnings?.length">
                                      <v-list-item v-for="(warning, index) in getResultFromCache(url)?.warnings"
                                        :key="index">
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
                                        <v-list-item-subtitle>
                                          {{ typeof warning === 'string' ? 'Avertissement général' :
                                            `Impact: ${warning.severity.charAt(0).toUpperCase() +
                                            warning.severity.slice(1)}` }}
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                    <div v-else class="text-center pa-4">
                                      <v-icon size="48" color="success">mdi-check-circle</v-icon>
                                      <div class="text-h6 mt-2">Aucun problème détecté</div>
                                      <div class="text-body-2 text-grey">Cette page semble bien optimisée</div>
                                    </div>
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

                                <div v-if="getActionItems(getResultFromCache(url) || {}).high.length > 0">
                                  <v-timeline density="compact" align="start">
                                    <v-timeline-item
                                      v-for="(item, i) in getActionItems(getResultFromCache(url) || {}).high" :key="i"
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

                                <div v-if="getActionItems(getResultFromCache(url) || {}).medium.length > 0">
                                  <v-list density="compact">
                                    <v-list-item
                                      v-for="(item, i) in getActionItems(getResultFromCache(url) || {}).medium" :key="i"
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
                                    <v-icon :color="getRankingImpactColor(getResultFromCache(url) || {})" size="large"
                                      class="mr-3">{{
                                        getRankingImpactIcon(getResultFromCache(url) || {})
                                      }}</v-icon>
                                    <div>
                                      <div class="text-h6">{{ getRankingImpactTitle(getResultFromCache(url) || {}) }}
                                      </div>
                                      <div class="text-body-2">{{ getRankingImpactDescription(getResultFromCache(url) ||
                                        {}) }}</div>
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
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import {
  getCriticalIssues,
  getRankingImpactColor,
  getRankingImpactDescription,
  getRankingImpactIcon,
  getRankingImpactTitle,
  getRobotsMeta,
  getScoreColor,
  getScoreDescription,
  getScoreStatus,
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
  title?: string;
  warnings: Array<string | { severity: string; message: string; type?: string }>;
  loadTime: number;
  description: string;
  coreWebVitals: Record<string, any>;
  mobileCompatibility: {
    hasViewport: boolean;
    smallTouchTargets: number;
    viewportContent?: string;
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
    hasDimensions?: boolean;
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
  contentStats?: {
    readabilityScore?: number;
    wordCount?: number;
    keywordDensity?: number;
  };
  structuredData?: any[];
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

const resultCache = ref(new Map<string, any>());
const isClient = ref(false);

const startAudit = async () => {
  if (!targetUrl.value) {
    error.value = 'Please enter a URL';
    return;
  }

  try {
    error.value = null;
    auditing.value = true;
    report.value = null;
    resultCache.value.clear();

    console.log('Starting SEO audit for:', targetUrl.value);
    console.log('Options:', options.value);
    console.log('Token available:', !!userStore.token);

    const rawReport = await userStore.auditSEO(targetUrl.value, options.value);
    console.log('Raw data received:', rawReport);

    report.value = adaptSEOResults(rawReport);
    console.log('Processed report:', report.value);
  } catch (e: any) {
    console.error('Error during SEO audit:', e);
    error.value = e.message || 'An error occurred during analysis';
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

const getResultStatus = (result: SEOResult) => {
  if (!result) return { class: '', color: 'grey', icon: 'mdi-help-circle' };

  const counts = computeWarningCounts(result);

  if (counts.critical > 0 || counts.high > 0) {
    return { class: 'result-error', color: 'error', icon: 'mdi-alert-circle' };
  }
  if (counts.medium > 0) {
    return { class: 'result-warning', color: 'warning', icon: 'mdi-alert' };
  }
  return { class: 'result-success', color: 'success', icon: 'mdi-check-circle' };
};

const safeString = (value: any): string => {
  return value !== undefined && value !== null ? String(value) : '';
};

const safeNumber = (value: any): number => {
  return value !== undefined && value !== null && !isNaN(Number(value)) ? Number(value) : 0;
};

const showRobotsTxtDialog = (content: string) => {
  robotsTxtContent.value = content || 'No content available';
  robotsTxtDialog.value = true;
};

// Fonction pour adapter les données du nouveau format d'API au format attendu par l'UI
const adaptSEOData = (data: any): SEOResult => {
  if (!data) return {
    title: '',
    description: '',
    loadTime: 0,
    headingStructure: { h1: [], h2: [], h3: [] },
    imageAlt: [],
    coreWebVitals: {},
    mobileCompatibility: { hasViewport: false, smallTouchTargets: 0 },
    securityChecks: { https: false, securityHeaders: [] },
    socialTags: { ogTags: [], twitterTags: [] },
    technicalSEO: { sitemapFound: false, robotsTxtFound: false, schemaTypeCount: {} },
    structuredData: [],
    warnings: [],
    contentStats: { readabilityScore: 0, wordCount: 0, keywordDensity: 0 }
  };

  // Construire le tableau d'images à partir des données d'images ou créer une entrée par défaut si aucune
  let imageAlt: Array<{ alt?: string; src?: string; title?: string; width?: number; height?: number; hasDimensions?: boolean }> = [];
  if (data.seo?.images?.data && Array.isArray(data.seo.images.data) && data.seo.images.data.length > 0) {
    imageAlt = data.seo.images.data.map((img: any) => ({
      alt: img.alt || '',
      src: img.src || '',
      title: img.title || '',
      width: img.width || 0,
      height: img.height || 0,
      hasDimensions: !!(img.width && img.height)
    }));
  } else if (data.seo?.images?.total > 0 || data.seo?.images?.withoutAlt > 0) {
    // Créer des entrées factices basées sur les statistiques si nous n'avons pas les données détaillées
    const totalImages = data.seo?.images?.total || 0;
    const withoutAlt = data.seo?.images?.withoutAlt || 0;

    for (let i = 0; i < withoutAlt; i++) {
      imageAlt.push({
        alt: '',
        src: '#',
        title: `Image sans alt ${i + 1}`,
        width: 0,
        height: 0,
        hasDimensions: false
      });
    }

    for (let i = 0; i < (totalImages - withoutAlt); i++) {
      imageAlt.push({
        alt: `Alt text ${i + 1}`,
        src: '#',
        title: `Image avec alt ${i + 1}`,
        width: 0,
        height: 0,
        hasDimensions: false
      });
    }
  }

  // Extraire keywordDensity en tant que nombre
  let keywordDensity = 0;
  if (data.seo?.keywordDensity && typeof data.seo.keywordDensity === 'object') {
    const values = Object.values(data.seo.keywordDensity);
    if (values.length > 0 && typeof values[0] === 'number') {
      keywordDensity = values[0];
    }
  }

  return {
    title: data.seo?.title || '',
    description: data.seo?.description || '',
    loadTime: data.performance?.loadTime || 0,
    headingStructure: {
      h1: data.seo?.headings?.h1 || [],
      h2: data.seo?.headings?.h2 || [],
      h3: data.seo?.headings?.h3 || [],
    },
    imageAlt: imageAlt,
    coreWebVitals: {
      FCP: data.performance?.fcp || 0,
      LCP: data.performance?.lcp || 0,
      TTFB: data.performance?.ttfb || 0,
      performanceScore: Math.round((data.performance?.speedIndex || 0) / 10) || 0,
    },
    mobileCompatibility: {
      hasViewport: data.technical?.mobile?.viewport || false,
      smallTouchTargets: 0,
      viewportContent: data.seo?.meta?.viewport || '',
    },
    securityChecks: {
      https: data.technical?.https || false,
      securityHeaders: Object.entries(data.technical?.security?.headers || {}).map(([name, value]) => ({
        name,
        value: String(value)
      }))
    },
    socialTags: {
      ogTags: Object.entries(data.seo?.meta?.og || {}).map(([property, content]) => ({
        property: `og:${property}`,
        content: String(content)
      })),
      twitterTags: Object.entries(data.seo?.meta?.twitter || {}).map(([name, content]) => ({
        name: `twitter:${name}`,
        content: String(content)
      }))
    },
    technicalSEO: {
      sitemapFound: false,
      robotsTxtFound: false,
      schemaTypeCount: data.seo?.structuredData?.types || {}
    },
    structuredData: data.seo?.structuredData?.data || [],
    warnings: [],
    contentStats: {
      readabilityScore: data.seo?.readabilityScore || 0,
      wordCount: data.seo?.wordCount || 0,
      keywordDensity: keywordDensity
    }
  };
};

// Génération automatique des avertissements avec comptage stable
const generateWarnings = (data: any): Array<{ severity: string; message: string; type: string }> => {
  const warnings: Array<{ severity: string; message: string; type: string }> = [];
  const warningSet = new Set(); // To avoid duplicates

  // Utility function to add a unique warning
  const addWarning = (severity: string, message: string, type: string) => {
    const key = `${severity}:${type}:${message}`;
    if (!warningSet.has(key)) {
      warningSet.add(key);
      warnings.push({ severity, message, type });
    }
  };

  // Missing or too short title
  if (!data.seo?.title) {
    addWarning('high', 'Missing page title', 'title');
  } else if (data.seo.title.length < 30) {
    addWarning('medium', 'Title too short (< 30 characters)', 'title');
  } else if (data.seo.title.length > 60) {
    addWarning('medium', 'Title too long (> 60 characters)', 'title');
  }

  // Missing or too short description
  if (!data.seo?.description) {
    addWarning('high', 'Missing meta description', 'description');
  } else if (data.seo.description.length < 120) {
    addWarning('medium', 'Meta description too short (< 120 characters)', 'description');
  } else if (data.seo.description.length > 160) {
    addWarning('medium', 'Meta description too long (> 160 characters)', 'description');
  }

  // Missing H1
  if (!data.seo?.headings?.h1 || data.seo.headings.h1.length === 0) {
    addWarning('high', 'Missing H1 tag', 'h1');
  } else if (data.seo.headings.h1.length > 1) {
    addWarning('medium', 'Multiple H1 tags detected', 'h1');
  }

  // Missing image alt attributes
  if (data.seo?.images?.withoutAlt > 0) {
    addWarning('medium', `${data.seo.images.withoutAlt} image(s) without alt attribute`, 'image');
  }

  // Mobile viewport
  if (!data.technical?.mobile?.viewport) {
    addWarning('high', 'Missing meta viewport for mobile version', 'mobile');
  }

  // HTTPS
  if (!data.technical?.https) {
    addWarning('high', 'Site is not using HTTPS', 'security');
  }

  // Performance
  if ((data.performance?.lcp || 0) > 2500) {
    addWarning('medium', `High LCP (${Math.round(data.performance.lcp)}ms) - Optimize content loading`, 'performance');
  }

  if ((data.performance?.ttfb || 0) > 600) {
    addWarning('medium', `High TTFB (${Math.round(data.performance.ttfb)}ms) - Optimize server response time`, 'performance');
  }

  return warnings;
};

// Fonction pour adapter les résultats complets
const adaptSEOResults = (apiResponse: any): SEOReport => {
  if (!apiResponse) return { seoResults: {}, visitedURLs: [], summary: undefined };

  const visitedURLs = apiResponse.visitedURLs || [];
  const seoResults: Record<string, SEOResult> = {};

  // Transformation des résultats par URL
  Object.entries(apiResponse.seoResults || {}).forEach(([url, data]) => {
    const adaptedData = adaptSEOData(data as any);
    adaptedData.warnings = generateWarnings(data as any);

    // S'assurer que technicalSEO est correctement propagé
    if ((data as any).technicalSEO) {
      console.log(`technicalSEO trouvé pour ${url}:`, (data as any).technicalSEO);
      adaptedData.technicalSEO = (data as any).technicalSEO;
    } else if (url === visitedURLs[0]) {
      // Pour l'URL principale, si technicalSEO n'est pas défini mais existe dans apiResponse
      console.log("URL principale sans technicalSEO, vérification au niveau global");
      if (apiResponse.technicalSEO) {
        console.log("Propagation de technicalSEO depuis la réponse globale");
        adaptedData.technicalSEO = apiResponse.technicalSEO;
      } else {
        console.log("Initialisation d'un technicalSEO par défaut");
        adaptedData.technicalSEO = {
          sitemapFound: false,
          robotsTxtFound: false,
          schemaTypeCount: {}
        };
      }
    } else {
      // Pour les autres URLs, initialiser avec des valeurs par défaut
      console.log(`Initialisation d'un technicalSEO par défaut pour ${url}`);
      adaptedData.technicalSEO = {
        sitemapFound: false,
        robotsTxtFound: false,
        schemaTypeCount: {}
      };
    }

    seoResults[url] = adaptedData;
  });

  // Calcul automatique du résumé
  const summary = calculateSummary(seoResults, visitedURLs);

  return {
    seoResults,
    visitedURLs,
    summary
  };
};

// Fonction pour calculer le résumé
const calculateSummary = (seoResults: Record<string, SEOResult>, visitedURLs: string[]): any => {
  const results = Object.values(seoResults);
  const totalPages = results.length;

  if (totalPages === 0) return undefined;

  let totalLoadTime = 0;
  let totalFCP = 0;
  let totalLCP = 0;
  let totalTTFB = 0;
  let totalWarnings = 0;
  let missingTitles = 0;
  let missingDescriptions = 0;
  let missingAltTags = 0;
  let pagesWithStructuredData = 0;
  let pagesWithSocialTags = 0;
  let mobileCompatiblePages = 0;
  let securePages = 0;

  results.forEach(result => {
    totalLoadTime += result.loadTime || 0;
    totalFCP += result.coreWebVitals?.FCP || 0;
    totalLCP += result.coreWebVitals?.LCP || 0;
    totalTTFB += result.coreWebVitals?.TTFB || 0;
    totalWarnings += result.warnings?.length || 0;

    if (!result.title) missingTitles++;
    if (!result.description) missingDescriptions++;

    // Images sans alt
    if (result.imageAlt) {
      missingAltTags += result.imageAlt.filter(img => !img.alt).length;
    }

    // Structured data
    if (result.structuredData && result.structuredData.length > 0) {
      pagesWithStructuredData++;
    }

    // Social tags
    if ((result.socialTags?.ogTags?.length > 0) || (result.socialTags?.twitterTags?.length > 0)) {
      pagesWithSocialTags++;
    }

    // Mobile compatibility
    if (result.mobileCompatibility?.hasViewport) mobileCompatiblePages++;

    // Security
    if (result.securityChecks?.https) securePages++;
  });

  return {
    totalPages,
    averageLoadTime: totalLoadTime / totalPages,
    totalWarnings,
    missingTitles,
    missingDescriptions,
    missingAltTags,
    averageFCP: totalFCP / totalPages,
    averageLCP: totalLCP / totalPages,
    averageTTFB: totalTTFB / totalPages,
    pagesWithStructuredData: Math.round((pagesWithStructuredData / totalPages) * 100),
    pagesWithSocialTags: Math.round((pagesWithSocialTags / totalPages) * 100),
    mobileCompatiblePages: Math.round((mobileCompatiblePages / totalPages) * 100),
    securePages: Math.round((securePages / totalPages) * 100)
  };
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
  const contentScore = result.contentStats?.wordCount ? (result.contentStats.wordCount > 300 ? 100 : (result.contentStats.wordCount / 3)) : 50;
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
  if (!result.headingStructure?.h1 || result.headingStructure.h1.length === 0) score -= 15;
  if (result.imageAlt?.some(img => !img.alt)) score -= 10;
  if (!result.mobileCompatibility?.hasViewport) score -= 10;
  if (!result.securityChecks?.https) score -= 15;

  // Réduire le score en fonction du nombre d'avertissements
  const warningsCount = result.warnings?.length || 0;
  score -= Math.min(warningsCount * 5, 30);

  return Math.max(0, score);
}

function getActionItems(result: any): { high: any[], medium: any[] } {
  if (!result) return { high: [], medium: [] };

  const actionItems = {
    high: [] as any[],
    medium: [] as any[]
  };

  // Title check
  if (!result.title) {
    actionItems.high.push({
      title: 'Missing title',
      description: 'Add a unique and descriptive title to your page',
      icon: 'mdi-format-title'
    });
  } else if (result.title.length < 30 || result.title.length > 60) {
    actionItems.medium.push({
      title: 'Title optimization',
      description: 'Title should be between 30 and 60 characters',
      icon: 'mdi-format-title'
    });
  }

  // Meta description check
  if (!result.description) {
    actionItems.high.push({
      title: 'Missing meta description',
      description: 'Add a relevant meta description',
      icon: 'mdi-text-box'
    });
  } else if (result.description.length < 120 || result.description.length > 160) {
    actionItems.medium.push({
      title: 'Meta description optimization',
      description: 'Meta description should be between 120 and 160 characters',
      icon: 'mdi-text-box'
    });
  }

  // Images without alt check
  const imagesWithoutAlt = result.imageAlt?.filter((img: any) => !img.alt) || [];
  if (imagesWithoutAlt.length > 0) {
    actionItems.high.push({
      title: 'Images without alt attribute',
      description: `${imagesWithoutAlt.length} image(s) without alt attribute`,
      icon: 'mdi-image'
    });
  }

  // H1 tag check
  if (!result.headingStructure?.h1 || result.headingStructure.h1.length === 0) {
    actionItems.high.push({
      title: 'Missing H1 tag',
      description: 'Add an H1 tag to your page',
      icon: 'mdi-format-header-1'
    });
  } else if (result.headingStructure?.h1.length > 1) {
    actionItems.medium.push({
      title: 'Multiple H1 tags',
      description: 'Only one H1 tag is allowed per page',
      icon: 'mdi-format-header-1'
    });
  }

  // HTTPS check
  if (!result.securityChecks?.https) {
    actionItems.high.push({
      title: 'HTTPS not enabled',
      description: 'Enable HTTPS for secure communication',
      icon: 'mdi-shield'
    });
  }

  // Mobile viewport check
  if (!result.mobileCompatibility?.hasViewport) {
    actionItems.high.push({
      title: 'Missing mobile viewport',
      description: 'Add a viewport meta tag for mobile display',
      icon: 'mdi-cellphone'
    });
  }

  return actionItems;
}

const computeWarningCounts = (result: SEOResult) => {
  if (!result?.warnings) return { critical: 0, high: 0, medium: 0, low: 0, total: 0 };

  // On utilise une Map pour regrouper les avertissements par type et sévérité
  // Cela évite de compter plusieurs fois le même type d'avertissement
  const warningMap = new Map<string, { severity: string, count: number }>();

  result.warnings.forEach(warning => {
    let type = '';
    let severity = '';

    if (typeof warning === 'string') {
      // Par défaut, les avertissements sous forme de chaîne sont considérés comme "medium"
      type = 'general';
      severity = 'medium';
    } else {
      type = warning.type || 'general';
      severity = warning.severity || 'medium';
    }

    const key = `${type}:${severity}`;
    if (warningMap.has(key)) {
      warningMap.get(key)!.count++;
    } else {
      warningMap.set(key, { severity, count: 1 });
    }
  });

  // Compter les avertissements par sévérité
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  };

  warningMap.forEach(item => {
    counts.total += item.count;

    switch (item.severity) {
      case 'critical':
        counts.critical += item.count;
        break;
      case 'high':
        counts.high += item.count;
        break;
      case 'medium':
        counts.medium += item.count;
        break;
      case 'low':
        counts.low += item.count;
        break;
      default:
        // Si severity n'est pas défini, on considère comme "medium"
        counts.medium += item.count;
    }
  });

  return counts;
};

// Fonction pour récupérer les résultats du cache pour éviter les recalculs
const getResultFromCache = (url: string): SEOResult => {
  if (resultCache.value.has(url)) {
    const cachedResult = resultCache.value.get(url) as SEOResult;

    // S'assurer que technicalSEO existe dans le résultat mis en cache
    if (!cachedResult.technicalSEO && report.value?.seoResults[url]?.technicalSEO) {
      console.log(`Ajout de technicalSEO au résultat mis en cache pour ${url}`);
      cachedResult.technicalSEO = report.value.seoResults[url].technicalSEO;
      resultCache.value.set(url, cachedResult);
    }

    return cachedResult;
  }

  if (report.value?.seoResults[url]) {
    const result = { ...report.value.seoResults[url] };

    // S'assurer que technicalSEO est initialisé s'il n'existe pas
    if (!result.technicalSEO) {
      console.log(`Initialisation de technicalSEO pour ${url} depuis le cache`);

      // Pour l'URL principale, utiliser les données de l'analyse racine si disponibles
      if (url === targetUrl.value && report.value.seoResults[targetUrl.value]?.technicalSEO) {
        result.technicalSEO = report.value.seoResults[targetUrl.value].technicalSEO;
      } else {
        result.technicalSEO = {
          sitemapFound: false,
          robotsTxtFound: false,
          schemaTypeCount: {}
        };
      }
    }

    resultCache.value.set(url, result);
    return result;
  }

  // Renvoyer un objet vide mais correctement typé
  const emptyResult: SEOResult = {
    title: '',
    description: '',
    loadTime: 0,
    headingStructure: { h1: [], h2: [], h3: [] },
    imageAlt: [],
    coreWebVitals: {},
    mobileCompatibility: { hasViewport: false, smallTouchTargets: 0 },
    securityChecks: { https: false, securityHeaders: [] },
    socialTags: { ogTags: [], twitterTags: [] },
    warnings: [],
    technicalSEO: { sitemapFound: false, robotsTxtFound: false, schemaTypeCount: {} }
  };

  return emptyResult;
};


onMounted(() => {
  isClient.value = true;
  // Initialize client-side elements here if needed
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