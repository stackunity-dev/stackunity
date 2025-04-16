<template>
  <v-app class="landing-screen">
    <header>
      <v-app-bar app :elevation="2" :color="'surface'" class="px-0 nav-bar" v-model="showAppBar">
        <v-container class="d-flex align-center py-0 my-0">
          <NuxtLink to="/login" class="text-decoration-none" aria-label="StackUnity Home">
            <div class="d-flex align-center brand-container">
              <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="150"
                class="logo-image">
              <div class="brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left">
                <span class="text-caption font-weight-medium text-gradient">PROPULSE YOUR CODE</span>
              </div>
            </div>
          </NuxtLink>
          <v-spacer></v-spacer>

          <div v-show="isClient" class="d-flex align-center">
            <nav v-if="isClient && display.smAndUp.value" class="d-flex align-center custom-nav-menu"
              aria-label="Main Navigation">
              <div class="nav-links-wrapper">
                <v-btn v-for="item in menuItems" :key="item.href" class="nav-btn custom-btn" :href="item.href"
                  :class="{ 'active-nav-btn': activeSection === item.href.substring(1) }" variant="text">
                  <span class="nav-text">{{ item.title }}</span>
                  <span class="nav-btn-background"></span>
                </v-btn>
              </div>

              <div class="auth-buttons ml-6">
                <v-btn color="primary" class="login-btn" aria-label="Login" to="/login" variant="tonal"
                  rounded="rounded-xl" prepend-icon="mdi-login">
                  Login
                </v-btn>
              </div>
            </nav>

            <div v-else-if="isClient && !display.smAndUp.value" class="d-flex align-center">
              <v-btn color="primary" class="mr-2" to="/login" aria-label="Login" size="small" rounded="pill">
                <v-icon size="small" class="mr-1">mdi-login</v-icon>
                Login
              </v-btn>
              <v-btn icon @click="drawer = !drawer" class="menu-toggle-btn" aria-label="Toggle navigation menu">
                <div class="hamburger-icon" :class="{ 'active': drawer }">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-app-bar>
    </header>

    <nav location="right" temporary class="mobile-nav-drawer d-md-none" aria-label="Mobile Navigation">
      <v-navigation-drawer v-model="drawer" location="right" temporary
        class="v-navigation-drawer v-navigation-drawer--right v-navigation-drawer--temporary v-theme--dark v-theme--dark pa-6">
        <div class="drawer-header mb-8 d-flex justify-space-between align-center">
          <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="120"
            loading="eager">
          <v-btn icon variant="text" aria-label="Close" @click="drawer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="mobile-nav-links">
          <v-list nav>
            <v-list-item v-for="item in menuItems" :key="item.href" :href="item.href" @click="drawer = false"
              class="mobile-nav-item mb-3" rounded="lg">
              <template v-slot:prepend>
                <v-icon class="mr-2" :icon="item.icon" color="primary"></v-icon>
              </template>
              <v-list-item-title class="text-subtitle-1 font-weight-medium">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <div class="drawer-footer mt-auto pt-6">
          <v-btn block color="primary" to="/signup" aria-label="Get started" class="mb-4" size="large" rounded="pill"
            elevation="2">
            <v-icon start>mdi-rocket-launch-outline</v-icon>
            Get started
          </v-btn>
          <p class="text-caption text-center text-medium-emphasis">Join our community of developers and propulse your
            web
            projects to new horizons.</p>
        </div>
      </v-navigation-drawer>
    </nav>

    <v-main class="main-content">
      <main>
        <section class="hero-section py-16">
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" md="6" class="text-center text-md-start">
                <h1 class="text-h2 font-weight-bold mb-4">
                  <span class="text-primary">StackUnity</span> - Your All-in-One Development Hub
                </h1>
                <p class="text-h5 mb-8 text-medium-emphasis">
                  The starting point for devs who want to progress, build and monetise their projects.
                </p>
                <div class="d-flex flex-column flex-sm-row ga-4 justify-center justify-md-start">
                  <v-btn color="success" size="x-large" aria-label="Start Free Trial" to="/signup" variant="tonal"
                    class="px-8" elevation="2">
                    <v-icon start>mdi-rocket-launch-outline</v-icon>
                    Start Free Trial
                  </v-btn>
                  <v-btn variant="tonal" color="info" size="x-large" aria-label="Watch Demo" href="#features"
                    class="px-8">
                    <v-icon start>mdi-play-circle-outline</v-icon>
                    Watch Demo
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
                <v-img src="/images/preview-stackunity.avif" max-width="600" class="hero-image rounded-lg"
                  loading="eager" alt="StackUnity platform preview" cover></v-img>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <section class="stats-section py-8" aria-label="Key Statistics">
          <v-container>
            <v-row class="align-center justify-center">
              <v-col v-for="(stat, i) in stats" :key="i" cols="6" sm="3" class="text-center">
                <div class="stat-value text-h3 font-weight-bold primary--text mb-1">{{ stat.value }}</div>
                <div class="stat-label text-subtitle-2 text-medium-emphasis">{{ stat.label }}</div>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <section id="features" class="py-16" aria-labelledby="features-heading">
          <v-container>
            <div class="text-center mb-12">
              <span class="section-subtitle">POWERFUL TOOLS</span>
              <h2 id="features-heading" class="text-h3 font-weight-bold mb-3">Features That Boost Your Productivity</h2>
              <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
                StackUnity combines all the tools you need to develop modern web applications in one intuitive platform.
              </p>
            </div>

            <v-row>
              <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4" class="mb-8">
                <article class="feature-card h-100 rounded-lg">
                  <v-card class="feature-card h-100 rounded-lg" flat>
                    <v-card-text class="pa-6">
                      <v-avatar :color="feature.color" size="56" class="mb-4">
                        <v-icon dark size="32">{{ feature.icon }}</v-icon>
                      </v-avatar>
                      <h3 class="text-h5 font-weight-bold mb-3">{{ feature.title }}</h3>
                      <p class="text-body-1 text-medium-emphasis">{{ feature.description }}</p>
                    </v-card-text>
                  </v-card>
                </article>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <section class="py-16" aria-labelledby="how-it-works-heading">
          <v-container>
            <div class="text-center mb-12">
              <h2 id="how-it-works-heading" class="text-h3 font-weight-bold mb-3">How It Works</h2>
              <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
                Three simple steps to start using Devroid and transform your development workflow.
              </p>
            </div>

            <v-row justify="center" class="mt-8">
              <v-col v-for="(step, i) in steps" :key="i" cols="12" md="4" class="px-4">
                <article>
                  <v-card class="h-100 rounded-xl" elevation="3" :class="`border-${step.color}`"
                    style="border-top: #00658b 4px solid;">
                    <v-card-item>
                      <v-avatar :color="step.color" size="56" class="mb-4">
                        <span class="text-h5 font-weight-bold white--text">{{ i + 1 }}</span>
                      </v-avatar>
                    </v-card-item>
                    <v-card-title class="text-h5 font-weight-bold">{{ step.title }}</v-card-title>
                    <v-card-text class="text-body-1">{{ step.description }}</v-card-text>
                    <v-card-actions class="pa-4">
                      <v-btn :color="step.color" variant="text" class="text-none" :to="step.link"
                        aria-label="Learn more">Learn more <v-icon right>mdi-arrow-right</v-icon></v-btn>
                    </v-card-actions>
                  </v-card>
                </article>
              </v-col>
            </v-row>

            <div class="d-flex justify-center mt-12">
              <v-btn size="large" color="info" variant="tonal" class="px-8 rounded-pill" elevation="2" to="/signup"
                aria-label="Get Started Now" nuxt>
                Get Started Now
                <v-icon end>mdi-rocket-launch-outline</v-icon>
              </v-btn>
            </div>
          </v-container>
        </section>

        <section id="pricing" class="py-16" aria-labelledby="pricing-heading">
          <Pricing />
        </section>

        <section id="faq" class="py-16" aria-labelledby="faq-heading">
          <Faq />
        </section>

        <section class="py-16 primary" aria-labelledby="cta-heading">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8" class="text-center">
                <h2 id="cta-heading" class="text-h3 font-weight-bold white--text mb-4">Ready to get started?</h2>
                <p class="text-subtitle-1 white--text text-opacity-high mb-8">
                  Join the community already using DevUnity for their projects.
                </p>
                <v-btn x-large color="info" variant="tonal" elevation="2" class="px-8" aria-label="Create free account"
                  to="/signup">
                  Create free account
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </main>
    </v-main>

    <footer class="py-8" aria-label="Site Footer">
      <v-container>
        <v-row>
          <v-col cols="12" md="5" lg="5" class="mb-6 mb-md-0">
            <div class="d-flex align-center mb-4">
              <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="180"
                loading="eager">
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              The all-in-one platform for developers who want to create, manage and optimize their web projects.
            </p>
            <div class="newsletter-signup mb-6">
              <form class="d-flex" aria-label="Newsletter Subscription">
                <v-text-field v-model="email" density="compact" placeholder="Your email address"
                  aria-label="Your email address" variant="outlined" hide-details class="mr-2"
                  prepend-inner-icon="mdi-email-outline"></v-text-field>
                <v-btn color="info" variant="tonal" class="ml-n1" :loading="loading" @click="submitEmail" type="submit">
                  Subscribe
                </v-btn>
              </form>
              <p class="text-caption text-medium-emphasis mt-1">
                Receive our latest news and development tips
              </p>
            </div>
            <nav aria-label="Social Media Links">
              <div class="d-flex">
                <v-btn icon variant="text" class="mr-3" href="https://twitter.com" target="_blank" aria-label="Twitter">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon variant="text" class="mr-3" href="https://github.com/nurdjedidi/devunity" target="_blank"
                  aria-label="GitHub">
                  <v-icon>mdi-github</v-icon>
                </v-btn>
                <v-btn icon variant="text" class="mr-3" href="https://linkedin.com" target="_blank"
                  aria-label="LinkedIn">
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </div>
            </nav>
          </v-col>

          <v-col cols="12" md="7" lg="7">
            <v-row class="footer-columns-container">
              <v-col v-for="(column, index) in footerColumns" :key="index" cols="6" md="4" class="footer-column px-4">
                <h4 id="footer-column-heading-{{index}}" class="text-subtitle-1 font-weight-bold mb-4">{{ column.title
                }}
                </h4>
                <nav class="footer-links" aria-labelledby="footer-column-heading-{{index}}">
                  <NuxtLink v-for="(link, linkIndex) in column.links" :key="linkIndex" :to="link.to"
                    class="footer-link d-block mb-3">
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
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </div>
          <div class="d-flex align-center">
            <a href="mailto:contact@stackunity.com"
              class="text-body-2 text-decoration-none text-medium-emphasis">support@stackunity.com</a>
          </div>
        </div>
      </v-container>
    </footer>

    <Snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="snackbarTimeout" />
  </v-app>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore 
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'empty'
})

