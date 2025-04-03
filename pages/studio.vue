<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-2 pa-sm-4">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-4">
          <v-select v-model="selectedComponent" :items="userStore.user.isPremium ? componentsList : ['Card (v-card)']"
            label="Select Component" variant="outlined" density="comfortable" class="mb-2 mb-sm-0 mr-0 mr-sm-4"
            style="max-width: 300px" hide-details="auto">
          </v-select>

          <v-btn icon="mdi-dots-vertical" variant="text" @click="openSaveTemplateDialog = true"
            class="mt-2 mt-sm-0"></v-btn>
        </div>

        <StudioEditor v-if="selectedComponent === 'Card (v-card)'" :initialContent="editorContent"
          @update:content="updateEditorContent" class="fill-height studio-editor" />

        <div v-else-if="selectedComponent === 'Nav (v-navigation-drawer)' && userStore.user.isPremium"
          class="studio-editor">
          <StudioNav :initialContent="editorContent" @update:content="updateEditorContent" class="fill-height" />
        </div>

        <div v-else-if="selectedComponent === 'Timeline (v-timeline)' && userStore.user.isPremium"
          class="studio-editor">
          <StudioTimeline :initialContent="editorContent" @update:content="updateEditorContent" class="fill-height" />
        </div>

        <div v-else-if="selectedComponent === 'Form (v-form)' && userStore.user.isPremium" class="studio-editor">
          <StudioForm :initialContent="editorContent" @update:content="updateEditorContent" class="fill-height" />
        </div>

        <div v-else-if="selectedComponent === 'Utils (v-date, v-color, v-alerts)' && userStore.user.isPremium"
          class="studio-editor">
          <StudioUtils :initialContent="editorContent" @update:content="updateEditorContent" class="fill-height" />
        </div>

        <div v-else-if="isPremiumComponent(selectedComponent) && !userStore.user.isPremium"
          class="studio-editor d-flex align-center justify-center">
          <PremiumFeature :title="getPremiumComponentTitle(selectedComponent)" icon="mdi-puzzle" type="button"
            featureKey="studioComponents" color="warning" variant="elevated" class="premium-feature-button" />
        </div>

      </v-container>
    </v-main>

    <v-dialog v-model="openSaveTemplateDialog" width="90%" max-width="500" class="template-dialog">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon start>mdi-content-save</v-icon>
          Saved Templates
        </v-card-title>
        <v-card-text class="pa-2 pa-sm-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <v-chip color="primary" variant="tonal" size="small" class="mr-2">
                <v-icon start size="small">mdi-file-document-outline</v-icon>
                Available Templates
              </v-chip>
            </div>
            <v-btn icon="mdi-refresh" variant="text" size="small" @click="refreshTemplates" :loading="isLoading">
              <v-tooltip activator="parent" location="top">Refresh templates</v-tooltip>
            </v-btn>
          </div>

          <div v-if="userStore.studioComponents && userStore.studioComponents.length > 0">
            <v-expansion-panels variant="accordion" bg-color="surface" class="elevation-2">
              <v-expansion-panel v-for="componentType in getUniqueComponentTypes()" :key="componentType">
                <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
                  {{ componentType }}
                  <v-chip size="x-small" color="primary" class="ml-2">
                    {{ getComponentsByType(componentType as string).length }}
                  </v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list lines="two" class="pa-0">
                    <v-list-item v-for="template in getComponentsByType(componentType as string)" :key="template.id"
                      :title="template.name" :subtitle="'Updated on ' + formatDate(template.updated_at)" class="mb-2"
                      @click="applyTemplate(template)">
                      <template v-slot:prepend>
                        <v-avatar size="36" color="primary" variant="tonal" class="mr-3">
                          <v-icon>{{ getComponentIcon(template.component_type) }}</v-icon>
                        </v-avatar>
                      </template>
                      <template v-slot:append>
                        <div class="d-flex">
                          <v-btn icon="mdi-download" color="primary" size="x-small" variant="text"
                            @click.stop="applyTemplate(template)" class="mr-2"></v-btn>
                          <v-btn icon="mdi-delete" color="error" size="x-small" variant="text"
                            @click.stop="confirmDelete(template)"></v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <v-alert v-else type="info" class="mt-4" variant="tonal" border="start" density="comfortable">
            You haven't saved any templates yet. Create a component and save it to appear here.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-2 pa-sm-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="tonal" @click="openSaveTemplateDialog = false" class="mr-2">
            Close
          </v-btn>
          <v-btn color="info" variant="tonal" @click="openSaveTemplateDialog = false">
            <v-icon start>mdi-check</v-icon>
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteConfirmation" width="90%" max-width="500" class="delete-dialog">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Template
        </v-card-title>
        <v-card-text class="pt-3">
          <p>Are you sure you want to delete this template? This action cannot be undone.</p>
          <v-alert density="compact" type="warning" variant="tonal" class="mt-3" icon="mdi-information-outline">
            All components using this template will remain unchanged.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-2 pa-sm-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="deleteConfirmation = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" prepend-icon="mdi-delete" @click="deleteTemplate()">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Snackbar from '../components/snackbar.vue';
