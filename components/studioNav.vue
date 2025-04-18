<template>
  <v-app>
    <v-main class="w-100 h-100 overflow-hidden d-flex">
      <div class="control-panel" style="width: 350px;">
        <v-card flat class="fill-height">
          <div class="px-4 py-2 d-flex align-center">
            <v-chip color="success" prepend-icon="mdi-vuejs" size="small" class="mr-2 px-4 py-2">Vue.js</v-chip>
            <v-chip color="info" prepend-icon="mdi-vuetify" size="small" class="mr-2 px-4 py-2">Vuetify</v-chip>
          </div>

          <v-tabs v-model="tab" color="primary" align-tabs="center" class="px-4">
            <v-tab value="content">Content</v-tab>
            <v-tab value="style">Style</v-tab>
            <v-tab value="actions">Actions</v-tab>
            <v-tab value="templates">Template</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="tab">
              <v-window-item value="content">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-view-dashboard-outline</v-icon>
                    <span class="text-h6">App Bar</span>
                  </div>

                  <v-switch v-model="navProperties.addAppBar" color="primary" label="Add app bar" hide-details
                    class="mb-4" />

                  <div v-if="navProperties.addAppBar">
                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-2 d-block">App Bar Color</label>
                      <v-btn-toggle v-model="navProperties.appBarColor" mandatory density="comfortable" class="mb-4">
                        <v-btn v-for="(color, index) in appBarColors" :key="color.value" :value="index"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>

                    <v-card class="mb-4 pa-3">
                      <div v-for="(item, index) in appBar" :key="index" class="d-flex align-center mb-2">
                        <v-text-field v-model="item.title" label="Title" variant="outlined" density="compact"
                          prepend-inner-icon="mdi-format-title" class="mr-2" placeholder="Home" />
                        <v-select v-model="item.icon" :items="navIcons" label="Icon" variant="outlined"
                          density="compact" prepend-inner-icon="mdi-pencil" class="mr-2" placeholder="mdi-home">
                          <template v-slot:item="{ item, props }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon :icon="item.raw"></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeAppBar(index)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addAppBar"
                        class="mt-2">
                        Add app bar item
                      </v-btn>
                    </v-card>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
                    <span class="text-h6">Navigation Items</span>
                  </div>

                  <v-switch v-model="navProperties.showSubheader" color="primary" label="Add subheaders" hide-details
                    class="mb-4" />

                  <div v-if="navProperties.showSubheader">
                    <v-card class="mb-4 pa-3">
                      <div v-for="(item, index) in navHeader" :key="index" class="d-flex align-center mb-2">
                        <v-text-field v-model="item.title" label="Subheader text" variant="outlined" density="compact"
                          prepend-inner-icon="mdi-format-header-3" class="mr-2" placeholder="Section" />
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeHeader(index)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addHeader"
                        class="mt-2">
                        Add subheader
                      </v-btn>
                    </v-card>
                  </div>

                  <v-switch v-model="navProperties.showIconItems" color="primary" label="Add navigation items"
                    hide-details class="mb-4" />

                  <div v-if="navProperties.showIconItems">
                    <v-card class="mb-4 pa-3">
                      <div v-for="(item, index) in navItems" :key="index" class="d-flex align-center mb-2">
                        <v-select v-model="item.icon" :items="navIcons" label="Icon" variant="outlined"
                          density="compact" prepend-inner-icon="mdi-emoticon" class="mr-2" placeholder="mdi-home">
                          <template v-slot:item="{ item, props }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon :icon="item.raw"></v-icon>
                              </template>
                              <v-list-item-title>{{ item.raw.replace('mdi-', '') }}</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-select>
                        <v-text-field v-model="item.title" label="Title" variant="outlined" density="compact"
                          prepend-inner-icon="mdi-format-title" class="mr-2" placeholder="Home" />
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeItem(index)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addIconItem"
                        class="mt-2">
                        Add navigation item
                      </v-btn>
                    </v-card>
                  </div>

                  <v-text-field v-model="navProperties.image" label="Background image URL" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-image" class="mb-4">
                    <template v-slot:append-inner>
                      <v-btn icon="mdi-refresh" variant="text" size="small" @click="navProperties.image = ''"></v-btn>
                    </template>
                  </v-text-field>

                  <div class="d-flex flex-wrap mb-4">
                    <v-chip-group>
                      <v-chip size="small"
                        @click="navProperties.image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'">Nature</v-chip>
                      <v-chip size="small"
                        @click="navProperties.image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'">Ocean</v-chip>
                      <v-chip size="small"
                        @click="navProperties.image = 'https://images.unsplash.com/photo-1519681393784-d120267933ba'">Mountain</v-chip>
                    </v-chip-group>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="style">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                    <span class="text-h6">Appearance</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2 d-block">Color</label>
                    <v-btn-toggle mandatory density="comfortable" selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color" :value="color"
                        :color="color !== 'default' ? color : undefined" size="small" variant="tonal" width="40"
                        height="40" class="ma-1" @click="navProperties.color = color">
                        <v-icon v-if="color === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Elevation</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-box-shadow</v-icon>
                      <v-slider v-model="navProperties.elevation" min="0" max="24" step="1" thumb-label
                        class="mx-2"></v-slider>
                      <v-chip size="x-small">{{ navProperties.elevation }}</v-chip>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Width</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-arrow-expand-horizontal</v-icon>
                      <v-slider v-model="navProperties.width" min="180" max="400" step="10" thumb-label
                        class="mx-2"></v-slider>
                      <v-chip size="x-small">{{ navProperties.width }}px</v-chip>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-monitor-dashboard</v-icon>
                    <span class="text-h6">Layout & Position</span>
                  </div>

                  <div class="mb-4">
                    <v-btn-toggle v-model="navProperties.location" mandatory density="comfortable" class="mb-3">
                      <v-btn value="left" prepend-icon="mdi-format-horizontal-align-left">Left</v-btn>
                      <v-btn value="right" prepend-icon="mdi-format-horizontal-align-right">Right</v-btn>
                    </v-btn-toggle>
                  </div>

                  <v-switch v-model="navProperties.rounded" color="primary" label="Rounded corners" hide-details
                    class="mb-2" />
                  <v-switch v-model="navProperties.floating" color="primary" label="Floating" hide-details
                    class="mb-2" />
                  <v-switch v-model="navProperties.rail" color="primary" label="Rail mode" hide-details class="mb-2" />
                  <v-switch v-model="navProperties.expandOnHover" color="primary" label="Expand on hover" hide-details
                    class="mb-2" />
                  <v-switch v-model="navProperties.permanent" color="primary" label="Permanent" hide-details
                    class="mb-2" />

                </div>
              </v-window-item>

              <v-window-item value="actions">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
                    <span class="text-h6">Behavior</span>
                  </div>

                  <v-switch v-model="navProperties.clipped" color="primary" label="Clipped" hide-details class="mb-2" />
                  <v-switch v-model="navProperties.mobile" color="primary" label="Mobile" hide-details class="mb-2" />
                  <v-switch v-model="navProperties.temporary" color="primary" label="Temporary" hide-details
                    class="mb-4" />

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-link</v-icon>
                    <span class="text-h6">Actions & Links</span>
                  </div>

                  <v-switch v-model="navProperties.showLinkItem" color="primary" label="Add custom link" hide-details
                    class="mb-4" />

                  <v-card v-if="navProperties.showLinkItem" class="mb-4 pa-3">
                    <v-select v-model="navProperties.linkIcon" :items="navIcons" label="Link icon" variant="outlined"
                      density="comfortable" clearable prepend-inner-icon="mdi-pencil" class="mb-3">
                      <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-icon :icon="item.raw"></v-icon>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>

                    <v-text-field v-model="navProperties.linkTitle" label="Link title" variant="outlined"
                      density="comfortable" clearable prepend-inner-icon="mdi-format-title" class="mb-3" />

                    <v-text-field v-model="navProperties.linkUrl" label="Link URL" variant="outlined"
                      density="comfortable" clearable prepend-inner-icon="mdi-link-variant" class="mb-3" />

                    <v-switch v-model="navProperties.linkExternal" color="primary" label="Open in new tab" hide-details
                      class="mb-2" />
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="templates">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-h6">Navigation Templates</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Apply pre-defined templates or save your own</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">Choose a pre-defined template to quickly create common navigation layouts.
                  </p>

                  <v-card class="mb-4">
                    <v-list>
                      <v-list-item @click="applyTemplate('dashboard')" prepend-icon="mdi-view-dashboard"
                        title="Dashboard" subtitle="Admin dashboard navigation"></v-list-item>
                      <v-list-item @click="applyTemplate('ecommerce')" prepend-icon="mdi-shopping" title="E-commerce"
                        subtitle="Online store navigation"></v-list-item>
                      <v-list-item @click="applyTemplate('social')" prepend-icon="mdi-account-group"
                        title="Social Network" subtitle="Social media navigation"></v-list-item>
                      <v-list-item @click="applyTemplate('admin')" prepend-icon="mdi-shield-account" title="Admin Panel"
                        subtitle="Advanced admin navigation"></v-list-item>
                    </v-list>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    Applying a template will replace your current navigation settings.
                  </v-alert>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
                    <span class="text-h6">Save Current Navigation</span>
                  </div>

                  <v-text-field v-model="customTemplateName" label="Template Name" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-tag" class="mb-4"></v-text-field>

                  <v-btn color="primary" prepend-icon="mdi-content-save" block @click="saveCurrentTemplate">
                    Save Current Navigation as Template
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <div class="preview-area pa-4 d-flex flex-column">
        <div class="d-flex justify-space-between align-center mb-3">
          <v-chip color="primary" variant="flat" size="small" class="mr-2">
            <v-icon start size="small">mdi-eye</v-icon>
            Live preview
          </v-chip>
        </div>

        <div class="preview-canvas flex-grow-1 pa-4" :style="{ maxWidth: previewWidth }">
          <v-layout class="rounded border" style="height: 100%;">
            <v-app-bar v-if="navProperties.addAppBar && appBar.length > 0" v-for="(item, index) in appBar" :key="index"
              :color="appBarColors[navProperties.appBarColor].value !== 'default' ? appBarColors[navProperties.appBarColor].value : undefined"
              flat>
              <v-app-bar-nav-icon :icon="item.icon"></v-app-bar-nav-icon>
              <v-app-bar-title>
                {{ item.title }}
              </v-app-bar-title>
            </v-app-bar>
            <v-navigation-drawer v-model="navProperties.model" :permanent="navProperties.permanent"
              :expand-on-hover="navProperties.expandOnHover" :location="navProperties.location"
              :width="navProperties.width" :color="navProperties.color" :elevation="navProperties.elevation"
              :rounded="navProperties.rounded" :floating="navProperties.floating" :rail="navProperties.rail"
              :clipped="navProperties.clipped" :mobile="navProperties.mobile" :temporary="navProperties.temporary"
              :image="navProperties.image" :transition="navProperties.transition">
              <v-list>
                <template v-if="navProperties.showSubheader && navHeader.length > 0 &&
                  navProperties.showIconItems && navItems.length > 0">
                  <template v-for="(header, headerIdx) in navHeader" :key="`header-${headerIdx}`">
                    <v-list-subheader>
                      {{ header.title }}
                    </v-list-subheader>

                    <template v-for="(item, itemIdx) in navItems" :key="`item-${itemIdx}`">
                      <v-list-item
                        v-if="Math.floor(itemIdx / Math.ceil(navItems.length / Math.max(1, navHeader.length))) === headerIdx"
                        :prepend-icon="item.icon" :title="item.title || 'Item'" />
                    </template>
                  </template>
                </template>

                <template v-else-if="navProperties.showSubheader && navHeader.length > 0">
                  <v-list-subheader v-for="(header, idx) in navHeader" :key="idx">
                    {{ header.title }}
                  </v-list-subheader>

                  <v-list-item prepend-icon="mdi-home" title="Home" />
                  <v-list-item prepend-icon="mdi-account" title="Profile" />
                  <v-list-item prepend-icon="mdi-cog" title="Settings" />
                </template>

                <template v-else-if="navProperties.showIconItems && navItems.length > 0">
                  <v-list-item v-for="(item, idx) in navItems" :key="idx" :prepend-icon="item.icon"
                    :title="item.title || 'Item'" />
                </template>

                <template v-else>
                  <v-list-item prepend-icon="mdi-home" title="Home" />
                  <v-list-item prepend-icon="mdi-account" title="Profile" />
                  <v-list-item prepend-icon="mdi-cog" title="Settings" />
                </template>

                <v-list-item v-if="navProperties.showLinkItem"
                  :prepend-icon="navProperties.linkIcon || 'mdi-link-variant'"
                  :title="navProperties.linkTitle || 'Link'" :href="navProperties.linkUrl"
                  :target="navProperties.linkExternal ? '_blank' : undefined" />
              </v-list>
            </v-navigation-drawer>
          </v-layout>
        </div>

        <div class="d-flex justify-end mt-3">
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            Preview Code
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyNavCode">
            Copy to Clipboard
          </v-btn>
        </div>
      </div>
    </v-main>

    <v-dialog v-model="showCodeDialog" width="800">
      <v-card class="bg-grey-darken-4">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <v-tabs v-model="codeTab" color="primary">
            <v-tab value="template">Template</v-tab>
            <v-tab value="script">Script</v-tab>
            <v-tab value="theme">Theme</v-tab>
          </v-tabs>
          <v-btn icon="mdi-close" variant="text" @click="showCodeDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-window v-model="codeTab">
            <v-window-item value="template">
              <v-sheet class="bg-grey-darken-4 rounded pa-4"
                style="white-space: pre-wrap; font-family: monospace; color: white;">
                {{ generateTemplateCode() }}
              </v-sheet>
            </v-window-item>
            <v-window-item value="script">
              <v-sheet class="bg-grey-darken-4 rounded pa-4"
                style="white-space: pre-wrap; font-family: monospace; color: white;">
                {{ generateScriptCode() }}
              </v-sheet>
            </v-window-item>
            <v-window-item value="theme">
              <v-sheet class="bg-grey-darken-4 rounded pa-4"
                style="white-space: pre-wrap; font-family: monospace; color: white;">
                {{ theme }}
              </v-sheet>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="secondary" prepend-icon="mdi-content-copy" @click="copyCurrentTab">
            Copy Current Tab
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Snackbar from '~/components/snackbar.vue';
import { useUserStore } from '~/stores/userStore';
import icons from '~/utils/icons';
import { getNavTemplate } from '~/utils/navTemplates';
import theme from '~/utils/theme';

