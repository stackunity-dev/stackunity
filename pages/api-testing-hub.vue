<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title>Collections</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="collection in collections" :key="collection.id" :title="collection.name"
                @click="selectCollection(collection.id)">
                <template v-slot:append>
                  <v-btn icon color="error" size="small" @click.stop="deleteCollection(collection.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            <v-btn color="primary" block class="mt-2" @click="showNewCollectionDialog = true">
              Nouvelle Collection
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Requêtes Sauvegardées</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="savedRequest in savedRequests" :key="savedRequest.id" :title="savedRequest.name"
                @click="loadSavedRequest(savedRequest)">
                <template v-slot:append>
                  <v-btn icon color="error" size="small" @click.stop="deleteSavedRequest(savedRequest.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Nouveau Test API</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="sendRequest">
              <v-row>
                <v-col cols="12" md="3">
                  <v-select v-model="request.method" :items="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']" label="Méthode"
                    required></v-select>
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
                          <v-text-field v-model="header.value" label="Valeur"
                            placeholder="application/json"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                          <v-btn color="error" icon @click="removeHeader(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-btn color="primary" @click="addHeader" class="mt-2">
                        Ajouter un header
                      </v-btn>
                    </v-window-item>

                    <v-window-item value="body">
                      <v-textarea v-model="request.body" label="Body" placeholder='{"key": "value"}'
                        rows="5"></v-textarea>
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
                      <v-btn color="primary" @click="addParam" class="mt-2">
                        Ajouter un paramètre
                      </v-btn>
                    </v-window-item>
                  </v-window>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn color="primary" type="submit" :loading="loading" block>
                    Envoyer la requête
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card v-if="response">
          <v-card-title>
            Réponse
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveRequest" :disabled="!request.url">
              Sauvegarder
            </v-btn>
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
                </v-tabs>

                <v-window v-model="responseTab">
                  <v-window-item value="body">
                    <pre class="response-body">{{ formattedResponse }}</pre>
                  </v-window-item>
                  <v-window-item value="headers">
                    <pre class="response-headers">{{ formattedHeaders }}</pre>
                  </v-window-item>
                </v-window>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showNewCollectionDialog" max-width="500">
      <v-card>
        <v-card-title>Nouvelle Collection</v-card-title>
        <v-card-text>
          <v-text-field v-model="newCollectionName" label="Nom de la collection" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="showNewCollectionDialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="createCollection">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSaveRequestDialog" max-width="500">
      <v-card>
        <v-card-title>Sauvegarder la requête</v-card-title>
        <v-card-text>
          <v-text-field v-model="requestName" label="Nom de la requête" required></v-text-field>
          <v-select v-model="selectedCollectionId" :items="collections" item-title="name" item-value="id"
            label="Collection"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="showSaveRequestDialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="confirmSaveRequest">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiTestingStore } from '../stores/apiTestingStore';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();
const apiTestingStore = useApiTestingStore();

// Vérification du statut premium
if (!userStore.isPremium) {
  router.push('/pricing');
}

const activeTab = ref('headers');
const responseTab = ref('body');
const loading = ref(false);
const response = ref<any>(null);
const showNewCollectionDialog = ref(false);
const showSaveRequestDialog = ref(false);
const newCollectionName = ref('');
const requestName = ref('');
const selectedCollectionId = ref('');

const request = ref({
  method: 'GET',
  url: '',
  headers: [{ key: '', value: '' }],
  body: '',
  params: [{ key: '', value: '' }]
});

const collections = computed(() => apiTestingStore.collections);
const savedRequests = computed(() => apiTestingStore.savedRequests);

const formattedResponse = computed(() => {
  if (!response.value?.data) return '';
  try {
    return JSON.stringify(response.value.data, null, 2);
  } catch {
    return response.value.data;
  }
});

const formattedHeaders = computed(() => {
  if (!response.value?.headers) return '';
  return JSON.stringify(response.value.headers, null, 2);
});

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

async function sendRequest() {
  loading.value = true;
  const startTime = performance.now();
  try {
    const headers = request.value.headers.reduce((acc: any, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {});

    const params = request.value.params.reduce((acc: any, param) => {
      if (param.key && param.value) {
        acc[param.key] = param.value;
      }
      return acc;
    }, {});

    let body = null as any;
    if (request.value.body) {
      try {
        body = JSON.parse(request.value.body);
      } catch {
        body = request.value.body;
      }
    }

    const responseData = await fetch(request.value.url, {
      method: request.value.method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const responseHeaders = {};
    responseData.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const duration = performance.now() - startTime;

    response.value = {
      status: responseData.status,
      headers: responseHeaders,
      data: await responseData.json()
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
      status: 0,
      error: error.message
    };
  } finally {
    loading.value = false;
  }
}

function saveRequest() {
  showSaveRequestDialog.value = true;
}

function confirmSaveRequest() {
  if (!requestName.value) return;

  const savedRequest = apiTestingStore.saveRequest({
    name: requestName.value,
    ...request.value
  });

  if (selectedCollectionId.value) {
    apiTestingStore.addRequestToCollection(selectedCollectionId.value, savedRequest.id);
  }

  showSaveRequestDialog.value = false;
  requestName.value = '';
  selectedCollectionId.value = '';
}

function createCollection() {
  if (!newCollectionName.value) return;

  apiTestingStore.createCollection(newCollectionName.value);
  showNewCollectionDialog.value = false;
  newCollectionName.value = '';
}

function deleteCollection(id: string) {
  apiTestingStore.deleteCollection(id);
}

function deleteSavedRequest(id: string) {
  apiTestingStore.deleteRequest(id);
}

function loadSavedRequest(savedRequest: any) {
  request.value = {
    method: savedRequest.method,
    url: savedRequest.url,
    headers: savedRequest.headers,
    body: savedRequest.body,
    params: savedRequest.params
  };
}

function selectCollection(id: string) {
  selectedCollectionId.value = id;
}

onMounted(() => {
  apiTestingStore.loadData();
});
</script>

<style scoped>
.response-body,
.response-headers {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 400px;
}
</style>