import fs from 'fs';
import { defineEventHandler } from 'h3';
import path from 'path';

const SUPPORTED_LANGUAGES = [
  { code: 'en', iso: 'en', dir: 'ltr' },
  { code: 'fr', iso: 'fr', dir: 'ltr' },
  { code: 'es', iso: 'es', dir: 'ltr' },
  { code: 'ar', iso: 'ar', dir: 'rtl' },
  { code: 'zh', iso: 'zh', dir: 'ltr' }
];

const INDEXABLE_PAGES = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/privacy',
  '/notices',
  '/terms'
];

const PAGE_IMAGES = {
  '/': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'StackUnity Platform',
      fr: 'Plateforme StackUnity',
      es: 'Plataforma StackUnity',
      ar: 'منصة StackUnity',
      zh: 'StackUnity 平台'
    },
    caption: {
      en: 'StackUnity - developement hub all-in-one platform',
      fr: 'StackUnity - plateforme tout-en-un pour le développement',
      es: 'StackUnity - plataforma todo en uno para desarrollo',
      ar: 'StackUnity - منصة شاملة لتطوير البرمجيات',
      zh: 'StackUnity - 一站式开发中心平台'
    }
  },
  '/about': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'About StackUnity',
      fr: 'À propos de StackUnity',
      es: 'Acerca de StackUnity',
      ar: 'حول StackUnity',
      zh: '关于 StackUnity'
    },
    caption: {
      en: 'About StackUnity',
      fr: 'À propos de StackUnity',
      es: 'Acerca de StackUnity',
      ar: 'حول StackUnity',
      zh: '关于 StackUnity'
    }
  },
  '/contact': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'Contact StackUnity',
      fr: 'Contactez StackUnity',
      es: 'Contacto StackUnity',
      ar: 'اتصل بـ StackUnity',
      zh: '联系 StackUnity'
    },
    caption: {
      en: 'Contact StackUnity',
      fr: 'Contactez StackUnity',
      es: 'Contacto StackUnity',
      ar: 'اتصل بـ StackUnity',
      zh: '联系 StackUnity'
    }
  },
  '/login': {
    url: 'https://stackunity.tech/logo/stackunity.png',
    title: {
      en: 'StackUnity - Login',
      fr: 'StackUnity - Connexion',
      es: 'StackUnity - Iniciar sesión',
      ar: 'StackUnity - تسجيل الدخول',
      zh: 'StackUnity - 登录'
    },
    caption: {
      en: 'StackUnity - Login',
      fr: 'StackUnity - Connexion',
      es: 'StackUnity - Iniciar sesión',
      ar: 'StackUnity - تسجيل الدخول',
      zh: 'StackUnity - 登录'
    }
  },
  '/signup': {
    url: 'https://stackunity.tech/logo/stackunity.png',
    title: {
      en: 'StackUnity - Sign Up',
      fr: 'StackUnity - Inscription',
      es: 'StackUnity - Registro',
      ar: 'StackUnity - التسجيل',
      zh: 'StackUnity - 注册'
    },
    caption: {
      en: 'StackUnity - Sign Up',
      fr: 'StackUnity - Inscription',
      es: 'StackUnity - Registro',
      ar: 'StackUnity - التسجيل',
      zh: 'StackUnity - 注册'
    }
  },
  '/privacy': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'StackUnity - Privacy Policy',
      fr: 'StackUnity - Politique de confidentialité',
      es: 'StackUnity - Política de privacidad',
      ar: 'StackUnity - سياسة الخصوصية',
      zh: 'StackUnity - 隐私政策'
    },
    caption: {
      en: 'StackUnity Privacy Policy',
      fr: 'Politique de confidentialité StackUnity',
      es: 'Política de privacidad de StackUnity',
      ar: 'سياسة خصوصية StackUnity',
      zh: 'StackUnity 隐私政策'
    }
  },
  '/notices': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'StackUnity - Legal Notices',
      fr: 'StackUnity - Mentions légales',
      es: 'StackUnity - Avisos legales',
      ar: 'StackUnity - الإشعارات القانونية',
      zh: 'StackUnity - 法律声明'
    },
    caption: {
      en: 'StackUnity Legal Notices',
      fr: 'Mentions légales de StackUnity',
      es: 'Avisos legales de StackUnity',
      ar: 'الإشعارات القانونية لـ StackUnity',
      zh: 'StackUnity 法律声明'
    }
  },
  '/terms': {
    url: 'https://stackunity.tech/logo/stackunity-title.png',
    title: {
      en: 'StackUnity - Terms of Service',
      fr: 'StackUnity - Conditions d\'utilisation',
      es: 'StackUnity - Términos de servicio',
      ar: 'StackUnity - شروط الخدمة',
      zh: 'StackUnity - 服务条款'
    },
    caption: {
      en: 'StackUnity Terms of Service',
      fr: 'Conditions d\'utilisation de StackUnity',
      es: 'Términos de servicio de StackUnity',
      ar: 'شروط خدمة StackUnity',
      zh: 'StackUnity 服务条款'
    }
  }
};

