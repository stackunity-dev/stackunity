globalThis.__timing__.logStart('Load chunks/build/v3');import { hasInjectionContext, inject } from 'vue';
import { I } from './server.mjs';
import { u as useHead, h as headSymbol } from '../routes/renderer.mjs';

function s(e){const t=e||I();return t?.ssrContext?.head||t?.runWithContext(()=>{if(hasInjectionContext())return inject(headSymbol)})}function m(e,t={}){const n=s(t.nuxt);if(n)return useHead(e,{head:n,...t})}

export { m };;globalThis.__timing__.logEnd('Load chunks/build/v3');
