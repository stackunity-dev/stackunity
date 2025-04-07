<template>
  <v-container fluid class="pa-0 ma-0">
    <v-row no-gutters>
      <v-col cols="12" md="4" lg="3" class="pa-2">
        <v-card elevation="2" class="rounded-lg">
          <v-card-title class="bg-primary text-white py-3 px-4 d-flex align-center">
            <v-icon class="mr-2">mdi-email-edit</v-icon>
            Email Editor
            <v-spacer></v-spacer>
            <v-btn icon="mdi-send" color="white" variant="text" @click="sendEmail" class="mr-n2">
              <v-tooltip activator="parent" location="bottom">Send email</v-tooltip>
            </v-btn>
          </v-card-title>

          <v-tabs v-model="configTab" bg-color="primary" show-arrows>
            <v-tab value="content" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-file-document-outline</v-icon>
              Content
            </v-tab>
            <v-tab value="style" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-palette-outline</v-icon>
              Style
            </v-tab>
            <v-tab value="company" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-domain</v-icon>
              Company
            </v-tab>
            <v-tab value="actions" class="text-caption">
              <v-icon size="small" class="mr-1">mdi-cog</v-icon>
              Actions
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-4">
            <v-form ref="form">
              <v-text-field v-model="emailData.subject" label="Email subject" variant="outlined" density="comfortable"
                class="mb-4" prepend-icon="mdi-format-title" clearable></v-text-field>

              <v-select v-model="emailData.template" :items="templates" label="Template type" variant="outlined"
                density="comfortable" class="mb-4" prepend-icon="mdi-file-document-outline"
                @update:model-value="loadTemplate"></v-select>

              <v-divider class="my-4"></v-divider>

              <v-window v-model="configTab">
                <v-window-item value="content">
                  <v-text-field v-model="emailData.preheader" label="Pre-header" variant="outlined"
                    density="comfortable" class="mb-4" prepend-icon="mdi-text-short"
                    hint="Text visible in email previews" clearable></v-text-field>

                  <v-text-field v-model="emailData.headline" label="Title" variant="outlined" density="comfortable"
                    class="mb-4" prepend-icon="mdi-format-header-1" clearable></v-text-field>

                  <v-textarea v-model="emailData.mainContent" label="Main content" variant="outlined" rows="6" auto-grow
                    class="mb-4" prepend-icon="mdi-text" clearable></v-textarea>

                  <v-text-field v-model="emailData.ctaText" label="Button text" variant="outlined" density="comfortable"
                    class="mb-4" prepend-icon="mdi-button-cursor" clearable></v-text-field>

                  <v-text-field v-model="emailData.ctaUrl" label="Button URL" variant="outlined" density="comfortable"
                    class="mb-4" prepend-icon="mdi-link" clearable></v-text-field>
                </v-window-item>

                <v-window-item value="style">
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2">mdi-palette</v-icon>
                    <div class="text-subtitle-1">Primary color</div>
                  </div>
                  <v-color-picker v-model="emailData.colors.primary" dot-size="25" class="mb-4"></v-color-picker>

                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2">mdi-palette-outline</v-icon>
                    <div class="text-subtitle-1">Secondary color</div>
                  </div>
                  <v-color-picker v-model="emailData.colors.secondary" dot-size="25" class="mb-4"></v-color-picker>

                  <v-select v-model="emailData.font" :items="fonts" label="Font family" variant="outlined"
                    density="comfortable" class="mb-4" prepend-icon="mdi-format-font"></v-select>

                  <v-switch v-model="emailData.darkMode" color="primary" label="Dark mode" hide-details class="mb-4"
                    prepend-icon="mdi-theme-light-dark"></v-switch>
                </v-window-item>

                <v-window-item value="company">
                  <v-text-field v-model="emailData.logoUrl" label="Logo URL" variant="outlined" density="comfortable"
                    class="mb-4" prepend-icon="mdi-image"></v-text-field>

                  <v-text-field v-model="emailData.companyName" label="Company name" variant="outlined"
                    density="comfortable" class="mb-4" prepend-icon="mdi-domain" clearable></v-text-field>

                  <v-text-field v-model="emailData.companyAddress" label="Company address" variant="outlined"
                    density="comfortable" class="mb-4" prepend-icon="mdi-map-marker" clearable></v-text-field>
                </v-window-item>

                <v-window-item value="actions">
                  <v-list>
                    <v-list-item prepend-icon="mdi-content-copy" title="Copy HTML" @click="copyHtml" class="mb-2">
                      <template v-slot:append>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>

                    <v-list-item prepend-icon="mdi-code-tags" title="Copy Vue Email" @click="copyVueEmailTemplate"
                      class="mb-2">
                      <template v-slot:append>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>

                    <v-list-item prepend-icon="mdi-send" title="Send email" @click="sendEmail" class="mb-2">
                      <template v-slot:append>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-window-item>
              </v-window>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" lg="9" class="pa-2">
        <v-card elevation="2" class="rounded-lg">
          <v-toolbar color="primary" flat>
            <v-toolbar-title class="text-white">Email preview</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="viewMode" color="white" density="comfortable" class="mr-2" mandatory>
              <v-btn value="desktop" class="mr-2" prepend-icon="mdi-monitor">Desktop</v-btn>
              <v-btn value="mobile" prepend-icon="mdi-cellphone">Mobile</v-btn>
            </v-btn-toggle>
          </v-toolbar>

          <v-card-text class="pa-4">
            <div class="email-preview-container" :class="viewMode">
              <div ref="emailPreview" class="email-preview">
                <div class="email-template"
                  :style="{ backgroundColor: emailData.darkMode ? '#2a2a2a' : '#ffffff', color: emailData.darkMode ? '#ffffff' : '#111827' }">
                  <div class="email-header"
                    :style="`border-bottom: 2px solid ${emailData.colors.primary}; padding: 20px; text-align: center;`">
                    <img :src="emailData.logoUrl" :alt="emailData.companyName" style="max-width: 150px;">
                    <h1
                      :style="`color: ${emailData.colors.primary}; font-family: ${emailData.font}, sans-serif; margin-top: 15px;`">
                      {{ emailData.headline }}</h1>
                  </div>
                  <div class="email-content" :style="`padding: 30px 20px; font-family: ${emailData.font}, sans-serif;`">
                    <p v-for="(paragraph, i) in formattedParagraphs" :key="i"
                      style="margin-bottom: 16px; line-height: 1.5;">
                      {{ paragraph }}
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a :href="emailData.ctaUrl"
                        :style="`display: inline-block; padding: 12px 24px; background-color: ${emailData.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`">
                        {{ emailData.ctaText }}
                      </a>
                    </div>
                  </div>
                  <div class="email-footer"
                    :style="`text-align: center; padding: 20px; border-top: 1px solid ${emailData.darkMode ? '#444' : '#eee'}; font-size: 12px; color: ${emailData.darkMode ? '#aaa' : '#666'}; font-family: ${emailData.font}, sans-serif;`">
                    <p>© {{ new Date().getFullYear() }} {{ emailData.companyName }}. All rights reserved.</p>
                    <p>{{ emailData.companyAddress }}</p>
                    <p>To unsubscribe, <a href="http://localhost:3000/unsubscribe"
                        :style="`color: ${emailData.colors.primary}; text-decoration: underline;`">click here</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <v-card class="mt-4" elevation="1">
              <v-tabs v-model="codeTab" bg-color="grey-lighten-4">
                <v-tab value="html">
                  <v-icon size="small" class="mr-1">mdi-language-html5</v-icon>
                  HTML
                </v-tab>
                <v-tab value="vueEmail">
                  <v-icon size="small" class="mr-1">mdi-vuejs</v-icon>
                  Vue Email
                </v-tab>
                <v-tab value="text">
                  <v-icon size="small" class="mr-1">mdi-text</v-icon>
                  Text
                </v-tab>
              </v-tabs>

              <v-window v-model="codeTab">

                <v-window-item value="html">
                  <v-card-text class="code-container pa-0">
                    <div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3">
                      <span class="text-caption text-white">HTML Code</span>
                      <v-spacer></v-spacer>
                      <v-btn icon="mdi-content-copy" density="comfortable" color="white" variant="text"
                        @click="copyHtml">
                        <v-tooltip activator="parent" location="top">Copy HTML</v-tooltip>
                      </v-btn>
                    </div>
                    <pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto"
                      style="max-height: 300px; margin: 0;"><code>{{ generatedHtml }}</code></pre>
                  </v-card-text>
                </v-window-item>

                <v-window-item value="vueEmail">
                  <v-card-text class="code-container pa-0">
                    <div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3">
                      <span class="text-caption text-white">Vue Email Template</span>
                      <v-spacer></v-spacer>
                      <v-btn icon="mdi-content-copy" density="comfortable" color="white" variant="text"
                        @click="copyVueEmailTemplate">
                        <v-tooltip activator="parent" location="top">Copy template</v-tooltip>
                      </v-btn>
                    </div>
                    <pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto"
                      style="max-height: 300px; margin: 0;"><code>{{ emailTemplate }}</code></pre>
                  </v-card-text>
                </v-window-item>

                <v-window-item value="text">
                  <v-card-text class="code-container pa-0">
                    <div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3">
                      <span class="text-caption text-white">Text Version</span>
                      <v-spacer></v-spacer>
                      <v-btn icon="mdi-content-copy" density="comfortable" color="white" variant="text"
                        @click="copyText">
                        <v-tooltip activator="parent" location="top">Copy text</v-tooltip>
                      </v-btn>
                    </div>
                    <pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto"
                      style="max-height: 300px; margin: 0;"><code>{{ generatedText }}</code></pre>
                  </v-card-text>
                </v-window-item>
              </v-window>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      <div class="d-flex align-center">
        <v-icon class="mr-2" :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></v-icon>
        {{ snackbar.text }}
      </div>
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { useUserStore } from '../stores/userStore';
import { computed, onMounted, ref, watch } from 'vue';
import type { EmailTemplate } from '../utils/emailTemplates';
import { emailTemplates, generateEmailHTML, generateEmailText, generateVueEmailTemplate, getTemplateById } from '../utils/emailTemplates';

