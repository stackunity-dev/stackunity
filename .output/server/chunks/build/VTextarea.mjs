globalThis.__timing__.logStart('Load chunks/build/VTextarea');import { computed, ref, shallowRef, watchEffect, watch, createVNode, mergeProps, Fragment, withDirectives, resolveDirective, vModelText, nextTick } from 'vue';
import { J as Je, N, x as xe } from './VTextField.mjs';
import { f as y, y as y$1, ar as s, C, af as F, as as d, o, au as W, av as ve, at as O, X, Z, aw as se } from './server.mjs';

const we=y$1({autoGrow:Boolean,autofocus:Boolean,counter:[Boolean,Number,String],counterValue:Function,prefix:String,placeholder:String,persistentPlaceholder:Boolean,persistentCounter:Boolean,noResize:Boolean,rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseFloat(e))},maxRows:{type:[Number,String],validator:e=>!isNaN(parseFloat(e))},suffix:String,modelModifiers:Object,...O(),...xe()},"VTextarea"),ze=y()({name:"VTextarea",directives:{Intersect:s},inheritAttrs:false,props:we(),emits:{"click:control":e=>true,"mousedown:control":e=>true,"update:focused":e=>true,"update:modelValue":e=>true},setup(e,G){let{attrs:w,emit:S,slots:i}=G;const l=C(e,"modelValue"),{isFocused:s,focus:D,blur:E}=F(e),U=computed(()=>typeof e.counterValue=="function"?e.counterValue(l.value):(l.value||"").toString().length),O=computed(()=>{if(w.maxlength)return w.maxlength;if(!(!e.counter||typeof e.counter!="number"&&typeof e.counter!="string"))return e.counter});function $(t,o){!e.autofocus||!t||o[0].target?.focus?.();}const N$1=ref(),v=ref(),p=shallowRef(""),m=ref(),j=computed(()=>e.persistentPlaceholder||s.value||e.active);function V(){m.value!==(void 0).activeElement&&m.value?.focus(),s.value||D();}function q(t){V(),S("click:control",t);}function J(t){S("mousedown:control",t);}function K(t){t.stopPropagation(),V(),nextTick(()=>{l.value="",se(e["onClick:clear"],t);});}function L(t){const o=t.target;if(l.value=o.value,e.modelModifiers?.trim){const n=[o.selectionStart,o.selectionEnd];nextTick(()=>{o.selectionStart=n[0],o.selectionEnd=n[1];});}}const u=ref(),x=ref(Number(e.rows)),y=computed(()=>["plain","underlined"].includes(e.variant));watchEffect(()=>{e.autoGrow||(x.value=Number(e.rows));});function c(){e.autoGrow&&nextTick(()=>{if(!u.value||!v.value)return;const t=getComputedStyle(u.value),o=getComputedStyle(v.value.$el),n=parseFloat(t.getPropertyValue("--v-field-padding-top"))+parseFloat(t.getPropertyValue("--v-input-padding-top"))+parseFloat(t.getPropertyValue("--v-field-padding-bottom")),F=u.value.scrollHeight,g=parseFloat(t.lineHeight),P=Math.max(parseFloat(e.rows)*g+n,parseFloat(o.getPropertyValue("--v-input-control-height"))),b=parseFloat(e.maxRows)*g+n||1/0,r=Z(F??0,P,b);x.value=Math.floor((r-n)/g),p.value=X(r);});}watch(l,c),watch(()=>e.rows,c),watch(()=>e.maxRows,c),watch(()=>e.density,c);let C$1;return watch(u,t=>{t?(C$1=new ResizeObserver(c),C$1.observe(u.value)):C$1?.disconnect();}),o(()=>{const t=!!(i.counter||e.counter||e.counterValue),o=!!(t||i.details),[n,F]=W(w),{modelValue:g,...P}=ve.filterProps(e),b=Je.filterProps(e);return createVNode(ve,mergeProps({ref:N$1,modelValue:l.value,"onUpdate:modelValue":r=>l.value=r,class:["v-textarea v-text-field",{"v-textarea--prefixed":e.prefix,"v-textarea--suffixed":e.suffix,"v-text-field--prefixed":e.prefix,"v-text-field--suffixed":e.suffix,"v-textarea--auto-grow":e.autoGrow,"v-textarea--no-resize":e.noResize||e.autoGrow,"v-input--plain-underlined":y.value},e.class],style:e.style},n,P,{centerAffix:x.value===1&&!y.value,focused:s.value}),{...i,default:r=>{let{id:Q,isDisabled:H,isDirty:M,isReadonly:W,isValid:X}=r;return createVNode(Je,mergeProps({ref:v,style:{"--v-textarea-control-height":p.value},onClick:q,onMousedown:J,"onClick:clear":K,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"]},b,{id:Q.value,active:j.value||M.value,centerAffix:x.value===1&&!y.value,dirty:M.value||e.dirty,disabled:H.value,focused:s.value,error:X.value===false}),{...i,default:Y=>{let{props:{class:z,...A}}=Y;return createVNode(Fragment,null,[e.prefix&&createVNode("span",{class:"v-text-field__prefix"},[e.prefix]),withDirectives(createVNode("textarea",mergeProps({ref:m,class:z,value:l.value,onInput:L,autofocus:e.autofocus,readonly:W.value,disabled:H.value,placeholder:e.placeholder,rows:e.rows,name:e.name,onFocus:V,onBlur:E},A,F),null),[[resolveDirective("intersect"),{handler:$},null,{once:true}]]),e.autoGrow&&withDirectives(createVNode("textarea",{class:[z,"v-textarea__sizer"],id:`${A.id}-sizer`,"onUpdate:modelValue":Z=>l.value=Z,ref:u,readonly:true,"aria-hidden":"true"},null),[[vModelText,l.value]]),e.suffix&&createVNode("span",{class:"v-text-field__suffix"},[e.suffix])])}})},details:o?r=>createVNode(Fragment,null,[i.details?.(r),t&&createVNode(Fragment,null,[createVNode("span",null,null),createVNode(N,{active:e.persistentCounter||s.value,value:U.value,max:O.value,disabled:e.disabled},i.counter)])]):void 0})}),d({},N$1,v,m)}});

export { ze as z };;globalThis.__timing__.logEnd('Load chunks/build/VTextarea');
