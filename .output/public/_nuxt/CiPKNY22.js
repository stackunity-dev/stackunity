import{a as B,b as ee,c as te}from"./BRQFzjjH.js";import{N as le,O as ne,S as ae,U as ue,Y as $,b2 as ie,J as r,bf as D,m as h,$ as oe,P as re,ap as se,aq as N,b as u,Q as g,a0 as ce,as as de,F as b,a6 as fe,bg as ve}from"./D7DrY462.js";import{V as me}from"./D0R1KJJ6.js";const pe=ne({chips:Boolean,counter:Boolean,counterSizeString:{type:String,default:"$vuetify.fileInput.counterSize"},counterString:{type:String,default:"$vuetify.fileInput.counter"},hideInput:Boolean,multiple:Boolean,showSize:{type:[Boolean,Number,String],default:!1,validator:e=>typeof e=="boolean"||[1e3,1024].includes(Number(e))},...de({prependIcon:"$file"}),modelValue:{type:[Array,Object],default:e=>e.multiple?[]:null,validator:e=>$(e).every(d=>d!=null&&typeof d=="object")},...ee({clearable:!0})},"VFileInput"),Ce=le()({name:"VFileInput",inheritAttrs:!1,props:pe(),emits:{"click:control":e=>!0,"mousedown:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,d){let{attrs:M,emit:C,slots:a}=d;const{t:k}=ae(),n=ue(e,"modelValue",e.modelValue,t=>$(t),t=>!e.multiple&&Array.isArray(t)?t[0]:t),{isFocused:f,focus:x,blur:j}=ie(e),I=r(()=>typeof e.showSize!="boolean"?e.showSize:void 0),V=r(()=>(n.value??[]).reduce((t,l)=>{let{size:s=0}=l;return t+s},0)),S=r(()=>D(V.value,I.value)),m=r(()=>(n.value??[]).map(t=>{const{name:l="",size:s=0}=t;return e.showSize?`${l} (${D(s,I.value)})`:l})),O=r(()=>{var l;const t=((l=n.value)==null?void 0:l.length)??0;return e.showSize?k(e.counterSizeString,t,S.value):k(e.counterString,t)}),F=h(),P=h(),i=h(),T=r(()=>f.value||e.active),z=r(()=>["plain","underlined"].includes(e.variant));function p(){var t;i.value!==document.activeElement&&((t=i.value)==null||t.focus()),f.value||x()}function E(t){var l;(l=i.value)==null||l.click()}function U(t){C("mousedown:control",t)}function q(t){var l;(l=i.value)==null||l.click(),C("click:control",t)}function J(t){t.stopPropagation(),p(),fe(()=>{n.value=[],ve(e["onClick:clear"],t)})}function L(t){t.preventDefault()}function Q(t){t.preventDefault(),t.dataTransfer&&(n.value=[...t.dataTransfer.files??[]])}return oe(n,t=>{(!Array.isArray(t)||!t.length)&&i.value&&(i.value.value="")}),re(()=>{const t=!!(a.counter||e.counter),l=!!(t||a.details),[s,Y]=se(M),{modelValue:ye,..._}=N.filterProps(e),G=B.filterProps(e);return u(N,g({ref:F,modelValue:e.multiple?n.value:n.value[0],class:["v-file-input",{"v-file-input--chips":!!e.chips,"v-file-input--hide":e.hideInput,"v-input--plain-underlined":z.value},e.class],style:e.style,"onClick:prepend":E},s,_,{centerAffix:!z.value,focused:f.value}),{...a,default:y=>{let{id:v,isDisabled:c,isDirty:A,isReadonly:w,isValid:H}=y;return u(B,g({ref:P,"prepend-icon":e.prependIcon,onMousedown:U,onClick:q,"onClick:clear":J,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"]},G,{id:v.value,active:T.value||A.value,dirty:A.value||e.dirty,disabled:c.value,focused:f.value,error:H.value===!1,onDragover:L,onDrop:Q}),{...a,default:K=>{var R;let{props:{class:W,...X}}=K;return u(b,null,[u("input",g({ref:i,type:"file",readonly:w.value,disabled:c.value,multiple:e.multiple,name:e.name,onClick:o=>{o.stopPropagation(),w.value&&o.preventDefault(),p()},onChange:o=>{if(!o.target)return;const Z=o.target;n.value=[...Z.files??[]]},onFocus:p,onBlur:j},X,Y),null),u("div",{class:W},[!!((R=n.value)!=null&&R.length)&&!e.hideInput&&(a.selection?a.selection({fileNames:m.value,totalBytes:V.value,totalBytesReadable:S.value}):e.chips?m.value.map(o=>u(me,{key:o,size:"small",text:o},null)):m.value.join(", "))])])}})},details:l?y=>{var v,c;return u(b,null,[(v=a.details)==null?void 0:v.call(a,y),t&&u(b,null,[u("span",null,null),u(te,{active:!!((c=n.value)!=null&&c.length),value:O.value,disabled:e.disabled},a.counter)])])}:void 0})}),ce({},F,P,i)}});export{Ce as V};
