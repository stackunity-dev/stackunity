<template>
  <v-container fluid class="pa-2 pa-sm-4">

    <v-alert v-if="request.method === 'DELETE'" color="info" variant="tonal" class="mb-4">
      <v-icon>mdi-information</v-icon>
      {{ t().alerts.deleteWarning }}
    </v-alert>

    <v-card class="mb-4">
      <v-card-title class="text-h6 d-flex flex-wrap">
        <span class="flex-grow-1">{{ t().cardTitles.newTest }}</span>
        <v-tooltip location="bottom" :text="t().tooltips.historySettings">
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" @click="showHistoryDialog = true">
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendRequest">
          <v-row dense>
            <v-col cols="12" sm="3">
              <v-select v-model="request.method" :items="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
                :label="t().forms.method" required variant="outlined" density="comfortable"
                :class="`text-${getMethodColor(request.method)} mobile-select`">
              </v-select>
            </v-col>
            <v-col cols="12" sm="9">
              <v-text-field v-model="request.url" :label="t().forms.url" :placeholder="t().forms.urlPlaceholder"
                required class="mobile-input"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-tabs v-model="activeTab" show-arrows density="comfortable" class="mobile-tabs">
                <v-tab value="headers">{{ t().forms.tabs.headers }}</v-tab>
                <v-tab value="body">{{ t().forms.tabs.body }}</v-tab>
                <v-tab value="params">{{ t().forms.tabs.params }}</v-tab>
              </v-tabs>

              <v-window v-model="activeTab">
                <v-window-item value="headers">
                  <v-row dense v-for="(header, index) in request.headers" :key="index" class="mobile-row">
                    <v-col cols="5">
                      <v-text-field v-model="header.key" :label="t().forms.headers.key"
                        :placeholder="t().forms.headers.keyPlaceholder" density="comfortable" hide-details
                        class="mb-2"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field v-model="header.value" :label="t().forms.headers.value"
                        :placeholder="t().forms.headers.valuePlaceholder" density="comfortable" hide-details
                        class="mb-2"></v-text-field>
                    </v-col>
                    <v-col cols="2" class="d-flex align-center">
                      <v-btn color="error" icon size="small" @click="removeHeader(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div class="d-flex align-center flex-wrap gap-2 mt-2">
                    <v-btn color="primary" variant="tonal" @click="addHeader" size="small">
                      {{ t().forms.headers.add }}
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>

                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="secondary" variant="text" size="small" v-bind="props" class="ml-2">
                          {{ t().forms.headers.common }}
                          <v-icon end>mdi-menu-down</v-icon>
                        </v-btn>
                      </template>
                      <v-list density="compact">
                        <v-list-item @click="addCommonHeader('Authorization', 'Bearer token123')">
                          <v-list-item-title>Authorization</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addCommonHeader('Content-Type', 'application/json')">
                          <v-list-item-title>Content-Type</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addCommonHeader('Accept', 'application/json')">
                          <v-list-item-title>Accept</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="addCommonHeader('X-API-Key', 'your-api-key')">
                          <v-list-item-title>X-API-Key</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <v-tooltip location="top" text="Common headers automatically added by browsers">
                      <template v-slot:activator="{ props }">
                        <v-btn color="info" variant="text" size="small" v-bind="props" class="ml-2">
                          <v-icon>mdi-information-outline</v-icon>
                        </v-btn>
                      </template>
                      <div class="pa-2">
                        <p class="text-body-2">{{ t().forms.headers.commonNote }} <code>Host</code>,
                          <code>User-Agent</code>,
                          <code>Accept</code>, {{ t().forms.headers.etc }}
                        </p>
                      </div>
                    </v-tooltip>
                  </div>
                </v-window-item>

                <v-window-item value="body">
                  <v-textarea v-model="request.body" :label="t().forms.body.label"
                    :placeholder="t().forms.body.placeholder" rows="10" @input="formatJson"></v-textarea>
                </v-window-item>

                <v-window-item value="params">
                  <v-row v-for="(param, index) in request.params" :key="index">
                    <v-col cols="5">
                      <v-text-field v-model="param.key" :label="t().forms.params.key"
                        :placeholder="t().forms.params.keyPlaceholder"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field v-model="param.value" :label="t().forms.params.value"
                        :placeholder="t().forms.params.valuePlaceholder"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn color="error" icon @click="removeParam(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" variant="tonal" @click="addParam" class="mt-2">
                    {{ t().forms.params.add }}
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn color="secondary" variant="tonal" type="submit" :loading="loading" block>
                {{ t().forms.send }}
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-if="response">
      <v-card-title class="text-h6 d-flex flex-wrap align-center">
        <span class="flex-grow-1">{{ t().cardTitles.response }}</span>
        <v-chip :color="response.status >= 200 && response.status < 300 ? 'success' : 'error'" class="ml-2"
          size="small">
          {{ t().cardTitles.status }}: {{ response.status }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="responseTab" show-arrows density="comfortable" class="mobile-tabs">
              <v-tab value="body">{{ t().forms.tabs.body }}</v-tab>
              <v-tab value="headers">{{ t().forms.tabs.headers }}</v-tab>
              <v-tab value="docs">{{ t().forms.tabs.docs }}</v-tab>
              <PremiumFeature v-if="!userStore.isPremium" type="tab" title="API Tests" icon="mdi-shield-bug"
                color="warning" variant="elevated" size="small" />
              <v-tab v-else-if="userStore.isPremium" value="apitest">{{ t().forms.tabs.tests }}</v-tab>
            </v-tabs>

            <v-window v-model="responseTab">
              <v-window-item value="body">
                <v-tabs v-model="bodyView" density="comfortable" class="mobile-tabs">
                  <v-tab value="raw">{{ t().forms.tabs.raw }}</v-tab>
                  <v-tab value="tree">{{ t().forms.tabs.tree }}</v-tab>
                </v-tabs>
                <v-window v-model="bodyView">
                  <v-window-item value="raw">
                    <div class="response-wrapper">
                      <pre class="response-body bg-grey-darken-4" v-html="formattedResponse"></pre>
                    </div>
                  </v-window-item>
                  <v-window-item value="tree">
                    <div class="response-wrapper">
                      <JsonTreeViewer :data="response?.data" />
                    </div>
                  </v-window-item>
                </v-window>
              </v-window-item>

              <v-window-item value="headers">
                <v-tabs v-model="headersTab" density="comfortable" class="mt-2">
                  <v-tab value="response">{{ t().forms.tabs.response }}</v-tab>
                  <v-tab value="request">{{ t().forms.tabs.request }}</v-tab>
                </v-tabs>

                <v-window v-model="headersTab">
                  <v-window-item value="response">
                    <div class="response-wrapper">
                      <pre class="response-body bg-grey-darken-4" v-html="formattedResponseHeaders"></pre>
                    </div>
                  </v-window-item>

                  <v-window-item value="request">
                    <div class="response-wrapper">
                      <pre class="response-body bg-grey-darken-4" v-html="formattedRequestHeaders"></pre>
                    </div>
                    <v-alert v-if="sentHeaders && Object.keys(sentHeaders).length === 0" type="info" variant="tonal"
                      class="mt-2">
                      {{ t().alerts.noCustomHeaders }}
                    </v-alert>
                  </v-window-item>
                </v-window>
              </v-window-item>

              <v-window-item value="docs">
                <v-card class="mb-4" variant="flat">
                  <v-card-title class="d-flex flex-wrap align-center pa-2">
                    <span class="text-body-1">{{ t().cardTitles.documentation }}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="downloadDocs" size="small" class="mt-2 mt-sm-0">
                      <v-icon start>mdi-download</v-icon>
                      {{ t().buttons.download }}
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <v-select v-model="docOptions.schemaDepth" :items="[1, 2, 3, 4, 5]"
                          :label="t().forms.schemaDepth" density="comfortable" hide-details class="mb-2">
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-switch v-model="docOptions.showExamples" :label="t().forms.showExamples"
                          density="comfortable" hide-details class="mb-2">
                        </v-switch>
                      </v-col>
                    </v-row>
                    <div class="response-wrapper">
                      <pre class="response-body bg-grey-darken-4" v-html="formattedDocs"></pre>
                    </div>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <v-window-item value="apitest">
                <v-card class="mb-4" variant="flat">
                  <v-card-title class="d-flex flex-wrap align-center pa-2">
                    <span class="text-body-1">{{ t().cardTitles.apiTests }}</span>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="runApiTests" :loading="apiTestsLoading" size="small"
                      class="mt-2 mt-sm-0">
                      <v-icon start>mdi-shield-bug</v-icon>
                      {{ t().buttons.run }}
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-alert v-if="!apiTestResults.length && !apiTestsLoading" color="info" variant="tonal"
                      class="ma-2">
                      {{ t().alerts.runTests }}
                    </v-alert>

                    <v-expansion-panels v-if="apiTestResults.length > 0">
                      <v-expansion-panel v-for="(test, index) in apiTestResults" :key="index">
                        <v-expansion-panel-title class="text-body-2">
                          <div class="d-flex align-center flex-wrap gap-2">
                            <v-icon :color="getTestResultColor(test.status)" size="small">
                              {{ getTestResultIcon(test.status) }}
                            </v-icon>
                            <span class="text-truncate">{{ test.name }}</span>
                            <v-chip size="x-small" :color="getTestResultColor(test.status)" class="ml-auto">
                              {{ test.status }}
                            </v-chip>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="text-body-2">
                            <p><strong>{{ t().forms.impact }}</strong> {{ test.impact }}</p>
                            <v-divider class="my-2"></v-divider>

                            <div v-if="test.response">
                              <p><strong>{{ t().forms.result }}:</strong> {{ test.message }}</p>
                              <v-card variant="outlined" class="mt-2">
                                <v-card-text class="pa-2">
                                  <p><strong>{{ t().forms.status }}:</strong> {{ test.response.status }}</p>
                                  <p><strong>{{ t().forms.data }}:</strong></p>
                                  <div class="response-wrapper">
                                    <pre class="response-body bg-grey-darken-4">{{ JSON.stringify(test.response.data, null,
                                      2) }}</pre>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showHistoryDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">{{ t().cardTitles.historySettings }}</v-card-title>
        <v-card-text>
          <v-switch v-model="saveToHistory" color="primary" :label="t().forms.saveToHistory"></v-switch>

          <v-alert v-if="historyError" type="error" variant="tonal" class="mt-4 mb-2">
            {{ historyError }}
          </v-alert>

          <div class="d-flex align-center mt-4">
            <v-btn color="error" variant="outlined" @click="clearHistory" :disabled="!saveToHistory">
              {{ t().buttons.clear }}
              <v-icon end>mdi-delete</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <div class="text-caption" v-if="saveToHistory">
              {{ t().cardTitles.historyCount }}: {{ historyCount }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showHistoryDialog = false">
            {{ t().buttons.close }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiTestingStore } from '../stores/apiTestingStore';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import JsonTreeViewer from '../components/JsonTreeViewer.vue';
import { useTranslations } from '../languages';
import * as requestUtils from '../utils/ts/api/requestUtils';
import * as securityTests from '../utils/ts/api/securityTests';

const t = useTranslations('apiTestingHub');

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: computed(() => t().meta.title),
  meta: [
    { name: 'description', content: computed(() => t().meta.description) }
  ]
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const apiTestingStore = useApiTestingStore();

const activeTab = ref('headers');
const responseTab = ref('body');
const headersTab = ref('response');
const loading = ref(false);
const response = ref<any>(null);
const bodyView = ref('raw');
const sentHeaders = ref<Record<string, string>>({});

const request = ref({
  method: 'GET',
  url: '',
  headers: [{ key: '', value: '' }],
  body: '',
  params: [{ key: '', value: '' }]
});
const formattedResponse = computed(() => {
  if (!response.value?.data) return '';
  try {
    const jsonString = JSON.stringify(response.value.data, null, 2);
    return hljs.highlight(jsonString, { language: 'json' }).value;
  } catch {
    return response.value.data;
  }
});

const formattedResponseHeaders = computed(() => {
  if (!response.value?.headers) return '';
  return JSON.stringify(response.value.headers, null, 2);
});

const formattedRequestHeaders = computed(() => {
  if (!sentHeaders.value) return '';
  return JSON.stringify(sentHeaders.value, null, 2);
});

const docOptions = ref({
  schemaDepth: 3,
  showExamples: true
});

const formattedDocs = computed(() => {
  if (!response.value?.data) return '';
  try {
    const data = response.value.data;
    const docs = {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Documentation generated automatically"
      },
      paths: {
        [new URL(request.value.url).pathname]: {
          [request.value.method.toLowerCase()]: {
            summary: "Generated endpoint",
            parameters: request.value.params.map(param => ({
              name: param.key,
              in: "query",
              required: true,
              schema: { type: "string" }
            })),
            requestBody: request.value.body ? {
              required: true,
              content: {
                "application/json": {
                  schema: generateSchema(data, docOptions.value.schemaDepth)
                }
              }
            } : undefined,
            responses: {
              [response.value.status]: {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: generateSchema(data, docOptions.value.schemaDepth)
                  }
                }
              }
            }
          }
        }
      }
    };

    return hljs.highlight(JSON.stringify(docs, null, 2), { language: 'json' }).value;
  } catch {
    return '// No documentation to display';
  }
});