useHead({
  title: 'StackUnity - Create, manage and optimize your web projects.',
  meta: [
    { name: 'description', content: 'StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'keywords', content: 'development hub, collaborative development platform, integrated development tools' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'StackUnity - The all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { property: 'og:description', content: 'StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:url', content: 'https://stackunity.tech' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'StackUnity Logo' },
    { property: 'og:image:secure_url', content: 'https://stackunity.tech/images/preview.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'StackUnity - The all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'twitter:description', content: 'StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'twitter:image', content: '/images/preview.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.tech' }
  ]
})

const Pricing = defineAsyncComponent(() => import('../components/pricing.vue'));
const Faq = defineAsyncComponent(() => import('../components/faq.vue'));

const stats = [
  { value: '10x', label: 'Faster Development' },
  { value: '100%', label: 'Code Quality' },
  { value: '24/7', label: 'Support' },
  { value: '50+', label: 'Tools Available' }
];

const features = [
  {
    title: 'Code Snippets',
    description: 'Create, share and reuse code snippets to speed up your development.',
    icon: 'mdi-code-tags',
    color: 'primary'
  },
  {
    title: 'SQL Generator',
    description: 'Visually design your database schemas and generate the corresponding SQL code.',
    icon: 'mdi-database',
    color: 'info'
  },
  {
    title: 'Website Audit',
    description: 'Analyze and optimize your websites performance to improve their visibility.',
    icon: 'mdi-magnify',
    color: 'success'
  },
  {
    title: 'API Testing',
    description: 'Test your APIs for security vulnerabilities and performance issues.',
    icon: 'mdi-api',
    color: 'warning'
  },
  {
    title: 'Accessibility',
    description: 'Check and improve the accessibility of your websites for all users.',
    icon: 'mdi-access-point',
    color: 'error'
  },
  {
    title: 'Design Studio',
    description: 'Create modern user interfaces with our integrated design studio.',
    icon: 'mdi-palette',
    color: 'secondary'
  }
];

const steps = [
  {
    title: 'Create your account',
    description: 'Sign up for free and set up your developer profile in minutes.',
    link: '/signup',
    color: 'primary'
  },
  {
    title: 'Choose your tools',
    description: 'Select the tools you need for your project from our wide range of features.',
    link: '/signup',
    color: 'info'
  },
  {
    title: 'Develop faster',
    description: 'Use our tools to speed up your development and improve the quality of your projects.',
    link: '/signup',
    color: 'success'
  }
];

const menuItems = [
  { title: 'Features', href: '#features', icon: 'mdi-apps-box' },
  { title: 'Pricing', href: '#pricing', icon: 'mdi-tag-outline' },
  { title: 'FAQ', href: '#faq', icon: 'mdi-frequently-asked-questions' }
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { title: 'Features', to: '#features' },
      { title: 'Pricing', to: '#pricing' },
      { title: 'FAQ', to: '#faq' }
    ]
  },
  {
    title: 'Company',
    links: [
      { title: 'About', to: '/about' },
      { title: 'Contact', to: '/contact' },
      { title: 'Blog', to: '/' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy', to: '/privacy' },
      { title: 'Terms', to: '/terms' },
      { title: 'Notices', to: '/notices' }
    ]
  }
];

const drawer = ref(false);
const activeSection = ref('');
const showAppBar = ref(true);
const email = ref('');
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const snackbarTimeout = ref(2000);
const loading = ref(false);
const isClient = ref(false);

const userStore = useUserStore();

const display = useDisplay();

onMounted(() => {
  isClient.value = true;
});

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

const showMessage = (message: string, type = 'info', timeout = 3000) => {
  snackbarText.value = message;
  snackbarColor.value = type;
  snackbarTimeout.value = timeout;
  showSnackbar.value = true;
};

</script>

<style scoped>
.landing-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.main-content {
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 70% 30%, rgba(103, 90, 200, 0.4), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(45, 158, 225, 0.4), transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(200, 80, 190, 0.3), transparent 40%),
    radial-gradient(circle at 10% 10%, rgba(24, 144, 132, 0.3), transparent 35%),
    linear-gradient(120deg, rgba(10, 15, 30, 0.1), rgba(20, 35, 60, 0.2));
  z-index: 0;
}

