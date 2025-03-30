import{i as W,t as F}from"./Dk4GiS4O.js";import{h as G,j as q,s as M,f as T,t as V,c as f,g as Z,w as A,a as H,x as J,q as Q,A as X,I as ee,u as te}from"./CoKilWGJ.js";import"./CTpYCmOx.js";import"./BOmTdu30.js";import"./BjfENyHQ.js";import"./D46G5lEI.js";import"./l8m5g3iJ.js";import"./BJLcRbSt.js";import"./DrsAYoPD.js";import"./B2XIg-v1.js";import"./B2zV2hO7.js";import"./DJrXhb7Z.js";import"./BS-DeQys.js";const ne=["getWidth","getHeight","getDom","getOption","resize","dispatchAction","convertToPixel","convertFromPixel","containPixel","getDataURL","getConnectedDataURL","appendData","clear","isDisposed","dispose"];function ie(e){function o(t){return(...a)=>{if(!e.value)throw new Error("ECharts is not initialized yet.");return e.value[t].apply(e.value,a)}}function i(){const t=Object.create(null);return ne.forEach(a=>{t[a]=o(a)}),t}return i()}function se(e,o,i){A([i,e,o],([t,a,l],D,z)=>{let r=null;if(t&&a&&l){const{offsetWidth:C,offsetHeight:I}=t,x=l===!0?{}:l,{throttle:v=100,onResize:O}=x;let d=!1;const p=()=>{a.resize(),O?.()},P=v?F(p,v):p;r=new ResizeObserver(()=>{!d&&(d=!0,t.offsetWidth===C&&t.offsetHeight===I)||P()}),r.observe(t)}z(()=>{r&&(r.disconnect(),r=null)})})}const oe={autoresize:[Boolean,Object]},ae=/^on[^a-z]/,S=e=>ae.test(e);function le(e){const o={};for(const i in e)S(i)||(o[i]=e[i]);return o}function L(e,o){const i=ee(e)?te(e):e;return i&&typeof i=="object"&&"value"in i?i.value||o:i||o}const re="ecLoadingOptions";function ce(e,o,i){const t=T(re,{}),a=f(()=>({...L(t,{}),...i?.value}));H(()=>{const l=e.value;l&&(o.value?l.showLoading(a.value):l.hideLoading())})}const ue={loading:Boolean,loadingOptions:Object};let m=null;const $="x-vue-echarts";function fe(){if(m!=null)return m;if(typeof HTMLElement>"u"||typeof customElements>"u")return m=!1;try{new Function("tag","class EChartsElement extends HTMLElement{__dispose=null;disconnectedCallback(){this.__dispose&&(this.__dispose(),this.__dispose=null)}}customElements.get(tag)==null&&customElements.define(tag,EChartsElement);")($)}catch{return m=!1}return m=!0}document.head.appendChild(document.createElement("style")).textContent=`x-vue-echarts{display:block;width:100%;height:100%;min-width:0}
`;const de=fe(),pe="ecTheme",he="ecInitOptions",ge="ecUpdateOptions",y=/(^&?~?!?)native:/;var xe=G({name:"echarts",props:{option:Object,theme:{type:[Object,String]},initOptions:Object,updateOptions:Object,group:String,manualUpdate:Boolean,...oe,...ue},emits:{},inheritAttrs:!1,setup(e,{attrs:o}){const i=M(),t=M(),a=M(),l=T(pe,null),D=T(he,null),z=T(ge,null),{autoresize:r,manualUpdate:C,loading:I,loadingOptions:x}=V(e),v=f(()=>a.value||e.option||null),O=f(()=>e.theme||L(l,{})),d=f(()=>e.initOptions||L(D,{})),p=f(()=>e.updateOptions||L(z,{})),P=f(()=>le(o)),j={},E=Z().proxy.$listeners,_={};E?Object.keys(E).forEach(s=>{y.test(s)?j[s.replace(y,"$1")]=E[s]:_[s]=E[s]}):Object.keys(o).filter(s=>S(s)).forEach(s=>{let n=s.charAt(2).toLowerCase()+s.slice(3);if(n.indexOf("native:")===0){const h=`on${n.charAt(7).toUpperCase()}${n.slice(8)}`;j[h]=o[s];return}n.substring(n.length-4)==="Once"&&(n=`~${n.substring(0,n.length-4)}`),_[n]=o[s]});function b(s){if(!i.value)return;const n=t.value=W(i.value,O.value,d.value);e.group&&(n.group=e.group),Object.keys(_).forEach(g=>{let c=_[g];if(!c)return;let u=g.toLowerCase();u.charAt(0)==="~"&&(u=u.substring(1),c.__once__=!0);let U=n;if(u.indexOf("zr:")===0&&(U=n.getZr(),u=u.substring(3)),c.__once__){delete c.__once__;const Y=c;c=(...k)=>{Y(...k),U.off(u,c)}}U.on(u,c)});function h(){n&&!n.isDisposed()&&n.resize()}function N(){const g=s||v.value;g&&n.setOption(g,p.value)}r.value?X(()=>{h(),N()}):N()}function K(s,n){e.manualUpdate&&(a.value=s),t.value?t.value.setOption(s,n||{}):b(s)}function R(){t.value&&(t.value.dispose(),t.value=void 0)}let w=null;A(C,s=>{typeof w=="function"&&(w(),w=null),s||(w=A(()=>e.option,(n,h)=>{n&&(t.value?t.value.setOption(n,{notMerge:n!==h,...p.value}):b())},{deep:!0}))},{immediate:!0}),A([O,d],()=>{R(),b()},{deep:!0}),H(()=>{e.group&&t.value&&(t.value.group=e.group)});const B=ie(t);return ce(t,I,x),se(t,r,i),J(()=>{b()}),Q(()=>{de&&i.value?i.value.__dispose=R:R()}),{chart:t,root:i,setOption:K,nonEventAttrs:P,nativeListeners:j,...B}},render(){const e={...this.nonEventAttrs,...this.nativeListeners};return e.ref="root",e.class=e.class?["echarts"].concat(e.class):"echarts",q($,e)}});export{he as INIT_OPTIONS_KEY,re as LOADING_OPTIONS_KEY,pe as THEME_KEY,ge as UPDATE_OPTIONS_KEY,xe as default};
