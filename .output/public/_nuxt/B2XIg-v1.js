import{V as de,m as Ce}from"./B2zV2hO7.js";import{c as C,d as H,f as xe,s as L,q as Ie,y as Ee,A as ce,w as B,n as O,m as f,p as De,F as W,a as fe,o as Ve,G as Re,x as Fe,a8 as Le}from"./CoKilWGJ.js";import{aB as Oe,aQ as ve,aC as me,y as be,aD as Be,aR as ke,A as Se,M as Me,N as He,v as Ue,x as _e,z as qe,aS as Ke,c as pe,g as ze,h as he,e as Ne}from"./CTpYCmOx.js";import{f as te,p as N,o as ie,A as $e,n as je,a6 as ge,u as le,ad as Pe,ae as oe,aS as We,D as Y,aT as Ye,z as Te,k as Ae,a3 as Ge,aU as Qe,C as se,F as Xe,l as Je,Y as Ze,a5 as et,t as ee,af as tt,w as lt,q as ue,an as ye,a0 as we,I as nt,ap as at}from"./BOmTdu30.js";import{V as ot}from"./DJrXhb7Z.js";import{V as st}from"./BJLcRbSt.js";const ut=N({id:String,submenu:Boolean,...Pe(Be({closeDelay:250,closeOnContentClick:!0,locationStrategy:"connected",location:void 0,openDelay:300,scrim:!1,scrollStrategy:"reposition",transition:{component:ke}}),["absolute"])},"VMenu"),rt=te()({name:"VMenu",props:ut(),emits:{"update:modelValue":e=>!0},setup(e,v){let{slots:s}=v;const o=ie(e,"modelValue"),{scopeId:i}=Oe(),{isRtl:m}=$e(),p=je(),r=C(()=>e.id||`v-menu-${p}`),l=H(),h=xe(ve,null),k=L(new Set);De(ve,{register(){k.value.add(p)},unregister(){k.value.delete(p)},closeParents(t){setTimeout(()=>{!k.value.size&&!e.persistent&&(t==null||l.value?.contentEl&&!Ye(t,l.value.contentEl))&&(o.value=!1,h?.closeParents())},40)}}),Ie(()=>{h?.unregister(),document.removeEventListener("focusin",S)}),Ee(()=>o.value=!1);async function S(t){const d=t.relatedTarget,b=t.target;await ce(),o.value&&d!==b&&l.value?.contentEl&&l.value?.globalTop&&![document,l.value.contentEl].includes(b)&&!l.value.contentEl.contains(b)&&ge(l.value.contentEl)[0]?.focus()}B(o,t=>{t?(h?.register(),Y&&document.addEventListener("focusin",S,{once:!0})):(h?.unregister(),Y&&document.removeEventListener("focusin",S))},{immediate:!0});function c(t){h?.closeParents(t)}function x(t){if(!e.disabled)if(t.key==="Tab"||t.key==="Enter"&&!e.closeOnContentClick){if(t.key==="Enter"&&(t.target instanceof HTMLTextAreaElement||t.target instanceof HTMLInputElement&&t.target.closest("form")))return;t.key==="Enter"&&t.preventDefault(),We(ge(l.value?.contentEl,!1),t.shiftKey?"prev":"next",b=>b.tabIndex>=0)||(o.value=!1,l.value?.activatorEl?.focus())}else e.submenu&&t.key===(m.value?"ArrowRight":"ArrowLeft")&&(o.value=!1,l.value?.activatorEl?.focus())}function D(t){if(e.disabled)return;const d=l.value?.contentEl;d&&o.value?t.key==="ArrowDown"?(t.preventDefault(),t.stopImmediatePropagation(),oe(d,"next")):t.key==="ArrowUp"?(t.preventDefault(),t.stopImmediatePropagation(),oe(d,"prev")):e.submenu&&(t.key===(m.value?"ArrowRight":"ArrowLeft")?o.value=!1:t.key===(m.value?"ArrowLeft":"ArrowRight")&&(t.preventDefault(),oe(d,"first"))):(e.submenu?t.key===(m.value?"ArrowLeft":"ArrowRight"):["ArrowDown","ArrowUp"].includes(t.key))&&(o.value=!0,t.preventDefault(),setTimeout(()=>setTimeout(()=>D(t))))}const P=C(()=>O({"aria-haspopup":"menu","aria-expanded":String(o.value),"aria-controls":r.value,onKeydown:D},e.activatorProps));return le(()=>{const t=me.filterProps(e);return f(me,O({ref:l,id:r.value,class:["v-menu",e.class],style:e.style},t,{modelValue:o.value,"onUpdate:modelValue":d=>o.value=d,absolute:!0,activatorProps:P.value,location:e.location??(e.submenu?"end":"bottom"),"onClick:outside":c,onKeydown:x},i),{activator:s.activator,default:function(){for(var d=arguments.length,b=new Array(d),R=0;R<d;R++)b[R]=arguments[R];return f(Se,{root:"VMenu"},{default:()=>[s.default?.(...b)]})}})}),be({id:r,ΨopenChildren:k},l)}}),it=N({renderless:Boolean,...Ae()},"VVirtualScrollItem"),ct=te()({name:"VVirtualScrollItem",inheritAttrs:!1,props:it(),emits:{"update:height":e=>!0},setup(e,v){let{attrs:s,emit:o,slots:i}=v;const{resizeRef:m,contentRect:p}=Te(void 0,"border");B(()=>p.value?.height,r=>{r!=null&&o("update:height",r)}),le(()=>e.renderless?f(W,null,[i.default?.({itemRef:m})]):f("div",O({ref:m,class:["v-virtual-scroll__item",e.class],style:e.style},s),[i.default?.()]))}}),dt=-1,ft=1,re=100,vt=N({itemHeight:{type:[Number,String],default:null},height:[Number,String]},"virtual");function mt(e,v){const s=Ge(),o=L(0);fe(()=>{o.value=parseFloat(e.itemHeight||0)});const i=L(0),m=L(Math.ceil((parseInt(e.height)||s.height.value)/(o.value||16))||1),p=L(0),r=L(0),l=H(),h=H();let k=0;const{resizeRef:S,contentRect:c}=Te();fe(()=>{S.value=l.value});const x=C(()=>l.value===document.documentElement?s.height.value:c.value?.height||parseInt(e.height)||0),D=C(()=>!!(l.value&&h.value&&x.value&&o.value));let P=Array.from({length:v.value.length}),t=Array.from({length:v.value.length});const d=L(0);let b=-1;function R(n){return P[n]||o.value}const I=Qe(()=>{const n=performance.now();t[0]=0;const u=v.value.length;for(let V=1;V<=u-1;V++)t[V]=(t[V-1]||0)+R(V-1);d.value=Math.max(d.value,performance.now()-n)},d),G=B(D,n=>{n&&(G(),k=h.value.offsetTop,I.immediate(),F(),~b&&ce(()=>{Y&&window.requestAnimationFrame(()=>{Z(b),b=-1})}))});Ve(()=>{I.clear()});function ne(n,u){const V=P[n],w=o.value;o.value=w?Math.min(o.value,u):u,(V!==u||w!==o.value)&&(P[n]=u,I())}function T(n){return n=se(n,0,v.value.length-1),t[n]||0}function Q(n){return pt(t,n)}let U=0,M=0,$=0;B(x,(n,u)=>{u&&(F(),n<u&&requestAnimationFrame(()=>{M=0,F()}))});let _=-1;function q(){if(!l.value||!h.value)return;const n=l.value.scrollTop,u=performance.now();u-$>500?(M=Math.sign(n-U),k=h.value.offsetTop):M=n-U,U=n,$=u,window.clearTimeout(_),_=window.setTimeout(X,500),F()}function X(){!l.value||!h.value||(M=0,$=0,window.clearTimeout(_),F())}let J=-1;function F(){cancelAnimationFrame(J),J=requestAnimationFrame(ae)}function ae(){if(!l.value||!x.value)return;const n=U-k,u=Math.sign(M),V=Math.max(0,n-re),w=se(Q(V),0,v.value.length),g=n+x.value+re,y=se(Q(g)+1,w+1,v.value.length);if((u!==dt||w<i.value)&&(u!==ft||y>m.value)){const E=T(i.value)-T(w),K=T(y)-T(m.value);Math.max(E,K)>re?(i.value=w,m.value=y):(w<=0&&(i.value=w),y>=v.value.length&&(m.value=y))}p.value=T(i.value),r.value=T(v.value.length)-T(m.value)}function Z(n){const u=T(n);!l.value||n&&!u?b=n:l.value.scrollTop=u}const a=C(()=>v.value.slice(i.value,m.value).map((n,u)=>({raw:n,index:u+i.value,key:Xe(n)&&"value"in n?n.value:u+i.value})));return B(v,()=>{P=Array.from({length:v.value.length}),t=Array.from({length:v.value.length}),I.immediate(),F()},{deep:!0}),{calculateVisibleItems:F,containerRef:l,markerRef:h,computedItems:a,paddingTop:p,paddingBottom:r,scrollToIndex:Z,handleScroll:q,handleScrollend:X,handleItemResize:ne}}function pt(e,v){let s=e.length-1,o=0,i=0,m=null,p=-1;if(e[s]<v)return s;for(;o<=s;)if(i=o+s>>1,m=e[i],m>v)s=i-1;else if(m<v)p=i,o=i+1;else return m===v?i:o;return p}const ht=N({items:{type:Array,default:()=>[]},renderless:Boolean,...vt(),...Ae(),...He()},"VVirtualScroll"),gt=te()({name:"VVirtualScroll",props:ht(),setup(e,v){let{slots:s}=v;const o=Je("VVirtualScroll"),{dimensionStyles:i}=Me(e),{calculateVisibleItems:m,containerRef:p,markerRef:r,handleScroll:l,handleScrollend:h,handleItemResize:k,scrollToIndex:S,paddingTop:c,paddingBottom:x,computedItems:D}=mt(e,Re(e,"items"));return Ze(()=>e.renderless,()=>{function P(){const d=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1)?"addEventListener":"removeEventListener";p.value===document.documentElement?(document[d]("scroll",l,{passive:!0}),document[d]("scrollend",h)):(p.value?.[d]("scroll",l,{passive:!0}),p.value?.[d]("scrollend",h))}Fe(()=>{p.value=et(o.vnode.el,!0),P(!0)}),Ve(P)}),le(()=>{const P=D.value.map(t=>f(ct,{key:t.key,renderless:e.renderless,"onUpdate:height":d=>k(t.index,d)},{default:d=>s.default?.({item:t.raw,index:t.index,...d})}));return e.renderless?f(W,null,[f("div",{ref:r,class:"v-virtual-scroll__spacer",style:{paddingTop:ee(c.value)}},null),P,f("div",{class:"v-virtual-scroll__spacer",style:{paddingBottom:ee(x.value)}},null)]):f("div",{ref:p,class:["v-virtual-scroll",e.class],onScrollPassive:l,onScrollend:h,style:[i.value,e.style]},[f("div",{ref:r,class:"v-virtual-scroll__container",style:{paddingTop:ee(c.value),paddingBottom:ee(x.value)}},[P])])}),{calculateVisibleItems:m,scrollToIndex:S}}});function yt(e,v){const s=L(!1);let o;function i(r){cancelAnimationFrame(o),s.value=!0,o=requestAnimationFrame(()=>{o=requestAnimationFrame(()=>{s.value=!1})})}async function m(){await new Promise(r=>requestAnimationFrame(r)),await new Promise(r=>requestAnimationFrame(r)),await new Promise(r=>requestAnimationFrame(r)),await new Promise(r=>{if(s.value){const l=B(s,()=>{l(),r()})}else r()})}async function p(r){if(r.key==="Tab"&&v.value?.focus(),!["PageDown","PageUp","Home","End"].includes(r.key))return;const l=e.value?.$el;if(!l)return;(r.key==="Home"||r.key==="End")&&l.scrollTo({top:r.key==="Home"?0:l.scrollHeight,behavior:"smooth"}),await m();const h=l.querySelectorAll(":scope > :not(.v-virtual-scroll__spacer)");if(r.key==="PageDown"||r.key==="Home"){const k=l.getBoundingClientRect().top;for(const S of h)if(S.getBoundingClientRect().top>=k){S.focus();break}}else{const k=l.getBoundingClientRect().bottom;for(const S of[...h].reverse())if(S.getBoundingClientRect().bottom<=k){S.focus();break}}}return{onScrollPassive:i,onKeydown:p}}const wt=N({chips:Boolean,closableChips:Boolean,closeText:{type:String,default:"$vuetify.close"},openText:{type:String,default:"$vuetify.open"},eager:Boolean,hideNoData:Boolean,hideSelected:Boolean,listProps:{type:Object},menu:Boolean,menuIcon:{type:nt,default:"$dropdown"},menuProps:{type:Object},multiple:Boolean,noDataText:{type:String,default:"$vuetify.noDataText"},openOnClear:Boolean,itemColor:String,...Ke({itemChildren:!1})},"Select"),Vt=N({...wt(),...Pe(Ce({modelValue:null,role:"combobox"}),["validationValue","dirty","appendInnerIcon"]),...qe({transition:{component:ke}})},"VSelect"),Ct=te()({name:"VSelect",props:Vt(),emits:{"update:focused":e=>!0,"update:modelValue":e=>!0,"update:menu":e=>!0},setup(e,v){let{slots:s}=v;const{t:o}=tt(),i=H(),m=H(),p=H(),r=ie(e,"menu"),l=C({get:()=>r.value,set:a=>{r.value&&!a&&m.value?.ΨopenChildren.size||(r.value=a)}}),{items:h,transformIn:k,transformOut:S}=Ue(e),c=ie(e,"modelValue",[],a=>k(a===null?[null]:lt(a)),a=>{const n=S(a);return e.multiple?n:n[0]??null}),x=C(()=>typeof e.counterValue=="function"?e.counterValue(c.value):typeof e.counterValue=="number"?e.counterValue:c.value.length),D=_e(e),P=C(()=>c.value.map(a=>a.value)),t=L(!1),d=C(()=>l.value?e.closeText:e.openText);let b="",R;const I=C(()=>e.hideSelected?h.value.filter(a=>!c.value.some(n=>(e.valueComparator||ue)(n,a))):h.value),G=C(()=>e.hideNoData&&!I.value.length||D.isReadonly.value||D.isDisabled.value),ne=C(()=>({...e.menuProps,activatorProps:{...e.menuProps?.activatorProps||{},"aria-haspopup":"listbox"}})),T=H(),Q=yt(T,i);function U(a){e.openOnClear&&(l.value=!0)}function M(){G.value||(l.value=!l.value)}function $(a){ye(a)&&_(a)}function _(a){if(!a.key||D.isReadonly.value)return;["Enter"," ","ArrowDown","ArrowUp","Home","End"].includes(a.key)&&a.preventDefault(),["Enter","ArrowDown"," "].includes(a.key)&&(l.value=!0),["Escape","Tab"].includes(a.key)&&(l.value=!1),a.key==="Home"?T.value?.focus("first"):a.key==="End"&&T.value?.focus("last");const n=1e3;if(!ye(a))return;const u=performance.now();u-R>n&&(b=""),b+=a.key.toLowerCase(),R=u;const V=h.value.find(w=>w.title.toLowerCase().startsWith(b));if(V!==void 0){c.value=[V];const w=I.value.indexOf(V);Y&&window.requestAnimationFrame(()=>{w>=0&&p.value?.scrollToIndex(w)})}}function q(a){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;if(!a.props.disabled)if(e.multiple){const u=c.value.findIndex(w=>(e.valueComparator||ue)(w.value,a.value)),V=n??!~u;if(~u){const w=V?[...c.value,a]:[...c.value];w.splice(u,1),c.value=w}else V&&(c.value=[...c.value,a])}else{const u=n!==!1;c.value=u?[a]:[],ce(()=>{l.value=!1})}}function X(a){T.value?.$el.contains(a.relatedTarget)||(l.value=!1)}function J(){e.eager&&p.value?.calculateVisibleItems()}function F(){t.value&&i.value?.focus()}function ae(a){t.value=!0}function Z(a){if(a==null)c.value=[];else if(we(i.value,":autofill")||we(i.value,":-webkit-autofill")){const n=h.value.find(u=>u.title===a);n&&q(n)}else i.value&&(i.value.value="")}return B(l,()=>{if(!e.hideSelected&&l.value&&c.value.length){const a=I.value.findIndex(n=>c.value.some(u=>(e.valueComparator||ue)(u.value,n.value)));Y&&window.requestAnimationFrame(()=>{a>=0&&p.value?.scrollToIndex(a)})}}),B(()=>e.items,(a,n)=>{l.value||t.value&&!n.length&&a.length&&(l.value=!0)}),le(()=>{const a=!!(e.chips||s.chip),n=!!(!e.hideNoData||I.value.length||s["prepend-item"]||s["append-item"]||s["no-data"]),u=c.value.length>0,V=de.filterProps(e),w=u||!t.value&&e.label&&!e.persistentPlaceholder?void 0:e.placeholder;return f(de,O({ref:i},V,{modelValue:c.value.map(g=>g.props.value).join(", "),"onUpdate:modelValue":Z,focused:t.value,"onUpdate:focused":g=>t.value=g,validationValue:c.externalValue,counterValue:x.value,dirty:u,class:["v-select",{"v-select--active-menu":l.value,"v-select--chips":!!e.chips,[`v-select--${e.multiple?"multiple":"single"}`]:!0,"v-select--selected":c.value.length,"v-select--selection-slot":!!s.selection},e.class],style:e.style,inputmode:"none",placeholder:w,"onClick:clear":U,"onMousedown:control":M,onBlur:X,onKeydown:_,"aria-label":o(d.value),title:o(d.value)}),{...s,default:()=>f(W,null,[f(rt,O({ref:m,modelValue:l.value,"onUpdate:modelValue":g=>l.value=g,activator:"parent",contentClass:"v-select__content",disabled:G.value,eager:e.eager,maxHeight:310,openOnClick:!1,closeOnContentClick:!1,transition:e.transition,onAfterEnter:J,onAfterLeave:F},ne.value),{default:()=>[n&&f(ze,O({ref:T,selected:P.value,selectStrategy:e.multiple?"independent":"single-independent",onMousedown:g=>g.preventDefault(),onKeydown:$,onFocusin:ae,tabindex:"-1","aria-live":"polite",color:e.itemColor??e.color},Q,e.listProps),{default:()=>[s["prepend-item"]?.(),!I.value.length&&!e.hideNoData&&(s["no-data"]?.()??f(he,{key:"no-data",title:o(e.noDataText)},null)),f(gt,{ref:p,renderless:!0,items:I.value},{default:g=>{let{item:y,index:E,itemRef:K}=g;const z=O(y.props,{ref:K,key:y.value,onClick:()=>q(y,null)});return s.item?.({item:y,index:E,props:z})??f(he,O(z,{role:"option"}),{prepend:j=>{let{isSelected:A}=j;return f(W,null,[e.multiple&&!e.hideSelected?f(ot,{key:y.value,modelValue:A,ripple:!1,tabindex:"-1"},null):void 0,y.props.prependAvatar&&f(Ne,{image:y.props.prependAvatar},null),y.props.prependIcon&&f(pe,{icon:y.props.prependIcon},null)])}})}}),s["append-item"]?.()]})]}),c.value.map((g,y)=>{function E(A){A.stopPropagation(),A.preventDefault(),q(g,!1)}const K={"onClick:close":E,onKeydown(A){A.key!=="Enter"&&A.key!==" "||(A.preventDefault(),A.stopPropagation(),E(A))},onMousedown(A){A.preventDefault(),A.stopPropagation()},modelValue:!0,"onUpdate:modelValue":void 0},z=a?!!s.chip:!!s.selection,j=z?at(a?s.chip({item:g,index:y,props:K}):s.selection({item:g,index:y})):void 0;if(!(z&&!j))return f("div",{key:g.value,class:"v-select__selection"},[a?s.chip?f(Se,{key:"chip-defaults",defaults:{VChip:{closable:e.closableChips,size:"small",text:g.title}}},{default:()=>[j]}):f(st,O({key:"chip",closable:e.closableChips,size:"small",text:g.title,disabled:g.props.disabled},K),null):j??f("span",{class:"v-select__selection-text"},[g.title,e.multiple&&y<c.value.length-1&&f("span",{class:"v-select__selection-comma"},[Le(",")])])])})]),"append-inner":function(){for(var g=arguments.length,y=new Array(g),E=0;E<g;E++)y[E]=arguments[E];return f(W,null,[s["append-inner"]?.(...y),e.menuIcon?f(pe,{class:"v-select__menu-icon",icon:e.menuIcon},null):void 0])}})}),be({isFocused:t,menu:l,select:q},i)}});export{Ct as V,rt as a,gt as b,wt as m,yt as u};