import StudioEditor from '../components/studioCard.vue';
import StudioForm from '../components/studioForm.vue';
import StudioNav from '../components/studioNav.vue';
import StudioTimeline from '../components/studioTimeline.vue';
import StudioUtils from '../components/studioUtils.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, navigateTo, useHead } from '#imports';

definePageMeta({
  layout: 'dashboard',
  requiresPremium: false,
})

useHead({
  title: 'Studio - DevUnity',
  meta: [
    { name: 'description', content: 'Create and customize components with the Studio' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Studio - DevUnity' },
    { name: 'og:description', content: 'Create and customize components with the Studio' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
})

const editorContent = ref('')
const deleteConfirmation = ref(false)
const templateToDelete = ref<any>(null)
const componentsList = ref(['Card (v-card)', 'Nav (v-navigation-drawer)', 'Timeline (v-timeline)', 'Form (v-form)', 'Utils (v-date, v-color, v-alerts)'])
const selectedComponent = ref('Card (v-card)')

const isPremiumComponent = (component: string) => {
  return component !== 'Card (v-card)';
};

const getPremiumComponentTitle = (component: string) => {
  switch (component) {
    case 'Nav (v-navigation-drawer)':
      return 'Navigation Components';
    case 'Timeline (v-timeline)':
      return 'Timeline Components';
    case 'Form (v-form)':
      return 'Form Builder';
    case 'Utils (v-date, v-color, v-alerts)':
      return 'UI Utilities';
    default:
      return 'Premium Components';
  }
};

const getComponentIcon = (componentType: string) => {
  switch (componentType) {
    case 'card':
      return 'mdi-card-outline'
    case 'nav':
      return 'mdi-navigation-outline'
    case 'timeline':
      return 'mdi-timeline-outline'
    case 'form':
      return 'mdi-format-align-left'
    case 'utils':
      return 'mdi-hammer-wrench'
  }
}
const openSaveTemplateDialog = ref(false)
const userStore = useUserStore()
const updateEditorContent = (content: string) => {
  editorContent.value = content
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const getUniqueComponentTypes = () => {
  if (!userStore.studioComponents || userStore.studioComponents.length === 0) return [];
  const types = [...new Set(userStore.studioComponents.map(comp => comp.component_type))];
  return types as string[];
}

const getComponentsByType = (type: string) => {
  return userStore.studioComponents.filter(comp => comp.component_type === type)
}

const applyTemplate = (template: any) => {
  if (!template || !template.id) {
    console.error('Invalid template');
    return;
  }

  console.log('Applying template:', template.name, template.id, template.component_type);

  const isPremiumComponent = template.component_type.toLowerCase() !== 'card';
  if (isPremiumComponent && !userStore.user.isPremium) {
    snackbarText.value = 'This template requires premium access';
    snackbarColor.value = 'warning';
    showSnackbar.value = true;
    return;
  }

  switch (template.component_type.toLowerCase()) {
    case 'card':
      selectedComponent.value = 'Card (v-card)'
      break
    case 'nav':
      selectedComponent.value = 'Nav (v-navigation-drawer)'
      break
    case 'timeline':
      selectedComponent.value = 'Timeline (v-timeline)'
      break
    case 'form':
      selectedComponent.value = 'Form (v-form)'
      break
    case 'utils':
      selectedComponent.value = 'Utils (v-date, v-color, v-alerts)'
      break
  }

  console.log('Selected component:', selectedComponent.value);

  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set('templateId', template.id.toString());
    window.history.pushState({}, '', url);
    console.log('URL updated:', url.toString());
  }

  openSaveTemplateDialog.value = false;

  const currentComponent = selectedComponent.value;
  selectedComponent.value = '';

  setTimeout(() => {
    editorContent.value = template.content;
    console.log('Template content loaded, length:', template.content.length);

    selectedComponent.value = currentComponent;
    console.log('Component reactivated');
  }, 50);
}

const confirmDelete = (template: any) => {
  console.log('Confirming delete for template:', template);

  if (!template || !template.id) {
    console.error('Invalid template or missing ID');
    snackbarText.value = 'Cannot delete template: invalid data';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
    return;
  }

  templateToDelete.value = {
    id: template.id,
    name: template.name,
    component_type: template.component_type
  };

  console.log('Template to delete set to:', templateToDelete.value);
  deleteConfirmation.value = true;
}

const deleteTemplate = async () => {
  try {
    if (!templateToDelete.value || !templateToDelete.value.id) {
      console.error('Invalid template or missing ID');
      snackbarText.value = 'Error: invalid template';
      snackbarColor.value = 'error';
      showSnackbar.value = true;
      return;
    }

    const templateId = templateToDelete.value.id;
    console.log('Deleting template:', templateId);

    const response = await userStore.removeTemplate(templateId);
    if (!response || !response.ok) {
      throw new Error('Failed to delete template');
    }

    deleteConfirmation.value = false;
    snackbarText.value = 'Template deleted successfully';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
    await userStore.loadStudioComponents();
  } catch (error) {
    console.error('Error deleting template:', error);
    snackbarText.value = 'Error deleting template';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    templateToDelete.value = null;
    deleteConfirmation.value = false;
  }
}

const loadTemplateFromUrl = async () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (templateId) {
    console.log('Template ID found in URL:', templateId);

    if (!userStore.studioComponents || userStore.studioComponents.length === 0) {
      await userStore.loadStudioComponents();
    }

    const template = userStore.studioComponents.find(t => t.id === parseInt(templateId));

    if (template) {
      console.log('Template found:', template);
      applyTemplateWithoutUrlChange(template);
    } else {
      console.error(`Template with ID ${templateId} not found`);
    }
  }
}

const applyTemplateWithoutUrlChange = (template: any) => {
  if (!template) return;

  switch (template.component_type.toLowerCase()) {
    case 'card':
      selectedComponent.value = 'Card (v-card)'
      break
    case 'nav':
      selectedComponent.value = 'Nav (v-navigation-drawer)'
      break
    case 'timeline':
      selectedComponent.value = 'Timeline (v-timeline)'
      break
    case 'form':
      selectedComponent.value = 'Form (v-form)'
      break
    case 'utils':
      selectedComponent.value = 'Utils (v-date, v-color, v-alerts)'
      break
  }

  openSaveTemplateDialog.value = false;

  const currentComponent = selectedComponent.value;
  selectedComponent.value = '';

  setTimeout(() => {
    editorContent.value = template.content;

    selectedComponent.value = currentComponent;
  }, 50);
}

onMounted(loadTemplateFromUrl)

const isLoading = ref(false);
const snackbarText = ref<string>('');
const snackbarColor = ref<'success' | 'error' | 'warning'>('success');
const showSnackbar = ref(false);

const refreshTemplates = async () => {
  try {
    isLoading.value = true;
    await userStore.loadStudioComponents();
    snackbarText.value = 'Templates refreshed successfully';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error) {
    console.error('Error refreshing templates:', error);
    snackbarText.value = 'Error refreshing templates';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!userStore.isAuthenticated) {
      console.log('[STUDIO] Utilisateur non authentifié, redirection...');
      navigateTo('/login');
      return;
    }

    await userStore.loadStudioComponents();
  } catch (error: any) {
    console.error('Error loading components:', error);
    snackbarText.value = error?.message || 'Error loading components';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.studio-editor {
  height: calc(100vh - 120px);
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--v-surface-variant-base);
}

@media (max-width: 600px) {
  .studio-editor {
    height: calc(100vh - 160px);
    min-height: 300px;
  }
}

.template-dialog :deep(.v-card) {
  border-radius: 12px;
}

.delete-dialog :deep(.v-card) {
  border-radius: 12px;
}

@media (max-width: 600px) {
  .template-dialog :deep(.v-card),
  .delete-dialog :deep(.v-card) {
    margin: 8px;
  }
}

.notifications-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
}

.logo-icon {
  filter: drop-shadow(0 0 8px var(--v-primary-base));
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    filter: drop-shadow(0 0 5px var(--v-primary-base));
  }
  50% {
    filter: drop-shadow(0 0 15px var(--v-primary-base));
  }
  100% {
    filter: drop-shadow(0 0 5px var(--v-primary-base));
  }
}

.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.premium-feature-button {
  padding: 16px 32px;
  font-size: 1.2rem;
  box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.premium-feature-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(255, 215, 0, 0.4);
}
</style>
