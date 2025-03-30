<template>
  <v-app>
    <v-app-bar app flat elevation="2" color="surface">
      <v-container class="d-flex align-center py-0 my-0">
        <NuxtLink to="/" class="text-decoration-none">
          <div class="d-flex align-center">
            <img src="/logo/devunity-title.png" alt="DevUnity title" width="150">
          </div>
        </NuxtLink>
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/" class="ml-4">Back to Home</v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl">
              <h1 class="text-h3 font-weight-bold mb-6">Cookie Policy</h1>

              <p class="text-body-1 mb-6 font-italic">
                Last updated: {{ new Date().toLocaleDateString() }}
              </p>

              <v-card color="surface" variant="outlined" class="mb-6 pa-4">
                <h3 class="text-h6 font-weight-bold mb-3">Current status of your preferences</h3>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Essential cookies:</v-list-item-title>
                    <v-list-item-subtitle>{{ cookieStore.preferences.essential ? 'Enabled' : 'Disabled'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Functional cookies:</v-list-item-title>
                    <v-list-item-subtitle>{{ cookieStore.preferences.functional ? 'Enabled' : 'Disabled'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Analytical cookies:</v-list-item-title>
                    <v-list-item-subtitle>{{ cookieStore.preferences.analytics ? 'Enabled' : 'Disabled'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Marketing cookies:</v-list-item-title>
                    <v-list-item-subtitle>{{ cookieStore.preferences.marketing ? 'Enabled' : 'Disabled'
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <v-card-actions>
                  <v-btn color="primary" @click="openCookieSettings">
                    <v-icon start>mdi-cookie-settings</v-icon>
                    Modify settings
                  </v-btn>
                  <v-btn color="error" variant="outlined" @click="resetCookies">
                    <v-icon start>mdi-cookie-remove</v-icon>
                    Delete all cookies
                  </v-btn>
                </v-card-actions>
              </v-card>

              <p class="text-subtitle-1 mb-6">
                This cookie policy explains what cookies are, how DevUnity uses them, and what your options are
                regarding their use.
              </p>

              <h2 class="text-h4 font-weight-bold mb-4">What is a cookie?</h2>
              <p class="text-body-1 mb-6">
                A cookie is a small text file that a website saves on your computer or mobile device when you visit the
                site. It enables the website to remember your actions and preferences (such as login ID, language, font
                size, and other display preferences) for a period of time, so you don't have to re-enter them every time
                you come back to the site or browse from one page to another.
              </p>

              <h2 class="text-h4 font-weight-bold mb-4">How do we use cookies?</h2>
              <p class="text-body-1 mb-4">
                We use different types of cookies for various reasons:
              </p>
              <ul class="mb-6">
                <li class="mb-3">
                  <strong>Essential cookies</strong>: These cookies are necessary for the operation of our website and
                  cannot be disabled in our systems. They are usually set in response to actions you take that
                  constitute a request for services, such as setting your privacy preferences, logging in, or filling
                  out forms. You can set your browser to block or alert you about these cookies, but some parts of the
                  site will not work.
                </li>
                <li class="mb-3">
                  <strong>Performance cookies</strong>: These cookies allow us to count visits and traffic sources so we
                  can measure and improve the performance of our site. They help us know which pages are the most and
                  least popular and see how visitors move around the site. All information collected by these cookies is
                  aggregated and therefore anonymous.
                </li>
                <li class="mb-3">
                  <strong>Functional cookies</strong>: These cookies enable the website to provide enhanced
                  functionality and personalization. They may be set by us or by third-party providers whose services we
                  have added to our pages. If you do not allow these cookies, some or all of these services may not
                  function properly.
                </li>
                <li class="mb-3">
                  <strong>Targeting cookies</strong>: These cookies may be set on our site by our advertising partners.
                  They may be used by those companies to build a profile of your interests and show you relevant
                  advertisements on other sites. They do not directly store personal information but are based on
                  uniquely identifying your browser and internet device.
                </li>
              </ul>

              <h2 class="text-h4 font-weight-bold mb-4">List of cookies used</h2>
              <div class="mb-8">
                <v-table class="rounded-lg">
                  <thead>
                    <tr>
                      <th>Cookie name</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>devunity_session</code></td>
                      <td>Essential</td>
                      <td>Session or 14 days</td>
                      <td>Used to maintain your login session on DevUnity. Its duration is limited to your browsing
                        session, unless you check the "Remember me" option when logging in, in which case it persists
                        for 14 days.</td>
                    </tr>
                    <tr>
                      <td><code>token</code></td>
                      <td>Essential</td>
                      <td>7 days</td>
                      <td>Contains your encrypted authentication token, necessary to access secure areas of the site.
                      </td>
                    </tr>
                    <tr>
                      <td><code>devunity_preferences</code></td>
                      <td>Essential</td>
                      <td>6 months</td>
                      <td>Stores your user interface preferences, such as dark/light theme and display settings.</td>
                    </tr>
                    <tr>
                      <td><code>devunity_cookie_consent</code></td>
                      <td>Essential</td>
                      <td>12 months</td>
                      <td>Records your preferences regarding the use of cookies on our site.</td>
                    </tr>
                    <tr>
                      <td><code>devunity_lastvisit</code></td>
                      <td>Functional</td>
                      <td>30 days</td>
                      <td>Remembers your last visit to redirect you to your recent projects.</td>
                    </tr>
                    <tr>
                      <td><code>devunity_recent_projects</code></td>
                      <td>Functional</td>
                      <td>90 days</td>
                      <td>Stores the list of your recently viewed projects for quick access.</td>
                    </tr>
                    <tr>
                      <td><code>_ga, _gid, _gat</code></td>
                      <td>Analytical</td>
                      <td>_ga: 2 years, _gid: 24h, _gat: 1 min</td>
                      <td>Google Analytics cookies used to distinguish users and analyze their behavior on the site.
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <h2 class="text-h4 font-weight-bold mb-4">How to manage cookies</h2>
              <div class="mb-8">
                <p class="mb-3">You can decide at any time to accept or refuse cookies on our site in two ways:</p>

                <h3 class="text-h6 font-weight-bold mb-3">1. Use our cookie management panel</h3>
                <p class="mb-3">
                  We offer a cookie management panel integrated into our site, accessible at any time via the
                  <v-icon small>mdi-cookie-settings</v-icon> button located at the bottom right of your screen.
                </p>
                <p class="mb-6">
                  This panel allows you to precisely customize which categories of cookies you accept, and you can
                  change your preferences at any time.
                </p>

                <v-btn color="primary" class="mb-6" @click="openCookieSettings">
                  <v-icon start>mdi-cookie-settings</v-icon>
                  Open cookie settings
                </v-btn>

                <h3 class="text-h6 font-weight-bold mb-3 mt-4">2. Modify your browser settings</h3>
              </div>

              <h2 class="text-h4 font-weight-bold mb-4">Instructions for disabling cookies</h2>
              <p class="text-body-1 mb-4">
                Here's how to disable cookies in the most popular browsers:
              </p>
              <v-expansion-panels class="mb-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>Chrome</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ol>
                      <li>Click on the Chrome menu in the toolbar</li>
                      <li>Select "Settings"</li>
                      <li>Click on "Privacy and security"</li>
                      <li>Click on "Cookies and other site data"</li>
                      <li>Choose your cookie options</li>
                    </ol>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title>Firefox</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ol>
                      <li>Click on the Firefox menu</li>
                      <li>Select "Options"</li>
                      <li>Go to the "Privacy & Security" tab</li>
                      <li>In the "Enhanced Tracking Protection" section, choose "Custom"</li>
                      <li>Check or uncheck "Cookies" according to your preferences</li>
                    </ol>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title>Safari</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ol>
                      <li>In the Safari menu, select "Preferences"</li>
                      <li>Click on the "Privacy" tab</li>
                      <li>In the "Cookies and website data" section, choose your preferred option</li>
                    </ol>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title>Microsoft Edge</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ol>
                      <li>Click on the Edge menu (the three dots in the upper right corner)</li>
                      <li>Select "Settings"</li>
                      <li>Click on "Privacy, search, and services"</li>
                      <li>Under "Privacy", choose your cookie blocking level</li>
                    </ol>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <h2 class="text-h4 font-weight-bold mb-4">Changes to our cookie policy</h2>
              <p class="text-body-1 mb-6">
                We may update this policy from time to time to reflect, for example, changes in the cookies we use or
                for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to
                stay informed about our use of cookies and related technologies.
              </p>

              <h2 class="text-h4 font-weight-bold mb-4">Contact us</h2>
              <p class="text-body-1 mb-6">
                If you have any questions about our use of cookies or other technologies, please contact us at <a
                  href="mailto:privacy@devunity.com" class="text-decoration-underline">privacy@devunity.com</a>.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="py-4">
      <v-container>
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} DevUnity. All rights reserved.
          </p>
        </div>
      </v-container>
    </v-footer>

    <div>
      <v-dialog v-model="showSettings" width="500">
        <v-card>
          <v-card-title class="text-h5 pb-2">
            Cookie Preferences
          </v-card-title>
          <v-card-subtitle>
            Customize your cookie preferences
          </v-card-subtitle>

          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-switch v-model="cookieStore.preferences.essential" label="Essential cookies" color="primary"
                    disabled hide-details inset></v-switch>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1">
                  Necessary for the site to function, they cannot be disabled.
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title>
                  <v-switch v-model="cookieStore.preferences.functional" label="Functional cookies" color="primary"
                    hide-details inset></v-switch>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1">
                  Allow us to remember your preferences and personalize your experience.
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title>
                  <v-switch v-model="cookieStore.preferences.analytics" label="Analytical cookies" color="primary"
                    hide-details inset></v-switch>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1">
                  Help us understand how you use our site in order to improve it.
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title>
                  <v-switch v-model="cookieStore.preferences.marketing" label="Marketing cookies" color="primary"
                    hide-details inset></v-switch>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1">
                  Allow us to display personalized advertisements based on your interests.
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn variant="text" color="error" @click="cookieStore.rejectNonEssentialCookies(); showSettings = false">
              Reject all
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="grey" @click="showSettings = false">
              Cancel
            </v-btn>
            <v-btn color="primary" variant="elevated"
              @click="cookieStore.updatePreferences(cookieStore.preferences); showSettings = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts" setup>
import { useCookieStore } from '~/stores/cookieStore';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Cookie Policy - DevUnity',
  meta: [
    { name: 'description', content: 'Learn how DevUnity uses cookies and similar technologies to improve your experience on our platform.' },
    { name: 'keywords', content: 'cookies, policy, privacy, DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'DevUnity' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'theme-color', content: '#000000' },
    { name: 'og:title', content: 'Cookie Policy - DevUnity' },
    { name: 'og:description', content: 'Learn how DevUnity uses cookies and similar technologies to improve your experience on our platform.' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
});

const cookieStore = useCookieStore();

const showSettings = ref(false);

function openCookieSettings() {
  showSettings.value = true;
}

function resetCookies() {
  cookieStore.resetConsent();
  window.location.reload();
}
</script>

<style scoped>
a {
  color: rgb(var(--v-theme-primary));
  transition: all 0.2s ease;
}

a:hover {
  opacity: 0.8;
}

.v-expansion-panels {
  background-color: transparent;
}

.v-table {
  background-color: transparent;
}
</style>