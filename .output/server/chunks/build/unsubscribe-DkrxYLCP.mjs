import { defineComponent, ref, withCtx, createTextVNode, createVNode, withModifiers, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { W as useUserStore, V as VApp, g as VCard, bO as VCardItem, h as VIcon, Y as VCardText, f as VBtn, bv as VSnackbar, n as navigateTo } from './server.mjs';
import { u as useHead } from './index-C2merokO.mjs';
import { V as VMain } from './VMain-BRDwGZ62.mjs';
import { V as VForm } from './VForm-DigzH7RY.mjs';
import { V as VTextField } from './VTextField-B2FvXSJz.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'deep-pick-omit';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "unsubscribe",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Unsubscribe - DevUnity",
      meta: [
        { name: "description", content: "Unsubscribe from the newsletter" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "noindex, nofollow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Unsubscribe - DevUnity" },
        { name: "og:description", content: "Unsubscribe from the newsletter" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const userStore = useUserStore();
    ref(false);
    const email = ref("");
    const snackbar = ref({
      show: false,
      text: "",
      color: "success"
    });
    const unsubscribe = async () => {
      await userStore.unsubscribe(email.value);
      snackbar.value.show = true;
      snackbar.value.text = "Vous avez \xE9t\xE9 d\xE9sinscrit de la newsletter";
      snackbar.value.color = "success";
      navigateTo("/login");
    };
    const goToLogin = () => {
      navigateTo("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, {
              class: "d-flex align-center justify-center",
              style: { "min-height": "100vh" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, {
                    "max-width": "550",
                    class: "mx-auto rounded-xl elevation-5"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardItem, { class: "bg-primary text-center pa-6 rounded-t-xl" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, {
                                size: "48",
                                color: "white",
                                class: "mb-2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-email-remove`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-email-remove")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<h1 class="text-h4 text-white font-weight-bold"${_scopeId4}>Se d\xE9sabonner de la newsletter</h1>`);
                            } else {
                              return [
                                createVNode(VIcon, {
                                  size: "48",
                                  color: "white",
                                  class: "mb-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-email-remove")
                                  ]),
                                  _: 1
                                }),
                                createVNode("h1", { class: "text-h4 text-white font-weight-bold" }, "Se d\xE9sabonner de la newsletter")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pa-6" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p class="text-body-1 mb-6 text-center text-medium-emphasis"${_scopeId4}> Nous sommes d\xE9sol\xE9s de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous d\xE9sabonner de notre newsletter. </p>`);
                              _push5(ssrRenderComponent(VForm, { onSubmit: unsubscribe }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: email.value,
                                      "onUpdate:modelValue": ($event) => email.value = $event,
                                      label: "Adresse e-mail",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      variant: "outlined",
                                      rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                      required: "",
                                      class: "mb-6"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<div class="d-flex align-center justify-center ga-4"${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      "prepend-icon": "mdi-arrow-left",
                                      variant: "tonal",
                                      color: "primary",
                                      onClick: goToLogin
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Annuler `);
                                        } else {
                                          return [
                                            createTextVNode(" Annuler ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VBtn, {
                                      "prepend-icon": "mdi-email-remove-outline",
                                      variant: "tonal",
                                      color: "error",
                                      type: "submit",
                                      onClick: unsubscribe
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Se d\xE9sabonner `);
                                        } else {
                                          return [
                                            createTextVNode(" Se d\xE9sabonner ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        modelValue: email.value,
                                        "onUpdate:modelValue": ($event) => email.value = $event,
                                        label: "Adresse e-mail",
                                        "prepend-inner-icon": "mdi-email-outline",
                                        variant: "outlined",
                                        rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                        required: "",
                                        class: "mb-6"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                      createVNode("div", { class: "d-flex align-center justify-center ga-4" }, [
                                        createVNode(VBtn, {
                                          "prepend-icon": "mdi-arrow-left",
                                          variant: "tonal",
                                          color: "primary",
                                          onClick: goToLogin
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Annuler ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          "prepend-icon": "mdi-email-remove-outline",
                                          variant: "tonal",
                                          color: "error",
                                          type: "submit",
                                          onClick: unsubscribe
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Se d\xE9sabonner ")
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("p", { class: "text-body-1 mb-6 text-center text-medium-emphasis" }, " Nous sommes d\xE9sol\xE9s de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous d\xE9sabonner de notre newsletter. "),
                                createVNode(VForm, {
                                  onSubmit: withModifiers(unsubscribe, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: email.value,
                                      "onUpdate:modelValue": ($event) => email.value = $event,
                                      label: "Adresse e-mail",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      variant: "outlined",
                                      rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                      required: "",
                                      class: "mb-6"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                    createVNode("div", { class: "d-flex align-center justify-center ga-4" }, [
                                      createVNode(VBtn, {
                                        "prepend-icon": "mdi-arrow-left",
                                        variant: "tonal",
                                        color: "primary",
                                        onClick: goToLogin
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Annuler ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        "prepend-icon": "mdi-email-remove-outline",
                                        variant: "tonal",
                                        color: "error",
                                        type: "submit",
                                        onClick: unsubscribe
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Se d\xE9sabonner ")
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "text-center pt-0 pb-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p class="text-caption text-medium-emphasis"${_scopeId4}> Si vous avez des questions, n&#39;h\xE9sitez pas \xE0 nous contacter \xE0 <a href="mailto:support@example.com" class="text-primary"${_scopeId4}>devunity@support.com</a></p>`);
                            } else {
                              return [
                                createVNode("p", { class: "text-caption text-medium-emphasis" }, [
                                  createTextVNode(" Si vous avez des questions, n'h\xE9sitez pas \xE0 nous contacter \xE0 "),
                                  createVNode("a", {
                                    href: "mailto:support@example.com",
                                    class: "text-primary"
                                  }, "devunity@support.com")
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardItem, { class: "bg-primary text-center pa-6 rounded-t-xl" }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "48",
                                color: "white",
                                class: "mb-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-email-remove")
                                ]),
                                _: 1
                              }),
                              createVNode("h1", { class: "text-h4 text-white font-weight-bold" }, "Se d\xE9sabonner de la newsletter")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pa-6" }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "text-body-1 mb-6 text-center text-medium-emphasis" }, " Nous sommes d\xE9sol\xE9s de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous d\xE9sabonner de notre newsletter. "),
                              createVNode(VForm, {
                                onSubmit: withModifiers(unsubscribe, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: email.value,
                                    "onUpdate:modelValue": ($event) => email.value = $event,
                                    label: "Adresse e-mail",
                                    "prepend-inner-icon": "mdi-email-outline",
                                    variant: "outlined",
                                    rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                    required: "",
                                    class: "mb-6"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                  createVNode("div", { class: "d-flex align-center justify-center ga-4" }, [
                                    createVNode(VBtn, {
                                      "prepend-icon": "mdi-arrow-left",
                                      variant: "tonal",
                                      color: "primary",
                                      onClick: goToLogin
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Annuler ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VBtn, {
                                      "prepend-icon": "mdi-email-remove-outline",
                                      variant: "tonal",
                                      color: "error",
                                      type: "submit",
                                      onClick: unsubscribe
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Se d\xE9sabonner ")
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "text-center pt-0 pb-4" }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "text-caption text-medium-emphasis" }, [
                                createTextVNode(" Si vous avez des questions, n'h\xE9sitez pas \xE0 nous contacter \xE0 "),
                                createVNode("a", {
                                  href: "mailto:support@example.com",
                                  class: "text-primary"
                                }, "devunity@support.com")
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VSnackbar, {
                    modelValue: snackbar.value.show,
                    "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                    color: snackbar.value.color,
                    timeout: "3000",
                    location: "top right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(snackbar.value.text)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(snackbar.value.text), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCard, {
                      "max-width": "550",
                      class: "mx-auto rounded-xl elevation-5"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardItem, { class: "bg-primary text-center pa-6 rounded-t-xl" }, {
                          default: withCtx(() => [
                            createVNode(VIcon, {
                              size: "48",
                              color: "white",
                              class: "mb-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-email-remove")
                              ]),
                              _: 1
                            }),
                            createVNode("h1", { class: "text-h4 text-white font-weight-bold" }, "Se d\xE9sabonner de la newsletter")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pa-6" }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "text-body-1 mb-6 text-center text-medium-emphasis" }, " Nous sommes d\xE9sol\xE9s de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous d\xE9sabonner de notre newsletter. "),
                            createVNode(VForm, {
                              onSubmit: withModifiers(unsubscribe, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: email.value,
                                  "onUpdate:modelValue": ($event) => email.value = $event,
                                  label: "Adresse e-mail",
                                  "prepend-inner-icon": "mdi-email-outline",
                                  variant: "outlined",
                                  rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                  required: "",
                                  class: "mb-6"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                createVNode("div", { class: "d-flex align-center justify-center ga-4" }, [
                                  createVNode(VBtn, {
                                    "prepend-icon": "mdi-arrow-left",
                                    variant: "tonal",
                                    color: "primary",
                                    onClick: goToLogin
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Annuler ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    "prepend-icon": "mdi-email-remove-outline",
                                    variant: "tonal",
                                    color: "error",
                                    type: "submit",
                                    onClick: unsubscribe
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Se d\xE9sabonner ")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "text-center pt-0 pb-4" }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "text-caption text-medium-emphasis" }, [
                              createTextVNode(" Si vous avez des questions, n'h\xE9sitez pas \xE0 nous contacter \xE0 "),
                              createVNode("a", {
                                href: "mailto:support@example.com",
                                class: "text-primary"
                              }, "devunity@support.com")
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VSnackbar, {
                      modelValue: snackbar.value.show,
                      "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                      color: snackbar.value.color,
                      timeout: "3000",
                      location: "top right"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(snackbar.value.text), 1)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "color"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, {
                class: "d-flex align-center justify-center",
                style: { "min-height": "100vh" }
              }, {
                default: withCtx(() => [
                  createVNode(VCard, {
                    "max-width": "550",
                    class: "mx-auto rounded-xl elevation-5"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardItem, { class: "bg-primary text-center pa-6 rounded-t-xl" }, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            size: "48",
                            color: "white",
                            class: "mb-2"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-email-remove")
                            ]),
                            _: 1
                          }),
                          createVNode("h1", { class: "text-h4 text-white font-weight-bold" }, "Se d\xE9sabonner de la newsletter")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pa-6" }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "text-body-1 mb-6 text-center text-medium-emphasis" }, " Nous sommes d\xE9sol\xE9s de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous d\xE9sabonner de notre newsletter. "),
                          createVNode(VForm, {
                            onSubmit: withModifiers(unsubscribe, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: email.value,
                                "onUpdate:modelValue": ($event) => email.value = $event,
                                label: "Adresse e-mail",
                                "prepend-inner-icon": "mdi-email-outline",
                                variant: "outlined",
                                rules: [(v) => !!v || "L'email est requis", (v) => /.+@.+\..+/.test(v) || "Veuillez entrer une adresse email valide"],
                                required: "",
                                class: "mb-6"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                              createVNode("div", { class: "d-flex align-center justify-center ga-4" }, [
                                createVNode(VBtn, {
                                  "prepend-icon": "mdi-arrow-left",
                                  variant: "tonal",
                                  color: "primary",
                                  onClick: goToLogin
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Annuler ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VBtn, {
                                  "prepend-icon": "mdi-email-remove-outline",
                                  variant: "tonal",
                                  color: "error",
                                  type: "submit",
                                  onClick: unsubscribe
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Se d\xE9sabonner ")
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "text-center pt-0 pb-4" }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "text-caption text-medium-emphasis" }, [
                            createTextVNode(" Si vous avez des questions, n'h\xE9sitez pas \xE0 nous contacter \xE0 "),
                            createVNode("a", {
                              href: "mailto:support@example.com",
                              class: "text-primary"
                            }, "devunity@support.com")
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VSnackbar, {
                    modelValue: snackbar.value.show,
                    "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                    color: snackbar.value.color,
                    timeout: "3000",
                    location: "top right"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(snackbar.value.text), 1)
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue", "color"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/unsubscribe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=unsubscribe-DkrxYLCP.mjs.map
