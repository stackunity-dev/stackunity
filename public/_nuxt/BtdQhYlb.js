import{_ as y}from"./B71tdAEm.js";import{e as w,I as m,f as x,w as a,l as _,o as h,b as e,a as r,V as U,g as c,d as p,h as q,av as C,t as D,_ as k}from"./CaL5DcWf.js";import{_ as S}from"./BzraYnBV.js";import{S as j}from"./Do3WzYPk.js";import{u as B}from"./61L_5zm4.js";import{V as F}from"./C2cyFEl9.js";import{V as d}from"./hc3dmJ37.js";import{V as N}from"./CHFqc21c.js";import{V as f,a as n}from"./D9cfhuwM.js";import{V as T}from"./BWlrflAk.js";import{V as v}from"./DN7PZOHx.js";import{V as Y}from"./BSz84BLr.js";import{V as A}from"./CPhLSrsE.js";import{V as M}from"./wvO4LK6w.js";import"./dvJ2J78E.js";import"./5AmwwOYV.js";import"./CkVm5wB_.js";const P={class:"text-center"},W={class:"text-body-2 text-medium-emphasis"},G=w({__name:"contact",setup(I){B({title:"Contact Us - DevUnity",meta:[{name:"description",content:"Contact the DevUnity team for any questions, suggestions or support requests. We are here to help you."},{name:"keywords",content:"DevUnity, contact, support, questions, suggestions, feedback, help, contact us, support request, contact form, contact us form, contact us page, contact us page design, contact us page development"},{name:"author",content:"DevUnity"},{name:"robots",content:"index, follow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Contact Us - DevUnity"},{name:"og:description",content:"Contact the DevUnity team for any questions, suggestions or support requests. We are here to help you."},{name:"og:image",content:"/logo/devunity-title.png"}]});const s=m({name:"",email:"",subject:"General Question",message:""}),g=["General Question","Technical Support","Feature Request","Bug Report","Partnership","Other"],i=m(!1),l=m({show:!1,text:"",color:"success",timeout:2e3}),V=async()=>{i.value=!0;try{(!s.value.name||!s.value.email||!s.value.subject||!s.value.message)&&(l.value={show:!0,text:"Please fill out all fields.",color:"error",timeout:2e3}),await new Promise(u=>setTimeout(u,1500)),s.value={name:"",email:"",subject:"General Question",message:""},l.value={show:!0,text:"Your message has been sent successfully! We will respond soon.",color:"success",timeout:2e3}}catch(u){console.error("Error sending message:",u),l.value={show:!0,text:"An error occurred while sending your message. Please try again.",color:"error",timeout:2e3}}finally{i.value=!1}};return(u,t)=>{const b=y;return h(),x(_,null,{default:a(()=>[e(F,{app:"",flat:"",elevation:"2",color:"surface"},{default:a(()=>[e(d,{class:"d-flex align-center py-0 my-0"},{default:a(()=>[e(b,{to:"/",class:"text-decoration-none"},{default:a(()=>t[5]||(t[5]=[r("div",{class:"d-flex align-center"},[r("img",{src:S,alt:"DevUnity title",width:"150"})],-1)])),_:1}),e(U),e(c,{color:"primary",to:"/",class:"ml-4"},{default:a(()=>t[6]||(t[6]=[p("Back to Home")])),_:1})]),_:1})]),_:1}),e(N,null,{default:a(()=>[e(d,{class:"py-12"},{default:a(()=>[e(f,{justify:"center"},{default:a(()=>[e(n,{cols:"12",md:"10",lg:"8"},{default:a(()=>[e(q,{class:"pa-8 mb-8 rounded-xl"},{default:a(()=>[t[8]||(t[8]=r("h1",{class:"text-h3 font-weight-bold mb-6"},"Contact Us",-1)),t[9]||(t[9]=r("p",{class:"text-subtitle-1 mb-6"}," We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. ",-1)),e(T,{onSubmit:C(V,["prevent"]),class:"mb-8"},{default:a(()=>[e(f,null,{default:a(()=>[e(n,{cols:"12",md:"6"},{default:a(()=>[e(v,{modelValue:s.value.name,"onUpdate:modelValue":t[0]||(t[0]=o=>s.value.name=o),label:"Your name",variant:"outlined",rules:[o=>!!o||"Name is required"],"hide-details":"auto",class:"mb-4"},null,8,["modelValue","rules"])]),_:1}),e(n,{cols:"12",md:"6"},{default:a(()=>[e(v,{modelValue:s.value.email,"onUpdate:modelValue":t[1]||(t[1]=o=>s.value.email=o),label:"Your email",variant:"outlined",type:"email",rules:[o=>!!o||"Email is required",o=>/.+@.+\..+/.test(o)||"Invalid email"],"hide-details":"auto",class:"mb-4"},null,8,["modelValue","rules"])]),_:1}),e(n,{cols:"12"},{default:a(()=>[e(Y,{modelValue:s.value.subject,"onUpdate:modelValue":t[2]||(t[2]=o=>s.value.subject=o),label:"Subject",variant:"outlined",items:g,"hide-details":"auto",class:"mb-4"},null,8,["modelValue"])]),_:1}),e(n,{cols:"12"},{default:a(()=>[e(A,{modelValue:s.value.message,"onUpdate:modelValue":t[3]||(t[3]=o=>s.value.message=o),label:"Your message",variant:"outlined",rules:[o=>!!o||"Message is required"],"hide-details":"auto",rows:"5",class:"mb-4"},null,8,["modelValue","rules"])]),_:1})]),_:1}),e(c,{type:"submit",color:"primary",size:"large",loading:i.value,class:"mt-4"},{default:a(()=>t[7]||(t[7]=[p(" Send Message ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(M,{class:"py-4"},{default:a(()=>[e(d,null,{default:a(()=>[r("div",P,[r("p",W," © "+D(new Date().getFullYear())+" DevUnity. All rights reserved. ",1)])]),_:1})]),_:1}),e(j,{modelValue:l.value.show,"onUpdate:modelValue":t[4]||(t[4]=o=>l.value.show=o),color:l.value.color,text:l.value.text,timeout:l.value.timeout},null,8,["modelValue","color","text","timeout"])]),_:1})}}}),le=k(G,[["__scopeId","data-v-ddba1113"]]);export{le as default};
