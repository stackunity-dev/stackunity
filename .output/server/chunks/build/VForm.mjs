globalThis.__timing__.logStart('Load chunks/build/VForm');import { ref, createVNode } from 'vue';
import { f as y, y as y$1, ax as K, as as d, o, ay as j, n as o$1 } from './server.mjs';

const P=y$1({...o$1(),...j()},"VForm"),N=y()({name:"VForm",props:P(),emits:{"update:modelValue":o=>true,submit:o=>true},setup(o$1,a){let{slots:i,emit:s}=a;const r=K(o$1),m=ref();function f(n){n.preventDefault(),r.reset();}function l(n){const t=n,e=r.validate();t.then=e.then.bind(e),t.catch=e.catch.bind(e),t.finally=e.finally.bind(e),s("submit",t),t.defaultPrevented||e.then(u=>{let{valid:c}=u;c&&m.value?.submit();}),t.preventDefault();}return o(()=>createVNode("form",{ref:m,class:["v-form",o$1.class],style:o$1.style,novalidate:true,onReset:f,onSubmit:l},[i.default?.(r)])),d(r,m)}});

export { N };;globalThis.__timing__.logEnd('Load chunks/build/VForm');
