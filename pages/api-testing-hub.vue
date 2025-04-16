<template>
  <v-container fluid>

    <v-alert v-if="request.method === 'DELETE'" color="info" variant="tonal" class="mb-4">
      <v-icon>mdi-information</v-icon>
      Warning: take precautions when using the DELETE method.
    </v-alert>

    <v-card class="mb-4">
      <v-card-title>New API Test</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendRequest">
          <v-row>
            <v-col cols="12" md="3">
              <v-select v-model="request.method" :items="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']" label="Method"
                required variant="outlined" density="comfortable" :class="`text-${getMethodColor(request.method)}`">
              </v-select>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field v-model="request.url" label="URL" placeholder="https://api.example.com/endpoint"
                required></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-tabs v-model="activeTab">
                <v-tab value="headers">Headers</v-tab>
                <v-tab value="body">Body</v-tab>
                <v-tab value="params">Params</v-tab>
              </v-tabs>

              <v-window v-model="activeTab">
                <v-window-item value="headers">
                  <v-row v-for="(header, index) in request.headers" :key="index">
                    <v-col cols="5">
                      <v-text-field v-model="header.key" label="Clé" placeholder="Content-Type"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field v-model="header.value" label="Valeur" placeholder="application/json"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn color="error" icon @click="removeHeader(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" variant="tonal" @click="addHeader" class="mt-2">
                    Add a header
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-window-item>

                <v-window-item value="body">
                  <v-textarea v-model="request.body" label="Body" placeholder='{"key": "value"}' rows="10" class=""
                    @input="formatJson"></v-textarea>
                </v-window-item>

                <v-window-item value="params">
                  <v-row v-for="(param, index) in request.params" :key="index">
                    <v-col cols="5">
                      <v-text-field v-model="param.key" label="Clé" placeholder="page"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field v-model="param.value" label="Valeur" placeholder="1"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn color="error" icon @click="removeParam(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" variant="tonal" @click="addParam" class="mt-2">
                    Add a parameter
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn color="secondary" variant="tonal" type="submit" :loading="loading" block>
                Send the Request
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-if="response">
      <v-card-title>
        Response
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-chip :color="response.status >= 200 && response.status < 300 ? 'success' : 'error'" class="mb-2">
              Status: {{ response.status }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <v-tabs v-model="responseTab">
              <v-tab value="body">Body</v-tab>
              <v-tab value="headers">Headers</v-tab>
              <v-tab value="docs">Documentation</v-tab>
              <v-tab value="apitest">API Tests</v-tab>
            </v-tabs>

            <v-window v-model="responseTab">
              <v-window-item value="body">
                <v-tabs v-model="bodyView">
                  <v-tab value="raw">Raw</v-tab>
                  <v-tab value="tree">Tree</v-tab>
                </v-tabs>
                <v-window v-model="bodyView">
                  <v-window-item value="raw">
                    <pre class="response-body bg-grey-darken-4" v-html="formattedResponse"></pre>
                  </v-window-item>
                  <v-window-item value="tree">
                    <JsonTreeViewer :data="response?.data" />
                  </v-window-item>
                </v-window>
              </v-window-item>
              <v-window-item value="headers">
                <pre class="response-body bg-grey-darken-4" v-html="formattedHeaders"></pre>
              </v-window-item>
              <v-window-item value="docs">
                <v-card class="mb-4">
                  <v-card-title>
                    Documentation OpenAPI
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="downloadDocs" class="mr-2">
                      <v-icon>mdi-download</v-icon>
                      Download
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select v-model="docOptions.schemaDepth" :items="[1, 2, 3, 4, 5]" label="Profondeur du schéma"
                          density="comfortable"></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-switch v-model="docOptions.showExamples" label="Afficher les exemples"
                          density="comfortable"></v-switch>
                      </v-col>
                    </v-row>
                    <pre class="response-body bg-grey-darken-4" v-html="formattedDocs"></pre>
                  </v-card-text>
                </v-card>
              </v-window-item>
              <v-window-item value="apitest">
                <v-card class="mb-4">
                  <v-card-title class="d-flex align-center">
                    Automatic API tests
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="runApiTests" :loading="apiTestsLoading" class="mr-2">
                      <v-icon start>mdi-shield-bug</v-icon>
                      Run the tests
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-alert v-if="!apiTestResults.length && !apiTestsLoading" color="info" variant="tonal"
                      class="mb-4">
                      Click on "Run the tests" to automatically analyze different potential vulnerabilities
                    </v-alert>

                    <v-expansion-panels v-if="apiTestResults.length > 0">
                      <v-expansion-panel v-for="(test, index) in apiTestResults" :key="index">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon :color="getTestResultColor(test.status)" class="mr-2">
                              {{ getTestResultIcon(test.status) }}
                            </v-icon>
                            <span>{{ test.name }}</span>
                            <v-chip size="small" :color="getTestResultColor(test.status)" class="ml-2">
                              {{ test.status }}
                            </v-chip>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div>
                            <p><strong>Description:</strong> {{ test.description }}</p>
                            <p v-if="test.impact"><strong>Impact:</strong> {{ test.impact }}</p>
                            <v-divider class="my-3"></v-divider>

                            <div v-if="test.response">
                              <p><strong>Result:</strong> {{ test.message }}</p>
                              <v-card variant="outlined" class="mt-3">
                                <v-card-text>
                                  <p><strong>Status:</strong> {{ test.response.status }}</p>
                                  <p><strong>Response data:</strong></p>
                                  <pre
                                    class="response-body bg-grey-darken-4">{{ JSON.stringify(test.response.data, null, 2) }}</pre>
                                </v-card-text>
                              </v-card>
                            </div>

                            <v-alert v-if="test.recommendation" color="info" variant="tonal" class="mt-3">
                              <strong>Recommendation:</strong> {{ test.recommendation }}
                            </v-alert>
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
import * as requestUtils from '../utils/ts/api/requestUtils';
import { runAllSecurityTests } from '../utils/ts/api/securityTests';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'API Testing Hub',
  meta: [
    { name: 'description', content: 'API Testing Hub' }
  ]
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const apiTestingStore = useApiTestingStore();

const activeTab = ref('headers');
const responseTab = ref('body');
const loading = ref(false);
const response = ref<any>(null);
const bodyView = ref('raw');

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

const formattedHeaders = computed(() => {
  if (!response.value?.headers) return '';
  return JSON.stringify(response.value.headers, null, 2);
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

    const headers = request.value.headers.reduce((acc: any, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

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
          ...headers
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

    apiTestingStore.addToHistory({
      requestId: '',
      status: responseData.status,
      headers: responseHeaders,
      data: response.value.data,
      duration
    });
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
  apiTestingStore.loadData();
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
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case 'info': return 'info';
    default: return 'grey';
  }
}

function getTestResultIcon(status: string): string {
  switch (status) {
    case 'success': return 'mdi-check-circle';
    case 'warning': return 'mdi-alert-circle';
    case 'error': return 'mdi-close-circle';
    case 'info': return 'mdi-information';
    default: return 'mdi-help-circle';
  }
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

    apiTestResults.value = await runAllSecurityTests(apiRequest);

  } catch (error) {
    console.error('Erreur lors des tests d\'API:', error);
  } finally {
    apiTestsLoading.value = false;
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
</style>