import{i as W,t as F}from"./B4PH3DK_.js";import{e as G,bq as V,Y as y,bM as w,bX as q,y as d,cV as Q,a1 as A,aQ as H,H as X,aR as Z,aU as J,ay as ee,N as te}from"./CaL5DcWf.js";import"./CHFqc21c.js";import"./hc3dmJ37.js";import"./D9cfhuwM.js";import"./CkVm5wB_.js";import"./DS5JlRFZ.js";import"./BSz84BLr.js";import"./DN7PZOHx.js";import"./5AmwwOYV.js";import"./a0Z0q662.js";const ne=["getWidth","getHeight","getDom","getOption","resize","dispatchAction","convertToPixel","convertFromPixel","containPixel","getDataURL","getConnectedDataURL","appendData","clear","isDisposed","dispose"];function se(e){function o(t){return(...a)=>{if(!e.value)throw new Error("ECharts is not initialized yet.");return e.value[t].apply(e.value,a)}}function n(){const t=Object.create(null);return ne.forEach(a=>{t[a]=o(a)}),t}return n()}function ie(e,o,n){A([n,e,o],([t,a,r],N,C)=>{let l=null;if(t&&a&&r){const{offsetWidth:I,offsetHeight:P}=t,x=r===!0?{}:r,{throttle:O=100,onResize:f}=x;let p=!1;const h=()=>{a.resize(),f==null||f()},z=O?F(h,O):h;l=new ResizeObserver(()=>{!p&&(p=!0,t.offsetWidth===I&&t.offsetHeight===P)||z()}),l.observe(t)}C(()=>{l&&(l.disconnect(),l=null)})})}const oe={autoresize:[Boolean,Object]},ae=/^on[^a-z]/,S=e=>ae.test(e);function re(e){const o={};for(const n in e)S(n)||(o[n]=e[n]);return o}function L(e,o){const n=ee(e)?te(e):e;return n&&typeof n=="object"&&"value"in n?n.value||o:n||o}const le="ecLoadingOptions";function ce(e,o,n){const t=w(le,{}),a=d(()=>({...L(t,{}),...n==null?void 0:n.value}));H(()=>{const r=e.value;r&&(o.value?r.showLoading(a.value):r.hideLoading())})}const ue={loading:Boolean,loadingOptions:Object};let g=null;const $="x-vue-echarts";function fe(){if(g!=null)return g;if(typeof HTMLElement>"u"||typeof customElements>"u")return g=!1;try{new Function("tag","class EChartsElement extends HTMLElement{__dispose=null;disconnectedCallback(){this.__dispose&&(this.__dispose(),this.__dispose=null)}}customElements.get(tag)==null&&customElements.define(tag,EChartsElement);")($)}catch{return g=!1}return g=!0}document.head.appendChild(document.createElement("style")).textContent=`x-vue-echarts{display:block;width:100%;height:100%;min-width:0}
`;const de=fe(),pe="ecTheme",he="ecInitOptions",me="ecUpdateOptions",D=/(^&?~?!?)native:/;var Ie=G({name:"echarts",props:{option:Object,theme:{type:[Object,String]},initOptions:Object,updateOptions:Object,group:String,manualUpdate:Boolean,...oe,...ue},emits:{},inheritAttrs:!1,setup(e,{attrs:o}){const n=y(),t=y(),a=y(),r=w(pe,null),N=w(he,null),C=w(me,null),{autoresize:l,manualUpdate:I,loading:P,loadingOptions:x}=q(e),O=d(()=>a.value||e.option||null),f=d(()=>e.theme||L(r,{})),p=d(()=>e.initOptions||L(N,{})),h=d(()=>e.updateOptions||L(C,{})),z=d(()=>re(o)),U={},E=Q().proxy.$listeners,_={};E?Object.keys(E).forEach(i=>{D.test(i)?U[i.replace(D,"$1")]=E[i]:_[i]=E[i]}):Object.keys(o).filter(i=>S(i)).forEach(i=>{let s=i.charAt(2).toLowerCase()+i.slice(3);if(s.indexOf("native:")===0){const m=`on${s.charAt(7).toUpperCase()}${s.slice(8)}`;U[m]=o[i];return}s.substring(s.length-4)==="Once"&&(s=`~${s.substring(0,s.length-4)}`),_[s]=o[i]});function b(i){if(!n.value)return;const s=t.value=W(n.value,f.value,p.value);e.group&&(s.group=e.group),Object.keys(_).forEach(v=>{let c=_[v];if(!c)return;let u=v.toLowerCase();u.charAt(0)==="~"&&(u=u.substring(1),c.__once__=!0);let M=s;if(u.indexOf("zr:")===0&&(M=s.getZr(),u=u.substring(3)),c.__once__){delete c.__once__;const B=c;c=(...k)=>{B(...k),M.off(u,c)}}M.on(u,c)});function m(){s&&!s.isDisposed()&&s.resize()}function R(){const v=i||O.value;v&&s.setOption(v,h.value)}l.value?J(()=>{m(),R()}):R()}function K(i,s){e.manualUpdate&&(a.value=i),t.value?t.value.setOption(i,s||{}):b(i)}function j(){t.value&&(t.value.dispose(),t.value=void 0)}let T=null;A(I,i=>{typeof T=="function"&&(T(),T=null),i||(T=A(()=>e.option,(s,m)=>{s&&(t.value?t.value.setOption(s,{notMerge:s!==m,...h.value}):b())},{deep:!0}))},{immediate:!0}),A([f,p],()=>{j(),b()},{deep:!0}),H(()=>{e.group&&t.value&&(t.value.group=e.group)});const Y=se(t);return ce(t,P,x),ie(t,l,n),X(()=>{b()}),Z(()=>{de&&n.value?n.value.__dispose=j:j()}),{chart:t,root:n,setOption:K,nonEventAttrs:z,nativeListeners:U,...Y}},render(){const e={...this.nonEventAttrs,...this.nativeListeners};return e.ref="root",e.class=e.class?["echarts"].concat(e.class):"echarts",V($,e)}});export{he as INIT_OPTIONS_KEY,le as LOADING_OPTIONS_KEY,pe as THEME_KEY,me as UPDATE_OPTIONS_KEY,Ie as default};
