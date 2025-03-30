import{H as A,f as B,p as I,o as D,h as L,af as $,m as z,k as R,I as w}from"./BOmTdu30.js";import{aq as F,an as p,M as E,a0 as M,R as N,ar as O,Q as j,w as q,as as G,S as H,T as Q,at as U,U as J,a1 as K,N as W,ao as X,au as Y,c as Z,A as i,a as ee}from"./CTpYCmOx.js";import{c as o,G as ae,m as t,n as te}from"./CoKilWGJ.js";const le=A("v-alert-title"),se=["success","info","warning","error"],oe=I({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:w,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>se.includes(e)},...R(),...X(),...W(),...K(),...J(),...U(),...Q(),...H(),...z(),...G({variant:"flat"})},"VAlert"),ce=B()({name:"VAlert",props:oe(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,c){let{emit:u,slots:a}=c;const n=D(e,"modelValue"),l=o(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),d=o(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:v}=L(e),{colorClasses:m,colorStyles:y,variantClasses:f}=F(d),{densityClasses:k}=p(e),{dimensionStyles:b}=E(e),{elevationClasses:P}=M(e),{locationStyles:V}=N(e),{positionClasses:C}=O(e),{roundedClasses:g}=j(e),{textColorClasses:S,textColorStyles:x}=q(ae(e,"borderColor")),{t:_}=$(),r=o(()=>({"aria-label":_(e.closeLabel),onClick(s){n.value=!1,u("click:close",s)}}));return()=>{const s=!!(a.prepend||l.value),T=!!(a.title||e.title),h=!!(a.close||e.closable);return n.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},v.value,m.value,k.value,P.value,C.value,g.value,f.value,e.class],style:[y.value,b.value,V.value,e.style],role:"alert"},{default:()=>[Y(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",S.value],style:x.value},null),s&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(i,{key:"prepend-defaults",disabled:!l.value,defaults:{VIcon:{density:e.density,icon:l.value,size:e.prominent?44:28}}},a.prepend):t(Z,{key:"prepend-icon",density:e.density,icon:l.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[T&&t(le,{key:"title"},{default:()=>[a.title?.()??e.title]}),a.text?.()??e.text,a.default?.()]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),h&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(i,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>[a.close?.({props:r.value})]}):t(ee,te({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},r.value),null)])]})}}});export{ce as V};
