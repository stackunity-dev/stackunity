import { defineComponent, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { S as useUserStore, V as VApp, f as VCard, $ as VCardTitle, g as VIcon, Y as VCardText, T as VList, U as VListItem, W as VListItemTitle, e as VBtn, _ as _export_sfc } from './server.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'pinia';
import 'vue-router';
import 'pinia-plugin-persistedstate';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "subscription",
  __ssrInlineRender: true,
  setup(__props) {
    useUserStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, {
                    fluid: "",
                    class: "pa-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { justify: "center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "8",
                                lg: "6"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCard, {
                                      class: "rounded-lg",
                                      elevation: "3"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VIcon, {
                                                  color: "white",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-star`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-star")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(` Passez à la version Premium `);
                                              } else {
                                                return [
                                                  createVNode(VIcon, {
                                                    color: "white",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-star")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Passez à la version Premium ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCardText, { class: "pa-6" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="text-center mb-6" data-v-1b611e82${_scopeId7}><h1 class="text-h4 mb-2" data-v-1b611e82${_scopeId7}>Débloquez toutes les fonctionnalités</h1><p class="text-body-1 text-grey-darken-1" data-v-1b611e82${_scopeId7}> Profitez d&#39;un accès illimité à toutes nos fonctionnalités premium </p></div>`);
                                                _push8(ssrRenderComponent(VList, { class: "mb-6" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Accès illimité aux fonctionnalités avancées`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Support prioritaire`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Support prioritaire")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Support prioritaire")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Analyses SEO avancées`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Analyses SEO avancées")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Analyses SEO avancées")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItemTitle, null, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(`Export de données illimité`);
                                                                } else {
                                                                  return [
                                                                    createTextVNode("Export de données illimité")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VListItemTitle, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Export de données illimité")
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
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-check-circle",
                                                          color: "success"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-check-circle",
                                                          color: "success"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Support prioritaire")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-check-circle",
                                                          color: "success"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Analyses SEO avancées")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-check-circle",
                                                          color: "success"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItemTitle, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Export de données illimité")
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
                                                _push8(`<div class="text-center" data-v-1b611e82${_scopeId7}>`);
                                                _push8(ssrRenderComponent(VBtn, {
                                                  color: "primary",
                                                  size: "large",
                                                  to: "/checkout"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VIcon, { start: "" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-credit-card`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-credit-card")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(` S&#39;abonner maintenant `);
                                                    } else {
                                                      return [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-credit-card")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" S'abonner maintenant ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "text-center mb-6" }, [
                                                    createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                                    createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                                  ]),
                                                  createVNode(VList, { class: "mb-6" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Support prioritaire")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Analyses SEO avancées")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-check-circle",
                                                        color: "success"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Export de données illimité")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", { class: "text-center" }, [
                                                    createVNode(VBtn, {
                                                      color: "primary",
                                                      size: "large",
                                                      to: "/checkout"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-credit-card")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" S'abonner maintenant ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  color: "white",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-star")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Passez à la version Premium ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCardText, { class: "pa-6" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "text-center mb-6" }, [
                                                  createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                                  createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                                ]),
                                                createVNode(VList, { class: "mb-6" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-check-circle",
                                                      color: "success"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-check-circle",
                                                      color: "success"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Support prioritaire")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-check-circle",
                                                      color: "success"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Analyses SEO avancées")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-check-circle",
                                                      color: "success"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Export de données illimité")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", { class: "text-center" }, [
                                                  createVNode(VBtn, {
                                                    color: "primary",
                                                    size: "large",
                                                    to: "/checkout"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-credit-card")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" S'abonner maintenant ")
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCard, {
                                        class: "rounded-lg",
                                        elevation: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                color: "white",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-star")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Passez à la version Premium ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCardText, { class: "pa-6" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "text-center mb-6" }, [
                                                createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                                createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                              ]),
                                              createVNode(VList, { class: "mb-6" }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-check-circle",
                                                    color: "success"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-check-circle",
                                                    color: "success"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Support prioritaire")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-check-circle",
                                                    color: "success"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Analyses SEO avancées")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-check-circle",
                                                    color: "success"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Export de données illimité")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", { class: "text-center" }, [
                                                createVNode(VBtn, {
                                                  color: "primary",
                                                  size: "large",
                                                  to: "/checkout"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, { start: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-credit-card")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" S'abonner maintenant ")
                                                  ]),
                                                  _: 1
                                                })
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "8",
                                  lg: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: "rounded-lg",
                                      elevation: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-star")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Passez à la version Premium ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCardText, { class: "pa-6" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "text-center mb-6" }, [
                                              createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                              createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                            ]),
                                            createVNode(VList, { class: "mb-6" }, {
                                              default: withCtx(() => [
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-check-circle",
                                                  color: "success"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-check-circle",
                                                  color: "success"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Support prioritaire")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-check-circle",
                                                  color: "success"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Analyses SEO avancées")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-check-circle",
                                                  color: "success"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Export de données illimité")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "text-center" }, [
                                              createVNode(VBtn, {
                                                color: "primary",
                                                size: "large",
                                                to: "/checkout"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, { start: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-credit-card")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" S'abonner maintenant ")
                                                ]),
                                                _: 1
                                              })
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VRow, { justify: "center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "8",
                                lg: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCard, {
                                    class: "rounded-lg",
                                    elevation: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-star")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Passez à la version Premium ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-6" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "text-center mb-6" }, [
                                            createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                            createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                          ]),
                                          createVNode(VList, { class: "mb-6" }, {
                                            default: withCtx(() => [
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-check-circle",
                                                color: "success"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-check-circle",
                                                color: "success"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Support prioritaire")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-check-circle",
                                                color: "success"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Analyses SEO avancées")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-check-circle",
                                                color: "success"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Export de données illimité")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", { class: "text-center" }, [
                                            createVNode(VBtn, {
                                              color: "primary",
                                              size: "large",
                                              to: "/checkout"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, { start: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-credit-card")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" S'abonner maintenant ")
                                              ]),
                                              _: 1
                                            })
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, {
                      fluid: "",
                      class: "pa-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VRow, { justify: "center" }, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "8",
                              lg: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-star")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Passez à la version Premium ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-6" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "text-center mb-6" }, [
                                          createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                          createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                        ]),
                                        createVNode(VList, { class: "mb-6" }, {
                                          default: withCtx(() => [
                                            createVNode(VListItem, {
                                              "prepend-icon": "mdi-check-circle",
                                              color: "success"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, {
                                              "prepend-icon": "mdi-check-circle",
                                              color: "success"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Support prioritaire")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, {
                                              "prepend-icon": "mdi-check-circle",
                                              color: "success"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Analyses SEO avancées")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, {
                                              "prepend-icon": "mdi-check-circle",
                                              color: "success"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Export de données illimité")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-center" }, [
                                          createVNode(VBtn, {
                                            color: "primary",
                                            size: "large",
                                            to: "/checkout"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-credit-card")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" S'abonner maintenant ")
                                            ]),
                                            _: 1
                                          })
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
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, {
                    fluid: "",
                    class: "pa-4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VRow, { justify: "center" }, {
                        default: withCtx(() => [
                          createVNode(VCol, {
                            cols: "12",
                            md: "8",
                            lg: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "3"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-star")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Passez à la version Premium ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-6" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "text-center mb-6" }, [
                                        createVNode("h1", { class: "text-h4 mb-2" }, "Débloquez toutes les fonctionnalités"),
                                        createVNode("p", { class: "text-body-1 text-grey-darken-1" }, " Profitez d'un accès illimité à toutes nos fonctionnalités premium ")
                                      ]),
                                      createVNode(VList, { class: "mb-6" }, {
                                        default: withCtx(() => [
                                          createVNode(VListItem, {
                                            "prepend-icon": "mdi-check-circle",
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Accès illimité aux fonctionnalités avancées")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, {
                                            "prepend-icon": "mdi-check-circle",
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Support prioritaire")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, {
                                            "prepend-icon": "mdi-check-circle",
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Analyses SEO avancées")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, {
                                            "prepend-icon": "mdi-check-circle",
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Export de données illimité")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-center" }, [
                                        createVNode(VBtn, {
                                          color: "primary",
                                          size: "large",
                                          to: "/checkout"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-credit-card")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" S'abonner maintenant ")
                                          ]),
                                          _: 1
                                        })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/subscription.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const subscription = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1b611e82"]]);

export { subscription as default };
//# sourceMappingURL=subscription.vue.mjs.map
