<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-tabs v-model="tab" color="primary" align-tabs="center" class="mb-6">
          <v-tab value="World" class="text-subtitle-1">
            <v-icon start>mdi-earth</v-icon>
            Public Snippets
          </v-tab>
          <v-tab value="Personal" class="text-subtitle-1">
            <v-icon start>mdi-account</v-icon>
            My Snippets
          </v-tab>
          <v-tab value="Favorites" class="text-subtitle-1">
            <v-icon start>mdi-star</v-icon>
            Favorites
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="World">
            <div class="d-flex align-center mb-4">
              <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search snippets"
                variant="outlined" density="comfortable" hide-details class="mr-4"></v-text-field>
              <v-select v-model="frameworkFilter" :items="['All', 'Vue.js 3', 'Nuxt 3', 'React', 'Angular', 'Svelte']"
                label="Framework" variant="outlined" density="comfortable" hide-details
                style="max-width: 200px"></v-select>
            </div>

            <v-row>
              <v-col v-for="(snippet, index) in filteredWorldSnippets" :key="index" cols="12" sm="6" lg="4">
                <v-card class="mx-auto snippet-card" max-width="400" elevation="2" hover>
                  <NuxtLink :to="`/snippetsView?id=${snippet.id}&type=world`" class="text-decoration-none">
                    <v-img :src="snippet.img" height="200" cover class="bg-grey-lighten-2">
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center" class="fill-height">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </NuxtLink>

                  <v-card-title class="text-h6 font-weight-bold">
                    {{ snippet.title }}
                  </v-card-title>

                  <v-card-text>
                    <p class="text-body-1 mb-2">{{ snippet.description }}</p>
                    <v-chip color="primary" variant="outlined" size="small" class="mb-2">
                      {{ snippet.framework }}
                    </v-chip>
                    <div class="d-flex align-center text-grey">
                      <v-icon size="small" class="mr-2">mdi-account</v-icon>
                      <span>{{ snippet.username }}</span>
                      <v-spacer></v-spacer>
                      <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                      <span class="text-caption">{{ formatDisplayDate(snippet) }}</span>
                    </div>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn variant="text" :color="snippet.isFavorite ? 'yellow' : ''"
                      @click.stop="toggleFavorite(snippet, 'world')">
                      <v-icon :icon="snippet.isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline'"></v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" :to="`/snippetsView?id=${snippet.id}&type=world`">
                      View Details
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col v-if="filteredWorldSnippets.length === 0" cols="12">
                <v-alert type="info" variant="tonal">
                  No snippets found. Try modifying your search criteria.
                </v-alert>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="Personal">
            <div class="d-flex align-center mb-4">
              <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search in my snippets"
                variant="outlined" density="comfortable" hide-details class="mr-4"></v-text-field>
              <v-select v-model="frameworkFilter" :items="['All', 'Vue.js 3', 'Nuxt 3', 'React', 'Angular', 'Svelte']"
                label="Framework" variant="outlined" density="comfortable" hide-details
                style="max-width: 200px"></v-select>
              <v-btn color="primary" variant="tonal" class="ml-2" @click="addSnippets = true">
                <v-icon>mdi-plus</v-icon>
                Add Snippet
              </v-btn>
            </div>

            <v-row>
              <v-col v-for="(snippet, index) in filteredPersonalSnippets" :key="index" cols="12" sm="6" lg="4">
                <v-card class="mx-auto snippet-card" max-width="400" elevation="2" hover>
                  <NuxtLink :to="`/snippetsView?id=${snippet.id}&type=personal`" class="text-decoration-none">
                    <v-img :src="snippet.img" height="200" cover class="bg-grey-lighten-2">
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center" class="fill-height">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </NuxtLink>

                  <v-card-title class="text-h6 font-weight-bold">
                    {{ snippet.title }}
                  </v-card-title>

                  <v-card-text>
                    <p class="text-body-1 mb-2">{{ snippet.description }}</p>
                    <v-chip color="primary" variant="outlined" size="small" class="mb-2">
                      {{ snippet.framework }}
                    </v-chip>
                    <div class="d-flex align-center text-grey">
                      <v-icon size="small" class="mr-2">mdi-account</v-icon>
                      <span>{{ snippet.username }}</span>
                      <v-spacer></v-spacer>
                      <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                      <span class="text-caption">{{ formatDisplayDate(snippet) }}</span>
                    </div>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn variant="text" color="error" @click.stop="confirmDelete(snippet)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" :to="`/snippetsView?id=${snippet.id}&type=personal`">
                      View Details
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col v-if="filteredPersonalSnippets.length === 0" cols="12">
                <v-alert type="info" variant="tonal">
                  You don't have any snippets yet. Create a new one!
                </v-alert>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="Favorites">
            <div class="d-flex align-center mb-4">
              <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search in my favorites"
                variant="outlined" density="comfortable" hide-details class="mr-4"></v-text-field>
              <v-select v-model="frameworkFilter" :items="['All', 'Vue.js 3', 'Nuxt 3', 'React', 'Angular', 'Svelte']"
                label="Framework" variant="outlined" density="comfortable" hide-details
                style="max-width: 200px"></v-select>
            </div>

            <v-row>
              <v-col v-for="(favorite, index) in filteredFavoriteSnippets" :key="index" cols="12" sm="6" lg="4">
                <v-card class="mx-auto snippet-card" max-width="400" elevation="2" hover>
                  <NuxtLink :to="`/snippetsView?id=${favorite.id}&type=${(favorite as any).sourceType || 'world'}`"
                    class="text-decoration-none">
                    <v-img :src="favorite.img" height="200" cover class="bg-grey-lighten-2">
                      <template v-slot:placeholder>
                        <v-row align="center" justify="center" class="fill-height">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </NuxtLink>

                  <v-card-title class="text-h6 font-weight-bold">
                    {{ favorite.title }}
                  </v-card-title>

                  <v-card-text>
                    <p class="text-body-1 mb-2">{{ favorite.description }}</p>
                    <v-chip color="primary" variant="outlined" size="small" class="mb-2">
                      {{ favorite.framework }}
                    </v-chip>
                    <div class="d-flex align-center text-grey">
                      <v-icon size="small" class="mr-2">mdi-account</v-icon>
                      <span>{{ favorite.username }}</span>
                      <v-spacer></v-spacer>
                      <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                      <span class="text-caption">{{ formatDisplayDate(favorite) }}</span>
                    </div>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn variant="text" color="yellow" @click.stop="toggleFavorite(favorite, 'world')">
                      <v-icon>mdi-bookmark</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary"
                      :to="`/snippetsView?id=${favorite.id}&type=${(favorite as any).sourceType || 'world'}`">
                      View Details
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col v-if="filteredFavoriteSnippets.length === 0" cols="12">
                <v-alert type="info" variant="tonal">
                  You don't have any favorite snippets yet.
                </v-alert>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>

    <v-dialog v-model="addSnippets" max-width="700" persistent>
      <v-card>
        <v-toolbar color="primary" class="text-white">
          <v-toolbar-title>Create a New Snippet</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addSnippets = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-4">
          <v-form>
            <v-row>
              <v-col cols="12">
                <div class="d-flex gap-4">
                  <v-switch v-model="newSnippet.publishWorld as string" label="Publish Globally" color="primary"
                    hide-details></v-switch>
                  <v-switch v-model="newSnippet.publishPersonal as string" label="Save as Personal" color="primary"
                    hide-details></v-switch>
                </div>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="newSnippet.title" label="Title" variant="outlined"
                  placeholder="Enter snippet title" prepend-inner-icon="mdi-format-title"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="newSnippet.description" label="Description" variant="outlined" rows="3"
                  placeholder="Describe your snippet" prepend-inner-icon="mdi-text"></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="newSnippet.framework" :items="['React', 'Vue.js 3', 'Nuxt 3', 'Angular', 'Nest.js']"
                  label="Framework" variant="outlined" prepend-inner-icon="mdi-code-tags"
                  @update:model-value="updateDefaultImage"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input v-model="newSnippet.imgFile as File" label="Cover Image" variant="outlined"
                  prepend-icon="mdi-image" accept="image/*" show-size></v-file-input>
              </v-col>

              <v-col cols="12">
                <div class="default-images-section">
                  <div class="text-subtitle-1 mb-2">Suggested icons</div>
                  <div class="d-flex flex-wrap gap-2">
                    <v-card v-for="(iconData, index) in defaultImages" :key="index" width="100" height="100"
                      class="default-image-card mr-6" @click="selectDefaultImage(iconData)"
                      :class="{ 'selected-image': selectedDefaultImage === iconData }"
                      :style="{ background: `linear-gradient(${iconData.gradient})` }">
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon :icon="iconData.icon" size="48" color="white" class="icon-shadow"></v-icon>
                      </div>
                      <v-overlay activator="parent" contained class="align-center justify-center">
                        <v-btn icon color="white" variant="text" density="comfortable" size="small">
                          <v-icon>{{ selectedDefaultImage === iconData ? 'mdi-check-circle' :
                            'mdi-arrow-up-bold-circle-outline' }}</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-card>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="addSnippets = false" class="mr-2">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="sendSnippets" :loading="isLoading">
            Create Snippet
            <v-icon end>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon start>mdi-alert-circle</v-icon>
          delete confirmation
        </v-card-title>
        <v-card-text class="pt-4">
          <p>Are you sure you want to delete this snippet? This action is irreversible.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteSnippet">
            <v-icon start>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <snackbar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :icon="snackbarIcon" :timeout="2000" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Snippets - StackUnity',
  meta: [
    { name: 'description', content: 'Deploy and use numerous snippets across the world' },
    { name: 'robots', content: 'index,follow' },
    { name: 'author', content: 'StackUnity' },
    { name: 'keywords', content: 'snippets, code snippets, code, snippets, deploy, use, across, world' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Snippets - StackUnity' },
    { name: 'og:description', content: 'Deploy and use numerous snippets across the world' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/snippets' }
  ]
})

