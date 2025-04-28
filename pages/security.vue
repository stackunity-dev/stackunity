<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-4">Security Analysis</h1>
          <p class="text-body-1">Analyze the security vulnerabilities of your website</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeUrl">
                <v-text-field v-model="url" label="URL du site à analyser" placeholder="https://example.com"
                  hint="Enter the complete URL including https://" persistent-hint prepend-inner-icon="mdi-web"
                  variant="outlined" required autocomplete="url" aria-label="URL to analyze"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || 'Please enter a valid URL starting with http:// or https://']"></v-text-field>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!url"
                    prepend-icon="mdi-magnify" aria-label="Analyze content">
                    Analyze content
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col cols="12">
          <v-skeleton-loader type="article, actions" aria-label="Loading the analysis results" />
          <v-row>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" aria-hidden="true" />
            </v-col>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" aria-hidden="true" />
            </v-col>
          </v-row>
          <v-skeleton-loader type="table" aria-hidden="true" />
        </v-col>
      </v-row>

      <v-row v-else-if="results.length">
        <v-col cols="12" class="mb-6">
          <h2 id="analysis-results">Analysis Results</h2>

          <v-card class="mt-4 mb-6" variant="outlined">
            <v-card-item>
              <v-card-title class="d-flex align-center mb-4">
                <v-icon icon="mdi-shield-check" color="primary" class="mr-2" aria-hidden="true" />
                Global Score
                <v-chip :color="getScoreColor(calculateGlobalAverage())" class="ml-4"
                  aria-label="Average global score: {{ calculateGlobalAverage() }}%">
                  {{ calculateGlobalAverage() }}%
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('headers')"
                        :color="getScoreColor(calculateAverageByType('headers'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Headers</div>
                          <div class="text-h6">{{ calculateAverageByType('headers') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('cookies')"
                        :color="getScoreColor(calculateAverageByType('cookies'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Cookies</div>
                          <div class="text-h6">{{ calculateAverageByType('cookies') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('vulnerabilities')"
                        :color="getScoreColor(calculateAverageByType('vulnerabilities'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">Vulnerabilities</div>
                          <div class="text-h6">{{ calculateAverageByType('vulnerabilities') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-item>
          </v-card>

          <v-expansion-panels aria-labelledby="analysis-results">
            <v-expansion-panel v-for="(result, index) in results" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters align="center">
                  <v-col cols="8" class="text-body-1">{{ result.url }}</v-col>
                  <v-col cols="4" class="text-right d-flex align-center justify-end flex-wrap">
                    <v-chip :color="getScoreColor(result.score)" class="mr-2" aria-label="Score: {{ result.score }}%">
                      Score: {{ result.score }}%
                    </v-chip>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-tabs v-model="activeTab" color="primary" aria-label="Analysis categories">
                  <v-tab value="headers" aria-label="Headers tab">Headers</v-tab>
                  <v-tab value="cookies" aria-label="Cookies tab">Cookies</v-tab>
                  <v-tab value="vulnerabilities" aria-label="Vulnerabilities tab">Vulnerabilities</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="headers">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-shield" class="mr-2" aria-hidden="true" />
                            Security Headers
                            <v-chip :color="getScoreColor(result.headerAnalysis.score)" class="ml-4"
                              aria-label="Score des en-têtes: {{ result.headerAnalysis.score }}%">
                              Score: {{ result.headerAnalysis.score }}%
                            </v-chip>
                          </v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item v-for="(value, name) in result.headerAnalysis.present" :key="name">
                                <template v-slot:prepend>
                                  <v-icon color="success" aria-hidden="true">mdi-check-circle</v-icon>
                                </template>
                                <v-list-item-title>{{ name }}</v-list-item-title>
                                <v-list-item-subtitle class="text-truncate">{{ value }}</v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-lock-alert" class="mr-2" aria-hidden="true" />
                            Missing Headers
                          </v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item v-for="(header, index) in result.headerAnalysis.missing" :key="index">
                                <template v-slot:prepend>
                                  <v-icon color="error" aria-hidden="true">mdi-alert-circle</v-icon>
                                </template>
                                <v-list-item-title>{{ header }}</v-list-item-title>
                              </v-list-item>
                              <v-list-item v-if="!result.headerAnalysis.missing.length">
                                <template v-slot:prepend>
                                  <v-icon color="success" aria-hidden="true">mdi-check-circle</v-icon>
                                </template>
                                <v-list-item-title>All security headers are present</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="cookies">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-cookie" class="mr-2" aria-hidden="true" />
                            Cookies Security
                            <v-chip :color="getScoreColor(result.cookieAnalysis.score)" class="ml-4"
                              aria-label="Score des cookies: {{ result.cookieAnalysis.score }}%">
                              Score: {{ result.cookieAnalysis.score }}%
                            </v-chip>
                          </v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="result.cookieAnalysis.secure ? 'success' : 'error'"
                                    aria-hidden="true">
                                    {{ result.cookieAnalysis.secure ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Secure attribute</v-list-item-title>
                                <v-list-item-subtitle>
                                  {{ result.cookieAnalysis.secure ? 'Present' : 'Missing' }}
                                </v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="result.cookieAnalysis.httpOnly ? 'success' : 'error'"
                                    aria-hidden="true">
                                    {{ result.cookieAnalysis.httpOnly ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>HttpOnly attribute</v-list-item-title>
                                <v-list-item-subtitle>
                                  {{ result.cookieAnalysis.httpOnly ? 'Present' : 'Missing' }}
                                </v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="result.cookieAnalysis.sameSite ? 'success' : 'error'"
                                    aria-hidden="true">
                                    {{ result.cookieAnalysis.sameSite ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>SameSite attribute</v-list-item-title>
                                <v-list-item-subtitle>
                                  {{ result.cookieAnalysis.sameSite ? 'Present' : 'Missing' }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-lock" class="mr-2" aria-hidden="true" />
                            HTTPS
                          </v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="result.https ? 'success' : 'error'" aria-hidden="true">
                                    {{ result.https ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>HTTPS Enabled</v-list-item-title>
                                <v-list-item-subtitle>
                                  {{ result.https ? 'The website uses HTTPS' : 'The website does not use HTTPS' }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="vulnerabilities">
                    <v-row>
                      <v-col cols="12" mb-4>
                        <v-card v-if="result.additionalVulnerabilities" class="mb-4">
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-shield-alert" class="mr-2" aria-hidden="true" />
                            Vulnerability Summary
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="6" md="3">
                                <v-card variant="outlined"
                                  :color="result.additionalVulnerabilities.sensitiveDataExposure > 0 ? 'warning' : 'success'"
                                  class="pa-2 text-center">
                                  <div class="text-subtitle-1">Sensitive Data</div>
                                  <div class="text-h5">{{ result.additionalVulnerabilities.sensitiveDataExposure }}
                                  </div>
                                  <div class="text-caption">issues detected</div>
                                </v-card>
                              </v-col>
                              <v-col cols="12" sm="6" md="3">
                                <v-card variant="outlined"
                                  :color="result.additionalVulnerabilities.csrfVulnerabilities > 0 ? 'warning' : 'success'"
                                  class="pa-2 text-center">
                                  <div class="text-subtitle-1">CSRF</div>
                                  <div class="text-h5">{{ result.additionalVulnerabilities.csrfVulnerabilities }}</div>
                                  <div class="text-caption">issues detected</div>
                                </v-card>
                              </v-col>
                              <v-col cols="12" sm="6" md="3">
                                <v-card variant="outlined"
                                  :color="result.additionalVulnerabilities.headerVulnerabilities > 0 ? 'warning' : 'success'"
                                  class="pa-2 text-center">
                                  <div class="text-subtitle-1">Header Issues</div>
                                  <div class="text-h5">{{ result.additionalVulnerabilities.headerVulnerabilities }}
                                  </div>
                                  <div class="text-caption">issues detected</div>
                                </v-card>
                              </v-col>
                              <v-col cols="12" sm="6" md="3">
                                <v-card variant="outlined"
                                  :color="result.additionalVulnerabilities.otherVulnerabilities > 0 ? 'warning' : 'success'"
                                  class="pa-2 text-center">
                                  <div class="text-subtitle-1">Other Issues</div>
                                  <div class="text-h5">{{ result.additionalVulnerabilities.otherVulnerabilities }}</div>
                                  <div class="text-caption">issues detected</div>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-alert" class="mr-2" aria-hidden="true" />
                            Detected Vulnerabilities
                          </v-card-title>
                          <v-card-text>
                            <div v-if="!result.securityIssues || result.securityIssues.length === 0"
                              class="pa-4 text-center">
                              <v-icon size="large" color="success" class="mb-2">mdi-check-circle</v-icon>
                              <p class="text-body-1">No vulnerabilities detected</p>
                            </div>
                            <v-expansion-panels v-else>
                              <v-expansion-panel v-for="(issue, i) in result.securityIssues" :key="i">
                                <v-expansion-panel-title>
                                  <div class="d-flex align-center">
                                    <v-icon :color="getSeverityColor(issue.severity)" class="mr-2" aria-hidden="true">
                                      {{ getSeverityIcon(issue.severity) }}
                                    </v-icon>
                                    <span>{{ issue.type || 'Issue' }} - {{ issue.description }}</span>
                                  </div>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                  <p v-if="issue.element"><strong>Element :</strong> {{ issue.element }}</p>
                                  <p v-if="issue.code"><strong>Problem code :</strong>
                                    <code>{{ issue.code }}</code>
                                  </p>
                                  <p v-if="issue.issue"><strong>Issue :</strong> {{ issue.issue }}</p>
                                  <p v-if="issue.content"><strong>Content :</strong> {{ issue.content }}</p>
                                  <p v-if="issue.impact" class="mt-3"><strong>Impact :</strong> <span
                                      class="red--text text--darken-1">{{
                                        issue.impact }}</span></p>
                                  <p v-if="issue.evidence" class="mt-2 grey--text text--darken-2"><strong>Evidence
                                      :</strong> {{
                                        issue.evidence }}</p>
                                  <v-divider class="my-3" v-if="issue.recommendation"></v-divider>
                                  <p v-if="issue.recommendation"><strong>Recommendation :</strong> {{
                                    issue.recommendation }}</p>
                                </v-expansion-panel-text>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row v-else-if="error">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            {{ error }}
          </v-alert>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// @ts-ignore
import { definePageMeta } from '#imports';
import { SecurityAnalysisResult } from '../utils/analyzer/types';
import { useUserStore } from '../stores/userStore';

definePageMeta({
  layout: 'dashboard',
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const url = computed(() => websiteData.value?.main_url || '');
const loading = ref(false);
const results = ref<SecurityAnalysisResult[]>([]);
const error = ref('');
const activeTab = ref('headers');

async function analyzeUrl() {
  if (!url.value) return;

  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('/api/analyze/security-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url.value
      }),
    });

    const data = await response.json();

    if (data.error) {
      error.value = data.error;
      results.value = [];
    } else {
      results.value = data;
    }
  } catch (err) {
    error.value = "An error occurred during the analysis. Please try again.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
}

function getSeverityColor(severity: string): string {
  if (!severity) return 'info';

  switch (severity.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
}

function getSeverityIcon(severity: string): string {
  if (!severity) return 'mdi-information';

  switch (severity.toLowerCase()) {
    case 'critical':
      return 'mdi-alert-circle';
    case 'high':
      return 'mdi-alert';
    case 'medium':
      return 'mdi-alert-outline';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-information';
  }
}

function calculateGlobalAverage(): number {
  if (!results.value.length) return 0;

  const sum = results.value.reduce((acc, result) => acc + (result.score || 0), 0);
  return Math.round(sum / results.value.length);
}

function calculateAverageByType(type: string): number {
  if (!results.value.length) return 0;

  let sum = 0;
  let count = 0;

  results.value.forEach(result => {
    if (type === 'headers' && result.headerAnalysis) {
      sum += result.headerAnalysis.score || 0;
      count++;
    } else if (type === 'cookies' && result.cookieAnalysis) {
      sum += result.cookieAnalysis.score || 0;
      count++;
    } else if (type === 'vulnerabilities') {
      // Pour les vulnérabilités, un score élevé signifie moins de vulnérabilités
      // Calcul basé sur le nombre de problèmes detectés (inversé)
      const vulnerabilityCount = (result.securityIssues?.length || 0);
      const issueScore = vulnerabilityCount === 0 ? 100 : Math.max(0, 100 - vulnerabilityCount * 10);
      sum += issueScore;
      count++;
    }
  });

  return count ? Math.round(sum / count) : 0;
}
</script>

<style scoped>
.security-analyzer {
  margin-bottom: 30px;
}

.heading-level {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--v-primary-base);
  color: white;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
}

.heading-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>