<template>
  <v-container>
    <div class="text-center mb-12">
      <h2 class="text-h3 font-weight-bold mb-3">Frequently Asked Questions</h2>
      <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
        You have questions? We have answers.
      </p>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(item, i) in faqItems" :key="i">
            <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
              {{ item.question }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-body-1 pt-2">{{ item.answer }}</p>
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

const faqItems = [
  {
    question: 'What is StackUnity?',
    answer: 'StackUnity is an all-in-one platform for developers who want to create, manage and optimize their web projects. It combines development tools, monitoring, SEO audit and much more.'
  },
  {
    question: 'Is there a freemium model?',
    answer: 'Yes, you can access the application free of charge with paid premium extensions.'
  },
  {
    question: 'Why this price?',
    answer: 'We offer a lifetime access to all our tools for a single price. This is a one-time payment that gives you access to all our tools forever and updates are included.'
  },
  {
    question: 'Are there any limitations in the free plan?',
    answer: 'The free plan allows you to create up to 5 personal snippets and use basic features. For unlimited usage and advanced features, we recommend upgrading to the lifetime access plan.'
  },
  {
    question: 'How does technical support work?',
    answer: 'All users have access to community support. Premium Users benefit from priority support via email.'
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
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