export default defineEventHandler(async (event) => {
  try {
    const baseUrl = 'https://stackunity.tech';
    const lastMod = new Date().toISOString();

    let sitemapPages = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const page of INDEXABLE_PAGES) {
      const pageUrl = `${baseUrl}${page}`;
      const priority = page === '/' ? '1.0' : '0.8';
      const changefreq = page === '/' ? 'daily' : 'weekly';

      const pageImage = PAGE_IMAGES[page];
      let imageTag = '';

      if (pageImage) {
        imageTag = `
    <image:image>
      <image:loc>${pageImage.url}</image:loc>
      <image:caption>${pageImage.caption.en}</image:caption>
      <image:title>${pageImage.title.en}</image:title>
    </image:image>`;
      }

      let hreflangs = '';
      for (const lang of SUPPORTED_LANGUAGES) {
        const langPath = lang.code === 'en' ? page : `/${lang.code}${page}`;
        hreflangs += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${baseUrl}${langPath}"/>`;
      }

      hreflangs += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl}"/>`;

      sitemapPages += `
  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}${hreflangs}
  </url>`;
    }

    sitemapPages += `
</urlset>`;

    let sitemapLanguages = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const lang of SUPPORTED_LANGUAGES.filter(l => l.code !== 'en')) {
      for (const page of INDEXABLE_PAGES) {
        const pageUrl = `${baseUrl}/${lang.code}${page}`;
        const priority = page === '/' ? '0.9' : '0.7';
        const changefreq = page === '/' ? 'daily' : 'weekly';

        const pageImage = PAGE_IMAGES[page];
        let imageTag = '';

        if (pageImage) {
          imageTag = `
    <image:image>
      <image:loc>${pageImage.url}</image:loc>
      <image:caption>${pageImage.caption[lang.code]}</image:caption>
      <image:title>${pageImage.title[lang.code]}</image:title>
    </image:image>`;
        }

        let hreflangs = '';
        for (const langAlt of SUPPORTED_LANGUAGES) {
          const langPath = langAlt.code === 'en' ? page : `/${langAlt.code}${page}`;
          hreflangs += `
    <xhtml:link rel="alternate" hreflang="${langAlt.code}" href="${baseUrl}${langPath}"/>`;
        }

        hreflangs += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page}"/>`;

        sitemapLanguages += `
  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}${hreflangs}
  </url>`;
      }
    }

    sitemapLanguages += `
</urlset>`;

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-languages.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
</sitemapindex>`;

    const publicDir = path.resolve(process.cwd(), 'public');

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
    fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), sitemapPages);
    fs.writeFileSync(path.join(publicDir, 'sitemap-languages.xml'), sitemapLanguages);

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

Host: ${baseUrl}
`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'max-age=600, public'
      },
      body: sitemapIndex
    };
  } catch (error) {
    console.error('Erreur lors de la génération des sitemaps:', error);
    return {
      success: false,
      error: error.message
    };
  }
}); 