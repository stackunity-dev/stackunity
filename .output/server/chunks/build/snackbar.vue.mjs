import { defineComponent, computed, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a1 as VSnackbar, g as VIcon, _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "snackbar",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    text: {},
    color: {},
    timeout: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const show = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const iconColor = computed(() => props.color || "info");
    const icon = computed(() => {
      switch (props.color) {
        case "success":
          return "mdi-check-circle";
        case "error":
          return "mdi-alert-circle";
        case "warning":
          return "mdi-alert";
        case "info":
          return "mdi-information";
        default:
          return "mdi-bell";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VSnackbar, mergeProps({
        modelValue: show.value,
        "onUpdate:modelValue": ($event) => show.value = $event,
        color: "grey-darken-4",
        timeout: _ctx.timeout,
        location: "top right",
        elevation: "4",
        transition: "slide-x-reverse-transition"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex align-center" data-v-f4366f72${_scopeId}>`);
            _push2(ssrRenderComponent(VIcon, {
              color: iconColor.value,
              icon: icon.value,
              class: "mr-2"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.text)}</div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex align-center" }, [
                createVNode(VIcon, {
                  color: iconColor.value,
                  icon: icon.value,
                  class: "mr-2"
                }, null, 8, ["color", "icon"]),
                createTextVNode(" " + toDisplayString(_ctx.text), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/snackbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Snackbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f4366f72"]]);

export { Snackbar as S };
//# sourceMappingURL=snackbar.vue.mjs.map
