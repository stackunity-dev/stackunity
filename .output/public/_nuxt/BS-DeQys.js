import{f as r,p as m,h as i,u as n,m as h,k as d,t as b}from"./BOmTdu30.js";import{an as v,S as f,ao as u}from"./CTpYCmOx.js";import{m as t}from"./CoKilWGJ.js";const c=m({fixedHeader:Boolean,fixedFooter:Boolean,height:[Number,String],hover:Boolean,...d(),...u(),...f(),...h()},"VTable"),y=r()({name:"VTable",props:c(),setup(e,o){let{slots:a,emit:g}=o;const{themeClasses:s}=i(e),{densityClasses:l}=v(e);return n(()=>t(e.tag,{class:["v-table",{"v-table--fixed-height":!!e.height,"v-table--fixed-header":e.fixedHeader,"v-table--fixed-footer":e.fixedFooter,"v-table--has-top":!!a.top,"v-table--has-bottom":!!a.bottom,"v-table--hover":e.hover},s.value,l.value,e.class],style:e.style},{default:()=>[a.top?.(),a.default?t("div",{class:"v-table__wrapper",style:{height:b(e.height)}},[t("table",null,[a.default()])]):a.wrapper?.(),a.bottom?.()]})),{}}});export{y as V,c as m};
