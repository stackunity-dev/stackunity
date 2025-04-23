<template>
  <v-app>
    <v-app-bar flat color="primary" elevation="2">
      <v-toolbar-title class="text-h5 font-weight-bold">
        Code Snippet Editor
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon class="mr-2" to="/snippets">
        <v-icon>mdi-arrow-left</v-icon>
        <v-tooltip activator="parent" location="bottom">Back to Snippets</v-tooltip>
      </v-btn>

      <v-select v-model="selectedLanguage" :items="languages" label="Language" style="max-width:200px;"
        variant="outlined" density="comfortable" class="mx-4" hide-details></v-select>

      <v-btn v-if="snippetType === 'personal'" :color="editMode ? 'success' : 'white'"
        :variant="editMode ? 'flat' : 'outlined'" @click="toggleEdit" class="mx-2" :disabled="!snippetData">
        <v-icon :icon="editMode ? 'mdi-check' : 'mdi-pencil'" start></v-icon>
        {{ editMode ? 'Save' : 'Edit' }}
      </v-btn>

      <v-menu v-if="snippetType === 'personal'">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" :disabled="!snippetData"></v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-content-save" @click="updateSnippet">
            Save
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-delete" @click="deleteSnippet" color="error">
            Delete
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-card class="rounded-lg pa-4 ma-4" v-if="snippetData">
        <v-card-title class="text-h5 font-weight-bold">{{ snippetData.title }}</v-card-title>
        <v-card-subtitle class="pt-2">
          <v-chip size="small" color="primary" variant="flat" class="mr-2">{{ snippetData.framework }}</v-chip>
          <v-chip size="small" variant="outlined" class="mr-2">
            <v-icon start size="small">mdi-calendar</v-icon>
            {{ userStore.formatDate(snippetData.snippet_date || '') }}
          </v-chip>
        </v-card-subtitle>
        <v-divider class="my-4"></v-divider>
        <v-card-text>
          {{ snippetData.description }}
        </v-card-text>
      </v-card>
      <client-only>
        <v-container fluid class="pa-4 fill-height">
          <v-row v-if="isLoading" class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <div class="mt-4 text-h6">Loading snippet...</div>
            </v-col>
          </v-row>

          <v-row v-else-if="!snippetData" class="fill-height" align="center" justify="center">
            <v-col cols="12" class="text-center">
              <v-icon color="error" size="64">mdi-alert-circle</v-icon>
              <div class="mt-4 text-h6">Snippet not found</div>
              <v-btn color="primary" class="mt-4" to="/snippets">
                Back to snippets
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-else no-gutters class="fill-height">
            <v-col>
              <v-card class="fill-height" elevation="3">
                <v-fade-transition>
                  <client-only v-if="editMode && snippetType === 'personal'">
                    <component :is="MonacoEditor" v-model:value="code" :key="editMode" :language="selectedLanguage"
                      theme="vs-dark" :options="editorOptions" class="fill-height editor-container" />
                  </client-only>
                  <client-only v-else-if="snippetType === 'personal' && !editMode">
                    <div class="code-viewer">
                      <div class="code-header pa-4">
                        <v-chip color="primary" size="small" variant="flat" class="mr-2">
                          {{ selectedLanguage }}
                        </v-chip>
                        <v-chip size="small" variant="outlined">
                          {{ code.split('\n').length }} lines
                        </v-chip>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-6 code-content">
                        <pre><code ref="codeBlock" :class="selectedLanguage">{{ code }}</code></pre>
                      </div>
                    </div>
                  </client-only>
                  <client-only v-else>
                    <div class="code-viewer">
                      <div class="code-header pa-4">
                        <v-chip color="primary" size="small" variant="flat" class="mr-2">
                          {{ selectedLanguage }}
                        </v-chip>
                        <v-chip size="small" variant="outlined">
                          {{ code.split('\n').length }} lines
                        </v-chip>
                        <v-chip size="small" color="info" class="ml-2">
                          Read Only
                        </v-chip>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-6 code-content">
                        <pre><code ref="codeBlock" :class="selectedLanguage">{{ code }}</code></pre>
                      </div>
                    </div>
                  </client-only>
                </v-fade-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </client-only>
    </v-main>
    <Snackbar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="2000" />

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon start>mdi-alert-circle</v-icon>
          Delete Confirmation
        </v-card-title>
        <v-card-text class="pt-4">
          <p>Are you sure you want to delete this snippet? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDeleteSnippet">
            <v-icon start>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore 
import { definePageMeta, navigateTo, useHead, useRoute } from '#imports';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const MonacoEditor = defineAsyncComponent(() => import('monaco-editor-vue3'));
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const deleteDialog = ref(false);
const codeBlock = ref(null);

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Snippet - StackUnity',
  meta: [
    { name: 'description', content: 'View and edit your snippets' },
    { name: 'keywords', content: 'snippet, code snippet, code, snippets, edit, view' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Snippet - StackUnity' },
    { name: 'og:description', content: 'View and edit your snippets' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/snippets' }
  ]
});

if (process.client) {
  import('monaco-editor').then(() => {
    self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        let workerUrl;
        if (label === 'json') {
          workerUrl = new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url).href;
        } else if (label === 'css' || label === 'scss' || label === 'less') {
          workerUrl = new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url).href;
        } else if (label === 'html' || label === 'handlebars' || label === 'razor') {
          workerUrl = new URL('monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url).href;
        } else if (label === 'typescript' || label === 'javascript') {
          workerUrl = new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url).href;
        } else {
          workerUrl = new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url).href;
        }
        return new Worker(workerUrl, { type: 'module' });
      }
    };
  });
}

