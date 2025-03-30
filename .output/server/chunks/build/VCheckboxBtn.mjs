globalThis.__timing__.logStart('Load chunks/build/VCheckboxBtn');import { computed, createVNode, mergeProps } from 'vue';
import { f as y, y as y$1, C, o, az as M, aA as Ve, aB as ee, ap as A } from './server.mjs';

const p=y$1({indeterminate:Boolean,indeterminateIcon:{type:A,default:"$checkboxIndeterminate"},...ee({falseIcon:"$checkboxOff",trueIcon:"$checkboxOn"})},"VCheckboxBtn"),F=y()({name:"VCheckboxBtn",props:p(),emits:{"update:modelValue":e=>true,"update:indeterminate":e=>true},setup(e,l){let{slots:m}=l;const o$1=C(e,"indeterminate"),t=C(e,"modelValue");function u(n){o$1.value&&(o$1.value=false);}const i=computed(()=>o$1.value?e.indeterminateIcon:e.falseIcon),d=computed(()=>o$1.value?e.indeterminateIcon:e.trueIcon);return o(()=>{const n=M(Ve.filterProps(e),["modelValue"]);return createVNode(Ve,mergeProps(n,{modelValue:t.value,"onUpdate:modelValue":[s=>t.value=s,u],class:["v-checkbox-btn",e.class],style:e.style,type:"checkbox",falseIcon:i.value,trueIcon:d.value,"aria-checked":o$1.value?"mixed":void 0}),m)}),{}}});

export { F, p };;globalThis.__timing__.logEnd('Load chunks/build/VCheckboxBtn');
