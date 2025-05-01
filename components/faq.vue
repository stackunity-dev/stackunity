<template>
  <v-container>
    <div class="text-center mb-12">
      <h2 class="text-h3 text-gradient font-weight-bold mb-3">Frequently asked questions</h2>
      <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
        You have questions? We have answers.
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

const faqItems = [
  {
    question: 'What is StackUnity?',
    answer: 'StackUnity is a one-stop-shop for developers who want to create, manage and optimize their web projects. It combines development tools, monitoring, SEO audit and much more.'
  },
  {
    question: 'Is there a freemium model?',
    answer: 'Yes, you can access the application for free with premium paid extensions.'
  },
  {
    question: 'Why this price?',
    answer: 'We offer lifetime access to all our tools for a unique price. It is a one-time payment that gives you access to all our tools for life and updates are included.'
      + ' We offer a 30-day money-back guarantee if you are not satisfied with the product.'
  },
  {
    question: 'Are there limitations in the free plan?',
    answer: 'The free plan allows you to create up to the basic features. For unlimited use and advanced features, we recommend upgrading to the lifetime access plan.'
  },
  {
    question: 'How does the support work?',
    answer: 'All users have access to community support. Premium users benefit from priority support via email.'
  },
  {
    question: 'Can I try StackUnity before buying?',
    answer: 'Absolutely! You can create a free account to explore the basic features of the platform before deciding to buy the full access.'
  },
  {
    question: 'There is any discount for students or non-profit organizations?',
    answer: 'Yes, we offer a 50% discount for students and non-profit organizations. Please contact us to get the discount code.'
      + ' Also, any users can get a 20% discount by using the code "STACKUNITY20" at the checkout.'
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