const userStore = useUserStore();
const tab = ref('World');
const addSnippets = ref(false);
const searchQuery = ref('');
const frameworkFilter = ref('All');
const isLoading = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check-circle');
const deleteDialog = ref(false);
const snippetToDelete = ref<any>(null);

interface Snippet {
  id?: number;
  publishWorld: string;
  publishPersonal: string;
  title: string;
  description: string;
  username: string;
  framework: string;
  img: string | null;
  imgFile: File | null;
  content?: string;
  snippet_date?: string;
  date?: string;
  like?: number;
  favoris?: number;
  isFavorite?: boolean;
  sourceType?: string;
}

interface IconData {
  icon: string;
  color: string;
  gradient: string;
}

const frameworkImageMap: Record<string, IconData[]> = {
  'React': [
    { icon: 'mdi-react', color: '#61DAFB', gradient: 'to bottom right, #61DAFB, #2D8BBA' },
    { icon: 'mdi-code-json', color: '#61DAFB', gradient: 'to bottom right, #61DAFB, #2D8BBA' },
    { icon: 'mdi-language-javascript', color: '#61DAFB', gradient: 'to bottom right, #61DAFB, #2D8BBA' },
    { icon: 'mdi-application-brackets', color: '#61DAFB', gradient: 'to bottom right, #61DAFB, #2D8BBA' }
  ],
  'Vue.js 3': [
    { icon: 'mdi-vuejs', color: '#42B883', gradient: 'to bottom right, #42B883, #347474' },
    { icon: 'mdi-code-tags', color: '#42B883', gradient: 'to bottom right, #42B883, #347474' },
    { icon: 'mdi-language-typescript', color: '#42B883', gradient: 'to bottom right, #42B883, #347474' },
    { icon: 'mdi-application-variable', color: '#42B883', gradient: 'to bottom right, #42B883, #347474' }
  ],
  'Nuxt 3': [
    { icon: 'mdi-nuxt', color: '#00DC82', gradient: 'to bottom right, #00DC82, #018B52' },
    { icon: 'mdi-code-braces', color: '#00DC82', gradient: 'to bottom right, #00DC82, #018B52' },
    { icon: 'mdi-server', color: '#00DC82', gradient: 'to bottom right, #00DC82, #018B52' },
    { icon: 'mdi-application-settings', color: '#00DC82', gradient: 'to bottom right, #00DC82, #018B52' }
  ],
  'Angular': [
    { icon: 'mdi-angular', color: '#DD0031', gradient: 'to bottom right, #DD0031, #C3002F' },
    { icon: 'mdi-language-typescript', color: '#DD0031', gradient: 'to bottom right, #DD0031, #C3002F' },
    { icon: 'mdi-code-array', color: '#DD0031', gradient: 'to bottom right, #DD0031, #C3002F' },
    { icon: 'mdi-application-cog', color: '#DD0031', gradient: 'to bottom right, #DD0031, #C3002F' }
  ],
  'Nest.js': [
    { icon: 'mdi-nodejs', color: '#E0234E', gradient: 'to bottom right, #E0234E, #C31B41' },
    { icon: 'mdi-database', color: '#E0234E', gradient: 'to bottom right, #E0234E, #C31B41' },
    { icon: 'mdi-api', color: '#E0234E', gradient: 'to bottom right, #E0234E, #C31B41' },
    { icon: 'mdi-server-security', color: '#E0234E', gradient: 'to bottom right, #E0234E, #C31B41' }
  ],
  'default': [
    { icon: 'mdi-code-tags', color: '#607D8B', gradient: 'to bottom right, #607D8B, #455A64' },
    { icon: 'mdi-code-braces-box', color: '#607D8B', gradient: 'to bottom right, #607D8B, #455A64' },
    { icon: 'mdi-application', color: '#607D8B', gradient: 'to bottom right, #607D8B, #455A64' },
    { icon: 'mdi-code-greater-than', color: '#607D8B', gradient: 'to bottom right, #607D8B, #455A64' }
  ]
};

