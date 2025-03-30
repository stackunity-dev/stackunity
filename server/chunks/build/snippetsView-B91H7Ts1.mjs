import { _ as __nuxt_component_0 } from './client-only-Bwxzq3Sq.mjs';
import { defineComponent, defineAsyncComponent, ref, watch, nextTick, computed, withCtx, createTextVNode, createVNode, unref, toDisplayString, mergeProps, createBlock, createCommentVNode, openBlock, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import hljs from 'highlight.js';
import { S as Snackbar } from './snackbar-DScNeECn.mjs';
import { _ as _export_sfc, W as useUserStore, bV as useRoute$1, V as VApp, e as VSpacer, f as VBtn, h as VIcon, a1 as VList, Z as VListItem, j as VDivider, g as VCard, X as VCardTitle, bK as VCardSubtitle, Y as VCardText, bI as VProgressCircular, ay as VFadeTransition, a0 as VDialog, a2 as VCardActions, n as navigateTo } from './server.mjs';
import { u as useHead } from './index-C2merokO.mjs';
import { V as VAppBar } from './VAppBar-Dcl-vB5D.mjs';
import { a as VToolbarTitle } from './VToolbar-Cwh-hMsA.mjs';
import { V as VTooltip } from './VTooltip-CX8O_wfD.mjs';
import { V as VSelect, a as VMenu } from './VSelect-CnzUTO4G.mjs';
import { V as VMain } from './VMain-BRDwGZ62.mjs';
import { V as VChip } from './VChip-BzNlhlnv.mjs';
import { V as VContainer } from './VContainer-fRL-Auqv.mjs';
import { V as VRow, a as VCol } from './VRow-5FS9XbeV.mjs';
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
import './VTextField-B2FvXSJz.mjs';
import './VCheckboxBtn-C031VWof.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "snippetsView",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const MonacoEditor = defineAsyncComponent(() => import('./monaco-editor-vue3-CCyoAfhP.mjs').then(function(n) {
      return n.a;
    }));
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const deleteDialog = ref(false);
    const codeBlock = ref(null);
    useHead({
      title: "Snippet - DevUnity",
      meta: [
        { name: "description", content: "View and edit your snippets" },
        { name: "keywords", content: "snippet, code snippet, code, snippets, edit, view" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Snippet - DevUnity" },
        { name: "og:description", content: "View and edit your snippets" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ],
      link: [
        { rel: "canonical", href: "https://devunity.com/snippets" }
      ]
    });
    const route = useRoute$1();
    const snippetId = Number(route.query.id);
    const snippetType = route.query.type && (route.query.type === "world" || route.query.type === "personal") ? route.query.type : "world";
    const code = ref(`// Your code here`);
    const selectedLanguage = ref("javascript");
    const editorOptions = ref({
      automaticLayout: true,
      fontSize: 14,
      lineHeight: 24,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      roundedSelection: true,
      padding: { top: 16 }
    });
    const editMode = ref(false);
    const monacoKey = ref(Date.now());
    const languages = ref(["html", "css", "javascript", "typescript", "vue"]);
    const isLoading = ref(false);
    const snippetData = ref(null);
    const applyHighlight = () => {
      if (codeBlock.value && false) ;
    };
    watch([code, selectedLanguage], () => {
      nextTick(applyHighlight);
    });
    function toggleEdit() {
      editMode.value = !editMode.value;
      monacoKey.value = Date.now();
    }
    computed(() => {
      if (!code.value) return "";
      const highlighted = hljs.highlight(code.value, {
        language: selectedLanguage.value,
        ignoreIllegals: true
      });
      return highlighted.value;
    });
    const updateSnippet = async () => {
      try {
        await userStore.updateSnippet(snippetId, code.value, snippetType);
        snackbarText.value = "Snippet mis \xE0 jour avec succ\xE8s";
        snackbarColor.value = "success";
        snackbar.value = true;
        editMode.value = false;
      } catch (err) {
        console.error(err.message, err.stack);
        snackbarText.value = "Erreur lors de la mise \xE0 jour du snippet";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    const deleteSnippet = () => {
      deleteDialog.value = true;
    };
    const confirmDeleteSnippet = async () => {
      try {
        await userStore.deleteSnippet(snippetId, snippetType);
        deleteDialog.value = false;
        snackbarText.value = "Snippet supprim\xE9 avec succ\xE8s";
        snackbarColor.value = "success";
        snackbar.value = true;
        setTimeout(() => {
          navigateTo("/snippets");
        }, 1e3);
      } catch (err) {
        console.error(err.message, err.stack);
        snackbarText.value = "Erreur lors de la suppression du snippet";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VAppBar, {
              flat: "",
              color: "primary",
              elevation: "2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Code Snippet Editor `);
                      } else {
                        return [
                          createTextVNode(" Code Snippet Editor ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VSpacer, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VBtn, {
                    icon: "",
                    class: "mr-2",
                    to: "/snippets"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-arrow-left`);
                            } else {
                              return [
                                createTextVNode("mdi-arrow-left")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTooltip, {
                          activator: "parent",
                          location: "bottom"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Back to Snippets`);
                            } else {
                              return [
                                createTextVNode("Back to Snippets")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VIcon, null, {
                            default: withCtx(() => [
                              createTextVNode("mdi-arrow-left")
                            ]),
                            _: 1
                          }),
                          createVNode(VTooltip, {
                            activator: "parent",
                            location: "bottom"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Back to Snippets")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VSelect, {
                    modelValue: selectedLanguage.value,
                    "onUpdate:modelValue": ($event) => selectedLanguage.value = $event,
                    items: languages.value,
                    label: "Language",
                    style: { "max-width": "200px" },
                    variant: "outlined",
                    density: "comfortable",
                    class: "mx-4",
                    "hide-details": ""
                  }, null, _parent3, _scopeId2));
                  if (unref(snippetType) === "personal") {
                    _push3(ssrRenderComponent(VBtn, {
                      color: editMode.value ? "success" : "white",
                      variant: editMode.value ? "flat" : "outlined",
                      onClick: toggleEdit,
                      class: "mx-2",
                      disabled: !snippetData.value
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VIcon, {
                            icon: editMode.value ? "mdi-check" : "mdi-pencil",
                            start: ""
                          }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(editMode.value ? "Save" : "Edit")}`);
                        } else {
                          return [
                            createVNode(VIcon, {
                              icon: editMode.value ? "mdi-check" : "mdi-pencil",
                              start: ""
                            }, null, 8, ["icon"]),
                            createTextVNode(" " + toDisplayString(editMode.value ? "Save" : "Edit"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(snippetType) === "personal") {
                    _push3(ssrRenderComponent(VMenu, null, {
                      activator: withCtx(({ props }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VBtn, mergeProps(props, {
                            icon: "mdi-dots-vertical",
                            variant: "text",
                            disabled: !snippetData.value
                          }), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VBtn, mergeProps(props, {
                              icon: "mdi-dots-vertical",
                              variant: "text",
                              disabled: !snippetData.value
                            }), null, 16, ["disabled"])
                          ];
                        }
                      }),
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VList, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItem, {
                                  "prepend-icon": "mdi-content-save",
                                  onClick: updateSnippet
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
                                _push5(ssrRenderComponent(VDivider, null, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VListItem, {
                                  "prepend-icon": "mdi-delete",
                                  onClick: deleteSnippet,
                                  color: "error"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Delete `);
                                    } else {
                                      return [
                                        createTextVNode(" Delete ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-content-save",
                                    onClick: updateSnippet
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Save ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider),
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-delete",
                                    onClick: deleteSnippet,
                                    color: "error"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Delete ")
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
                            createVNode(VList, null, {
                              default: withCtx(() => [
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-content-save",
                                  onClick: updateSnippet
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Save ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider),
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-delete",
                                  onClick: deleteSnippet,
                                  color: "error"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Delete ")
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
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                      default: withCtx(() => [
                        createTextVNode(" Code Snippet Editor ")
                      ]),
                      _: 1
                    }),
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      icon: "",
                      class: "mr-2",
                      to: "/snippets"
                    }, {
                      default: withCtx(() => [
                        createVNode(VIcon, null, {
                          default: withCtx(() => [
                            createTextVNode("mdi-arrow-left")
                          ]),
                          _: 1
                        }),
                        createVNode(VTooltip, {
                          activator: "parent",
                          location: "bottom"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Back to Snippets")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VSelect, {
                      modelValue: selectedLanguage.value,
                      "onUpdate:modelValue": ($event) => selectedLanguage.value = $event,
                      items: languages.value,
                      label: "Language",
                      style: { "max-width": "200px" },
                      variant: "outlined",
                      density: "comfortable",
                      class: "mx-4",
                      "hide-details": ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                    unref(snippetType) === "personal" ? (openBlock(), createBlock(VBtn, {
                      key: 0,
                      color: editMode.value ? "success" : "white",
                      variant: editMode.value ? "flat" : "outlined",
                      onClick: toggleEdit,
                      class: "mx-2",
                      disabled: !snippetData.value
                    }, {
                      default: withCtx(() => [
                        createVNode(VIcon, {
                          icon: editMode.value ? "mdi-check" : "mdi-pencil",
                          start: ""
                        }, null, 8, ["icon"]),
                        createTextVNode(" " + toDisplayString(editMode.value ? "Save" : "Edit"), 1)
                      ]),
                      _: 1
                    }, 8, ["color", "variant", "disabled"])) : createCommentVNode("", true),
                    unref(snippetType) === "personal" ? (openBlock(), createBlock(VMenu, { key: 1 }, {
                      activator: withCtx(({ props }) => [
                        createVNode(VBtn, mergeProps(props, {
                          icon: "mdi-dots-vertical",
                          variant: "text",
                          disabled: !snippetData.value
                        }), null, 16, ["disabled"])
                      ]),
                      default: withCtx(() => [
                        createVNode(VList, null, {
                          default: withCtx(() => [
                            createVNode(VListItem, {
                              "prepend-icon": "mdi-content-save",
                              onClick: updateSnippet
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Save ")
                              ]),
                              _: 1
                            }),
                            createVNode(VDivider),
                            createVNode(VListItem, {
                              "prepend-icon": "mdi-delete",
                              onClick: deleteSnippet,
                              color: "error"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Delete ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (snippetData.value) {
                    _push3(ssrRenderComponent(VCard, { class: "rounded-lg pa-4 ma-4" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(snippetData.value.title)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(snippetData.value.title), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VCardSubtitle, { class: "pt-2" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VChip, {
                                  size: "small",
                                  color: "primary",
                                  variant: "flat",
                                  class: "mr-2"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(snippetData.value.framework)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(snippetData.value.framework), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VChip, {
                                  size: "small",
                                  variant: "outlined",
                                  class: "mr-2"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        start: "",
                                        size: "small"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-calendar`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-calendar")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` ${ssrInterpolate(unref(userStore).formatDate(snippetData.value.snippet_date || ""))}`);
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          start: "",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-calendar")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" " + toDisplayString(unref(userStore).formatDate(snippetData.value.snippet_date || "")), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VChip, {
                                    size: "small",
                                    color: "primary",
                                    variant: "flat",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(snippetData.value.framework), 1)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VChip, {
                                    size: "small",
                                    variant: "outlined",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        start: "",
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-calendar")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" " + toDisplayString(unref(userStore).formatDate(snippetData.value.snippet_date || "")), 1)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VCardText, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(snippetData.value.description)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(snippetData.value.description), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(snippetData.value.title), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(VCardSubtitle, { class: "pt-2" }, {
                              default: withCtx(() => [
                                createVNode(VChip, {
                                  size: "small",
                                  color: "primary",
                                  variant: "flat",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(snippetData.value.framework), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VChip, {
                                  size: "small",
                                  variant: "outlined",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      start: "",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-calendar")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" " + toDisplayString(unref(userStore).formatDate(snippetData.value.snippet_date || "")), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VDivider, { class: "my-4" }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(snippetData.value.description), 1)
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_client_only, null, {}, _parent3, _scopeId2));
                } else {
                  return [
                    snippetData.value ? (openBlock(), createBlock(VCard, {
                      key: 0,
                      class: "rounded-lg pa-4 ma-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(snippetData.value.title), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(VCardSubtitle, { class: "pt-2" }, {
                          default: withCtx(() => [
                            createVNode(VChip, {
                              size: "small",
                              color: "primary",
                              variant: "flat",
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(snippetData.value.framework), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(VChip, {
                              size: "small",
                              variant: "outlined",
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  start: "",
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-calendar")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" " + toDisplayString(unref(userStore).formatDate(snippetData.value.snippet_date || "")), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VDivider, { class: "my-4" }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(snippetData.value.description), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(_component_client_only, null, {
                      default: withCtx(() => [
                        createVNode(VContainer, {
                          fluid: "",
                          class: "pa-4 fill-height"
                        }, {
                          default: withCtx(() => [
                            isLoading.value ? (openBlock(), createBlock(VRow, {
                              key: 0,
                              class: "fill-height",
                              align: "center",
                              justify: "center"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCol, {
                                  cols: "12",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VProgressCircular, {
                                      indeterminate: "",
                                      color: "primary",
                                      size: "64"
                                    }),
                                    createVNode("div", { class: "mt-4 text-h6" }, "Loading snippet...")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : !snippetData.value ? (openBlock(), createBlock(VRow, {
                              key: 1,
                              class: "fill-height",
                              align: "center",
                              justify: "center"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCol, {
                                  cols: "12",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "error",
                                      size: "64"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-alert-circle")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "mt-4 text-h6" }, "Snippet not found"),
                                    createVNode(VBtn, {
                                      color: "primary",
                                      class: "mt-4",
                                      to: "/snippets"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Back to snippets ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(VRow, {
                              key: 2,
                              "no-gutters": "",
                              class: "fill-height"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCol, null, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: "fill-height",
                                      elevation: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VFadeTransition, null, {
                                          default: withCtx(() => [
                                            editMode.value && unref(snippetType) === "personal" ? (openBlock(), createBlock(_component_client_only, { key: 0 }, {
                                              default: withCtx(() => [
                                                (openBlock(), createBlock(resolveDynamicComponent(unref(MonacoEditor)), {
                                                  value: code.value,
                                                  "onUpdate:value": ($event) => code.value = $event,
                                                  key: editMode.value,
                                                  language: selectedLanguage.value,
                                                  theme: "vs-dark",
                                                  options: editorOptions.value,
                                                  class: "fill-height editor-container"
                                                }, null, 40, ["value", "onUpdate:value", "language", "options"]))
                                              ]),
                                              _: 1
                                            })) : (openBlock(), createBlock(_component_client_only, { key: 1 }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "code-viewer" }, [
                                                  createVNode("div", { class: "code-header pa-4" }, [
                                                    createVNode(VChip, {
                                                      color: "primary",
                                                      size: "small",
                                                      variant: "flat",
                                                      class: "mr-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(selectedLanguage.value), 1)
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VChip, {
                                                      size: "small",
                                                      variant: "outlined"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(code.value.split("\n").length) + " lines ", 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  createVNode(VDivider),
                                                  createVNode("div", { class: "pa-6 code-content" }, [
                                                    createVNode("pre", null, [
                                                      createVNode("code", {
                                                        ref_key: "codeBlock",
                                                        ref: codeBlock,
                                                        class: selectedLanguage.value
                                                      }, toDisplayString(code.value), 3)
                                                    ])
                                                  ])
                                                ])
                                              ]),
                                              _: 1
                                            }))
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
                            }))
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
            _push2(ssrRenderComponent(Snackbar, {
              modelValue: snackbar.value,
              "onUpdate:modelValue": ($event) => snackbar.value = $event,
              text: snackbarText.value,
              color: snackbarColor.value,
              timeout: 2e3
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: deleteDialog.value,
              "onUpdate:modelValue": ($event) => deleteDialog.value = $event,
              "max-width": "400"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, { class: "bg-error text-white" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { start: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-alert-circle`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-alert-circle")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` Delete Confirmation `);
                            } else {
                              return [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-alert-circle")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Delete Confirmation ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pt-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p data-v-1698d373${_scopeId4}>Are you sure you want to delete this snippet? This action cannot be undone.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "Are you sure you want to delete this snippet? This action cannot be undone.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardActions, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VSpacer, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "text",
                                onClick: ($event) => deleteDialog.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Cancel`);
                                  } else {
                                    return [
                                      createTextVNode("Cancel")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "error",
                                onClick: confirmDeleteSnippet
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, { start: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-delete`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-delete")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` Delete `);
                                  } else {
                                    return [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-delete")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Delete ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  variant: "text",
                                  onClick: ($event) => deleteDialog.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cancel")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "error",
                                  onClick: confirmDeleteSnippet
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { start: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-delete")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Delete ")
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
                          createVNode(VCardTitle, { class: "bg-error text-white" }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-alert-circle")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Delete Confirmation ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pt-4" }, {
                            default: withCtx(() => [
                              createVNode("p", null, "Are you sure you want to delete this snippet? This action cannot be undone.")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardActions, null, {
                            default: withCtx(() => [
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                variant: "text",
                                onClick: ($event) => deleteDialog.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Cancel")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "error",
                                onClick: confirmDeleteSnippet
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { start: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-delete")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Delete ")
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
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "bg-error text-white" }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { start: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-alert-circle")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Delete Confirmation ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pt-4" }, {
                          default: withCtx(() => [
                            createVNode("p", null, "Are you sure you want to delete this snippet? This action cannot be undone.")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              variant: "text",
                              onClick: ($event) => deleteDialog.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "error",
                              onClick: confirmDeleteSnippet
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-delete")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Delete ")
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
              createVNode(VAppBar, {
                flat: "",
                color: "primary",
                elevation: "2"
              }, {
                default: withCtx(() => [
                  createVNode(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                    default: withCtx(() => [
                      createTextVNode(" Code Snippet Editor ")
                    ]),
                    _: 1
                  }),
                  createVNode(VSpacer),
                  createVNode(VBtn, {
                    icon: "",
                    class: "mr-2",
                    to: "/snippets"
                  }, {
                    default: withCtx(() => [
                      createVNode(VIcon, null, {
                        default: withCtx(() => [
                          createTextVNode("mdi-arrow-left")
                        ]),
                        _: 1
                      }),
                      createVNode(VTooltip, {
                        activator: "parent",
                        location: "bottom"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Back to Snippets")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VSelect, {
                    modelValue: selectedLanguage.value,
                    "onUpdate:modelValue": ($event) => selectedLanguage.value = $event,
                    items: languages.value,
                    label: "Language",
                    style: { "max-width": "200px" },
                    variant: "outlined",
                    density: "comfortable",
                    class: "mx-4",
                    "hide-details": ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  unref(snippetType) === "personal" ? (openBlock(), createBlock(VBtn, {
                    key: 0,
                    color: editMode.value ? "success" : "white",
                    variant: editMode.value ? "flat" : "outlined",
                    onClick: toggleEdit,
                    class: "mx-2",
                    disabled: !snippetData.value
                  }, {
                    default: withCtx(() => [
                      createVNode(VIcon, {
                        icon: editMode.value ? "mdi-check" : "mdi-pencil",
                        start: ""
                      }, null, 8, ["icon"]),
                      createTextVNode(" " + toDisplayString(editMode.value ? "Save" : "Edit"), 1)
                    ]),
                    _: 1
                  }, 8, ["color", "variant", "disabled"])) : createCommentVNode("", true),
                  unref(snippetType) === "personal" ? (openBlock(), createBlock(VMenu, { key: 1 }, {
                    activator: withCtx(({ props }) => [
                      createVNode(VBtn, mergeProps(props, {
                        icon: "mdi-dots-vertical",
                        variant: "text",
                        disabled: !snippetData.value
                      }), null, 16, ["disabled"])
                    ]),
                    default: withCtx(() => [
                      createVNode(VList, null, {
                        default: withCtx(() => [
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-content-save",
                            onClick: updateSnippet
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Save ")
                            ]),
                            _: 1
                          }),
                          createVNode(VDivider),
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-delete",
                            onClick: deleteSnippet,
                            color: "error"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Delete ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(VMain, null, {
                default: withCtx(() => [
                  snippetData.value ? (openBlock(), createBlock(VCard, {
                    key: 0,
                    class: "rounded-lg pa-4 ma-4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(snippetData.value.title), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(VCardSubtitle, { class: "pt-2" }, {
                        default: withCtx(() => [
                          createVNode(VChip, {
                            size: "small",
                            color: "primary",
                            variant: "flat",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(snippetData.value.framework), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(VChip, {
                            size: "small",
                            variant: "outlined",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                start: "",
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-calendar")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" " + toDisplayString(unref(userStore).formatDate(snippetData.value.snippet_date || "")), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VDivider, { class: "my-4" }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(snippetData.value.description), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_client_only, null, {
                    default: withCtx(() => [
                      createVNode(VContainer, {
                        fluid: "",
                        class: "pa-4 fill-height"
                      }, {
                        default: withCtx(() => [
                          isLoading.value ? (openBlock(), createBlock(VRow, {
                            key: 0,
                            class: "fill-height",
                            align: "center",
                            justify: "center"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VProgressCircular, {
                                    indeterminate: "",
                                    color: "primary",
                                    size: "64"
                                  }),
                                  createVNode("div", { class: "mt-4 text-h6" }, "Loading snippet...")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : !snippetData.value ? (openBlock(), createBlock(VRow, {
                            key: 1,
                            class: "fill-height",
                            align: "center",
                            justify: "center"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "error",
                                    size: "64"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-alert-circle")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "mt-4 text-h6" }, "Snippet not found"),
                                  createVNode(VBtn, {
                                    color: "primary",
                                    class: "mt-4",
                                    to: "/snippets"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Back to snippets ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(VRow, {
                            key: 2,
                            "no-gutters": "",
                            class: "fill-height"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCol, null, {
                                default: withCtx(() => [
                                  createVNode(VCard, {
                                    class: "fill-height",
                                    elevation: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VFadeTransition, null, {
                                        default: withCtx(() => [
                                          editMode.value && unref(snippetType) === "personal" ? (openBlock(), createBlock(_component_client_only, { key: 0 }, {
                                            default: withCtx(() => [
                                              (openBlock(), createBlock(resolveDynamicComponent(unref(MonacoEditor)), {
                                                value: code.value,
                                                "onUpdate:value": ($event) => code.value = $event,
                                                key: editMode.value,
                                                language: selectedLanguage.value,
                                                theme: "vs-dark",
                                                options: editorOptions.value,
                                                class: "fill-height editor-container"
                                              }, null, 40, ["value", "onUpdate:value", "language", "options"]))
                                            ]),
                                            _: 1
                                          })) : (openBlock(), createBlock(_component_client_only, { key: 1 }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "code-viewer" }, [
                                                createVNode("div", { class: "code-header pa-4" }, [
                                                  createVNode(VChip, {
                                                    color: "primary",
                                                    size: "small",
                                                    variant: "flat",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(selectedLanguage.value), 1)
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VChip, {
                                                    size: "small",
                                                    variant: "outlined"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(code.value.split("\n").length) + " lines ", 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                createVNode(VDivider),
                                                createVNode("div", { class: "pa-6 code-content" }, [
                                                  createVNode("pre", null, [
                                                    createVNode("code", {
                                                      ref_key: "codeBlock",
                                                      ref: codeBlock,
                                                      class: selectedLanguage.value
                                                    }, toDisplayString(code.value), 3)
                                                  ])
                                                ])
                                              ])
                                            ]),
                                            _: 1
                                          }))
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
                          }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Snackbar, {
                modelValue: snackbar.value,
                "onUpdate:modelValue": ($event) => snackbar.value = $event,
                text: snackbarText.value,
                color: snackbarColor.value,
                timeout: 2e3
              }, null, 8, ["modelValue", "onUpdate:modelValue", "text", "color"]),
              createVNode(VDialog, {
                modelValue: deleteDialog.value,
                "onUpdate:modelValue": ($event) => deleteDialog.value = $event,
                "max-width": "400"
              }, {
                default: withCtx(() => [
                  createVNode(VCard, null, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, { class: "bg-error text-white" }, {
                        default: withCtx(() => [
                          createVNode(VIcon, { start: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-alert-circle")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Delete Confirmation ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pt-4" }, {
                        default: withCtx(() => [
                          createVNode("p", null, "Are you sure you want to delete this snippet? This action cannot be undone.")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            variant: "text",
                            onClick: ($event) => deleteDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "error",
                            onClick: confirmDeleteSnippet
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-delete")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Delete ")
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
              }, 8, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/snippetsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const snippetsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1698d373"]]);

export { snippetsView as default };
//# sourceMappingURL=snippetsView-B91H7Ts1.mjs.map