const form = ref(null);
const emailPreview = ref(null);
const viewMode = ref('desktop');
const codeTab = ref('preview');
const configTab = ref('content');

const templates = computed(() => {
  return Object.values(emailTemplates).map(template => ({
    title: template.name,
    value: template.id
  }));
});

const fonts = [
  { title: 'Arial', value: 'Arial' },
  { title: 'Helvetica', value: 'Helvetica' },
  { title: 'Georgia', value: 'Georgia' },
  { title: 'Tahoma', value: 'Tahoma' },
  { title: 'Verdana', value: 'Verdana' }
];

const emailData = ref<EmailTemplate>({
  id: 'custom',
  name: 'Custom Template',
  subject: 'Welcome to our newsletter',
  template: 'welcome',
  preheader: 'Stay informed with our latest news and updates',
  headline: 'Welcome to our newsletter!',
  mainContent: 'We are delighted to have you as a subscriber. You will now receive our best news and offers directly in your inbox.\n\nHere\'s what you can expect from our newsletter:\n- Regular updates on our products and services\n- Exclusive tips and advice\n- Special offers reserved for our subscribers',
  ctaText: 'Discover our services',
  ctaUrl: 'https://example.com',
  colors: {
    primary: '#4F46E5',
    secondary: '#818CF8'
  },
  font: 'Arial',
  darkMode: false,
  logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
  companyName: 'SaaS Company Inc.',
  companyAddress: '123 Innovation Street, 75000 Paris, France'
});

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const generatedHtml = ref('');
const generatedText = ref('');
const emailTemplate = ref('');