.hero-image {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.feature-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.pricing-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pricing-card--popular {
  transform: scale(1.05);
  z-index: 2;
  border: 2px solid rgba(var(--v-theme-primary), 0.5);
}

.popular-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--v-theme-primary);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 16px;
}

.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

@media (max-width: 960px) {
  .pricing-card--popular {
    transform: scale(1);
  }
}

.nav-bar {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-bar.v-app-bar--is-scrolled {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05) !important;
}

.brand-container {
  position: relative;
  transition: all 0.3s ease;
}

.logo-image {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.v-app-bar--is-scrolled .logo-image {
  transform: scale(0.9);
}

.brand-tagline {
  height: 18px;
  border-left: 2px solid rgba(var(--v-theme-primary), 0.5);
  transition: all 0.3s ease;
}

.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
}

.custom-nav-menu {
  position: relative;
}

.nav-links-wrapper {
  display: flex;
  position: relative;
}

.nav-btn {
  position: relative;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  overflow: hidden;
  height: 40px;
  transition: all 0.4s ease;
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.nav-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.nav-text {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.nav-btn-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border-radius: 4px 4px 0 0;
}

.nav-btn:hover .nav-btn-background,
.active-nav-btn .nav-btn-background {
  transform: scaleX(1);
  transform-origin: left;
}

.active-nav-btn {
  opacity: 1;
  font-weight: 600;
}

.login-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(var(--v-theme-primary), 0.3);
}

