<template>
  <div>
    <v-btn v-if="type === 'button'" :color="color" :variant="variant" :disabled="disabled" @click="showDialog = true"
      class="premium-btn" elevation="2" :size="size" :aria-label="`${title} - ${planType} feature`">
      <v-icon :icon="icon" class="crown-icon" aria-hidden="true" />
      <span class="premium-text">{{ title }}</span>
    </v-btn>

    <v-list-item v-else-if="type === 'list-item'" prepend-icon="mdi-crown" @click="showDialog = true" rounded="lg"
      density="compact" class="gold-gradient-item" role="button" :aria-label="`${title} - ${planType} feature`">
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item>

    <v-chip v-else-if="type === 'chip'" prepend-icon="mdi-crown" color="warning" @click="showDialog = true" size="small"
      class="gold-gradient-chip" role="button" aria-label="Premium feature">{{ planType === 'premium' ? 'Premium' :
        'Standard' }}</v-chip>

    <v-tab v-else-if="type === 'tab'" prepend-icon="mdi-crown" class="gold-gradient-item" @click="showDialog = true"
      role="tab" :aria-label="`${title} - ${planType} feature`">
      {{ title }}
    </v-tab>

    <v-dialog v-model="showDialog" max-width="650" role="dialog" aria-labelledby="premium-dialog-title">
      <v-card class="rounded-lg premium-dialog" elevation="12">
        <v-card-title id="premium-dialog-title"
          class="bg-primary text-white py-4 px-4 rounded-t-lg d-flex align-center">
          <v-icon color="white" class="mr-2" size="24" aria-hidden="true">{{ icon }}</v-icon>
          {{ title || `${planType} feature` }}
        </v-card-title>

        <v-card-text class="pa-0">
          <div class="premium-hero pa-4" :class="`premium-hero-${featureType}`" role="region"
            aria-label="Feature description">
            <div class="text-center mb-4">
              <v-icon :icon="icon" size="64" color="warning" class="mb-2 premium-icon" aria-hidden="true"></v-icon>
              <div class="text-h5 font-weight-bold mb-2" role="heading" aria-level="2">{{ title || `${planType} feature`
              }}
              </div>
              <div class="text-subtitle-2 text-medium-emphasis mx-auto" style="max-width: 400px">
                Unlock this {{ planType }} feature and access all {{ planType }} tools to optimize your web development.
              </div>
            </div>
          </div>

          <div class="px-4 premium-content">
            <v-row>
              <v-col cols="12" sm="7" class="py-2 mt-2">
                <div class="text-h6 font-weight-bold mb-3" role="heading" aria-level="3">Included features:</div>
                <v-list class="rounded-lg mb-4 premium-features-list pa-0" role="list"
                  aria-label="Premium features list">
                  <v-list-item v-for="(feature, index) in getFeatures(featureType)" :key="index"
                    prepend-icon="mdi-check-circle-outline" class="premium-feature-item py-1 px-0" density="compact"
                    role="listitem">
                    <v-list-item-title class="text-body-2">{{ feature }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" sm="5" class="py-2">
                <div class="preview-image-container mb-3 mt-5 d-none d-sm-block" role="img"
                  :aria-label="`${title} preview image`">
                  <v-img :src="getFeatureImage(featureType)" class="rounded-lg premium-preview-image" height="160"
                    :width="400" contain position="center" :alt="`${title} preview`">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary"
                          aria-label="Loading preview image"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </div>

                <v-card class="price-card mb-3 pa-4" color="surface" rounded="lg" elevation="1" role="region"
                  aria-label="Pricing information">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div class="text-h4 font-weight-bold" role="text" :aria-label="`Price: ${getPlanPrice()}`">{{
                      getPlanPrice() }}
                    </div>
                    <v-chip color="success" size="small" aria-label="Lifetime access">Lifetime access</v-chip>
                  </div>
                  <div class="text-body-2 text-medium-emphasis mb-4">Unlimited access for life</div>
                  <v-btn :color="planType === 'premium' ? 'warning' : 'primary'" variant="elevated" block size="large"
                    height="48" @click="goToPricingPage" class="premium-action-btn text-uppercase font-weight-bold"
                    aria-label="Get access now">
                    <v-icon start aria-hidden="true">{{ planType === 'premium' ? 'mdi-crown' : 'mdi-star' }}</v-icon>
                    Get {{ planType }}
                  </v-btn>
                  <div class="d-flex align-center justify-center mt-3" role="text" aria-label="Additional benefits">
                    <v-icon size="small" color="success" class="mr-1" aria-hidden="true">mdi-check-circle</v-icon>
                    <span class="text-caption">Single payment • Unlimited access • {{ planType === 'premium' ?
                      'Priority' : 'Basic' }}
                      support</span>
                  </div>
                </v-card>

                <v-btn color="error" variant="tonal" @click="showDialog = false" class="text-none pa-2"
                  aria-label="Continue with free version">
                  I'll continue with the free version
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Props {
  title?: string;
  icon?: string;
  color?: string;
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined';
  disabled?: boolean;
  premiumLink?: string;
  type?: 'button' | 'list-item' | 'chip';
  featureKey?: string;
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
  planType?: 'standard' | 'premium';
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: 'mdi-crown',
  color: 'warning',
  variant: 'elevated',
  disabled: false,
  premiumLink: '/premium',
  type: 'button',
  featureKey: '',
  size: 'default',
  planType: 'premium'
});

