import { defineComponent, ref, computed, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, f as VBtn, h as VIcon, Z as VListItem, $ as VListItemTitle, a0 as VDialog, g as VCard, X as VCardTitle, Y as VCardText, a1 as VList, a2 as VCardActions, e as VSpacer } from './server.mjs';
import { V as VChip } from './VChip-BzNlhlnv.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PremiumFeature",
  __ssrInlineRender: true,
  props: {
    title: { default: "" },
    icon: { default: "mdi-crown" },
    color: { default: "warning" },
    variant: { default: "elevated" },
    disabled: { type: Boolean, default: false },
    premiumLink: { default: "/premium" },
    type: { default: "button" },
    featureKey: { default: "" },
    size: { default: "default" }
  },
  setup(__props) {
    const router = useRouter();
    const props = __props;
    const showDialog = ref(false);
    const featureType = computed(() => {
      var _a;
      if (props.featureKey) {
        return props.featureKey;
      }
      const title = ((_a = props.title) == null ? void 0 : _a.toLowerCase()) || "";
      if (title.includes("database") || title.includes("sql")) {
        return "databaseDesigner";
      } else if (title.includes("seo audit")) {
        return "seoAudit";
      } else if (title.includes("robot") || title.includes("schema")) {
        return "robots";
      } else if (title.includes("studio")) {
        return "studioComponents";
      }
      return "";
    });
    const features = {
      databaseDesigner: [
        "Visual database schema creation",
        "SQL generation with optimized indexes",
        "Multiple database engine support",
        "Export schemas as SQL or diagrams"
      ],
      seoAudit: [
        "Complete website SEO audit",
        "Technical SEO recommendations",
        "Content optimization suggestions",
        "Exportable PDF reports"
      ],
      robots: [
        "robots.txt generator",
        "Schema.org markup generator",
        "Structured data validation",
        "Search engine visibility control"
      ],
      studioComponents: [
        "Access to all UI components",
        "Navigation drawer builder",
        "Timeline component creator",
        "Form builder with validation",
        "Advanced UI utilities"
      ],
      audit: [
        "Website analysis",
        "Accessibility audit",
        "Performance audit",
        "Errors audit",
        "Recommendations"
      ],
      default: [
        "Unlimited access to all features",
        "Priority support",
        "Early access to updates",
        "Exclusive features"
      ]
    };
    const getFeatures = (type) => {
      switch (type) {
        case "databaseDesigner":
          return features.databaseDesigner;
        case "seoAudit":
          return features.seoAudit;
        case "robots":
          return features.robots;
        case "studioComponents":
          return features.studioComponents;
        case "audit":
          return features.audit;
        default:
          return features.default;
      }
    };
    const goToPricingPage = () => {
      router.push("/checkout");
      showDialog.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-ffbb4793>`);
      if (_ctx.type === "button") {
        _push(ssrRenderComponent(VBtn, {
          color: _ctx.color,
          variant: _ctx.variant,
          disabled: _ctx.disabled,
          onClick: ($event) => showDialog.value = true,
          class: "premium-btn",
          elevation: "2",
          size: _ctx.size
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(VIcon, {
                icon: _ctx.icon,
                class: "crown-icon"
              }, null, _parent2, _scopeId));
              _push2(`<span class="premium-text" data-v-ffbb4793${_scopeId}>${ssrInterpolate(_ctx.title)}</span>`);
            } else {
              return [
                createVNode(VIcon, {
                  icon: _ctx.icon,
                  class: "crown-icon"
                }, null, 8, ["icon"]),
                createVNode("span", { class: "premium-text" }, toDisplayString(_ctx.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (_ctx.type === "list-item") {
        _push(ssrRenderComponent(VListItem, {
          "prepend-icon": "mdi-crown",
          onClick: ($event) => showDialog.value = true,
          rounded: "lg",
          density: "compact",
          class: "gold-gradient-item"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(VListItemTitle, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(_ctx.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(_ctx.title), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(VListItemTitle, null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.title), 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (_ctx.type === "chip") {
        _push(ssrRenderComponent(VChip, {
          "prepend-icon": "mdi-crown",
          color: "warning",
          onClick: ($event) => showDialog.value = true,
          size: "small",
          class: "gold-gradient-chip"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Premium `);
            } else {
              return [
                createTextVNode("Premium ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(VDialog, {
        modelValue: showDialog.value,
        "onUpdate:modelValue": ($event) => showDialog.value = $event,
        "max-width": "500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCard, {
              class: "rounded-lg",
              elevation: "8"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, {
                          color: "white",
                          class: "mr-2"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(_ctx.icon)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(_ctx.icon), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(_ctx.title || "Premium feature")}`);
                      } else {
                        return [
                          createVNode(VIcon, {
                            color: "white",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(_ctx.icon), 1)
                            ]),
                            _: 1
                          }),
                          createTextVNode(" " + toDisplayString(_ctx.title || "Premium feature"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center mb-6" data-v-ffbb4793${_scopeId3}>`);
                        _push4(ssrRenderComponent(VIcon, {
                          icon: _ctx.icon,
                          size: "64",
                          color: _ctx.color,
                          class: "mb-2"
                        }, null, _parent4, _scopeId3));
                        _push4(`<div class="text-h6 mb-2" data-v-ffbb4793${_scopeId3}>${ssrInterpolate(_ctx.title || "Premium feature")}</div><div class="text-body-2 text-medium-emphasis" data-v-ffbb4793${_scopeId3}> Unlock all premium features </div></div>`);
                        _push4(ssrRenderComponent(VList, { class: "rounded-lg mb-6 premium-features-list" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(getFeatures(featureType.value), (feature, index) => {
                                _push5(ssrRenderComponent(VListItem, {
                                  key: index,
                                  "prepend-icon": "mdi-check-circle",
                                  class: "premium-feature-item"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VListItemTitle, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(feature)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(feature), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(feature), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(getFeatures(featureType.value), (feature, index) => {
                                  return openBlock(), createBlock(VListItem, {
                                    key: index,
                                    "prepend-icon": "mdi-check-circle",
                                    class: "premium-feature-item"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(feature), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="text-center" data-v-ffbb4793${_scopeId3}><div class="text-h3 font-weight-bold mb-1" data-v-ffbb4793${_scopeId3}>300$</div><div class="text-subtitle-1 text-medium-emphasis mb-4" data-v-ffbb4793${_scopeId3}>Lifetime access</div>`);
                        _push4(ssrRenderComponent(VBtn, {
                          color: "warning",
                          variant: "elevated",
                          size: "large",
                          block: "",
                          onClick: goToPricingPage,
                          class: "premium-action-btn"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { start: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-crown`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-crown")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` Get lifetime access `);
                            } else {
                              return [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-crown")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Get lifetime access ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="text-caption text-medium-emphasis mt-2" data-v-ffbb4793${_scopeId3}> Single payment \u2022 Unlimited access \u2022 Priority support </div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center mb-6" }, [
                            createVNode(VIcon, {
                              icon: _ctx.icon,
                              size: "64",
                              color: _ctx.color,
                              class: "mb-2"
                            }, null, 8, ["icon", "color"]),
                            createVNode("div", { class: "text-h6 mb-2" }, toDisplayString(_ctx.title || "Premium feature"), 1),
                            createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " Unlock all premium features ")
                          ]),
                          createVNode(VList, { class: "rounded-lg mb-6 premium-features-list" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(getFeatures(featureType.value), (feature, index) => {
                                return openBlock(), createBlock(VListItem, {
                                  key: index,
                                  "prepend-icon": "mdi-check-circle",
                                  class: "premium-feature-item"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(feature), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("div", { class: "text-h3 font-weight-bold mb-1" }, "300$"),
                            createVNode("div", { class: "text-subtitle-1 text-medium-emphasis mb-4" }, "Lifetime access"),
                            createVNode(VBtn, {
                              color: "warning",
                              variant: "elevated",
                              size: "large",
                              block: "",
                              onClick: goToPricingPage,
                              class: "premium-action-btn"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-crown")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Get lifetime access ")
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "text-caption text-medium-emphasis mt-2" }, " Single payment \u2022 Unlimited access \u2022 Priority support ")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardActions, { class: "pa-4 pt-0" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          color: "grey",
                          variant: "text",
                          onClick: ($event) => showDialog.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Close `);
                            } else {
                              return [
                                createTextVNode(" Close ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            color: "grey",
                            variant: "text",
                            onClick: ($event) => showDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Close ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          color: "white",
                          class: "mr-2"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(_ctx.icon), 1)
                          ]),
                          _: 1
                        }),
                        createTextVNode(" " + toDisplayString(_ctx.title || "Premium feature"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, { class: "pa-4" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-center mb-6" }, [
                          createVNode(VIcon, {
                            icon: _ctx.icon,
                            size: "64",
                            color: _ctx.color,
                            class: "mb-2"
                          }, null, 8, ["icon", "color"]),
                          createVNode("div", { class: "text-h6 mb-2" }, toDisplayString(_ctx.title || "Premium feature"), 1),
                          createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " Unlock all premium features ")
                        ]),
                        createVNode(VList, { class: "rounded-lg mb-6 premium-features-list" }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(getFeatures(featureType.value), (feature, index) => {
                              return openBlock(), createBlock(VListItem, {
                                key: index,
                                "prepend-icon": "mdi-check-circle",
                                class: "premium-feature-item"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VListItemTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(feature), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "text-center" }, [
                          createVNode("div", { class: "text-h3 font-weight-bold mb-1" }, "300$"),
                          createVNode("div", { class: "text-subtitle-1 text-medium-emphasis mb-4" }, "Lifetime access"),
                          createVNode(VBtn, {
                            color: "warning",
                            variant: "elevated",
                            size: "large",
                            block: "",
                            onClick: goToPricingPage,
                            class: "premium-action-btn"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-crown")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Get lifetime access ")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "text-caption text-medium-emphasis mt-2" }, " Single payment \u2022 Unlimited access \u2022 Priority support ")
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(VCardActions, { class: "pa-4 pt-0" }, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          color: "grey",
                          variant: "text",
                          onClick: ($event) => showDialog.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Close ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
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
              createVNode(VCard, {
                class: "rounded-lg",
                elevation: "8"
              }, {
                default: withCtx(() => [
                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        color: "white",
                        class: "mr-2"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.icon), 1)
                        ]),
                        _: 1
                      }),
                      createTextVNode(" " + toDisplayString(_ctx.title || "Premium feature"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, { class: "pa-4" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "text-center mb-6" }, [
                        createVNode(VIcon, {
                          icon: _ctx.icon,
                          size: "64",
                          color: _ctx.color,
                          class: "mb-2"
                        }, null, 8, ["icon", "color"]),
                        createVNode("div", { class: "text-h6 mb-2" }, toDisplayString(_ctx.title || "Premium feature"), 1),
                        createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " Unlock all premium features ")
                      ]),
                      createVNode(VList, { class: "rounded-lg mb-6 premium-features-list" }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(getFeatures(featureType.value), (feature, index) => {
                            return openBlock(), createBlock(VListItem, {
                              key: index,
                              "prepend-icon": "mdi-check-circle",
                              class: "premium-feature-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(VListItemTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(feature), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "text-center" }, [
                        createVNode("div", { class: "text-h3 font-weight-bold mb-1" }, "300$"),
                        createVNode("div", { class: "text-subtitle-1 text-medium-emphasis mb-4" }, "Lifetime access"),
                        createVNode(VBtn, {
                          color: "warning",
                          variant: "elevated",
                          size: "large",
                          block: "",
                          onClick: goToPricingPage,
                          class: "premium-action-btn"
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { start: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-crown")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Get lifetime access ")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "text-caption text-medium-emphasis mt-2" }, " Single payment \u2022 Unlimited access \u2022 Priority support ")
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(VCardActions, { class: "pa-4 pt-0" }, {
                    default: withCtx(() => [
                      createVNode(VSpacer),
                      createVNode(VBtn, {
                        color: "grey",
                        variant: "text",
                        onClick: ($event) => showDialog.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Close ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PremiumFeature.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const premiumFeatures = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ffbb4793"]]);

export { premiumFeatures as p };
//# sourceMappingURL=PremiumFeature-CXoy71CS.mjs.map