const defaultImages = ref<IconData[]>([]);
const selectedDefaultImage = ref<IconData | null>(null);

const newSnippet = ref<Snippet>({
  publishWorld: '',
  publishPersonal: '',
  title: '',
  description: '',
  username: '',
  framework: '',
  img: '',
  imgFile: null,
  date: '',
  like: 0,
  favoris: 0,
  isFavorite: false
});

const updateDefaultImage = () => {
  const framework = newSnippet.value.framework;
  if (framework && framework in frameworkImageMap) {
    defaultImages.value = frameworkImageMap[framework];
  } else {
    defaultImages.value = frameworkImageMap['default'];
  }
  selectedDefaultImage.value = null;
};

const selectDefaultImage = async (iconData: IconData) => {
  selectedDefaultImage.value = iconData;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      const gradientColors = iconData.gradient.match(/#[A-Fa-f0-9]{6}/g);

      if (gradientColors && gradientColors.length >= 2) {
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);

        ctx.fillStyle = 'white';
        ctx.font = '200px "Material Design Icons"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        await document.fonts.load('200px "Material Design Icons"');

        const mdiIconsMap: Record<string, string> = {
          'mdi-react': 'F0708',
          'mdi-vuejs': 'F0844',
          'mdi-nuxt': 'F1106',
          'mdi-angular': 'F0077',
          'mdi-nodejs': 'F0399',
          'mdi-code-tags': 'F0174',
          'mdi-code-braces': 'F0101',
          'mdi-code-array': 'F0168',
          'mdi-code-json': 'F0626',
          'mdi-language-javascript': 'F0627',
          'mdi-language-typescript': 'F06E6',
          'mdi-database': 'F01BC',
          'mdi-api': 'F0C70',
          'mdi-server': 'F048B',
          'mdi-server-security': 'F048C',
          'mdi-application': 'F0614',
          'mdi-application-brackets': 'F0C8B',
          'mdi-application-cog': 'F0675',
          'mdi-application-settings': 'F0B60',
          'mdi-application-variable': 'F0C8C',
          'mdi-code-braces-box': 'F10D6',
          'mdi-code-greater-than': 'F0174'
        };

        const iconCode = mdiIconsMap[iconData.icon] || '0F0174';
        const iconChar = String.fromCodePoint(parseInt(iconCode, 16));
        ctx.fillText(iconChar, 200, 200);

        const timestamp = new Date().getTime();
        const fileName = `icon-${iconData.icon.replace('mdi-', '')}-${timestamp}.png`;

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], fileName, {
              type: 'image/png',
              lastModified: Date.now()
            });

            newSnippet.value.imgFile = file;

            snackbarText.value = "Icône sélectionnée";
            snackbarColor.value = "success";
            snackbarIcon.value = "mdi-check-circle";
            snackbar.value = true;
          }
        }, 'image/png', 1.0);
      } else {
        throw new Error("Format de gradient invalide");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'icône:", error);
    snackbarText.value = "Erreur lors de la sélection de l'icône";
    snackbarColor.value = "error";
    snackbarIcon.value = "mdi-alert-circle";
    snackbar.value = true;
  }
};

