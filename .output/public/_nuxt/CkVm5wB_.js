import{m as Y,p as Z,aj as Se,bG as Ce,cg as de,Y as B,y as k,a0 as te,d4 as xe,b4 as ae,a1 as Ie,A as ve,b as i,d5 as fe,aL as ee,bW as Ve,a3 as le,aA as _,cs as Pe,aV as ne,i as w,v as pe,al as Ae,n as M,B as X,bH as he,C as ye,ag as ze,c1 as _e,x as we,aI as Ee,cm as Re,b_ as Te,s as Fe,aJ as Be,bZ as Ge,ai as Oe,ch as De,d6 as Me,bo as se,c2 as We,bI as Le,d7 as He,aM as $e,cl as qe,D as Ke,bJ as Ne,aO as je,by as ie,cp as Je,d8 as Ue,aB as W,bp as Qe,F as oe,k as ce}from"./CaL5DcWf.js";function Xe(e){let{selectedElement:n,containerElement:a,isRtl:r,isHorizontal:o}=e;const y=G(o,a),u=be(o,r,a),b=G(o,n),v=me(o,n),g=b*.4;return u>v?v-g:u+y<v+b?v-y+b+g:u}function Ye(e){let{selectedElement:n,containerElement:a,isHorizontal:r}=e;const o=G(r,a),y=me(r,n),u=G(r,n);return y-o/2+u/2}function ue(e,n){const a=e?"scrollWidth":"scrollHeight";return(n==null?void 0:n[a])||0}function Ze(e,n){const a=e?"clientWidth":"clientHeight";return(n==null?void 0:n[a])||0}function be(e,n,a){if(!a)return 0;const{scrollLeft:r,offsetWidth:o,scrollWidth:y}=a;return e?n?y-o+r:r:a.scrollTop}function G(e,n){const a=e?"offsetWidth":"offsetHeight";return(n==null?void 0:n[a])||0}function me(e,n){const a=e?"offsetLeft":"offsetTop";return(n==null?void 0:n[a])||0}const el=Symbol.for("vuetify:v-slide-group"),ke=Z({centerActive:Boolean,direction:{type:String,default:"horizontal"},symbol:{type:null,default:el},nextIcon:{type:_,default:"$next"},prevIcon:{type:_,default:"$prev"},showArrows:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["always","desktop","mobile"].includes(e)},...le(),...Ve({mobile:null}),...ee(),...fe({selectedClass:"v-slide-group-item--active"})},"VSlideGroup"),re=Y()({name:"VSlideGroup",props:ke(),emits:{"update:modelValue":e=>!0},setup(e,n){let{slots:a}=n;const{isRtl:r}=Se(),{displayClasses:o,mobile:y}=Ce(e),u=de(e,e.symbol),b=B(!1),v=B(0),g=B(0),x=B(0),d=k(()=>e.direction==="horizontal"),{resizeRef:f,contentRect:E}=te(),{resizeRef:p,contentRect:P}=te(),s=xe(),m=k(()=>({container:f.el,duration:200,easing:"easeOutQuart"})),L=k(()=>u.selected.value.length?u.items.value.findIndex(t=>t.id===u.selected.value[0]):-1),S=k(()=>u.selected.value.length?u.items.value.findIndex(t=>t.id===u.selected.value[u.selected.value.length-1]):-1);if(ae){let t=-1;Ie(()=>[u.selected.value,E.value,P.value,d.value],()=>{cancelAnimationFrame(t),t=requestAnimationFrame(()=>{if(E.value&&P.value){const l=d.value?"width":"height";g.value=E.value[l],x.value=P.value[l],b.value=g.value+1<x.value}if(L.value>=0&&p.el){const l=p.el.children[S.value];R(l,e.centerActive)}})})}const A=B(!1);function R(t,l){let c=0;l?c=Ye({containerElement:f.el,isHorizontal:d.value,selectedElement:t}):c=Xe({containerElement:f.el,isHorizontal:d.value,isRtl:r.value,selectedElement:t}),O(c)}function O(t){if(!ae||!f.el)return;const l=G(d.value,f.el),c=be(d.value,r.value,f.el);if(!(ue(d.value,f.el)<=l||Math.abs(t-c)<16)){if(d.value&&r.value&&f.el){const{scrollWidth:U,offsetWidth:Q}=f.el;t=U-Q-t}d.value?s.horizontal(t,m.value):s(t,m.value)}}function h(t){const{scrollTop:l,scrollLeft:c}=t.target;v.value=d.value?c:l}function I(t){if(A.value=!0,!(!b.value||!p.el)){for(const l of t.composedPath())for(const c of p.el.children)if(c===l){R(c);return}}}function H(t){A.value=!1}let T=!1;function D(t){var l;!T&&!A.value&&!(t.relatedTarget&&((l=p.el)!=null&&l.contains(t.relatedTarget)))&&C(),T=!1}function F(){T=!0}function $(t){if(!p.el)return;function l(c){t.preventDefault(),C(c)}d.value?t.key==="ArrowRight"?l(r.value?"prev":"next"):t.key==="ArrowLeft"&&l(r.value?"next":"prev"):t.key==="ArrowDown"?l("next"):t.key==="ArrowUp"&&l("prev"),t.key==="Home"?l("first"):t.key==="End"&&l("last")}function V(t,l){if(!t)return;let c=t;do c=c==null?void 0:c[l==="next"?"nextElementSibling":"previousElementSibling"];while(c!=null&&c.hasAttribute("disabled"));return c}function C(t){if(!p.el)return;let l;if(!t)l=Pe(p.el)[0];else if(t==="next"){if(l=V(p.el.querySelector(":focus"),t),!l)return C("first")}else if(t==="prev"){if(l=V(p.el.querySelector(":focus"),t),!l)return C("last")}else t==="first"?(l=p.el.firstElementChild,l!=null&&l.hasAttribute("disabled")&&(l=V(l,"next"))):t==="last"&&(l=p.el.lastElementChild,l!=null&&l.hasAttribute("disabled")&&(l=V(l,"prev")));l&&l.focus({preventScroll:!0})}function z(t){const l=d.value&&r.value?-1:1,c=(t==="prev"?-l:l)*g.value;let J=v.value+c;if(d.value&&r.value&&f.el){const{scrollWidth:U,offsetWidth:Q}=f.el;J+=U-Q}O(J)}const q=k(()=>({next:u.next,prev:u.prev,select:u.select,isSelected:u.isSelected})),K=k(()=>{switch(e.showArrows){case"always":return!0;case"desktop":return!y.value;case!0:return b.value||Math.abs(v.value)>0;case"mobile":return y.value||b.value||Math.abs(v.value)>0;default:return!y.value&&(b.value||Math.abs(v.value)>0)}}),N=k(()=>Math.abs(v.value)>1),j=k(()=>{if(!f.value)return!1;const t=ue(d.value,f.el),l=Ze(d.value,f.el);return t-l-Math.abs(v.value)>1});return ve(()=>i(e.tag,{class:["v-slide-group",{"v-slide-group--vertical":!d.value,"v-slide-group--has-affixes":K.value,"v-slide-group--is-overflowing":b.value},o.value,e.class],style:e.style,tabindex:A.value||u.selected.value.length?-1:0,onFocus:D},{default:()=>{var t,l,c;return[K.value&&i("div",{key:"prev",class:["v-slide-group__prev",{"v-slide-group__prev--disabled":!N.value}],onMousedown:F,onClick:()=>N.value&&z("prev")},[((t=a.prev)==null?void 0:t.call(a,q.value))??i(ne,null,{default:()=>[i(w,{icon:r.value?e.nextIcon:e.prevIcon},null)]})]),i("div",{key:"container",ref:f,class:"v-slide-group__container",onScroll:h},[i("div",{ref:p,class:"v-slide-group__content",onFocusin:I,onFocusout:H,onKeydown:$},[(l=a.default)==null?void 0:l.call(a,q.value)])]),K.value&&i("div",{key:"next",class:["v-slide-group__next",{"v-slide-group__next--disabled":!j.value}],onMousedown:F,onClick:()=>j.value&&z("next")},[((c=a.next)==null?void 0:c.call(a,q.value))??i(ne,null,{default:()=>[i(w,{icon:r.value?e.prevIcon:e.nextIcon},null)]})])]}})),{selected:u.selected,scrollTo:z,scrollOffset:v,focus:C,hasPrev:N,hasNext:j}}}),ge=Symbol.for("vuetify:v-chip-group"),ll=Z({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:ze},...ke(),...le(),...fe({selectedClass:"v-chip--selected"}),...ee(),...ye(),...he({variant:"tonal"})},"VChipGroup"),nl=Y()({name:"VChipGroup",props:ll(),emits:{"update:modelValue":e=>!0},setup(e,n){let{slots:a}=n;const{themeClasses:r}=pe(e),{isSelected:o,select:y,next:u,prev:b,selected:v}=de(e,ge);return Ae({VChip:{color:M(e,"color"),disabled:M(e,"disabled"),filter:M(e,"filter"),variant:M(e,"variant")}}),ve(()=>{const g=re.filterProps(e);return i(re,X(g,{class:["v-chip-group",{"v-chip-group--column":e.column},r.value,e.class],style:e.style}),{default:()=>{var x;return[(x=a.default)==null?void 0:x.call(a,{isSelected:o,select:y,next:u,prev:b,selected:v.value})]}})}),{}}}),tl=Z({activeClass:String,appendAvatar:String,appendIcon:_,closable:Boolean,closeIcon:{type:_,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:_,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:_,ripple:{type:[Boolean,Object],default:!0},text:String,modelValue:{type:Boolean,default:!0},onClick:ie(),onClickOnce:ie(),...je(),...le(),...Ne(),...Ke(),...qe(),...$e(),...He(),...Le(),...ee({tag:"span"}),...ye(),...he({variant:"tonal"})},"VChip"),sl=Y()({name:"VChip",directives:{Ripple:_e},props:tl(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,n){let{attrs:a,emit:r,slots:o}=n;const{t:y}=we(),{borderClasses:u}=Ee(e),{colorClasses:b,colorStyles:v,variantClasses:g}=Re(e),{densityClasses:x}=Te(e),{elevationClasses:d}=Fe(e),{roundedClasses:f}=Be(e),{sizeClasses:E}=Ge(e),{themeClasses:p}=pe(e),P=Oe(e,"modelValue"),s=De(e,ge,!1),m=Me(e,a),L=k(()=>e.link!==!1&&m.isLink.value),S=k(()=>!e.disabled&&e.link!==!1&&(!!s||e.link||m.isClickable.value)),A=k(()=>({"aria-label":y(e.closeLabel),onClick(h){h.preventDefault(),h.stopPropagation(),P.value=!1,r("click:close",h)}}));function R(h){var I;r("click",h),S.value&&((I=m.navigate)==null||I.call(m,h),s==null||s.toggle())}function O(h){(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),R(h))}return()=>{var C;const h=m.isLink.value?"a":e.tag,I=!!(e.appendIcon||e.appendAvatar),H=!!(I||o.append),T=!!(o.close||e.closable),D=!!(o.filter||e.filter)&&s,F=!!(e.prependIcon||e.prependAvatar),$=!!(F||o.prepend),V=!s||s.isSelected.value;return P.value&&se(i(h,X({class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":S.value,"v-chip--filter":D,"v-chip--pill":e.pill,[`${e.activeClass}`]:e.activeClass&&((C=m.isActive)==null?void 0:C.value)},p.value,u.value,V?b.value:void 0,x.value,d.value,f.value,E.value,g.value,s==null?void 0:s.selectedClass.value,e.class],style:[V?v.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,tabindex:S.value?0:void 0,onClick:R,onKeydown:S.value&&!L.value&&O},m.linkProps),{default:()=>{var z;return[Je(S.value,"v-chip"),D&&i(Ue,{key:"filter"},{default:()=>[se(i("div",{class:"v-chip__filter"},[o.filter?i(W,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},o.filter):i(w,{key:"filter-icon",icon:e.filterIcon},null)]),[[Qe,s.isSelected.value]])]}),$&&i("div",{key:"prepend",class:"v-chip__prepend"},[o.prepend?i(W,{key:"prepend-defaults",disabled:!F,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},o.prepend):i(oe,null,[e.prependIcon&&i(w,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&i(ce,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),i("div",{class:"v-chip__content","data-no-activator":""},[((z=o.default)==null?void 0:z.call(o,{isSelected:s==null?void 0:s.isSelected.value,selectedClass:s==null?void 0:s.selectedClass.value,select:s==null?void 0:s.select,toggle:s==null?void 0:s.toggle,value:s==null?void 0:s.value.value,disabled:e.disabled}))??e.text]),H&&i("div",{key:"append",class:"v-chip__append"},[o.append?i(W,{key:"append-defaults",disabled:!I,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},o.append):i(oe,null,[e.appendIcon&&i(w,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&i(ce,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),T&&i("button",X({key:"close",class:"v-chip__close",type:"button","data-testid":"close-chip"},A.value),[o.close?i(W,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},o.close):i(w,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[We("ripple"),S.value&&e.ripple,null]])}}});export{sl as V,nl as a,re as b,ke as m};
