<template>
  <v-container>
    <div class="text-center mb-12">
      <h2 class="text-h3 text-gradient font-weight-bold mb-3">{{ t().section.title }}</h2>
      <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
        {{ t().section.description }}
      </p>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(item, i) in faqItems" :key="i">
            <v-expansion-panel-title class="text-subtitle-1 font-weight-medium"
              aria-label="Question : {{ item.question }}">
              {{ item.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-body-1 pt-2" aria-label="Answer : {{ item.answer }}">
                {{ item.answer }}
              </p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// @ts-ignore
import { useHead } from '#imports';
import { useTranslations } from '../languages';
import { computed } from 'vue';

const t = useTranslations('faq');

const faqItems = computed(() => [
  {
    question: t().items[0].question,
    answer: t().items[0].answer
  },
  {
    question: t().items[1].question,
    answer: t().items[1].answer
  },
  {
    question: t().items[2].question,
    answer: t().items[2].answer
  },
  {
    question: t().items[3].question,
    answer: t().items[3].answer
  },
  {
    question: t().items[4].question,
    answer: t().items[4].answer
  },
  {
    question: t().items[5].question,
    answer: t().items[5].answer
  },
  {
    question: t().items[6].question,
    answer: t().items[6].answer
  }
]);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": t().items.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(faqJsonLd)
    }
  ]
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  animation: gradient 3s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}
</style>
