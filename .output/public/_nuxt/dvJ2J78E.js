import{m as y,p as x,A as T,b as a,aL as V,a3 as k,u as R,n as H,aI as D,s as E,aJ as w,v as $,aj as j,Y as A,y as h,al as F,C as J,aM as L,D as M,aO as O,aC as U,aB as u,$ as n,d3 as Y}from"./CaL5DcWf.js";const q=x({text:String,...k(),...V()},"VToolbarTitle"),z=y()({name:"VToolbarTitle",props:q(),setup(e,o){let{slots:t}=o;return T(()=>{const s=!!(t.default||t.text||e.text);return a(e.tag,{class:["v-toolbar-title",e.class],style:e.style},{default:()=>{var l;return[s&&a("div",{class:"v-toolbar-title__placeholder"},[t.text?t.text():e.text,(l=t.default)==null?void 0:l.call(t)])]}})}),{}}}),G=[null,"prominent","default","comfortable","compact"],K=x({absolute:Boolean,collapse:Boolean,color:String,density:{type:String,default:"default",validator:e=>G.includes(e)},extended:Boolean,extensionHeight:{type:[Number,String],default:48},flat:Boolean,floating:Boolean,height:{type:[Number,String],default:64},image:String,title:String,...O(),...k(),...M(),...L(),...V({tag:"header"}),...J()},"VToolbar"),W=y()({name:"VToolbar",props:K(),setup(e,o){var c;let{slots:t}=o;const{backgroundColorClasses:s,backgroundColorStyles:l}=R(H(e,"color")),{borderClasses:C}=D(e),{elevationClasses:_}=E(e),{roundedClasses:B}=w(e),{themeClasses:P}=$(e),{rtlClasses:S}=j(),i=A(!!(e.extended||(c=t.extension)!=null&&c.call(t))),d=h(()=>parseInt(Number(e.height)+(e.density==="prominent"?Number(e.height):0)-(e.density==="comfortable"?8:0)-(e.density==="compact"?16:0),10)),r=h(()=>i.value?parseInt(Number(e.extensionHeight)+(e.density==="prominent"?Number(e.extensionHeight):0)-(e.density==="comfortable"?4:0)-(e.density==="compact"?8:0),10):0);return F({VBtn:{variant:"text"}}),T(()=>{var g;const N=!!(e.title||t.title),I=!!(t.image||e.image),m=(g=t.extension)==null?void 0:g.call(t);return i.value=!!(e.extended||m),a(e.tag,{class:["v-toolbar",{"v-toolbar--absolute":e.absolute,"v-toolbar--collapse":e.collapse,"v-toolbar--flat":e.flat,"v-toolbar--floating":e.floating,[`v-toolbar--density-${e.density}`]:!0},s.value,C.value,_.value,B.value,P.value,S.value,e.class],style:[l.value,e.style]},{default:()=>[I&&a("div",{key:"image",class:"v-toolbar__image"},[t.image?a(u,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},t.image):a(U,{key:"image-img",cover:!0,src:e.image},null)]),a(u,{defaults:{VTabs:{height:n(d.value)}}},{default:()=>{var v,b,f;return[a("div",{class:"v-toolbar__content",style:{height:n(d.value)}},[t.prepend&&a("div",{class:"v-toolbar__prepend"},[(v=t.prepend)==null?void 0:v.call(t)]),N&&a(z,{key:"title",text:e.title},{text:t.title}),(b=t.default)==null?void 0:b.call(t),t.append&&a("div",{class:"v-toolbar__append"},[(f=t.append)==null?void 0:f.call(t)])])]}}),a(u,{defaults:{VTabs:{height:n(r.value)}}},{default:()=>[a(Y,null,{default:()=>[i.value&&a("div",{class:"v-toolbar__extension",style:{height:n(r.value)}},[m])]})]})]})}),{contentHeight:d,extensionHeight:r}}});export{W as V,z as a,K as b,q as m};
