import{a as V,b as E}from"./BakJTAMq.js";import{O as P,m as I,T as f,J as o,bQ as R,$ as b,ae as L,bl as N,N as k,U as x,b9 as U,co as M,bd as z,ad as w,P as C,b as F,Q as O,ba as Q,aY as Y}from"./DqdsEkAQ.js";const q=P({scrollTarget:{type:String},scrollThreshold:{type:[String,Number],default:300}},"scroll");function J(l){let y=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{canScroll:v}=y;let d=0,s=0;const e=I(null),u=f(0),r=f(0),h=f(0),p=f(!1),n=f(!1),i=o(()=>Number(l.scrollThreshold)),H=o(()=>R((i.value-u.value)/i.value||0)),m=()=>{const t=e.value;if(!t||v&&!v.value)return;d=u.value,u.value="window"in t?t.pageYOffset:t.scrollTop;const c=t instanceof Window?document.documentElement.scrollHeight:t.scrollHeight;if(s!==c){s=c;return}n.value=u.value<d,h.value=Math.abs(u.value-i.value)};return b(n,()=>{r.value=r.value||u.value}),b(p,()=>{r.value=0}),L(()=>{b(()=>l.scrollTarget,t=>{var S;const c=t?document.querySelector(t):window;c&&c!==e.value&&((S=e.value)==null||S.removeEventListener("scroll",m),e.value=c,e.value.addEventListener("scroll",m,{passive:!0}))},{immediate:!0})}),N(()=>{var t;(t=e.value)==null||t.removeEventListener("scroll",m)}),v&&b(v,m,{immediate:!0}),{scrollThreshold:i,currentScroll:u,currentThreshold:h,isScrollActive:p,scrollRatio:H,isScrollingUp:n,savedScroll:r}}const W=P({scrollBehavior:String,modelValue:{type:Boolean,default:!0},location:{type:String,default:"top",validator:l=>["top","bottom"].includes(l)},...E(),...Q(),...q(),height:{type:[Number,String],default:64}},"VAppBar"),D=k()({name:"VAppBar",props:W(),emits:{"update:modelValue":l=>!0},setup(l,y){let{slots:v}=y;const d=I(),s=x(l,"modelValue"),e=o(()=>{var g;const a=new Set(((g=l.scrollBehavior)==null?void 0:g.split(" "))??[]);return{hide:a.has("hide"),fullyHide:a.has("fully-hide"),inverted:a.has("inverted"),collapse:a.has("collapse"),elevate:a.has("elevate"),fadeImage:a.has("fade-image")}}),u=o(()=>{const a=e.value;return a.hide||a.fullyHide||a.inverted||a.collapse||a.elevate||a.fadeImage||!s.value}),{currentScroll:r,scrollThreshold:h,isScrollingUp:p,scrollRatio:n}=J(l,{canScroll:u}),i=o(()=>e.value.hide||e.value.fullyHide),H=o(()=>l.collapse||e.value.collapse&&(e.value.inverted?n.value>0:n.value===0)),m=o(()=>l.flat||e.value.fullyHide&&!s.value||e.value.elevate&&(e.value.inverted?r.value>0:r.value===0)),t=o(()=>e.value.fadeImage?e.value.inverted?1-n.value:n.value:void 0),c=o(()=>{var T,B;if(e.value.hide&&e.value.inverted)return 0;const a=((T=d.value)==null?void 0:T.contentHeight)??0,g=((B=d.value)==null?void 0:B.extensionHeight)??0;return i.value?r.value<h.value||e.value.fullyHide?a+g:a:a+g});U(o(()=>!!l.scrollBehavior),()=>{Y(()=>{i.value?e.value.inverted?s.value=r.value>h.value:s.value=p.value||r.value<h.value:s.value=!0})});const{ssrBootStyles:S}=M(),{layoutItemStyles:A}=z({id:l.name,order:o(()=>parseInt(l.order,10)),position:w(l,"location"),layoutSize:c,elementSize:f(void 0),active:s,absolute:w(l,"absolute")});return C(()=>{const a=V.filterProps(l);return F(V,O({ref:d,class:["v-app-bar",{"v-app-bar--bottom":l.location==="bottom"},l.class],style:[{...A.value,"--v-toolbar-image-opacity":t.value,height:void 0,...S.value},l.style]},a,{collapse:H.value,flat:m.value}),v)}),{}}});export{D as V};
