<template>
  <footer class="py-8 footer-section" aria-label="Site Footer">
    <v-container>
      <v-row>
        <v-col cols="12" md="5" lg="5" class="mb-6 mb-md-0">
          <div class="d-flex align-center mb-4">
            <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="180"
              loading="eager">
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t().footer.description }}
          </p>
          <div class="newsletter-signup mb-6">
            <form class="d-flex" aria-label="Newsletter Subscription">
              <v-text-field v-model="email" density="compact" :placeholder="t().footer.newsletter.placeholder"
                aria-label="Your email address" variant="outlined" hide-details class="mr-2"
                prepend-inner-icon="mdi-email-outline"
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"></v-text-field>
              <v-btn color="info" variant="elevated" class="ml-n1" :loading="loading" @click="submitEmail" type="submit"
                aria-label="Subscribe to newsletter">
                {{ t().footer.newsletter.button }}
              </v-btn>
            </form>
            <p class="text-caption text-medium-emphasis mt-1">
              {{ t().footer.newsletter.description }}
            </p>
          </div>
          <nav aria-label="Social Media Links">
            <div class="d-flex">
              <v-btn icon variant="text" class="mr-3 social-btn" href="https://twitter.com" target="_blank"
                aria-label="Twitter">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon variant="text" class="mr-3 social-btn" href="https://github.com/stackunity-dev/stackunity"
                target="_blank" aria-label="GitHub">
                <v-icon>mdi-github</v-icon>
              </v-btn>
              <v-btn icon variant="text" class="mr-3 social-btn" href="https://www.linkedin.com/company/stackunity/"
                target="_blank" aria-label="LinkedIn">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
            </div>
          </nav>
        </v-col>

        <v-col cols="12" md="7" lg="7">
          <v-row class="footer-columns-container">
            <v-col v-for="(column, index) in footerColumns" :key="index" cols="6" md="4" class="footer-column px-4">
              <h4 :id="'footer-column-heading-' + index" class="text-subtitle-1 font-weight-bold mb-4">{{ column.title
              }}
              </h4>
              <nav class="footer-links" :aria-labelledby="'footer-column-heading-' + index">
                <NuxtLink v-for="(link, linkIndex) in column.links" :key="linkIndex" :to="link.to"
                  class="footer-link d-block mb-3" :class="{ 'active-link': isActive(link.to) }"
                  :aria-label="link.ariaLabel">
                  {{ link.title }}
                </NuxtLink>
              </nav>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
        <div class="text-body-2 text-medium-emphasis mb-3 mb-sm-0">
          &copy; {{ new Date().getFullYear() }} StackUnity. {{ t().footer.copyright }}
        </div>
        <div class="d-flex align-center">
          <a href="mailto:contact@stackunity.com" class="text-body-2 text-decoration-none contact-link"
            aria-label="Contact us">support@stackunity.tech</a>
        </div>
      </div>
    </v-container>
  </footer>

  <snackBar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useTranslations } from '../../languages/';
import { useUserStore } from '../../stores/userStore';
import snackBar from '../snackbar.vue';
// @ts-ignore
import { useNuxtApp } from '#app';
import { useRoute } from 'vue-router';


const t = useTranslations('index')
const route = useRoute();

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const email = ref('')
const loading = ref(false)
const userStore = useUserStore()
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('')

const isActive = (path: string) => {
  if (path.startsWith('#')) {
    return window?.location?.hash === path;
  }
  return route.path === path;
};

const showMessage = (message: string, type: string, timeout = 3000) => {
  snackbarText.value = message;
  snackbarColor.value = type;
  showSnackbar.value = true;
};

const submitEmail = async () => {
  if (!email.value) {
    showMessage('Please enter your email address', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  loading.value = true;

  try {
    await userStore.subscribeToNewsletter(email.value);

    showMessage('Thanks for subscribing! You\'ll receive our latest updates soon.', 'success');

    email.value = '';
  } catch (error) {
    console.error('Error during subscription:', error);
    showMessage('An error occurred. Please try again later.', 'error');
  } finally {
    loading.value = false;
  }
};

const footerColumns = computed(() => [
  {
    title: t().navigation.products,
    links: [
      { title: t().navigation.features, to: '#features', ariaLabel: 'Features' },
      { title: t().navigation.pricing, to: '#pricing', ariaLabel: 'Pricing' },
      { title: t().navigation.faq, to: '#faq', ariaLabel: 'FAQ' }
    ]
  },
  {
    title: t().navigation.company,
    links: [
      { title: t().navigation.about, to: localePath('/about'), ariaLabel: 'About' },
      { title: t().navigation.contact, to: localePath('/contact'), ariaLabel: 'Contact' },
      { title: t().navigation.blog, to: localePath('/blog'), ariaLabel: 'Blog' }
    ]
  },
  {
    title: t().navigation.legal,
    links: [
      { title: t().navigation.privacy, to: localePath('/privacy'), ariaLabel: 'Privacy' },
      { title: t().navigation.terms, to: localePath('/terms'), ariaLabel: 'Terms' },
      { title: t().navigation.notice, to: localePath('/notices'), ariaLabel: 'Notices' }
    ]
  }
]);
</script>

<style scoped>
.footer-section {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.05);
  position: relative;
}

.footer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 30%, rgba(var(--v-theme-primary), 0.05), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(var(--v-theme-info), 0.05), transparent 50%);
  pointer-events: none;
}

.footer-link {
  color: rgba(var(--v-theme-on-surface), 0.8);
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  font-weight: 500;
  padding-left: 0;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
  transform: translateX(10px);
  padding-left: 5px;
}

.footer-link:hover::before {
  width: 6px;
  height: 6px;
  opacity: 1;
  left: -5px;
}

.active-link {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.social-btn {
  transition: all 0.3s ease;
  opacity: 0.8;
}

.social-btn:hover {
  transform: translateY(-3px);
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

.contact-link {
  transition: all 0.3s ease;
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-weight: 500;
}

.contact-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline !important;
}

.newsletter-signup {
  background: linear-gradient(rgba(var(--v-theme-surface), 0.5), rgba(var(--v-theme-surface), 0.8));
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
</style>