.menu-toggle-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
}

.hamburger-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: rgb(var(--v-theme-primary));
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
}

.hamburger-icon span:nth-child(1) {
  top: 0px;
}

.hamburger-icon span:nth-child(2) {
  top: 8px;
  width: 75%;
}

.hamburger-icon span:nth-child(3) {
  top: 16px;
}

.hamburger-icon.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 8px;
}

.hamburger-icon.active span:nth-child(2) {
  opacity: 0;
  width: 0%;
}

.hamburger-icon.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 8px;
}

.mobile-nav-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-nav-item {
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.mobile-nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.drawer-footer {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.footer-link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  padding: 4px 0;
  display: inline-block;
  border-radius: 4px;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
  transform: translateX(3px);
  padding-left: 3px;
}

.footer-links {
  margin-top: 8px;
}

footer h4 {
  font-size: 1rem;
  position: relative;
  display: inline-block;
}

footer h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
}

@media (max-width: 959px) {
  .footer-links {
    margin-bottom: 1.5rem;
  }
}

.footer-columns-container {
  padding-top: 1rem;
}

.footer-column {
  transition: all 0.3s ease;
}

.footer-column:hover h4::after {
  width: 40px;
}

@media (min-width: 960px) {
  .footer-column {
    border-left: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }
}
</style>
