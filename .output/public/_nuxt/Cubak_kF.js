import{e as u,J as t,f as m,w as p,bd as f,o as V,a as _,b as v,d as k,i as x,t as b,_ as g}from"./GE5AgfcP.js";const h={class:"d-flex align-center"},w=u({__name:"snackbar",props:{modelValue:{type:Boolean},text:{},color:{},timeout:{}},emits:["update:modelValue"],setup(s,{emit:n}){const o=s,c=n,a=t({get:()=>o.modelValue,set:e=>c("update:modelValue",e)}),l=t(()=>o.color||"info"),i=t(()=>{switch(o.color){case"success":return"mdi-check-circle";case"error":return"mdi-alert-circle";case"warning":return"mdi-alert";case"info":return"mdi-information";default:return"mdi-bell"}});return(e,r)=>(V(),m(f,{modelValue:a.value,"onUpdate:modelValue":r[0]||(r[0]=d=>a.value=d),color:"grey-darken-4",timeout:e.timeout,location:"top right",elevation:"4",transition:"slide-x-reverse-transition"},{default:p(()=>[_("div",h,[v(x,{color:l.value,icon:i.value,class:"mr-2"},null,8,["color","icon"]),k(" "+b(e.text),1)])]),_:1},8,["modelValue","timeout"]))}}),S=g(w,[["__scopeId","data-v-f4366f72"]]);export{S};
