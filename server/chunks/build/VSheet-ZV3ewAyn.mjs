import { toRef, createVNode } from 'vue';
import { m as genericComponent, p as propsFactory, E as provideTheme, F as useBackgroundColor, G as useBorder, y as useDimension, H as useElevation, bC as useLocation, bD as usePosition, I as useRounded, v as useRender, K as makeThemeProps, z as makeTagProps, L as makeRoundedProps, bE as makePositionProps, bF as makeLocationProps, M as makeElevationProps, A as makeDimensionProps, B as makeComponentProps, N as makeBorderProps } from './server.mjs';

const makeVSheetProps = propsFactory({
  color: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VSheet");
const VSheet = genericComponent()({
  name: "VSheet",
  props: makeVSheetProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-sheet", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, dimensionStyles.value, locationStyles.value, props.style]
    }, slots));
    return {};
  }
});

export { VSheet as V, makeVSheetProps as m };
//# sourceMappingURL=VSheet-ZV3ewAyn.mjs.map
