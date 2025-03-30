globalThis.__timing__.logStart('Load chunks/build/VCheckbox');import { computed, createVNode, mergeProps } from 'vue';
import { F as F$1, p } from './VCheckboxBtn.mjs';
import { f as y, y as y$1, C, af as F, ah as o, o as o$1, au as W, av as ve, az as M, at as O } from './server.mjs';

const q=y$1({...O(),...M(p(),["inline"])},"VCheckbox"),T=y()({name:"VCheckbox",inheritAttrs:false,props:q(),emits:{"update:modelValue":e=>true,"update:focused":e=>true},setup(e,i){let{attrs:m,slots:r}=i;const o$2=C(e,"modelValue"),{isFocused:d,focus:c,blur:n}=F(e),p=o(),f=computed(()=>e.id||`checkbox-${p}`);return o$1(()=>{const[V,b]=W(m),v=ve.filterProps(e),k=F$1.filterProps(e);return createVNode(ve,mergeProps({class:["v-checkbox",e.class]},V,v,{modelValue:o$2.value,"onUpdate:modelValue":t=>o$2.value=t,id:f.value,focused:d.value,style:e.style}),{...r,default:t=>{let{id:x,messagesId:h,isDisabled:P,isReadonly:C,isValid:y}=t;return createVNode(F$1,mergeProps(k,{id:x.value,"aria-describedby":h.value,disabled:P.value,readonly:C.value},b,{error:y.value===false,modelValue:o$2.value,"onUpdate:modelValue":g=>o$2.value=g,onFocus:c,onBlur:n}),r)}})}),{}}});

export { T };;globalThis.__timing__.logEnd('Load chunks/build/VCheckbox');
