import{c as n,m as l,_ as Q,a3 as te,d as w,G as re,w as de,F as N,n as O,a2 as ce,at as fe,A as p}from"./CoKilWGJ.js";import{W as ve,z as me,b2 as ge,K as ye,ay as be,aN as xe,Y as ae,b3 as Ce,Q as he,P as Ve,w as ke,aO as _e,b1 as Ie,A as Pe,T as Fe,aP as Se,av as Be,H as ee,y as we,I as Te}from"./CTpYCmOx.js";import{f as U,p as W,u as z,k as X,h as Ae,A as Le,n as Re,m as $e,a9 as J,I as K,O as De,J as Ee,L as Me,t as Ne,o as Oe,ah as Ue,ag as We}from"./BOmTdu30.js";const ze=W({active:Boolean,disabled:Boolean,max:[Number,String],value:{type:[Number,String],default:0},...X(),...me({transition:{component:ge}})},"VCounter"),Ye=U()({name:"VCounter",functional:!0,props:ze(),setup(e,g){let{slots:u}=g;const h=n(()=>e.max?`${e.value} / ${e.max}`:String(e.value));return z(()=>l(ve,{transition:e.transition},{default:()=>[Q(l("div",{class:["v-counter",{"text-error":e.max&&!e.disabled&&parseFloat(e.value)>parseFloat(e.max)},e.class],style:e.style},[u.default?u.default({counter:h.value,max:e.max,value:e.value}):h.value]),[[te,e.active]])]})),{}}}),je=W({floating:Boolean,...X()},"VFieldLabel"),M=U()({name:"VFieldLabel",props:je(),setup(e,g){let{slots:u}=g;return z(()=>l(ye,{class:["v-field-label",{"v-field-label--floating":e.floating},e.class],style:e.style,"aria-hidden":e.floating||void 0},u)),{}}}),qe=["underlined","outlined","filled","solo","solo-inverted","solo-filled","plain"],ne=W({appendInnerIcon:K,bgColor:String,clearable:Boolean,clearIcon:{type:K,default:"$clear"},active:Boolean,centerAffix:{type:Boolean,default:void 0},color:String,baseColor:String,dirty:Boolean,disabled:{type:Boolean,default:null},error:Boolean,flat:Boolean,label:String,persistentClear:Boolean,prependInnerIcon:K,reverse:Boolean,singleLine:Boolean,variant:{type:String,default:"filled",validator:e=>qe.includes(e)},"onClick:clear":J(),"onClick:appendInner":J(),"onClick:prependInner":J(),...X(),...Se(),...Fe(),...$e()},"VField"),le=U()({name:"VField",inheritAttrs:!1,props:{id:String,...be(),...ne()},emits:{"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,g){let{attrs:u,emit:h,slots:t}=g;const{themeClasses:d}=Ae(e),{loaderClasses:y}=xe(e),{focusClasses:Y,isFocused:T,focus:V,blur:k}=ae(e),{InputIcon:_}=Ce(e),{roundedClasses:j}=he(e),{rtlClasses:A}=Le(),b=n(()=>e.dirty||e.active),v=n(()=>!!(e.label||t.label)),I=n(()=>!e.singleLine&&v.value),P=Re(),c=n(()=>e.id||`input-${P}`),q=n(()=>`${c.value}-messages`),L=w(),F=w(),a=w(),i=n(()=>["plain","underlined"].includes(e.variant)),{backgroundColorClasses:S,backgroundColorStyles:G}=Ve(re(e,"bgColor")),{textColorClasses:H,textColorStyles:R}=ke(n(()=>e.error||e.disabled?void 0:b.value&&T.value?e.color:e.baseColor));de(b,m=>{if(I.value){const s=L.value.$el,r=F.value.$el;requestAnimationFrame(()=>{const f=De(s),o=r.getBoundingClientRect(),B=o.x-f.x,$=o.y-f.y-(f.height/2-o.height/2),D=o.width/.75,E=Math.abs(D-f.width)>1?{maxWidth:Ne(D)}:void 0,ie=getComputedStyle(s),Z=getComputedStyle(r),oe=parseFloat(ie.transitionDuration)*1e3||150,se=parseFloat(Z.getPropertyValue("--v-field-label-scale")),ue=Z.getPropertyValue("color");s.style.visibility="visible",r.style.visibility="hidden",Ee(s,{transform:`translate(${B}px, ${$}px) scale(${se})`,color:ue,...E},{duration:oe,easing:Me,direction:m?"normal":"reverse"}).finished.then(()=>{s.style.removeProperty("visibility"),r.style.removeProperty("visibility")})})}},{flush:"post"});const x=n(()=>({isActive:b,isFocused:T,controlRef:a,blur:k,focus:V}));function C(m){m.target!==document.activeElement&&m.preventDefault()}return z(()=>{const m=e.variant==="outlined",s=!!(t["prepend-inner"]||e.prependInnerIcon),r=!!(e.clearable||t.clear)&&!e.disabled,f=!!(t["append-inner"]||e.appendInnerIcon||r),o=()=>t.label?t.label({...x.value,label:e.label,props:{for:c.value}}):e.label;return l("div",O({class:["v-field",{"v-field--active":b.value,"v-field--appended":f,"v-field--center-affix":e.centerAffix??!i.value,"v-field--disabled":e.disabled,"v-field--dirty":e.dirty,"v-field--error":e.error,"v-field--flat":e.flat,"v-field--has-background":!!e.bgColor,"v-field--persistent-clear":e.persistentClear,"v-field--prepended":s,"v-field--reverse":e.reverse,"v-field--single-line":e.singleLine,"v-field--no-label":!o(),[`v-field--variant-${e.variant}`]:!0},d.value,S.value,Y.value,y.value,j.value,A.value,e.class],style:[G.value,e.style],onClick:C},u),[l("div",{class:"v-field__overlay"},null),l(_e,{name:"v-field",active:!!e.loading,color:e.error?"error":typeof e.loading=="string"?e.loading:e.color},{default:t.loader}),s&&l("div",{key:"prepend",class:"v-field__prepend-inner"},[e.prependInnerIcon&&l(_,{key:"prepend-icon",name:"prependInner"},null),t["prepend-inner"]?.(x.value)]),l("div",{class:"v-field__field","data-no-activator":""},[["filled","solo","solo-inverted","solo-filled"].includes(e.variant)&&I.value&&l(M,{key:"floating-label",ref:F,class:[H.value],floating:!0,for:c.value,style:R.value},{default:()=>[o()]}),v.value&&l(M,{key:"label",ref:L,for:c.value},{default:()=>[o()]}),t.default?.({...x.value,props:{id:c.value,class:"v-field__input","aria-describedby":q.value},focus:V,blur:k})]),r&&l(Ie,{key:"clear"},{default:()=>[Q(l("div",{class:"v-field__clearable",onMousedown:B=>{B.preventDefault(),B.stopPropagation()}},[l(Pe,{defaults:{VIcon:{icon:e.clearIcon}}},{default:()=>[t.clear?t.clear({...x.value,props:{onFocus:V,onBlur:k,onClick:e["onClick:clear"]}}):l(_,{name:"clear",onFocus:V,onBlur:k},null)]})]),[[te,e.dirty]])]}),f&&l("div",{key:"append",class:"v-field__append-inner"},[t["append-inner"]?.(x.value),e.appendInnerIcon&&l(_,{key:"append-icon",name:"appendInner"},null)]),l("div",{class:["v-field__outline",H.value],style:R.value},[m&&l(N,null,[l("div",{class:"v-field__outline__start"},null),I.value&&l("div",{class:"v-field__outline__notch"},[l(M,{ref:F,floating:!0,for:c.value},{default:()=>[o()]})]),l("div",{class:"v-field__outline__end"},null)]),i.value&&I.value&&l(M,{ref:F,floating:!0,for:c.value},{default:()=>[o()]})])])}),{controlRef:a}}}),Ge=["color","file","time","date","datetime-local","week","month"],He=W({autofocus:Boolean,counter:[Boolean,Number,String],counterValue:[Number,Function],prefix:String,placeholder:String,persistentPlaceholder:Boolean,persistentCounter:Boolean,suffix:String,role:String,type:{type:String,default:"text"},modelModifiers:Object,...Te(),...ne()},"VTextField"),Xe=U()({name:"VTextField",directives:{Intersect:Be},inheritAttrs:!1,props:He(),emits:{"click:control":e=>!0,"mousedown:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,g){let{attrs:u,emit:h,slots:t}=g;const d=Oe(e,"modelValue"),{isFocused:y,focus:Y,blur:T}=ae(e),V=n(()=>typeof e.counterValue=="function"?e.counterValue(d.value):typeof e.counterValue=="number"?e.counterValue:(d.value??"").toString().length),k=n(()=>{if(u.maxlength)return u.maxlength;if(!(!e.counter||typeof e.counter!="number"&&typeof e.counter!="string"))return e.counter}),_=n(()=>["plain","underlined"].includes(e.variant));function j(a,i){!e.autofocus||!a||i[0].target?.focus?.()}const A=w(),b=w(),v=w(),I=n(()=>Ge.includes(e.type)||e.persistentPlaceholder||y.value||e.active);function P(){v.value!==document.activeElement&&v.value?.focus(),y.value||Y()}function c(a){h("mousedown:control",a),a.target!==v.value&&(P(),a.preventDefault())}function q(a){P(),h("click:control",a)}function L(a){a.stopPropagation(),P(),p(()=>{d.value=null,We(e["onClick:clear"],a)})}function F(a){const i=a.target;if(d.value=i.value,e.modelModifiers?.trim&&["text","search","password","tel","url"].includes(e.type)){const S=[i.selectionStart,i.selectionEnd];p(()=>{i.selectionStart=S[0],i.selectionEnd=S[1]})}}return z(()=>{const a=!!(t.counter||e.counter!==!1&&e.counter!=null),i=!!(a||t.details),[S,G]=Ue(u),{modelValue:H,...R}=ee.filterProps(e),x=le.filterProps(e);return l(ee,O({ref:A,modelValue:d.value,"onUpdate:modelValue":C=>d.value=C,class:["v-text-field",{"v-text-field--prefixed":e.prefix,"v-text-field--suffixed":e.suffix,"v-input--plain-underlined":_.value},e.class],style:e.style},S,R,{centerAffix:!_.value,focused:y.value}),{...t,default:C=>{let{id:m,isDisabled:s,isDirty:r,isReadonly:f,isValid:o}=C;return l(le,O({ref:b,onMousedown:c,onClick:q,"onClick:clear":L,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"],role:e.role},x,{id:m.value,active:I.value||r.value,dirty:r.value||e.dirty,disabled:s.value,focused:y.value,error:o.value===!1}),{...t,default:B=>{let{props:{class:$,...D}}=B;const E=Q(l("input",O({ref:v,value:d.value,onInput:F,autofocus:e.autofocus,readonly:f.value,disabled:s.value,name:e.name,placeholder:e.placeholder,size:1,type:e.type,onFocus:P,onBlur:T},D,G),null),[[ce("intersect"),{handler:j},null,{once:!0}]]);return l(N,null,[e.prefix&&l("span",{class:"v-text-field__prefix"},[l("span",{class:"v-text-field__prefix__text"},[e.prefix])]),t.default?l("div",{class:$,"data-no-activator":""},[t.default(),E]):fe(E,{class:$}),e.suffix&&l("span",{class:"v-text-field__suffix"},[l("span",{class:"v-text-field__suffix__text"},[e.suffix])])])}})},details:i?C=>l(N,null,[t.details?.(C),a&&l(N,null,[l("span",null,null),l(Ye,{active:e.persistentCounter||y.value,value:V.value,max:k.value,disabled:e.disabled},t.counter)])]):void 0})}),we({},A,b,v)}});export{Xe as V,le as a,ne as b,Ye as c,He as m};
