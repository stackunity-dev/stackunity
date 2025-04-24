<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Security analysis</h3>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-shield-check</v-icon>
            Security score
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center">
              <v-progress-circular :model-value="calculateSecurityScore(result)"
                :color="getScoreColor(calculateSecurityScore(result))" size="100" width="12">
                <span class="text-h6 font-weight-bold">{{ calculateSecurityScore(result) }}%</span>
              </v-progress-circular>
            </div>
            <div class="text-center mt-4">
              <p class="text-h6" :class="`text-${getScoreColor(calculateSecurityScore(result))}`">
                {{ getScoreLabel(calculateSecurityScore(result)) }}
              </p>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-shield-alert </v-icon>
            Security issues <v-badge :content="securityIssues.length" color="error" class="ml-2" location="top end"
              offset-x="3" offset-y="-8"></v-badge>
          </v-card-title>
          <v-card-text>
            <div v-if="securityIssues.length === 0" class="d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
              <span>No security issues detected</span>
            </div>
            <v-expansion-panels v-else>
              <v-expansion-panel v-for="(issue, index) in securityIssues" :key="index">
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon :color="getSeverityColor(issue.severity)" class="mr-2">
                      {{ getSeverityIcon(issue.severity) }}
                    </v-icon>
                    <div>
                      <span class="text-subtitle-2">{{ issue.type || 'Issue' }} - {{ issue.description }}</span>
                    </div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div>
                    <p v-if="issue.element"><strong>Element : </strong>{{ issue.element }}</p>
                    <p v-if="issue.recommendation"><strong>Recommendation : </strong>{{ issue.recommendation }}</p>
                    <p v-if="issue.content"><strong>Problematic content : </strong><code>{{ issue.content }}</code>
                    </p>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-lock</v-icon>
            Basic checks
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>HTTPS</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="httpsEnabled ? 'success' : 'error'" size="small" class="mr-1">
                    {{ httpsEnabled ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ httpsEnabled ? 'Activé' : 'Non activé' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Secure cookies</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="secureCookies ? 'success' : 'error'" size="small" class="mr-1">
                    {{ secureCookies ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ secureCookies ? 'Activé' : 'Non activé' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Security headers</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="!hasMissingSecurityHeaders ? 'success' : 'warning'" size="small" class="mr-1">
                    {{ !hasMissingSecurityHeaders ? 'mdi-check-circle' : 'mdi-alert' }}
                  </v-icon>
                  {{ hasMissingSecurityHeaders ? `${missingHeadersCount} missing` : 'All present' }}
                  <v-btn v-if="hasSecurityHeaders" size="x-small" variant="text" class="ml-2"
                    @click="securityHeadersDialogOpen = true">
                    Details
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>XSS protection</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="hasXSSProtection ? 'success' : 'warning'" size="small" class="mr-1">
                    {{ hasXSSProtection ? 'mdi-check-circle' : 'mdi-alert' }}
                  </v-icon>
                  {{ hasXSSProtection ? 'Activé' : 'Non activé ou partiel' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>CSRF protection</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="hasCSRFProtection ? 'success' : 'warning'" size="small" class="mr-1">
                    {{ hasCSRFProtection ? 'mdi-check-circle' : 'mdi-alert' }}
                  </v-icon>
                  {{ hasCSRFProtection ? 'Activé' : 'Non activé or not detected' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-cookie</v-icon>
            Cookies
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center mb-4">
              <v-progress-circular :model-value="cookieScore" :color="getScoreColor(cookieScore)" size="80" width="8">
                <span class="text-subtitle-1 font-weight-bold">{{ cookieScore }}%</span>
              </v-progress-circular>
            </div>

            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Secure</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.securityChecks?.cookies?.secure ? 'success' : 'error'" size="small"
                    class="mr-1">
                    {{ result?.securityChecks?.cookies?.secure ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.securityChecks?.cookies?.secure ? 'Activé' : 'Non activé' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>HttpOnly</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.securityChecks?.cookies?.httpOnly ? 'success' : 'error'" size="small"
                    class="mr-1">
                    {{ result?.securityChecks?.cookies?.httpOnly ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.securityChecks?.cookies?.httpOnly ? 'Activé' : 'Non activé' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>SameSite</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.securityChecks?.cookies?.sameSite ? 'success' : 'error'" size="small"
                    class="mr-1">
                    {{ result?.securityChecks?.cookies?.sameSite ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.securityChecks?.cookies?.sameSite ? 'Activé' : 'Non activé' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-shield-check</v-icon>
            Security recommendations
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="!httpsEnabled" prepend-icon="mdi-lock">
                <v-list-item-title>Enable HTTPS</v-list-item-title>
                <v-list-item-subtitle>
                  HTTPS is essential for security and SEO. Get an SSL certificate and configure your site to use HTTPS
                  by default.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item
                v-if="!result?.securityChecks?.cookies?.secure || !result?.securityChecks?.cookies?.httpOnly || !result?.securityChecks?.cookies?.sameSite"
                prepend-icon="mdi-cookie">
                <v-list-item-title>Secure cookies</v-list-item-title>
                <v-list-item-subtitle>
                  Ensure all cookies have the Secure, HttpOnly, and SameSite attributes to prevent XSS and CSRF attacks.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasMissingSecurityHeaders" prepend-icon="mdi-shield">
                <v-list-item-title>Add missing security headers</v-list-item-title>
                <v-list-item-subtitle>
                  HTTP security headers are essential for protecting against various web attacks.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasXSSVulnerabilities" prepend-icon="mdi-script-text">
                <v-list-item-title>Fix XSS vulnerabilities</v-list-item-title>
                <v-list-item-subtitle>
                  Escape user inputs correctly and use Content-Security-Policy headers.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasCSRFVulnerabilities" prepend-icon="mdi-form-textbox">
                <v-list-item-title>Add CSRF protection</v-list-item-title>
                <v-list-item-subtitle>
                  Use CSRF tokens in your forms to prevent request forgery attacks.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasInjectionVulnerabilities" prepend-icon="mdi-database">
                <v-list-item-title>Prevent injections</v-list-item-title>
                <v-list-item-subtitle>
                  Use parameterized queries and validate all user inputs to prevent SQL injections and other attacks.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasSecurityIssues" prepend-icon="mdi-check-all">
                <v-list-item-title>Excellent security level</v-list-item-title>
                <v-list-item-subtitle>
                  Continue to maintain these security practices and perform regular audits.
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="securityHeadersDialogOpen" max-width="900">
      <v-card>
        <v-card-title class="text-h6">
          Security headers
          <v-spacer></v-spacer>
          <v-btn icon @click="securityHeadersDialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th>Header</th>
                <th>Status</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="header in securityHeadersList" :key="header.name">
                <td>{{ header.name }}</td>
                <td>
                  <v-icon :color="header.present ? 'success' : 'error'" size="small">
                    {{ header.present ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                  {{ header.present ? 'Present' : 'Missing' }}
                </td>
                <td>
                  <code v-if="header.present">{{ header.value || '' }}</code>
                  <span v-else class="text-grey">-</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getScoreColor } from '../../utils/seo/getScore';
import { calculateSecurityScore } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const securityHeadersDialogOpen = ref(false);

const securityIssues = computed(() => {
  return props.result?.securityChecks?.securityIssues || [];
});

const cookieScore = computed(() => {
  return props.result?.securityChecks?.cookies?.score || 0;
});

const httpsEnabled = computed(() => {
  return !!props.result?.securityChecks?.https;
});

const secureCookies = computed(() => {
  return !!props.result?.securityChecks?.cookies?.secure;
});

const hasSecurityHeaders = computed(() => {
  if (!props.result?.securityChecks?.securityHeaders) return false;

  const headers = props.result.securityChecks.securityHeaders;
  return Object.keys(headers).length > 0;
});

const hasMissingSecurityHeaders = computed(() => {
  const requiredHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection'
  ];

  if (!props.result?.securityChecks?.securityHeaders) return true;

  const headers = props.result.securityChecks.securityHeaders;
  const headerKeys = Object.keys(headers).map(h => h.toLowerCase());

  return requiredHeaders.some(header => !headerKeys.includes(header.toLowerCase()));
});

const missingHeadersCount = computed(() => {
  const requiredHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy'
  ];

  if (!props.result?.securityChecks?.securityHeaders) return requiredHeaders.length;

  const headers = props.result.securityChecks.securityHeaders;
  const headerKeys = Object.keys(headers).map(h => h.toLowerCase());

  return requiredHeaders.filter(header => !headerKeys.includes(header.toLowerCase())).length;
});

const securityHeadersList = computed(() => {
  const headersList = [
    { name: 'Content-Security-Policy', key: 'content-security-policy', present: false, value: '' },
    { name: 'Strict-Transport-Security', key: 'strict-transport-security', present: false, value: '' },
    { name: 'X-Content-Type-Options', key: 'x-content-type-options', present: false, value: '' },
    { name: 'X-Frame-Options', key: 'x-frame-options', present: false, value: '' },
    { name: 'X-XSS-Protection', key: 'x-xss-protection', present: false, value: '' },
    { name: 'Referrer-Policy', key: 'referrer-policy', present: false, value: '' },
    { name: 'Permissions-Policy', key: 'permissions-policy', present: false, value: '' },
    { name: 'Feature-Policy', key: 'feature-policy', present: false, value: '' }
  ];

  if (!props.result?.securityChecks?.securityHeaders) return headersList;

  const headers = props.result.securityChecks.securityHeaders;

  return headersList.map(header => {
    const headerValue = findHeaderValue(headers, header.key);
    return {
      ...header,
      present: !!headerValue,
      value: headerValue
    };
  });
});

const findHeaderValue = (headers: any, key: string) => {
  if (!headers) return null;

  if (headers[key] !== undefined) {
    return headers[key];
  }

  const lowerKey = key.toLowerCase();
  const headerKeys = Object.keys(headers);

  for (const headerKey of headerKeys) {
    if (headerKey.toLowerCase() === lowerKey) {
      return headers[headerKey];
    }
  }

  return null;
};

const hasXSSProtection = computed(() => {
  const headers = props.result?.securityChecks?.securityHeaders || {};

  const hasCSP = findHeaderValue(headers, 'content-security-policy');
  const hasXSSHeader = findHeaderValue(headers, 'x-xss-protection');

  return !!hasCSP || !!hasXSSHeader;
});

const hasCSRFProtection = computed(() => {
  return !hasCSRFVulnerabilities.value;
});

const hasXSSVulnerabilities = computed(() => {
  const issues = securityIssues.value || [];
  return issues.some(issue => issue.type?.toLowerCase() === 'xss');
});

const hasCSRFVulnerabilities = computed(() => {
  const issues = securityIssues.value || [];
  return issues.some(issue => issue.type?.toLowerCase() === 'csrf');
});

const hasInjectionVulnerabilities = computed(() => {
  const issues = securityIssues.value || [];
  return issues.some(issue => issue.type?.toLowerCase() === 'injection');
});

const hasSecurityIssues = computed(() => {
  return securityIssues.value.length > 0 || !httpsEnabled.value || hasMissingSecurityHeaders.value;
});

const getScoreLabel = (value: number): string => {
  if (value < 50) return 'Mauvais';
  if (value < 75) return 'Moyen';
  return 'Excellent';
};

const getSeverityColor = (severity: string): string => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'warning';
  }
};

const getSeverityIcon = (severity: string): string => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'mdi-alert-circle';
    case 'high':
      return 'mdi-alert';
    case 'medium':
      return 'mdi-alert-octagon';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-alert';
  }
};
</script>

<style scoped>
code {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  word-break: break-all;
}
</style>