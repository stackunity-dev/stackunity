import { createVNode } from 'vue';
import { m as genericComponent, p as propsFactory, x as useRtl, y as useDimension, v as useRender, z as makeTagProps, A as makeDimensionProps, B as makeComponentProps } from './server.mjs';

const makeVContainerProps = propsFactory({
  fluid: {
    type: Boolean,
    default: false
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps()
}, "VContainer");
const VContainer = genericComponent()({
  name: "VContainer",
  props: makeVContainerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = useRtl();
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-container", {
        "v-container--fluid": props.fluid
      }, rtlClasses.value, props.class],
      "style": [dimensionStyles.value, props.style]
    }, slots));
    return {};
  }
});

export { VContainer as V };
//# sourceMappingURL=VContainer-fRL-Auqv.mjs.map