const emit = defineEmits(['update:content', 'save']);

const userStore = useUserStore();

interface AppBar {
  title: string;
  icon: string;
}
interface NavItem {
  icon: string;
  title: string;
}

interface NavHeader {
  title: string;
}

const tab = ref('content');
const previewMode = ref('desktop');
const showCodeDialog = ref(false);
const codeTab = ref('template');
const generatedCode = ref('');
const showSnackbarMessage = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const navItems = ref<NavItem[]>([]);
const navHeader = ref<NavHeader[]>([]);
const appBar = ref<AppBar[]>([]);
const navIcons = ref(icons);

const transitions = [
  'none',
  'fade',
  'slide-x-transition',
  'slide-y-transition',
  'scale-transition'
];

const appBarColors = ([
  { value: 'default', color: 'default' },
  { value: 'primary', color: 'primary' },
  { value: 'secondary', color: 'secondary' },
  { value: 'success', color: 'success' },
  { value: 'info', color: 'info' },
  { value: 'warning', color: 'warning' },
  { value: 'error', color: 'error' }
]);

const colors = [
  'default',
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error'
];

const previewWidth = computed(() => {
  switch (previewMode.value) {
    case 'mobile': return '320px';
    case 'tablet': return '600px';
    default: return '900px';
  }
});

