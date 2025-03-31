import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { V as VContainer } from './VContainer.mjs';
import { X as VResponsive, f as VCard, e as VBtn, h as VDivider, g as VIcon } from './server.mjs';
import { V as VSheet } from './VSheet.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';
import 'pinia';
import 'vue-router';
import 'pinia-plugin-persistedstate';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pricing",
  __ssrInlineRender: true,
  setup(__props) {
    const featuresPricing = ref([
      "Unlimited access to snippets and studio",
      "Unlimited SQL generator and monitoring tools",
      "Unlimited SEO audit and accessibility tools",
      "Lifetime access and updates"
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, mergeProps({
        class: "pa-md-12 pa-sm-6",
        fluid: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VResponsive, {
              class: "text-center mx-auto mb-6 mb-md-12",
              "max-width": "700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h1 class="text-md-h4 font-weight-bold mb-4 text-sm-h5"${_scopeId2}> Unlimited Access for One Price </h1><p class="text-subtitle-1 text-medium-emphasis"${_scopeId2}> Get access to all our premium development tools with a single payment. No monthly subscriptions, no hidden fees, just exceptional value. </p>`);
                } else {
                  return [
                    createVNode("h1", { class: "text-md-h4 font-weight-bold mb-4 text-sm-h5" }, " Unlimited Access for One Price "),
                    createVNode("p", { class: "text-subtitle-1 text-medium-emphasis" }, " Get access to all our premium development tools with a single payment. No monthly subscriptions, no hidden fees, just exceptional value. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VSheet, {
              class: "mx-auto pa-2 border-sm",
              "max-width": "1000",
              rounded: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCard, {
                                class: "h-100 flex-column d-flex align-center justify-center pa-4 border-sm",
                                color: "primary",
                                rounded: "xl",
                                variant: "tonal"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis"${_scopeId5}> Pay once, access forever </div><div class="text-h3 mb-8 text-high-emphasis font-weight-bold"${_scopeId5}> $300 <small class="text-overline"${_scopeId5}>USD</small></div>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      class: "mb-5 text-none",
                                      color: "success",
                                      "max-height": "36",
                                      "max-width": "256",
                                      rounded: "lg",
                                      text: "Get Access Now",
                                      to: "/login",
                                      variant: "flat",
                                      width: "100%",
                                      size: "large"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<div class="text-caption text-medium-emphasis w-75 text-center"${_scopeId5}> Limited time offer - Regular price: $349 </div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis" }, " Pay once, access forever "),
                                      createVNode("div", { class: "text-h3 mb-8 text-high-emphasis font-weight-bold" }, [
                                        createTextVNode(" $300 "),
                                        createVNode("small", { class: "text-overline" }, "USD")
                                      ]),
                                      createVNode(VBtn, {
                                        class: "mb-5 text-none",
                                        color: "success",
                                        "max-height": "36",
                                        "max-width": "256",
                                        rounded: "lg",
                                        text: "Get Access Now",
                                        to: "/login",
                                        variant: "flat",
                                        width: "100%",
                                        size: "large"
                                      }),
                                      createVNode("div", { class: "text-caption text-medium-emphasis w-75 text-center" }, " Limited time offer - Regular price: $349 ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCard, {
                                  class: "h-100 flex-column d-flex align-center justify-center pa-4 border-sm",
                                  color: "primary",
                                  rounded: "xl",
                                  variant: "tonal"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis" }, " Pay once, access forever "),
                                    createVNode("div", { class: "text-h3 mb-8 text-high-emphasis font-weight-bold" }, [
                                      createTextVNode(" $300 "),
                                      createVNode("small", { class: "text-overline" }, "USD")
                                    ]),
                                    createVNode(VBtn, {
                                      class: "mb-5 text-none",
                                      color: "success",
                                      "max-height": "36",
                                      "max-width": "256",
                                      rounded: "lg",
                                      text: "Get Access Now",
                                      to: "/login",
                                      variant: "flat",
                                      width: "100%",
                                      size: "large"
                                    }),
                                    createVNode("div", { class: "text-caption text-medium-emphasis w-75 text-center" }, " Limited time offer - Regular price: $349 ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCol, {
                          class: "pa-6",
                          cols: "12",
                          md: "8"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<h2 class="text-h5 font-weight-bold mb-4"${_scopeId4}>Lifetime subscription</h2><p class="text-medium-emphasis mb-4"${_scopeId4}> Maximize your productivity with DevUnity. This limited-time offer won&#39;t be available in the future. Get access to all current and future features, including full access to all development components and tools. </p><div class="d-flex align-center mb-8"${_scopeId4}><span class="text-primary text-no-wrap text-body-2 font-weight-medium me-4"${_scopeId4}>What you get</span>`);
                              _push5(ssrRenderComponent(VDivider, null, null, _parent5, _scopeId4));
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(VRow, { dense: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(featuresPricing.value, (feature) => {
                                      _push6(ssrRenderComponent(VCol, {
                                        key: feature,
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, {
                                              color: "success",
                                              icon: "$success"
                                            }, null, _parent7, _scopeId6));
                                            _push7(`<span class="text-caption ms-2"${_scopeId6}>${ssrInterpolate(feature)}</span>`);
                                          } else {
                                            return [
                                              createVNode(VIcon, {
                                                color: "success",
                                                icon: "$success"
                                              }),
                                              createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(featuresPricing.value, (feature) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: feature,
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              color: "success",
                                              icon: "$success"
                                            }),
                                            createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "Lifetime subscription"),
                                createVNode("p", { class: "text-medium-emphasis mb-4" }, " Maximize your productivity with DevUnity. This limited-time offer won't be available in the future. Get access to all current and future features, including full access to all development components and tools. "),
                                createVNode("div", { class: "d-flex align-center mb-8" }, [
                                  createVNode("span", { class: "text-primary text-no-wrap text-body-2 font-weight-medium me-4" }, "What you get"),
                                  createVNode(VDivider)
                                ]),
                                createVNode(VRow, { dense: "" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(featuresPricing.value, (feature) => {
                                      return openBlock(), createBlock(VCol, {
                                        key: feature,
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "success",
                                            icon: "$success"
                                          }),
                                          createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, {
                            cols: "12",
                            md: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "h-100 flex-column d-flex align-center justify-center pa-4 border-sm",
                                color: "primary",
                                rounded: "xl",
                                variant: "tonal"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis" }, " Pay once, access forever "),
                                  createVNode("div", { class: "text-h3 mb-8 text-high-emphasis font-weight-bold" }, [
                                    createTextVNode(" $300 "),
                                    createVNode("small", { class: "text-overline" }, "USD")
                                  ]),
                                  createVNode(VBtn, {
                                    class: "mb-5 text-none",
                                    color: "success",
                                    "max-height": "36",
                                    "max-width": "256",
                                    rounded: "lg",
                                    text: "Get Access Now",
                                    to: "/login",
                                    variant: "flat",
                                    width: "100%",
                                    size: "large"
                                  }),
                                  createVNode("div", { class: "text-caption text-medium-emphasis w-75 text-center" }, " Limited time offer - Regular price: $349 ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            class: "pa-6",
                            cols: "12",
                            md: "8"
                          }, {
                            default: withCtx(() => [
                              createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "Lifetime subscription"),
                              createVNode("p", { class: "text-medium-emphasis mb-4" }, " Maximize your productivity with DevUnity. This limited-time offer won't be available in the future. Get access to all current and future features, including full access to all development components and tools. "),
                              createVNode("div", { class: "d-flex align-center mb-8" }, [
                                createVNode("span", { class: "text-primary text-no-wrap text-body-2 font-weight-medium me-4" }, "What you get"),
                                createVNode(VDivider)
                              ]),
                              createVNode(VRow, { dense: "" }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(featuresPricing.value, (feature) => {
                                    return openBlock(), createBlock(VCol, {
                                      key: feature,
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "success",
                                          icon: "$success"
                                        }),
                                        createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCard, {
                              class: "h-100 flex-column d-flex align-center justify-center pa-4 border-sm",
                              color: "primary",
                              rounded: "xl",
                              variant: "tonal"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis" }, " Pay once, access forever "),
                                createVNode("div", { class: "text-h3 mb-8 text-high-emphasis font-weight-bold" }, [
                                  createTextVNode(" $300 "),
                                  createVNode("small", { class: "text-overline" }, "USD")
                                ]),
                                createVNode(VBtn, {
                                  class: "mb-5 text-none",
                                  color: "success",
                                  "max-height": "36",
                                  "max-width": "256",
                                  rounded: "lg",
                                  text: "Get Access Now",
                                  to: "/login",
                                  variant: "flat",
                                  width: "100%",
                                  size: "large"
                                }),
                                createVNode("div", { class: "text-caption text-medium-emphasis w-75 text-center" }, " Limited time offer - Regular price: $349 ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          class: "pa-6",
                          cols: "12",
                          md: "8"
                        }, {
                          default: withCtx(() => [
                            createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "Lifetime subscription"),
                            createVNode("p", { class: "text-medium-emphasis mb-4" }, " Maximize your productivity with DevUnity. This limited-time offer won't be available in the future. Get access to all current and future features, including full access to all development components and tools. "),
                            createVNode("div", { class: "d-flex align-center mb-8" }, [
                              createVNode("span", { class: "text-primary text-no-wrap text-body-2 font-weight-medium me-4" }, "What you get"),
                              createVNode(VDivider)
                            ]),
                            createVNode(VRow, { dense: "" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(featuresPricing.value, (feature) => {
                                  return openBlock(), createBlock(VCol, {
                                    key: feature,
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "success",
                                        icon: "$success"
                                      }),
                                      createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VResponsive, {
                class: "text-center mx-auto mb-6 mb-md-12",
                "max-width": "700"
              }, {
                default: withCtx(() => [
                  createVNode("h1", { class: "text-md-h4 font-weight-bold mb-4 text-sm-h5" }, " Unlimited Access for One Price "),
                  createVNode("p", { class: "text-subtitle-1 text-medium-emphasis" }, " Get access to all our premium development tools with a single payment. No monthly subscriptions, no hidden fees, just exceptional value. ")
                ]),
                _: 1
              }),
              createVNode(VSheet, {
                class: "mx-auto pa-2 border-sm",
                "max-width": "1000",
                rounded: "xl"
              }, {
                default: withCtx(() => [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(VCol, {
                        cols: "12",
                        md: "4"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "h-100 flex-column d-flex align-center justify-center pa-4 border-sm",
                            color: "primary",
                            rounded: "xl",
                            variant: "tonal"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis" }, " Pay once, access forever "),
                              createVNode("div", { class: "text-h3 mb-8 text-high-emphasis font-weight-bold" }, [
                                createTextVNode(" $300 "),
                                createVNode("small", { class: "text-overline" }, "USD")
                              ]),
                              createVNode(VBtn, {
                                class: "mb-5 text-none",
                                color: "success",
                                "max-height": "36",
                                "max-width": "256",
                                rounded: "lg",
                                text: "Get Access Now",
                                to: "/login",
                                variant: "flat",
                                width: "100%",
                                size: "large"
                              }),
                              createVNode("div", { class: "text-caption text-medium-emphasis w-75 text-center" }, " Limited time offer - Regular price: $349 ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        class: "pa-6",
                        cols: "12",
                        md: "8"
                      }, {
                        default: withCtx(() => [
                          createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "Lifetime subscription"),
                          createVNode("p", { class: "text-medium-emphasis mb-4" }, " Maximize your productivity with DevUnity. This limited-time offer won't be available in the future. Get access to all current and future features, including full access to all development components and tools. "),
                          createVNode("div", { class: "d-flex align-center mb-8" }, [
                            createVNode("span", { class: "text-primary text-no-wrap text-body-2 font-weight-medium me-4" }, "What you get"),
                            createVNode(VDivider)
                          ]),
                          createVNode(VRow, { dense: "" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(featuresPricing.value, (feature) => {
                                return openBlock(), createBlock(VCol, {
                                  key: feature,
                                  cols: "12",
                                  md: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "success",
                                      icon: "$success"
                                    }),
                                    createVNode("span", { class: "text-caption ms-2" }, toDisplayString(feature), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pricing.vue.mjs.map