const filteredWorldSnippets = computed(() => {
  let snippets = userStore.worldSnippets ? userStore.worldSnippets.slice(0, 30) : [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    snippets = snippets.filter(snippet =>
      (snippet.title?.toLowerCase() || '').includes(query) ||
      (snippet.description?.toLowerCase() || '').includes(query)
    );
  }

  if (frameworkFilter.value !== 'All') {
    snippets = snippets.filter(snippet => snippet.framework === frameworkFilter.value);
  }

  return snippets;
});

const filteredPersonalSnippets = computed(() => {
  let snippets = userStore.personalSnippets ? userStore.personalSnippets.slice(0, 30) : [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    snippets = snippets.filter(snippet =>
      (snippet.title?.toLowerCase() || '').includes(query) ||
      (snippet.description?.toLowerCase() || '').includes(query)
    );
  }

  if (frameworkFilter.value !== 'All') {
    snippets = snippets.filter(snippet => snippet.framework === frameworkFilter.value);
  }

  return snippets;
});

const filteredFavoriteSnippets = computed(() => {
  const favoriteIds = userStore.favoritesSnippets.map(fav => fav.snippet_id);

  let worldSnippets = userStore.worldSnippets ? userStore.worldSnippets.slice(0, 15) : [];
  let personalSnippets = userStore.personalSnippets ? userStore.personalSnippets.slice(0, 15) : [];

  worldSnippets = worldSnippets.filter(snippet => favoriteIds.includes(snippet.id));
  personalSnippets = personalSnippets.filter(snippet => favoriteIds.includes(snippet.id));

  let snippets = [...worldSnippets, ...personalSnippets];

  snippets.forEach(snippet => {
    const enhancedSnippet = snippet as typeof snippet & { isFavorite: boolean; sourceType: string };
    enhancedSnippet.isFavorite = true;

    if (worldSnippets.includes(snippet)) {
      enhancedSnippet.sourceType = 'world';
    } else {
      enhancedSnippet.sourceType = 'personal';
    }
  });

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    snippets = snippets.filter(snippet =>
      (snippet.title?.toLowerCase() || '').includes(query) ||
      (snippet.description?.toLowerCase() || '').includes(query)
    );
  }

  if (frameworkFilter.value !== 'All') {
    snippets = snippets.filter(snippet => snippet.framework === frameworkFilter.value);
  }

  return snippets.slice(0, 30);
});

