import{_ as z}from"./ltmAD03y.js";import{p as H,e as K,u as Z,b3 as W,H as ee,bJ as te,m as D,cy as se,$ as N,J as B,ae as ne,f as c,o,w as a,b as n,a as d,j as $,q as ae,c as y,s as r,cX as k,K as w,F as b,r as S,t as x,Q as h,aB as j,d as U,b1 as oe,D as re,i as ie,cY as le,l as de,cZ as ce,_ as ue}from"./DS3qCAFv.js";import{p as me}from"./DUHSmTG6.js";import{_ as pe}from"./C2elHhvT.js";import{V as fe}from"./BQbiSwx5.js";import{V as ge}from"./CuO9SHfo.js";import{V as ve}from"./Ciz5DV75.js";import{V as ye}from"./CK1cOT0R.js";import"./BsnO5YNv.js";import"./BGiJcn-p.js";const be=H("/logo/devunity-letter.png"),he={class:"drawer-header pa-4"},_e={class:"text-caption"},De={class:"text-caption"},ke={class:"d-flex align-center"},we={class:"text-h5 font-weight-bold"},Se=K({__name:"dashboard",setup(xe){const u=Z(),V=W(),G=ee(),A=te(),L=D([]),I=D(""),_=se(),v=D(!_.smAndDown.value),i=D("Dashboard");N(()=>A.path,()=>{_.smAndDown.value&&(v.value=!1),P()}),N(()=>_.smAndDown.value,e=>{e||(v.value=!0)});const P=()=>{const e=A.path;if(e==="/dashboard")i.value="Dashboard";else if(e.includes("/snippets"))i.value="Snippets";else if(e.includes("/sql-generator"))i.value="Database Designer";else if(e.includes("/studio"))i.value="Studio";else if(e.includes("/responsive"))i.value="Responsive";else if(e.includes("/accessibility"))i.value="Accessibility";else if(e.includes("/seo-audit"))i.value="SEO Audit";else if(e.includes("/settings"))i.value="Settings";else if(e.includes("/newsletter-admin"))i.value="Newsletter";else{const t=e.split("/").pop()||"Dashboard";i.value=t.charAt(0).toUpperCase()+t.slice(1)}},E=B(()=>[...u.personalSnippets].sort((e,t)=>{const l=T(e);return T(t)-l}).slice(0,5)),R=B(()=>[...u.sqlSchemas].slice(0,5)),q=e=>{if(e&&e.schema_data)try{const t=typeof e.schema_data=="string"?JSON.parse(e.schema_data):e.schema_data;return t.tables?t.tables.length:0}catch(t){return console.error("Error parsing schema data:",t),0}return 0},T=e=>{if(e){const t=e.date||e.snippet_date;if(t){const l=new Date(t);if(!isNaN(l.getTime()))return l.getTime()}}return 0},F=e=>{if(e){const t=e.date||e.snippet_date;if(t)return M(t)}return"Date unknown"},M=e=>{if(!e)return"Date unknown";try{const t=new Date(e);if(isNaN(t.getTime()))return"Invalid date";const g=Math.abs(new Date().getTime()-t.getTime()),s=Math.ceil(g/(1e3*60*60*24));return s===1?"Yesterday":s<7?`${s} days ago`:t.toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}catch(t){return console.error("Error formatting date:",t),"Date error"}},Q=e=>{switch(e==null?void 0:e.toLowerCase()){case"react":return"mdi-react";case"vue.js 3":case"vue":return"mdi-vuejs";case"angular":return"mdi-angular";case"nest.js":return"mdi-nodejs";case"nuxt 3":case"nuxt":return"mdi-nuxt";default:return"mdi-code-tags"}},O=()=>{const e=A.path;return e==="/dashboard"?"mdi-view-dashboard-outline":e.includes("/snippets")?"mdi-code-tags":e.includes("/sql-generator")?"mdi-database-cog":e.includes("/studio")?"mdi-palette":e.includes("/responsive")?"mdi-responsive":e.includes("/accessibility")?"mdi-access-point":e.includes("/seo-audit")?"mdi-magnify":e.includes("/robots")?"mdi-robot":e.includes("/settings")?"mdi-cog-outline":e.includes("/newsletter-admin")?"mdi-email-outline":"mdi-application"},m=()=>{_.smAndDown.value&&(v.value=!1)},J=async()=>{try{await u.logout(),m(),G.push("/login")}catch(e){console.error("Error during logout:",e)}};ne(()=>{var e;u.loadSnippets(),u.loadSQLSchemas(),P(),console.log("[DEBUG] Marketing activé dans layout dashboard:",V.preferences.marketing),console.log("[DEBUG] Analytics activé dans layout dashboard:",V.preferences.analytics),console.log("[DEBUG] Préférences cookies complètes:",V.preferences),console.log("[DEBUG] Statut premium de l'utilisateur:",(e=u.user)==null?void 0:e.isPremium)}),N(()=>{var e;return(e=u.user)==null?void 0:e.isPremium},e=>{console.log("[DEBUG] Changement du statut premium détecté:",e)},{immediate:!0});function C(e,t,l,g){var s;return(s=u.user)!=null&&s.isPremium?{title:e,link:t,icon:l}:{title:`${e} (Premium)`,link:"#",icon:l,component:{component:ce(me),props:{type:"list-item",title:e,icon:l,featureKey:g}}}}const X=B(()=>[{title:"Frontend",prependIcon:"mdi-web",link:!0,children:[{title:"Snippets",link:"/snippets",icon:"mdi-code-tags"},{title:"Studio",link:"/studio",icon:"mdi-palette"}]},{title:"Backend",prependIcon:"mdi-database-outline",link:!0,children:[C("Database Designer","/sql-generator","mdi-database","databaseDesigner")]},{title:"UI/UX",prependIcon:"mdi-palette",link:!0,children:[{title:"Responsive",link:"/responsive",icon:"mdi-responsive"},{title:"Accessibility",link:"/accessibility",icon:"mdi-access-point"}]},{title:"SEO",prependIcon:"mdi-rocket-launch-outline",link:!0,children:[C("SEO Audit","/seo-audit","mdi-magnify","seoAudit"),C("Robots & Schema","/robots","mdi-robot","robots")]}]);return(e,t)=>{const l=z,g=le;return o(),c(de,null,{default:a(()=>[n(pe),n(fe,{modelValue:v.value,"onUpdate:modelValue":t[2]||(t[2]=s=>v.value=s),temporary:e.$vuetify.display.smAndDown,permanent:!e.$vuetify.display.smAndDown,app:"",clipped:"",class:"elevation-2"},{default:a(()=>[d("div",he,[t[3]||(t[3]=d("div",{class:"d-flex align-center mb-4"},[d("div",{class:"logo-container mr-3"},[d("img",{src:be,alt:"DevUnity",class:"logo-devunity"})]),d("div",null,[d("div",{class:"text-h6 font-weight-bold"},"DevUnity"),d("div",{class:"text-caption text-medium-emphasis"},"v1.0.0")])],-1)),n(ge,{modelValue:I.value,"onUpdate:modelValue":t[0]||(t[0]=s=>I.value=s),density:"compact",variant:"outlined",placeholder:"Search...","prepend-inner-icon":"mdi-magnify","hide-details":"",rounded:"",class:"mb-2","bg-color":"surface"},null,8,["modelValue"])]),n($),n(ae,{density:"compact",opened:L.value,"onUpdate:opened":t[1]||(t[1]=s=>L.value=s),nav:"",class:"px-2"},{default:a(()=>[n(r,{to:"/dashboard","prepend-icon":"mdi-view-dashboard-outline",title:"Dashboard",rounded:"lg",class:"mb-1",color:"primary",nuxt:"",onClick:m}),n(k,{value:"Recent Projects",class:"mb-1","prepend-icon":"mdi-history"},{activator:a(({props:s})=>[n(r,h(s,{title:"Recent Projects",rounded:"lg",color:"primary"}),null,16)]),default:a(()=>[(o(!0),y(b,null,S(E.value,(s,f)=>(o(),c(r,{key:f,to:`/snippets?id=${s.id}`,title:s.title,"prepend-icon":Q(s.framework),class:"ml-4",rounded:"lg",color:"primary",nuxt:"",onClick:m},{subtitle:a(()=>[d("span",_e,x(F(s)),1)]),_:2},1032,["to","title","prepend-icon"]))),128)),E.value.length===0?(o(),c(r,{key:0,class:"ml-4",title:"No recent projects",disabled:""})):w("",!0)]),_:1}),n(k,{value:"Recent SQL schemas",class:"mb-1","prepend-icon":"mdi-database-outline"},{activator:a(({props:s})=>[n(r,h(s,{title:"Recent SQL schemas",rounded:"lg",color:"primary"}),null,16)]),default:a(()=>[(o(!0),y(b,null,S(R.value,(s,f)=>(o(),c(r,{key:f,to:`/sql-generator?id=${s.id}`,title:s.database_name,"prepend-icon":"mdi-database",class:"ml-4",rounded:"lg",color:"primary",nuxt:"",onClick:m},{subtitle:a(()=>[d("span",De,x(q(s))+" tables",1)]),_:2},1032,["to","title"]))),128)),R.value.length===0?(o(),c(r,{key:0,class:"ml-4",title:"No recent SQL schemas",disabled:""})):w("",!0)]),_:1}),n(j,{class:"mt-2 text-uppercase font-weight-bold text-caption"},{default:a(()=>t[4]||(t[4]=[U("Applications")])),_:1}),(o(!0),y(b,null,S(X.value,(s,f)=>(o(),c(k,{key:f,value:s.title,class:"mb-1","prepend-icon":s.prependIcon},{activator:a(({props:p})=>[n(r,h({ref_for:!0},p,{title:s.title,rounded:"lg",color:"primary"}),null,16,["title"])]),default:a(()=>[(o(!0),y(b,null,S(s.children,(p,Y)=>(o(),y(b,{key:Y},[p.component?(o(),c(oe(p.component.component),h({key:0,ref_for:!0},p.component.props,{class:"ml-4 my-1 premium-menu-item"}),null,16)):(o(),c(r,{key:1,to:p.link,title:p.title,"prepend-icon":p.icon||"mdi-circle-small",class:"ml-4",rounded:"lg",color:"primary",nuxt:"",onClick:m},null,8,["to","title","prepend-icon"]))],64))),128))]),_:2},1032,["value","prepend-icon"]))),128)),n($,{class:"my-3"}),n(j,{class:"text-uppercase font-weight-bold text-caption"},{default:a(()=>t[5]||(t[5]=[U("System")])),_:1}),n(l,null,{default:a(()=>{var s;return[(s=re(u).user)!=null&&s.isAdmin?(o(),c(k,{key:0,value:"Administration",class:"mb-1","prepend-icon":"mdi-shield-account"},{activator:a(({props:f})=>[n(r,h(f,{title:"Administration",rounded:"lg",color:"primary"}),null,16)]),default:a(()=>[n(r,{to:"/admin/newsletter-admin","prepend-icon":"mdi-email-outline",title:"Newsletter",rounded:"lg",class:"ml-4",color:"primary",nuxt:"",onClick:m}),n(r,{to:"/admin/analytics","prepend-icon":"mdi-chart-box",title:"Analytics",rounded:"lg",class:"ml-4",color:"primary",nuxt:"",onClick:m})]),_:1})):w("",!0)]}),_:1}),n(r,{to:"/settings","prepend-icon":"mdi-cog-outline",title:"Settings",rounded:"lg",class:"mb-1",color:"primary",nuxt:"",onClick:m}),n(r,{onClick:J,"prepend-icon":"mdi-logout",title:"Logout",rounded:"lg",color:"error"})]),_:1},8,["opened"])]),_:1},8,["modelValue","temporary","permanent"]),n(ve,null,{default:a(()=>[e.$vuetify.display.smAndDown?w("",!0):(o(),c(ye,{key:0,color:"primary",flat:"",class:"border-b page-header px-4","scroll-behavior":"elevate",elevation:0},{default:a(()=>[d("div",ke,[n(ie,{size:"large",class:"mr-3"},{default:a(()=>[U(x(O()),1)]),_:1}),d("div",we,x(i.value),1)])]),_:1})),n(g)]),_:1})]),_:1})}}}),Re=ue(Se,[["__scopeId","data-v-b5389df5"]]);export{Re as default};