function generateSchema(data: any, depth: number, currentDepth = 0): any {
  if (currentDepth >= depth) {
    return { type: "object", description: "Detailed schema available" };
  }

  if (typeof data !== 'object' || data === null) {
    return { type: typeof data };
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return { type: "array", items: { type: "object" } };

    const sample = data.slice(0, 3);
    return {
      type: "array",
      items: generateSchema(sample[0], depth, currentDepth + 1)
    };
  }

  const properties: Record<string, any> = {};
  const required: string[] = [];

  const entries = Object.entries(data).slice(0, 10);

  for (const [key, value] of entries) {
    properties[key] = generateSchema(value, depth, currentDepth + 1);
    if (value !== null && value !== undefined) {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    required,
    ...(Object.keys(data).length > 10 ? { description: `${Object.keys(data).length - 10} propriétés supplémentaires...` } : {})
  };
}

function addHeader() {
  request.value.headers.push({ key: '', value: '' });
}

function removeHeader(index: number) {
  request.value.headers.splice(index, 1);
}

function addParam() {
  request.value.params.push({ key: '', value: '' });
}

function removeParam(index: number) {
  request.value.params.splice(index, 1);
}

function addCommonHeader(key: string, value: string) {
  // Check if this header already exists
  const existingHeader = request.value.headers.find(h => h.key === key);
  if (existingHeader) {
    existingHeader.value = value;
  } else {
    request.value.headers.push({ key, value });
  }
}

async function buildUrlWithParams(baseUrl: string, params: { key: string; value: string }[]) {
  return requestUtils.buildUrlWithParams(baseUrl, params);
}

function extractParamsFromUrl(url: string) {
  return requestUtils.extractParamsFromUrl(url);
}

function updateUrlState() {
  const state = {
    method: request.value.method,
    url: request.value.url,
    body: request.value.body,
    headers: request.value.headers,
    params: request.value.params
  };

  router.push({
    query: {
      state: btoa(JSON.stringify(state))
    }
  });
}

function loadStateFromUrl() {
  const stateParam = route.query.state;
  if (stateParam && typeof stateParam === 'string') {
    try {
      const state = JSON.parse(atob(stateParam));
      request.value = {
        method: state.method || 'GET',
        url: state.url || '',
        headers: state.headers || [{ key: '', value: '' }],
        body: state.body || '',
        params: state.params || [{ key: '', value: '' }]
      };
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état:', error);
    }
  }
}

watch(() => request.value, () => {
  updateUrlState();
}, { deep: true });

async function sendRequest() {
  loading.value = true;
  historyError.value = null;
  const startTime = performance.now();
  try {
    if (!request.value.url) {
      throw new Error('Please enter a valid URL');
    }

    try {
      new URL(request.value.url);
    } catch {
      throw new Error('Invalid URL. Please enter a complete URL (ex: https://api.example.com)');
    }

    let finalUrl = request.value.url;
    if (request.value.params.length > 0) {
      const url = new URL(request.value.url);
      request.value.params.forEach(param => {
        if (param.key && param.value) {
          url.searchParams.set(param.key, param.value);
        }
      });
      finalUrl = url.toString();
    }

    // Store the headers we're actually sending
    sentHeaders.value = {};
    request.value.headers.forEach(header => {
      if (header.key && header.value) {
        sentHeaders.value[header.key] = header.value;
      }
    });

    let body: string | null = null;
    if (request.value.body) {
      try {
        body = JSON.stringify(JSON.parse(request.value.body));
      } catch {
        body = request.value.body;
      }
    }

    let responseData;
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(finalUrl)}`;
      responseData = await fetch(proxyUrl, {
        method: request.value.method,
        headers: {
          'Content-Type': 'application/json',
          ...sentHeaders.value
        },
        body: body || undefined
      });
    } catch (error) {
      response.value = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'X-Error-Type': 'Connection Error'
        },
        data: {
          error: 'Connection Error',
          message: 'Unable to connect to the server',
          details: error.message,
          url: finalUrl,
          timestamp: new Date().toISOString()
        }
      };
      return;
    }

    const responseHeaders = {};
    responseData.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const duration = performance.now() - startTime;

    let responseBody;
    const contentType = responseData.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await responseData.json();
    } else {
      responseBody = await responseData.text();
    }

    response.value = {
      status: responseData.status,
      headers: responseHeaders,
      data: responseBody
    };

    if (saveToHistory.value) {
      try {
        apiTestingStore.addToHistory({
          requestId: '',
          status: responseData.status,
          headers: responseHeaders,
          data: response.value.data,
          duration
        });

        updateHistoryCount();
      } catch (error) {
        console.error('Error saving to history:', error);
        historyError.value = 'Failed to save request to history. Storage quota may be exceeded.';
        if (error.message && error.message.includes('quota')) {
          saveToHistory.value = false;
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    response.value = {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Type': 'Request Error'
      },
      data: {
        error: 'Request Error',
        message: error.message || 'An error occurred while sending the request',
        timestamp: new Date().toISOString()
      }
    };
  } finally {
    loading.value = false;
    if (responseTab.value === 'headers') {
      headersTab.value = 'request';
    }
  }
}

function formatJson() {
  try {
    request.value.body = requestUtils.formatJson(request.value.body);
  } catch {
  }
}


watch(() => request.value.url, (newUrl) => {
  if (newUrl) {
    const params = extractParamsFromUrl(newUrl);
    if (params.length > 0) {
      request.value.params = params;
    }
  }
});

watch(() => request.value.params, async (newParams) => {
  if (request.value.url) {
    const newUrl = await buildUrlWithParams(request.value.url, newParams);
    if (newUrl !== request.value.url) {
      request.value.url = newUrl;
    }
  }
}, { deep: true });

watch(() => request.value.method, (newMethod) => {
  if (newMethod === 'POST') {
    try {
      const url = new URL(request.value.url);
      request.value.url = url.origin + url.pathname;
      request.value.params = [];
      request.value.body = JSON.stringify({
        key: "value",
      }, null, 2);
    } catch (e) {
    }
  } else if (newMethod === 'GET') {
    request.value.body = '';
    try {
      const url = new URL(request.value.url);
      const params = extractParamsFromUrl(request.value.url);
      if (params.length > 0) {
        request.value.params = params;
      }
    } catch (e) {
    }
  }
});

onMounted(() => {
  try {
    apiTestingStore.loadData();
    updateHistoryCount();
  } catch (error) {
    console.error('Error loading API testing data:', error);
    if (error.message && error.message.includes('quota')) {
      historyError.value = 'History storage quota exceeded. History has been disabled.';
      saveToHistory.value = false;
    }
  }
  loadStateFromUrl();
});

function getMethodColor(method: string): string {
  return requestUtils.getMethodColor(method);
}

function downloadDocs() {
  const docs = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation générée automatiquement"
    },
    paths: {
      [new URL(request.value.url).pathname]: {
        [request.value.method.toLowerCase()]: {
          summary: "Endpoint généré",
          parameters: request.value.params.map(param => ({
            name: param.key,
            in: "query",
            required: true,
            schema: { type: "string" }
          })),
          requestBody: request.value.body ? {
            required: true,
            content: {
              "application/json": {
                schema: generateSchema(response.value.data, docOptions.value.schemaDepth)
              }
            }
          } : undefined,
          responses: {
            [response.value.status]: {
              description: "Réponse réussie",
              content: {
                "application/json": {
                  schema: generateSchema(response.value.data, docOptions.value.schemaDepth)
                }
              }
            }
          }
        }
      }
    }
  };

  const blob = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'api-documentation.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const apiTestsLoading = ref(false);
const apiTestResults = ref<Array<{
  name: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  impact?: string;
  recommendation?: string;
  response?: any;
}>>([]);

function getTestResultColor(status: string): string {
  return securityTests.getTestResultColor(status);
}

function getTestResultIcon(status: string): string {
  return securityTests.getTestResultIcon(status);
}

async function runApiTests() {
  apiTestsLoading.value = true;
  apiTestResults.value = [];

  try {
    if (!request.value.url) {
      throw new Error('Please enter a valid URL');
    }


    const apiRequest: requestUtils.ApiRequest = {
      method: request.value.method,
      url: request.value.url,
      headers: request.value.headers,
      body: request.value.body,
      params: request.value.params
    };

    apiTestResults.value = await securityTests.runAllSecurityTests(apiRequest);

  } catch (error) {
    console.error('Erreur lors des tests d\'API:', error);
  } finally {
    apiTestsLoading.value = false;
  }
}

const showHistoryDialog = ref(false);
const saveToHistory = ref(true);
const historyError = ref<string | null>(null);
const historyCount = ref(0);

function clearHistory() {
  apiTestingStore.clearHistory();
  historyError.value = null;
  historyCount.value = 0;
}

function updateHistoryCount() {
  try {
    const historyData = localStorage.getItem('apiTesting_history');
    if (historyData) {
      const history = JSON.parse(historyData);
      historyCount.value = Array.isArray(history) ? history.length : 0;
    } else {
      historyCount.value = 0;
    }
  } catch (e) {
    historyCount.value = 0;
  }
}

</script>

<style scoped>
.response-body {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 400px;
  font-family: monospace;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .response-body {
    padding: 0.5rem;
    font-size: 0.8rem;
    max-height: 300px;
  }

  .mobile-row {
    margin: 0 -8px;
  }

  .mobile-select {
    min-width: 100px;
  }

  .mobile-input {
    font-size: 0.9rem;
  }

  .mobile-tabs {
    margin: 0 -16px;
  }

  :deep(.v-tab) {
    padding: 0.5rem;
    min-width: auto;
  }

  :deep(.v-btn) {
    padding: 0.25rem 0.5rem;
  }

  :deep(.v-card-title) {
    font-size: 1.25rem;
    padding: 1rem;
  }

  :deep(.v-card-text) {
    padding: 0.75rem;
  }

  .response-wrapper {
    margin: 0.25rem 0;
  }

  :deep(.v-expansion-panel-title) {
    padding: 0.5rem;
    min-height: auto;
  }

  :deep(.v-expansion-panel-text) {
    padding: 0.5rem;
  }

  .gap-2 {
    gap: 0.5rem;
  }

  :deep(.text-body-2) {
    font-size: 0.875rem;
  }

  :deep(.v-alert) {
    padding: 0.5rem;
    margin: 0.5rem;
  }
}

:deep(.hljs) {
  background: transparent;
  padding: 0;
}

.body-preview {
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  font-family: monospace;
  font-size: 0.9em;
  overflow-x: auto;
}

.highlighted-json {
  font-family: monospace;
}

.editor-container {
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  overflow: hidden;
}

.method-select :deep(.v-field__input) {
  color: inherit;
}

.method-select :deep(.v-field__input)>div {
  width: 100%;
}

.response-wrapper {
  position: relative;
  width: 100%;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.headers-tab {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-bottom: 8px;
}

.response-headers-title,
.request-headers-title {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 8px 0;
  opacity: 0.7;
}
</style>