const sendSnippets = async () => {
  try {
    isLoading.value = true;

    if (!newSnippet.value.title || !newSnippet.value.description || !newSnippet.value.framework || !newSnippet.value.imgFile) {
      snackbarText.value = "Please fill in all required fields";
      snackbarColor.value = "error";
      snackbarIcon.value = "mdi-alert-circle";
      snackbar.value = true;
      return;
    }

    if (!newSnippet.value.publishWorld && !newSnippet.value.publishPersonal) {
      snackbarText.value = "Please select a publish option";
      snackbarColor.value = "error";
      snackbarIcon.value = "mdi-alert-circle";
      snackbar.value = true;
      return;
    }

    await userStore.addSnippets(
      newSnippet.value.title,
      newSnippet.value.description,
      newSnippet.value.framework,
      newSnippet.value.imgFile,
      newSnippet.value.publishWorld,
      newSnippet.value.publishPersonal
    );

    snackbarText.value = "Snippet created successfully";
    snackbarColor.value = "success";
    snackbarIcon.value = "mdi-check-circle";
    snackbar.value = true;
    addSnippets.value = false;

    await userStore.loadSnippets();

    newSnippet.value = {
      publishWorld: '',
      publishPersonal: '',
      title: '',
      description: '',
      username: '',
      framework: '',
      img: '',
      imgFile: null,
      date: '',
      like: 0,
      favoris: 0,
      isFavorite: false
    };
    selectedDefaultImage.value = null;
  } catch (error: any) {
    console.error('Erreur lors de la création du snippet:', error);
    snackbarText.value = error.message || "Erreur lors de la création du snippet";
    snackbarColor.value = "error";
    snackbarIcon.value = "mdi-alert-circle";
    snackbar.value = true;
  } finally {
    isLoading.value = false;
  }
};