const route = useRoute();
type SnippetType = "world" | "personal";
const snippetId = Number(route.query.id);
const snippetType = route.query.type &&
  (route.query.type === "world" || route.query.type === "personal")
  ? (route.query.type as SnippetType)
  : "world";

const code = ref(`// Your code here`);
const selectedLanguage = ref('javascript');
const editorOptions = ref({
  automaticLayout: true,
  fontSize: 14,
  lineHeight: 24,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  roundedSelection: true,
  padding: { top: 16 },
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: true,
    verticalHasArrows: true,
    horizontalHasArrows: true,
    alwaysConsumeMouseWheel: false
  }
});
const editMode = ref(false);
const monacoKey = ref(Date.now());
const languages = ref(['html', 'css', 'javascript', 'typescript', 'vue']);
const isLoading = ref(false);

interface Snippet {
  id: number;
  publishWorld?: string;
  publishPersonal?: string;
  title: string;
  description: string;
  username: string;
  framework: string;
  img: string | null;
  imgFile?: string | File | null;
  content?: string;
  snippet_date?: string;
  date?: string;
  like?: number;
  likes?: number;
  favoris?: number;
  [key: string]: any;
}

const snippetData = ref<Snippet | null>(null);

const applyHighlight = () => {
  if (codeBlock.value && process.client) {
    hljs.highlightElement(codeBlock.value);
  }
};

watch([code, selectedLanguage], () => {
  nextTick(applyHighlight);
});

onMounted(async () => {
  hljs.configure({
    languages: languages.value,
    ignoreUnescapedHTML: true
  });

  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!userStore.isAuthenticated) {
      navigateTo('/login');
      return;
    }

    let snippet: Snippet | null = null;

    if (snippetType === 'world') {
      snippet = userStore.worldSnippets.find((s): s is Snippet => s.id === snippetId);
    } else {
      snippet = userStore.personalSnippets.find((s): s is Snippet => s.id === snippetId);
    }

    if (snippet) {
      snippetData.value = snippet;

      if (snippet.content) {
        code.value = snippet.content;
      }

      if (snippet.framework && languages.value.includes(snippet.framework.toLowerCase())) {
        selectedLanguage.value = snippet.framework.toLowerCase();
      }
    } else {
      console.error("Snippet non trouvé dans les données chargées");
      await userStore.loadData();

      if (snippetType === 'world') {
        snippet = userStore.worldSnippets.find((s): s is Snippet => s.id === snippetId);
      } else {
        snippet = userStore.personalSnippets.find((s): s is Snippet => s.id === snippetId);
      }

      if (snippet) {
        snippetData.value = snippet;
        if (snippet.content) {
          code.value = snippet.content;
        }
        if (snippet.framework && languages.value.includes(snippet.framework.toLowerCase())) {
          selectedLanguage.value = snippet.framework.toLowerCase();
        }
      }
    }
  } catch (err: any) {
    console.error("Erreur lors du chargement du snippet:", err.message, err.stack);
  } finally {
    isLoading.value = false;
    nextTick(applyHighlight);
  }
});

function toggleEdit() {
  editMode.value = !editMode.value;
  monacoKey.value = Date.now();
  if (!editMode.value) {
    nextTick(() => {
      applyHighlight();
    });
  }
};

const updateSnippet = async () => {
  try {
    console.log('Current snippet:', snippetData.value);
    const isPublishedWorld = userStore.worldSnippets.some((s: Snippet) => {
      return s.title === snippetData.value?.title && s.description === snippetData.value?.description;
    });
    const isPublishedPersonal = userStore.personalSnippets.some((s: Snippet) => {
      return s.id === snippetId;
    });
    console.log('Publication status:', { isPublishedWorld, isPublishedPersonal });

    if (isPublishedWorld) {
      const worldSnippet = userStore.worldSnippets.find(s => s.title === snippetData.value?.title);
      if (worldSnippet) {
        await userStore.updateSnippet(worldSnippet.id, code.value, 'world');
      }
    }
    if (isPublishedPersonal) {
      await userStore.updateSnippet(snippetId, code.value, 'personal');
    }

    snackbarText.value = 'Snippet mis à jour avec succès';
    snackbarColor.value = 'success';
    snackbar.value = true;
    editMode.value = false;
    nextTick(() => {
      applyHighlight();
    });
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    snackbarText.value = 'Erreur lors de la mise à jour du snippet';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
}

const deleteSnippet = () => {
  deleteDialog.value = true;
};

const confirmDeleteSnippet = async () => {
  try {
    const isPublishedWorld = userStore.worldSnippets.some(s => s.id === snippetId);
    const isPublishedPersonal = userStore.personalSnippets.some(s => s.id === snippetId);
    console.log('Publication status:', { isPublishedWorld, isPublishedPersonal });

    if (isPublishedWorld) {
      await userStore.deleteSnippet(snippetId, 'world');
    }
    if (isPublishedPersonal) {
      await userStore.deleteSnippet(snippetId, 'personal');
    }

    deleteDialog.value = false;
    snackbarText.value = 'Snippet supprimé avec succès';
    snackbarColor.value = 'success';
    snackbar.value = true;
    setTimeout(() => {
      navigateTo('/snippets');
    }, 1000);
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    snackbarText.value = 'Erreur lors de la suppression du snippet';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
}
</script>

<style scoped>
.editor-container {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: scroll;
}

.code-viewer {
  height: 100%;
  background: #0d1117;
  color: #c9d1d9;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

.code-header {
  background: #161b22;
}

.code-content {
  flex: 1;
  overflow: scroll;
}

pre {
  margin: 0;
  padding: 1rem;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  tab-size: 2;
  -moz-tab-size: 2;
}

code {
  font-family: inherit;
  background: transparent !important;
  padding: 0 !important;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
}

/* Customize scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #161b22;
}

::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6e7681;
}
</style>
