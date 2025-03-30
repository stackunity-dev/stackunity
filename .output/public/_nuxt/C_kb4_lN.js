import{h as b,d as i,x,a5 as V,a7 as t,a6 as w,m as o,ac as n,a8 as r,ak as g,$ as y}from"./CoKilWGJ.js";import{u as h,f as U,b as S,m as k,c as C,l as m,a as d,a3 as z,ae as c}from"./CTpYCmOx.js";import{u as T}from"./C5XFgQnc.js";import{V as _}from"./BjfENyHQ.js";import{V as B}from"./SxKDZnYd.js";import{V as D}from"./B2zV2hO7.js";import"./BOmTdu30.js";const N={class:"d-flex align-center justify-center ga-4"},E=b({__name:"unsubscribe",setup(q){T({title:"Unsubscribe - DevUnity",meta:[{name:"description",content:"Unsubscribe from the newsletter"},{name:"author",content:"DevUnity"},{name:"robots",content:"noindex, nofollow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Unsubscribe - DevUnity"},{name:"og:description",content:"Unsubscribe from the newsletter"},{name:"og:image",content:"/logo/devunity-title.png"}]});const p=h(),f=i(!1),l=i(""),a=i({show:!1,text:"",color:"success"});x(()=>{f.value=!0});const u=async()=>{await p.unsubscribe(l.value),a.value.show=!0,a.value.text="Vous avez été désinscrit de la newsletter",a.value.color="success",c("/login")},v=()=>{c("/login")};return(A,e)=>(w(),V(U,null,{default:t(()=>[o(_,{class:"d-flex align-center justify-center",style:{"min-height":"100vh"}},{default:t(()=>[o(S,{"max-width":"550",class:"mx-auto rounded-xl elevation-5"},{default:t(()=>[o(k,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:t(()=>[o(C,{size:"48",color:"white",class:"mb-2"},{default:t(()=>e[2]||(e[2]=[r("mdi-email-remove")])),_:1}),e[3]||(e[3]=n("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter",-1))]),_:1}),o(m,{class:"pa-6"},{default:t(()=>[e[6]||(e[6]=n("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. ",-1)),o(B,{onSubmit:g(u,["prevent"])},{default:t(()=>[o(D,{modelValue:l.value,"onUpdate:modelValue":e[0]||(e[0]=s=>l.value=s),label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[s=>!!s||"L'email est requis",s=>/.+@.+\..+/.test(s)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","rules"]),n("div",N,[o(d,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:v},{default:t(()=>e[4]||(e[4]=[r(" Annuler ")])),_:1}),o(d,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:u},{default:t(()=>e[5]||(e[5]=[r(" Se désabonner ")])),_:1})])]),_:1})]),_:1}),o(m,{class:"text-center pt-0 pb-4"},{default:t(()=>e[7]||(e[7]=[n("p",{class:"text-caption text-medium-emphasis"},[r(" Si vous avez des questions, n'hésitez pas à nous contacter à "),n("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")],-1)])),_:1})]),_:1}),o(z,{modelValue:a.value.show,"onUpdate:modelValue":e[1]||(e[1]=s=>a.value.show=s),color:a.value.color,timeout:"3000",location:"top right"},{default:t(()=>[r(y(a.value.text),1)]),_:1},8,["modelValue","color"])]),_:1})]),_:1}))}});export{E as default};
