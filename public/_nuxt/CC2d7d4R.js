import{_ as C}from"./B71tdAEm.js";import{e as D,G as U,I as l,c as d,b as s,w as n,au as k,o as u,a,F as S,r as A,ap as P,i as I,d as m,t as c,h as L,av as N,g as B,aw as E,_ as F}from"./CaL5DcWf.js";import{_ as y}from"./ByseejjK.js";import{u as j}from"./61L_5zm4.js";import{V as q}from"./hc3dmJ37.js";import{V as z,a as h}from"./D9cfhuwM.js";import{V as T}from"./BWlrflAk.js";import{V as p}from"./DN7PZOHx.js";const G={class:"auth-screen"},M={class:"left-content text-center"},Q={class:"features-list"},R={class:"text-left"},H={class:"text-body-1 font-weight-medium text-white mb-1"},J={class:"text-body-2 text-white-darken-2"},O={class:"text-center mt-8"},K=D({__name:"signup",setup(W){j({title:"Create Account - DevUnity",meta:[{name:"author",content:"Nûr"},{name:"description",content:"Create your DevUnity account to access all features"},{name:"robots",content:"index,follow"},{name:"viewport",content:"width=device-width, initial-scale=1.0"},{name:"og:title",content:"Create Account - DevUnity"},{name:"og:description",content:"Create your DevUnity account to access all features"},{name:"og:image",content:"/logo/devunity-title.png"}],link:[{rel:"canonical",href:"https://devunity.com/signup"}]});const w=k(),x=U(),i=l({username:"",email:"",password:""}),f=l([{icon:"mdi-email-newsletter",title:"Professional Templates",description:"A studio with customized Vuetify component templates",color:"primary"},{icon:"mdi-chart-box-outline",title:"Detailed Analytics",description:"Accessibility and SEO audit, test all aspects of your site",color:"secondary"},{icon:"mdi-account-group-outline",title:"Monitoring and SQL Generator",description:"Site monitoring and a ready-to-use SQL generator",color:"tertiary"},{icon:"mdi-shield-check-outline",title:"Clean Interface",description:"A simple and intuitive interface for easier use",color:"primary"}]),r=l(!1),o=l(!1),b=async()=>{r.value=!0;try{await x.signUp(i.value.username,i.value.email,i.value.password),w.push("/dashboard")}catch(v){console.error(v.message)}finally{r.value=!1}},V=()=>{o.value=!o.value};return(v,e)=>{const _=C;return u(),d("section",G,[s(q,{fluid:"",class:"fill-height pa-0"},{default:n(()=>[s(z,{class:"fill-height ma-0"},{default:n(()=>[s(h,{cols:"12",md:"6",class:"d-none d-md-flex left-panel-signup align-center justify-center"},{default:n(()=>[a("div",M,[e[3]||(e[3]=a("h1",null,[a("img",{src:y,alt:"Devunity - Develop faster and better with DevUnity",class:"logo mb-8",width:"350"}),a("span",{class:"sr-only"},"Devunity - Develop faster and better with DevUnity")],-1)),a("div",Q,[(u(!0),d(S,null,A(f.value,(t,g)=>(u(),d("div",{key:g,class:P(["feature-item d-flex align-center",{"mb-6":g!==f.value.length-1}])},[s(I,{color:"primary",size:"x-large",class:"mr-3"},{default:n(()=>[m(c(t.icon),1)]),_:2},1024),a("div",R,[a("p",H,c(t.title),1),a("p",J,c(t.description),1)])],2))),128))])])]),_:1}),s(h,{cols:"12",md:"6",class:"right-panel-signup d-flex align-center justify-center"},{default:n(()=>[s(L,{class:"signup-card pa-8 elevation-0","max-width":"450",width:"100%"},{default:n(()=>[e[7]||(e[7]=a("div",{class:"d-flex justify-center d-md-none mb-8"},[a("img",{src:y,alt:"Devunity Logo",width:"350"})],-1)),e[8]||(e[8]=a("h2",{class:"text-h5 font-weight-bold mb-2"},"Create an account",-1)),e[9]||(e[9]=a("p",{class:"text-subtitle-1 text-medium-emphasis mb-8"},"Join Devunity and start your experience",-1)),s(T,{onSubmit:N(b,["prevent"])},{default:n(()=>[s(p,{modelValue:i.value.username,"onUpdate:modelValue":e[0]||(e[0]=t=>i.value.username=t),label:"Username",type:"text",variant:"outlined","prepend-inner-icon":"mdi-account-outline",class:"mb-4",rules:[t=>!!t||"Username required"],"hide-details":"auto"},null,8,["modelValue","rules"]),s(p,{modelValue:i.value.email,"onUpdate:modelValue":e[1]||(e[1]=t=>i.value.email=t),label:"Email address",type:"email",variant:"outlined","prepend-inner-icon":"mdi-email-outline",class:"mb-4",rules:[t=>!!t||"Email required",t=>/.+@.+\..+/.test(t)||"Invalid email format"],"hide-details":"auto"},null,8,["modelValue","rules"]),s(p,{modelValue:i.value.password,"onUpdate:modelValue":e[2]||(e[2]=t=>i.value.password=t),type:o.value?"text":"password",label:"Password",variant:"outlined","prepend-inner-icon":"mdi-lock-outline","append-inner-icon":o.value?"mdi-eye":"mdi-eye-off","onClick:appendInner":V,class:"mb-6",rules:[t=>!!t||"Password required",t=>t.length>=8||"Password must contain at least 8 characters"],"hide-details":"auto"},null,8,["modelValue","type","append-inner-icon","rules"]),s(B,{block:"",color:"primary",type:"submit",loading:r.value,"min-height":"48",class:"text-none font-weight-medium"},{loader:n(()=>[s(E,{indeterminate:""})]),default:n(()=>[e[4]||(e[4]=m(" Create account "))]),_:1},8,["loading"]),a("div",O,[e[6]||(e[6]=a("span",{class:"text-medium-emphasis"},"Already have an account?",-1)),s(_,{class:"text-decoration-none ml-1 font-weight-medium",to:"/login"},{default:n(()=>e[5]||(e[5]=[m(" Sign in ")])),_:1})])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])}}}),ne=F(K,[["__scopeId","data-v-ed49b4dd"]]);export{ne as default};
