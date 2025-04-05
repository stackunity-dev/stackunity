export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  headline: string;
  mainContent: string;
  ctaText: string;
  ctaUrl: string;
  colors: {
    primary: string;
    secondary: string;
  };
  font: string;
  darkMode: boolean;
  logoUrl: string;
  companyName: string;
  companyAddress: string;
  template?: string;
}

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to our newsletter',
    preheader: 'Stay informed with our latest news and updates',
    headline: 'Welcome to our newsletter!',
    mainContent: 'We are delighted to have you as a subscriber. You will now receive our best news and offers directly in your inbox.\n\nHere\'s what you can expect from our newsletter:\n- Regular updates on our products and services\n- Exclusive tips and advice\n- Special offers reserved for our subscribers',
    ctaText: 'Discover our services',
    ctaUrl: 'https://example.com',
    colors: {
      primary: '#4F46E5',
      secondary: '#818CF8'
    },
    font: 'Arial',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'StackUnity',
    companyAddress: '86000 Poitiers, France'
  },
  update: {
    id: 'update',
    name: 'Product Update',
    subject: 'New features available',
    preheader: 'Discover our latest improvements and updates',
    headline: 'Discover our new features!',
    mainContent: 'We are pleased to announce the launch of new features that will improve your user experience.\n\nHere are the main new features:\n- Redesigned interface for greater simplicity\n- Improved performance for faster loading times\n- New customization options\n\nLog in now to discover them!',
    ctaText: 'Discover the new features',
    ctaUrl: 'https://example.com/updates',
    colors: {
      primary: '#0891B2',
      secondary: '#06B6D4'
    },
    font: 'Helvetica',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'SaaS Company Inc.',
    companyAddress: '123 Innovation Street, 75000 Paris, France'
  },
  promo: {
    id: 'promo',
    name: 'Special Promotion',
    subject: 'Special offer: 25% off our plans',
    preheader: 'Limited time offer exclusively for our subscribers',
    headline: 'Exclusive offer for our subscribers!',
    mainContent: 'Get 25% off all our premium plans for a limited time.\n\nThis offer is reserved for our loyal subscribers and expires in 7 days. Use the promo code NEWSLETTER25 when ordering.',
    ctaText: 'Take advantage of the offer',
    ctaUrl: 'https://example.com/offer',
    colors: {
      primary: '#D97706',
      secondary: '#F59E0B'
    },
    font: 'Arial',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'SaaS Company Inc.',
    companyAddress: '123 Innovation Street, 75000 Paris, France'
  },
  newsletter: {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    subject: 'Monthly newsletter - {{month}} {{year}}',
    preheader: 'All the latest news from our company',
    headline: 'This month\'s news',
    mainContent: 'Dear subscribers,\n\nHere are the main news items this month:\n\n1. Launch of our new real-time collaboration feature\n2. Exclusive interview with our development team\n3. Tips for optimizing your use of our platform\n\nWe thank you for your loyalty and remain open to any suggestions.',
    ctaText: 'Read the full article',
    ctaUrl: 'https://example.com/blog',
    colors: {
      primary: '#7C3AED',
      secondary: '#8B5CF6'
    },
    font: 'Georgia',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'SaaS Company Inc.',
    companyAddress: '123 Innovation Street, 75000 Paris, France'
  },
  thankYou: {
    id: 'thankYou',
    name: 'Thank You Email',
    subject: 'Thank you for your subscription',
    preheader: 'We appreciate your support',
    headline: 'Thank you for your subscription!',
    mainContent: 'We wanted to personally thank you for subscribing to our premium plan.\n\nYour support helps us continue to develop and improve our services. You now have access to all premium features, including:\n\n- Advanced analytics\n- Priority customer support\n- Unlimited storage\n- Custom integrations\n\nIf you have any questions or need assistance, our support team is here to help.',
    ctaText: 'Access your account',
    ctaUrl: 'https://example.com/account',
    colors: {
      primary: '#059669',
      secondary: '#10B981'
    },
    font: 'Tahoma',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'SaaS Company Inc.',
    companyAddress: '123 Innovation Street, 75000 Paris, France'
  },
  event: {
    id: 'event',
    name: 'Event Invitation',
    subject: 'You\'re invited to our exclusive webinar',
    preheader: 'Join us for an exclusive online event',
    headline: 'Join our exclusive webinar!',
    mainContent: 'We are pleased to invite you to our upcoming webinar on "Future Trends in Technology".\n\nDate: October 15, 2023\nTime: 2:00 PM - 3:30 PM (GMT+1)\n\nDuring this session, our experts will discuss:\n\n- Emerging technologies and their impact\n- Industry predictions for the next 5 years\n- How to prepare your business for technological changes\n\nSpaces are limited, so reserve your spot now!',
    ctaText: 'Register now',
    ctaUrl: 'https://example.com/webinar',
    colors: {
      primary: '#DC2626',
      secondary: '#EF4444'
    },
    font: 'Arial',
    darkMode: false,
    logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
    companyName: 'SaaS Company Inc.',
    companyAddress: '123 Innovation Street, 75000 Paris, France'
  }
};

