<template>
  <v-app>
    <v-app-bar flat color="primary" class="px-4">
      <v-icon size="large" class="mr-3">mdi-email-newsletter</v-icon>
      <v-toolbar-title class="text-h5 font-weight-bold">{{ newsletterName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-download" variant="text" @click="exportSubscribers">
        Export CSV
      </v-btn>
      <v-btn prepend-icon="mdi-plus" variant="text" @click="addNewsletter = true">
        Add Newsletter
      </v-btn>
    </v-app-bar>

    <v-main class="ma-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="rounded-lg" elevation="2" height="100%">
            <v-card-text class="d-flex flex-column align-center justify-center">
              <v-icon size="48" color="primary" class="mb-2">mdi-account-group</v-icon>
              <div class="text-h4 font-weight-bold">{{ subscriberCount }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">Subscribers</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="rounded-lg" elevation="2" height="100%">
            <v-card-text class="d-flex flex-column align-center justify-center">
              <v-icon size="48" color="info" class="mb-2">mdi-email-outline</v-icon>
              <div class="text-h4 font-weight-bold">{{ sentEmails }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">Emails sent</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
              <v-icon color="white" class="mr-2">mdi-account-group</v-icon>
              Subscribers List
            </v-card-title>
            <v-card-text class="pa-4">
              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search subscriber" single-line
                variant="outlined" density="comfortable" hide-details class="mb-4"></v-text-field>

              <v-data-table :headers="headers" :items="subscribersList" :search="search" :loading="loading"
                class="elevation-1 rounded">
                <template v-slot:item.status="{ item }">
                  <v-chip :color="item.status === 'active' ? 'success' : 'error'" size="small">
                    {{ item.status === 'active' ? 'Active' : 'Unsubscribed' }}
                  </v-chip>
                </template>
                <template v-slot:item.date="{ item }">
                  {{ new Date(item.date).toLocaleDateString('en-US') }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
              <v-icon color="white" class="mr-2">mdi-history</v-icon>
              Email History
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <v-list-item v-for="(item, index) in emailHistory" :key="index" :subtitle="formatDate(item.date)"
                  :prepend-icon="'mdi-email-outline'">
                  <v-list-item-title>{{ item.subject }}</v-list-item-title>
                  <template v-slot:append>
                    <v-chip size="x-small" :color="getStatusColor(item.status)">
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-main>

    <v-dialog v-model="addNewsletter" max-width="700">
      <v-card>
        <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
          Add Newsletter
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newsletterName" label="Newsletter Name" prepend-inner-icon="mdi-email-outline"
            variant="outlined" density="comfortable" hide-details class="mb-4"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="tonal" @click="addNewsletter = false">
            Cancel
          </v-btn>
          <v-btn color="success" variant="tonal" @click="createNewsletter">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/userStore';
import { onMounted, ref } from 'vue';
// @ts-ignore
import { definePageMeta, useHead, navigateTo } from 'imports';
definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Newsletter Admin - DevUnity',
  meta: [
    { name: 'description', content: 'Admin dashboard for managing newsletters' },
    { name: 'keywords', content: 'DevUnity, newsletter, admin, dashboard, management' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Newsletter Admin - DevUnity' },
    { name: 'og:description', content: 'Admin dashboard for managing newsletters' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
})

interface Subscriber {
  id: number;
  email: string;
  date: string;
  status: string;
}

interface Newsletter {
  id: number;
  name: string;
  emails_sent: number;
  subscribers: number;
  content: string;
}

const userStore = useUserStore();
const isAuthenticated = ref(false);
const newsletterName = ref('');
const subscriberCount = ref(0);
const sentEmails = ref(0);
const subscribersList = ref<Subscriber[]>([]);
const newsletters = ref<Newsletter[]>([]);
const newsletter = ref<Newsletter | null>(null);
const addNewsletter = ref(false);

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  await checkUserAuthentication();
});

const checkUserAuthentication = async () => {
  try {
    console.log(userStore.token);
    if (!userStore.token) {
      userStore.initializeStore();
      if (!userStore.isUserAuthenticated) {
        showSnackbar('Veuillez vous connecter pour accéder à cette page', 'error');
        navigateTo('/login');
        return;
      }
    }

    if (userStore.user && userStore.user.isAdmin === true) {
      console.log("Admin déjà vérifié dans le store:", userStore.user);
      isAuthenticated.value = true;
      loadSubscribers();
      loadStats();
      loadEmailHistory();
      return;
    }

    const response = await fetch('/api/user/check-admin', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (!response.ok) {
      console.error("Erreur API check-admin:", response.status, response.statusText);
      userStore.logout();
      showSnackbar('Session expirée. Veuillez vous reconnecter.', 'error');
      navigateTo('/login');
      return;
    }

    const data = await response.json();
    console.log("Réponse API check-admin:", data);

    if (data.isAdmin) {
      isAuthenticated.value = true;
      loadSubscribers();
      loadStats();
      loadEmailHistory();
    } else {
      showSnackbar('Vous n\'avez pas les permissions nécessaires', 'error');
      navigateTo('/');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    showSnackbar('Erreur lors de la vérification de l\'authentification', 'error');
    navigateTo('/login');
  }
};

const loadStats = async () => {
  try {
    const response = await fetch('/api/newsletter/stats', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    const data = await response.json();

    if (data.stats && data.stats.length > 0) {
      newsletters.value = data.stats;
      newsletter.value = data.stats[0];

      newsletterName.value = newsletters.value[0].name;
      subscriberCount.value = newsletters.value[0].subscribers;
      sentEmails.value = newsletters.value[0].emails_sent;

      console.log('Newsletters chargées:', newsletters.value);
      console.log('Newsletter actuelle:', newsletter.value);
    } else {
      console.warn('Aucune newsletter trouvée dans les données');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    showSnackbar('Erreur lors du chargement des statistiques', 'error');
  }
};

const loadEmailHistory = async () => {
  const response: any = await userStore.getEmailHistory();
  const data = await response.json();
  console.log(data);
  if (data && data.data && Array.isArray(data.data)) {
    emailHistory.value = data.data.map((item: any) => ({
      subject: item.subject,
      date: item.created_at,
      content: item.content
    }));
  }
  console.log(emailHistory.value);
}

const emailForm = ref({
  subject: '',
  template: 'welcome',
  content: '',
});

const emailHistory = ref([
  { subject: 'Welcome to our newsletter', date: '2023-10-15', status: 'sent', opens: 45 },
  { subject: 'New features - October 2023', date: '2023-10-01', status: 'sent', opens: 38 },
  { subject: 'Special offer for our subscribers', date: '2023-09-15', status: 'sent', opens: 42 },
]);

const headers = ref([
  { title: 'Email', key: 'email' },
  { title: 'Subscription Date', key: 'date' },
  { title: 'Status', key: 'status' },
]);

const search = ref('');
const loading = ref(false);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const createNewsletter = async () => {
  try {
    await userStore.addNewsletter(newsletterName.value);
    loadStats();
    showSnackbar('Newsletter créé avec succès', 'success');
    addNewsletter.value = false;
  } catch (error) {
    console.error('Erreur lors de la création de la newsletter:', error);
    showSnackbar('Erreur lors de la création de la newsletter', 'error');
  }
};


const loadSubscribers = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/newsletter/subscribers', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.subscribers && Array.isArray(data.subscribers)) {
      subscribersList.value = data.subscribers.map((sub: any) => ({
        id: sub.id,
        email: sub.email,
        date: sub.date || new Date().toISOString(),
        status: 'active'
      }));

      if (newsletter.value) {
        newsletter.value.subscribers = subscribersList.value.length;
        subscriberCount.value = subscribersList.value.length;
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des abonnés:', error);
    showSnackbar('Erreur lors du chargement des abonnés', 'error');
  } finally {
    loading.value = false;
  }
};

const deleteSubscriber = async (id: number) => {
  try {
    const response = await fetch(`/api/newsletter/subscribers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    subscribersList.value = subscribersList.value.filter(sub => sub.id !== id);

    if (newsletter.value) {
      newsletter.value.subscribers = subscribersList.value.length;
      subscriberCount.value = subscribersList.value.length;
    }

    showSnackbar('Abonné supprimé avec succès', 'success');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonné:', error);
    showSnackbar('Erreur lors de la suppression de l\'abonné', 'error');
  }
};

const exportSubscribers = () => {
  const headers = ['Email', 'Subscription Date', 'Status'];
  const csvContent = [
    headers.join(','),
    ...subscribersList.value.map((sub: Subscriber) => [
      sub.email,
      new Date(sub.date).toLocaleDateString('en-US'),
      sub.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showSnackbar('CSV export successful', 'success');
};

const sendEmail = async () => {
  try {
    if (!emailForm.value.subject || !emailForm.value.content) {
      showSnackbar('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    const emailData = {
      subject: emailForm.value.subject,
      html: emailForm.value.content,
      text: emailForm.value.content.replace(/<[^>]*>/g, ''),
    };

    const response = await userStore.sendEmail(emailData);

    if (!response) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erreur inconnue lors de l\'envoi');
    }

    const emailHistory = await userStore.getEmailHistory();
    console.log(emailHistory);
    showSnackbar('Email envoyé avec succès à tous les abonnés', 'success');
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    showSnackbar(`Erreur d'envoi: ${error.message || 'Erreur inconnue'}`, 'error');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sent': return 'success';
    case 'draft': return 'info';
    case 'failed': return 'error';
    default: return 'grey';
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = {
    show: true,
    text,
    color
  };
};
</script>

<style scoped>
.email-preview {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: Arial, sans-serif;
}
</style>