import{e as b,G as x,I as i,H as V,f as w,w as t,l as g,o as y,b as o,h,aH as U,a as n,i as S,d as l,L as d,av as C,g as m,aq as k,t as z,ar as c}from"./CaL5DcWf.js";import{u as T}from"./61L_5zm4.js";import{V as _}from"./CHFqc21c.js";import{V as q}from"./BWlrflAk.js";import{V as B}from"./DN7PZOHx.js";const D={class:"d-flex align-center justify-center ga-4"},F=b({__name:"unsubscribe",setup(N){T({title:"Unsubscribe - DevUnity",meta:[{name:"description",content:"Unsubscribe from the newsletter"},{name:"author",content:"DevUnity"},{name:"robots",content:"noindex, nofollow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Unsubscribe - DevUnity"},{name:"og:description",content:"Unsubscribe from the newsletter"},{name:"og:image",content:"/logo/devunity-title.png"}]});const p=x(),v=i(!1),r=i(""),s=i({show:!1,text:"",color:"success"});V(()=>{v.value=!0});const u=async()=>{await p.unsubscribe(r.value),s.value.show=!0,s.value.text="Vous avez été désinscrit de la newsletter",s.value.color="success",c("/login")},f=()=>{c("/login")};return(A,e)=>(y(),w(g,null,{default:t(()=>[o(_,{class:"d-flex align-center justify-center",style:{"min-height":"100vh"}},{default:t(()=>[o(h,{"max-width":"550",class:"mx-auto rounded-xl elevation-5"},{default:t(()=>[o(U,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:t(()=>[o(S,{size:"48",color:"white",class:"mb-2"},{default:t(()=>e[2]||(e[2]=[l("mdi-email-remove")])),_:1}),e[3]||(e[3]=n("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter",-1))]),_:1}),o(d,{class:"pa-6"},{default:t(()=>[e[6]||(e[6]=n("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. ",-1)),o(q,{onSubmit:C(u,["prevent"])},{default:t(()=>[o(B,{modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=a=>r.value=a),label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[a=>!!a||"L'email est requis",a=>/.+@.+\..+/.test(a)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","rules"]),n("div",D,[o(m,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:f},{default:t(()=>e[4]||(e[4]=[l(" Annuler ")])),_:1}),o(m,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:u},{default:t(()=>e[5]||(e[5]=[l(" Se désabonner ")])),_:1})])]),_:1})]),_:1}),o(d,{class:"text-center pt-0 pb-4"},{default:t(()=>e[7]||(e[7]=[n("p",{class:"text-caption text-medium-emphasis"},[l(" Si vous avez des questions, n'hésitez pas à nous contacter à "),n("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")],-1)])),_:1})]),_:1}),o(k,{modelValue:s.value.show,"onUpdate:modelValue":e[1]||(e[1]=a=>s.value.show=a),color:s.value.color,timeout:"3000",location:"top right"},{default:t(()=>[l(z(s.value.text),1)]),_:1},8,["modelValue","color"])]),_:1})]),_:1}))}});export{F as default};