const navProperties = ref({
  model: true,
  addAppBar: false,
  appBarColor: 1,
  permanent: false,
  expandOnHover: false,
  location: 'left' as 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end',
  width: 256,
  color: 'default',
  elevation: 4,
  rounded: false,
  floating: false,
  rail: false,
  clipped: false,
  mobile: false,
  temporary: false,
  image: '',
  showSubheader: false,
  subheaderText: '',
  showIconItems: false,
  showLinkItem: false,
  linkIcon: '',
  linkTitle: '',
  linkUrl: '',
  linkExternal: false,
  transition: 'fade',
  transitionDuration: 250
});

const customTemplateName = ref('');

const addIconItem = () => {
  navItems.value.push({ icon: 'mdi-account', title: 'New item' });
};

const removeItem = (index: number) => {
  navItems.value.splice(index, 1);
};

const addHeader = () => {
  navHeader.value.push({ title: 'New subheader' });
};

const removeHeader = (index: number) => {
  navHeader.value.splice(index, 1);
};

const addAppBar = () => {
  appBar.value.push({ title: 'App bar', icon: 'mdi-home' });
};

const removeAppBar = (index: number) => {
  appBar.value.splice(index, 1);
};

const applyTemplate = (template: string) => {
  const templateData = getNavTemplate(template);

  if (!templateData) {
    showSnackbarMessage.value = true;
    return;
  }

  Object.assign(navProperties.value, templateData);

  if (templateData.appBar) {
    appBar.value = [...templateData.appBar];
  }

  if (templateData.navItems) {
    navItems.value = templateData.navItems
      .filter((item: any) => item.type === 'item')
      .map((item: any) => ({ icon: item.icon || 'mdi-account', title: item.title }));

    navHeader.value = templateData.navItems
      .filter((item: any) => item.type === 'subheader')
      .map((item: any) => ({ title: item.title }));

    navProperties.value.showIconItems = navItems.value.length > 0;
    navProperties.value.showSubheader = navHeader.value.length > 0;
  }

  snackbarText.value = `${template} template applied successfully`;
  showSnackbarMessage.value = true;
  generateNavCodeSilently();
};

