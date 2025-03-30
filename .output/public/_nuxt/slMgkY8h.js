import{Y as B,y as b,$ as Q,H as Z,a1 as H,aR as j,c_ as ee,aK as L,aQ as te,cy as ae,m as ne,p as oe,aj as le,v as ue,aI as ie,u as z,n as A,s as re,bG as se,aJ as ce,c$ as ve,ai as de,ci as me,c9 as he,I as fe,d0 as ge,aP as ye,al as we,A as be,b as p,B as F,d1 as Se,aC as ke,aB as Ee,bn as Te,F as pe,C as Me,aL as Pe,aM as xe,aN as Ce,D as Be,bW as Ve,d2 as De,a3 as Re,aO as He,aU as Ie}from"./CaL5DcWf.js";function Ye(e){let{rootEl:s,isSticky:i,layoutItemStyles:T}=e;const t=B(!1),r=B(0),a=b(()=>{const w=typeof t.value=="boolean"?"top":t.value;return[i.value?{top:"auto",bottom:"auto",height:void 0}:void 0,t.value?{[w]:Q(r.value)}:{top:T.value.top}]});Z(()=>{H(i,w=>{w?window.addEventListener("scroll",E,{passive:!0}):window.removeEventListener("scroll",E)},{immediate:!0})}),j(()=>{window.removeEventListener("scroll",E)});let g=0;function E(){const w=g>window.scrollY?"up":"down",v=s.value.getBoundingClientRect(),d=parseFloat(T.value.top??0),c=window.scrollY-Math.max(0,r.value-d),h=v.height+Math.max(r.value,d)-window.scrollY-window.innerHeight,y=parseFloat(getComputedStyle(s.value).getPropertyValue("--v-body-scroll-y"))||0;v.height<window.innerHeight-d?(t.value="top",r.value=d):w==="up"&&t.value==="bottom"||w==="down"&&t.value==="top"?(r.value=window.scrollY+v.top-y,t.value=!0):w==="down"&&h<=0?(r.value=0,t.value="bottom"):w==="up"&&c<=0&&(y?t.value!=="top"&&(r.value=-c+y+d,t.value="top"):(r.value=v.top+c,t.value="top")),g=window.scrollY}return{isStuck:t,stickyStyles:a}}const Le=100,Ne=20;function q(e){return(e<0?-1:1)*Math.sqrt(Math.abs(e))*1.41421356237}function U(e){if(e.length<2)return 0;if(e.length===2)return e[1].t===e[0].t?0:(e[1].d-e[0].d)/(e[1].t-e[0].t);let s=0;for(let i=e.length-1;i>0;i--){if(e[i].t===e[i-1].t)continue;const T=q(s),t=(e[i].d-e[i-1].d)/(e[i].t-e[i-1].t);s+=(t-T)*Math.abs(t),i===e.length-1&&(s*=.5)}return q(s)*1e3}function We(){const e={};function s(t){Array.from(t.changedTouches).forEach(r=>{(e[r.identifier]??(e[r.identifier]=new ee(Ne))).push([t.timeStamp,r])})}function i(t){Array.from(t.changedTouches).forEach(r=>{delete e[r.identifier]})}function T(t){var w;const r=(w=e[t])==null?void 0:w.values().reverse();if(!r)throw new Error(`No samples for touch id ${t}`);const a=r[0],g=[],E=[];for(const v of r){if(a[0]-v[0]>Le)break;g.push({t:v[0],d:v[1].clientX}),E.push({t:v[0],d:v[1].clientY})}return{x:U(g),y:U(E),get direction(){const{x:v,y:d}=this,[c,h]=[Math.abs(v),Math.abs(d)];return c>h&&v>=0?"right":c>h&&v<=0?"left":h>c&&d>=0?"down":h>c&&d<=0?"up":Oe()}}}return{addMovement:s,endTouch:i,getVelocity:T}}function Oe(){throw new Error}function _e(e){let{el:s,isActive:i,isTemporary:T,width:t,touchless:r,position:a}=e;Z(()=>{window.addEventListener("touchstart",P,{passive:!0}),window.addEventListener("touchmove",M,{passive:!1}),window.addEventListener("touchend",I,{passive:!0})}),j(()=>{window.removeEventListener("touchstart",P),window.removeEventListener("touchmove",M),window.removeEventListener("touchend",I)});const g=b(()=>["left","right"].includes(a.value)),{addMovement:E,endTouch:w,getVelocity:v}=We();let d=!1;const c=B(!1),h=B(0),y=B(0);let k;function V(n,o){return(a.value==="left"?n:a.value==="right"?document.documentElement.clientWidth-n:a.value==="top"?n:a.value==="bottom"?document.documentElement.clientHeight-n:C())-(o?t.value:0)}function D(n){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const l=a.value==="left"?(n-y.value)/t.value:a.value==="right"?(document.documentElement.clientWidth-n-y.value)/t.value:a.value==="top"?(n-y.value)/t.value:a.value==="bottom"?(document.documentElement.clientHeight-n-y.value)/t.value:C();return o?Math.max(0,Math.min(1,l)):l}function P(n){if(r.value)return;const o=n.changedTouches[0].clientX,l=n.changedTouches[0].clientY,u=25,f=a.value==="left"?o<u:a.value==="right"?o>document.documentElement.clientWidth-u:a.value==="top"?l<u:a.value==="bottom"?l>document.documentElement.clientHeight-u:C(),m=i.value&&(a.value==="left"?o<t.value:a.value==="right"?o>document.documentElement.clientWidth-t.value:a.value==="top"?l<t.value:a.value==="bottom"?l>document.documentElement.clientHeight-t.value:C());(f||m||i.value&&T.value)&&(k=[o,l],y.value=V(g.value?o:l,i.value),h.value=D(g.value?o:l),d=y.value>-20&&y.value<80,w(n),E(n))}function M(n){const o=n.changedTouches[0].clientX,l=n.changedTouches[0].clientY;if(d){if(!n.cancelable){d=!1;return}const f=Math.abs(o-k[0]),m=Math.abs(l-k[1]);(g.value?f>m&&f>3:m>f&&m>3)?(c.value=!0,d=!1):(g.value?m:f)>3&&(d=!1)}if(!c.value)return;n.preventDefault(),E(n);const u=D(g.value?o:l,!1);h.value=Math.max(0,Math.min(1,u)),u>1?y.value=V(g.value?o:l,!0):u<0&&(y.value=V(g.value?o:l,!1))}function I(n){if(d=!1,!c.value)return;E(n),c.value=!1;const o=v(n.changedTouches[0].identifier),l=Math.abs(o.x),u=Math.abs(o.y);(g.value?l>u&&l>400:u>l&&u>3)?i.value=o.direction===({left:"right",right:"left",top:"down",bottom:"up"}[a.value]||C()):i.value=h.value>.5}const R=b(()=>c.value?{transform:a.value==="left"?`translateX(calc(-100% + ${h.value*t.value}px))`:a.value==="right"?`translateX(calc(100% - ${h.value*t.value}px))`:a.value==="top"?`translateY(calc(-100% + ${h.value*t.value}px))`:a.value==="bottom"?`translateY(calc(100% - ${h.value*t.value}px))`:C(),transition:"none"}:void 0);return L(c,()=>{var l,u;const n=((l=s.value)==null?void 0:l.style.transform)??null,o=((u=s.value)==null?void 0:u.style.transition)??null;te(()=>{var f,m,x,Y;(m=s.value)==null||m.style.setProperty("transform",((f=R.value)==null?void 0:f.transform)||"none"),(Y=s.value)==null||Y.style.setProperty("transition",((x=R.value)==null?void 0:x.transition)||null)}),ae(()=>{var f,m;(f=s.value)==null||f.style.setProperty("transform",n),(m=s.value)==null||m.style.setProperty("transition",o)})}),{isDragging:c,dragProgress:h,dragStyles:R}}function C(){throw new Error}const $e=["start","end","left","right","top","bottom"],Xe=oe({color:String,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,modelValue:{type:Boolean,default:null},permanent:Boolean,rail:{type:Boolean,default:null},railWidth:{type:[Number,String],default:56},scrim:{type:[Boolean,String],default:!0},image:String,temporary:Boolean,persistent:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},location:{type:String,default:"start",validator:e=>$e.includes(e)},sticky:Boolean,...He(),...Re(),...De(),...Ve({mobile:null}),...Be(),...Ce(),...xe(),...Pe({tag:"nav"}),...Me()},"VNavigationDrawer"),Ae=ne()({name:"VNavigationDrawer",props:Xe(),emits:{"update:modelValue":e=>!0,"update:rail":e=>!0},setup(e,s){let{attrs:i,emit:T,slots:t}=s;const{isRtl:r}=le(),{themeClasses:a}=ue(e),{borderClasses:g}=ie(e),{backgroundColorClasses:E,backgroundColorStyles:w}=z(A(e,"color")),{elevationClasses:v}=re(e),{displayClasses:d,mobile:c}=se(e),{roundedClasses:h}=ce(e),y=ve(),k=de(e,"modelValue",null,S=>!!S),{ssrBootStyles:V}=me(),{scopeId:D}=he(),P=fe(),M=B(!1),{runOpenDelay:I,runCloseDelay:R}=Se(e,S=>{M.value=S}),n=b(()=>e.rail&&e.expandOnHover&&M.value?Number(e.width):Number(e.rail?e.railWidth:e.width)),o=b(()=>ge(e.location,r.value)),l=b(()=>e.persistent),u=b(()=>!e.permanent&&(c.value||e.temporary)),f=b(()=>e.sticky&&!u.value&&o.value!=="bottom");L(()=>e.expandOnHover&&e.rail!=null,()=>{H(M,S=>T("update:rail",!S))}),L(()=>!e.disableResizeWatcher,()=>{H(u,S=>!e.permanent&&Ie(()=>k.value=!S))}),L(()=>!e.disableRouteWatcher&&!!y,()=>{H(y.currentRoute,()=>u.value&&(k.value=!1))}),H(()=>e.permanent,S=>{S&&(k.value=!0)}),e.modelValue==null&&!u.value&&(k.value=e.permanent||!c.value);const{isDragging:m,dragProgress:x}=_e({el:P,isActive:k,isTemporary:u,width:n,touchless:A(e,"touchless"),position:o}),Y=b(()=>{const S=u.value?0:e.rail&&e.expandOnHover?Number(e.railWidth):n.value;return m.value?S*x.value:S}),{layoutItemStyles:N,layoutItemScrimStyles:G}=ye({id:e.name,order:b(()=>parseInt(e.order,10)),position:o,layoutSize:Y,elementSize:n,active:b(()=>k.value||m.value),disableTransitions:b(()=>m.value),absolute:b(()=>e.absolute||f.value&&typeof W.value!="string")}),{isStuck:W,stickyStyles:J}=Ye({rootEl:P,isSticky:f,layoutItemStyles:N}),O=z(b(()=>typeof e.scrim=="string"?e.scrim:null)),K=b(()=>({...m.value?{opacity:x.value*.2,transition:"none"}:void 0,...G.value}));return we({VList:{bgColor:"transparent"}}),be(()=>{const S=t.image||e.image;return p(pe,null,[p(e.tag,F({ref:P,onMouseenter:I,onMouseleave:R,class:["v-navigation-drawer",`v-navigation-drawer--${o.value}`,{"v-navigation-drawer--expand-on-hover":e.expandOnHover,"v-navigation-drawer--floating":e.floating,"v-navigation-drawer--is-hovering":M.value,"v-navigation-drawer--rail":e.rail,"v-navigation-drawer--temporary":u.value,"v-navigation-drawer--persistent":l.value,"v-navigation-drawer--active":k.value,"v-navigation-drawer--sticky":f.value},a.value,E.value,g.value,d.value,v.value,h.value,e.class],style:[w.value,N.value,V.value,J.value,e.style]},D,i),{default:()=>{var _,$,X;return[S&&p("div",{key:"image",class:"v-navigation-drawer__img"},[t.image?p(Ee,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{alt:"",cover:!0,height:"inherit",src:e.image}}},t.image):p(ke,{key:"image-img",alt:"",cover:!0,height:"inherit",src:e.image},null)]),t.prepend&&p("div",{class:"v-navigation-drawer__prepend"},[(_=t.prepend)==null?void 0:_.call(t)]),p("div",{class:"v-navigation-drawer__content"},[($=t.default)==null?void 0:$.call(t)]),t.append&&p("div",{class:"v-navigation-drawer__append"},[(X=t.append)==null?void 0:X.call(t)])]}}),p(Te,{name:"fade-transition"},{default:()=>[u.value&&(m.value||k.value)&&!!e.scrim&&p("div",F({class:["v-navigation-drawer__scrim",O.backgroundColorClasses.value],style:[K.value,O.backgroundColorStyles.value],onClick:()=>{l.value||(k.value=!1)}},D),null)]})])}),{isStuck:W}}});export{Ae as V};
