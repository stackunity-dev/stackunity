export default {
  meta: {
    title: "Checkout - StackUnity",
    description: "Complete your purchase to access premium features of StackUnity",
    keywords: "payment, checkout, StackUnity premium, secure payment"
  },
  features: {
    advancedTools: {
      title: "Advanced Development Tools",
      description: "Access to premium development tools and features"
    },
    analytics: {
      title: "Analytics",
      description: "Access to full analytics data for your website"
    },
    prioritySupport: {
      title: "Priority Support",
      description: "Get priority support for all your questions"
    },
    regularUpdates: {
      title: "Regular Updates",
      description: "Stay ahead with the latest features and improvements"
    },
    teamCollaboration: {
      title: "Team Collaboration",
      description: "Work seamlessly with your team members"
    },
    standardTools: {
      title: "Standard Development Tools",
      description: "Access to standard development tools and features"
    },
    basicSupport: {
      title: "Basic Support",
      description: "Get basic support for your questions"
    }
  },
  plans: {
    premium: {
      title: "Premium Lifetime",
      description: "Unlimited access to all premium features"
    },
    standard: {
      title: "Standard Lifetime",
      description: "Access to standard features"
    },
    bestChoice: "Best choice",
    option: {
      standard: "Standard",
      premium: "Premium"
    },
    tooltip: {
      lifetimeAccess: "Lifetime access",
      standardFeatures: "Access to standard features",
      premiumFeatures: "All premium features included"
    }
  },
  pricing: {
    htPrice: "HT price",
    discount: "Discount",
    htPriceAfterDiscount: "HT price after discount",
    vat: "VAT",
    totalTTC: "Total TTC",
    oneTimePayment: "One-time payment, lifetime access",
    youSave: "You save",
    saveVsMonthly: "Save 100% vs monthly"
  },
  vatInfo: {
    selfAssessment: "VAT not applicable, Art. 283-2 of the CGI - Self-assessment of VAT",
    vatNumber: "VAT number",
    exportOutsideEU: "Export outside EU - VAT not applicable"
  },
  benefits: {
    premiumTitle: "Premium Features",
    standardTitle: "Standard Features",
    premium: [
      "Unlimited access to all premium features",
      "Priority support and updates",
      "Advanced SEO analysis tools",
      "Custom development tools",
      "Team collaboration features",
      "No recurring fees - pay once, use forever"
    ],
    standard: [
      "Access to standard features",
      "Regular updates",
      "Basic support",
      "Team collaboration features"
    ]
  },
  payment: {
    paymentInformation: "Payment Information",
    billingCountry: "Billing Country",
    businessCustomer: "I'm purchasing for a business",
    vatNumber: {
      label: "VAT Number (for EU businesses)",
      placeholder: "e.g. FR12345678901",
      hint: "Enter your VAT number to apply reverse charge if eligible"
    },
    promoCode: {
      label: "Promo code",
      placeholder: "Enter your promo code",
      success: "Promo code applied",
      error: "Invalid promo code or already used"
    },
    cardholderName: {
      label: "Cardholder Name",
      placeholder: "Name on card"
    },
    payButton: "Pay",
    securePayment: "Secure payment via Stripe",
    refundGuarantee: "30-day refund guarantee"
  },
  messages: {
    vatReverseCharge: "VAT reverse charge applied (0% VAT)",
    taxCalculationError: "Failed to calculate taxes",
    paymentConfigError: "Payment configuration error. Please contact support.",
    stripeUnavailable: "Payment system unavailable. Please try again later.",
    initError: "Error initializing payment form. Please refresh the page.",
    stripeConnectionError: "Unable to connect to Stripe. Please try again.",
    paymentSuccess: "Payment successful! Premium access activated and invoice sent to your email.",
    invoiceError: "Payment successful, but invoice generation failed. Contact support if needed.",
    postPaymentError: "Payment successful but some post-payment operations failed. Please refresh your page.",
    premiumUpdateError: "Payment successful but premium status update failed. Please refresh the page.",
    reloginRequired: "Your premium status has been updated. Please log in again to access your premium features."
  },
  testimonials: {
    premium: {
      text: "StackUnity has completely transformed my development workflow. The investment is definitely worth it!",
      author: "Nûr D. - Full Stack Developer"
    }
  }
} 