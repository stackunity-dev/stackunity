import { _ as __nuxt_component_0 } from './nuxt-link-DxjINoOo.mjs';
import { defineComponent, ref, withCtx, createVNode, createTextVNode, unref, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-BNA1C2Ca.mjs';
import { _ as _export_sfc, bJ as useCookieStore, V as VApp, e as VSpacer, f as VBtn, g as VCard, a1 as VList, Z as VListItem, $ as VListItemTitle, aN as VListItemSubtitle, a2 as VCardActions, h as VIcon, a0 as VDialog, X as VCardTitle, bK as VCardSubtitle, Y as VCardText, bt as VSwitch, j as VDivider } from './server.mjs';
import { u as useHead } from './index-C2merokO.mjs';
import { V as VAppBar } from './VAppBar-Dcl-vB5D.mjs';
import { V as VContainer } from './VContainer-fRL-Auqv.mjs';
import { V as VMain } from './VMain-BRDwGZ62.mjs';
import { V as VRow, a as VCol } from './VRow-5FS9XbeV.mjs';
import { V as VTable } from './VTable-B48xBhMG.mjs';
import { V as VExpansionPanels, a as VExpansionPanel, b as VExpansionPanelTitle, c as VExpansionPanelText } from './VExpansionPanels-CMqi_ZOx.mjs';
import { V as VFooter } from './VFooter-CcHDgkCU.mjs';
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
import './VToolbar-Cwh-hMsA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cookies",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Cookie Policy - DevUnity",
      meta: [
        { name: "description", content: "Learn how DevUnity uses cookies and similar technologies to improve your experience on our platform." },
        { name: "keywords", content: "cookies, policy, privacy, DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "author", content: "DevUnity" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "theme-color", content: "#000000" },
        { name: "og:title", content: "Cookie Policy - DevUnity" },
        { name: "og:description", content: "Learn how DevUnity uses cookies and similar technologies to improve your experience on our platform." },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const cookieStore = useCookieStore();
    const showSettings = ref(false);
    function openCookieSettings() {
      showSettings.value = true;
    }
    function resetCookies() {
      cookieStore.resetConsent();
      (void 0).location.reload();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VAppBar, {
              app: "",
              flat: "",
              elevation: "2",
              color: "surface"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, { class: "d-flex align-center py-0 my-0" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: "/",
                          class: "text-decoration-none"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex align-center" data-v-9ddc80c3${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" data-v-9ddc80c3${_scopeId4}></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode("img", {
                                    src: _imports_0,
                                    alt: "DevUnity title",
                                    width: "150"
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          to: "/",
                          class: "ml-4"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Back to Home`);
                            } else {
                              return [
                                createTextVNode("Back to Home")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: "/",
                            class: "text-decoration-none"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center" }, [
                                createVNode("img", {
                                  src: _imports_0,
                                  alt: "DevUnity title",
                                  width: "150"
                                })
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            color: "primary",
                            to: "/",
                            class: "ml-4"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Back to Home")
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
                    createVNode(VContainer, { class: "d-flex align-center py-0 my-0" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, {
                          to: "/",
                          class: "text-decoration-none"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "DevUnity title",
                                width: "150"
                              })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          color: "primary",
                          to: "/",
                          class: "ml-4"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Back to Home")
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
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, { class: "py-12" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { justify: "center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "10",
                                lg: "8"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<h1 class="text-h3 font-weight-bold mb-6" data-v-9ddc80c3${_scopeId6}>Cookie Policy</h1><p class="text-body-1 mb-6 font-italic" data-v-9ddc80c3${_scopeId6}> Last updated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p>`);
                                          _push7(ssrRenderComponent(VCard, {
                                            color: "surface",
                                            variant: "outlined",
                                            class: "mb-6 pa-4"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<h3 class="text-h6 font-weight-bold mb-3" data-v-9ddc80c3${_scopeId7}>Current status of your preferences</h3>`);
                                                _push8(ssrRenderComponent(VList, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VListItem, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Essential cookies:`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Essential cookies:")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItemSubtitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`${ssrInterpolate(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled")}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Essential cookies:")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItemSubtitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Functional cookies:`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Functional cookies:")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItemSubtitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`${ssrInterpolate(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled")}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Functional cookies:")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItemSubtitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Analytical cookies:`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Analytical cookies:")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItemSubtitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`${ssrInterpolate(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled")}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Analytical cookies:")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItemSubtitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Marketing cookies:`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Marketing cookies:")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItemSubtitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`${ssrInterpolate(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled")}`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Marketing cookies:")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItemSubtitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VListItem, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Essential cookies:")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItemSubtitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Functional cookies:")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItemSubtitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Analytical cookies:")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItemSubtitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Marketing cookies:")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItemSubtitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
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
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VCardActions, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VBtn, {
                                                        color: "primary",
                                                        onClick: openCookieSettings
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VIcon, { start: "" }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`mdi-cookie-settings`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("mdi-cookie-settings")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(` Modify settings `);
                                                          } else {
                                                            return [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-cookie-settings")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Modify settings ")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VBtn, {
                                                        color: "error",
                                                        variant: "outlined",
                                                        onClick: resetCookies
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VIcon, { start: "" }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`mdi-cookie-remove`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("mdi-cookie-remove")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(` Delete all cookies `);
                                                          } else {
                                                            return [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-cookie-remove")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Delete all cookies ")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VBtn, {
                                                          color: "primary",
                                                          onClick: openCookieSettings
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-cookie-settings")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Modify settings ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VBtn, {
                                                          color: "error",
                                                          variant: "outlined",
                                                          onClick: resetCookies
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-cookie-remove")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Delete all cookies ")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                                  createVNode(VList, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItem, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Essential cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Functional cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Analytical cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Marketing cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardActions, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VBtn, {
                                                        color: "primary",
                                                        onClick: openCookieSettings
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-cookie-settings")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Modify settings ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VBtn, {
                                                        color: "error",
                                                        variant: "outlined",
                                                        onClick: resetCookies
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-cookie-remove")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Delete all cookies ")
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
                                          }, _parent7, _scopeId6));
                                          _push7(`<p class="text-subtitle-1 mb-6" data-v-9ddc80c3${_scopeId6}> This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>What is a cookie?</h2><p class="text-body-1 mb-6" data-v-9ddc80c3${_scopeId6}> A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don&#39;t have to re-enter them every time you come back to the site or browse from one page to another. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>How do we use cookies?</h2><p class="text-body-1 mb-4" data-v-9ddc80c3${_scopeId6}> We use different types of cookies for various reasons: </p><ul class="mb-6" data-v-9ddc80c3${_scopeId6}><li class="mb-3" data-v-9ddc80c3${_scopeId6}><strong data-v-9ddc80c3${_scopeId6}>Essential cookies</strong>: These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. </li><li class="mb-3" data-v-9ddc80c3${_scopeId6}><strong data-v-9ddc80c3${_scopeId6}>Performance cookies</strong>: These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. </li><li class="mb-3" data-v-9ddc80c3${_scopeId6}><strong data-v-9ddc80c3${_scopeId6}>Functional cookies</strong>: These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. </li><li class="mb-3" data-v-9ddc80c3${_scopeId6}><strong data-v-9ddc80c3${_scopeId6}>Targeting cookies</strong>: These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. </li></ul><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>List of cookies used</h2><div class="mb-8" data-v-9ddc80c3${_scopeId6}>`);
                                          _push7(ssrRenderComponent(VTable, { class: "rounded-lg" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<thead data-v-9ddc80c3${_scopeId7}><tr data-v-9ddc80c3${_scopeId7}><th data-v-9ddc80c3${_scopeId7}>Cookie name</th><th data-v-9ddc80c3${_scopeId7}>Type</th><th data-v-9ddc80c3${_scopeId7}>Duration</th><th data-v-9ddc80c3${_scopeId7}>Description</th></tr></thead><tbody data-v-9ddc80c3${_scopeId7}><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>devunity_session</code></td><td data-v-9ddc80c3${_scopeId7}>Essential</td><td data-v-9ddc80c3${_scopeId7}>Session or 14 days</td><td data-v-9ddc80c3${_scopeId7}>Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the &quot;Remember me&quot; option when logging in, in which case it persists for 14 days.</td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>token</code></td><td data-v-9ddc80c3${_scopeId7}>Essential</td><td data-v-9ddc80c3${_scopeId7}>7 days</td><td data-v-9ddc80c3${_scopeId7}>Contains your encrypted authentication token, necessary to access secure areas of the site. </td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>devunity_preferences</code></td><td data-v-9ddc80c3${_scopeId7}>Essential</td><td data-v-9ddc80c3${_scopeId7}>6 months</td><td data-v-9ddc80c3${_scopeId7}>Stores your user interface preferences, such as dark/light theme and display settings.</td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>devunity_cookie_consent</code></td><td data-v-9ddc80c3${_scopeId7}>Essential</td><td data-v-9ddc80c3${_scopeId7}>12 months</td><td data-v-9ddc80c3${_scopeId7}>Records your preferences regarding the use of cookies on our site.</td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>devunity_lastvisit</code></td><td data-v-9ddc80c3${_scopeId7}>Functional</td><td data-v-9ddc80c3${_scopeId7}>30 days</td><td data-v-9ddc80c3${_scopeId7}>Remembers your last visit to redirect you to your recent projects.</td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>devunity_recent_projects</code></td><td data-v-9ddc80c3${_scopeId7}>Functional</td><td data-v-9ddc80c3${_scopeId7}>90 days</td><td data-v-9ddc80c3${_scopeId7}>Stores the list of your recently viewed projects for quick access.</td></tr><tr data-v-9ddc80c3${_scopeId7}><td data-v-9ddc80c3${_scopeId7}><code data-v-9ddc80c3${_scopeId7}>_ga, _gid, _gat</code></td><td data-v-9ddc80c3${_scopeId7}>Analytical</td><td data-v-9ddc80c3${_scopeId7}>_ga: 2 years, _gid: 24h, _gat: 1 min</td><td data-v-9ddc80c3${_scopeId7}>Google Analytics cookies used to distinguish users and analyze their behavior on the site. </td></tr></tbody>`);
                                              } else {
                                                return [
                                                  createVNode("thead", null, [
                                                    createVNode("tr", null, [
                                                      createVNode("th", null, "Cookie name"),
                                                      createVNode("th", null, "Type"),
                                                      createVNode("th", null, "Duration"),
                                                      createVNode("th", null, "Description")
                                                    ])
                                                  ]),
                                                  createVNode("tbody", null, [
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_session")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "Session or 14 days"),
                                                      createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "token")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "7 days"),
                                                      createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_preferences")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "6 months"),
                                                      createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_cookie_consent")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "12 months"),
                                                      createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_lastvisit")
                                                      ]),
                                                      createVNode("td", null, "Functional"),
                                                      createVNode("td", null, "30 days"),
                                                      createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_recent_projects")
                                                      ]),
                                                      createVNode("td", null, "Functional"),
                                                      createVNode("td", null, "90 days"),
                                                      createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "_ga, _gid, _gat")
                                                      ]),
                                                      createVNode("td", null, "Analytical"),
                                                      createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                                      createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                                    ])
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`</div><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>How to manage cookies</h2><div class="mb-8" data-v-9ddc80c3${_scopeId6}><p class="mb-3" data-v-9ddc80c3${_scopeId6}>You can decide at any time to accept or refuse cookies on our site in two ways:</p><h3 class="text-h6 font-weight-bold mb-3" data-v-9ddc80c3${_scopeId6}>1. Use our cookie management panel</h3><p class="mb-3" data-v-9ddc80c3${_scopeId6}> We offer a cookie management panel integrated into our site, accessible at any time via the `);
                                          _push7(ssrRenderComponent(VIcon, { small: "" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-cookie-settings`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-cookie-settings")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` button located at the bottom right of your screen. </p><p class="mb-6" data-v-9ddc80c3${_scopeId6}> This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. </p>`);
                                          _push7(ssrRenderComponent(VBtn, {
                                            color: "primary",
                                            class: "mb-6",
                                            onClick: openCookieSettings
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VIcon, { start: "" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-cookie-settings`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-cookie-settings")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(` Open cookie settings `);
                                              } else {
                                                return [
                                                  createVNode(VIcon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-cookie-settings")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Open cookie settings ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`<h3 class="text-h6 font-weight-bold mb-3 mt-4" data-v-9ddc80c3${_scopeId6}>2. Modify your browser settings</h3></div><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>Instructions for disabling cookies</h2><p class="text-body-1 mb-4" data-v-9ddc80c3${_scopeId6}> Here&#39;s how to disable cookies in the most popular browsers: </p>`);
                                          _push7(ssrRenderComponent(VExpansionPanels, { class: "mb-6" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VExpansionPanel, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VExpansionPanelTitle, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Chrome`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Chrome")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VExpansionPanelText, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<ol data-v-9ddc80c3${_scopeId9}><li data-v-9ddc80c3${_scopeId9}>Click on the Chrome menu in the toolbar</li><li data-v-9ddc80c3${_scopeId9}>Select &quot;Settings&quot;</li><li data-v-9ddc80c3${_scopeId9}>Click on &quot;Privacy and security&quot;</li><li data-v-9ddc80c3${_scopeId9}>Click on &quot;Cookies and other site data&quot;</li><li data-v-9ddc80c3${_scopeId9}>Choose your cookie options</li></ol>`);
                                                          } else {
                                                            return [
                                                              createVNode("ol", null, [
                                                                createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                                createVNode("li", null, 'Select "Settings"'),
                                                                createVNode("li", null, 'Click on "Privacy and security"'),
                                                                createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                                createVNode("li", null, "Choose your cookie options")
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VExpansionPanelTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Chrome")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VExpansionPanelText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("ol", null, [
                                                              createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                              createVNode("li", null, 'Select "Settings"'),
                                                              createVNode("li", null, 'Click on "Privacy and security"'),
                                                              createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                              createVNode("li", null, "Choose your cookie options")
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VExpansionPanel, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VExpansionPanelTitle, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Firefox`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Firefox")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VExpansionPanelText, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<ol data-v-9ddc80c3${_scopeId9}><li data-v-9ddc80c3${_scopeId9}>Click on the Firefox menu</li><li data-v-9ddc80c3${_scopeId9}>Select &quot;Options&quot;</li><li data-v-9ddc80c3${_scopeId9}>Go to the &quot;Privacy &amp; Security&quot; tab</li><li data-v-9ddc80c3${_scopeId9}>In the &quot;Enhanced Tracking Protection&quot; section, choose &quot;Custom&quot;</li><li data-v-9ddc80c3${_scopeId9}>Check or uncheck &quot;Cookies&quot; according to your preferences</li></ol>`);
                                                          } else {
                                                            return [
                                                              createVNode("ol", null, [
                                                                createVNode("li", null, "Click on the Firefox menu"),
                                                                createVNode("li", null, 'Select "Options"'),
                                                                createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                                createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                                createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VExpansionPanelTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Firefox")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VExpansionPanelText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("ol", null, [
                                                              createVNode("li", null, "Click on the Firefox menu"),
                                                              createVNode("li", null, 'Select "Options"'),
                                                              createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                              createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                              createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VExpansionPanel, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VExpansionPanelTitle, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Safari`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Safari")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VExpansionPanelText, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<ol data-v-9ddc80c3${_scopeId9}><li data-v-9ddc80c3${_scopeId9}>In the Safari menu, select &quot;Preferences&quot;</li><li data-v-9ddc80c3${_scopeId9}>Click on the &quot;Privacy&quot; tab</li><li data-v-9ddc80c3${_scopeId9}>In the &quot;Cookies and website data&quot; section, choose your preferred option</li></ol>`);
                                                          } else {
                                                            return [
                                                              createVNode("ol", null, [
                                                                createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                                createVNode("li", null, 'Click on the "Privacy" tab'),
                                                                createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VExpansionPanelTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Safari")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VExpansionPanelText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("ol", null, [
                                                              createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                              createVNode("li", null, 'Click on the "Privacy" tab'),
                                                              createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VExpansionPanel, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VExpansionPanelTitle, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`Microsoft Edge`);
                                                          } else {
                                                            return [
                                                              createTextVNode("Microsoft Edge")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VExpansionPanelText, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<ol data-v-9ddc80c3${_scopeId9}><li data-v-9ddc80c3${_scopeId9}>Click on the Edge menu (the three dots in the upper right corner)</li><li data-v-9ddc80c3${_scopeId9}>Select &quot;Settings&quot;</li><li data-v-9ddc80c3${_scopeId9}>Click on &quot;Privacy, search, and services&quot;</li><li data-v-9ddc80c3${_scopeId9}>Under &quot;Privacy&quot;, choose your cookie blocking level</li></ol>`);
                                                          } else {
                                                            return [
                                                              createVNode("ol", null, [
                                                                createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                                createVNode("li", null, 'Select "Settings"'),
                                                                createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                                createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VExpansionPanelTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Microsoft Edge")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VExpansionPanelText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("ol", null, [
                                                              createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                              createVNode("li", null, 'Select "Settings"'),
                                                              createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                              createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VExpansionPanel, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VExpansionPanelTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Chrome")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VExpansionPanelText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("ol", null, [
                                                            createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                            createVNode("li", null, 'Select "Settings"'),
                                                            createVNode("li", null, 'Click on "Privacy and security"'),
                                                            createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                            createVNode("li", null, "Choose your cookie options")
                                                          ])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanel, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VExpansionPanelTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Firefox")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VExpansionPanelText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("ol", null, [
                                                            createVNode("li", null, "Click on the Firefox menu"),
                                                            createVNode("li", null, 'Select "Options"'),
                                                            createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                            createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                            createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                          ])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanel, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VExpansionPanelTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Safari")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VExpansionPanelText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("ol", null, [
                                                            createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                            createVNode("li", null, 'Click on the "Privacy" tab'),
                                                            createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                          ])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanel, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VExpansionPanelTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Microsoft Edge")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VExpansionPanelText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("ol", null, [
                                                            createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                            createVNode("li", null, 'Select "Settings"'),
                                                            createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                            createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                          ])
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
                                          }, _parent7, _scopeId6));
                                          _push7(`<h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>Changes to our cookie policy</h2><p class="text-body-1 mb-6" data-v-9ddc80c3${_scopeId6}> We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-9ddc80c3${_scopeId6}>Contact us</h2><p class="text-body-1 mb-6" data-v-9ddc80c3${_scopeId6}> If you have any questions about our use of cookies or other technologies, please contact us at <a href="mailto:privacy@devunity.com" class="text-decoration-underline" data-v-9ddc80c3${_scopeId6}>privacy@devunity.com</a>. </p>`);
                                        } else {
                                          return [
                                            createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                            createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                            createVNode(VCard, {
                                              color: "surface",
                                              variant: "outlined",
                                              class: "mb-6 pa-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                                createVNode(VList, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Essential cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Functional cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Analytical cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Marketing cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCardActions, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VBtn, {
                                                      color: "primary",
                                                      onClick: openCookieSettings
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-cookie-settings")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Modify settings ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VBtn, {
                                                      color: "error",
                                                      variant: "outlined",
                                                      onClick: resetCookies
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-cookie-remove")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Delete all cookies ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                            createVNode("ul", { class: "mb-6" }, [
                                              createVNode("li", { class: "mb-3" }, [
                                                createVNode("strong", null, "Essential cookies"),
                                                createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                              ]),
                                              createVNode("li", { class: "mb-3" }, [
                                                createVNode("strong", null, "Performance cookies"),
                                                createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                              ]),
                                              createVNode("li", { class: "mb-3" }, [
                                                createVNode("strong", null, "Functional cookies"),
                                                createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                              ]),
                                              createVNode("li", { class: "mb-3" }, [
                                                createVNode("strong", null, "Targeting cookies"),
                                                createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                              ])
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                            createVNode("div", { class: "mb-8" }, [
                                              createVNode(VTable, { class: "rounded-lg" }, {
                                                default: withCtx(() => [
                                                  createVNode("thead", null, [
                                                    createVNode("tr", null, [
                                                      createVNode("th", null, "Cookie name"),
                                                      createVNode("th", null, "Type"),
                                                      createVNode("th", null, "Duration"),
                                                      createVNode("th", null, "Description")
                                                    ])
                                                  ]),
                                                  createVNode("tbody", null, [
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_session")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "Session or 14 days"),
                                                      createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "token")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "7 days"),
                                                      createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_preferences")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "6 months"),
                                                      createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_cookie_consent")
                                                      ]),
                                                      createVNode("td", null, "Essential"),
                                                      createVNode("td", null, "12 months"),
                                                      createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_lastvisit")
                                                      ]),
                                                      createVNode("td", null, "Functional"),
                                                      createVNode("td", null, "30 days"),
                                                      createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "devunity_recent_projects")
                                                      ]),
                                                      createVNode("td", null, "Functional"),
                                                      createVNode("td", null, "90 days"),
                                                      createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                                    ]),
                                                    createVNode("tr", null, [
                                                      createVNode("td", null, [
                                                        createVNode("code", null, "_ga, _gid, _gat")
                                                      ]),
                                                      createVNode("td", null, "Analytical"),
                                                      createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                                      createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                                    ])
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                            createVNode("div", { class: "mb-8" }, [
                                              createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                              createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                              createVNode("p", { class: "mb-3" }, [
                                                createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                                createVNode(VIcon, { small: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-cookie-settings")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" button located at the bottom right of your screen. ")
                                              ]),
                                              createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                              createVNode(VBtn, {
                                                color: "primary",
                                                class: "mb-6",
                                                onClick: openCookieSettings
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-cookie-settings")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Open cookie settings ")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                            createVNode(VExpansionPanels, { class: "mb-6" }, {
                                              default: withCtx(() => [
                                                createVNode(VExpansionPanel, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VExpansionPanelTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Chrome")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VExpansionPanelText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("ol", null, [
                                                          createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                          createVNode("li", null, 'Select "Settings"'),
                                                          createVNode("li", null, 'Click on "Privacy and security"'),
                                                          createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                          createVNode("li", null, "Choose your cookie options")
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanel, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VExpansionPanelTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Firefox")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VExpansionPanelText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("ol", null, [
                                                          createVNode("li", null, "Click on the Firefox menu"),
                                                          createVNode("li", null, 'Select "Options"'),
                                                          createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                          createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                          createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanel, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VExpansionPanelTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Safari")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VExpansionPanelText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("ol", null, [
                                                          createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                          createVNode("li", null, 'Click on the "Privacy" tab'),
                                                          createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanel, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VExpansionPanelTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Microsoft Edge")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VExpansionPanelText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("ol", null, [
                                                          createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                          createVNode("li", null, 'Select "Settings"'),
                                                          createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                          createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, [
                                              createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                              createVNode("a", {
                                                href: "mailto:privacy@devunity.com",
                                                class: "text-decoration-underline"
                                              }, "privacy@devunity.com"),
                                              createTextVNode(". ")
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                        default: withCtx(() => [
                                          createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                          createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                          createVNode(VCard, {
                                            color: "surface",
                                            variant: "outlined",
                                            class: "mb-6 pa-4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                              createVNode(VList, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Essential cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Functional cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Analytical cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Marketing cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCardActions, null, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    color: "primary",
                                                    onClick: openCookieSettings
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-cookie-settings")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Modify settings ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VBtn, {
                                                    color: "error",
                                                    variant: "outlined",
                                                    onClick: resetCookies
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-cookie-remove")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Delete all cookies ")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                          createVNode("ul", { class: "mb-6" }, [
                                            createVNode("li", { class: "mb-3" }, [
                                              createVNode("strong", null, "Essential cookies"),
                                              createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                            ]),
                                            createVNode("li", { class: "mb-3" }, [
                                              createVNode("strong", null, "Performance cookies"),
                                              createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                            ]),
                                            createVNode("li", { class: "mb-3" }, [
                                              createVNode("strong", null, "Functional cookies"),
                                              createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                            ]),
                                            createVNode("li", { class: "mb-3" }, [
                                              createVNode("strong", null, "Targeting cookies"),
                                              createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                            ])
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                          createVNode("div", { class: "mb-8" }, [
                                            createVNode(VTable, { class: "rounded-lg" }, {
                                              default: withCtx(() => [
                                                createVNode("thead", null, [
                                                  createVNode("tr", null, [
                                                    createVNode("th", null, "Cookie name"),
                                                    createVNode("th", null, "Type"),
                                                    createVNode("th", null, "Duration"),
                                                    createVNode("th", null, "Description")
                                                  ])
                                                ]),
                                                createVNode("tbody", null, [
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "devunity_session")
                                                    ]),
                                                    createVNode("td", null, "Essential"),
                                                    createVNode("td", null, "Session or 14 days"),
                                                    createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "token")
                                                    ]),
                                                    createVNode("td", null, "Essential"),
                                                    createVNode("td", null, "7 days"),
                                                    createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "devunity_preferences")
                                                    ]),
                                                    createVNode("td", null, "Essential"),
                                                    createVNode("td", null, "6 months"),
                                                    createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "devunity_cookie_consent")
                                                    ]),
                                                    createVNode("td", null, "Essential"),
                                                    createVNode("td", null, "12 months"),
                                                    createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "devunity_lastvisit")
                                                    ]),
                                                    createVNode("td", null, "Functional"),
                                                    createVNode("td", null, "30 days"),
                                                    createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "devunity_recent_projects")
                                                    ]),
                                                    createVNode("td", null, "Functional"),
                                                    createVNode("td", null, "90 days"),
                                                    createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                                  ]),
                                                  createVNode("tr", null, [
                                                    createVNode("td", null, [
                                                      createVNode("code", null, "_ga, _gid, _gat")
                                                    ]),
                                                    createVNode("td", null, "Analytical"),
                                                    createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                                    createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                                  ])
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                          createVNode("div", { class: "mb-8" }, [
                                            createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                            createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                            createVNode("p", { class: "mb-3" }, [
                                              createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                              createVNode(VIcon, { small: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-settings")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" button located at the bottom right of your screen. ")
                                            ]),
                                            createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                            createVNode(VBtn, {
                                              color: "primary",
                                              class: "mb-6",
                                              onClick: openCookieSettings
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, { start: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-cookie-settings")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Open cookie settings ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                          createVNode(VExpansionPanels, { class: "mb-6" }, {
                                            default: withCtx(() => [
                                              createVNode(VExpansionPanel, null, {
                                                default: withCtx(() => [
                                                  createVNode(VExpansionPanelTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Chrome")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanelText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("ol", null, [
                                                        createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                        createVNode("li", null, 'Select "Settings"'),
                                                        createVNode("li", null, 'Click on "Privacy and security"'),
                                                        createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                        createVNode("li", null, "Choose your cookie options")
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanel, null, {
                                                default: withCtx(() => [
                                                  createVNode(VExpansionPanelTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Firefox")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanelText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("ol", null, [
                                                        createVNode("li", null, "Click on the Firefox menu"),
                                                        createVNode("li", null, 'Select "Options"'),
                                                        createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                        createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                        createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanel, null, {
                                                default: withCtx(() => [
                                                  createVNode(VExpansionPanelTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Safari")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanelText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("ol", null, [
                                                        createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                        createVNode("li", null, 'Click on the "Privacy" tab'),
                                                        createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanel, null, {
                                                default: withCtx(() => [
                                                  createVNode(VExpansionPanelTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Microsoft Edge")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VExpansionPanelText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("ol", null, [
                                                        createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                        createVNode("li", null, 'Select "Settings"'),
                                                        createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                        createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, [
                                            createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                            createVNode("a", {
                                              href: "mailto:privacy@devunity.com",
                                              class: "text-decoration-underline"
                                            }, "privacy@devunity.com"),
                                            createTextVNode(". ")
                                          ])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "10",
                                  lg: "8"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                      default: withCtx(() => [
                                        createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                        createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                        createVNode(VCard, {
                                          color: "surface",
                                          variant: "outlined",
                                          class: "mb-6 pa-4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                            createVNode(VList, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Essential cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Functional cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Analytical cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Marketing cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCardActions, null, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  color: "primary",
                                                  onClick: openCookieSettings
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, { start: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-cookie-settings")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" Modify settings ")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VBtn, {
                                                  color: "error",
                                                  variant: "outlined",
                                                  onClick: resetCookies
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, { start: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-cookie-remove")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" Delete all cookies ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                        createVNode("ul", { class: "mb-6" }, [
                                          createVNode("li", { class: "mb-3" }, [
                                            createVNode("strong", null, "Essential cookies"),
                                            createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                          ]),
                                          createVNode("li", { class: "mb-3" }, [
                                            createVNode("strong", null, "Performance cookies"),
                                            createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                          ]),
                                          createVNode("li", { class: "mb-3" }, [
                                            createVNode("strong", null, "Functional cookies"),
                                            createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                          ]),
                                          createVNode("li", { class: "mb-3" }, [
                                            createVNode("strong", null, "Targeting cookies"),
                                            createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                          ])
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                        createVNode("div", { class: "mb-8" }, [
                                          createVNode(VTable, { class: "rounded-lg" }, {
                                            default: withCtx(() => [
                                              createVNode("thead", null, [
                                                createVNode("tr", null, [
                                                  createVNode("th", null, "Cookie name"),
                                                  createVNode("th", null, "Type"),
                                                  createVNode("th", null, "Duration"),
                                                  createVNode("th", null, "Description")
                                                ])
                                              ]),
                                              createVNode("tbody", null, [
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "devunity_session")
                                                  ]),
                                                  createVNode("td", null, "Essential"),
                                                  createVNode("td", null, "Session or 14 days"),
                                                  createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "token")
                                                  ]),
                                                  createVNode("td", null, "Essential"),
                                                  createVNode("td", null, "7 days"),
                                                  createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "devunity_preferences")
                                                  ]),
                                                  createVNode("td", null, "Essential"),
                                                  createVNode("td", null, "6 months"),
                                                  createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "devunity_cookie_consent")
                                                  ]),
                                                  createVNode("td", null, "Essential"),
                                                  createVNode("td", null, "12 months"),
                                                  createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "devunity_lastvisit")
                                                  ]),
                                                  createVNode("td", null, "Functional"),
                                                  createVNode("td", null, "30 days"),
                                                  createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "devunity_recent_projects")
                                                  ]),
                                                  createVNode("td", null, "Functional"),
                                                  createVNode("td", null, "90 days"),
                                                  createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                                ]),
                                                createVNode("tr", null, [
                                                  createVNode("td", null, [
                                                    createVNode("code", null, "_ga, _gid, _gat")
                                                  ]),
                                                  createVNode("td", null, "Analytical"),
                                                  createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                                  createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                                ])
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                        createVNode("div", { class: "mb-8" }, [
                                          createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                          createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                          createVNode("p", { class: "mb-3" }, [
                                            createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                            createVNode(VIcon, { small: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-cookie-settings")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" button located at the bottom right of your screen. ")
                                          ]),
                                          createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                          createVNode(VBtn, {
                                            color: "primary",
                                            class: "mb-6",
                                            onClick: openCookieSettings
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-settings")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Open cookie settings ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                        createVNode(VExpansionPanels, { class: "mb-6" }, {
                                          default: withCtx(() => [
                                            createVNode(VExpansionPanel, null, {
                                              default: withCtx(() => [
                                                createVNode(VExpansionPanelTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Chrome")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanelText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("ol", null, [
                                                      createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                      createVNode("li", null, 'Select "Settings"'),
                                                      createVNode("li", null, 'Click on "Privacy and security"'),
                                                      createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                      createVNode("li", null, "Choose your cookie options")
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanel, null, {
                                              default: withCtx(() => [
                                                createVNode(VExpansionPanelTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Firefox")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanelText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("ol", null, [
                                                      createVNode("li", null, "Click on the Firefox menu"),
                                                      createVNode("li", null, 'Select "Options"'),
                                                      createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                      createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                      createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanel, null, {
                                              default: withCtx(() => [
                                                createVNode(VExpansionPanelTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Safari")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanelText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("ol", null, [
                                                      createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                      createVNode("li", null, 'Click on the "Privacy" tab'),
                                                      createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanel, null, {
                                              default: withCtx(() => [
                                                createVNode(VExpansionPanelTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Microsoft Edge")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VExpansionPanelText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("ol", null, [
                                                      createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                      createVNode("li", null, 'Select "Settings"'),
                                                      createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                      createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, [
                                          createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                          createVNode("a", {
                                            href: "mailto:privacy@devunity.com",
                                            class: "text-decoration-underline"
                                          }, "privacy@devunity.com"),
                                          createTextVNode(". ")
                                        ])
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VRow, { justify: "center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "10",
                                lg: "8"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                    default: withCtx(() => [
                                      createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                      createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                      createVNode(VCard, {
                                        color: "surface",
                                        variant: "outlined",
                                        class: "mb-6 pa-4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                          createVNode(VList, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Essential cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Functional cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Analytical cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Marketing cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCardActions, null, {
                                            default: withCtx(() => [
                                              createVNode(VBtn, {
                                                color: "primary",
                                                onClick: openCookieSettings
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-cookie-settings")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Modify settings ")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VBtn, {
                                                color: "error",
                                                variant: "outlined",
                                                onClick: resetCookies
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-cookie-remove")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Delete all cookies ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                      createVNode("ul", { class: "mb-6" }, [
                                        createVNode("li", { class: "mb-3" }, [
                                          createVNode("strong", null, "Essential cookies"),
                                          createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                        ]),
                                        createVNode("li", { class: "mb-3" }, [
                                          createVNode("strong", null, "Performance cookies"),
                                          createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                        ]),
                                        createVNode("li", { class: "mb-3" }, [
                                          createVNode("strong", null, "Functional cookies"),
                                          createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                        ]),
                                        createVNode("li", { class: "mb-3" }, [
                                          createVNode("strong", null, "Targeting cookies"),
                                          createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                        ])
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                      createVNode("div", { class: "mb-8" }, [
                                        createVNode(VTable, { class: "rounded-lg" }, {
                                          default: withCtx(() => [
                                            createVNode("thead", null, [
                                              createVNode("tr", null, [
                                                createVNode("th", null, "Cookie name"),
                                                createVNode("th", null, "Type"),
                                                createVNode("th", null, "Duration"),
                                                createVNode("th", null, "Description")
                                              ])
                                            ]),
                                            createVNode("tbody", null, [
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "devunity_session")
                                                ]),
                                                createVNode("td", null, "Essential"),
                                                createVNode("td", null, "Session or 14 days"),
                                                createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "token")
                                                ]),
                                                createVNode("td", null, "Essential"),
                                                createVNode("td", null, "7 days"),
                                                createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "devunity_preferences")
                                                ]),
                                                createVNode("td", null, "Essential"),
                                                createVNode("td", null, "6 months"),
                                                createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "devunity_cookie_consent")
                                                ]),
                                                createVNode("td", null, "Essential"),
                                                createVNode("td", null, "12 months"),
                                                createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "devunity_lastvisit")
                                                ]),
                                                createVNode("td", null, "Functional"),
                                                createVNode("td", null, "30 days"),
                                                createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "devunity_recent_projects")
                                                ]),
                                                createVNode("td", null, "Functional"),
                                                createVNode("td", null, "90 days"),
                                                createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                              ]),
                                              createVNode("tr", null, [
                                                createVNode("td", null, [
                                                  createVNode("code", null, "_ga, _gid, _gat")
                                                ]),
                                                createVNode("td", null, "Analytical"),
                                                createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                                createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                              ])
                                            ])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                      createVNode("div", { class: "mb-8" }, [
                                        createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                        createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                        createVNode("p", { class: "mb-3" }, [
                                          createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                          createVNode(VIcon, { small: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-cookie-settings")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" button located at the bottom right of your screen. ")
                                        ]),
                                        createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          class: "mb-6",
                                          onClick: openCookieSettings
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-cookie-settings")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Open cookie settings ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                      createVNode(VExpansionPanels, { class: "mb-6" }, {
                                        default: withCtx(() => [
                                          createVNode(VExpansionPanel, null, {
                                            default: withCtx(() => [
                                              createVNode(VExpansionPanelTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Chrome")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanelText, null, {
                                                default: withCtx(() => [
                                                  createVNode("ol", null, [
                                                    createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                    createVNode("li", null, 'Select "Settings"'),
                                                    createVNode("li", null, 'Click on "Privacy and security"'),
                                                    createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                    createVNode("li", null, "Choose your cookie options")
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanel, null, {
                                            default: withCtx(() => [
                                              createVNode(VExpansionPanelTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Firefox")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanelText, null, {
                                                default: withCtx(() => [
                                                  createVNode("ol", null, [
                                                    createVNode("li", null, "Click on the Firefox menu"),
                                                    createVNode("li", null, 'Select "Options"'),
                                                    createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                    createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                    createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanel, null, {
                                            default: withCtx(() => [
                                              createVNode(VExpansionPanelTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Safari")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanelText, null, {
                                                default: withCtx(() => [
                                                  createVNode("ol", null, [
                                                    createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                    createVNode("li", null, 'Click on the "Privacy" tab'),
                                                    createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanel, null, {
                                            default: withCtx(() => [
                                              createVNode(VExpansionPanelTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Microsoft Edge")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VExpansionPanelText, null, {
                                                default: withCtx(() => [
                                                  createVNode("ol", null, [
                                                    createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                    createVNode("li", null, 'Select "Settings"'),
                                                    createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                    createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, [
                                        createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                        createVNode("a", {
                                          href: "mailto:privacy@devunity.com",
                                          class: "text-decoration-underline"
                                        }, "privacy@devunity.com"),
                                        createTextVNode(". ")
                                      ])
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, { class: "py-12" }, {
                      default: withCtx(() => [
                        createVNode(VRow, { justify: "center" }, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "10",
                              lg: "8"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                  default: withCtx(() => [
                                    createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                    createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                    createVNode(VCard, {
                                      color: "surface",
                                      variant: "outlined",
                                      class: "mb-6 pa-4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                        createVNode(VList, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Essential cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Functional cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Analytical cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Marketing cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCardActions, null, {
                                          default: withCtx(() => [
                                            createVNode(VBtn, {
                                              color: "primary",
                                              onClick: openCookieSettings
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, { start: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-cookie-settings")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Modify settings ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VBtn, {
                                              color: "error",
                                              variant: "outlined",
                                              onClick: resetCookies
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, { start: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-cookie-remove")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Delete all cookies ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                    createVNode("ul", { class: "mb-6" }, [
                                      createVNode("li", { class: "mb-3" }, [
                                        createVNode("strong", null, "Essential cookies"),
                                        createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                      ]),
                                      createVNode("li", { class: "mb-3" }, [
                                        createVNode("strong", null, "Performance cookies"),
                                        createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                      ]),
                                      createVNode("li", { class: "mb-3" }, [
                                        createVNode("strong", null, "Functional cookies"),
                                        createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                      ]),
                                      createVNode("li", { class: "mb-3" }, [
                                        createVNode("strong", null, "Targeting cookies"),
                                        createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                      ])
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                    createVNode("div", { class: "mb-8" }, [
                                      createVNode(VTable, { class: "rounded-lg" }, {
                                        default: withCtx(() => [
                                          createVNode("thead", null, [
                                            createVNode("tr", null, [
                                              createVNode("th", null, "Cookie name"),
                                              createVNode("th", null, "Type"),
                                              createVNode("th", null, "Duration"),
                                              createVNode("th", null, "Description")
                                            ])
                                          ]),
                                          createVNode("tbody", null, [
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "devunity_session")
                                              ]),
                                              createVNode("td", null, "Essential"),
                                              createVNode("td", null, "Session or 14 days"),
                                              createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "token")
                                              ]),
                                              createVNode("td", null, "Essential"),
                                              createVNode("td", null, "7 days"),
                                              createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "devunity_preferences")
                                              ]),
                                              createVNode("td", null, "Essential"),
                                              createVNode("td", null, "6 months"),
                                              createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "devunity_cookie_consent")
                                              ]),
                                              createVNode("td", null, "Essential"),
                                              createVNode("td", null, "12 months"),
                                              createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "devunity_lastvisit")
                                              ]),
                                              createVNode("td", null, "Functional"),
                                              createVNode("td", null, "30 days"),
                                              createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "devunity_recent_projects")
                                              ]),
                                              createVNode("td", null, "Functional"),
                                              createVNode("td", null, "90 days"),
                                              createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                            ]),
                                            createVNode("tr", null, [
                                              createVNode("td", null, [
                                                createVNode("code", null, "_ga, _gid, _gat")
                                              ]),
                                              createVNode("td", null, "Analytical"),
                                              createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                              createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                            ])
                                          ])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                    createVNode("div", { class: "mb-8" }, [
                                      createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                      createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                      createVNode("p", { class: "mb-3" }, [
                                        createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                        createVNode(VIcon, { small: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cookie-settings")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" button located at the bottom right of your screen. ")
                                      ]),
                                      createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                      createVNode(VBtn, {
                                        color: "primary",
                                        class: "mb-6",
                                        onClick: openCookieSettings
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-cookie-settings")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Open cookie settings ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                    createVNode(VExpansionPanels, { class: "mb-6" }, {
                                      default: withCtx(() => [
                                        createVNode(VExpansionPanel, null, {
                                          default: withCtx(() => [
                                            createVNode(VExpansionPanelTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Chrome")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanelText, null, {
                                              default: withCtx(() => [
                                                createVNode("ol", null, [
                                                  createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                  createVNode("li", null, 'Select "Settings"'),
                                                  createVNode("li", null, 'Click on "Privacy and security"'),
                                                  createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                  createVNode("li", null, "Choose your cookie options")
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VExpansionPanel, null, {
                                          default: withCtx(() => [
                                            createVNode(VExpansionPanelTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Firefox")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanelText, null, {
                                              default: withCtx(() => [
                                                createVNode("ol", null, [
                                                  createVNode("li", null, "Click on the Firefox menu"),
                                                  createVNode("li", null, 'Select "Options"'),
                                                  createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                  createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                  createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VExpansionPanel, null, {
                                          default: withCtx(() => [
                                            createVNode(VExpansionPanelTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Safari")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanelText, null, {
                                              default: withCtx(() => [
                                                createVNode("ol", null, [
                                                  createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                  createVNode("li", null, 'Click on the "Privacy" tab'),
                                                  createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VExpansionPanel, null, {
                                          default: withCtx(() => [
                                            createVNode(VExpansionPanelTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Microsoft Edge")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VExpansionPanelText, null, {
                                              default: withCtx(() => [
                                                createVNode("ol", null, [
                                                  createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                  createVNode("li", null, 'Select "Settings"'),
                                                  createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                  createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, [
                                      createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                      createVNode("a", {
                                        href: "mailto:privacy@devunity.com",
                                        class: "text-decoration-underline"
                                      }, "privacy@devunity.com"),
                                      createTextVNode(". ")
                                    ])
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VFooter, { class: "py-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center" data-v-9ddc80c3${_scopeId3}><p class="text-body-2 text-medium-emphasis" data-v-9ddc80c3${_scopeId3}> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-center" }, [
                          createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div data-v-9ddc80c3${_scopeId}>`);
            _push2(ssrRenderComponent(VDialog, {
              modelValue: unref(showSettings),
              "onUpdate:modelValue": ($event) => isRef(showSettings) ? showSettings.value = $event : null,
              width: "500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, { class: "text-h5 pb-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Cookie Preferences `);
                            } else {
                              return [
                                createTextVNode(" Cookie Preferences ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardSubtitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Customize your cookie preferences `);
                            } else {
                              return [
                                createTextVNode(" Customize your cookie preferences ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VList, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VListItem, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VListItemTitle, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.essential,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                                  label: "Essential cookies",
                                                  color: "primary",
                                                  disabled: "",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSwitch, {
                                                    modelValue: unref(cookieStore).preferences.essential,
                                                    "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                                    label: "Essential cookies",
                                                    color: "primary",
                                                    disabled: "",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Necessary for the site to function, they cannot be disabled. `);
                                              } else {
                                                return [
                                                  createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.essential,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                                  label: "Essential cookies",
                                                  color: "primary",
                                                  disabled: "",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VListItemTitle, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.functional,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                                  label: "Functional cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSwitch, {
                                                    modelValue: unref(cookieStore).preferences.functional,
                                                    "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                                    label: "Functional cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Allow us to remember your preferences and personalize your experience. `);
                                              } else {
                                                return [
                                                  createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.functional,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                                  label: "Functional cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VListItemTitle, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.analytics,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                                  label: "Analytical cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSwitch, {
                                                    modelValue: unref(cookieStore).preferences.analytics,
                                                    "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                                    label: "Analytical cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Help us understand how you use our site in order to improve it. `);
                                              } else {
                                                return [
                                                  createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.analytics,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                                  label: "Analytical cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VListItemTitle, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.marketing,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                                  label: "Marketing cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSwitch, {
                                                    modelValue: unref(cookieStore).preferences.marketing,
                                                    "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                                    label: "Marketing cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Allow us to display personalized advertisements based on your interests. `);
                                              } else {
                                                return [
                                                  createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: unref(cookieStore).preferences.marketing,
                                                  "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                                  label: "Marketing cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: unref(cookieStore).preferences.essential,
                                                "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                                label: "Essential cookies",
                                                color: "primary",
                                                disabled: "",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: unref(cookieStore).preferences.functional,
                                                "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                                label: "Functional cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: unref(cookieStore).preferences.analytics,
                                                "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                                label: "Analytical cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: unref(cookieStore).preferences.marketing,
                                                "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                                label: "Marketing cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VList, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: unref(cookieStore).preferences.essential,
                                              "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                              label: "Essential cookies",
                                              color: "primary",
                                              disabled: "",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: unref(cookieStore).preferences.functional,
                                              "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                              label: "Functional cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: unref(cookieStore).preferences.analytics,
                                              "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                              label: "Analytical cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: unref(cookieStore).preferences.marketing,
                                              "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                              label: "Marketing cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardActions, { class: "pa-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "text",
                                color: "error",
                                onClick: ($event) => {
                                  unref(cookieStore).rejectNonEssentialCookies();
                                  showSettings.value = false;
                                }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Reject all `);
                                  } else {
                                    return [
                                      createTextVNode(" Reject all ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VSpacer, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "tonal",
                                color: "grey",
                                onClick: ($event) => showSettings.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Cancel `);
                                  } else {
                                    return [
                                      createTextVNode(" Cancel ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "primary",
                                variant: "elevated",
                                onClick: ($event) => {
                                  unref(cookieStore).updatePreferences(unref(cookieStore).preferences);
                                  showSettings.value = false;
                                }
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Save `);
                                  } else {
                                    return [
                                      createTextVNode(" Save ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VBtn, {
                                  variant: "text",
                                  color: "error",
                                  onClick: ($event) => {
                                    unref(cookieStore).rejectNonEssentialCookies();
                                    showSettings.value = false;
                                  }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Reject all ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  variant: "tonal",
                                  color: "grey",
                                  onClick: ($event) => showSettings.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cancel ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "primary",
                                  variant: "elevated",
                                  onClick: ($event) => {
                                    unref(cookieStore).updatePreferences(unref(cookieStore).preferences);
                                    showSettings.value = false;
                                  }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Save ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardTitle, { class: "text-h5 pb-2" }, {
                            default: withCtx(() => [
                              createTextVNode(" Cookie Preferences ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardSubtitle, null, {
                            default: withCtx(() => [
                              createTextVNode(" Customize your cookie preferences ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode(VList, null, {
                                default: withCtx(() => [
                                  createVNode(VListItem, null, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createVNode(VSwitch, {
                                            modelValue: unref(cookieStore).preferences.essential,
                                            "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                            label: "Essential cookies",
                                            color: "primary",
                                            disabled: "",
                                            "hide-details": "",
                                            inset: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-2" }),
                                  createVNode(VListItem, null, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createVNode(VSwitch, {
                                            modelValue: unref(cookieStore).preferences.functional,
                                            "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                            label: "Functional cookies",
                                            color: "primary",
                                            "hide-details": "",
                                            inset: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-2" }),
                                  createVNode(VListItem, null, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createVNode(VSwitch, {
                                            modelValue: unref(cookieStore).preferences.analytics,
                                            "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                            label: "Analytical cookies",
                                            color: "primary",
                                            "hide-details": "",
                                            inset: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-2" }),
                                  createVNode(VListItem, null, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createVNode(VSwitch, {
                                            modelValue: unref(cookieStore).preferences.marketing,
                                            "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                            label: "Marketing cookies",
                                            color: "primary",
                                            "hide-details": "",
                                            inset: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
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
                          }),
                          createVNode(VCardActions, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode(VBtn, {
                                variant: "text",
                                color: "error",
                                onClick: ($event) => {
                                  unref(cookieStore).rejectNonEssentialCookies();
                                  showSettings.value = false;
                                }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Reject all ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                variant: "tonal",
                                color: "grey",
                                onClick: ($event) => showSettings.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cancel ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "primary",
                                variant: "elevated",
                                onClick: ($event) => {
                                  unref(cookieStore).updatePreferences(unref(cookieStore).preferences);
                                  showSettings.value = false;
                                }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Save ")
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "text-h5 pb-2" }, {
                          default: withCtx(() => [
                            createTextVNode(" Cookie Preferences ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardSubtitle, null, {
                          default: withCtx(() => [
                            createTextVNode(" Customize your cookie preferences ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VList, null, {
                              default: withCtx(() => [
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.essential,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                          label: "Essential cookies",
                                          color: "primary",
                                          disabled: "",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.functional,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                          label: "Functional cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.analytics,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                          label: "Analytical cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.marketing,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                          label: "Marketing cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
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
                        }),
                        createVNode(VCardActions, { class: "pa-4" }, {
                          default: withCtx(() => [
                            createVNode(VBtn, {
                              variant: "text",
                              color: "error",
                              onClick: ($event) => {
                                unref(cookieStore).rejectNonEssentialCookies();
                                showSettings.value = false;
                              }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Reject all ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              variant: "tonal",
                              color: "grey",
                              onClick: ($event) => showSettings.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "primary",
                              variant: "elevated",
                              onClick: ($event) => {
                                unref(cookieStore).updatePreferences(unref(cookieStore).preferences);
                                showSettings.value = false;
                              }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Save ")
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
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(VAppBar, {
                app: "",
                flat: "",
                elevation: "2",
                color: "surface"
              }, {
                default: withCtx(() => [
                  createVNode(VContainer, { class: "d-flex align-center py-0 my-0" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, {
                        to: "/",
                        class: "text-decoration-none"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "DevUnity title",
                              width: "150"
                            })
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(VSpacer),
                      createVNode(VBtn, {
                        color: "primary",
                        to: "/",
                        class: "ml-4"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Back to Home")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, { class: "py-12" }, {
                    default: withCtx(() => [
                      createVNode(VRow, { justify: "center" }, {
                        default: withCtx(() => [
                          createVNode(VCol, {
                            cols: "12",
                            md: "10",
                            lg: "8"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                default: withCtx(() => [
                                  createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Cookie Policy"),
                                  createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                  createVNode(VCard, {
                                    color: "surface",
                                    variant: "outlined",
                                    class: "mb-6 pa-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current status of your preferences"),
                                      createVNode(VList, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Essential cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.essential ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Functional cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.functional ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Analytical cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.analytics ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Marketing cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(cookieStore).preferences.marketing ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardActions, null, {
                                        default: withCtx(() => [
                                          createVNode(VBtn, {
                                            color: "primary",
                                            onClick: openCookieSettings
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-settings")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Modify settings ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VBtn, {
                                            color: "error",
                                            variant: "outlined",
                                            onClick: resetCookies
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-remove")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Delete all cookies ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("p", { class: "text-subtitle-1 mb-6" }, " This cookie policy explains what cookies are, how DevUnity uses them, and what your options are regarding their use. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "What is a cookie?"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, " A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login ID, language, font size, and other display preferences) for a period of time, so you don't have to re-enter them every time you come back to the site or browse from one page to another. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How do we use cookies?"),
                                  createVNode("p", { class: "text-body-1 mb-4" }, " We use different types of cookies for various reasons: "),
                                  createVNode("ul", { class: "mb-6" }, [
                                    createVNode("li", { class: "mb-3" }, [
                                      createVNode("strong", null, "Essential cookies"),
                                      createTextVNode(": These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions you take that constitute a request for services, such as setting your privacy preferences, logging in, or filling out forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ")
                                    ]),
                                    createVNode("li", { class: "mb-3" }, [
                                      createVNode("strong", null, "Performance cookies"),
                                      createTextVNode(": These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information collected by these cookies is aggregated and therefore anonymous. ")
                                    ]),
                                    createVNode("li", { class: "mb-3" }, [
                                      createVNode("strong", null, "Functional cookies"),
                                      createTextVNode(": These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly. ")
                                    ]),
                                    createVNode("li", { class: "mb-3" }, [
                                      createVNode("strong", null, "Targeting cookies"),
                                      createTextVNode(": These cookies may be set on our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device. ")
                                    ])
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "List of cookies used"),
                                  createVNode("div", { class: "mb-8" }, [
                                    createVNode(VTable, { class: "rounded-lg" }, {
                                      default: withCtx(() => [
                                        createVNode("thead", null, [
                                          createVNode("tr", null, [
                                            createVNode("th", null, "Cookie name"),
                                            createVNode("th", null, "Type"),
                                            createVNode("th", null, "Duration"),
                                            createVNode("th", null, "Description")
                                          ])
                                        ]),
                                        createVNode("tbody", null, [
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "devunity_session")
                                            ]),
                                            createVNode("td", null, "Essential"),
                                            createVNode("td", null, "Session or 14 days"),
                                            createVNode("td", null, 'Used to maintain your login session on DevUnity. Its duration is limited to your browsing session, unless you check the "Remember me" option when logging in, in which case it persists for 14 days.')
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "token")
                                            ]),
                                            createVNode("td", null, "Essential"),
                                            createVNode("td", null, "7 days"),
                                            createVNode("td", null, "Contains your encrypted authentication token, necessary to access secure areas of the site. ")
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "devunity_preferences")
                                            ]),
                                            createVNode("td", null, "Essential"),
                                            createVNode("td", null, "6 months"),
                                            createVNode("td", null, "Stores your user interface preferences, such as dark/light theme and display settings.")
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "devunity_cookie_consent")
                                            ]),
                                            createVNode("td", null, "Essential"),
                                            createVNode("td", null, "12 months"),
                                            createVNode("td", null, "Records your preferences regarding the use of cookies on our site.")
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "devunity_lastvisit")
                                            ]),
                                            createVNode("td", null, "Functional"),
                                            createVNode("td", null, "30 days"),
                                            createVNode("td", null, "Remembers your last visit to redirect you to your recent projects.")
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "devunity_recent_projects")
                                            ]),
                                            createVNode("td", null, "Functional"),
                                            createVNode("td", null, "90 days"),
                                            createVNode("td", null, "Stores the list of your recently viewed projects for quick access.")
                                          ]),
                                          createVNode("tr", null, [
                                            createVNode("td", null, [
                                              createVNode("code", null, "_ga, _gid, _gat")
                                            ]),
                                            createVNode("td", null, "Analytical"),
                                            createVNode("td", null, "_ga: 2 years, _gid: 24h, _gat: 1 min"),
                                            createVNode("td", null, "Google Analytics cookies used to distinguish users and analyze their behavior on the site. ")
                                          ])
                                        ])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How to manage cookies"),
                                  createVNode("div", { class: "mb-8" }, [
                                    createVNode("p", { class: "mb-3" }, "You can decide at any time to accept or refuse cookies on our site in two ways:"),
                                    createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "1. Use our cookie management panel"),
                                    createVNode("p", { class: "mb-3" }, [
                                      createTextVNode(" We offer a cookie management panel integrated into our site, accessible at any time via the "),
                                      createVNode(VIcon, { small: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cookie-settings")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" button located at the bottom right of your screen. ")
                                    ]),
                                    createVNode("p", { class: "mb-6" }, " This panel allows you to precisely customize which categories of cookies you accept, and you can change your preferences at any time. "),
                                    createVNode(VBtn, {
                                      color: "primary",
                                      class: "mb-6",
                                      onClick: openCookieSettings
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cookie-settings")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Open cookie settings ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("h3", { class: "text-h6 font-weight-bold mb-3 mt-4" }, "2. Modify your browser settings")
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Instructions for disabling cookies"),
                                  createVNode("p", { class: "text-body-1 mb-4" }, " Here's how to disable cookies in the most popular browsers: "),
                                  createVNode(VExpansionPanels, { class: "mb-6" }, {
                                    default: withCtx(() => [
                                      createVNode(VExpansionPanel, null, {
                                        default: withCtx(() => [
                                          createVNode(VExpansionPanelTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Chrome")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanelText, null, {
                                            default: withCtx(() => [
                                              createVNode("ol", null, [
                                                createVNode("li", null, "Click on the Chrome menu in the toolbar"),
                                                createVNode("li", null, 'Select "Settings"'),
                                                createVNode("li", null, 'Click on "Privacy and security"'),
                                                createVNode("li", null, 'Click on "Cookies and other site data"'),
                                                createVNode("li", null, "Choose your cookie options")
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VExpansionPanel, null, {
                                        default: withCtx(() => [
                                          createVNode(VExpansionPanelTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Firefox")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanelText, null, {
                                            default: withCtx(() => [
                                              createVNode("ol", null, [
                                                createVNode("li", null, "Click on the Firefox menu"),
                                                createVNode("li", null, 'Select "Options"'),
                                                createVNode("li", null, 'Go to the "Privacy & Security" tab'),
                                                createVNode("li", null, 'In the "Enhanced Tracking Protection" section, choose "Custom"'),
                                                createVNode("li", null, 'Check or uncheck "Cookies" according to your preferences')
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VExpansionPanel, null, {
                                        default: withCtx(() => [
                                          createVNode(VExpansionPanelTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Safari")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanelText, null, {
                                            default: withCtx(() => [
                                              createVNode("ol", null, [
                                                createVNode("li", null, 'In the Safari menu, select "Preferences"'),
                                                createVNode("li", null, 'Click on the "Privacy" tab'),
                                                createVNode("li", null, 'In the "Cookies and website data" section, choose your preferred option')
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VExpansionPanel, null, {
                                        default: withCtx(() => [
                                          createVNode(VExpansionPanelTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Microsoft Edge")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VExpansionPanelText, null, {
                                            default: withCtx(() => [
                                              createVNode("ol", null, [
                                                createVNode("li", null, "Click on the Edge menu (the three dots in the upper right corner)"),
                                                createVNode("li", null, 'Select "Settings"'),
                                                createVNode("li", null, 'Click on "Privacy, search, and services"'),
                                                createVNode("li", null, 'Under "Privacy", choose your cookie blocking level')
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to our cookie policy"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, " We may update this policy from time to time to reflect, for example, changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to regularly review this policy to stay informed about our use of cookies and related technologies. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact us"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, [
                                    createTextVNode(" If you have any questions about our use of cookies or other technologies, please contact us at "),
                                    createVNode("a", {
                                      href: "mailto:privacy@devunity.com",
                                      class: "text-decoration-underline"
                                    }, "privacy@devunity.com"),
                                    createTextVNode(". ")
                                  ])
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
                ]),
                _: 1
              }),
              createVNode(VFooter, { class: "py-4" }, {
                default: withCtx(() => [
                  createVNode(VContainer, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "text-center" }, [
                        createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " \xA9 " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode("div", null, [
                createVNode(VDialog, {
                  modelValue: unref(showSettings),
                  "onUpdate:modelValue": ($event) => isRef(showSettings) ? showSettings.value = $event : null,
                  width: "500"
                }, {
                  default: withCtx(() => [
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "text-h5 pb-2" }, {
                          default: withCtx(() => [
                            createTextVNode(" Cookie Preferences ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardSubtitle, null, {
                          default: withCtx(() => [
                            createTextVNode(" Customize your cookie preferences ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VList, null, {
                              default: withCtx(() => [
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.essential,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.essential = $event,
                                          label: "Essential cookies",
                                          color: "primary",
                                          disabled: "",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Necessary for the site to function, they cannot be disabled. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.functional,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.functional = $event,
                                          label: "Functional cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.analytics,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.analytics = $event,
                                          label: "Analytical cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Help us understand how you use our site in order to improve it. ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createVNode(VSwitch, {
                                          modelValue: unref(cookieStore).preferences.marketing,
                                          "onUpdate:modelValue": ($event) => unref(cookieStore).preferences.marketing = $event,
                                          label: "Marketing cookies",
                                          color: "primary",
                                          "hide-details": "",
                                          inset: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Allow us to display personalized advertisements based on your interests. ")
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
                        }),
                        createVNode(VCardActions, { class: "pa-4" }, {
                          default: withCtx(() => [
                            createVNode(VBtn, {
                              variant: "text",
                              color: "error",
                              onClick: ($event) => {
                                unref(cookieStore).rejectNonEssentialCookies();
                                showSettings.value = false;
                              }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Reject all ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              variant: "tonal",
                              color: "grey",
                              onClick: ($event) => showSettings.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "primary",
                              variant: "elevated",
                              onClick: ($event) => {
                                unref(cookieStore).updatePreferences(unref(cookieStore).preferences);
                                showSettings.value = false;
                              }
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Save ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cookies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cookies = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9ddc80c3"]]);

export { cookies as default };
//# sourceMappingURL=cookies-BQsVW1ws.mjs.map
