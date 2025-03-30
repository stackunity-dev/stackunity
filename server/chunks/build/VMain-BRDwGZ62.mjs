import { createVNode } from 'vue';
import { m as genericComponent, p as propsFactory, y as useDimension, C as useLayout, s as useSsrBoot, v as useRender, z as makeTagProps, A as makeDimensionProps, B as makeComponentProps } from './server.mjs';

const makeVMainProps = propsFactory({
  scrollable: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps({
    tag: "main"
  })
}, "VMain");
const VMain = genericComponent()({
  name: "VMain",
  props: makeVMainProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      mainStyles
    } = useLayout();
    const {
      ssrBootStyles
    } = useSsrBoot();
    useRender(() => createVNode(props.tag, {
      "class": ["v-main", {
        "v-main--scrollable": props.scrollable
      }, props.class],
      "style": [mainStyles.value, ssrBootStyles.value, dimensionStyles.value, props.style]
    }, {
      default: () => {
        var _a, _b;
        return [props.scrollable ? createVNode("div", {
          "class": "v-main__scroller"
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]) : (_b = slots.default) == null ? void 0 : _b.call(slots)];
      }
    }));
    return {};
  }
});

export { VMain as V };
//# sourceMappingURL=VMain-BRDwGZ62.mjs.map
