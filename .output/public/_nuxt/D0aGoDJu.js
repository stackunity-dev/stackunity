import{cl as Y,N as _,O as H,b5 as M,bD as O,S as j,cm as D,m as S,J as h,T as x,$ as G,b as m,g as w,P as k,aD as P,c4 as F,aP as z,aQ as q,aA as R,c7 as J,c9 as Q,cn as U,co as Z,cp as K,aT as N,cq as p,cr as ee,a6 as te,aZ as X,aE as ne}from"./DS3qCAFv.js";const oe=e=>{const{touchstartX:o,touchendX:t,touchstartY:n,touchendY:i}=e,u=.5,s=16;e.offsetX=t-o,e.offsetY=i-n,Math.abs(e.offsetY)<u*Math.abs(e.offsetX)&&(e.left&&t<o-s&&e.left(e),e.right&&t>o+s&&e.right(e)),Math.abs(e.offsetX)<u*Math.abs(e.offsetY)&&(e.up&&i<n-s&&e.up(e),e.down&&i>n+s&&e.down(e))};function se(e,o){var n;const t=e.changedTouches[0];o.touchstartX=t.clientX,o.touchstartY=t.clientY,(n=o.start)==null||n.call(o,{originalEvent:e,...o})}function ie(e,o){var n;const t=e.changedTouches[0];o.touchendX=t.clientX,o.touchendY=t.clientY,(n=o.end)==null||n.call(o,{originalEvent:e,...o}),oe(o)}function ae(e,o){var n;const t=e.changedTouches[0];o.touchmoveX=t.clientX,o.touchmoveY=t.clientY,(n=o.move)==null||n.call(o,{originalEvent:e,...o})}function ue(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const o={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:e.left,right:e.right,up:e.up,down:e.down,start:e.start,move:e.move,end:e.end};return{touchstart:t=>se(t,o),touchend:t=>ie(t,o),touchmove:t=>ae(t,o)}}function ce(e,o){var v;const t=o.value,n=t!=null&&t.parent?e.parentElement:e,i=(t==null?void 0:t.options)??{passive:!0},u=(v=o.instance)==null?void 0:v.$.uid;if(!n||!u)return;const s=ue(o.value);n._touchHandlers=n._touchHandlers??Object.create(null),n._touchHandlers[u]=s,Y(s).forEach(r=>{n.addEventListener(r,s[r],i)})}function le(e,o){var u,s;const t=(u=o.value)!=null&&u.parent?e.parentElement:e,n=(s=o.instance)==null?void 0:s.$.uid;if(!(t!=null&&t._touchHandlers)||!n)return;const i=t._touchHandlers[n];Y(i).forEach(v=>{t.removeEventListener(v,i[v])}),delete t._touchHandlers[n]}const V={mounted:ce,unmounted:le},W=Symbol.for("vuetify:v-window"),$=Symbol.for("vuetify:v-window-group"),re=H({continuous:Boolean,nextIcon:{type:[Boolean,String,Function,Object],default:"$next"},prevIcon:{type:[Boolean,String,Function,Object],default:"$prev"},reverse:Boolean,showArrows:{type:[Boolean,String],validator:e=>typeof e=="boolean"||e==="hover"},touch:{type:[Object,Boolean],default:void 0},direction:{type:String,default:"horizontal"},modelValue:null,disabled:Boolean,selectedClass:{type:String,default:"v-window-item--active"},mandatory:{type:[Boolean,String],default:"force"},...R(),...q(),...z()},"VWindow"),fe=_()({name:"VWindow",directives:{Touch:V},props:re(),emits:{"update:modelValue":e=>!0},setup(e,o){let{slots:t}=o;const{themeClasses:n}=M(e),{isRtl:i}=O(),{t:u}=j(),s=D(e,$),v=S(),r=h(()=>i.value?!e.reverse:e.reverse),d=x(!1),y=h(()=>{const a=e.direction==="vertical"?"y":"x",f=(r.value?!d.value:d.value)?"-reverse":"";return`v-window-${a}${f}-transition`}),b=x(0),T=S(void 0),g=h(()=>s.items.value.findIndex(a=>s.selected.value.includes(a.id)));G(g,(a,l)=>{const f=s.items.value.length,I=f-1;f<=2?d.value=a<l:a===I&&l===0?d.value=!0:a===0&&l===I?d.value=!1:d.value=a<l}),J(W,{transition:y,isReversed:d,transitionCount:b,transitionHeight:T,rootRef:v});const c=h(()=>e.continuous||g.value!==0),B=h(()=>e.continuous||g.value!==s.items.value.length-1);function C(){c.value&&s.prev()}function E(){B.value&&s.next()}const L=h(()=>{const a=[],l={icon:i.value?e.nextIcon:e.prevIcon,class:`v-window__${r.value?"right":"left"}`,onClick:s.prev,"aria-label":u("$vuetify.carousel.prev")};a.push(c.value?t.prev?t.prev({props:l}):m(w,l,null):m("div",null,null));const f={icon:i.value?e.prevIcon:e.nextIcon,class:`v-window__${r.value?"left":"right"}`,onClick:s.next,"aria-label":u("$vuetify.carousel.next")};return a.push(B.value?t.next?t.next({props:f}):m(w,f,null):m("div",null,null)),a}),A=h(()=>e.touch===!1?e.touch:{...{left:()=>{r.value?C():E()},right:()=>{r.value?E():C()},start:l=>{let{originalEvent:f}=l;f.stopPropagation()}},...e.touch===!0?{}:e.touch});return k(()=>P(m(e.tag,{ref:v,class:["v-window",{"v-window--show-arrows-on-hover":e.showArrows==="hover"},n.value,e.class],style:e.style},{default:()=>{var a,l;return[m("div",{class:"v-window__container",style:{height:T.value}},[(a=t.default)==null?void 0:a.call(t,{group:s}),e.showArrows!==!1&&m("div",{class:"v-window__controls"},[L.value])]),(l=t.additional)==null?void 0:l.call(t,{group:s})]}}),[[F("touch"),A.value]])),{group:s}}}),ve=H({reverseTransition:{type:[Boolean,String],default:void 0},transition:{type:[Boolean,String],default:void 0},...R(),...ee(),...p()},"VWindowItem"),he=_()({name:"VWindowItem",directives:{Touch:V},props:ve(),emits:{"group:selected":e=>!0},setup(e,o){let{slots:t}=o;const n=Q(W),i=U(e,$),{isBooted:u}=Z();if(!n||!i)throw new Error("[Vuetify] VWindowItem must be used inside VWindow");const s=x(!1),v=h(()=>u.value&&(n.isReversed.value?e.reverseTransition!==!1:e.transition!==!1));function r(){!s.value||!n||(s.value=!1,n.transitionCount.value>0&&(n.transitionCount.value-=1,n.transitionCount.value===0&&(n.transitionHeight.value=void 0)))}function d(){var c;s.value||!n||(s.value=!0,n.transitionCount.value===0&&(n.transitionHeight.value=X((c=n.rootRef.value)==null?void 0:c.clientHeight)),n.transitionCount.value+=1)}function y(){r()}function b(c){s.value&&te(()=>{!v.value||!s.value||!n||(n.transitionHeight.value=X(c.clientHeight))})}const T=h(()=>{const c=n.isReversed.value?e.reverseTransition:e.transition;return v.value?{name:typeof c!="string"?n.transition.value:c,onBeforeEnter:d,onAfterEnter:r,onEnterCancelled:y,onBeforeLeave:d,onAfterLeave:r,onLeaveCancelled:y,onEnter:b}:!1}),{hasContent:g}=K(e,i.isSelected);return k(()=>m(N,{transition:T.value,disabled:!u.value},{default:()=>{var c;return[P(m("div",{class:["v-window-item",i.selectedClass.value,e.class],style:e.style},[g.value&&((c=t.default)==null?void 0:c.call(t))]),[[ne,i.isSelected.value]])]}})),{groupItem:i}}});export{fe as V,he as a,ve as b,re as m};
