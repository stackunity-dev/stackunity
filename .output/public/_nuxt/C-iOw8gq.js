import{m as F,p as $,ai as W,x as G,I as M,a1 as A,H as q,A as O,b as e,B as j,$ as Y,aA as H,F as P,aB as J,g as Q,U as B,aC as z,aD as K,e as X,G as Z,y as L,aE as ee,f as v,w as t,l as te,o as c,c as C,r as I,h as y,L as h,a as r,i as g,d as n,t as d,K as T,J as E,k as se,_ as ae}from"./CaL5DcWf.js";import{u as le}from"./61L_5zm4.js";import{V as oe}from"./CHFqc21c.js";import{V as b,a as _}from"./D9cfhuwM.js";import{V as ie}from"./CkVm5wB_.js";import{V as re}from"./DwI9VqCk.js";import{V as N,m as ne,a as R,b as de}from"./v1DDmFXP.js";import{V as ue}from"./B6Zetl8z.js";const ce=$({color:String,cycle:Boolean,delimiterIcon:{type:H,default:"$delimiter"},height:{type:[Number,String],default:500},hideDelimiters:Boolean,hideDelimiterBackground:Boolean,interval:{type:[Number,String],default:6e3,validator:a=>Number(a)>0},progress:[Boolean,String],verticalDelimiters:[Boolean,String],...ne({continuous:!0,mandatory:"force",showArrows:!0})},"VCarousel"),me=F()({name:"VCarousel",props:ce(),emits:{"update:modelValue":a=>!0},setup(a,u){let{slots:i}=u;const f=W(a,"modelValue"),{t:w}=G(),p=M();let x=-1;A(f,V),A(()=>a.interval,V),A(()=>a.cycle,D=>{D?V():window.clearTimeout(x)}),q(k);function k(){!a.cycle||!p.value||(x=window.setTimeout(p.value.group.next,+a.interval>0?+a.interval:6e3))}function V(){window.clearTimeout(x),window.requestAnimationFrame(k)}return O(()=>{const D=N.filterProps(a);return e(N,j({ref:p},D,{modelValue:f.value,"onUpdate:modelValue":S=>f.value=S,class:["v-carousel",{"v-carousel--hide-delimiter-background":a.hideDelimiterBackground,"v-carousel--vertical-delimiters":a.verticalDelimiters},a.class],style:[{height:Y(a.height)},a.style]}),{default:i.default,additional:S=>{let{group:o}=S;return e(P,null,[!a.hideDelimiters&&e("div",{class:"v-carousel__controls",style:{left:a.verticalDelimiters==="left"&&a.verticalDelimiters?0:"auto",right:a.verticalDelimiters==="right"?0:"auto"}},[o.items.value.length>0&&e(J,{defaults:{VBtn:{color:a.color,icon:a.delimiterIcon,size:"x-small",variant:"text"}},scoped:!0},{default:()=>[o.items.value.map((s,l)=>{const m={id:`carousel-item-${s.id}`,"aria-label":w("$vuetify.carousel.ariaLabel.delimiter",l+1,o.items.value.length),class:["v-carousel__controls__item",o.isSelected(s.id)&&"v-btn--active"],onClick:()=>o.select(s.id,!0)};return i.item?i.item({props:m,item:s}):e(Q,j(s,m),null)})]})]),a.progress&&e(B,{class:"v-carousel__progress",color:typeof a.progress=="string"?a.progress:void 0,modelValue:(o.getItemIndex(f.value)+1)/o.items.value.length*100},null)])},prev:i.prev,next:i.next})}),{}}}),fe=$({...K(),...de()},"VCarouselItem"),ge=F()({name:"VCarouselItem",inheritAttrs:!1,props:fe(),setup(a,u){let{slots:i,attrs:f}=u;O(()=>{const w=z.filterProps(a),p=R.filterProps(a);return e(R,j({class:["v-carousel-item",a.class]},p),{default:()=>[e(z,j(f,w),i)]})})}}),ve={class:"text-h4 font-weight-bold"},pe={class:"text-subtitle-1 text-medium-emphasis"},ye={class:"d-flex justify-space-between align-center mb-2"},he={class:"text-subtitle-2"},be={class:"d-flex justify-space-between align-center mb-2"},_e={class:"text-subtitle-2"},we={class:"d-flex justify-space-between align-center mb-2"},xe={key:0,class:"text-subtitle-2"},ke={class:"d-flex align-center mb-2"},Ve={class:"text-subtitle-1 font-weight-medium text-truncate"},De={class:"text-caption text-grey"},Se={class:"text-body-2 text-truncate-2 mb-2"},Ce={class:"d-flex align-center justify-space-between"},Pe={class:"text-subtitle-1 text-center"},Ie={class:"text-center px-4"},Te={class:"text-h6 mb-2"},Be=X({__name:"dashboard",setup(a){le({title:"Dashboard - DevUnity",meta:[{name:"description",content:"Dashboard for DevUnity"},{name:"keywords",content:"DevUnity, dashboard, tools, snippets, SQL, Studio, Sitemaps"},{name:"author",content:"DevUnity"},{name:"robots",content:"index, follow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Dashboard - DevUnity"},{name:"og:description",content:"Dashboard for DevUnity"},{name:"og:image",content:"/logo/devunity-title.png"}]});const u=Z(),i=L(()=>u.systemData),f=L(()=>[...u.personalSnippets].sort((o,s)=>new Date(s.date||s.snippet_date).getTime()-new Date(o.date||o.snippet_date).getTime()).slice(0,5)),w=L(()=>[{icon:"mdi-code-tags",color:"primary",count:u.personalSnippets.length,title:"Snippets"},{icon:"mdi-database",color:"info",count:u.sqlSchemas.length,title:"SQL Schemas"},{icon:"mdi-palette",color:"purple",count:u.studioComponents.length,title:"Studio"},{icon:"mdi-sitemap",color:"warning",count:0,title:"Sitemaps"}]),p=o=>{if(!o)return"Date unknown";try{const s=new Date(o);if(isNaN(s.getTime()))return"Invalid date";const m=Math.abs(new Date().getTime()-s.getTime()),U=Math.ceil(m/(1e3*60*60*24));return U===1?"Yesterday":U<7?`${U} days ago`:s.toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}catch(s){return console.error("Error formatting date:",s),"Date error"}},x=o=>{switch(o.toLowerCase()){case"react":return"mdi-react";case"vue.js 3":return"mdi-vuejs";case"angular":return"mdi-angular";case"nest.js":return"mdi-nodejs";case"nuxt 3":return"mdi-nuxt";default:return"mdi-code-tags"}},k=o=>{switch(o.toLowerCase()){case"react":return"#61DAFB";case"vue.js 3":return"#42B883";case"angular":return"#DD0031";case"nest.js":return"#68A063";case"nuxt 3":return"#00DC82";default:return"#9E9E9E"}},V=M([{title:"SEO Audit",icon:"mdi-magnify",color:"primary",link:"/seo-audit",disabled:!u.user.isPremium},{title:"SQL Generator",icon:"mdi-database",color:"info",link:"/sql-generator",disabled:!u.user.isPremium},{title:"Robots.txt & Schema.org",icon:"mdi-robot",color:"success",link:"/robots",disabled:!u.user.isPremium},{title:"Accessibility",icon:"mdi-access-point",color:"warning",link:"/accessibility",disabled:!1},{title:"Responsive",icon:"mdi-responsive",color:"error",link:"/responsive",disabled:!1},{title:"Snippets",icon:"mdi-code-tags",color:"secondary",link:"/snippets",disabled:!1},{title:"Studio",icon:"mdi-palette",color:"purple",link:"/studio",disabled:!1},{title:"Sitemaps",icon:"mdi-sitemap",color:"grey",link:"/seo-audit",disabled:!u.user.isPremium}]),D=M([{title:"Optimize Your SEO",description:"Use the SEO audit tool to analyze and improve your website's search engine ranking.",icon:"mdi-magnify",color:"primary"},{title:"Create Reusable Snippets",description:"Save time by creating code snippets that you can reuse in your projects.",icon:"mdi-code-tags",color:"info"},{title:"Test Responsiveness",description:"Make sure your website displays correctly on all devices with the Responsive tool.",icon:"mdi-responsive",color:"error"},{title:"Improve Accessibility",description:"Make your website accessible to all users with the accessibility tool.",icon:"mdi-access-point",color:"warning"}]);q(async()=>{try{await u.loadData(),ee(async()=>{await u.getMonitoringData()},5e3)}catch(o){console.error("Error loading data:",o)}});const S=o=>o&&(o.date||o.snippet_date)?p(o.date||o.snippet_date):"Date unknown";return(o,s)=>(c(),v(te,null,{default:t(()=>[e(oe,{class:"ma-4"},{default:t(()=>[e(b,null,{default:t(()=>[(c(!0),C(P,null,I(w.value,(l,m)=>(c(),v(_,{key:m,cols:"12",md:"3"},{default:t(()=>[e(y,{class:"rounded-lg",elevation:"2",height:"100%"},{default:t(()=>[e(h,{class:"d-flex flex-column align-center justify-center"},{default:t(()=>[e(g,{size:"48",color:l.color,class:"mb-2"},{default:t(()=>[n(d(l.icon),1)]),_:2},1032,["color"]),r("div",ve,d(l.count),1),r("div",pe,d(l.title),1)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}),e(y,{class:"rounded-lg mt-6 mb-2",elevation:"2"},{default:t(()=>[e(T,{class:"bg-primary text-white py-3 px-4 rounded-t-lg"},{default:t(()=>[e(g,{color:"white",class:"mr-2"},{default:t(()=>s[0]||(s[0]=[n("mdi-chart-line")])),_:1}),s[1]||(s[1]=n(" System Performance "))]),_:1}),e(h,{class:"pa-4"},{default:t(()=>[e(b,null,{default:t(()=>[e(_,{cols:"12"},{default:t(()=>[r("div",ye,[s[2]||(s[2]=r("div",{class:"text-subtitle-1"},"CPU Usage",-1)),r("div",he,d(i.value.cpu.usage.toFixed(2))+"%",1)]),e(B,{"model-value":i.value.cpu.usage,color:"primary",height:"10",rounded:"",class:"mb-4"},null,8,["model-value"]),r("div",be,[s[3]||(s[3]=r("div",{class:"text-subtitle-1"},"Memory Usage",-1)),r("div",_e,d(Math.round(i.value.memory.used/i.value.memory.total*100))+"%",1)]),e(B,{"model-value":i.value.memory.used/i.value.memory.total*100,color:"info",height:"10",rounded:"",class:"mb-4"},null,8,["model-value"]),r("div",we,[s[4]||(s[4]=r("div",{class:"text-subtitle-1"},"Disk Space",-1)),i.value.disks&&i.value.disks.length>0?(c(),C("div",xe,d(Math.round(i.value.disks[0].use))+"% ",1)):E("",!0)]),i.value.disks&&i.value.disks.length>0?(c(),v(B,{key:0,"model-value":i.value.disks[0].use,color:"success",height:"10",rounded:"",class:"mb-4"},null,8,["model-value"])):E("",!0)]),_:1})]),_:1})]),_:1})]),_:1}),e(b,{class:"mt-4"},{default:t(()=>[e(_,{cols:"12"},{default:t(()=>[e(y,{class:"rounded-lg",elevation:"2"},{default:t(()=>[e(T,{class:"bg-primary text-white py-3 px-4 rounded-t-lg"},{default:t(()=>[e(g,{color:"white",class:"mr-2"},{default:t(()=>s[5]||(s[5]=[n("mdi-folder-multiple")])),_:1}),s[6]||(s[6]=n(" Recent Projects "))]),_:1}),e(h,{class:"pa-4"},{default:t(()=>[f.value.length>0?(c(),v(b,{key:0},{default:t(()=>[(c(!0),C(P,null,I(f.value,(l,m)=>(c(),v(_,{key:l.id,cols:"12",sm:"6",md:"4"},{default:t(()=>[e(y,{to:`/snippets?id=${l.id}`,class:"project-card",flat:"",hover:""},{default:t(()=>[e(h,{class:"pa-4"},{default:t(()=>[r("div",ke,[e(se,{color:k(l.framework),size:"36",class:"mr-3"},{default:t(()=>[e(g,{color:"white"},{default:t(()=>[n(d(x(l.framework)),1)]),_:2},1024)]),_:2},1032,["color"]),r("div",null,[r("div",Ve,d(l.title),1),r("div",De,d(S(l)),1)])]),r("p",Se,d(l.description||"No description available"),1),r("div",Ce,[e(ie,{size:"x-small",color:k(l.framework),class:"mr-2"},{default:t(()=>[n(d(l.framework),1)]),_:2},1032,["color"]),e(Q,{size:"small",variant:"text",color:"primary",to:`/snippets?id=${l.id}`},{default:t(()=>[s[8]||(s[8]=n(" View ")),e(g,{end:"",size:"small"},{default:t(()=>s[7]||(s[7]=[n("mdi-arrow-right")])),_:1})]),_:2},1032,["to"])])]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1})):(c(),v(re,{key:1,type:"info",variant:"tonal",class:"mb-0"},{default:t(()=>s[9]||(s[9]=[n(" You don't have any recent projects. Start by creating a new snippet! ")])),_:1}))]),_:1})]),_:1})]),_:1})]),_:1}),e(b,{class:"mt-4"},{default:t(()=>[e(_,{cols:"12"},{default:t(()=>[e(y,{class:"rounded-lg",elevation:"2"},{default:t(()=>[e(T,{class:"bg-primary text-white py-3 px-4 rounded-t-lg"},{default:t(()=>[e(g,{color:"white",class:"mr-2"},{default:t(()=>s[10]||(s[10]=[n("mdi-tools")])),_:1}),s[11]||(s[11]=n(" Quick Tools "))]),_:1}),e(h,{class:"pa-4"},{default:t(()=>[e(b,null,{default:t(()=>[(c(!0),C(P,null,I(V.value,(l,m)=>(c(),v(_,{key:m,cols:"6",md:"3"},{default:t(()=>[e(y,{disabled:l.disabled,to:l.link,class:"rounded-lg tool-card",flat:""},{default:t(()=>[e(h,{class:"d-flex flex-column align-center justify-center pa-4"},{default:t(()=>[e(g,{size:"36",color:l.color,class:"mb-2"},{default:t(()=>[n(d(l.icon),1)]),_:2},1032,["color"]),r("div",Pe,d(l.title),1)]),_:2},1024)]),_:2},1032,["disabled","to"])]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(b,{class:"mt-4"},{default:t(()=>[e(_,{cols:"12"},{default:t(()=>[e(y,{class:"rounded-lg",elevation:"2"},{default:t(()=>[e(T,{class:"bg-primary text-white py-3 px-4 rounded-t-lg"},{default:t(()=>[e(g,{color:"white",class:"mr-2"},{default:t(()=>s[12]||(s[12]=[n("mdi-lightbulb")])),_:1}),s[13]||(s[13]=n(" Tips and Tricks "))]),_:1}),e(h,{class:"pa-4"},{default:t(()=>[e(me,{"hide-delimiters":"",height:"200","show-arrows":"hover",cycle:"",interval:"10000"},{default:t(()=>[(c(!0),C(P,null,I(D.value,(l,m)=>(c(),v(ge,{key:m},{default:t(()=>[e(ue,{height:"100%",class:"d-flex align-center justify-center"},{default:t(()=>[r("div",Ie,[e(g,{size:"36",color:l.color,class:"mb-2"},{default:t(()=>[n(d(l.icon),1)]),_:2},1032,["color"]),r("h3",Te,d(l.title),1),r("p",null,d(l.description),1)])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}}),Re=ae(Be,[["__scopeId","data-v-8dcb631f"]]);export{Re as default};
