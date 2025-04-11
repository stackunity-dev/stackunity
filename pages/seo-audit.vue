<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">

        <v-row>
          <v-col cols="12" lg="5">
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

            <v-card class="mt-4 rounded-lg" elevation="2" v-if="auditing">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <v-skeleton-loader type="list-item" v-for="i in 4" :key="`summary-${i}`"
                  class="mb-2"></v-skeleton-loader>
                <v-divider class="my-3"></v-divider>
                <v-skeleton-loader type="list-item" v-for="i in 3" :key="`summary-b-${i}`"
                  class="mb-2"></v-skeleton-loader>
                <v-skeleton-loader type="button" class="mt-4"></v-skeleton-loader>
              </v-card-text>
            </v-card>

            <v-card v-if="report" class="mt-4 rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list v-if="report && report.summary">
                  <div v-for="(group, groupIndex) in summaryGroups" :key="groupIndex">
                    <v-divider v-if="groupIndex > 0" class="my-3"></v-divider>
                    <div class="text-subtitle-2 font-weight-medium my-2 py-1 pl-2"
                      :class="`bg-${group.color}-lighten-5 rounded-lg`">
                      <v-icon :color="group.color" size="20" class="mr-2">{{ group.icon }}</v-icon>
                      {{ group.title }}
                    </div>
                    <v-row>
                      <v-col v-for="(item, itemIndex) in group.items" :key="itemIndex" cols="12" sm="6">
                        <v-card variant="outlined" class="mb-2">
                          <v-card-text class="pa-2">
                            <div class="d-flex align-center">
                              <v-icon :color="group.color" size="24" class="mr-3">{{ item.icon }}</v-icon>
                              <div>
                                <div class="text-subtitle-2 font-weight-medium">{{ item.title }}</div>
                                <div class="text-body-2 text-medium-emphasis">{{ item.value(report) }}</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
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

          <v-col cols="12" lg="7">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon :color="getFrameworkColor(getResultFromCache(targetUrl)?.framework?.name || '')" class="mr-2"
                  :icon="getFrameworkIcon(getResultFromCache(targetUrl)?.framework?.name || '')"></v-icon>
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

                <template v-else-if="auditing">
                  <v-sheet class="skeleton-container">
                    <div class="text-h6 mb-3">Loading Audit Data...</div>

                    <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line"
                      class="mb-3 rounded"></v-skeleton-loader>

                    <div class="d-flex mb-4 mt-8">
                      <v-skeleton-loader v-for="i in 4" :key="`tab-${i}`" width="100" type="text"
                        class="mr-2"></v-skeleton-loader>
                    </div>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-skeleton-loader type="card" class="mb-4"></v-skeleton-loader>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-skeleton-loader type="card" class="mb-4"></v-skeleton-loader>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="4" v-for="i in 3" :key="`metric-${i}`">
                        <v-skeleton-loader type="card-avatar" class="mb-4"></v-skeleton-loader>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </template>

                <template v-else-if="report">
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(_, url) in report.seoResults" :key="url">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon :color="getResultStatus(getResultFromCache(url) || {}).color" class="mr-2">
                            {{ getResultStatus(getResultFromCache(url) || {}).icon }}
                          </v-icon>
                          <div>
                            <div class="text-subtitle-1 text-wrap">{{ parseUrl(url).pathname }}</div>
                            <div class="text-caption text-grey text-wrap">{{ parseUrl(url).host }}</div>
                          </div>
                          <v-spacer></v-spacer>
                          <div class="d-flex align-center">
                            <v-chip :color="getResultStatus(getResultFromCache(url) || {}).color" size="small"
                              class="ml-2 flex-shrink-0">
                              {{ computeWarningCounts(getResultFromCache(url) || {}).total }} issue(s)
                            </v-chip>
                          </div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-tabs v-model="activeTab" color="primary" grow>
                          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" class="py-3">
                            <v-icon start size="22" class="mr-2">{{ tab.icon }}</v-icon>
                            {{ tab.label }}
                            <v-badge
                              v-if="(tab.value === 'warnings' || tab.value === 'overview') && getResultFromCache(url)?.warnings?.length"
                              :content="getResultFromCache(url)?.warnings?.length || 0" color="error" location="top end"
                              offset-x="3" offset-y="-8"></v-badge>
                            <v-badge
                              v-if="tab.value === 'security' && getResultFromCache(url)?.securityChecks?.securityIssues?.length"
                              :content="getResultFromCache(url)?.securityChecks?.securityIssues?.length || 0"
                              color="error" location="top end" offset-x="3" offset-y="-8"></v-badge>
                          </v-tab>
                        </v-tabs>

                        <v-window v-model="activeTab" class="mt-4">
                          <v-window-item value="overview">
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="elevated"
                                  class="mb-4 rounded-lg elevation-1 border-primary-subtle overflow-hidden">
                                  <v-card-item class="bg-primary-lighten-4 pa-4">
                                    <template v-slot:prepend>
                                      <v-avatar color="primary" class="mr-3" size="48">
                                        <v-icon size="28" color="white">mdi-star</v-icon>
                                      </v-avatar>
                                    </template>
                                    <v-card-title class="text-h6 font-weight-bold">Global Score</v-card-title>
                                  </v-card-item>
                                  <v-card-text class="pa-4">
                                    <div class="d-flex align-center justify-center py-4">
                                      <v-progress-circular :model-value="calculateGlobalScore()"
                                        :color="getScoreColor(calculateGlobalScore())" size="100" width="12"
                                        class="mr-6">
                                        <span class="text-h6 font-weight-bold">{{
                                          calculateGlobalScore() }}%</span>
                                      </v-progress-circular>
                                      <div>
                                        <div class="text-h5 font-weight-bold"
                                          :class="`${getScoreColor(calculateGlobalScore())}`">
                                          {{ getScoreStatus(calculateGlobalScore()) }}
                                        </div>
                                        <div class="text-body-1 mt-1 text-medium-emphasis">
                                          {{ getScoreDescription(calculateGlobalScore()) }}
                                        </div>
                                      </div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-card variant="elevated"
                                  class="mb-4 rounded-lg elevation-1 border-error-subtle overflow-hidden">
                                  <v-card-item class="bg-error-lighten-4 pa-4">
                                    <template v-slot:prepend>
                                      <v-avatar color="error" class="mr-3" size="48">
                                        <v-icon size="28" color="white">mdi-alert-circle</v-icon>
                                      </v-avatar>
                                    </template>
                                    <v-card-title class="text-h6 font-weight-bold">Critical Issues</v-card-title>
                                  </v-card-item>
                                  <v-card-text class="pa-0">
                                    <v-list v-if="getCriticalIssues(getResultFromCache(url) || {}).length > 0"
                                      class="py-0">
                                      <v-list-item
                                        v-for="(critical, index) in getCriticalIssues(getResultFromCache(url) || {})"
                                        :key="index" :class="`bg-${critical.severity}-lighten-5 mb-2 rounded-lg mx-2`"
                                        class="my-1 rounded">
                                        <template v-slot:prepend>
                                          <v-icon :color="critical.severity" class="mr-2">mdi-alert-circle</v-icon>
                                        </template>
                                        <v-list-item-title class="font-weight-medium text-wrap">{{ critical.title
                                          }}</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap">{{ critical.description
                                          }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                    <div v-else class="d-flex flex-column align-center justify-center py-6">
                                      <v-avatar color="success-lighten-4" size="64" class="mb-3">
                                        <v-icon color="success" size="36">mdi-check-circle</v-icon>
                                      </v-avatar>
                                      <div class="text-body-1 text-success font-weight-medium">No critical issues
                                        detected</div>
                                      <div class="text-caption text-medium-emphasis mt-1">Your page is in good health
                                      </div>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>

                            <v-divider class="my-4"></v-divider>

                            <v-row>

                              <v-col cols="12">
                                <v-card variant="elevated"
                                  class="mb-4 rounded-lg elevation-1 border-warning-subtle h-100">
                                  <v-card-item class="bg-warning-lighten-5 pa-3">
                                    <template v-slot:prepend>
                                      <v-icon color="warning" size="24">mdi-speedometer</v-icon>
                                    </template>
                                    <v-card-title>Performance</v-card-title>
                                  </v-card-item>
                                  <v-card-text class="pa-3">
                                    <v-row>
                                      <v-col cols="6" v-for="metric in getCoreWebVitalsFormatted(url)"
                                        :key="metric.name">
                                        <div class="d-flex flex-column align-center">
                                          <v-progress-circular :model-value="getMetricScore(metric.value)"
                                            :color="getVitalScoreColor(Number(metric.value), metric.name)" :size="60"
                                            :width="6">
                                            <span class="text-caption">{{ formatMetricValue(metric.value) }}</span>
                                          </v-progress-circular>
                                          <div class="text-caption mt-2 text-center">{{ metric.name }}</div>
                                        </div>
                                      </v-col>
                                    </v-row>
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
                                        <v-list-item-title class="text-wrap">Loading Time</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap">{{ ((getResultFromCache(url)?.loadTime
                                          ?? 0) /
                                          1000).toFixed(2)
                                          }}s</v-list-item-subtitle>
                                      </v-list-item>
                                      <template v-if="getResultFromCache(url)?.coreWebVitals">
                                        <v-list-item
                                          v-for="(vital, index) in getResultFromCache(url)?.coreWebVitals || {}"
                                          :key="index">
                                          <template v-if="isDisplayableVital(index)">
                                            <v-list-item-title class="text-wrap">{{ getCoreWebVitalName(index)
                                              }}</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap d-flex align-center">
                                              <span>{{ formatMetricValue(vital ?? 0) }}</span>
                                              <v-chip size="x-small"
                                                :color="getVitalScoreColor(getResultFromCache(url)?.coreWebVitals?.[index + 'Score'])"
                                                v-if="getResultFromCache(url)?.coreWebVitals?.[index + 'Score']"
                                                class="ml-2">
                                                {{ getResultFromCache(url)?.coreWebVitals?.[index + 'Score'] }}%
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </template>
                                        </v-list-item>
                                      </template>
                                      <template v-else>
                                        <v-list-item>
                                          <v-list-item-title class="text-center text-grey">
                                            No performance data available
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
                                        <v-list-item-title class="text-wrap">Viewport</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap d-flex align-center">
                                          <span>{{ getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'Present'
                                            :
                                            'Missing' }}</span>
                                          <v-chip size="x-small"
                                            :color="getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'success' : 'error'"
                                            class="ml-2">
                                            {{ getResultFromCache(url)?.mobileCompatibility?.hasViewport ? 'OK' :
                                              'Fix required' }}
                                          </v-chip>
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                      <v-list-item>
                                        <v-list-item-title class="text-wrap">Touch Targets</v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap d-flex align-center">
                                          <span>{{ getResultFromCache(url)?.mobileCompatibility?.smallTouchTargets ?? 0
                                            }}
                                            small touch areas</span>
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
                                            <v-list-item-title class="text-wrap">Sitemap</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap d-flex align-center">
                                              <span>{{ getResultFromCache(url)?.technicalSEO?.sitemapFound ? 'Found' :
                                                'Not found' }}</span>
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
                                            <v-list-item-title class="text-wrap">Sitemap URL</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap">
                                              <a :href="getResultFromCache(url)?.technicalSEO?.sitemapUrl"
                                                target="_blank" class="text-decoration-none">
                                                {{ getResultFromCache(url)?.technicalSEO?.sitemapUrl }}
                                                <v-icon size="x-small">mdi-open-in-new</v-icon>
                                              </a>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item
                                            v-if="getResultFromCache(url)?.technicalSEO?.sitemapFound && getResultFromCache(url)?.technicalSEO?.sitemapUrls !== undefined">
                                            <v-list-item-title class="text-wrap">URLs in sitemap</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap">
                                              {{ getResultFromCache(url)?.technicalSEO?.sitemapUrls || 'Unknown' }}
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                      <v-col cols="12" md="4">
                                        <v-list density="compact">
                                          <v-list-item>
                                            <v-list-item-title class="text-wrap">Meta Description</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap d-flex align-center">
                                              <span>{{ getResultFromCache(url)?.description ?
                                                getResultFromCache(url)?.description?.length + ' characters' :
                                                'Not defined' }}</span>
                                              <v-chip size="x-small"
                                                :color="!getResultFromCache(url)?.description ? 'error' : (getResultFromCache(url)?.description?.length ?? 0) < 50 ? 'warning' : (getResultFromCache(url)?.description?.length ?? 0) > 160 ? 'warning' : 'success'"
                                                class="ml-2">
                                                {{ !getResultFromCache(url)?.description ? 'Missing' :
                                                  (getResultFromCache(url)?.description?.length ?? 0) < 50 ? 'Too short' :
                                                    (getResultFromCache(url)?.description?.length ?? 0) > 160 ? 'Too long'
                                                      :
                                                      'Optimal' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                          <v-list-item>
                                            <v-list-item-title class="text-wrap">Robots.txt</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap d-flex align-center">
                                              <span>{{ getResultFromCache(url)?.technicalSEO?.robotsTxtFound ? 'Found' :
                                                'Not found' }}</span>
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
                                            <v-list-item-title class="text-wrap">Content</v-list-item-title>
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
                                            <v-list-item-title class="text-wrap">Schema.org</v-list-item-title>
                                            <v-list-item-subtitle class="text-wrap d-flex align-center">
                                              <span>{{
                                                Object.keys(getResultFromCache(url)?.technicalSEO?.schemaTypeCount ||
                                                  {}).length > 0 ?
                                                  'Found' : 'Not found' }}</span>
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
                                              {{ count }} instance(s) found
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
                            <v-card-text>
                              <div class="pa-4">
                                <h3 class="text-h5 mb-4">Content Analysis</h3>

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
                                            <v-list-item
                                              v-for="(h1, index) in getResultFromCache(url)?.headingStructure?.h1 ?? []"
                                              :key="'h1-' + index">
                                              <v-list-item-title>H1 {{ index + 1 }}</v-list-item-title>
                                              <v-list-item-subtitle>{{ h1 }}</v-list-item-subtitle>
                                            </v-list-item>
                                          </template>
                                          <template v-if="getResultFromCache(url)?.headingStructure?.h2?.length">
                                            <v-list-item
                                              v-for="(h2, index) in getResultFromCache(url)?.headingStructure?.h2 ?? []"
                                              :key="'h2-' + index">
                                              <v-list-item-title>H2 {{ index + 1 }}</v-list-item-title>
                                              <v-list-item-subtitle>{{ h2 }}</v-list-item-subtitle>
                                            </v-list-item>
                                          </template>
                                          <template v-if="getResultFromCache(url)?.headingStructure?.h3?.length">
                                            <v-list-item
                                              v-for="(h3, index) in getResultFromCache(url)?.headingStructure?.h3 ?? []"
                                              :key="'h3-' + index">
                                              <v-list-item-title>H3 {{ index + 1 }}</v-list-item-title>
                                              <v-list-item-subtitle>{{ h3 }}</v-list-item-subtitle>
                                            </v-list-item>
                                          </template>
                                          <template
                                            v-if="!getResultFromCache(url)?.headingStructure?.h1?.length && !getResultFromCache(url)?.headingStructure?.h2?.length && !getResultFromCache(url)?.headingStructure?.h3?.length">
                                            <v-list-item>
                                              <v-list-item-title class="text-center text-grey">
                                                No heading structure found
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
                                          v-if="(getResultFromCache(url)?.images?.data?.length ?? 0) > 0">
                                          <v-list-item
                                            v-for="(img, index) in getResultFromCache(url)?.images?.data ?? []"
                                            :key="index">
                                            <v-list-item-title>Image {{ index + 1 }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              {{ img.alt || 'No alt text' }}
                                              <v-chip size="x-small" :color="img.alt ? 'success' : 'error'"
                                                class="ml-2">
                                                {{ img.alt ? 'OK' : 'Missing' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                        <div v-else class="pa-4 text-center">
                                          <v-icon size="36" color="grey-lighten-1">mdi-image-off</v-icon>
                                          <div class="text-body-2 text-grey mt-2">No images detected on this page</div>
                                          <v-chip size="small" color="info" class="mt-2">Tip: Add relevant images with
                                            alt attributes</v-chip>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>

                                  <v-col cols="12">
                                    <v-card variant="outlined" class="mb-4">
                                      <v-card-title class="text-subtitle-1">
                                        <v-icon start>mdi-file</v-icon>
                                        Large Files
                                      </v-card-title>
                                      <v-card-text>
                                        <v-list density="compact">
                                          <v-list-item
                                            v-for="(file, index) in getResultFromCache(url)?.largeFiles || []"
                                            :key="index">
                                            <template v-slot:prepend>
                                              <v-icon :color="file.impact > 0 ? 'warning' : 'success'" size="18">
                                                {{ file.type === 'image' ? 'mdi-image' : file.type === 'script' ?
                                                  'mdi-code-tags' : 'mdi-file' }}
                                              </v-icon>
                                            </template>
                                            <v-list-item-title class="text-wrap">{{ file.url }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              Type: {{ file.type }} | Size: {{ formatFileSize(file.size) }} | Impact: {{
                                                file.impact }}
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-card-text>
                          </v-window-item>

                          <v-window-item value="metatags">
                            <v-card-text>
                              <div class="pa-4">
                                <h3 class="text-h5 mb-4">Meta Tags Analysis</h3>

                                <v-row>
                                  <v-col cols="12" md="6">
                                    <v-card variant="outlined" class="mb-4">
                                      <v-card-title class="text-subtitle-1">
                                        <v-icon start>mdi-tag</v-icon>
                                        Meta Tags Score
                                      </v-card-title>
                                      <v-card-text>
                                        <div class="d-flex align-center justify-center py-4">
                                          <v-progress-circular :model-value="getMetaTagsScore(url)"
                                            :color="getScoreColor(getMetaTagsScore(url))" size="100" width="12"
                                            class="mr-6">
                                            <span class="text-h6 font-weight-bold">{{ getMetaTagsScore(url)
                                              }}%</span>
                                          </v-progress-circular>
                                          <div>
                                            <div class="text-h5 font-weight-bold"
                                              :class="`${getScoreColor(getMetaTagsScore(url))}`">
                                              {{ getScoreStatus(getMetaTagsScore(url)) }}
                                            </div>
                                            <div class="text-body-1 mt-1 text-medium-emphasis">
                                              {{ getScoreDescription(getMetaTagsScore(url)) }}
                                            </div>
                                          </div>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>

                                  <v-col cols="12" md="6">
                                    <v-card variant="outlined" class="mb-4">
                                      <v-card-title class="text-subtitle-1">
                                        <v-icon start>mdi-tag-multiple</v-icon>
                                        Meta Tags Details
                                      </v-card-title>
                                      <v-card-text>
                                        <div class="meta-tags-details">
                                          <h3>Détails des Meta Tags</h3>

                                          <template v-for="(tag, index) in [
                                            {
                                              name: 'Title',
                                              content: getResultFromCache(url).title,
                                              status: 'success',
                                              show: !!getResultFromCache(url).title
                                            },
                                            {
                                              name: 'Meta Description',
                                              content: getResultFromCache(url).description,
                                              status: 'success',
                                              show: !!getResultFromCache(url).description
                                            },
                                            {
                                              name: 'Robots',
                                              content: getResultFromCache(url)?.technicalSEO?.robotsTxtFound ? 'Found' : 'Not found',
                                              status: 'info',
                                              show: true
                                            },
                                            {
                                              name: 'Viewport',
                                              content: getResultFromCache(url).mobileCompatibility?.viewportContent ? 'Found' : 'Not found',
                                              status: 'info',
                                              show: true
                                            }
                                          ]" :key="index">
                                            <div v-if="tag.show" class="mb-4">
                                              <div class="text-caption text-grey">{{ tag.name }}</div>
                                              <div class="text-body-2">{{ tag.content }}</div>
                                            </div>
                                          </template>

                                          <!-- Open Graph Tags -->
                                          <template v-if="getResultFromCache(url)?.socialTags?.ogTags">
                                            <div v-for="(value, key) in getResultFromCache(url)?.socialTags?.ogTags"
                                              :key="'og-' + key" class="mb-4">
                                              <div class="text-caption text-grey">og:{{ key }}</div>
                                              <div class="text-body-2">{{ value }}</div>
                                            </div>
                                          </template>

                                          <!-- Twitter Tags -->
                                          <template v-if="getResultFromCache(url)?.socialTags?.twitterTags">
                                            <div
                                              v-for="(tag, index) in getResultFromCache(url)?.socialTags?.twitterTags"
                                              :key="'twitter-' + index" class="mb-4">
                                              <div class="text-caption text-grey">{{ tag.name }}</div>
                                              <div class="text-body-2">{{ tag.content }}</div>
                                            </div>
                                          </template>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="12">
                                    <v-card variant="outlined">
                                      <v-card-title class="text-subtitle-1">
                                        <v-icon start>mdi-tag-text</v-icon>
                                        Meta Tags Recommendations
                                      </v-card-title>
                                      <v-card-text>
                                        <v-list density="compact">
                                          <v-list-item v-for="(recommendation, index) in getMetaTagsRecommendations()"
                                            :key="index">
                                            <template v-slot:prepend>
                                              <v-icon :color="recommendation.severity === 'high' ? 'error' : 'warning'">
                                                {{ recommendation.severity === 'high' ? 'mdi-alert-circle' : 'mdi-alert'
                                                }}
                                              </v-icon>
                                            </template>
                                            <v-list-item-title>{{ recommendation.title }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ recommendation.description
                                              }}</v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-card-text>
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
                                    </v-list>

                                    <v-divider class="my-3"></v-divider>

                                    <h3 class="text-subtitle-1 mb-3">Security Headers</h3>
                                    <div
                                      v-if="getResultFromCache(url)?.securityChecks?.securityHeaders &&
                                        (Array.isArray(getResultFromCache(url)?.securityChecks?.securityHeaders) ?
                                          (getResultFromCache(url)?.securityChecks?.securityHeaders?.length ?? 0) > 0 :
                                          (Object.keys(getResultFromCache(url)?.securityChecks?.securityHeaders || {}).length ?? 0) > 0)"
                                      class="security-headers-container">
                                      <v-card class="mb-4 pa-0" variant="outlined">
                                        <pre class="security-code-block pa-4 ma-0"><code>{{
                                          formatSecurityHeaders(getResultFromCache(url)?.securityChecks?.securityHeaders || []) }}</code></pre>
                                      </v-card>
                                    </div>
                                    <v-alert v-else type="warning" variant="tonal" class="mb-3">
                                      No security headers found
                                    </v-alert>

                                    <v-divider class="my-3"></v-divider>

                                    <h3 class="text-subtitle-1 mb-3">Detected Security Issues</h3>
                                    <div v-if="getResultFromCache(url)?.securityChecks?.securityIssues?.length">
                                      <v-expansion-panels>
                                        <v-expansion-panel>
                                          <v-expansion-panel-title>
                                            <div class="d-flex align-center">
                                              <v-icon color="warning" class="mr-2">mdi-shield-alert</v-icon>
                                              <span>{{ getResultFromCache(url)?.securityChecks?.securityIssues?.length
                                                }} security issues</span>
                                            </div>
                                          </v-expansion-panel-title>
                                          <v-expansion-panel-text>
                                            <v-list>
                                              <v-list-item
                                                v-for="(issue, index) in getResultFromCache(url)?.securityChecks?.securityIssues"
                                                :key="index">
                                                <template v-slot:prepend>
                                                  <v-avatar :color="getSeverityColor(issue.severity)" size="small"
                                                    class="mr-2">
                                                    <v-icon>{{
                                                      getSeverityIcon(issue.severity) }}</v-icon>
                                                  </v-avatar>
                                                </template>
                                                <v-list-item-title>{{ issue.type }}</v-list-item-title>
                                                <v-list-item-subtitle>{{ issue.description }}</v-list-item-subtitle>
                                              </v-list-item>
                                            </v-list>
                                          </v-expansion-panel-text>
                                        </v-expansion-panel>
                                      </v-expansion-panels>
                                    </div>
                                    <v-alert v-else type="success" variant="tonal">
                                      No security issues detected
                                    </v-alert>
                                  </v-card-text>
                                </v-card>

                                <v-card variant="outlined" class="mb-4">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon start>mdi-lightbulb</v-icon>
                                    Security Recommendations
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item prepend-icon="mdi-lock">
                                        <v-list-item-title>Enable HTTPS</v-list-item-title>
                                        <v-list-item-subtitle>Secure all communications with SSL/TLS
                                          certificate</v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item prepend-icon="mdi-shield">
                                        <v-list-item-title>Configure security headers</v-list-item-title>
                                        <v-list-item-subtitle>Add Content-Security-Policy, X-XSS-Protection and other
                                          headers</v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item prepend-icon="mdi-cookie">
                                        <v-list-item-title>Cookie settings</v-list-item-title>
                                        <v-list-item-subtitle>Use HttpOnly, Secure and SameSite for
                                          cookies</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="warnings">
                            <div>
                              <h3 class="text-h6 mb-4">SEO Warnings</h3>

                              <v-alert v-if="!getResultFromCache(url)?.warnings?.length" type="success" class="mb-4">
                                No warnings detected for this page
                              </v-alert>

                              <template v-else>
                                <v-expansion-panels>
                                  <v-expansion-panel
                                    v-for="(warningGroup, i) in displayWarnings(getResultFromCache(url)?.warnings || [], url)"
                                    :key="i">
                                    <v-expansion-panel-title>
                                      <div class="d-flex align-center">
                                        <v-icon :color="warningGroup.color" class="mr-2">{{ warningGroup.icon
                                          }}</v-icon>
                                        <span class="text-capitalize">{{ warningGroup.type }}</span>
                                        <v-spacer></v-spacer>
                                        <v-chip size="small" :color="warningGroup.color">
                                          {{ warningGroup.warnings.length }}
                                        </v-chip>
                                      </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-list>
                                        <v-list-item v-for="(warning, j) in warningGroup.warnings" :key="j">
                                          <template v-slot:prepend>
                                            <v-icon size="small" :color="warningGroup.color">
                                              {{ warningGroup.icon }}
                                            </v-icon>
                                          </template>
                                          <v-list-item-title>{{ warning.message }}</v-list-item-title>
                                        </v-list-item>
                                      </v-list>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>
                                </v-expansion-panels>

                                <v-card class="mt-4" variant="outlined">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon color="info" class="mr-2">mdi-information</v-icon>
                                    Summary of warnings
                                  </v-card-title>
                                  <v-card-text>
                                    <div class="d-flex flex-wrap gap-2">
                                      <v-chip v-if="computeWarningCounts(getResultFromCache(url) || {}).critical > 0"
                                        color="error" size="small" class="ma-1">
                                        {{ computeWarningCounts(getResultFromCache(url) || {}).critical }} critical(s)
                                      </v-chip>
                                      <v-chip v-if="computeWarningCounts(getResultFromCache(url) || {}).high > 0"
                                        color="warning" size="small" class="ma-1">
                                        {{ computeWarningCounts(getResultFromCache(url) || {}).high }} important(s)
                                      </v-chip>
                                      <v-chip v-if="computeWarningCounts(getResultFromCache(url) || {}).medium > 0"
                                        color="info" size="small" class="ma-1">
                                        {{ computeWarningCounts(getResultFromCache(url) || {}).medium }} medium(s)
                                      </v-chip>
                                      <v-chip v-if="computeWarningCounts(getResultFromCache(url) || {}).low > 0"
                                        color="success" size="small" class="ma-1">
                                        {{ computeWarningCounts(getResultFromCache(url) || {}).low }} minor(s)
                                      </v-chip>
                                    </div>
                                  </v-card-text>
                                </v-card>
                              </template>
                            </div>
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

                          <v-window-item value="accessibility">
                            <v-card-text>
                              <div class="pa-4">
                                <h3 class="text-h5 mb-4">Accessibility Analysis</h3>

                                <v-row>
                                  <v-col cols="12" md="6">
                                    <v-card variant="outlined" class="mb-4">
                                      <v-card-title class="text-h6">Accessibility Score</v-card-title>
                                      <v-card-text>
                                        <div class="d-flex justify-center align-center">
                                          <v-progress-circular
                                            :model-value="normalizePercentage(getResultFromCache(url)?.accessibility?.accessibilityScore || 0)"
                                            :color="getAccessibilityScoreColor(normalizePercentage(getResultFromCache(url)?.accessibility?.accessibilityScore || 0))"
                                            size="100" width="12">
                                            {{
                                              normalizePercentage(getResultFromCache(url)?.accessibility?.accessibilityScore
                                                || 0) }}%
                                          </v-progress-circular>
                                        </div>
                                        <div class="text-center mt-4">
                                          <p class="text-h6"
                                            :class="`text-${getAccessibilityScoreColor(normalizePercentage(getResultFromCache(url)?.accessibility?.accessibilityScore || 0))}`">
                                            {{
                                              getAccessibilityScoreLabel(normalizePercentage(getResultFromCache(url)?.accessibility?.accessibilityScore
                                                || 0))
                                            }}
                                          </p>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>

                                  <v-col cols="12" md="6">
                                    <v-card variant="outlined" class="mb-4">
                                      <v-card-title class="text-h6">Summary of issues</v-card-title>
                                      <v-card-text>
                                        <v-list density="compact">
                                          <v-list-item prepend-icon="mdi-tag-text" density="compact">
                                            <v-list-item-title>Missing ARIA attributes</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-chip class="ml-2" color="primary" size="small">
                                                {{ getResultFromCache(url)?.accessibility?.missingAria || 0 }}
                                              </v-chip>
                                              <v-chip class="ml-2"
                                                :color="getResultFromCache(url)?.accessibility?.missingAria ? 'error' : 'success'"
                                                size="x-small">
                                                {{ getResultFromCache(url)?.accessibility?.missingAria ? 'Problème' :
                                                  'OK' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>

                                          <v-list-item prepend-icon="mdi-image-off" density="compact">
                                            <v-list-item-title>Images without alt attribute</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-chip class="ml-2" color="primary" size="small">
                                                {{ getResultFromCache(url)?.accessibility?.missingAlt || 0 }}
                                              </v-chip>
                                              <v-chip class="ml-2"
                                                :color="getResultFromCache(url)?.accessibility?.missingAlt ? 'error' : 'success'"
                                                size="x-small">
                                                {{ getResultFromCache(url)?.accessibility?.missingAlt ? 'Problème' :
                                                  'OK' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>

                                          <v-list-item prepend-icon="mdi-form-textbox" density="compact">
                                            <v-list-item-title>Form fields without label</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-chip class="ml-2" color="primary" size="small">
                                                {{ getResultFromCache(url)?.accessibility?.missingLabels || 0 }}
                                              </v-chip>
                                              <v-chip class="ml-2"
                                                :color="getResultFromCache(url)?.accessibility?.missingLabels ? 'error' : 'success'"
                                                size="x-small">
                                                {{ getResultFromCache(url)?.accessibility?.missingLabels ? 'Problème' :
                                                  'OK' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>

                                          <v-list-item prepend-icon="mdi-contrast-box" density="compact">
                                            <v-list-item-title>Contrast issues</v-list-item-title>
                                            <v-list-item-subtitle class="d-flex align-center">
                                              <v-chip class="ml-2" color="primary" size="small">
                                                {{ getResultFromCache(url)?.accessibility?.contrastIssues || 0 }}
                                              </v-chip>
                                              <v-chip class="ml-2"
                                                :color="getResultFromCache(url)?.accessibility?.contrastIssues ? 'error' : 'success'"
                                                size="x-small">
                                                {{ getResultFromCache(url)?.accessibility?.contrastIssues ? 'Problème' :
                                                  'OK' }}
                                              </v-chip>
                                            </v-list-item-subtitle>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>

                                <v-expansion-panels v-if="hasAccessibilityIssues(url)">
                                  <v-expansion-panel v-if="getResultFromCache(url)?.accessibility?.ariaIssues?.length">
                                    <v-expansion-panel-title>
                                      <v-icon color="warning" class="mr-2">mdi-tag-text</v-icon>
                                      ARIA issues detected
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-list>
                                        <v-list-item
                                          v-for="(issue, i) in getResultFromCache(url)?.accessibility?.ariaIssues"
                                          :key="i">
                                          <v-list-item-title>
                                            <code>{{ issue.element }}</code>
                                          </v-list-item-title>
                                          <v-list-item-subtitle>
                                            {{ issue.issue }}
                                          </v-list-item-subtitle>
                                        </v-list-item>
                                      </v-list>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>

                                  <v-expansion-panel v-if="getResultFromCache(url)?.accessibility?.inputIssues?.length">
                                    <v-expansion-panel-title>
                                      <v-icon color="warning" class="mr-2">mdi-form-textbox</v-icon>
                                      Form issues
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-list>
                                        <v-list-item
                                          v-for="(issue, i) in getResultFromCache(url)?.accessibility?.inputIssues"
                                          :key="i">
                                          <v-list-item-title>
                                            <code>{{ issue.element }}</code>
                                          </v-list-item-title>
                                          <v-list-item-subtitle>
                                            {{ issue.issue }}
                                          </v-list-item-subtitle>
                                        </v-list-item>
                                      </v-list>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>
                                </v-expansion-panels>

                                <v-alert v-else color="success" icon="mdi-check-circle" class="mt-4">
                                  No accessibility issues detected
                                </v-alert>

                                <h3 class="text-h6 mt-6 mb-3">Accessibility recommendations</h3>
                                <v-card variant="outlined" class="mb-4">
                                  <v-card-text>
                                    <v-list>
                                      <v-list-item prepend-icon="mdi-image"
                                        v-if="getResultFromCache(url)?.accessibility?.missingAlt">
                                        <v-list-item-title>Add alt attributes to images</v-list-item-title>
                                        <v-list-item-subtitle>
                                          All images must have an alt attribute describing their content for screen
                                          readers.
                                        </v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item prepend-icon="mdi-tag"
                                        v-if="getResultFromCache(url)?.accessibility?.missingAria">
                                        <v-list-item-title>Improve ARIA attributes</v-list-item-title>
                                        <v-list-item-subtitle>
                                          Elements with ARIA roles must have the corresponding attributes
                                          for better
                                          accessibility.
                                        </v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item prepend-icon="mdi-form-select"
                                        v-if="getResultFromCache(url)?.accessibility?.missingLabels">
                                        <v-list-item-title>Associate labels to form fields</v-list-item-title>
                                        <v-list-item-subtitle>
                                          All form fields must have an associated label or an aria-label attribute.
                                        </v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item prepend-icon="mdi-check-circle" v-if="!hasAccessibilityIssues(url)">
                                        <v-list-item-title>Excellent accessibility</v-list-item-title>
                                        <v-list-item-subtitle>
                                          Continue to maintain these accessibility practices.
                                        </v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </div>
                            </v-card-text>
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

    <v-row class="mt-4" v-if="isSitemapDialog">
      <v-col cols="12">
        <v-card class="rounded-lg elevation-2">
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-map-marker-path</v-icon>
            Sitemap Preview
          </v-card-title>
          <v-card-text class="py-3">
            <div class="mb-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-link</v-icon>
                <span class="text-subtitle-1 font-weight-bold">URLs in sitemap: {{ getTotalUrlsInSitemap() }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-image</v-icon>
                <span class="text-subtitle-1 font-weight-bold">Images in sitemap: {{ getTotalImagesInSitemap() }}</span>
              </div>
              <v-divider class="my-3"></v-divider>

              <div class="sitemap-preview-container">
                <v-tabs v-model="sitemapTab" color="primary">
                  <v-tab value="code">XML Code</v-tab>
                  <v-tab value="urls">URLs</v-tab>
                  <v-tab value="images">Images</v-tab>
                </v-tabs>

                <v-window v-model="sitemapTab">
                  <v-window-item value="code">
                    <pre class="sitemap-code pa-4 rounded-lg"><code>{{ sitemapPreview }}</code></pre>
                  </v-window-item>

                  <v-window-item value="urls">
                    <v-list lines="two" class="rounded-lg">
                      <v-list-item v-for="(url, index) in extractUrlsFromSitemap()" :key="index">
                        <v-list-item-title>
                          <v-chip color="primary" size="small" class="mr-2">{{ index + 1 }}</v-chip>
                          {{ url }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="extractUrlsFromSitemap().length === 0">
                        <v-alert type="warning" density="compact">
                          No URLs found in the sitemap
                        </v-alert>
                      </v-list-item>
                    </v-list>
                  </v-window-item>

                  <v-window-item value="images">
                    <v-list lines="two" class="rounded-lg">
                      <template v-for="(urlImages, url) in extractImagesFromSitemap()" :key="url">
                        <v-list-subheader class="text-primary">
                          {{ url }}
                        </v-list-subheader>
                        <v-list-item v-for="(image, imgIndex) in urlImages" :key="`${url}-${imgIndex}`">
                          <template v-slot:prepend>
                            <v-avatar size="64" class="mr-3">
                              <v-img :src="image.url" :alt="image.title || 'Image'" contain></v-img>
                            </v-avatar>
                          </template>
                          <v-list-item-title>
                            {{ image.title || image.url.split('/').pop() || 'Image' }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ image.url }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                      <v-list-item v-if="Object.keys(extractImagesFromSitemap()).length === 0">
                        <v-alert type="warning" density="compact">
                          No images found in the sitemap
                        </v-alert>
                      </v-list-item>
                    </v-list>
                  </v-window-item>
                </v-window>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-app>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import {
  calculateAccessibilityScore,
  getCriticalIssues,
  getRankingImpactColor,
  getRankingImpactDescription,
  getRankingImpactIcon,
  getRankingImpactTitle,
  getScoreColor,
  getScoreDescription,
  getScoreStatus,
  parseUrl
} from '../utils/seo/getScore';
import {
  SEOReport,
  SEOResult,
  Warning
} from '../utils/seo/types';

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

interface AuditOptions {
  maxDepth: number;
  sameDomainOnly: boolean;
  timeout: number;
}

const report = ref<SEOReport | null>(null);
const targetUrl = ref('');
const auditing = ref(false);
const error = ref<string | null>(null);
const showSitemapPreview = ref(false);
const sitemapPreview = ref('');
const activeTab = ref('overview');
const sitemapPreviewTab = ref('code');
const robotsTxtDialog = ref(false);
const robotsTxtContent = ref('');
const resultCache = ref(new Map<string, any>());
const userStore = useUserStore();

const options = ref<AuditOptions>({
  maxDepth: 2,
  sameDomainOnly: true,
  timeout: 30000,
});

const tabs = [
  { value: 'overview', label: 'Overview', icon: 'mdi-eye' },
  { value: 'technical', label: 'Technical', icon: 'mdi-code-tags' },
  { value: 'content', label: 'Content', icon: 'mdi-text' },
  { value: 'metatags', label: 'Meta Tags', icon: 'mdi-tag-multiple' },
  { value: 'accessibility', label: 'Accessibility', icon: 'mdi-account-group' },
  { value: 'security', label: 'Security', icon: 'mdi-shield-check' },
  { value: 'warnings', label: 'Warnings', icon: 'mdi-alert' },
  { value: 'action', label: 'Actions', icon: 'mdi-check-circle' }
];

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

    const rawReport = await userStore.auditSEO(targetUrl.value, options.value);
    console.log("rawReport", rawReport);

    report.value = adaptSEOResults(rawReport);
  } catch (e: any) {
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

const downloadSitemap = async () => {
  try {
    const response: any = await userStore.generateSitemap(targetUrl.value, JSON.stringify(report.value))

    if (!response.ok) {
      error.value = 'Error generating sitemap';
      throw new Error('Error generating sitemap');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${new Date().toISOString().split('T')[0]}.xml`;

    if (document.body) {
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (err: any) {
    console.error('Error generating sitemap:', err);
    error.value = err.message || 'Error generating sitemap';
  }
};

const previewSitemap = async () => {
  try {
    const response = await fetch('/api/sitemap?preview=true', {
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
      error.value = 'Error generating sitemap';
      throw new Error('Error generating sitemap');
    }

    const data = await response.text();
    sitemapPreview.value = data;
    showSitemapPreview.value = true;
  } catch (err: any) {
    console.error('Erreur lors de la génération du sitemap:', err);
    error.value = err.message || 'Erreur lors de la génération du sitemap';
  }
};

const extractImageUrlsFromSitemap = (): string[] => {
  if (!sitemapPreview.value) return [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");
    const imageElements = xmlDoc.getElementsByTagName("image:loc");

    const urls: string[] = [];
    for (let i = 0; i < imageElements.length; i++) {
      const url = imageElements[i].textContent;
      if (url) urls.push(url);
    }

    return urls;
  } catch (e) {
    console.error("Erreur lors de l'extraction des URLs d'images:", e);
    return [];
  }
};

const getTotalImagesInSitemap = (): number => {
  return extractImageUrlsFromSitemap().length;
};

const getMissingAltImagesCount = (): number => {
  if (!report.value) return 0;
  return Object.values(report.value.seoResults).reduce((total: number, page: any) => {
    if (page.images?.withoutAlt !== undefined) {
      return total + (page.images.withoutAlt || 0);
    } else if (page.seo?.images?.withoutAlt !== undefined) {
      return total + (page.seo.images.withoutAlt || 0);
    }
    return total;
  }, 0);
};

const getTotalVideosInSitemap = (): number => {
  return 0;
};

const summaryGroups = [
  {
    title: 'Basic SEO',
    icon: 'mdi-text-search',
    color: 'info',
    items: [
      {
        icon: 'mdi-format-title',
        title: 'Pages Analyzed',
        value: (report: any) => report?.summary?.totalPages ?? 0
      },
      {
        icon: 'mdi-clock',
        title: 'Average Load Time',
        value: (report: any) => `${((report?.summary?.averageLoadTime ?? 0) / 1000).toFixed(2)}s`
      },
      {
        icon: 'mdi-format-title',
        title: 'Pages Without Title',
        value: (report: any) => report?.summary?.missingTitles ?? 0
      },
      {
        icon: 'mdi-text-box',
        title: 'Pages Without Description',
        value: (report: any) => report?.summary?.missingDescriptions ?? 0
      }
    ]
  },
  {
    title: 'Performance Metrics',
    icon: 'mdi-speedometer',
    color: 'warning',
    items: [
      {
        icon: 'mdi-image',
        title: 'Images Without Alt',
        value: (report: any) => report?.summary?.missingAltTags ?? 0
      },
      {
        icon: 'mdi-speedometer',
        title: 'First Contentful Paint',
        value: (report: any) => `${((report?.summary?.averageFCP ?? 0) / 1000).toFixed(2)}s`
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
      }
    ]
  },
  {
    title: 'Technical Evaluation',
    icon: 'mdi-code-tags',
    color: 'success',
    items: [
      {
        icon: 'mdi-code-json',
        title: 'Structured Data',
        value: (report: any) => {
          return `${calculateStructuredDataPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-share-variant',
        title: 'Social Media Tags',
        value: (report: any) => {
          return `${calculateSocialTagsPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-cellphone',
        title: 'Mobile Compatibility',
        value: (report: any) => {
          return `${calculateMobileCompatibilityPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-shield-check',
        title: 'HTTPS Security',
        value: (report: any) => {
          return `${calculateHttpsPercentage(report)}% des pages`;
        }
      }
    ]
  },
  {
    title: 'Issues & Warnings',
    icon: 'mdi-alert',
    color: 'error',
    items: [
      {
        icon: 'mdi-alert',
        title: 'Total Warnings',
        value: (report: any) => report?.summary?.totalWarnings ?? 0
      },
      {
        icon: 'mdi-alert-circle',
        title: 'Critical Issues',
        value: (report: any) => report?.summary?.criticalIssues ?? 0
      },
      {
        icon: 'mdi-alert-box',
        title: 'High Priority Issues',
        value: (report: any) => report?.summary?.highPriorityIssues ?? 0
      },
      {
        icon: 'mdi-alert-circle-outline',
        title: 'Medium Priority Issues',
        value: (report: any) => report?.summary?.mediumPriorityIssues ?? 0
      }
    ]
  },
  {
    title: 'accessibility',
    icon: 'mdi-account-group',
    color: 'purple',
    items: [
      {
        icon: 'mdi-tag-text',
        title: 'missingAria',
        value: (report: any) => report?.summary?.missingAria ?? 0
      },
      {
        icon: 'mdi-image-off',
        title: 'missingAlt',
        value: (report: any) => report?.summary?.missingAlt ?? 0
      },
      {
        icon: 'mdi-form-textbox',
        title: 'missingLabels',
        value: (report: any) => report?.summary?.missingLabels ?? 0
      },
      {
        icon: 'mdi-contrast-box',
        title: 'contrastIssues',
        value: (report: any) => report?.summary?.contrastIssues ?? 0
      }
    ]
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

const showRobotsTxtDialog = (content: string) => {
  robotsTxtContent.value = content || 'No content available';
  robotsTxtDialog.value = true;
};

const adaptSEOData = (data: any): SEOResult => {
  const result: SEOResult = {
    title: data.seo?.title || data.title || '',
    description: data.seo?.description || data.description || '',
    headingStructure: data.seo?.headings || data.headingStructure || { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    imageAlt: data.seo?.images?.data || data.imageAlt || [],
    loadTime: data.performance?.loadTime || data.loadTime || 0,
    coreWebVitals: {
      LCP: data.performance?.lcp || 0,
      FCP: data.performance?.fcp || 0,
      CLS: data.performance?.cls || 0,
      TTFB: data.performance?.ttfb || 0
    },
    mobileCompatibility: data.technical?.mobile || data.mobileCompatibility || { hasViewport: false, responsive: false },
    securityChecks: {
      https: data.technical?.https || data.securityChecks?.https || false,
      securityHeaders: data.technical?.security?.headers || data.securityChecks?.securityHeaders || [],
      securityIssues: data.technical?.security?.securityIssues || data.securityChecks?.securityIssues || []
    },
    socialTags: {
      ogTags: data?.seo?.meta?.og ?
        (Array.isArray(data.seo.meta.og) ?
          data.seo.meta.og :
          Object.entries(data.seo.meta.og || {}).map(([property, content]) => ({ property: `og:${property}`, content }))
        ) : (data?.socialTags?.ogTags || []),
      twitterTags: data?.seo?.meta?.twitter ?
        (Array.isArray(data.seo.meta.twitter) ?
          data.seo.meta.twitter :
          Object.entries(data.seo.meta.twitter || {}).map(([name, content]) => ({ name: `twitter:${name}`, content }))
        ) : (data?.socialTags?.twitterTags || [])
    },
    warnings: data.issues || [],
    structuredData: data.seo?.structuredData?.data || data.structuredData || [],
    contentStats: {
      readabilityScore: data.seo?.readabilityScore || data.readability || 0,
      wordCount: data.seo?.wordCount || data.wordCount || 0,
      keywordDensity: data.seo?.keywordDensity || data.keywordDensity || {}
    },
    url: data.url || '',
    accessibility: data.accessibility || {
      missingAria: 0,
      missingAlt: 0,
      missingLabels: 0,
      missingInputAttributes: 0,
      contrastIssues: 0,
      ariaIssues: [],
      inputIssues: [],
      accessibilityScore: 0
    },
    images: {
      withAlt: data.seo?.images?.withAlt || data.images?.withAlt || 0,
      withoutAlt: data.seo?.images?.withoutAlt || data.images?.withoutAlt || 0,
      total: data.seo?.images?.total || data.images?.total || 0,
      data: data.seo?.images?.data || data.images?.data || []
    },
    largeFiles: data.largeFiles || data.seo?.largeFiles || []
  };
  return result;
};

const adaptSEOResults = (apiResponse: any): SEOReport => {
  if (!apiResponse) return { seoResults: {}, visitedURLs: [], summary: undefined };

  const visitedURLs = apiResponse.visitedURLs || [];
  const seoResults: Record<string, SEOResult> = {};

  Object.entries(apiResponse.seoResults || {}).forEach(([url, data]) => {
    const adaptedData = adaptSEOData(data as any);

    if ((data as any).technicalSEO) {
      adaptedData.technicalSEO = (data as any).technicalSEO;
    } else if (url === visitedURLs[0]) {
      if (apiResponse.technicalSEO) {
        adaptedData.technicalSEO = apiResponse.technicalSEO;
      } else {
        adaptedData.technicalSEO = {
          sitemapFound: false,
          robotsTxtFound: false,
          schemaTypeCount: {}
        };
      }
    } else {
      adaptedData.technicalSEO = {
        sitemapFound: false,
        robotsTxtFound: false,
        schemaTypeCount: {}
      };
    }
    seoResults[url] = adaptedData;
  });

  const summary = calculateSummary(seoResults, visitedURLs);

  return {
    seoResults,
    visitedURLs,
    summary
  };
};

const calculateSummary = (seoResults: Record<string, SEOResult>, visitedURLs: string[]): any => {
  const results = Object.values(seoResults);
  const totalPages = results.length;

  if (totalPages === 0) return undefined;

  let totalLoadTime = 0;
  let totalFCP = 0;
  let totalLCP = 0;
  let totalCLS = 0;
  let totalTTFB = 0;
  let totalWarnings = 0;
  let missingTitles = 0;
  let missingDescriptions = 0;
  let missingAltTags = 0;
  let pagesWithStructuredData = 0;
  let pagesWithSocialTags = 0;
  let mobileCompatiblePages = 0;
  let securePages = 0;
  let missingAria = 0;
  let missingAlt = 0;
  let missingLabels = 0;
  let missingInputAttributes = 0;
  let contrastIssues = 0;
  let ariaIssues: Array<{ element: string, issue: string }> = [];
  let inputIssues: Array<{ element: string, issue: string }> = [];
  let accessibilityScore = 0;

  results.forEach(result => {
    totalLoadTime += result.loadTime || 0;
    totalFCP += result.coreWebVitals?.FCP || 0;
    totalLCP += result.coreWebVitals?.LCP || 0;
    totalCLS += result.coreWebVitals?.CLS || 0;
    totalTTFB += result.coreWebVitals?.TTFB || 0;
    totalWarnings += result.warnings?.length || 0;

    if (!result.title) missingTitles++;
    if (!result.description) missingDescriptions++;

    if (result.imageAlt) {
      missingAltTags += result.imageAlt.filter(img => !img.alt).length;
    }

    if (result.structuredData && result.structuredData.length > 0) {
      pagesWithStructuredData++;
    }

    if ((result.socialTags?.ogTags?.length ?? 0) > 0 || (result.socialTags?.twitterTags?.length ?? 0) > 0) {
      pagesWithSocialTags++;
    }

    if (result.mobileCompatibility?.hasViewport) mobileCompatiblePages++;

    if (result.securityChecks?.https) securePages++;

    if (result.accessibility) {
      missingAria += result.accessibility.missingAria;
      missingAlt += result.accessibility.missingAlt;
      missingLabels += result.accessibility.missingLabels;
      missingInputAttributes += result.accessibility.missingInputAttributes;
      contrastIssues += result.accessibility.contrastIssues;
      ariaIssues = [...(result.accessibility.ariaIssues || [])];
      inputIssues = [...(result.accessibility.inputIssues || [])];
      accessibilityScore = result.accessibility.accessibilityScore;
    }
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
    averageCLS: totalCLS / totalPages,
    averageTTFB: totalTTFB / totalPages,
    pagesWithStructuredData: Math.round((pagesWithStructuredData / totalPages) * 100),
    pagesWithSocialTags: Math.round((pagesWithSocialTags / totalPages) * 100),
    mobileCompatiblePages: Math.round((mobileCompatiblePages / totalPages) * 100),
    securePages: Math.round((securePages / totalPages) * 100),
    missingAria,
    missingAlt,
    missingLabels,
    missingInputAttributes,
    contrastIssues,
    ariaIssues,
    inputIssues,
    accessibilityScore
  };
};

function isDisplayableVital(name: string): boolean {
  const displayableVitals = [
    'FCP', 'LCP', 'TTFB', 'CLS', 'speedIndex', 'timeToInteractive',
    'totalBlockingTime', 'cumulativeLayoutShift', 'performanceScore'
  ];
  return displayableVitals.includes(name);
}

function formatVitalValue(value: number | undefined, name: string): string {
  if (value === undefined || value === 0) return 'N/A';

  if (name === 'CLS' || name === 'cumulativeLayoutShift') {
    return value.toFixed(3);
  }
  return (value / 1000).toFixed(2) + 's';
}

function getVitalScoreColor(score: number | undefined, name?: string): string {
  if (!score) return 'success';

  if (name === 'CLS' || name === 'cumulativeLayoutShift') {
    if (score <= 0.1) return 'success';
    if (score <= 0.25) return 'warning';
    return 'error';
  }

  if (score >= 90) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

function getCoreWebVitalName(name: string): string {
  const names: Record<string, string> = {
    FCP: 'First Contentful Paint',
    LCP: 'Largest Contentful Paint',
    TTFB: 'Time to First Byte',
    CLS: 'Cumulative Layout Shift',
    speedIndex: 'Speed Index',
    timeToInteractive: 'Time to Interactive',
    totalBlockingTime: 'Total Blocking Time',
    cumulativeLayoutShift: 'Cumulative Layout Shift',
    performanceScore: 'Performance Score'
  };
  return names[name] || name;
}

function getActionItems(result: any): { high: any[], medium: any[] } {
  if (!result) return { high: [], medium: [] };

  const actionItems = {
    high: [] as any[],
    medium: [] as any[]
  };

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

  const imagesWithoutAlt = result.imageAlt?.filter((img: any) => !img.alt) || [];
  if (imagesWithoutAlt.length > 0) {
    actionItems.high.push({
      title: 'Images without alt attribute',
      description: `${imagesWithoutAlt.length} image(s) without alt attribute`,
      icon: 'mdi-image'
    });
  }

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

  if (!result.securityChecks?.https) {
    actionItems.high.push({
      title: 'HTTPS not enabled',
      description: 'Enable HTTPS for secure communication',
      icon: 'mdi-shield'
    });
  }

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

  const warningMap = new Map<string, { severity: string, count: number }>();

  result.warnings.forEach(warning => {
    let type = '';
    let severity = '';

    if (typeof warning === 'string') {
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
        counts.medium += item.count;
    }
  });

  return counts;
};

const emptyResult: SEOResult = {
  title: '',
  description: '',
  headings: { h1: [], h2: [], h3: [] },
  images: { withAlt: 0, withoutAlt: 0, total: 0 },
  technical: {
    https: false,
    mobile: { viewport: false }
  },
  performance: { ttfb: 0, fcp: 0, lcp: 0, cls: 0, speedIndex: 0 },
  loadTime: 0,
  framework: { name: '', confidence: 0 },
  hosting: '',
  domainProvider: '',
  headingStructure: { h1: [], h2: [], h3: [] },
  imageAlt: [],
  coreWebVitals: {
    LCP: 0,
    FCP: 0,
    CLS: 0,
    TTFB: 0
  },
  mobileCompatibility: {
    hasViewport: false,
    smallTouchTargets: 0
  },
  securityChecks: {
    https: false,
    securityHeaders: []
  },
  socialTags: {
    ogTags: [],
    twitterTags: []
  },
  technicalSEO: {
    sitemapFound: false,
    robotsTxtFound: false,
    schemaTypeCount: {}
  },
  structuredData: [],
  warnings: [],
  contentStats: {
    readabilityScore: 0,
    wordCount: 0,
    keywordDensity: 0
  },
  issues: [],
  wordCount: 0,
  readability: 0
};

const getResultFromCache = (url: string): SEOResult => {
  const result = report.value?.seoResults?.[url];
  if (!result) return emptyResult;

  const warningsFromIssues: Warning[] = result.issues?.map(issue => ({
    type: mapIssueTypeToWarningType(issue.type),
    message: issue.message,
    severity: issue.severity
  })) || [];

  const finalWarnings: Warning[] = result.warnings?.length ? result.warnings : warningsFromIssues;

  const adaptedResult: SEOResult = {
    ...emptyResult,
    ...result,

    title: result?.seo?.title || result?.title || '',
    description: result?.seo?.description || result?.description || '',

    headings: result?.seo?.headings || result?.headings || { h1: [], h2: [], h3: [] },

    images: {
      withAlt: result?.seo?.images?.withAlt || result?.images?.withAlt || 0,
      withoutAlt: result?.seo?.images?.withoutAlt || result?.images?.withoutAlt || 0,
      total: result?.seo?.images?.total || result?.images?.total || 0,
      data: result?.seo?.images?.data || result?.images?.data || []
    },

    imageAlt: result?.seo?.images?.data || result?.imageAlt || [],

    loadTime: result?.performance?.loadTime || result?.loadTime || 0,

    framework: result?.framework || { name: '', confidence: 0 },
    hosting: typeof result?.hosting === 'object' ? result?.hosting?.provider || '' : result?.hosting || '',
    domainProvider: typeof result?.domainProvider === 'object' ? result?.domainProvider?.provider || '' : result?.domainProvider || '',

    coreWebVitals: {
      LCP: result?.performance?.lcp || result?.coreWebVitals?.LCP || 0,
      FCP: result?.performance?.fcp || result?.coreWebVitals?.FCP || 0,
      CLS: result?.performance?.cls || result?.coreWebVitals?.CLS || 0.1,
      TTFB: result?.performance?.ttfb || result?.coreWebVitals?.TTFB || 0
    },

    technicalSEO: result?.technicalSEO || {
      sitemapFound: false,
      robotsTxtFound: false,
      schemaTypeCount: {}
    },

    mobileCompatibility: {
      hasViewport: result?.technical?.mobile?.viewport ||
        (result?.mobileCompatibility?.hasViewport) || false,
      smallTouchTargets: result?.mobileCompatibility?.smallTouchTargets || 0
    },

    securityChecks: {
      https: result?.technical?.https || result?.securityChecks?.https || false,
      securityHeaders: result?.technical?.security?.headers ||
        result?.securityChecks?.securityHeaders || [],
      securityIssues: result?.technical?.security?.securityIssues ||
        result?.securityChecks?.securityIssues || []
    },

    socialTags: {
      ogTags: result?.seo?.meta?.og ?
        (Array.isArray(result.seo.meta.og) ?
          result.seo.meta.og :
          Object.entries(result.seo.meta.og || {}).map(([property, content]) => ({ property: `og:${property}`, content }))
        ) : (result?.socialTags?.ogTags || []),
      twitterTags: result?.seo?.meta?.twitter ?
        (Array.isArray(result.seo.meta.twitter) ?
          result.seo.meta.twitter :
          Object.entries(result.seo.meta.twitter || {}).map(([name, content]) => ({ name: `twitter:${name}`, content }))
        ) : (result?.socialTags?.twitterTags || [])
    },

    warnings: finalWarnings,

    contentStats: {
      readabilityScore: result?.seo?.readabilityScore || result?.contentStats?.readabilityScore || 0,
      wordCount: result?.seo?.wordCount || result?.contentStats?.wordCount || 0,
      keywordDensity: result?.seo?.keywordDensity || result?.contentStats?.keywordDensity || 0
    },

    issues: result?.issues || [],

    structuredData: result?.seo?.structuredData?.data || result?.structuredData || [],

    wordCount: result?.seo?.wordCount || result?.wordCount || 0,
    readability: result?.seo?.readabilityScore || result?.readability || 0,
    url: result?.url || url
  };

  if (result.accessibility) {
    adaptedResult.accessibility = result.accessibility;
  }
  return adaptedResult;
};

function mapIssueTypeToWarningType(issueType: string): string {
  const typeMapping: Record<string, string> = {
    'error': 'general',
    'warning': 'general',

    'title': 'title',
    'description': 'description',
    'h1': 'h1',
    'content': 'content',

    'image': 'image',

    'performance': 'performance',
    'technical': 'technical',
    'security': 'security',
    'mobile': 'mobile',
    'accessibility': 'accessibility',
    'social': 'social',
    'schema': 'schema',
    'structured-data': 'schema',
    'links': 'links'
  };

  return typeMapping[issueType] || 'general';
}

const generateSitemap = downloadSitemap;

onMounted(() => {
});

const extractImagesFromSitemap = (): Record<string, Array<{ url: string, title?: string, alt?: string }>> => {
  if (!sitemapPreview.value) return {};

  const imagesByUrl: Record<string, Array<{ url: string, title?: string, alt?: string }>> = {};

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");

    const urlElements = xmlDoc.getElementsByTagName("url");

    for (let i = 0; i < urlElements.length; i++) {
      const urlElement = urlElements[i];
      const locElement = urlElement.getElementsByTagName("loc")[0];

      if (locElement && locElement.textContent) {
        const pageUrl = locElement.textContent;
        const imageElements = urlElement.getElementsByTagNameNS("http://www.google.com/schemas/sitemap-image/1.1", "image");

        if (imageElements.length > 0) {
          imagesByUrl[pageUrl] = [];

          for (let j = 0; j < imageElements.length; j++) {
            const imageElement = imageElements[j];
          }
        }
      }
    }
    return imagesByUrl;
  } catch (e) {
    console.error("Error during image extraction from sitemap:", e);
    return {};
  }
};

const isSitemapDialog = ref(false);
const sitemapTab = ref('code');


const getTotalUrlsInSitemap = (): number => {
  return extractUrlsFromSitemap().length;
};

const getCoreWebVitalsFormatted = (url: string): { name: string; value: string; color: string }[] => {
  const vitals = getResultFromCache(url)?.coreWebVitals || {};
  console.log('Vitals:', vitals); // Pour debug

  const metrics = [
    { key: 'LCP', name: 'Largest Contentful Paint' },
    { key: 'FCP', name: 'First Contentful Paint' },
    { key: 'CLS', name: 'Cumulative Layout Shift' },
    { key: 'TTFB', name: 'Time to First Byte' }
  ];

  return metrics.map(metric => {
    const value = vitals[metric.key];
    console.log(`${metric.key} value:`, value); // Pour debug
    return {
      name: metric.name,
      value: formatVitalValue(value, metric.key),
      color: getVitalScoreColor(value, metric.key)
    };
  });
};

function calculateStructuredDataPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const pagesWithStructuredData = report.summary.pagesWithStructuredData || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (pagesWithStructuredData / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateSocialTagsPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const pagesWithSocialTags = report.summary.pagesWithSocialTags || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (pagesWithSocialTags / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateMobileCompatibilityPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const mobileCompatiblePages = report.summary.mobileCompatiblePages || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (mobileCompatiblePages / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateHttpsPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const securePages = report.summary.securePages || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (securePages / totalPages) * 100;

  return normalizePercentage(percentage);
}


function calculateGlobalScore(): number {
  if (!report.value || !report.value.summary) {
    return 0;
  }

  const summary = report.value.summary;

  const titleScore = summary.totalPages > 0 ? (summary.totalPages - summary.missingTitles) / summary.totalPages * 100 : 0;
  const descScore = summary.totalPages > 0 ? (summary.totalPages - summary.missingDescriptions) / summary.totalPages * 100 : 0;
  const secureScore = calculateHttpsPercentage(report.value);
  const mobileScore = calculateMobileCompatibilityPercentage(report.value);
  const structuredDataScore = calculateStructuredDataPercentage(report.value);

  let accessibilityScore = 0;
  let accessibilityCount = 0;

  let securityScore = 0;
  let securityCount = 0;

  let warningsScore = 0;

  if (report.value.seoResults) {
    Object.values(report.value.seoResults).forEach((result: any) => {
      if (result.accessibility) {
        accessibilityScore += normalizePercentage(result.accessibility.accessibilityScore);
        accessibilityCount++;
      }

      if (result.securityChecks) {
        let pageSecurityScore = 0;
        if (result.securityChecks.https) pageSecurityScore += 40;

        const headers = result.securityChecks.securityHeaders;
        let headerCount = 0;

        if (headers) {
          if (Array.isArray(headers)) {
            headerCount = headers.length;
          } else if (typeof headers === 'object') {
            headerCount = Object.keys(headers).length;
          }
        }

        pageSecurityScore += headerCount * 12;
        securityScore += Math.min(100, pageSecurityScore);
        securityCount++;
      }

      const warningCount = result.warnings?.length || 0;
      warningsScore += warningCount > 0 ? Math.max(0, 100 - (warningCount * 5)) : 100;
    });
  }

  const avgAccessibilityScore = accessibilityCount > 0 ? accessibilityScore / accessibilityCount : 0;
  const avgSecurityScore = securityCount > 0 ? securityScore / securityCount : 0;
  const avgWarningsScore = Object.keys(report.value.seoResults || {}).length > 0 ?
    warningsScore / Object.keys(report.value.seoResults).length : 0;

  const baseScore = (titleScore + descScore + secureScore + mobileScore + structuredDataScore) / 5;

  const score = (baseScore * 0.4) + (avgAccessibilityScore * 0.2) + (avgSecurityScore * 0.2) + (avgWarningsScore * 0.2);

  return normalizePercentage(score);
}


function getAccessibilityScoreColor(score: number): string {
  if (score >= 90) return 'success';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warning';
  return 'error';
}

function getAccessibilityScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Medium';
  return 'To improve';
}

function hasAccessibilityIssues(url: string): boolean {
  const result = getResultFromCache(url);
  if (!result || !result.accessibility) return false;

  return (
    (result.accessibility.ariaIssues && result.accessibility.ariaIssues.length > 0) ||
    (result.accessibility.inputIssues && result.accessibility.inputIssues.length > 0) ||
    result.accessibility.missingAria > 0 ||
    result.accessibility.missingAlt > 0 ||
    result.accessibility.missingLabels > 0 ||
    result.accessibility.missingInputAttributes > 0 ||
    result.accessibility.contrastIssues > 0
  );
}

function normalizePercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

const displayWarnings = (warnings: Array<any>, url: string) => {
  if (!warnings || warnings.length === 0) return [];

  const warningsByType = new Map<string, Array<{ severity: string, message: string, type: string }>>();

  const accessibilityResult = getResultFromCache(url)?.accessibility;
  if (accessibilityResult) {
    const accessibilityScore = calculateAccessibilityScore(accessibilityResult);
    if (accessibilityScore < 100) {
      warningsByType.set('accessibility', [{
        severity: accessibilityScore >= 70 ? 'medium' : 'high',
        message: `Accessibility score: ${accessibilityScore}/100 - ${getAccessibilityScoreLabel(accessibilityScore)}`,
        type: 'accessibility'
      }]);
    }
  }

  warnings.forEach(warning => {
    let type = '';
    let severity = '';
    let message = '';

    if (typeof warning === 'string') {
      type = 'general';
      severity = 'medium';
      message = warning;
    } else {
      type = warning.type || 'general';
      severity = warning.severity || 'medium';
      message = warning.message || '';
    }

    if (!warningsByType.has(type)) {
      warningsByType.set(type, []);
    }

    warningsByType.get(type)!.push({
      severity,
      message,
      type
    });
  });

  const result: Array<{ type: string, icon: string, color: string, warnings: Array<{ severity: string, message: string, type: string }> }> = [];

  const typeConfig: Record<string, { icon: string, color: string }> = {
    title: { icon: 'mdi-format-title', color: 'error' },
    description: { icon: 'mdi-text-box', color: 'warning' },
    h1: { icon: 'mdi-format-header-1', color: 'warning' },
    image: { icon: 'mdi-image', color: 'warning' },
    mobile: { icon: 'mdi-cellphone', color: 'error' },
    security: { icon: 'mdi-shield', color: 'error' },
    performance: { icon: 'mdi-speedometer', color: 'warning' },
    accessibility: { icon: 'mdi-access-point', color: 'warning' },
    content: { icon: 'mdi-file-document', color: 'info' },
    links: { icon: 'mdi-link', color: 'warning' },
    social: { icon: 'mdi-share-variant', color: 'info' },
    schema: { icon: 'mdi-code-json', color: 'info' },
    technical: { icon: 'mdi-wrench', color: 'info' },
    structure: { icon: 'mdi-format-header-pound', color: 'warning' },
    general: { icon: 'mdi-alert', color: 'info' }
  };

  warningsByType.forEach((warnings, type) => {
    const config = typeConfig[type] || { icon: 'mdi-alert', color: 'info' };

    result.push({
      type,
      icon: config.icon,
      color: config.color,
      warnings: warnings.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (severityOrder[a.severity as keyof typeof severityOrder] || 2) - (severityOrder[b.severity as keyof typeof severityOrder] || 2);
      })
    });
  });

  return result;
};

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'high':
      return 'error-darken-1';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};


const getSeverityIcon = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'mdi-alert';
    case 'high':
      return 'mdi-alert';
    case 'medium':
      return 'mdi-alert';
    case 'low':
      return 'mdi-alert';
    default:
      return 'mdi-alert';
  }
};

const getFrameworkIcon = (framework: string) => {
  switch (framework) {
    case 'Vue.js':
      return 'mdi-vuejs';
    case 'React':
      return 'mdi-react';
    case 'Angular':
      return 'mdi-angular';
    case 'Svelte':
      return 'mdi-svelte';
    case 'Next.js':
      return 'mdi-react';
    case 'Nuxt.js':
      return 'mdi-nuxt';
    default:
      return 'mdi-language-html5';
  }
}

const getFrameworkColor = (framework: string) => {
  switch (framework) {
    case 'Vue.js':
      return 'primary';
    case 'React':
      return 'secondary';
    case 'Angular':
      return 'yellow';
    case 'Svelte':
      return 'warning';
    case 'Next.js':
      return 'info';
    case 'Nuxt.js':
      return 'success';
    default:
      return 'white';
  }
}

function formatSecurityHeaders(headers: any): string {
  if (!headers) return 'No security headers';

  if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
    return Object.entries(headers)
      .map(([name, value]) => `${name}: ${value}`)
      .join('\n');
  }

  return headers.map(header => `${header.name}: ${header.value}`).join('\n');
}

const extractUrlsFromSitemap = (): string[] => {
  if (!sitemapPreview.value) return [];

  const urls: string[] = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");

    const urlElements = xmlDoc.getElementsByTagName("url");

    for (let i = 0; i < urlElements.length; i++) {
      const urlElement = urlElements[i];
      const locElement = urlElement.getElementsByTagName("loc")[0];

      if (locElement && locElement.textContent) {
        urls.push(locElement.textContent);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction des URLs du sitemap:", error);
  }

  return urls;
};

const formatMetricValue = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  if (numValue < 0.01) return numValue.toFixed(3);
  return numValue.toFixed(2);
};

const getMetricScore = (value: string | number): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 0;
  return Math.min(100, Math.max(0, numValue * 100));
};

const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const getMetaTagsRecommendations = (): Array<{ title: string; description: string; severity: 'high' | 'medium' }> => {
  const recommendations: Array<{ title: string; description: string; severity: 'high' | 'medium' }> = [];

  if (!report.value || !report.value.seoResults) return recommendations;

  const firstUrl = Object.keys(report.value.seoResults)[0];
  const result = report.value.seoResults[firstUrl];

  if (!result.title) {
    recommendations.push({
      title: 'Title balise not found',
      description: 'Add a unique and descriptive title tag',
      severity: 'high'
    });
  } else {
    const titleLength = result.title.length;
    if (titleLength < 30 || titleLength > 60) {
      recommendations.push({
        title: 'Title length is not optimal',
        description: 'The title tag should contain between 30 and 60 characters',
        severity: 'medium'
      });
    }
  }

  if (!result.description) {
    recommendations.push({
      title: 'Missing meta description',
      description: 'Add a relevant meta description',
      severity: 'high'
    });
  } else {
    const descLength = result.description.length;
    if (descLength < 120 || descLength > 160) {
      recommendations.push({
        title: 'Meta description length is not optimal',
        description: 'The meta description should contain between 120 and 160 characters',
        severity: 'medium'
      });
    }
  }

  if (!result.socialTags?.ogTags?.length) {
    recommendations.push({
      title: 'Missing Open Graph tags',
      description: 'Add Open Graph tags to improve social media sharing',
      severity: 'medium'
    });
  }

  if (!result.socialTags?.twitterTags?.length) {
    recommendations.push({
      title: 'Missing Twitter Card tags',
      description: 'Add Twitter Card tags to improve social media sharing',
      severity: 'medium'
    });
  }

  return recommendations;
};

const getMetaTagsScore = (url: string) => {
  const result = getResultFromCache(url)
  if (!result) return 0

  let score = 0
  const totalPoints = 100
  const pointsPerElement = totalPoints / 4

  // Title
  if (result.title) {
    const titleLength = result.title.length
    if (titleLength >= 30 && titleLength <= 60) {
      score += pointsPerElement
    } else if (titleLength > 0) {
      score += pointsPerElement * 0.5
    }
  }

  // Description
  if (result.description) {
    const descLength = result.description.length
    if (descLength >= 120 && descLength <= 160) {
      score += pointsPerElement
    } else if (descLength > 0) {
      score += pointsPerElement * 0.5
    }
  }

  if (result.technicalSEO?.robotsTxtFound) {
    score += pointsPerElement
  }

  if (result.mobileCompatibility?.viewportContent) {
    score += pointsPerElement
  }

  const socialBonus = 20
  let socialScore = 0

  if (result.socialTags?.ogTags?.length) {
    const ogTags = result.socialTags.ogTags.length
    socialScore += (ogTags / 4) * (socialBonus / 2)
  }

  if (result.socialTags?.twitterTags?.length) {
    const twitterTags = result.socialTags.twitterTags.length
    socialScore += (twitterTags / 4) * (socialBonus / 2)
  }

  score += socialScore

  return Math.round(score)
}

</script>

<style scoped>
.landing-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.skeleton-container .v-skeleton-loader {
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-container .v-skeleton-loader__text,
.skeleton-container .v-skeleton-loader__button,
.skeleton-container .v-skeleton-loader__avatar,
.skeleton-container .v-skeleton-loader__list-item,
.skeleton-container .v-skeleton-loader__card,
.skeleton-container .v-skeleton-loader__card-avatar {
  animation: skeletonPulse 1.5s ease-in-out infinite;
  background: linear-gradient(90deg,
      rgba(var(--v-theme-surface-variant), 0.1),
      rgba(var(--v-theme-surface-variant), 0.3),
      rgba(var(--v-theme-surface-variant), 0.1));
  background-size: 200% 100%;
}

@keyframes skeletonPulse {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.v-card.border-primary-subtle {
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.v-card.border-info-subtle {
  border-left: 3px solid rgb(var(--v-theme-info));
}

.v-card.border-warning-subtle {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.v-card.border-success-subtle {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.v-card.border-error-subtle {
  border-left: 3px solid rgb(var(--v-theme-error));
}

.sitemap-window {
  max-height: 80vh;
  overflow-y: auto;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  max-width: 100% !important;
}

.v-chip {
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.v-list-item {
  min-height: unset !important;
  padding: 8px !important;
}

.v-list-item-title,
.v-list-item-subtitle {
  white-space: normal !important;
  word-break: break-word !important;
  display: block !important;
  width: 100% !important;
  overflow: visible !important;
}

.schema-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
}
</style>