const showDialog = ref(false);

const featureType = computed(() => {
  if (props.featureKey) {
    return props.featureKey;
  }

  const title = props.title?.toLowerCase() || '';
  if (title.includes('database') || title.includes('sql')) {
    return 'databaseDesigner';
  } else if (title.toLowerCase().includes('website analyzer')) {
    return 'websiteAnalyzer';
  } else if (title.toLowerCase().includes('robot') || title.toLowerCase().includes('schema')) {
    return 'robots';
  } else if (title.toLowerCase().includes('studio')) {
    return 'studioComponents';
  } else if (title.toLowerCase().includes('accessibility')) {
    return 'accessibility';
  } else if (title.toLowerCase().includes('user engagement')) {
    return 'userEngagement';
  } else if (title.toLowerCase().includes('semantic')) {
    return 'semantic';
  } else {
    return 'default';
  }
});

type FeatureMap = {
  databaseDesigner: string[];
  websiteAnalyzer: string[];
  robots: string[];
  studioComponents: string[];
  accessibility: string[];
  semantic: string[];
  userEngagement: string[];
  security: string[];
  default: string[];
  website: string[];
};

const features: FeatureMap = {
  databaseDesigner: [
    "Visual database schema creation (Standard)",
    "SQL generation with optimized indexes (Standard)",
    "Multiple database engine support (Standard)",
    "Export schemas as SQL or diagrams (Standard)"
  ],
  websiteAnalyzer: [
    "Complete website SEO audit (Premium)",
    "Technical SEO recommendations (Premium)",
    "Content optimization suggestions (Premium)",
    "Full website analysis (Premium)"
  ],
  robots: [
    "robots.txt generator (Standard)",
    "Schema.org markup generator (Standard)",
    "Structured data validation (Standard)",
    "Search engine visibility control (Standard)"
  ],
  studioComponents: [
    "Access to all UI components (Standard)",
    "Navigation drawer builder (Standard)",
    "Timeline component creator (Standard)",
    "Form builder with validation (Standard)",
    "Advanced UI utilities (Standard)"
  ],
  accessibility: [
    "Accessibility audit (Premium)",
    "Semantic structure analysis (Premium)",
    "Metadata analysis (Premium)",
    "ARIA analysis (Premium)"
  ],
  security: [
    "Complete security vulnerability analysis (Premium)",
    "CSRF vulnerability detection (Premium)",
    "JWT analysis and validation (Premium)",
    "Multi-factor authentication testing (Premium)",
    "Command injection detection (Premium)"
  ],
  semantic: [
    "Semantic structure analysis (Premium)",
    "Metadata analysis (Premium)",
    "ARIA analysis (Premium)",
    "SEO optimization suggestions (Premium)"
  ],
  userEngagement: [
    "User engagement analysis (Premium)",
    "User engagement optimization suggestions (Premium)",
    "User engagement metrics (Premium)",
    "User engagement reports (Premium)"
  ],
  default: [
    "Unlimited access to all features",
    "Priority support",
    "Early access to updates",
    "Exclusive features"
  ],
  website: [
    "Website analyzer (Premium)",
    "Website SEO audit (Premium)",
    "Website sitemap generator (Premium)",
    "Website social media integration (Premium)"
  ]
};

const getFeatures = (type: string): string[] => {
  switch (type) {
    case 'databaseDesigner': return features.databaseDesigner;
    case 'websiteAnalyzer': return features.websiteAnalyzer;
    case 'robots': return features.robots;
    case 'studioComponents': return features.studioComponents;
    case 'accessibility': return features.accessibility;
    case 'semantic': return features.semantic;
    case 'security': return features.security;
    case 'userEngagement': return features.userEngagement;
    case 'website': return features.website;
    default: return features.default;
  }
};

