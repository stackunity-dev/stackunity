import{cW as a,u as m,bt as n}from"./DtsUMP2e.js";const d=a(e=>{const o=m(),r=["/sql-generator","/seo-audit","/robots"],t=e.path.toLowerCase(),i=r.some(u=>{const s=u.toLowerCase();return t===s||t.startsWith(`${s}/`)});if((e.meta.requiresPremium||i)&&!o.user.isPremium)return console.log(`Access denied to premium route: ${e.path}`),n("/subscription")});export{d as default};