export function getTemplateById(id: string): EmailTemplate | null {
  return emailTemplates[id] || null;
}

export function getAllTemplates(): EmailTemplate[] {
  return Object.values(emailTemplates);
}

export function generateEmailHTML(template: EmailTemplate): string {
  const formattedParagraphs = template.mainContent
    .split('\n\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map(p => `<p>${p}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <meta name="description" content="${template.preheader}">
  <style>
    body {
      font-family: ${template.font}, sans-serif;
      margin: 0;
      padding: 0;
      background-color: ${template.darkMode ? '#1a1a1a' : '#f9fafb'};
      color: ${template.darkMode ? '#ffffff' : '#111827'};
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: ${template.darkMode ? '#2a2a2a' : '#ffffff'};
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid ${template.colors.primary};
    }
    .content {
      padding: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: ${template.colors.primary};
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${template.logoUrl}" alt="${template.companyName}" style="max-width: 150px;">
      <h1 style="color: ${template.colors.primary};">${template.headline}</h1>
    </div>
    <div class="content">
      ${formattedParagraphs}
      <center>
        <a href="${template.ctaUrl}" class="button">${template.ctaText}</a>
      </center>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${template.companyName}. All rights reserved.</p>
      <p>${template.companyAddress}</p>
      <p>To unsubscribe, <a href="#" style="color: ${template.colors.primary};">click here</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

export function generateEmailText(template: EmailTemplate): string {
  return `${template.subject}
${template.preheader}

${template.headline}

${template.mainContent}

${template.ctaText}: ${template.ctaUrl}

© ${new Date().getFullYear()} ${template.companyName}. All rights reserved.
${template.companyAddress}

To unsubscribe, follow this link: [http://localhost:3000/unsubscribe]`;
}

export function generateVueEmailTemplate(template: EmailTemplate): string {
  const formattedParagraphs = template.mainContent
    .split('\n\n')
    .filter(paragraph => paragraph.trim() !== '');

  return `<template>
  <Head>
    <title>${template.subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Preview>${template.preheader}</Preview>
  </Head>
  <Container>
    <Section>
      <Row>
        <Column>
          <Img src="${template.logoUrl}" alt="${template.companyName}" width="150" />
          <Text :style="{ color: '${template.colors.primary}', fontWeight: 'bold', fontSize: '24px', fontFamily: '${template.font}, sans-serif' }">${template.headline}</Text>
          <Hr :style="{ borderColor: '${template.colors.primary}' }" />
        </Column>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column>
          ${formattedParagraphs.map(p => `<Text>${p}</Text>`).join('\n          ')}
          <Button :style="{ backgroundColor: '${template.colors.primary}', color: 'white', fontFamily: '${template.font}, sans-serif' }" href="${template.ctaUrl}">
            ${template.ctaText}
          </Button>
        </Column>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column>
          <Hr color="#e5e7eb" />
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            © ${new Date().getFullYear()} ${template.companyName}. All rights reserved.
          </Text>
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            ${template.companyAddress}
          </Text>
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            To unsubscribe, <Link href="http://localhost:3000/unsubscribe" :style="{ color: '${template.colors.primary}' }">click here</Link>
          </Text>
        </Column>
      </Row>
    </Section>
  </Container>
</template>`;
} 