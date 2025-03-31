import { createVNode, mergeProps } from 'vue';
import { k as genericComponent, p as propsFactory, s as useRender, e as VBtn, b5 as makeVBtnProps } from './server.mjs';

const makeVAppBarNavIconProps = propsFactory({
  ...makeVBtnProps({
    icon: "$menu",
    variant: "text"
  })
}, "VAppBarNavIcon");
const VAppBarNavIcon = genericComponent()({
  name: "VAppBarNavIcon",
  props: makeVAppBarNavIconProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VBtn, mergeProps(props, {
      "class": ["v-app-bar-nav-icon"]
    }), slots));
    return {};
  }
});

export { VAppBarNavIcon as V };
//# sourceMappingURL=VAppBarNavIcon.mjs.map