const getFeatureImage = (type: string): string => {
  switch (type) {
    case 'databaseDesigner': return '/images/premium/sql-designer.avif';
    case 'websiteAnalyzer': return '/images/premium/seo-audit.avif';
    case 'robots': return '/images/premium/robots.avif';
    case 'studioComponents': return '/images/premium/studio-preview.avif';
    case 'accessibility': return '/images/premium/accessibility.avif';
    case 'semantic': return '/images/premium/semantic.avif';
    case 'security': return '/images/premium/security.avif';
    case 'userEngagement': return '/images/premium/user-engagement.avif';
    default: return '/images/preview-devunity.avif';
  }
};

const getPlanPrice = () => {
  if (props.planType === 'premium') {
    return '€179.99';
  } else {
    return '€79.99';
  }
};

const goToPricingPage = () => {
  router.push('/#pricing').then(() => {
    setTimeout(() => {
      const element = document.getElementById('pricing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  });

  showDialog.value = false;
};
</script>

<style scoped>
.v-card {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.v-card::-webkit-scrollbar {
  display: none;
}

.gold-gradient-item {
  background: linear-gradient(45deg, #FFD700, #FFA500) !important;
  color: white !important;
  font-weight: 600 !important;
  border: 1px solid rgba(255, 215, 0, 0.3) !important;
  margin-bottom: 4px !important;
  transition: all 0.3s ease !important;
}

.gold-gradient-item:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2) !important;
}

.gold-gradient-item:active {
  transform: translateY(0) !important;
}

.premium-btn,
.premium-list-item {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  min-width: 40px;
  padding: 0 12px;
  overflow: hidden;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border: 1px solid rgba(255, 215, 0, 0.3);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.premium-btn:hover,
.premium-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.premium-btn:active,
.premium-list-item:active {
  transform: translateY(0);
}

.crown-icon {
  color: #007bff;
  transition: transform 0.3s ease;
}

.premium-btn:hover .crown-icon,
.premium-list-item:hover .crown-icon {
  transform: scale(1.1);
}

.premium-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease;
  color: #FFFFFF;
}

.premium-btn .premium-text,
.premium-list-item .premium-text {
  max-width: 0;
  opacity: 0;
  margin-left: 0;
}

.premium-btn:hover .premium-text,
.premium-list-item:hover .premium-text {
  max-width: 200px;
  opacity: 1;
  margin-left: 8px;
}

.premium-action-btn {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border: 1px solid rgba(255, 215, 0, 0.3);
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.premium-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  background: linear-gradient(45deg, #FFC800, #FF9500);
}

.premium-feature-item :deep(.v-list-item__prepend) {
  color: #4CAF50;
  margin-right: 8px;
}

.premium-feature-item :deep(.v-list-item-title) {
  font-weight: 500;
}

.testimonial-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 12px;
  border-left: 4px solid #FFD700;
}

.testimonial-text {
  font-style: italic;
  line-height: 1.4;
}

.premium-dialog {
  overflow: hidden;
}

.premium-hero {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
  overflow: hidden;
}

.premium-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.2), transparent 60%);
  z-index: 0;
}

.premium-icon {
  filter: drop-shadow(0 2px 5px rgba(255, 215, 0, 0.5));
  animation: pulse 2s infinite;
}

.premium-preview-image {
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 4px;
}

.premium-preview-image :deep(img) {
  width: 100% !important;
  height: 152px !important;
  max-height: 152px !important;
  max-width: 100% !important;
  object-position: center;
}

.premium-preview-image:hover {
  transform: scale(1.02);
}

.price-card {
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: linear-gradient(to bottom, rgba(255, 251, 235, 0.7), rgba(255, 249, 219, 0.4));
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.premium-hero-databaseDesigner {
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(25, 118, 210, 0.05));
}

.premium-hero-websiteAnalyzer {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(56, 142, 60, 0.05));
}

.premium-hero-robots {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 179, 0, 0.05));
}

.premium-hero-studioComponents {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(123, 31, 162, 0.05));
}

.premium-hero-security {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(30, 136, 229, 0.05));
}

.premium-hero-audit {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(211, 47, 47, 0.05));
}

.gold-gradient-chip {
  background: linear-gradient(45deg, #FFD700, #FFA500) !important;
  color: white !important;
  font-weight: 600 !important;
  border: 1px solid rgba(255, 215, 0, 0.3) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.2) !important;
}

.gold-gradient-chip:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(255, 215, 0, 0.3) !important;
}
</style>