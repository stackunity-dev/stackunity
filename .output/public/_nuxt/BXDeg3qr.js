import{p as W}from"./D4DRiVAH.js";import{N as G,O as H,aK as O,ad as Y,ax as J,b7 as Q,b5 as q,S as X,J as Z,Y as ee,P as te,b as t,Q as ae,aP as le,bb as se,az as oe,e as ne,u as re,ae as ie,m as V,f as k,w as a,l as de,o as v,K as P,c as N,h as g,B as S,d as i,z as L,bH as ce,D as ue,g as U,F as M,a as l,i as T,t as b,r as me,aj as $,j as pe}from"./D7DrY462.js";import{u as fe}from"./ZBz0wOaK.js";import{V as be}from"./DQRz6qa3.js";import{V as ve}from"./McPLFUC7.js";import{V as w,a as m}from"./BqPcj89n.js";import{V as j}from"./BRQFzjjH.js";import{V as E}from"./D0R1KJJ6.js";const ge={actions:"button@2",article:"heading, paragraph",avatar:"avatar",button:"button",card:"image, heading","card-avatar":"image, list-item-avatar",chip:"chip","date-picker":"list-item, heading, divider, date-picker-options, date-picker-days, actions","date-picker-options":"text, avatar@2","date-picker-days":"avatar@28",divider:"divider",heading:"heading",image:"image","list-item":"text","list-item-avatar":"avatar, text","list-item-two-line":"sentences","list-item-avatar-two-line":"avatar, sentences","list-item-three-line":"paragraph","list-item-avatar-three-line":"avatar, paragraph",ossein:"ossein",paragraph:"text@3",sentences:"text@2",subtitle:"text",table:"table-heading, table-thead, table-tbody, table-tfoot","table-heading":"chip, text","table-thead":"heading@6","table-tbody":"table-row-divider@6","table-row-divider":"table-row, divider","table-row":"text@6","table-tfoot":"text@2, avatar@2",text:"text"};function ye(s){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return t("div",{class:["v-skeleton-loader__bone",`v-skeleton-loader__${s}`]},[c])}function F(s){const[c,n]=s.split("@");return Array.from({length:n}).map(()=>R(c))}function R(s){let c=[];if(!s)return c;const n=ge[s];if(s!==n){if(s.includes(","))return K(s);if(s.includes("@"))return F(s);n.includes(",")?c=K(n):n.includes("@")?c=F(n):n&&c.push(R(n))}return[ye(s,c)]}function K(s){return s.replace(/\s/g,"").split(",").map(R)}const xe=H({boilerplate:Boolean,color:String,loading:Boolean,loadingText:{type:String,default:"$vuetify.loading"},type:{type:[String,Array],default:"ossein"},...oe(),...se(),...le()},"VSkeletonLoader"),_e=G()({name:"VSkeletonLoader",props:xe(),setup(s,c){let{slots:n}=c;const{backgroundColorClasses:y,backgroundColorStyles:p}=O(Y(s,"color")),{dimensionStyles:x}=J(s),{elevationClasses:h}=Q(s),{themeClasses:d}=q(s),{t:I}=X(),z=Z(()=>R(ee(s.type).join(",")));return te(()=>{var B;const C=!n.default||s.loading,D=s.boilerplate||!C?{}:{ariaLive:"polite",ariaLabel:I(s.loadingText),role:"alert"};return t("div",ae({class:["v-skeleton-loader",{"v-skeleton-loader--boilerplate":s.boilerplate},d.value,y.value,h.value],style:[p.value,C?x.value:{}]},D),[C?z.value:(B=n.default)==null?void 0:B.call(n)])}),{}}}),ke={class:"text-h5 d-flex align-center mb-4"},we={class:"mb-2"},he=["href"],Ce={class:"font-weight-medium"},Ve={class:"text-subtitle-2"},Le={class:"text-h4 font-weight-bold mb-2"},Te={class:"d-flex align-center justify-center"},Be={class:"d-flex align-center justify-center"},Ae={class:"mt-4 text-center"},Se={class:"text-body-1"},Ee=ne({__name:"accessibility",setup(s){const c=re();fe({title:"Accessibility - DevUnity",meta:[{name:"description",content:"Accessibility tools for web developers"},{name:"keywords",content:"accessibility, web accessibility, web accessibility tools, accessibility testing, web accessibility testing, accessibility guidelines, web accessibility guidelines, accessibility best practices, web accessibility best practices"},{name:"author",content:"DevUnity"},{name:"robots",content:"index, follow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Accessibility - DevUnity"},{name:"og:description",content:"Accessibility tools for web developers"},{name:"og:image",content:"/logo/devunity-title.png"}]}),ie(()=>{console.log(c.token)});const n=V(""),y=V(!1),p=V(null),x=V("rgb(33, 33, 33)"),h=V("rgb(255, 255, 255)"),d=V(0),I=async()=>{const u=z(x.value),e=z(h.value);if(console.log(u,e),u&&e){const r=D(u,e);d.value=r,console.log(r)}};function z(u){const e=u.trim();if(e.toLowerCase().startsWith("rgb(")){const r=e.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);if(r)return{red:parseInt(r[1],10)/255,green:parseInt(r[2],10)/255,blue:parseInt(r[3],10)/255}}else{const r=e.split(/\s+/);if(r.length===3)return{red:parseInt(r[0],10)/255,green:parseInt(r[1],10)/255,blue:parseInt(r[2],10)/255}}return null}function C(u){const e=f=>f<=.03928?f/12.92:Math.pow((f+.055)/1.055,2.4),r=e(u.red),o=e(u.green),_=e(u.blue);return .2126*r+.7152*o+.0722*_}function D(u,e){const r=C(u),o=C(e),_=Math.max(r,o),f=Math.min(r,o);return(_+.05)/(f+.05)}const B=async()=>{y.value=!0,console.log(n.value);const u=await $fetch("/api/audit",{method:"POST",headers:{Authorization:`Bearer ${c.token}`},body:{url:n.value}});u?(p.value=u.data,console.log(p.value),y.value=!1):(console.error("Error retrieving audit data"),y.value=!1)};return(u,e)=>{const r=W;return v(),k(de,null,{default:a(()=>[t(be,null,{default:a(()=>[t(ve,null,{default:a(()=>[t(g,{class:"mb-8 pa-4 rounded-lg",elevation:"3"},{default:a(()=>[t(S,{class:"text-h6 pb-2"},{default:a(()=>e[3]||(e[3]=[i("Analyze a website")])),_:1}),t(L,null,{default:a(()=>[t(w,null,{default:a(()=>[t(m,{cols:"12",md:"9"},{default:a(()=>[t(j,{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=o=>n.value=o),label:"Website URL to analyze",placeholder:"https://example.com","prepend-inner-icon":"mdi-web",variant:"outlined",density:"comfortable",clearable:"",onKeyup:ce(B,["enter"])},null,8,["modelValue"])]),_:1}),t(m,{cols:"12",md:"3",class:"d-flex align-center"},{default:a(()=>[ue(c).user.isPremium?(v(),k(U,{key:0,onClick:B,color:"primary",block:"",loading:y.value,"prepend-icon":"mdi-magnify"},{default:a(()=>e[4]||(e[4]=[i(" Analyze ")])),_:1},8,["loading"])):(v(),k(r,{key:1,type:"button",title:"Analyze",icon:"mdi-magnify","feature-key":"audit"}))]),_:1})]),_:1})]),_:1})]),_:1}),y.value?(v(),k(_e,{key:0,type:"card, article, actions",class:"mb-6"})):P("",!0),p.value&&!y.value?(v(),N(M,{key:1},[t(g,{class:"mb-6 pa-4 rounded-lg",elevation:"3"},{default:a(()=>[t(w,null,{default:a(()=>[t(m,{cols:"12",md:"8"},{default:a(()=>{var o,_,f;return[l("h2",ke,[t(T,{size:"large",color:"primary",class:"mr-2"},{default:a(()=>e[5]||(e[5]=[i("mdi-web")])),_:1}),i(" "+b(((o=p.value.statistics)==null?void 0:o.pagetitle)||"Analyzed Site"),1)]),l("p",we,[e[7]||(e[7]=l("strong",null,"URL: ",-1)),l("a",{href:(_=p.value.statistics)==null?void 0:_.pageurl,target:"_blank",class:"text-decoration-none text-primary"},[i(b((f=p.value.statistics)==null?void 0:f.pageurl)+" ",1),t(T,{size:"small"},{default:a(()=>e[6]||(e[6]=[i("mdi-open-in-new")])),_:1})],8,he)]),t(E,{class:"mr-2 mb-2",color:"success",size:"small"},{default:a(()=>{var A;return[i(" Analysis in "+b((A=p.value.statistics)==null?void 0:A.time)+"s ",1)]}),_:1}),t(E,{class:"mb-2",color:"info",size:"small"},{default:a(()=>{var A;return[i(b((A=p.value.statistics)==null?void 0:A.totalelements)+" elements analyzed ",1)]}),_:1})]}),_:1}),t(m,{cols:"12",md:"4",class:"d-flex align-center justify-center"},{default:a(()=>{var o;return[t(U,{variant:"elevated",color:"primary",href:(o=p.value.statistics)==null?void 0:o.waveurl,target:"_blank","prepend-icon":"mdi-link-variant","append-icon":"mdi-open-in-new",class:"px-4"},{default:a(()=>e[8]||(e[8]=[i(" View complete WAVE report ")])),_:1},8,["href"])]}),_:1})]),_:1})]),_:1}),t(g,{class:"mb-8 rounded-lg",elevation:"3"},{default:a(()=>[t(S,{class:"text-h6 pa-4 bg-primary text-white"},{default:a(()=>e[9]||(e[9]=[i(" Analysis Results ")])),_:1}),t(L,{class:"pa-4"},{default:a(()=>[t(w,null,{default:a(()=>[(v(!0),N(M,null,me(p.value.categories,(o,_)=>(v(),k(m,{key:_,cols:"12",sm:"6",md:"4"},{default:a(()=>[t(g,{class:"h-100",variant:"outlined",color:o.description.toLowerCase().includes("error")?"error":["feature","elements","aria"].some(f=>o.description.toLowerCase().includes(f))?"success":"warning"},{default:a(()=>[t(L,{class:"d-flex align-center"},{default:a(()=>[t(T,{color:o.description.toLowerCase().includes("error")?"error":["feature","elements","aria"].some(f=>o.description.toLowerCase().includes(f))?"success":"warning",class:"mr-2"},{default:a(()=>[i(b(o.description.toLowerCase().includes("error")?"mdi-alert-circle":"mdi-check-circle"),1)]),_:2},1032,["color"]),l("div",null,[l("div",Ce,b(o.description),1),l("div",Ve,b(o.count)+" elements",1)])]),_:2},1024)]),_:2},1032,["color"])]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})],64)):P("",!0),t(g,{class:"mb-8 rounded-lg",elevation:"3"},{default:a(()=>[t(S,{class:"text-h6 pa-4 bg-secondary text-white"},{default:a(()=>[t(T,{size:"large",class:"mr-2"},{default:a(()=>e[10]||(e[10]=[i("mdi-contrast-circle")])),_:1}),e[11]||(e[11]=i(" Contrast Checker "))]),_:1}),t(L,{class:"pa-4"},{default:a(()=>[t(w,null,{default:a(()=>[t(m,{cols:"12",md:"6"},{default:a(()=>[t(w,null,{default:a(()=>[t(m,{cols:"12",md:"6"},{default:a(()=>[t(j,{modelValue:x.value,"onUpdate:modelValue":e[1]||(e[1]=o=>x.value=o),label:"Text color",placeholder:"rgb(0, 0, 0)",variant:"outlined",density:"comfortable","prepend-inner-icon":"mdi-format-color-text"},null,8,["modelValue"])]),_:1}),t(m,{cols:"12",md:"6"},{default:a(()=>[t(j,{modelValue:h.value,"onUpdate:modelValue":e[2]||(e[2]=o=>h.value=o),label:"Background color",placeholder:"rgb(255, 255, 255)",variant:"outlined",density:"comfortable","prepend-inner-icon":"mdi-format-color-fill"},null,8,["modelValue"])]),_:1}),t(m,{cols:"12",class:"d-flex justify-center"},{default:a(()=>[t(U,{onClick:I,color:"primary","prepend-icon":"mdi-calculator",class:"mb-4"},{default:a(()=>e[12]||(e[12]=[i(" Calculate contrast ")])),_:1})]),_:1})]),_:1})]),_:1}),t(m,{cols:"12",md:"6"},{default:a(()=>[t(g,{color:h.value,class:"pa-4 rounded-lg h-100",elevation:"1"},{default:a(()=>[t(S,{style:$(`color: ${x.value}`),class:"text-center"},{default:a(()=>e[13]||(e[13]=[i(" Contrast Preview ")])),_:1},8,["style"]),t(L,{style:$(`color: ${x.value}`),class:"text-center"},{default:a(()=>[e[15]||(e[15]=l("div",{class:"mb-4"},[l("p",{class:"text-body-1 mb-2"},"Normal Text (16px)"),l("p",{class:"text-body-1"},"Lorem ipsum dolor sit amet, consectetur adipiscing elit.")],-1)),e[16]||(e[16]=l("div",{class:"mb-4"},[l("p",{class:"text-body-1 mb-2"},"Large Text (18px+)"),l("p",{class:"text-h6"},"Lorem ipsum dolor sit amet")],-1)),e[17]||(e[17]=l("div",{class:"mb-4"},[l("p",{class:"text-body-1 mb-2"},"Bold Text"),l("p",{class:"text-body-1 font-weight-bold"},"Lorem ipsum dolor sit amet")],-1)),e[18]||(e[18]=l("div",{class:"mb-4"},[l("p",{class:"text-body-1 mb-2"},"Italic Text"),l("p",{class:"text-body-1 font-italic"},"Lorem ipsum dolor sit amet")],-1)),l("div",null,[e[14]||(e[14]=l("p",{class:"text-body-1 mb-2"},"Link Example",-1)),l("a",{style:$(`color: ${x.value}`),href:"#",class:"text-decoration-underline"},"Lorem ipsum dolor",4)])]),_:1},8,["style"])]),_:1},8,["color"])]),_:1})]),_:1}),d.value>0?(v(),k(pe,{key:0,class:"my-4"})):P("",!0),d.value>0?(v(),k(w,{key:1},{default:a(()=>[t(m,{cols:"12",md:"6",class:"mx-auto"},{default:a(()=>[t(g,{class:"pa-4 rounded-lg",elevation:"3"},{default:a(()=>[t(S,{class:"text-center"},{default:a(()=>[l("div",Le,"Contrast Ratio: "+b(Math.round(d.value*100)/100)+":1 ",1),t(E,{color:d.value<4.5?"error":d.value<7?"warning":"success",class:"mb-2"},{default:a(()=>[i(b(d.value<4.5?"Insufficient Contrast":d.value<7?"Acceptable Contrast":"Excellent Contrast"),1)]),_:1},8,["color"])]),_:1}),t(L,null,{default:a(()=>[t(w,null,{default:a(()=>[t(m,{cols:"6"},{default:a(()=>[t(g,{variant:"outlined",color:d.value<4.5?"error":"success",class:"pa-2"},{default:a(()=>[l("div",Te,[t(T,{color:d.value<4.5?"error":"success",class:"mr-2"},{default:a(()=>[i(b(d.value<4.5?"mdi-close-circle":"mdi-check-circle"),1)]),_:1},8,["color"]),e[19]||(e[19]=l("span",null,"Normal Text (min. 4.5:1)",-1))])]),_:1},8,["color"])]),_:1}),t(m,{cols:"6"},{default:a(()=>[t(g,{variant:"outlined",color:d.value<3?"error":"success",class:"pa-2"},{default:a(()=>[l("div",Be,[t(T,{color:d.value<3?"error":"success",class:"mr-2"},{default:a(()=>[i(b(d.value<3?"mdi-close-circle":"mdi-check-circle"),1)]),_:1},8,["color"]),e[20]||(e[20]=l("span",null,"Large Text (min. 3:1)",-1))])]),_:1},8,["color"])]),_:1})]),_:1}),l("div",Ae,[l("p",Se,b(d.value<4.5?"The contrast is insufficient for good readability. Try more contrasting colors.":"Congratulations! Your colors meet contrast standards for an accessible site."),1)])]),_:1})]),_:1})]),_:1})]),_:1})):P("",!0)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}});export{Ee as default};
