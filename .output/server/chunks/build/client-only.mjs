globalThis.__timing__.logStart('Load chunks/build/client-only');import { defineComponent, ref, provide, createElementBlock } from 'vue';

const m=Symbol.for("nuxt:client-only"),s=defineComponent({name:"ClientOnly",inheritAttrs:false,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(d,{slots:l,attrs:t}){const n=ref(false);return provide(m,true),e=>{if(n.value)return l.default?.();const a=l.fallback||l.placeholder;if(a)return a();const o=e.fallback||e.placeholder||"",r=e.fallbackTag||e.placeholderTag||"span";return createElementBlock(r,t,o)}}});

export { s };;globalThis.__timing__.logEnd('Load chunks/build/client-only');
