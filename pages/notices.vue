<template>
  <v-app>
    <header>
      <v-app-bar app flat elevation="2" color="surface" role="navigation" aria-label="Main Navigation">
        <v-container class="d-flex align-center py-0 my-0">
          <NuxtLink to="/" class="text-decoration-none" aria-label="Go to homepage">
            <div class="d-flex align-center">
              <img src="/logo/stackunity-title.png" alt="StackUnity title" width="150">
            </div>
          </NuxtLink>
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/" class="ml-4" aria-label="Back to home">Back to home</v-btn>
        </v-container>
      </v-app-bar>
    </header>

    <main role="main">
      <div class="notices-hero py-16" role="banner" aria-labelledby="page-title">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <h1 id="page-title" class="text-h2 font-weight-bold mb-4 text-white">Legal Notices & Credits</h1>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl elevation-3">
              <section class="mb-12" id="legal" aria-labelledby="section-legal">
                <h2 id="section-legal" class="text-h4 font-weight-bold mb-6 primary--text">Legal Notices</h2>
                <p class="text-body-1 mb-4">
                  StackUnity is published by StackUnity Corporation, registered under the SIRET number
                  93872035600014.
                </p>
                <p class="text-body-1 mb-4">
                  Publisher : Nûr Djedidi
                </p>
                <p class="text-body-1 mb-4">
                  Contact : support@stackunity.tech
                </p>
                <p class="text-body-1 mb-4">
                  Host : DigitalOcean, 101 Avenue of the Americas, New York, NY 10013, United States
                </p>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section class="mb-12" id="privacy" aria-labelledby="section-privacy">
                <h2 id="section-privacy" class="text-h4 font-weight-bold mb-6 primary--text">Privacy Policy</h2>
                <p class="text-body-1 mb-4">
                  StackUnity is committed to protecting your personal data in accordance with the General Data
                  Protection Regulation (GDPR) and the French Data Protection Act.
                </p>
                <h3 class="text-h6 font-weight-bold mt-6 mb-4">Collection and Use</h3>
                <p class="text-body-1 mb-4">
                  The personal data collected (name, first name, email address) are only used for the management of
                  your account and the improvement of our services. No data is transmitted to third parties without
                  your explicit consent.
                </p>
                <h3 class="text-h6 font-weight-bold mt-6 mb-4">User Rights</h3>
                <p class="text-body-1 mb-4">
                  In accordance with the applicable legislation, you have the right to access, rectify, delete and
                  oppose the processing of your personal data. To exercise these rights, please contact us at
                  <a href="mailto:privacy@stackunity.tech"
                    aria-label="Send email to privacy@stackunity.tech">privacy@stackunity.tech</a>.
                </p>
                <div class="d-flex align-center mt-6">
                  <v-btn color="primary" to="/privacy" size="small" variant="tonal" class="mr-3"
                    aria-label="View full privacy policy">
                    Full Privacy Policy
                    <v-icon end aria-hidden="true">mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
                <div class="text-caption text-medium-emphasis structured-data-info" itemscope
                  itemtype="http://schema.org/PrivacyPolicy" aria-hidden="true">
                  <meta itemprop="name" content="StackUnity Privacy Policy" />
                  <meta itemprop="url" content="https://stackunity.tech/privacy" />
                  <meta itemprop="author" content="StackUnity" />
                  <meta itemprop="dateModified" content="2023-06-01" />
                </div>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section class="mb-12" id="cookies" aria-labelledby="cookies-heading">
                <h2 id="cookies-heading" class="text-h4 font-weight-bold mb-6 primary--text">Cookie Policy</h2>
                <p class="text-body-1 mb-4">
                  Our site uses cookies to improve your experience and analyze traffic. Cookies are small text files
                  stored on your browser that allow us to personalize your experience and understand how you use our
                  site.
                </p>
                <h3 class="text-h6 font-weight-bold mt-6 mb-4">Types of Cookies Used</h3>
                <ul class="text-body-1 mb-4 pl-4" aria-label="Types of cookies used on our site">
                  <li class="mb-2">Essential Cookies: necessary for the site to function</li>
                  <li class="mb-2">Analytical Cookies: to understand how users interact with our site</li>
                  <li class="mb-2">Preference Cookies: to remember your choices and personalizations</li>
                </ul>
                <p class="text-body-1 mb-4">
                  You can manage your cookie preferences at any time from the settings of your browser.
                </p>
                <div class="text-caption text-medium-emphasis structured-data-info" itemscope
                  itemtype="http://schema.org/WebSite" aria-hidden="true">
                  <meta itemprop="name" content="StackUnity" />
                  <meta itemprop="url" content="https://stackunity.tech" />
                  <div itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction">
                    <meta itemprop="target" content="https://stackunity.tech/search?q={search_term_string}" />
                    <meta itemprop="query-input" content="required name=search_term_string" />
                  </div>
                </div>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section class="mb-12" id="credits" aria-labelledby="credits-heading">
                <h2 id="credits-heading" class="text-h4 font-weight-bold mb-6 primary--text">Credits & Open Source</h2>
                <p class="text-body-1 mb-4">
                  StackUnity is proud to use and contribute to the open source ecosystem. Our platform relies on several
                  open source libraries
                  and frameworks, whose copyright belong to their respective authors.
                </p>

                <v-expansion-panels variant="accordion" class="mb-6" aria-label="Open source licenses">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      Vuetify MIT License
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <pre class="text-body-2 pa-4 bg-grey-lighten-4 rounded-lg">
The MIT License (MIT)

