<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">User Engagement</h3>

    <v-row>
      <v-col cols="12">
        <v-card variant="elevated" class="mb-4 rounded-lg elevation-1 border-primary-subtle overflow-hidden">
          <v-card-item class="bg-primary-lighten-4 pa-4">
            <template v-slot:prepend>
              <v-avatar color="primary" class="mr-3" size="48">
                <v-icon size="28" color="white">mdi-chart-donut</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h6 font-weight-bold">Engagement Score</v-card-title>
          </v-card-item>
          <v-card-text class="pa-4">
            <div class="d-flex justify-center align-center">
              <v-progress-circular :model-value="engagementScore" :color="getScoreColor(engagementScore)" size="100"
                width="12">
                <span class="text-h6 font-weight-bold">{{ engagementScore }}%</span>
              </v-progress-circular>
            </div>
            <div class="text-center mt-4">
              <p class="text-h6" :class="`text-${getScoreColor(engagementScore)}`">
                {{ getScoreLabel(engagementScore) }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="(metric, index) in engagementMetrics" :key="index">
        <v-card variant="outlined" class="mb-4 h-100">
          <v-card-item :class="`bg-${metric.color}-lighten-5 pa-3`">
            <template v-slot:prepend>
              <v-icon :color="metric.color" size="24">{{ metric.icon }}</v-icon>
            </template>
            <v-card-title>{{ metric.title }}</v-card-title>
          </v-card-item>
          <v-card-text class="pa-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-h6">{{ metric.value }}</div>
              <v-chip v-if="metric.status" :color="metric.color" size="small">{{ metric.status }}</v-chip>
            </div>
            <p class="text-body-2 mt-2">{{ metric.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-clipboard-check</v-icon>
            Engagement Techniques
          </v-card-title>
          <v-card-text>
            <v-chip-group>
              <v-chip v-for="(value, key) in engagementTechniques" :key="key" :color="value ? 'success' : 'error'"
                :variant="value ? 'elevated' : 'outlined'" size="small">
                <v-icon start size="16">{{ value ? 'mdi-check' : 'mdi-close' }}</v-icon>
                {{ formatTechniqueName(String(key)) }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-lightbulb</v-icon>
            Improvement Tips
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(issue, index) in engagementIssues" :key="index"
                :class="`bg-${getSeverityColor(issue.severity)}-lighten-5 mb-2 rounded`">
                <template v-slot:prepend>
                  <v-icon :color="getSeverityColor(issue.severity)">{{ getSeverityIcon(issue.severity) }}</v-icon>
                </template>
                <v-list-item-title>{{ issue.issue }}</v-list-item-title>
                <v-list-item-subtitle>{{ issue.recommendation }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getScoreColor } from '../../utils/seo/getScore';
import { calculateEngagementScore } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const engagementScore = computed(() => {
  // Utiliser d'abord le score fourni s'il existe
  if (props.result?.engagement?.engagementScore !== undefined) {
    return Number(props.result.engagement.engagementScore);
  }
  // Sinon recalculer
  return calculateEngagementScore(props.result) || 0;
});

const engagementData = computed(() => {
  return props.result?.engagement || {
    ctaCount: 0,
    interactiveElements: 0,
    visualElements: 0,
    socialElements: 0,
    navigationScore: 0,
    readabilityScore: 0,
    engagementTechniques: {
      hasSocialLinks: false,
      hasCtaButtons: false,
      hasFormsOrInputs: false,
      hasVideos: false,
      hasImages: false,
      hasInteractiveElements: false,
      hasFeedbackMechanisms: false
    },
    issues: []
  };
});

const engagementTechniques = computed(() => {
  return engagementData.value.engagementTechniques || {
    hasSocialLinks: false,
    hasCtaButtons: false,
    hasFormsOrInputs: false,
    hasVideos: false,
    hasImages: false,
    hasInteractiveElements: false,
    hasFeedbackMechanisms: false
  };
});

const engagementIssues = computed(() => {
  return engagementData.value.issues || [];
});

const engagementMetrics = computed(() => {
  const data = engagementData.value;

  return [
    {
      title: "Call-to-Actions",
      value: data.ctaCount || 0,
      status: getStatusForCTA(data.ctaCount || 0),
      description: "Number of call-to-action buttons (subscription, purchase, contact, etc.)",
      icon: "mdi-gesture-tap-button",
      color: getColorForCTA(data.ctaCount || 0)
    },
    {
      title: "Interactive Elements",
      value: data.interactiveElements || 0,
      status: getStatusForInteractiveElements(data.interactiveElements || 0),
      description: "Number of forms, buttons and other interactive elements",
      icon: "mdi-cursor-default-click",
      color: getColorForInteractiveElements(data.interactiveElements || 0)
    },
    {
      title: "Visual Elements",
      value: data.visualElements || 0,
      status: getStatusForVisualElements(data.visualElements || 0),
      description: "Number of images, videos and other visual media",
      icon: "mdi-image-multiple",
      color: getColorForVisualElements(data.visualElements || 0)
    },
    {
      title: "Social Elements",
      value: data.socialElements || 0,
      status: getStatusForSocialElements(data.socialElements || 0),
      description: "Links to social networks and share buttons",
      icon: "mdi-share-variant",
      color: getColorForSocialElements(data.socialElements || 0)
    },
    {
      title: "Navigation",
      value: `${data.navigationScore || 0}%`,
      status: getStatusForScore(data.navigationScore || 0),
      description: "Quality and accessibility of navigation elements",
      icon: "mdi-menu",
      color: getScoreColor(data.navigationScore || 0)
    },
    {
      title: "Readability",
      value: `${data.readabilityScore || 0}%`,
      status: getStatusForScore(data.readabilityScore || 0),
      description: "Ease of reading text content",
      icon: "mdi-text",
      color: getScoreColor(data.readabilityScore || 0)
    }
  ];
});

function getStatusForCTA(count: number): string {
  if (count === 0) return "Missing";
  if (count < 2) return "Low";
  if (count < 5) return "Good";
  if (count < 10) return "Very good";
  return "Excessive";
}

function getColorForCTA(count: number): string {
  if (count === 0) return "error";
  if (count < 2) return "warning";
  if (count < 10) return "success";
  return "warning";
}

function getStatusForInteractiveElements(count: number): string {
  if (count === 0) return "Missing";
  if (count < 3) return "Low";
  if (count < 10) return "Good";
  return "Very good";
}

function getColorForInteractiveElements(count: number): string {
  if (count === 0) return "error";
  if (count < 3) return "warning";
  return "success";
}

function getStatusForVisualElements(count: number): string {
  if (count === 0) return "Missing";
  if (count < 3) return "Low";
  if (count < 10) return "Good";
  return "Very good";
}

function getColorForVisualElements(count: number): string {
  if (count === 0) return "error";
  if (count < 3) return "warning";
  return "success";
}

function getStatusForSocialElements(count: number): string {
  if (count === 0) return "Missing";
  if (count < 2) return "Low";
  if (count < 5) return "Good";
  return "Very good";
}

function getColorForSocialElements(count: number): string {
  if (count === 0) return "error";
  if (count < 2) return "warning";
  return "success";
}

function getStatusForScore(score: number): string {
  if (score < 30) return "Low";
  if (score < 60) return "Good";
  if (score < 80) return "Very good";
  return "Excellent";
}

function getScoreLabel(score: number): string {
  if (score < 30) return "Low engagement";
  if (score < 60) return "Good engagement";
  if (score < 80) return "Very good engagement";
  return "Excellent engagement";
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    case 'info': return 'grey';
    default: return 'grey';
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'high': return 'mdi-alert-circle';
    case 'medium': return 'mdi-alert';
    case 'low': return 'mdi-information';
    case 'info': return 'mdi-information-outline';
    default: return 'mdi-information-outline';
  }
}

function formatTechniqueName(key: string): string {
  const nameMap: Record<string, string> = {
    hasSocialLinks: "Social links",
    hasCtaButtons: "CTA buttons",
    hasFormsOrInputs: "Forms",
    hasVideos: "Videos",
    hasImages: "Images",
    hasInteractiveElements: "Interactivity",
    hasFeedbackMechanisms: "Feedback"
  };

  return nameMap[key] || key.toString();
}
</script>