const saveCurrentTemplate = async () => {
  if (!customTemplateName.value) {
    snackbarText.value = 'Please enter a template name';
    snackbarColor.value = 'error';
    showSnackbarMessage.value = true;
    return;
  }

  const templateData = {
    ...JSON.parse(JSON.stringify(navProperties.value)),
    appBar: [...appBar.value],
    navItems: [
      ...navHeader.value.map(header => ({ id: Math.random().toString(36).substring(7), type: 'subheader', title: header.title })),
      ...navItems.value.map(item => ({ id: Math.random().toString(36).substring(7), type: 'item', icon: item.icon, title: item.title }))
    ]
  };

  const response = await userStore.saveTemplate(customTemplateName.value, templateData, 'nav');

  if (response) {
    snackbarText.value = `Template "${customTemplateName.value}" saved successfully`;
    showSnackbarMessage.value = true;
    customTemplateName.value = '';
    await userStore.loadData();
  } else {
    snackbarText.value = `Failed to save template "${customTemplateName.value}"`;
    showSnackbarMessage.value = true;
  }
};

const generateNavCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const themeCode = theme;

  switch (codeTab.value) {
    case 'template':
      return templateCode;
    case 'script':
      return scriptCode;
    case 'style':
      return themeCode;
    default:
      return `${templateCode}\n\n${scriptCode}\n\n${themeCode}`;
  }
};

