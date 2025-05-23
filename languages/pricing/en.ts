import { Database } from "sqlite";

export default {
  meta: {
    title: 'Pricing Plans',
    description: 'Choose the best pricing plan for your needs'
  },
  section: {
    title: 'Choose your plan',
    subtitle: 'Pricing',
    description: 'Start with a 7-day free trial. No credit card required.',
    popular: 'MOST POPULAR',
    compare: 'Compare'
  },
  currency: {
    label: 'Select currency'
  },
  plans: {
    free: {
      name: 'Free',
      description: 'Perfect to start',
      trial: {
        none: 'No trial needed'
      },
      cta: 'TRY FOR FREE'
    },
    premium: {
      name: 'Premium',
      description: 'Unlock all features',
      badge: 'MOST POPULAR',
      trial: {
        days: '{days} days free trial included'
      },
      cta: 'Start Free Trial'
    },
    lifetime: {
      name: 'Lifetime',
      description: 'No time limit',
      cta: 'Start Free Trial'
    }
  },
  billing: {
    month: 'month',
    lifetime: 'lifetime'
  },
  guarantee: {
    title: '30-Day Money Back Guarantee',
    description: 'If you\'re not satisfied with StackUnity, get a full refund within 30 days. No questions asked.'
  },
  comparison: {
    show: 'Show Full Feature Comparison',
    hide: 'Hide Full Feature Comparison',
    table: {
      feature: 'Feature',
      free: 'Free',
      premium: 'Premium'
    }
  },
  features: {
    stackql: 'StackQL',
    stackqlDetails: {
      workbench: 'StackUnity Workbench',
      queryAnalysis: 'Query Analysis',
      queryVisualization: 'Query Visualization',
      databaseUsage: 'Database Usage'
    },
    audit: 'StackAudit',
    auditDetails: {
      performanceAnalysis: 'Performance Analysis',
      contentAnalysis: 'Content Analysis',
      userEngagement: 'User Engagement tools',
      semanticAnalysis: 'Semantic and ARIA analysis',
      securityAnalysis: 'Security analysis',
    },
    analytics: 'StackUnity Analytics',
    analyticsDetails: {
      pageviews: 'Pageviews',
      sessions: 'Sessions',
      location: 'Location',
      browserAndDevice: 'Browser & Device',
      interaction: 'Interaction',
      deadzones: 'Deadzones'
    },
    futureUpdates: 'Access to all future updates',
    unlimitedMembers: 'Unlimited team members',
    prioritySupport: 'Priority support'
  }
} 