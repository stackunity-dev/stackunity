globalThis.__timing__.logStart('Load chunks/build/snackbar.vue');import { defineComponent, computed, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a1 as Be, L, s as s$1 } from './server.mjs';

const $=defineComponent({__name:"snackbar",__ssrInlineRender:true,props:{modelValue:{type:Boolean},text:{},color:{},timeout:{}},emits:["update:modelValue"],setup(u,{emit:f}){const t=u,p=f,l=computed({get:()=>t.modelValue,set:e=>p("update:modelValue",e)}),n=computed(()=>t.color||"info"),a=computed(()=>{switch(t.color){case "success":return "mdi-check-circle";case "error":return "mdi-alert-circle";case "warning":return "mdi-alert";case "info":return "mdi-information";default:return "mdi-bell"}});return (e,v,V,g)=>{v(ssrRenderComponent(Be,mergeProps({modelValue:l.value,"onUpdate:modelValue":i=>l.value=i,color:"grey-darken-4",timeout:e.timeout,location:"top right",elevation:"4",transition:"slide-x-reverse-transition"},g),{default:withCtx((i,o,x,c)=>{if(o)o(`<div class="d-flex align-center" data-v-f4366f72${c}>`),o(ssrRenderComponent(L,{color:n.value,icon:a.value,class:"mr-2"},null,x,c)),o(` ${ssrInterpolate(e.text)}</div>`);else return [createVNode("div",{class:"d-flex align-center"},[createVNode(L,{color:n.value,icon:a.value,class:"mr-2"},null,8,["color","icon"]),createTextVNode(" "+toDisplayString(e.text),1)])]}),_:1},V));}}});

const s=$.setup;$.setup=(e,r)=>{const o=useSSRContext();return (o.modules||(o.modules=new Set)).add("components/snackbar.vue"),s?s(e,r):void 0};const f=s$1($,[["__scopeId","data-v-f4366f72"]]);

export { f };;globalThis.__timing__.logEnd('Load chunks/build/snackbar.vue');