const generateTemplateCode = () => {
  let code = '';

  if (navProperties.value.addAppBar && appBar.value.length > 0) {
    appBar.value.forEach(item => {
      code += '<v-app-bar';
      code += ` color="${appBarColors[navProperties.value.appBarColor].value !== 'default' ? appBarColors[navProperties.value.appBarColor].value : undefined}"`;
      code += ' flat';
      code += '>\n';
      code += `  <v-app-bar-nav-icon :icon="${item.icon}"></v-app-bar-nav-icon>\n`;
      code += `  <v-app-bar-title>${item.title}</v-app-bar-title>\n`;
      code += '</v-app-bar>\n\n';
    });
  }

  code += '<v-navigation-drawer';

  if (navProperties.value.permanent) code += '  permanent';
  if (navProperties.value.expandOnHover) code += '  expand-on-hover';
  if (navProperties.value.location !== 'left') code += `  location="${navProperties.value.location}"`;
  if (navProperties.value.width !== 256) code += `  width="${navProperties.value.width}"`;
  if (navProperties.value.color !== 'default') code += `  color="${navProperties.value.color}"`;
  if (navProperties.value.elevation !== 4) code += `  :elevation="${navProperties.value.elevation}"`;
  if (navProperties.value.rounded) code += '  rounded';
  if (navProperties.value.floating) code += '  floating';
  if (navProperties.value.rail) code += '  rail';
  if (navProperties.value.clipped) code += '  clipped';
  if (navProperties.value.mobile) code += '  mobile';
  if (navProperties.value.temporary) code += '  temporary';
  if (navProperties.value.image) code += `  image="${navProperties.value.image}"`;

  code += '>\n';
  code += '  <v-list>\n';

  if (navProperties.value.showSubheader && navHeader.value.length > 0 &&
    navProperties.value.showIconItems && navItems.value.length > 0) {
    interface CombinedItem {
      type: 'subheader' | 'item';
      title: string;
      icon?: string;
      index: number;
    }

    const combinedItems: CombinedItem[] = [];

    navHeader.value.forEach((header, index) => {
      combinedItems.push({
        type: 'subheader',
        title: header.title,
        index: index * 100
      });
    });

    const itemsPerSubheader = Math.ceil(navItems.value.length / Math.max(1, navHeader.value.length));
    navItems.value.forEach((item, index) => {
      const subheaderIndex = Math.min(Math.floor(index / itemsPerSubheader), navHeader.value.length - 1);
      combinedItems.push({
        type: 'item',
        icon: item.icon,
        title: item.title,
        index: subheaderIndex * 100 + (index % itemsPerSubheader) + 1
      });
    });

    combinedItems.sort((a, b) => a.index - b.index);

    code += '    <template v-for="(item, index) in navItems" :key="index">\n';
    code += '      <v-list-subheader v-if="item.type === \'subheader\'">{{ item.title }}</v-list-subheader>\n';
    code += '      <v-list-item v-else :prepend-icon="item.icon" :title="item.title" />\n';
    code += '    </template>\n';
  } else if (navProperties.value.showSubheader && navHeader.value.length > 0) {
    code += '    <template v-for="(header, index) in navHeader" :key="index">\n';
    code += '      <v-list-subheader>{{ header.title }}</v-list-subheader>\n';
    code += '    </template>\n';
    code += '    <v-list-item prepend-icon="mdi-home" title="Home" />\n';
    code += '    <v-list-item prepend-icon="mdi-account" title="Profile" />\n';
    code += '    <v-list-item prepend-icon="mdi-cog" title="Settings" />\n';
  } else if (navProperties.value.showIconItems && navItems.value.length > 0) {
    code += '    <v-list-item v-for="(item, index) in navItems" :key="index" :prepend-icon="item.icon" :title="item.title" />\n';
  } else {
    code += '    <v-list-item prepend-icon="mdi-home" title="Home" />\n';
    code += '    <v-list-item prepend-icon="mdi-account" title="Profile" />\n';
    code += '    <v-list-item prepend-icon="mdi-cog" title="Settings" />\n';
  }

  if (navProperties.value.showLinkItem) {
    code += `    <v-list-item prepend-icon="${navProperties.value.linkIcon || 'mdi-link-variant'}" `;
    code += `title="${navProperties.value.linkTitle || 'Link'}" `;
    if (navProperties.value.linkUrl) {
      if (navProperties.value.linkExternal) {
        code += `href="${navProperties.value.linkUrl}" target="_blank" />\n`;
      } else {
        code += `to="${navProperties.value.linkUrl}" />\n`;
      }
    } else {
      code += '/>\n';
    }
  }

  code += '  </v-list>\n';
  code += '</v-navigation-drawer>';

  return code;
};