const toggleFavorite = async (snippet: any, type: string) => {
  snippet.isFavorite = !snippet.isFavorite;

  try {
    if (snippet.isFavorite) {
      await userStore.addFavorite(snippet.id, type as 'world' | 'personal');
      snackbarText.value = "Added to favorites";
    } else {
      await userStore.removeFavorite(snippet.id);
      snackbarText.value = "Removed from favorites";
    }
    snackbarColor.value = "success";
    snackbar.value = true;

    await userStore.loadSnippets();
  } catch (error) {
    console.error("Erreur lors de la mise à jour des favoris:", error);
    snippet.isFavorite = !snippet.isFavorite;
    snackbarText.value = "Erreur lors de la mise à jour des favoris";
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const confirmDelete = (snippet: any) => {
  snippetToDelete.value = snippet;
  deleteDialog.value = true;
};

const deleteSnippet = async () => {
  try {
    if (snippetToDelete.value) {
      await userStore.deleteSnippet(snippetToDelete.value.id, 'personal');
      deleteDialog.value = false;
      snackbarText.value = "Snippet deleted successfully";
      snackbarColor.value = "success";
      snackbar.value = true;
      await userStore.loadSnippets();
    }
  } catch (err: any) {
    console.error("Error during deletion:", err.message, err.stack);
    snackbarText.value = "Error during deletion";
    snackbarColor.value = "error";
    snackbar.value = true;
  }
};

const formatDisplayDate = (snippet: any) => {
  if (snippet.snippet_date) {
    return userStore.formatDate(snippet.snippet_date);
  } else if (snippet.date) {
    return userStore.formatDate(snippet.date);
  } else {
    return 'Date not available';
  }
};

onMounted(async () => {
  await userStore.loadSnippets();
  console.log("Snippets loaded successfully");
  defaultImages.value = frameworkImageMap['default'];
});
</script>

<style scoped>
.snippet-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.snippet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.v-card-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-card-text p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 48px;
}

:deep(.dark-theme) {
  .v-app-bar {
    background-color: #1e1e1e !important;
  }

  .v-main {
    background-color: #121212 !important;
  }

  .v-card {
    background-color: #1e1e1e !important;
    color: #e0e0e0 !important;
  }

  .v-card-text {
    color: #bdbdbd !important;
  }

  .v-divider {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }

  .text-grey {
    color: #9e9e9e !important;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-col {
  animation: fadeIn 0.5s ease forwards;
}

.v-col:nth-child(2) {
  animation-delay: 0.1s;
}

.v-col:nth-child(3) {
  animation-delay: 0.2s;
}

.v-col:nth-child(4) {
  animation-delay: 0.3s;
}

.v-col:nth-child(5) {
  animation-delay: 0.4s;
}

.v-col:nth-child(6) {
  animation-delay: 0.5s;
}

.default-images-section {
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}

.default-image-card {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  overflow: hidden;
  position: relative;
}

.default-image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.selected-image {
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.icon-shadow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}
</style>