Copyright (c) 2016-2023 John Jeremy Leider

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</pre>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <h3 class="text-h6 font-weight-bold mt-6 mb-4" id="frameworks-libraries">Frameworks & Libraries</h3>
                <div class="libraries-grid" aria-labelledby="frameworks-libraries">
                  <v-row>
                    <v-col cols="12" sm="6" md="4" v-for="(lib, index) in libraries.slice(0, 6)" :key="index">
                      <v-card flat class="library-card pa-4 h-100">
                        <div class="d-flex align-center mb-2">
                          <v-avatar :color="lib.color" size="36" class="mr-3" aria-hidden="true">
                            <v-icon dark size="20">{{ lib.icon }}</v-icon>
                          </v-avatar>
                          <h4 class="text-subtitle-1 font-weight-bold">{{ lib.name }}</h4>
                        </div>
                        <p class="text-caption mb-2">{{ lib.description }}</p>
                        <div class="d-flex align-center">
                          <v-chip size="x-small" :color="lib.color" class="mr-2"
                            aria-label="License: {{ lib.license }}">{{ lib.license }}</v-chip>
                          <v-spacer></v-spacer>
                          <v-btn size="small" variant="text" color="primary" :href="lib.url" target="_blank"
                            aria-label="Visit {{ lib.name }} website">
                            <v-icon size="small" aria-hidden="true">mdi-open-in-new</v-icon>
                          </v-btn>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-expansion-panels variant="accordion" class="mt-6" aria-label="All libraries list">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      See all libraries ({{ libraries.length }})
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-table aria-label="Complete list of libraries used">
                        <thead>
                          <tr>
                            <th scope="col">Library</th>
                            <th scope="col">License</th>
                            <th scope="col">Description</th>
                            <th scope="col">Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(lib, index) in libraries" :key="index">
                            <td class="font-weight-medium">{{ lib.name }}</td>
                            <td><v-chip size="x-small" :color="lib.color" aria-label="License: {{ lib.license }}">{{
                              lib.license }}</v-chip></td>
                            <td class="text-caption">{{ lib.description }}</td>
                            <td>
                              <v-btn size="x-small" variant="text" :href="lib.url" target="_blank" icon
                                aria-label="Visit {{ lib.name }} website">
                                <v-icon size="small" aria-hidden="true">mdi-open-in-new</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <div class="quote-block my-8 pa-6 rounded-lg" role="note"
                  aria-label="Thank you note to open source contributors">
                  <p class="text-body-1 font-italic mb-0">
                    We thank all open source contributors whose work made it possible to create StackUnity.
                    If you think a library is not correctly attributed, please contact us at legal@stackunity.tech.
                  </p>
                </div>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section id="contact-section" aria-labelledby="contact-heading">
                <h2 id="contact-heading" class="text-h4 font-weight-bold mb-6 primary--text">Contact</h2>
                <p class="text-body-1 mb-6">
                  For any question concerning our legal notices, our privacy policy or our credits, please contact us.
                </p>
                <v-btn color="primary" to="/contact" size="large" class="px-8 py-3 rounded-pill" elevation="2"
                  aria-label="Navigate to contact page">
                  Contact Us
                  <v-icon end aria-hidden="true">mdi-arrow-right</v-icon>
                </v-btn>
              </section>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </main>

    <footer class="py-6 bg-surface" role="contentinfo">
      <v-container>
        <div class="d-flex flex-column flex-md-row justify-space-between align-center">
          <div class="mb-4 mb-md-0">
            <img src="/logo/stackunity-title.png" alt="StackUnity title" width="120">
          </div>
          <div class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Legal Notices & Credits - StackUnity | Open Source Licenses & GDPR Compliance',
  meta: [
    { name: 'description', content: 'Official legal notices, GDPR privacy policy compliance information, and open source credits for StackUnity web development platform. Transparency & compliance information.' },
    { name: 'keywords', content: 'StackUnity legal notices, terms of service, GDPR compliance, privacy policy, data protection, cookies policy, open source licenses, MIT license, technical credits, web development compliance' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Legal Notices & Credits - StackUnity | Open Source Licenses & GDPR' },
    { name: 'og:description', content: 'Official legal notices, privacy policy (GDPR compliance) and open source credits for StackUnity web development platform.' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: 'https://stackunity.com/notices' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Legal Notices & Credits - StackUnity' },
    { name: 'twitter:description', content: 'Official legal notices, privacy policy and open source credits for the StackUnity platform.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/notices' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#page-title", "#section-legal", "#section-privacy"]
        },
        "name": "Legal Notices & Credits - StackUnity",
        "description": "Official legal notices, privacy policy (GDPR compliance) and open source credits for StackUnity web development platform.",
        "publisher": {
          "@type": "Organization",
          "name": "StackUnity",
          "logo": {
            "@type": "ImageObject",
            "url": "https://stackunity.com/logo/stackunity-title.png"
          }
        },
        "mainEntity": {
          "@type": "WebSite",
          "url": "https://stackunity.com",
          "name": "StackUnity"
        },
        "potentialAction": {
          "@type": "ReadAction",
          "target": "https://stackunity.com/notices"
        }
      })
    }
  ]
});

