import{cW as u,G as m,ar as n}from"./CaL5DcWf.js";const d=u(e=>{const s=m(),o=["/sql-generator","/seo-audit","/robots"],t=e.path.toLowerCase(),i=o.some(a=>{const r=a.toLowerCase();return t===r||t.startsWith(`${r}/`)});if((e.meta.requiresPremium||i)&&!s.user.isPremium)return console.log(`Access denied to premium route: ${e.path}`),n("/subscription")});export{d as default};
