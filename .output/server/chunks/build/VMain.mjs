globalThis.__timing__.logStart('Load chunks/build/VMain');import { createVNode } from 'vue';
import { f as y$1, y as y$2, j as x, p as dt, i, o, k as r, l as f, n as o$1 } from './server.mjs';

const y=y$2({scrollable:Boolean,...o$1(),...f(),...r({tag:"main"})},"VMain"),_=y$1()({name:"VMain",props:y(),setup(o$1,r){let{slots:e}=r;const{dimensionStyles:s}=x(o$1),{mainStyles:a}=dt(),{ssrBootStyles:m}=i();return o(()=>createVNode(o$1.tag,{class:["v-main",{"v-main--scrollable":o$1.scrollable},o$1.class],style:[a.value,m.value,s.value,o$1.style]},{default:()=>[o$1.scrollable?createVNode("div",{class:"v-main__scroller"},[e.default?.()]):e.default?.()]})),{}}});

export { _ };;globalThis.__timing__.logEnd('Load chunks/build/VMain');
