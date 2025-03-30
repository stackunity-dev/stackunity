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
                    <v-img :src="snippet.img || '/placeholder-image.jpg'" height="200" cover class="bg-grey-lighten-2">
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
                      <v-avatar size="24" class="mr-2">
                        <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="avatar"></v-img>
                      </v-avatar>
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
            </div>

            <v-row>
              <v-col v-for="(snippet, index) in filteredPersonalSnippets" :key="index" cols="12" sm="6" lg="4">
                <v-card class="mx-auto snippet-card" max-width="400" elevation="2" hover>
                  <NuxtLink :to="`/snippetsView?id=${snippet.id}&type=personal`" class="text-decoration-none">
                    <v-img :src="snippet.img || '/placeholder-image.jpg'" height="200" cover class="bg-grey-lighten-2">
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
                      <v-avatar size="24" class="mr-2">
                        <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="avatar"></v-img>
                      </v-avatar>
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
                    <v-img :src="favorite.img || '/placeholder-image.jpg'" height="200" cover class="bg-grey-lighten-2">
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
                      <v-avatar size="24" class="mr-2">
                        <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="avatar"></v-img>
                      </v-avatar>
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
                  label="Framework" variant="outlined" prepend-inner-icon="mdi-code-tags"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input v-model="newSnippet.imgFile as File" label="Cover Image" variant="outlined"
                  prepend-icon="mdi-image" accept="image/*" show-size></v-file-input>
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
          Confirmation de suppression
        </v-card-title>
        <v-card-text class="pt-4">
          <p>Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" @click="deleteSnippet">
            <v-icon start>mdi-delete</v-icon>
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :icon="snackbarIcon" :timeout="2000" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Snackbar from '~/components/snackbar.vue';
import { useUserStore } from '~/stores/userStore';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Snippets',
  meta: [
    { name: 'description', content: 'Deploy and use numerous snippets across the world' },
    { name: 'robots', content: 'index,follow' },
    { name: 'author', content: 'DevUnity' },
    { name: 'keywords', content: 'snippets, code snippets, code, snippets, deploy, use, across, world' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Snippets' },
    { name: 'og:description', content: 'Deploy and use numerous snippets across the world' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
})

const userStore = useUserStore();
const tab = ref('World');
const addSnippets = ref(false);
const isFavorite = ref(false);
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
    await userStore.addSnippets(
      newSnippet.value.title,
      newSnippet.value.description,
      newSnippet.value.framework,
      newSnippet.value.imgFile!,
      newSnippet.value.publishWorld,
      newSnippet.value.publishPersonal
    );
    await userStore.loadSnippets();
    addSnippets.value = false;

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

    snackbarText.value = "Snippet créé avec succès";
    snackbarColor.value = "success";
    snackbar.value = true;
  } catch (err: any) {
    console.error("Error adding snippet:", err.message, err.stack);
    snackbarText.value = "Erreur lors de la création du snippet";
    snackbarColor.value = "error";
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
      snackbarText.value = "Ajouté aux favoris";
    } else {
      await userStore.removeFavorite(snippet.id);
      snackbarText.value = "Retiré des favoris";
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
      snackbarText.value = "Snippet supprimé avec succès";
      snackbarColor.value = "success";
      snackbar.value = true;
    }
  } catch (err: any) {
    console.error("Error during deletion:", err.message, err.stack);
    snackbarText.value = "Erreur lors de la suppression du snippet";
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
    return 'Date non disponible';
  }
};

onMounted(async () => {
  await userStore.loadSnippets();
  console.log("Snippets chargés avec succès");
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
</style>