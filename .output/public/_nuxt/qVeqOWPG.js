import{aT as u,u as m,ae as n}from"./CTpYCmOx.js";import"./CoKilWGJ.js";import"./BOmTdu30.js";const l=u(e=>{const r=m(),s=["/sql-generator","/seo-audit","/robots"],t=e.path.toLowerCase(),i=s.some(a=>{const o=a.toLowerCase();return t===o||t.startsWith(`${o}/`)});if((e.meta.requiresPremium||i)&&!r.user.isPremium)return console.log(`Access denied to premium route: ${e.path}`),n("/subscription")});export{l as default};