const previewCode = () => {
  generatedCode.value = generateNavCode();
  showCodeDialog.value = true;
};

const generateScriptCode = () => {
  let code = `
import { ref, computed } from 'vue';

const navItems = ref([`;

  let combinedItems = [];

  for (let i = 0; i < navHeader.value.length; i++) {
    combinedItems.push(`{ type: 'subheader', title: '${navHeader.value[i].title}' }`);

    const itemsPerHeader = Math.ceil(navItems.value.length / Math.max(1, navHeader.value.length));
    const startIndex = i * itemsPerHeader;
    const endIndex = Math.min(startIndex + itemsPerHeader, navItems.value.length);

    for (let j = startIndex; j < endIndex; j++) {
      if (j < navItems.value.length) {
        combinedItems.push(`{ type: 'item', icon: '${navItems.value[j].icon}', title: '${navItems.value[j].title}' }`);
      }
    }
  }

  if (navHeader.value.length === 0 && navItems.value.length > 0) {
    for (let i = 0; i < navItems.value.length; i++) {
      combinedItems.push(`{ type: 'item', icon: '${navItems.value[i].icon}', title: '${navItems.value[i].title}' }`);
    }
  }

  code += '\n  ' + combinedItems.join(',\n  ');

  code += `
]);`;

  return code;
};

const copyNavCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const fullCode = `${templateCode}\n\n${scriptCode}`;

  navigator.clipboard.writeText(fullCode)
    .then(() => {
      snackbarText.value = 'Code copied to clipboard!';
      showSnackbarMessage.value = true;
    })
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const copyCurrentTab = () => {
  let code;
  switch (codeTab.value) {
    case 'template':
      code = generateTemplateCode();
      break;
    case 'script':
      code = generateScriptCode();
      break;
    case 'style':
      code = theme;
      break;
    default:
      code = '';
  }
  window.navigator.clipboard.writeText(code)
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const generateNavCodeSilently = () => {
  const code = generateNavCode();
  emit('update:content', code);
};

const loadTemplateFromStore = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (!templateId) return;

  console.log('Loading template with ID:', templateId);

  const template = userStore.studioComponents.find(t => t.id === parseInt(templateId) && t.component_type === 'nav');

  if (template && template.content) {
    console.log('Template found in store:', template.name);

    if (template.content.trim().startsWith('<v-navigation-drawer') || template.content.trim().startsWith('<v-app-bar')) {
      console.log('HTML content detected, applying directly');
      emit('update:content', template.content);
      return;
    }

    try {
      const templateData = JSON.parse(template.content);
      console.log('Template data loaded:', templateData);

      Object.assign(navProperties.value, templateData);

      if (templateData.appBar) {
        appBar.value = [...templateData.appBar];
      }

      if (templateData.navItems) {
        navItems.value = templateData.navItems
          .filter((item: any) => item.type === 'item')
          .map((item: any) => ({ icon: item.icon || 'mdi-account', title: item.title }));

        navHeader.value = templateData.navItems
          .filter((item: any) => item.type === 'subheader')
          .map((item: any) => ({ title: item.title }));

        navProperties.value.showIconItems = navItems.value.length > 0;
        navProperties.value.showSubheader = navHeader.value.length > 0;
      }

      generateNavCodeSilently();

      snackbarText.value = 'Template loaded successfully';
      showSnackbarMessage.value = true;
    } catch (error) {
      console.error('Error parsing template:', error);
      emit('update:content', template.content);
    }
  }
};

watch(navProperties, () => {
  generateNavCodeSilently();
}, { deep: true });

watch(previewMode, () => {
  generateNavCodeSilently();
});

watch(() => {
  if (typeof window !== 'undefined') {
    return window.location.search;
  }
  return '';
}, () => {
  if (typeof window !== 'undefined') {
    loadTemplateFromStore();
  }
}, { immediate: true });

onMounted(() => {
  applyTemplate('dashboard');
});
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.preview-area {
  flex: 1;
  background-color: #f5f5f5;
  overflow: auto;
}

.preview-canvas {
  background-color: white;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}
</style>
