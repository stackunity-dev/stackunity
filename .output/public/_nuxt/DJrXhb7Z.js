import{F as a,G as f}from"./CTpYCmOx.js";import{f as I,p as V,o as c,u as v,ad as k,I as x}from"./BOmTdu30.js";import{c as l,m as h,n as b}from"./CoKilWGJ.js";const C=V({indeterminate:Boolean,indeterminateIcon:{type:x,default:"$checkboxIndeterminate"},...f({falseIcon:"$checkboxOff",trueIcon:"$checkboxOn"})},"VCheckboxBtn"),B=I()({name:"VCheckboxBtn",props:C(),emits:{"update:modelValue":e=>!0,"update:indeterminate":e=>!0},setup(e,r){let{slots:u}=r;const t=c(e,"indeterminate"),n=c(e,"modelValue");function s(o){t.value&&(t.value=!1)}const m=l(()=>t.value?e.indeterminateIcon:e.falseIcon),i=l(()=>t.value?e.indeterminateIcon:e.trueIcon);return v(()=>{const o=k(a.filterProps(e),["modelValue"]);return h(a,b(o,{modelValue:n.value,"onUpdate:modelValue":[d=>n.value=d,s],class:["v-checkbox-btn",e.class],style:e.style,type:"checkbox",falseIcon:m.value,trueIcon:i.value,"aria-checked":t.value?"mixed":void 0}),u)}),{}}});export{B as V,C as m};