const formattedParagraphs = computed(() => {
  return emailData.value.mainContent.split('\n\n').filter(paragraph => paragraph.trim() !== '');
});

const loadTemplate = () => {
  const selectedTemplate = getTemplateById(emailData.value.template as string);

  if (selectedTemplate) {
    const currentId = emailData.value.template;

    emailData.value = { ...selectedTemplate, template: currentId };

    generateEmailCode();
  }
};

const generateEmailCode = async () => {
  try {
    generatedHtml.value = generateEmailHTML(emailData.value);
    generatedText.value = generateEmailText(emailData.value);
    emailTemplate.value = generateVueEmailTemplate(emailData.value);
  } catch (error) {
    console.error('Error generating email code:', error);
    showSnackbar('Error generating HTML code', 'error');
  }
};

const copyHtml = () => {
  navigator.clipboard.writeText(generatedHtml.value)
    .then(() => {
      showSnackbar('HTML code copied to clipboard', 'success');
    })
    .catch(err => {
      console.error('Error copying:', err);
      showSnackbar('Error copying code', 'error');
    });
};

const copyVueEmailTemplate = () => {
  navigator.clipboard.writeText(emailTemplate.value)
    .then(() => {
      showSnackbar('Vue Email template copied to clipboard', 'success');
    })
    .catch(err => {
      console.error('Error copying:', err);
      showSnackbar('Error copying template', 'error');
    });
};

const copyText = () => {
  navigator.clipboard.writeText(generatedText.value)
    .then(() => {
      showSnackbar('Text copied to clipboard', 'success');
    })
    .catch(err => {
      console.error('Error copying:', err);
      showSnackbar('Error copying text', 'error');
    });
};

const sendEmail = async () => {
  try {
    const store = useUserStore();

    const emailDataPayload = {
      subject: emailData.value.subject,
      html: generatedHtml.value,
      text: generatedText.value
    };

    const response = await store.sendEmail(emailDataPayload);

    if (response) {
      const result = await response.json();
      console.log('Réponse du serveur:', result);

      if (result.success) {
        showSnackbar('Email envoyé avec succès', 'success');
      } else {
        showSnackbar(`Erreur d'envoi: ${result.message || 'Erreur inconnue'}`, 'error');
      }
    } else {
      showSnackbar('Erreur lors de la connexion au serveur', 'error');
    }
  } catch (error: any) {
    console.error('Erreur détaillée lors de l\'envoi:', error);
    showSnackbar(`Erreur d'envoi: ${error.message}`, 'error');
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};

watch(
  () => emailData.value,
  () => {
    generateEmailCode();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  loadTemplate();
  loadTemplateFromUrl();
});

const loadTemplateFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (templateId) {
    const template = getTemplateById(templateId);
    if (template) {
      emailData.value = { ...template, template: templateId };
      generateEmailCode();
    }
  }
};
</script>

<style scoped>
.email-preview-container {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9fafb;
  overflow: hidden;
  height: 500px;
  max-width: 100%;
  transition: all 0.3s ease;
}

.email-preview-container.desktop {
  width: 100%;
}

.email-preview-container.mobile {
  width: 375px;
  margin: 0 auto;
}

.email-preview {
  background-color: #ffffff;
  overflow: auto;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-block {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 2;
}

.code-toolbar {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.code-container {
  border-radius: 4px;
  overflow: hidden;
}
</style>