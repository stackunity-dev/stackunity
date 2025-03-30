import{S}from"./CTpYCmOx.js";import{f as C,p as b,k,aV as i}from"./BOmTdu30.js";import{c as j,j as N,b as u}from"./CoKilWGJ.js";const V=i.reduce((t,n)=>(t[n]={type:[Boolean,String,Number],default:!1},t),{}),v=i.reduce((t,n)=>{const e="offset"+u(n);return t[e]={type:[String,Number],default:null},t},{}),L=i.reduce((t,n)=>{const e="order"+u(n);return t[e]={type:[String,Number],default:null},t},{}),y={col:Object.keys(V),offset:Object.keys(v),order:Object.keys(L)};function G(t,n,e){let s=t;if(!(e==null||e===!1)){if(n){const l=n.replace(t,"");s+=`-${l}`}return t==="col"&&(s="v-"+s),t==="col"&&(e===""||e===!0)||(s+=`-${e}`),s.toLowerCase()}}const _=["auto","start","end","center","baseline","stretch"],I=b({cols:{type:[Boolean,String,Number],default:!1},...V,offset:{type:[String,Number],default:null},...v,order:{type:[String,Number],default:null},...L,alignSelf:{type:String,default:null,validator:t=>_.includes(t)},...k(),...S()},"VCol"),J=C()({name:"VCol",props:I(),setup(t,n){let{slots:e}=n;const s=j(()=>{const l=[];let a;for(a in y)y[a].forEach(o=>{const c=t[o],g=G(a,o,c);g&&l.push(g)});const r=l.some(o=>o.startsWith("v-col-"));return l.push({"v-col":!r||!t.cols,[`v-col-${t.cols}`]:t.cols,[`offset-${t.offset}`]:t.offset,[`order-${t.order}`]:t.order,[`align-self-${t.alignSelf}`]:t.alignSelf}),l});return()=>N(t.tag,{class:[s.value,t.class],style:t.style},e.default?.())}}),f=["start","end","center"],$=["space-between","space-around","space-evenly"];function d(t,n){return i.reduce((e,s)=>{const l=t+u(s);return e[l]=n(),e},{})}const R=[...f,"baseline","stretch"],h=t=>R.includes(t),w=d("align",()=>({type:String,default:null,validator:h})),T=[...f,...$],P=t=>T.includes(t),E=d("justify",()=>({type:String,default:null,validator:P})),U=[...f,...$,"stretch"],A=t=>U.includes(t),O=d("alignContent",()=>({type:String,default:null,validator:A})),m={align:Object.keys(w),justify:Object.keys(E),alignContent:Object.keys(O)},B={align:"align",justify:"justify",alignContent:"align-content"};function M(t,n,e){let s=B[t];if(e!=null){if(n){const l=n.replace(t,"");s+=`-${l}`}return s+=`-${e}`,s.toLowerCase()}}const F=b({dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:h},...w,justify:{type:String,default:null,validator:P},...E,alignContent:{type:String,default:null,validator:A},...O,...k(),...S()},"VRow"),W=C()({name:"VRow",props:F(),setup(t,n){let{slots:e}=n;const s=j(()=>{const l=[];let a;for(a in m)m[a].forEach(r=>{const o=t[r],c=M(a,r,o);c&&l.push(c)});return l.push({"v-row--no-gutters":t.noGutters,"v-row--dense":t.dense,[`align-${t.align}`]:t.align,[`justify-${t.justify}`]:t.justify,[`align-content-${t.alignContent}`]:t.alignContent}),l});return()=>N(t.tag,{class:["v-row",s.value,t.class],style:t.style},e.default?.())}});export{W as V,J as a};
