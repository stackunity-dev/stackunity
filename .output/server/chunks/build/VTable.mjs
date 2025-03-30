globalThis.__timing__.logStart('Load chunks/build/VTable');import { createVNode } from 'vue';
import { f as y, y as y$1, t as _, aF as l, o, M, k as r, aN as u, n as o$1, X } from './server.mjs';

const c=y$1({fixedHeader:Boolean,fixedFooter:Boolean,height:[Number,String],hover:Boolean,...o$1(),...u(),...r(),...M()},"VTable"),w=y()({name:"VTable",props:c(),setup(e,a){let{slots:t,emit:u}=a;const{themeClasses:r}=_(e),{densityClasses:m}=l(e);return o(()=>createVNode(e.tag,{class:["v-table",{"v-table--fixed-height":!!e.height,"v-table--fixed-header":e.fixedHeader,"v-table--fixed-footer":e.fixedFooter,"v-table--has-top":!!t.top,"v-table--has-bottom":!!t.bottom,"v-table--hover":e.hover},r.value,m.value,e.class],style:e.style},{default:()=>[t.top?.(),t.default?createVNode("div",{class:"v-table__wrapper",style:{height:X(e.height)}},[createVNode("table",null,[t.default()])]):t.wrapper?.(),t.bottom?.()]})),{}}});

export { c, w };;globalThis.__timing__.logEnd('Load chunks/build/VTable');
