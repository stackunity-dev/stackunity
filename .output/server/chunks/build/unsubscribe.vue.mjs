globalThis.__timing__.logStart('Load chunks/build/unsubscribe.vue');import { defineComponent, ref, withCtx, createTextVNode, createVNode, withModifiers, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { N as k, x, q as qe, V as j, L, U as C, b as We, a1 as Be, $ } from './server.mjs';
import { m } from './v3.mjs';
import { _ } from './VMain.mjs';
import { N } from './VForm.mjs';
import { F as Fe } from './VTextField.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';
import 'pinia';
import 'vue-router';
import 'deep-pick-omit';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const Ve=defineComponent({__name:"unsubscribe",__ssrInlineRender:true,setup(I){m({title:"Unsubscribe - DevUnity",meta:[{name:"description",content:"Unsubscribe from the newsletter"},{name:"author",content:"DevUnity"},{name:"robots",content:"noindex, nofollow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Unsubscribe - DevUnity"},{name:"og:description",content:"Unsubscribe from the newsletter"},{name:"og:image",content:"/logo/devunity-title.png"}]});const B=k();ref(false);const o=ref(""),a=ref({show:false,text:"",color:"success"}),s=async()=>{await B.unsubscribe(o.value),a.value.show=true,a.value.text="Vous avez été désinscrit de la newsletter",a.value.color="success",$("/login");},V=()=>{$("/login");};return (ee,H,E,G)=>{H(ssrRenderComponent(x,G,{default:withCtx((te,T,J,K)=>{if(T)T(ssrRenderComponent(_,{class:"d-flex align-center justify-center",style:{"min-height":"100vh"}},{default:withCtx((c,A,D,F)=>{if(A)A(ssrRenderComponent(qe,{"max-width":"550",class:"mx-auto rounded-xl elevation-5"},{default:withCtx((d,x,z,S)=>{if(x)x(ssrRenderComponent(j,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:withCtx((p,u,U,v)=>{if(u)u(ssrRenderComponent(L,{size:"48",color:"white",class:"mb-2"},{default:withCtx((b,m,C,w)=>{if(m)m("mdi-email-remove");else return [createTextVNode("mdi-email-remove")]}),_:1},U,v)),u(`<h1 class="text-h4 text-white font-weight-bold"${v}>Se désabonner de la newsletter</h1>`);else return [createVNode(L,{size:"48",color:"white",class:"mb-2"},{default:withCtx(()=>[createTextVNode("mdi-email-remove")]),_:1}),createVNode("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter")]}),_:1},z,S)),x(ssrRenderComponent(C,{class:"pa-6"},{default:withCtx((p,u,U,v)=>{if(u)u(`<p class="text-body-1 mb-6 text-center text-medium-emphasis"${v}> Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. </p>`),u(ssrRenderComponent(N,{onSubmit:s},{default:withCtx((b,m,C,w)=>{if(m)m(ssrRenderComponent(Fe,{modelValue:o.value,"onUpdate:modelValue":r=>o.value=r,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[r=>!!r||"L'email est requis",r=>/.+@.+\..+/.test(r)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,C,w)),m(`<div class="d-flex align-center justify-center ga-4"${w}>`),m(ssrRenderComponent(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx((r,y,O,P)=>{if(y)y(" Annuler ");else return [createTextVNode(" Annuler ")]}),_:1},C,w)),m(ssrRenderComponent(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx((r,y,O,P)=>{if(y)y(" Se désabonner ");else return [createTextVNode(" Se désabonner ")]}),_:1},C,w)),m("</div>");else return [createVNode(Fe,{modelValue:o.value,"onUpdate:modelValue":r=>o.value=r,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[r=>!!r||"L'email est requis",r=>/.+@.+\..+/.test(r)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","onUpdate:modelValue","rules"]),createVNode("div",{class:"d-flex align-center justify-center ga-4"},[createVNode(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx(()=>[createTextVNode(" Annuler ")]),_:1}),createVNode(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx(()=>[createTextVNode(" Se désabonner ")]),_:1})])]}),_:1},U,v));else return [createVNode("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. "),createVNode(N,{onSubmit:withModifiers(s,["prevent"])},{default:withCtx(()=>[createVNode(Fe,{modelValue:o.value,"onUpdate:modelValue":b=>o.value=b,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[b=>!!b||"L'email est requis",b=>/.+@.+\..+/.test(b)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","onUpdate:modelValue","rules"]),createVNode("div",{class:"d-flex align-center justify-center ga-4"},[createVNode(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx(()=>[createTextVNode(" Annuler ")]),_:1}),createVNode(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx(()=>[createTextVNode(" Se désabonner ")]),_:1})])]),_:1})]}),_:1},z,S)),x(ssrRenderComponent(C,{class:"text-center pt-0 pb-4"},{default:withCtx((p,u,U,v)=>{if(u)u(`<p class="text-caption text-medium-emphasis"${v}> Si vous avez des questions, n&#39;hésitez pas à nous contacter à <a href="mailto:support@example.com" class="text-primary"${v}>devunity@support.com</a></p>`);else return [createVNode("p",{class:"text-caption text-medium-emphasis"},[createTextVNode(" Si vous avez des questions, n'hésitez pas à nous contacter à "),createVNode("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")])]}),_:1},z,S));else return [createVNode(j,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:withCtx(()=>[createVNode(L,{size:"48",color:"white",class:"mb-2"},{default:withCtx(()=>[createTextVNode("mdi-email-remove")]),_:1}),createVNode("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter")]),_:1}),createVNode(C,{class:"pa-6"},{default:withCtx(()=>[createVNode("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. "),createVNode(N,{onSubmit:withModifiers(s,["prevent"])},{default:withCtx(()=>[createVNode(Fe,{modelValue:o.value,"onUpdate:modelValue":p=>o.value=p,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[p=>!!p||"L'email est requis",p=>/.+@.+\..+/.test(p)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","onUpdate:modelValue","rules"]),createVNode("div",{class:"d-flex align-center justify-center ga-4"},[createVNode(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx(()=>[createTextVNode(" Annuler ")]),_:1}),createVNode(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx(()=>[createTextVNode(" Se désabonner ")]),_:1})])]),_:1})]),_:1}),createVNode(C,{class:"text-center pt-0 pb-4"},{default:withCtx(()=>[createVNode("p",{class:"text-caption text-medium-emphasis"},[createTextVNode(" Si vous avez des questions, n'hésitez pas à nous contacter à "),createVNode("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")])]),_:1})]}),_:1},D,F)),A(ssrRenderComponent(Be,{modelValue:a.value.show,"onUpdate:modelValue":d=>a.value.show=d,color:a.value.color,timeout:"3000",location:"top right"},{default:withCtx((d,x,z,S)=>{if(x)x(`${ssrInterpolate(a.value.text)}`);else return [createTextVNode(toDisplayString(a.value.text),1)]}),_:1},D,F));else return [createVNode(qe,{"max-width":"550",class:"mx-auto rounded-xl elevation-5"},{default:withCtx(()=>[createVNode(j,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:withCtx(()=>[createVNode(L,{size:"48",color:"white",class:"mb-2"},{default:withCtx(()=>[createTextVNode("mdi-email-remove")]),_:1}),createVNode("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter")]),_:1}),createVNode(C,{class:"pa-6"},{default:withCtx(()=>[createVNode("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. "),createVNode(N,{onSubmit:withModifiers(s,["prevent"])},{default:withCtx(()=>[createVNode(Fe,{modelValue:o.value,"onUpdate:modelValue":d=>o.value=d,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[d=>!!d||"L'email est requis",d=>/.+@.+\..+/.test(d)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","onUpdate:modelValue","rules"]),createVNode("div",{class:"d-flex align-center justify-center ga-4"},[createVNode(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx(()=>[createTextVNode(" Annuler ")]),_:1}),createVNode(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx(()=>[createTextVNode(" Se désabonner ")]),_:1})])]),_:1})]),_:1}),createVNode(C,{class:"text-center pt-0 pb-4"},{default:withCtx(()=>[createVNode("p",{class:"text-caption text-medium-emphasis"},[createTextVNode(" Si vous avez des questions, n'hésitez pas à nous contacter à "),createVNode("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")])]),_:1})]),_:1}),createVNode(Be,{modelValue:a.value.show,"onUpdate:modelValue":d=>a.value.show=d,color:a.value.color,timeout:"3000",location:"top right"},{default:withCtx(()=>[createTextVNode(toDisplayString(a.value.text),1)]),_:1},8,["modelValue","onUpdate:modelValue","color"])]}),_:1},J,K));else return [createVNode(_,{class:"d-flex align-center justify-center",style:{"min-height":"100vh"}},{default:withCtx(()=>[createVNode(qe,{"max-width":"550",class:"mx-auto rounded-xl elevation-5"},{default:withCtx(()=>[createVNode(j,{class:"bg-primary text-center pa-6 rounded-t-xl"},{default:withCtx(()=>[createVNode(L,{size:"48",color:"white",class:"mb-2"},{default:withCtx(()=>[createTextVNode("mdi-email-remove")]),_:1}),createVNode("h1",{class:"text-h4 text-white font-weight-bold"},"Se désabonner de la newsletter")]),_:1}),createVNode(C,{class:"pa-6"},{default:withCtx(()=>[createVNode("p",{class:"text-body-1 mb-6 text-center text-medium-emphasis"}," Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de notre newsletter. "),createVNode(N,{onSubmit:withModifiers(s,["prevent"])},{default:withCtx(()=>[createVNode(Fe,{modelValue:o.value,"onUpdate:modelValue":c=>o.value=c,label:"Adresse e-mail","prepend-inner-icon":"mdi-email-outline",variant:"outlined",rules:[c=>!!c||"L'email est requis",c=>/.+@.+\..+/.test(c)||"Veuillez entrer une adresse email valide"],required:"",class:"mb-6"},null,8,["modelValue","onUpdate:modelValue","rules"]),createVNode("div",{class:"d-flex align-center justify-center ga-4"},[createVNode(We,{"prepend-icon":"mdi-arrow-left",variant:"tonal",color:"primary",onClick:V},{default:withCtx(()=>[createTextVNode(" Annuler ")]),_:1}),createVNode(We,{"prepend-icon":"mdi-email-remove-outline",variant:"tonal",color:"error",type:"submit",onClick:s},{default:withCtx(()=>[createTextVNode(" Se désabonner ")]),_:1})])]),_:1})]),_:1}),createVNode(C,{class:"text-center pt-0 pb-4"},{default:withCtx(()=>[createVNode("p",{class:"text-caption text-medium-emphasis"},[createTextVNode(" Si vous avez des questions, n'hésitez pas à nous contacter à "),createVNode("a",{href:"mailto:support@example.com",class:"text-primary"},"devunity@support.com")])]),_:1})]),_:1}),createVNode(Be,{modelValue:a.value.show,"onUpdate:modelValue":c=>a.value.show=c,color:a.value.color,timeout:"3000",location:"top right"},{default:withCtx(()=>[createTextVNode(toDisplayString(a.value.text),1)]),_:1},8,["modelValue","onUpdate:modelValue","color"])]),_:1})]}),_:1},E));}}});

const s=Ve.setup;Ve.setup=(o,u)=>{const e=useSSRContext();return (e.modules||(e.modules=new Set)).add("pages/unsubscribe.vue"),s?s(o,u):void 0};

export { Ve as default };;globalThis.__timing__.logEnd('Load chunks/build/unsubscribe.vue');
