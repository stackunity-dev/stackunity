import{c as w,d,s as ee,a as te,x as ae,w as f,q as ne,m as n,n as I,A as k,F as R,_ as z,a2 as le,ar as oe}from"./CoKilWGJ.js";import{a as T,b as ue,c as re}from"./B2zV2hO7.js";import{av as ie,Y as se,H as G,y as ce,I as de}from"./CTpYCmOx.js";import{f as fe,p as ve,o as me,u as xe,ah as ge,t as he,C as we,ag as Ve}from"./BOmTdu30.js";const ye=ve({autoGrow:Boolean,autofocus:Boolean,counter:[Boolean,Number,String],counterValue:Function,prefix:String,placeholder:String,persistentPlaceholder:Boolean,persistentCounter:Boolean,noResize:Boolean,rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseFloat(e))},maxRows:{type:[Number,String],validator:e=>!isNaN(parseFloat(e))},suffix:String,modelModifiers:Object,...de(),...ue()},"VTextarea"),Ie=fe()({name:"VTextarea",directives:{Intersect:ie},inheritAttrs:!1,props:ye(),emits:{"click:control":e=>!0,"mousedown:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,D){let{attrs:V,emit:S,slots:r}=D;const l=me(e,"modelValue"),{isFocused:c,focus:E,blur:U}=se(e),O=w(()=>typeof e.counterValue=="function"?e.counterValue(l.value):(l.value||"").toString().length),$=w(()=>{if(V.maxlength)return V.maxlength;if(!(!e.counter||typeof e.counter!="number"&&typeof e.counter!="string"))return e.counter});function j(t,a){!e.autofocus||!t||a[0].target?.focus?.()}const N=d(),v=d(),H=ee(""),m=d(),q=w(()=>e.persistentPlaceholder||c.value||e.active);function y(){m.value!==document.activeElement&&m.value?.focus(),c.value||E()}function Y(t){y(),S("click:control",t)}function J(t){S("mousedown:control",t)}function K(t){t.stopPropagation(),y(),k(()=>{l.value="",Ve(e["onClick:clear"],t)})}function L(t){const a=t.target;if(l.value=a.value,e.modelModifiers?.trim){const o=[a.selectionStart,a.selectionEnd];k(()=>{a.selectionStart=o[0],a.selectionEnd=o[1]})}}const i=d(),x=d(Number(e.rows)),C=w(()=>["plain","underlined"].includes(e.variant));te(()=>{e.autoGrow||(x.value=Number(e.rows))});function s(){e.autoGrow&&k(()=>{if(!i.value||!v.value)return;const t=getComputedStyle(i.value),a=getComputedStyle(v.value.$el),o=parseFloat(t.getPropertyValue("--v-field-padding-top"))+parseFloat(t.getPropertyValue("--v-input-padding-top"))+parseFloat(t.getPropertyValue("--v-field-padding-bottom")),F=i.value.scrollHeight,h=parseFloat(t.lineHeight),P=Math.max(parseFloat(e.rows)*h+o,parseFloat(a.getPropertyValue("--v-input-control-height"))),b=parseFloat(e.maxRows)*h+o||1/0,u=we(F??0,P,b);x.value=Math.floor((u-o)/h),H.value=he(u)})}ae(s),f(l,s),f(()=>e.rows,s),f(()=>e.maxRows,s),f(()=>e.density,s);let g;return f(i,t=>{t?(g=new ResizeObserver(s),g.observe(i.value)):g?.disconnect()}),ne(()=>{g?.disconnect()}),xe(()=>{const t=!!(r.counter||e.counter||e.counterValue),a=!!(t||r.details),[o,F]=ge(V),{modelValue:h,...P}=G.filterProps(e),b=T.filterProps(e);return n(G,I({ref:N,modelValue:l.value,"onUpdate:modelValue":u=>l.value=u,class:["v-textarea v-text-field",{"v-textarea--prefixed":e.prefix,"v-textarea--suffixed":e.suffix,"v-text-field--prefixed":e.prefix,"v-text-field--suffixed":e.suffix,"v-textarea--auto-grow":e.autoGrow,"v-textarea--no-resize":e.noResize||e.autoGrow,"v-input--plain-underlined":C.value},e.class],style:e.style},o,P,{centerAffix:x.value===1&&!C.value,focused:c.value}),{...r,default:u=>{let{id:Q,isDisabled:M,isDirty:A,isReadonly:W,isValid:X}=u;return n(T,I({ref:v,style:{"--v-textarea-control-height":H.value},onClick:Y,onMousedown:J,"onClick:clear":K,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"]},b,{id:Q.value,active:q.value||A.value,centerAffix:x.value===1&&!C.value,dirty:A.value||e.dirty,disabled:M.value,focused:c.value,error:X.value===!1}),{...r,default:Z=>{let{props:{class:B,..._}}=Z;return n(R,null,[e.prefix&&n("span",{class:"v-text-field__prefix"},[e.prefix]),z(n("textarea",I({ref:m,class:B,value:l.value,onInput:L,autofocus:e.autofocus,readonly:W.value,disabled:M.value,placeholder:e.placeholder,rows:e.rows,name:e.name,onFocus:y,onBlur:U},_,F),null),[[le("intersect"),{handler:j},null,{once:!0}]]),e.autoGrow&&z(n("textarea",{class:[B,"v-textarea__sizer"],id:`${_.id}-sizer`,"onUpdate:modelValue":p=>l.value=p,ref:i,readonly:!0,"aria-hidden":"true"},null),[[oe,l.value]]),e.suffix&&n("span",{class:"v-text-field__suffix"},[e.suffix])])}})},details:a?u=>n(R,null,[r.details?.(u),t&&n(R,null,[n("span",null,null),n(re,{active:e.persistentCounter||c.value,value:O.value,max:$.value,disabled:e.disabled},r.counter)])]):void 0})}),ce({},N,v,m)}});export{Ie as V};
