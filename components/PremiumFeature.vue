<template>
  <div>
    <v-btn v-if="type === 'button'" :color="color" :variant="variant" :disabled="disabled" @click="showDialog = true"
      class="premium-btn" elevation="2" :size="size">
      <v-icon :icon="icon" class="crown-icon" />
      <span class="premium-text">{{ title }}</span>
    </v-btn>

    <v-list-item v-else-if="type === 'list-item'" prepend-icon="mdi-crown" @click="showDialog = true" rounded="lg"
      density="compact" class="gold-gradient-item">
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item>

    <v-chip v-else-if="type === 'chip'" prepend-icon="mdi-crown" color="warning" @click="showDialog = true" size="small"
      class="gold-gradient-chip">Premium </v-chip>

    <v-dialog v-model="showDialog" max-width="500">
      <v-card class="rounded-lg" elevation="8">
        <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
          <v-icon color="white" class="mr-2">{{ icon }}</v-icon>
          {{ title || 'Premium feature' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="text-center mb-6">
            <v-icon :icon="icon" size="64" :color="color" class="mb-2"></v-icon>
            <div class="text-h6 mb-2">{{ title || 'Premium feature' }}</div>
            <div class="text-body-2 text-medium-emphasis">
              Unlock all premium features
            </div>
          </div>

          <v-list class="rounded-lg mb-6 premium-features-list">
            <v-list-item v-for="(feature, index) in getFeatures(featureType)" :key="index"
              prepend-icon="mdi-check-circle" class="premium-feature-item">
              <v-list-item-title>{{ feature }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <div class="text-center">
            <div class="text-h3 font-weight-bold mb-1">300$</div>
            <div class="text-subtitle-1 text-medium-emphasis mb-4">Lifetime access</div>
            <v-btn color="warning" variant="elevated" size="large" block @click="goToPricingPage"
              class="premium-action-btn">
              <v-icon start>mdi-crown</v-icon>
              Get lifetime access
            </v-btn>
            <div class="text-caption text-medium-emphasis mt-2">
              Single payment • Unlimited access • Priority support
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showDialog = false">
            Close
          </v-btn>
        </v-card-actions>
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
  size: 'default'
});

const showDialog = ref(false);

const featureType = computed(() => {
  if (props.featureKey) {
    return props.featureKey;
  }

  const title = props.title?.toLowerCase() || '';
  if (title.includes('database') || title.includes('sql')) {
    return 'databaseDesigner';
  } else if (title.includes('seo audit')) {
    return 'seoAudit';
  } else if (title.includes('robot') || title.includes('schema')) {
    return 'robots';
  } else if (title.includes('studio')) {
    return 'studioComponents';
  }
  return '';
});

type FeatureMap = {
  databaseDesigner: string[];
  seoAudit: string[];
  robots: string[];
  studioComponents: string[];
  audit: string[];
  default: string[];
};

const features: FeatureMap = {
  databaseDesigner: [
    "Visual database schema creation",
    "SQL generation with optimized indexes",
    "Multiple database engine support",
    "Export schemas as SQL or diagrams"
  ],
  seoAudit: [
    "Complete website SEO audit",
    "Technical SEO recommendations",
    "Content optimization suggestions",
    "Exportable PDF reports"
  ],
  robots: [
    "robots.txt generator",
    "Schema.org markup generator",
    "Structured data validation",
    "Search engine visibility control"
  ],
  studioComponents: [
    "Access to all UI components",
    "Navigation drawer builder",
    "Timeline component creator",
    "Form builder with validation",
    "Advanced UI utilities"
  ],
  audit: [
    "Website analysis",
    "Accessibility audit",
    "Performance audit",
    "Errors audit",
    "Recommendations"
  ],
  default: [
    "Unlimited access to all features",
    "Priority support",
    "Early access to updates",
    "Exclusive features"
  ]
};

const getFeatures = (type: string): string[] => {
  switch (type) {
    case 'databaseDesigner': return features.databaseDesigner;
    case 'seoAudit': return features.seoAudit;
    case 'robots': return features.robots;
    case 'studioComponents': return features.studioComponents;
    case 'audit': return features.audit;
    default: return features.default;
  }
};

const goToPricingPage = () => {
  router.push('/checkout');
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
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
}

.premium-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.premium-feature-item :deep(.v-list-item__prepend) {
  color: #FFD700;
  margin-right: 12px;
}

.premium-feature-item :deep(.v-list-item-title) {
  font-weight: 500;
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