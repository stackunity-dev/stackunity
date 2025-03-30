globalThis.__timing__.logStart('Load chunks/build/VTimeline');import { toRef, createVNode, shallowRef, ref, watch, computed } from 'vue';
import { f as y, y as y$1, bh as g, u as x, z as h, w as v, o, H as P$1, L, D as u, bj as f, B as g$1, n as o$1, ap as A, j as x$1, k as r, l as f$1, X, t as _, aF as l, h as y$2, O, M, aN as u$1, bd as k } from './server.mjs';

const T=y$1({dotColor:String,fillDot:Boolean,hideDot:Boolean,icon:A,iconColor:String,lineColor:String,...o$1(),...g$1(),...f(),...u()},"VTimelineDivider"),H=y()({name:"VTimelineDivider",props:T(),setup(e,d){let{slots:i}=d;const{sizeClasses:a,sizeStyles:m}=g(e,"v-timeline-divider__dot"),{backgroundColorStyles:v$1,backgroundColorClasses:c}=x(toRef(e,"dotColor")),{roundedClasses:l}=h(e,"v-timeline-divider__dot"),{elevationClasses:u}=v(e),{backgroundColorClasses:t,backgroundColorStyles:n}=x(toRef(e,"lineColor"));return o(()=>createVNode("div",{class:["v-timeline-divider",{"v-timeline-divider--fill-dot":e.fillDot},e.class],style:e.style},[createVNode("div",{class:["v-timeline-divider__before",t.value],style:n.value},null),!e.hideDot&&createVNode("div",{key:"dot",class:["v-timeline-divider__dot",u.value,l.value,a.value],style:m.value},[createVNode("div",{class:["v-timeline-divider__inner-dot",c.value,l.value],style:v$1.value},[i.default?createVNode(P$1,{key:"icon-defaults",disabled:!e.icon,defaults:{VIcon:{color:e.iconColor,icon:e.icon,size:e.size}}},i.default):createVNode(L,{key:"icon",color:e.iconColor,icon:e.icon,size:e.size},null)])]),createVNode("div",{class:["v-timeline-divider__after",t.value],style:n.value},null)])),{}}});

const P=y$1({density:String,dotColor:String,fillDot:Boolean,hideDot:Boolean,hideOpposite:{type:Boolean,default:void 0},icon:A,iconColor:String,lineInset:[Number,String],...o$1(),...f$1(),...u(),...g$1(),...f(),...r()},"VTimelineItem"),E=y()({name:"VTimelineItem",props:P(),setup(e,r){let{slots:o$1}=r;const{dimensionStyles:d}=x$1(e),n=shallowRef(0),l=ref();return watch(l,m=>{m&&(n.value=m.$el.querySelector(".v-timeline-divider__dot")?.getBoundingClientRect().width??0);},{flush:"post"}),o(()=>createVNode("div",{class:["v-timeline-item",{"v-timeline-item--fill-dot":e.fillDot},e.class],style:[{"--v-timeline-dot-size":X(n.value),"--v-timeline-line-inset":e.lineInset?`calc(var(--v-timeline-dot-size) / 2 + ${X(e.lineInset)})`:X(0)},e.style]},[createVNode("div",{class:"v-timeline-item__body",style:d.value},[o$1.default?.()]),createVNode(H,{ref:l,hideDot:e.hideDot,icon:e.icon,iconColor:e.iconColor,size:e.size,elevation:e.elevation,dotColor:e.dotColor,fillDot:e.fillDot,rounded:e.rounded},{default:o$1.icon}),e.density!=="compact"&&createVNode("div",{class:"v-timeline-item__opposite"},[!e.hideOpposite&&o$1.opposite?.()])])),{}}});

const z=y$1({align:{type:String,default:"center",validator:e=>["center","start"].includes(e)},direction:{type:String,default:"vertical",validator:e=>["vertical","horizontal"].includes(e)},justify:{type:String,default:"auto",validator:e=>["auto","center"].includes(e)},side:{type:String,validator:e=>e==null||["start","end"].includes(e)},lineThickness:{type:[String,Number],default:2},lineColor:String,truncateLine:{type:String,validator:e=>["start","end","both"].includes(e)},...k(P({lineInset:0}),["dotColor","fillDot","hideOpposite","iconColor","lineInset","size"]),...o$1(),...u$1(),...r(),...M()},"VTimeline"),B=y()({name:"VTimeline",props:z(),setup(e,l$1){let{slots:o$1}=l$1;const{themeClasses:r}=_(e),{densityClasses:s}=l(e),{rtlClasses:a}=y$2();O({VTimelineDivider:{lineColor:toRef(e,"lineColor")},VTimelineItem:{density:toRef(e,"density"),dotColor:toRef(e,"dotColor"),fillDot:toRef(e,"fillDot"),hideOpposite:toRef(e,"hideOpposite"),iconColor:toRef(e,"iconColor"),lineColor:toRef(e,"lineColor"),lineInset:toRef(e,"lineInset"),size:toRef(e,"size")}});const m=computed(()=>{const i=e.side?e.side:e.density!=="default"?"end":null;return i&&`v-timeline--side-${i}`}),c=computed(()=>{const i=["v-timeline--truncate-line-start","v-timeline--truncate-line-end"];switch(e.truncateLine){case "both":return i;case "start":return i[0];case "end":return i[1];default:return null}});return o(()=>createVNode(e.tag,{class:["v-timeline",`v-timeline--${e.direction}`,`v-timeline--align-${e.align}`,`v-timeline--justify-${e.justify}`,c.value,{"v-timeline--inset-line":!!e.lineInset},r.value,s.value,m.value,a.value,e.class],style:[{"--v-timeline-line-thickness":X(e.lineThickness)},e.style]},o$1)),{}}});

export { B, E };;globalThis.__timing__.logEnd('Load chunks/build/VTimeline');
