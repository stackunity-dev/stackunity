import{e as E,b3 as T,u as k,$ as S,ae as L,aH as P,c as O,o as A}from"./DtsUMP2e.js";const C={style:{display:"none"}},$=E({__name:"analytics-collector",setup(D){const p=T(),y=k();let s,c,l,i=null,r=null;const w=()=>{const e=navigator.userAgent;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e)?"tablet":/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(e)?"mobile":"desktop"},m=async()=>{try{const e=await fetch("/api/proxy/ipapi",{method:"GET",signal:AbortSignal.timeout(3e3)});if(!e.ok)throw new Error(`Erreur HTTP: ${e.status}`);const t=await e.json();return{country:t.country_name,city:t.city}}catch(e){return console.warn("Impossible de récupérer la localisation:",e),{country:"Unknown",city:"Unknown"}}},d=()=>p.hasGivenConsent&&p.preferences.analytics,h=()=>{i&&(document.removeEventListener("visibilitychange",i),i=null),r&&(window.removeEventListener("popstate",r),r=null)},f=()=>{d()&&(console.log("Démarrage du suivi analytique"),s=Date.now(),c=s,l=crypto.randomUUID(),_(),i=v,document.addEventListener("visibilitychange",i),r=_,window.addEventListener("popstate",r))},a=async()=>{console.log("Arrêt du suivi analytique"),h(),s&&await g()},_=async()=>{var o;if(!d()){a();return}const e=Date.now(),t=c?e-c:0;c=e;const n=await m();try{const u=await fetch("/api/analytics/collect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"pageview",page_url:window.location.pathname,page_title:document.title,user_id:((o=y.user)==null?void 0:o.id)||"anonymous",session_id:l,device_type:w(),country:n.country,city:n.city,referrer_url:document.referrer,visit_duration:Math.floor(t/1e3),is_new_visitor:!1,is_bounce:!1,is_conversion:!1,browser:navigator.userAgent.toLowerCase().includes("chrome")?"chrome":navigator.userAgent.toLowerCase().includes("firefox")?"firefox":navigator.userAgent.toLowerCase().includes("safari")?"safari":"other"})});if(!u.ok)throw new Error(`Erreur HTTP: ${u.status}`)}catch(u){console.error("Erreur lors de l'envoi des données analytiques:",u)}},v=async()=>{var e;if(!d()){a();return}if(document.hidden){const t=Date.now()-s;try{const n=Date.now(),o=await fetch(`/api/analytics/collect?_=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"session_end",session_id:l,user_id:((e=y.user)==null?void 0:e.id)||"anonymous",visit_duration:Math.floor(t/1e3),is_bounce:!1,is_conversion:!1,is_new_visitor:!1,page_url:window.location.pathname,page_title:document.title,device_type:w(),browser:"unknown"})});if(!o.ok)throw new Error(`Erreur HTTP: ${o.status}`)}catch(n){console.error("Erreur lors de l'envoi des données de fin de session:",n)}}},g=async()=>{var t;const e=Date.now()-s;try{const n=Date.now(),o=await fetch(`/api/analytics/collect?_=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"session_end",session_id:l,user_id:((t=y.user)==null?void 0:t.id)||"anonymous",visit_duration:Math.floor(e/1e3),is_bounce:!1,is_conversion:!1,is_new_visitor:!1,page_url:window.location.pathname,page_title:document.title,device_type:w(),browser:"unknown"})});if(!o.ok)throw new Error(`Erreur HTTP: ${o.status}`)}catch(n){console.error("Erreur lors de l'envoi des données de fin de session:",n)}};S(()=>p.preferences.analytics,e=>{e?f():a()});const b=()=>{window.addEventListener("analytics-preference-changed",e=>{var n;const t=(n=e.detail)==null?void 0:n.enabled;console.log("Préférence analytics modifiée:",t),t?f():a()})};return L(()=>{b(),d()&&f()}),P(async()=>{await a()}),(e,t)=>(A(),O("div",C))}});export{$ as _};