const libraries = [
  {
    name: 'Vue.js',
    description: 'Progressive JavaScript framework for building user interfaces',
    license: 'MIT',
    color: 'success',
    icon: 'mdi-vuejs',
    url: 'https://github.com/vuejs/vue'
  },
  {
    name: 'Nuxt.js',
    description: 'Vue.js framework for creating universal web applications',
    license: 'MIT',
    color: 'success',
    icon: 'mdi-nuxt',
    url: 'https://github.com/nuxt/nuxt'
  },
  {
    name: 'Vuetify',
    description: 'Material Design components library for Vue.js',
    license: 'MIT',
    color: 'primary',
    icon: 'mdi-vuetify',
    url: 'https://github.com/vuetifyjs/vuetify'
  },
  {
    name: 'Cheerio',
    description: 'Fast and flexible implementation of jQuery for server-side HTML parsing',
    license: 'MIT',
    color: 'warning',
    icon: 'mdi-code-tags',
    url: 'https://github.com/cheeriojs/cheerio'
  },
  {
    name: 'Pinia',
    description: 'State management library for Vue.js',
    license: 'MIT',
    color: 'yellow',
    icon: 'mdi-database',
    url: 'https://github.com/vuejs/pinia'
  },
  {
    name: 'systeminformation',
    description: 'Library for obtaining detailed system information',
    license: 'MIT',
    color: 'info',
    icon: 'mdi-monitor-dashboard',
    url: 'https://github.com/sebhildebrandt/systeminformation'
  },
  {
    name: 'Axios',
    description: 'HTTP client based on promises for the browser and Node.js',
    license: 'MIT',
    color: 'purple',
    icon: 'mdi-web',
    url: 'https://github.com/axios/axios'
  },
  {
    name: 'jsonwebtoken',
    description: 'Implementation of JSON Web Tokens',
    license: 'MIT',
    color: 'red',
    icon: 'mdi-key',
    url: 'https://github.com/auth0/node-jsonwebtoken'
  },
  {
    name: 'bcrypt',
    description: 'Password hashing library',
    license: 'MIT',
    color: 'grey',
    icon: 'mdi-security',
    url: 'https://github.com/kelektiv/node.bcrypt.js'
  },
  {
    name: 'marked',
    description: 'Markdown parser',
    license: 'MIT',
    color: 'blue-grey',
    icon: 'mdi-markdown',
    url: 'https://github.com/markedjs/marked'
  },
  {
    name: 'highlight.js',
    description: 'Syntax highlighting for the web',
    license: 'BSD-3-Clause',
    color: 'amber',
    icon: 'mdi-code-braces',
    url: 'https://github.com/highlightjs/highlight.js'
  },
  {
    name: 'date-fns',
    description: 'Modern JavaScript date manipulation library',
    license: 'MIT',
    color: 'teal',
    icon: 'mdi-calendar',
    url: 'https://github.com/date-fns/date-fns'
  }
];
</script>

<style scoped>
.notices-hero {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-secondary) 100%);
  position: relative;
  overflow: hidden;
}

.notices-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmMDUiPjwvcmVjdD4KPHBhdGggZD0iTTI4IDY2TDAgNTBMMCAxNkwyOCAwTDU2IDE2TDU2IDUwTDI4IDY2TDI4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8cGF0aCBkPSJNMjggMEwyOCAzNEw1NiA1MEw1NiAxNkwyOCAwWiIgZmlsbD0iI2ZmZmZmZjA1IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==');
  opacity: 0.3;
}

.quote-block {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-left: 6px solid rgb(var(--v-theme-primary));
}

.library-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-on-surface), 0.02);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.library-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

a {
  color: rgb(var(--v-theme-primary));
  transition: all 0.2s ease;
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.libraries-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 20px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}
</style>
