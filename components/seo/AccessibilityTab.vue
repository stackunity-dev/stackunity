<template>
  <div class="pa-4" role="tabpanel" aria-labelledby="accessibility-tab">
    <h3 class="text-h5 mb-4" id="accessibility-tab">Accessibility</h3>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start :color="getScoreColor(calculateAccessibilityScore(props.result))"
              aria-hidden="true">mdi-eye-check</v-icon>
            <span id="accessibility-score">Accessibility Score</span>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center pa-4">
              <v-progress-circular :model-value="calculateAccessibilityScore(props.result)"
                :color="getScoreColor(calculateAccessibilityScore(props.result))" size="150" width="15"
                role="progressbar" :aria-valuenow="calculateAccessibilityScore(props.result)" aria-valuemin="0"
                aria-valuemax="100" :aria-labelledby="accessibility - score">
                <div class="text-h4">{{ calculateAccessibilityScore(props.result) }}%</div>
              </v-progress-circular>
            </div>

            <p class="text-body-1 text-center mt-4" role="status">
              {{ getScoreMessage(calculateAccessibilityScore(props.result)) }}
            </p>

            <v-divider class="my-4" role="separator"></v-divider>

            <v-row class="mt-2">
              <v-col v-for="(item, index) in accessibilityCategories" :key="index" cols="12" sm="6">
                <div class="d-flex align-center mb-2">
                  <div class="text-subtitle-2 mr-auto" :id="`category-${index}`">{{ item.name }}</div>
                  <div class="text-subtitle-2 font-weight-bold" :class="`text-${getScoreColor(item.score)}`"
                    role="status" :aria-labelledby="`category-${index}`">
                    {{ item.score }}%
                  </div>
                </div>
                <v-progress-linear :model-value="item.score" :color="getScoreColor(item.score)" height="8" rounded
                  role="progressbar" :aria-valuenow="item.score" aria-valuemin="0" aria-valuemax="100"
                  :aria-labelledby="`category-${index}`"></v-progress-linear>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start aria-hidden="true">mdi-list-status</v-icon>
            <span id="issues-summary">Summary of Issues</span>
          </v-card-title>
          <v-card-text>
            <div v-if="hasNoIssues" class="text-center pa-4" role="status" aria-live="polite">
              <v-icon color="success" size="large" class="mb-2" aria-hidden="true">mdi-check-circle</v-icon>
              <p class="text-h6 text-success">No issues detected!</p>
              <p class="text-body-1">Your site seems accessible.</p>
            </div>
            <div v-else role="region" aria-labelledby="issues-summary">
              <div class="text-center mb-4">
                <p class="text-body-1" role="status">
                  <strong>{{ totalIssuesCount }}</strong> accessibility issues detected
                </p>
              </div>

              <v-row>
                <v-col cols="6" sm="3">
                  <v-card variant="flat" class="rounded-lg pa-3" color="error-lighten-4" min-height="100" role="status"
                    aria-label="ARIA Issues count">
                    <div class="d-flex flex-column justify-center align-center h-100">
                      <div class="text-h4 font-weight-bold text-error">{{ result?.accessibility?.missingAria || 0 }}
                      </div>
                      <div class="text-caption text-center">ARIA Issues</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card variant="flat" class="rounded-lg pa-3" color="warning-lighten-4" min-height="100"
                    role="status" aria-label="Missing Alt text count">
                    <div class="d-flex flex-column justify-center align-center h-100">
                      <div class="text-h4 font-weight-bold text-warning">{{ result?.accessibility?.missingAlt || 0 }}
                      </div>
                      <div class="text-caption text-center">Missing Alt</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card variant="flat" class="rounded-lg pa-3" color="info-lighten-4" min-height="100" role="status"
                    aria-label="Form Labels issues count">
                    <div class="d-flex flex-column justify-center align-center h-100">
                      <div class="text-h4 font-weight-bold text-info">{{ result?.accessibility?.missingLabels || 0 }}
                      </div>
                      <div class="text-caption text-center">Form Labels</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6" sm="3">
                  <v-card variant="flat" class="rounded-lg pa-3" color="grey-lighten-3" min-height="100" role="status"
                    aria-label="Contrast issues count">
                    <div class="d-flex flex-column justify-center align-center h-100">
                      <div class="text-h4 font-weight-bold">{{ result?.accessibility?.contrastIssues || 0 }}</div>
                      <div class="text-caption text-center">Contrast</div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ARIA Issues Section -->
    <v-card v-if="hasAriaIssues" variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="error" aria-hidden="true">mdi-code-tags</v-icon>
        <span id="aria-issues">ARIA Issues Detected</span>
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-4">
          ARIA attributes help make web content more accessible to people with disabilities.
          The following issues were detected:
        </p>

        <v-list role="list" aria-labelledby="aria-issues">
          <v-list-item v-for="(issue, index) in ariaIssues" :key="index" class="mb-2 rounded-lg" color="error-lighten-5"
            role="listitem">
            <template v-slot:prepend>
              <v-icon color="error" aria-hidden="true">mdi-alert-circle</v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">{{ issue.element }}</v-list-item-title>
            <v-list-item-subtitle>{{ issue.issue }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-alert v-if="hasHighMissingAria" color="error" class="mt-4" variant="tonal" role="alert">
          <div class="text-subtitle-1 font-weight-bold mb-2">High number of missing ARIA attributes</div>
          <div class="text-body-2">
            Your page has {{ result?.accessibility?.missingAria }} missing ARIA attributes.
            ARIA attributes are crucial for screen readers to properly interpret your content.
          </div>
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Form Accessibility Issues -->
    <v-card v-if="hasFormIssues" variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="warning" aria-hidden="true">mdi-form-textbox</v-icon>
        <span id="form-issues">Form Accessibility Issues</span>
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 mb-4">
          Forms should be accessible to all users, including those using assistive technologies.
        </p>

        <v-list v-if="hasInputIssues" role="list" aria-labelledby="form-issues">
          <v-list-item v-for="(issue, index) in inputIssues" :key="index" class="mb-2 rounded-lg"
            color="warning-lighten-5" role="listitem">
            <template v-slot:prepend>
              <v-icon color="warning" aria-hidden="true">mdi-alert</v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">{{ issue.element }}</v-list-item-title>
            <v-list-item-subtitle>{{ issue.issue }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-alert v-if="hasMissingLabels" color="warning" class="mt-4" variant="tonal" role="alert">
          <div class="text-subtitle-1 font-weight-bold mb-2">Missing Form Labels</div>
          <div class="text-body-2">
            Forms have {{ result?.accessibility?.missingLabels }} missing labels. Form controls should have associated
            labels.
          </div>
        </v-alert>

        <v-alert v-if="hasMissingInputAttributes" color="warning" class="mt-4" variant="tonal" role="alert">
          <div class="text-subtitle-1 font-weight-bold mb-2">Missing Input Attributes</div>
          <div class="text-body-2">
            {{ result?.accessibility?.missingInputAttributes }} input fields are missing required attributes like
            aria-label or placeholder.
          </div>
        </v-alert>
      </v-card-text>
    </v-card>

    <v-card variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start aria-hidden="true">mdi-checkbox-marked-circle-auto-outline</v-icon>
        <span id="wcag-conformity">WCAG Conformity</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card variant="flat" class="rounded-lg pa-3" :color="wcagAColor" role="status"
              aria-label="WCAG Level A conformity status">
              <div class="d-flex flex-column justify-center align-center h-100">
                <div class="text-h5 font-weight-bold">Level A</div>
                <div class="text-caption text-center">{{ wcagAConformity }}</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card variant="flat" class="rounded-lg pa-3" :color="wcagAAColor" role="status"
              aria-label="WCAG Level AA conformity status">
              <div class="d-flex flex-column justify-center align-center h-100">
                <div class="text-h5 font-weight-bold">Level AA</div>
                <div class="text-caption text-center">{{ wcagAAConformity }}</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <v-card variant="flat" class="rounded-lg pa-3" :color="wcagAAAColor" role="status"
              aria-label="WCAG Level AAA conformity status">
              <div class="d-flex flex-column justify-center align-center h-100">
                <div class="text-h5 font-weight-bold">Level AAA</div>
                <div class="text-caption text-center">{{ wcagAAAConformity }}</div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon start aria-hidden="true">mdi-information</v-icon>
                About WCAG Levels
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="text-body-2">
                <p><strong>Level A:</strong> The most basic web accessibility features. Essential for accessibility.</p>
                <p><strong>Level AA:</strong> Deals with the biggest and most common barriers for disabled users. Most
                  organizations aim for this level.</p>
                <p><strong>Level AAA:</strong> The highest level of web accessibility. Provides additional enhancements.
                </p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <!-- General Accessibility Recommendations -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start>mdi-lightbulb-outline</v-icon>
        Accessibility Recommendations
      </v-card-title>
      <v-card-text>
        <v-alert color="info" class="mb-3" variant="tonal" v-if="calculateAccessibilityScore(props.result) < 70">
          <div class="text-subtitle-1 font-weight-bold mb-2">General Recommendations</div>
          <div class="text-body-2">
            <ul>
              <li v-if="result?.accessibility?.missingAria > 0">Add ARIA attributes to interactive elements</li>
              <li v-if="result?.accessibility?.missingAlt > 0">Add alt text to all images</li>
              <li v-if="result?.accessibility?.missingLabels > 0">Ensure all form controls have associated labels</li>
              <li v-if="result?.accessibility?.contrastIssues > 0">Fix contrast issues for better readability</li>
              <li v-if="result?.accessibility?.missingInputAttributes > 0">Add required attributes to input fields</li>
              <li v-if="ariaIssues.length > 0">Fix the ARIA references and ensure all IDs exist</li>
            </ul>
          </div>
        </v-alert>

        <v-alert v-for="(recommendation, index) in accessibilityRecommendations" :key="index"
          :color="recommendation.priority === 'high' ? 'error' : recommendation.priority === 'medium' ? 'warning' : 'info'"
          class="mb-3" variant="tonal" density="comfortable">
          <div class="text-subtitle-1 font-weight-bold mb-2">{{ recommendation.title }}</div>
          <div class="text-body-2">{{ recommendation.description }}</div>
          <div v-if="recommendation.example" class="mt-2 bg-grey-lighten-4 pa-2 rounded">
            <code>{{ recommendation.example }}</code>
          </div>
        </v-alert>

        <v-alert v-if="hasNoIssues && accessibilityRecommendations.length === 0" type="success" class="mb-3"
          variant="tonal">
          No specific recommendations to suggest. Your site already has good accessibility practices.
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calculateAccessibilityScore } from '../../utils/seo/metrics';

interface AccessibilityCategory {
  name: string;
  score: number;
}

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const ariaIssues = computed(() => {
  return props.result?.accessibility?.ariaIssues || [];
});

const inputIssues = computed(() => {
  return props.result?.accessibility?.inputIssues || [];
});

const hasAriaIssues = computed(() => {
  return ariaIssues.value.length > 0 || (props.result?.accessibility?.missingAria || 0) > 0;
});

const hasHighMissingAria = computed(() => {
  return (props.result?.accessibility?.missingAria || 0) > 5;
});

const hasFormIssues = computed(() => {
  return (props.result?.accessibility?.missingLabels || 0) > 0 ||
    (props.result?.accessibility?.missingInputAttributes || 0) > 0 ||
    inputIssues.value.length > 0;
});

const hasMissingLabels = computed(() => {
  return (props.result?.accessibility?.missingLabels || 0) > 0;
});

const hasMissingInputAttributes = computed(() => {
  return (props.result?.accessibility?.missingInputAttributes || 0) > 0;
});

const hasInputIssues = computed(() => {
  return inputIssues.value.length > 0;
});

const totalIssuesCount = computed(() => {
  return (props.result?.accessibility?.missingAria || 0) +
    (props.result?.accessibility?.missingAlt || 0) +
    (props.result?.accessibility?.missingLabels || 0) +
    (props.result?.accessibility?.missingInputAttributes || 0) +
    (props.result?.accessibility?.contrastIssues || 0) +
    ariaIssues.value.length +
    inputIssues.value.length;
});

const hasNoIssues = computed(() => {
  return totalIssuesCount.value === 0;
});

const accessibilityCategories = computed<AccessibilityCategory[]>(() => {
  const categories: AccessibilityCategory[] = [];

  if (props.result?.accessibilityDetails?.navigation) {
    categories.push({
      name: 'Navigation',
      score: Math.round(props.result.accessibilityDetails.navigation.score || 0)
    });
  }

  if (props.result?.accessibilityDetails?.semantics) {
    categories.push({
      name: 'Semantics',
      score: Math.round(props.result.accessibilityDetails.semantics.score || 0)
    });
  }

  if (props.result?.accessibilityDetails?.aria) {
    categories.push({
      name: 'ARIA',
      score: Math.round(props.result.accessibilityDetails.aria.score || 0)
    });
  }

  if (props.result?.accessibilityDetails?.contrast) {
    categories.push({
      name: 'Contrast',
      score: Math.round(props.result.accessibilityDetails.contrast.score || 0)
    });
  }

  if (props.result?.accessibilityDetails?.keyboard) {
    categories.push({
      name: 'Keyboard Navigation',
      score: Math.round(props.result.accessibilityDetails.keyboard.score || 0)
    });
  }

  if (props.result?.accessibilityDetails?.images) {
    categories.push({
      name: 'Images',
      score: Math.round(props.result.accessibilityDetails.images.score || 0)
    });
  }

  if (categories.length === 0) {
    const ariaTotal = (props.result?.accessibility?.missingAria || 0) + ariaIssues.value.length;
    const ariaScore = ariaTotal > 0 ? Math.max(0, 100 - (ariaTotal * 5)) : 100;

    const altScore = props.result?.accessibility?.missingAlt ?
      Math.max(0, 100 - (props.result.accessibility.missingAlt * 10)) : 100;

    const formsTotal = (props.result?.accessibility?.missingLabels || 0) +
      (props.result?.accessibility?.missingInputAttributes || 0) +
      inputIssues.value.length;
    const formsScore = formsTotal > 0 ? Math.max(0, 100 - (formsTotal * 10)) : 100;

    const contrastScore = props.result?.accessibility?.contrastIssues ?
      Math.max(0, 100 - (props.result.accessibility.contrastIssues * 15)) : 100;

    categories.push({ name: 'ARIA Compliance', score: ariaScore });
    categories.push({ name: 'Image Accessibility', score: altScore });
    categories.push({ name: 'Form Accessibility', score: formsScore });
    categories.push({ name: 'Contrast', score: contrastScore });
  }

  return categories;
});

const wcagConformity = computed(() => {
  const score = calculateAccessibilityScore(props.result);

  let defaultConformity = {
    a: score >= 70 ? 'Partially conform' : 'Not conform',
    aa: score >= 80 ? 'Partially conform' : 'Not conform',
    aaa: score >= 90 ? 'Partially conform' : 'Not conform'
  };

  if (score >= 90 && !hasAriaIssues.value && !hasFormIssues.value) {
    defaultConformity.a = 'Conform';
  }

  return props.result?.accessibilityDetails?.wcag || defaultConformity;
});

const wcagAConformity = computed(() => {
  return wcagConformity.value.a || 'Not evaluated';
});

const wcagAAConformity = computed(() => {
  return wcagConformity.value.aa || 'Not evaluated';
});

const wcagAAAConformity = computed(() => {
  return wcagConformity.value.aaa || 'Not evaluated';
});

const wcagAColor = computed(() => {
  if (wcagAConformity.value === 'Conform') return 'success-lighten-4';
  if (wcagAConformity.value === 'Partially conform') return 'warning-lighten-4';
  return 'error-lighten-4';
});

const wcagAAColor = computed(() => {
  if (wcagAAConformity.value === 'Conform') return 'success-lighten-4';
  if (wcagAAConformity.value === 'Partially conform') return 'warning-lighten-4';
  return 'error-lighten-4';
});

const wcagAAAColor = computed(() => {
  if (wcagAAAConformity.value === 'Conform') return 'success-lighten-4';
  if (wcagAAAConformity.value === 'Partially conform') return 'warning-lighten-4';
  return 'error-lighten-4';
});

const accessibilityRecommendations = computed(() => {
  return props.result?.accessibilityDetails?.recommendations || [];
});

const getScoreColor = (score) => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
};

const getScoreMessage = (score) => {
  if (score >= 90) return 'Excellent ! Your site is very accessible.';
  if (score >= 70) return 'Good ! Your site has an acceptable accessibility level.';
  if (score >= 50) return 'Average. Improvements are needed for better accessibility.';
  return 'Insufficient. Your site presents significant accessibility barriers.';
};
</script>

<style scoped>
.v-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
}

.v-list-item.rounded-lg {
  background-color: rgba(var(--v-theme-error-rgb), 0.05);
}
</style>