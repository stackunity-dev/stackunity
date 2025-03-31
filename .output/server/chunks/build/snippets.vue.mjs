import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { S as Snackbar } from './snackbar.vue.mjs';
import { S as useUserStore, V as VApp, g as VIcon, f as VCard, P as VImg, bl as VProgressCircular, $ as VCardTitle, Y as VCardText, i as VAvatar, d as VSpacer, h as VDivider, a0 as VCardActions, e as VBtn, br as VDialog, bp as VSwitch, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VTabs, a as VTab } from './VTabs.mjs';
import { V as VWindow, a as VWindowItem } from './VWindowItem.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VSelect } from './VSelect.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VChip } from './VChip.mjs';
import { V as VAlert } from './VAlert.mjs';
import { V as VToolbar, b as VToolbarTitle } from './VToolbar.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextarea } from './VTextarea.mjs';
import { V as VFileInput } from './VFileInput.mjs';
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
import 'mysql2';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './VCheckboxBtn.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "snippets",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Snippets",
      meta: [
        { name: "description", content: "Deploy and use numerous snippets across the world" },
        { name: "robots", content: "index,follow" },
        { name: "author", content: "DevUnity" },
        { name: "keywords", content: "snippets, code snippets, code, snippets, deploy, use, across, world" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Snippets" },
        { name: "og:description", content: "Deploy and use numerous snippets across the world" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const userStore = useUserStore();
    const tab = ref("World");
    const addSnippets = ref(false);
    ref(false);
    const searchQuery = ref("");
    const frameworkFilter = ref("All");
    const isLoading = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const snackbarIcon = ref("mdi-check-circle");
    const deleteDialog = ref(false);
    const snippetToDelete = ref(null);
    const newSnippet = ref({
      publishWorld: "",
      publishPersonal: "",
      title: "",
      description: "",
      username: "",
      framework: "",
      img: "",
      imgFile: null,
      date: "",
      like: 0,
      favoris: 0,
      isFavorite: false
    });
    const filteredWorldSnippets = computed(() => {
      let snippets = userStore.worldSnippets ? userStore.worldSnippets.slice(0, 30) : [];
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        snippets = snippets.filter(
          (snippet) => {
            var _a, _b;
            return (((_a = snippet.title) == null ? void 0 : _a.toLowerCase()) || "").includes(query) || (((_b = snippet.description) == null ? void 0 : _b.toLowerCase()) || "").includes(query);
          }
        );
      }
      if (frameworkFilter.value !== "All") {
        snippets = snippets.filter((snippet) => snippet.framework === frameworkFilter.value);
      }
      return snippets;
    });
    const filteredPersonalSnippets = computed(() => {
      let snippets = userStore.personalSnippets ? userStore.personalSnippets.slice(0, 30) : [];
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        snippets = snippets.filter(
          (snippet) => {
            var _a, _b;
            return (((_a = snippet.title) == null ? void 0 : _a.toLowerCase()) || "").includes(query) || (((_b = snippet.description) == null ? void 0 : _b.toLowerCase()) || "").includes(query);
          }
        );
      }
      if (frameworkFilter.value !== "All") {
        snippets = snippets.filter((snippet) => snippet.framework === frameworkFilter.value);
      }
      return snippets;
    });
    const filteredFavoriteSnippets = computed(() => {
      const favoriteIds = userStore.favoritesSnippets.map((fav) => fav.snippet_id);
      let worldSnippets = userStore.worldSnippets ? userStore.worldSnippets.slice(0, 15) : [];
      let personalSnippets = userStore.personalSnippets ? userStore.personalSnippets.slice(0, 15) : [];
      worldSnippets = worldSnippets.filter((snippet) => favoriteIds.includes(snippet.id));
      personalSnippets = personalSnippets.filter((snippet) => favoriteIds.includes(snippet.id));
      let snippets = [...worldSnippets, ...personalSnippets];
      snippets.forEach((snippet) => {
        const enhancedSnippet = snippet;
        enhancedSnippet.isFavorite = true;
        if (worldSnippets.includes(snippet)) {
          enhancedSnippet.sourceType = "world";
        } else {
          enhancedSnippet.sourceType = "personal";
        }
      });
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        snippets = snippets.filter(
          (snippet) => {
            var _a, _b;
            return (((_a = snippet.title) == null ? void 0 : _a.toLowerCase()) || "").includes(query) || (((_b = snippet.description) == null ? void 0 : _b.toLowerCase()) || "").includes(query);
          }
        );
      }
      if (frameworkFilter.value !== "All") {
        snippets = snippets.filter((snippet) => snippet.framework === frameworkFilter.value);
      }
      return snippets.slice(0, 30);
    });
    const sendSnippets = async () => {
      try {
        isLoading.value = true;
        await userStore.addSnippets(
          newSnippet.value.title,
          newSnippet.value.description,
          newSnippet.value.framework,
          newSnippet.value.imgFile,
          newSnippet.value.publishWorld,
          newSnippet.value.publishPersonal
        );
        await userStore.loadSnippets();
        addSnippets.value = false;
        newSnippet.value = {
          publishWorld: "",
          publishPersonal: "",
          title: "",
          description: "",
          username: "",
          framework: "",
          img: "",
          imgFile: null,
          date: "",
          like: 0,
          favoris: 0,
          isFavorite: false
        };
        snackbarText.value = "Snippet créé avec succès";
        snackbarColor.value = "success";
        snackbar.value = true;
      } catch (err) {
        console.error("Error adding snippet:", err.message, err.stack);
        snackbarText.value = "Erreur lors de la création du snippet";
        snackbarColor.value = "error";
        snackbar.value = true;
      } finally {
        isLoading.value = false;
      }
    };
    const toggleFavorite = async (snippet, type) => {
      snippet.isFavorite = !snippet.isFavorite;
      try {
        if (snippet.isFavorite) {
          await userStore.addFavorite(snippet.id, type);
          snackbarText.value = "Ajouté aux favoris";
        } else {
          await userStore.removeFavorite(snippet.id);
          snackbarText.value = "Retiré des favoris";
        }
        snackbarColor.value = "success";
        snackbar.value = true;
        await userStore.loadSnippets();
      } catch (error) {
        console.error("Erreur lors de la mise à jour des favoris:", error);
        snippet.isFavorite = !snippet.isFavorite;
        snackbarText.value = "Erreur lors de la mise à jour des favoris";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    const confirmDelete = (snippet) => {
      snippetToDelete.value = snippet;
      deleteDialog.value = true;
    };
    const deleteSnippet = async () => {
      try {
        if (snippetToDelete.value) {
          await userStore.deleteSnippet(snippetToDelete.value.id, "personal");
          deleteDialog.value = false;
          snackbarText.value = "Snippet supprimé avec succès";
          snackbarColor.value = "success";
          snackbar.value = true;
        }
      } catch (err) {
        console.error("Error during deletion:", err.message, err.stack);
        snackbarText.value = "Erreur lors de la suppression du snippet";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    const formatDisplayDate = (snippet) => {
      if (snippet.snippet_date) {
        return userStore.formatDate(snippet.snippet_date);
      } else if (snippet.date) {
        return userStore.formatDate(snippet.date);
      } else {
        return "Date non disponible";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, { fluid: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VTabs, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event,
                          color: "primary",
                          "align-tabs": "center",
                          class: "mb-6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VTab, {
                                value: "World",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, { start: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-earth`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-earth")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` Public Snippets `);
                                  } else {
                                    return [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-earth")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Public Snippets ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VTab, {
                                value: "Personal",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, { start: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-account`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-account")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` My Snippets `);
                                  } else {
                                    return [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-account")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" My Snippets ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VTab, {
                                value: "Favorites",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, { start: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-star`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-star")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` Favorites `);
                                  } else {
                                    return [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-star")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Favorites ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VTab, {
                                  value: "World",
                                  class: "text-subtitle-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { start: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-earth")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Public Snippets ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTab, {
                                  value: "Personal",
                                  class: "text-subtitle-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { start: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-account")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" My Snippets ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTab, {
                                  value: "Favorites",
                                  class: "text-subtitle-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { start: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-star")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Favorites ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VWindow, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VWindowItem, { value: "World" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="d-flex align-center mb-4" data-v-6fc203b4${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search snippets",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(filteredWorldSnippets.value, (snippet, index) => {
                                            _push7(ssrRenderComponent(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${snippet.id}&type=world`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VImg, {
                                                                src: snippet.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(VProgressCircular, {
                                                                              indeterminate: "",
                                                                              color: "primary"
                                                                            })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VRow, {
                                                                        align: "center",
                                                                        justify: "center",
                                                                        class: "fill-height"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          })
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VImg, {
                                                                  src: snippet.img || "/placeholder-image.jpg",
                                                                  height: "200",
                                                                  cover: "",
                                                                  class: "bg-grey-lighten-2"
                                                                }, {
                                                                  placeholder: withCtx(() => [
                                                                    createVNode(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VProgressCircular, {
                                                                          indeterminate: "",
                                                                          color: "primary"
                                                                        })
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["src"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(snippet.title)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(snippet.title), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardText, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<p class="text-body-1 mb-2" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(snippet.description)}</p>`);
                                                              _push10(ssrRenderComponent(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`${ssrInterpolate(snippet.framework)}`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(toDisplayString(snippet.framework), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<div class="d-flex align-center text-grey" data-v-6fc203b4${_scopeId9}>`);
                                                              _push10(ssrRenderComponent(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    }, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span data-v-6fc203b4${_scopeId9}>${ssrInterpolate(snippet.username)}</span>`);
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`mdi-calendar`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode("mdi-calendar")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span class="text-caption" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(formatDisplayDate(snippet))}</span></div>`);
                                                            } else {
                                                              return [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                                createVNode(VChip, {
                                                                  color: "primary",
                                                                  variant: "outlined",
                                                                  size: "small",
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(snippet.framework), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                  createVNode(VAvatar, {
                                                                    size: "24",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", null, toDisplayString(snippet.username), 1),
                                                                  createVNode(VSpacer),
                                                                  createVNode(VIcon, {
                                                                    size: "small",
                                                                    class: "mr-1"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-calendar")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VDivider, null, null, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardActions, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: snippet.isFavorite ? "yellow" : "",
                                                                onClick: ($event) => toggleFavorite(snippet, "world")
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                                    }, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                                      }, null, 8, ["icon"])
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${snippet.id}&type=world`
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(` View Details `);
                                                                    _push11(ssrRenderComponent(VIcon, { end: "" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-arrow-right`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-arrow-right")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(" View Details "),
                                                                      createVNode(VIcon, { end: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-arrow-right")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: snippet.isFavorite ? "yellow" : "",
                                                                  onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                                    }, null, 8, ["icon"])
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color", "onClick"]),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: "primary",
                                                                  to: `/snippetsView?id=${snippet.id}&type=world`
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" View Details "),
                                                                    createVNode(VIcon, { end: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-arrow-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["to"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_NuxtLink, {
                                                            to: `/snippetsView?id=${snippet.id}&type=world`,
                                                            class: "text-decoration-none"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: snippet.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx(() => [
                                                                  createVNode(VRow, {
                                                                    align: "center",
                                                                    justify: "center",
                                                                    class: "fill-height"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VProgressCircular, {
                                                                        indeterminate: "",
                                                                        color: "primary"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["src"])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"]),
                                                          createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(snippet.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                              createVNode(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(snippet.framework), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024),
                                                              createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                createVNode(VAvatar, {
                                                                  size: "24",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", null, toDisplayString(snippet.username), 1),
                                                                createVNode(VSpacer),
                                                                createVNode(VIcon, {
                                                                  size: "small",
                                                                  class: "mr-1"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-calendar")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VDivider),
                                                          createVNode(VCardActions, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: snippet.isFavorite ? "yellow" : "",
                                                                onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                                  }, null, 8, ["icon"])
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color", "onClick"]),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${snippet.id}&type=world`
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" View Details "),
                                                                  createVNode(VIcon, { end: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-arrow-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["to"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VCard, {
                                                      class: "mx-auto snippet-card",
                                                      "max-width": "400",
                                                      elevation: "2",
                                                      hover: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${snippet.id}&type=world`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: snippet.img || "/placeholder-image.jpg",
                                                              height: "200",
                                                              cover: "",
                                                              class: "bg-grey-lighten-2"
                                                            }, {
                                                              placeholder: withCtx(() => [
                                                                createVNode(VRow, {
                                                                  align: "center",
                                                                  justify: "center",
                                                                  class: "fill-height"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VProgressCircular, {
                                                                      indeterminate: "",
                                                                      color: "primary"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["src"])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"]),
                                                        createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(snippet.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                            createVNode(VChip, {
                                                              color: "primary",
                                                              variant: "outlined",
                                                              size: "small",
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(snippet.framework), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                              createVNode(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VImg, {
                                                                    src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                    alt: "avatar"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", null, toDisplayString(snippet.username), 1),
                                                              createVNode(VSpacer),
                                                              createVNode(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-calendar")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VDivider),
                                                        createVNode(VCardActions, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: snippet.isFavorite ? "yellow" : "",
                                                              onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                                }, null, 8, ["icon"])
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color", "onClick"]),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: "primary",
                                                              to: `/snippetsView?id=${snippet.id}&type=world`
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" View Details "),
                                                                createVNode(VIcon, { end: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-arrow-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["to"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                          if (filteredWorldSnippets.value.length === 0) {
                                            _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VAlert, {
                                                    type: "info",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` No snippets found. Try modifying your search criteria. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VAlert, {
                                                      type: "info",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                              return openBlock(), createBlock(VCol, {
                                                key: index,
                                                cols: "12",
                                                sm: "6",
                                                lg: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_NuxtLink, {
                                                        to: `/snippetsView?id=${snippet.id}&type=world`,
                                                        class: "text-decoration-none"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: snippet.img || "/placeholder-image.jpg",
                                                            height: "200",
                                                            cover: "",
                                                            class: "bg-grey-lighten-2"
                                                          }, {
                                                            placeholder: withCtx(() => [
                                                              createVNode(VRow, {
                                                                align: "center",
                                                                justify: "center",
                                                                class: "fill-height"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VProgressCircular, {
                                                                    indeterminate: "",
                                                                    color: "primary"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["src"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"]),
                                                      createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(snippet.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                          createVNode(VChip, {
                                                            color: "primary",
                                                            variant: "outlined",
                                                            size: "small",
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(snippet.framework), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                            createVNode(VAvatar, {
                                                              size: "24",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VImg, {
                                                                  src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                  alt: "avatar"
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", null, toDisplayString(snippet.username), 1),
                                                            createVNode(VSpacer),
                                                            createVNode(VIcon, {
                                                              size: "small",
                                                              class: "mr-1"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-calendar")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VDivider),
                                                      createVNode(VCardActions, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: snippet.isFavorite ? "yellow" : "",
                                                            onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                              }, null, 8, ["icon"])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color", "onClick"]),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: "primary",
                                                            to: `/snippetsView?id=${snippet.id}&type=world`
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" View Details "),
                                                              createVNode(VIcon, { end: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-arrow-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128)),
                                            filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                              key: 0,
                                              cols: "12"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VAlert, {
                                                  type: "info",
                                                  variant: "tonal"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" No snippets found. Try modifying your search criteria. ")
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", { class: "d-flex align-center mb-4" }, [
                                        createVNode(VTextField, {
                                          modelValue: searchQuery.value,
                                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                          "prepend-inner-icon": "mdi-magnify",
                                          label: "Search snippets",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          class: "mr-4"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VSelect, {
                                          modelValue: frameworkFilter.value,
                                          "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                          items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                          label: "Framework",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          style: { "max-width": "200px" }
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                            return openBlock(), createBlock(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  class: "mx-auto snippet-card",
                                                  "max-width": "400",
                                                  elevation: "2",
                                                  hover: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_NuxtLink, {
                                                      to: `/snippetsView?id=${snippet.id}&type=world`,
                                                      class: "text-decoration-none"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: snippet.img || "/placeholder-image.jpg",
                                                          height: "200",
                                                          cover: "",
                                                          class: "bg-grey-lighten-2"
                                                        }, {
                                                          placeholder: withCtx(() => [
                                                            createVNode(VRow, {
                                                              align: "center",
                                                              justify: "center",
                                                              class: "fill-height"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VProgressCircular, {
                                                                  indeterminate: "",
                                                                  color: "primary"
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["src"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"]),
                                                    createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(snippet.title), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                        createVNode(VChip, {
                                                          color: "primary",
                                                          variant: "outlined",
                                                          size: "small",
                                                          class: "mb-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(snippet.framework), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                          createVNode(VAvatar, {
                                                            size: "24",
                                                            class: "mr-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                alt: "avatar"
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", null, toDisplayString(snippet.username), 1),
                                                          createVNode(VSpacer),
                                                          createVNode(VIcon, {
                                                            size: "small",
                                                            class: "mr-1"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-calendar")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VDivider),
                                                    createVNode(VCardActions, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: snippet.isFavorite ? "yellow" : "",
                                                          onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                            }, null, 8, ["icon"])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color", "onClick"]),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: "primary",
                                                          to: `/snippetsView?id=${snippet.id}&type=world`
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" View Details "),
                                                            createVNode(VIcon, { end: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-arrow-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128)),
                                          filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                            key: 0,
                                            cols: "12"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VAlert, {
                                                type: "info",
                                                variant: "tonal"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VWindowItem, { value: "Personal" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="d-flex align-center mb-4" data-v-6fc203b4${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search in my snippets",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(filteredPersonalSnippets.value, (snippet, index) => {
                                            _push7(ssrRenderComponent(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VImg, {
                                                                src: snippet.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(VProgressCircular, {
                                                                              indeterminate: "",
                                                                              color: "primary"
                                                                            })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VRow, {
                                                                        align: "center",
                                                                        justify: "center",
                                                                        class: "fill-height"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          })
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VImg, {
                                                                  src: snippet.img || "/placeholder-image.jpg",
                                                                  height: "200",
                                                                  cover: "",
                                                                  class: "bg-grey-lighten-2"
                                                                }, {
                                                                  placeholder: withCtx(() => [
                                                                    createVNode(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VProgressCircular, {
                                                                          indeterminate: "",
                                                                          color: "primary"
                                                                        })
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["src"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(snippet.title)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(snippet.title), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardText, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<p class="text-body-1 mb-2" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(snippet.description)}</p>`);
                                                              _push10(ssrRenderComponent(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`${ssrInterpolate(snippet.framework)}`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(toDisplayString(snippet.framework), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<div class="d-flex align-center text-grey" data-v-6fc203b4${_scopeId9}>`);
                                                              _push10(ssrRenderComponent(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    }, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span data-v-6fc203b4${_scopeId9}>${ssrInterpolate(snippet.username)}</span>`);
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`mdi-calendar`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode("mdi-calendar")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span class="text-caption" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(formatDisplayDate(snippet))}</span></div>`);
                                                            } else {
                                                              return [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                                createVNode(VChip, {
                                                                  color: "primary",
                                                                  variant: "outlined",
                                                                  size: "small",
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(snippet.framework), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                  createVNode(VAvatar, {
                                                                    size: "24",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", null, toDisplayString(snippet.username), 1),
                                                                  createVNode(VSpacer),
                                                                  createVNode(VIcon, {
                                                                    size: "small",
                                                                    class: "mr-1"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-calendar")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VDivider, null, null, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardActions, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: "error",
                                                                onClick: ($event) => confirmDelete(snippet)
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-delete`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-delete")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-delete")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${snippet.id}&type=personal`
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(` View Details `);
                                                                    _push11(ssrRenderComponent(VIcon, { end: "" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-arrow-right`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-arrow-right")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(" View Details "),
                                                                      createVNode(VIcon, { end: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-arrow-right")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: "error",
                                                                  onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-delete")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["onClick"]),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: "primary",
                                                                  to: `/snippetsView?id=${snippet.id}&type=personal`
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" View Details "),
                                                                    createVNode(VIcon, { end: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-arrow-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["to"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_NuxtLink, {
                                                            to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                            class: "text-decoration-none"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: snippet.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx(() => [
                                                                  createVNode(VRow, {
                                                                    align: "center",
                                                                    justify: "center",
                                                                    class: "fill-height"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VProgressCircular, {
                                                                        indeterminate: "",
                                                                        color: "primary"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["src"])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"]),
                                                          createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(snippet.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                              createVNode(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(snippet.framework), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024),
                                                              createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                createVNode(VAvatar, {
                                                                  size: "24",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", null, toDisplayString(snippet.username), 1),
                                                                createVNode(VSpacer),
                                                                createVNode(VIcon, {
                                                                  size: "small",
                                                                  class: "mr-1"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-calendar")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VDivider),
                                                          createVNode(VCardActions, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: "error",
                                                                onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-delete")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["onClick"]),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${snippet.id}&type=personal`
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" View Details "),
                                                                  createVNode(VIcon, { end: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-arrow-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["to"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VCard, {
                                                      class: "mx-auto snippet-card",
                                                      "max-width": "400",
                                                      elevation: "2",
                                                      hover: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: snippet.img || "/placeholder-image.jpg",
                                                              height: "200",
                                                              cover: "",
                                                              class: "bg-grey-lighten-2"
                                                            }, {
                                                              placeholder: withCtx(() => [
                                                                createVNode(VRow, {
                                                                  align: "center",
                                                                  justify: "center",
                                                                  class: "fill-height"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VProgressCircular, {
                                                                      indeterminate: "",
                                                                      color: "primary"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["src"])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"]),
                                                        createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(snippet.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                            createVNode(VChip, {
                                                              color: "primary",
                                                              variant: "outlined",
                                                              size: "small",
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(snippet.framework), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                              createVNode(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VImg, {
                                                                    src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                    alt: "avatar"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", null, toDisplayString(snippet.username), 1),
                                                              createVNode(VSpacer),
                                                              createVNode(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-calendar")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VDivider),
                                                        createVNode(VCardActions, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: "error",
                                                              onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-delete")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["onClick"]),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: "primary",
                                                              to: `/snippetsView?id=${snippet.id}&type=personal`
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" View Details "),
                                                                createVNode(VIcon, { end: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-arrow-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["to"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                          if (filteredPersonalSnippets.value.length === 0) {
                                            _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VAlert, {
                                                    type: "info",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` You don&#39;t have any snippets yet. Create a new one! `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VAlert, {
                                                      type: "info",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                              return openBlock(), createBlock(VCol, {
                                                key: index,
                                                cols: "12",
                                                sm: "6",
                                                lg: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_NuxtLink, {
                                                        to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                        class: "text-decoration-none"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: snippet.img || "/placeholder-image.jpg",
                                                            height: "200",
                                                            cover: "",
                                                            class: "bg-grey-lighten-2"
                                                          }, {
                                                            placeholder: withCtx(() => [
                                                              createVNode(VRow, {
                                                                align: "center",
                                                                justify: "center",
                                                                class: "fill-height"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VProgressCircular, {
                                                                    indeterminate: "",
                                                                    color: "primary"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["src"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"]),
                                                      createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(snippet.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                          createVNode(VChip, {
                                                            color: "primary",
                                                            variant: "outlined",
                                                            size: "small",
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(snippet.framework), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                            createVNode(VAvatar, {
                                                              size: "24",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VImg, {
                                                                  src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                  alt: "avatar"
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", null, toDisplayString(snippet.username), 1),
                                                            createVNode(VSpacer),
                                                            createVNode(VIcon, {
                                                              size: "small",
                                                              class: "mr-1"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-calendar")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VDivider),
                                                      createVNode(VCardActions, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: "error",
                                                            onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-delete")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["onClick"]),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: "primary",
                                                            to: `/snippetsView?id=${snippet.id}&type=personal`
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" View Details "),
                                                              createVNode(VIcon, { end: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-arrow-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128)),
                                            filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                              key: 0,
                                              cols: "12"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VAlert, {
                                                  type: "info",
                                                  variant: "tonal"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" You don't have any snippets yet. Create a new one! ")
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", { class: "d-flex align-center mb-4" }, [
                                        createVNode(VTextField, {
                                          modelValue: searchQuery.value,
                                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                          "prepend-inner-icon": "mdi-magnify",
                                          label: "Search in my snippets",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          class: "mr-4"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VSelect, {
                                          modelValue: frameworkFilter.value,
                                          "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                          items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                          label: "Framework",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          style: { "max-width": "200px" }
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                            return openBlock(), createBlock(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  class: "mx-auto snippet-card",
                                                  "max-width": "400",
                                                  elevation: "2",
                                                  hover: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_NuxtLink, {
                                                      to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                      class: "text-decoration-none"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: snippet.img || "/placeholder-image.jpg",
                                                          height: "200",
                                                          cover: "",
                                                          class: "bg-grey-lighten-2"
                                                        }, {
                                                          placeholder: withCtx(() => [
                                                            createVNode(VRow, {
                                                              align: "center",
                                                              justify: "center",
                                                              class: "fill-height"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VProgressCircular, {
                                                                  indeterminate: "",
                                                                  color: "primary"
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["src"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"]),
                                                    createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(snippet.title), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                        createVNode(VChip, {
                                                          color: "primary",
                                                          variant: "outlined",
                                                          size: "small",
                                                          class: "mb-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(snippet.framework), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                          createVNode(VAvatar, {
                                                            size: "24",
                                                            class: "mr-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                alt: "avatar"
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", null, toDisplayString(snippet.username), 1),
                                                          createVNode(VSpacer),
                                                          createVNode(VIcon, {
                                                            size: "small",
                                                            class: "mr-1"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-calendar")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VDivider),
                                                    createVNode(VCardActions, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: "error",
                                                          onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-delete")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["onClick"]),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: "primary",
                                                          to: `/snippetsView?id=${snippet.id}&type=personal`
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" View Details "),
                                                            createVNode(VIcon, { end: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-arrow-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128)),
                                          filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                            key: 0,
                                            cols: "12"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VAlert, {
                                                type: "info",
                                                variant: "tonal"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VWindowItem, { value: "Favorites" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="d-flex align-center mb-4" data-v-6fc203b4${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search in my favorites",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                            _push7(ssrRenderComponent(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VImg, {
                                                                src: favorite.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          }, null, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(VProgressCircular, {
                                                                              indeterminate: "",
                                                                              color: "primary"
                                                                            })
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VRow, {
                                                                        align: "center",
                                                                        justify: "center",
                                                                        class: "fill-height"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VProgressCircular, {
                                                                            indeterminate: "",
                                                                            color: "primary"
                                                                          })
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VImg, {
                                                                  src: favorite.img || "/placeholder-image.jpg",
                                                                  height: "200",
                                                                  cover: "",
                                                                  class: "bg-grey-lighten-2"
                                                                }, {
                                                                  placeholder: withCtx(() => [
                                                                    createVNode(VRow, {
                                                                      align: "center",
                                                                      justify: "center",
                                                                      class: "fill-height"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VProgressCircular, {
                                                                          indeterminate: "",
                                                                          color: "primary"
                                                                        })
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["src"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(favorite.title)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(favorite.title), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardText, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<p class="text-body-1 mb-2" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(favorite.description)}</p>`);
                                                              _push10(ssrRenderComponent(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`${ssrInterpolate(favorite.framework)}`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(toDisplayString(favorite.framework), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<div class="d-flex align-center text-grey" data-v-6fc203b4${_scopeId9}>`);
                                                              _push10(ssrRenderComponent(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    }, null, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span data-v-6fc203b4${_scopeId9}>${ssrInterpolate(favorite.username)}</span>`);
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`mdi-calendar`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode("mdi-calendar")
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<span class="text-caption" data-v-6fc203b4${_scopeId9}>${ssrInterpolate(formatDisplayDate(favorite))}</span></div>`);
                                                            } else {
                                                              return [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                                createVNode(VChip, {
                                                                  color: "primary",
                                                                  variant: "outlined",
                                                                  size: "small",
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(favorite.framework), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                  createVNode(VAvatar, {
                                                                    size: "24",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VImg, {
                                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                        alt: "avatar"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", null, toDisplayString(favorite.username), 1),
                                                                  createVNode(VSpacer),
                                                                  createVNode(VIcon, {
                                                                    size: "small",
                                                                    class: "mr-1"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-calendar")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VDivider, null, null, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardActions, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: "yellow",
                                                                onClick: ($event) => toggleFavorite(favorite, "world")
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, null, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-bookmark`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-bookmark")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-bookmark")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                              _push10(ssrRenderComponent(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(` View Details `);
                                                                    _push11(ssrRenderComponent(VIcon, { end: "" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-arrow-right`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-arrow-right")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(" View Details "),
                                                                      createVNode(VIcon, { end: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-arrow-right")
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: "yellow",
                                                                  onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-bookmark")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["onClick"]),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  variant: "text",
                                                                  color: "primary",
                                                                  to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" View Details "),
                                                                    createVNode(VIcon, { end: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-arrow-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["to"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_NuxtLink, {
                                                            to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                            class: "text-decoration-none"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: favorite.img || "/placeholder-image.jpg",
                                                                height: "200",
                                                                cover: "",
                                                                class: "bg-grey-lighten-2"
                                                              }, {
                                                                placeholder: withCtx(() => [
                                                                  createVNode(VRow, {
                                                                    align: "center",
                                                                    justify: "center",
                                                                    class: "fill-height"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VProgressCircular, {
                                                                        indeterminate: "",
                                                                        color: "primary"
                                                                      })
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["src"])
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"]),
                                                          createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(favorite.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                              createVNode(VChip, {
                                                                color: "primary",
                                                                variant: "outlined",
                                                                size: "small",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(favorite.framework), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024),
                                                              createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                                createVNode(VAvatar, {
                                                                  size: "24",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VImg, {
                                                                      src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                      alt: "avatar"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", null, toDisplayString(favorite.username), 1),
                                                                createVNode(VSpacer),
                                                                createVNode(VIcon, {
                                                                  size: "small",
                                                                  class: "mr-1"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-calendar")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode(VDivider),
                                                          createVNode(VCardActions, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: "yellow",
                                                                onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-bookmark")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["onClick"]),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" View Details "),
                                                                  createVNode(VIcon, { end: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-arrow-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["to"])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VCard, {
                                                      class: "mx-auto snippet-card",
                                                      "max-width": "400",
                                                      elevation: "2",
                                                      hover: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_NuxtLink, {
                                                          to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                          class: "text-decoration-none"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: favorite.img || "/placeholder-image.jpg",
                                                              height: "200",
                                                              cover: "",
                                                              class: "bg-grey-lighten-2"
                                                            }, {
                                                              placeholder: withCtx(() => [
                                                                createVNode(VRow, {
                                                                  align: "center",
                                                                  justify: "center",
                                                                  class: "fill-height"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VProgressCircular, {
                                                                      indeterminate: "",
                                                                      color: "primary"
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["src"])
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"]),
                                                        createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(favorite.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                            createVNode(VChip, {
                                                              color: "primary",
                                                              variant: "outlined",
                                                              size: "small",
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(favorite.framework), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024),
                                                            createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                              createVNode(VAvatar, {
                                                                size: "24",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VImg, {
                                                                    src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                    alt: "avatar"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", null, toDisplayString(favorite.username), 1),
                                                              createVNode(VSpacer),
                                                              createVNode(VIcon, {
                                                                size: "small",
                                                                class: "mr-1"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-calendar")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode(VDivider),
                                                        createVNode(VCardActions, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: "yellow",
                                                              onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-bookmark")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["onClick"]),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              variant: "text",
                                                              color: "primary",
                                                              to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" View Details "),
                                                                createVNode(VIcon, { end: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-arrow-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["to"])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                          if (filteredFavoriteSnippets.value.length === 0) {
                                            _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VAlert, {
                                                    type: "info",
                                                    variant: "tonal"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` You don&#39;t have any favorite snippets yet. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" You don't have any favorite snippets yet. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VAlert, {
                                                      type: "info",
                                                      variant: "tonal"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" You don't have any favorite snippets yet. ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                              return openBlock(), createBlock(VCol, {
                                                key: index,
                                                cols: "12",
                                                sm: "6",
                                                lg: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    class: "mx-auto snippet-card",
                                                    "max-width": "400",
                                                    elevation: "2",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_NuxtLink, {
                                                        to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                        class: "text-decoration-none"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: favorite.img || "/placeholder-image.jpg",
                                                            height: "200",
                                                            cover: "",
                                                            class: "bg-grey-lighten-2"
                                                          }, {
                                                            placeholder: withCtx(() => [
                                                              createVNode(VRow, {
                                                                align: "center",
                                                                justify: "center",
                                                                class: "fill-height"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VProgressCircular, {
                                                                    indeterminate: "",
                                                                    color: "primary"
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["src"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"]),
                                                      createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(favorite.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                          createVNode(VChip, {
                                                            color: "primary",
                                                            variant: "outlined",
                                                            size: "small",
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(favorite.framework), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024),
                                                          createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                            createVNode(VAvatar, {
                                                              size: "24",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VImg, {
                                                                  src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                  alt: "avatar"
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", null, toDisplayString(favorite.username), 1),
                                                            createVNode(VSpacer),
                                                            createVNode(VIcon, {
                                                              size: "small",
                                                              class: "mr-1"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-calendar")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode(VDivider),
                                                      createVNode(VCardActions, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: "yellow",
                                                            onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-bookmark")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["onClick"]),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            variant: "text",
                                                            color: "primary",
                                                            to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" View Details "),
                                                              createVNode(VIcon, { end: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-arrow-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128)),
                                            filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                              key: 0,
                                              cols: "12"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VAlert, {
                                                  type: "info",
                                                  variant: "tonal"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" You don't have any favorite snippets yet. ")
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", { class: "d-flex align-center mb-4" }, [
                                        createVNode(VTextField, {
                                          modelValue: searchQuery.value,
                                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                          "prepend-inner-icon": "mdi-magnify",
                                          label: "Search in my favorites",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          class: "mr-4"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VSelect, {
                                          modelValue: frameworkFilter.value,
                                          "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                          items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                          label: "Framework",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          style: { "max-width": "200px" }
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                            return openBlock(), createBlock(VCol, {
                                              key: index,
                                              cols: "12",
                                              sm: "6",
                                              lg: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  class: "mx-auto snippet-card",
                                                  "max-width": "400",
                                                  elevation: "2",
                                                  hover: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(_component_NuxtLink, {
                                                      to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                      class: "text-decoration-none"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: favorite.img || "/placeholder-image.jpg",
                                                          height: "200",
                                                          cover: "",
                                                          class: "bg-grey-lighten-2"
                                                        }, {
                                                          placeholder: withCtx(() => [
                                                            createVNode(VRow, {
                                                              align: "center",
                                                              justify: "center",
                                                              class: "fill-height"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VProgressCircular, {
                                                                  indeterminate: "",
                                                                  color: "primary"
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["src"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"]),
                                                    createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(favorite.title), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                        createVNode(VChip, {
                                                          color: "primary",
                                                          variant: "outlined",
                                                          size: "small",
                                                          class: "mb-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(favorite.framework), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024),
                                                        createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                          createVNode(VAvatar, {
                                                            size: "24",
                                                            class: "mr-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VImg, {
                                                                src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                                alt: "avatar"
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", null, toDisplayString(favorite.username), 1),
                                                          createVNode(VSpacer),
                                                          createVNode(VIcon, {
                                                            size: "small",
                                                            class: "mr-1"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-calendar")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode(VDivider),
                                                    createVNode(VCardActions, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: "yellow",
                                                          onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-bookmark")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["onClick"]),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          variant: "text",
                                                          color: "primary",
                                                          to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" View Details "),
                                                            createVNode(VIcon, { end: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-arrow-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128)),
                                          filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                            key: 0,
                                            cols: "12"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VAlert, {
                                                type: "info",
                                                variant: "tonal"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" You don't have any favorite snippets yet. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true)
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
                                createVNode(VWindowItem, { value: "World" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center mb-4" }, [
                                      createVNode(VTextField, {
                                        modelValue: searchQuery.value,
                                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                        "prepend-inner-icon": "mdi-magnify",
                                        label: "Search snippets",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        class: "mr-4"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VSelect, {
                                        modelValue: frameworkFilter.value,
                                        "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                        items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                        label: "Framework",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        style: { "max-width": "200px" }
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                          return openBlock(), createBlock(VCol, {
                                            key: index,
                                            cols: "12",
                                            sm: "6",
                                            lg: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                class: "mx-auto snippet-card",
                                                "max-width": "400",
                                                elevation: "2",
                                                hover: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_NuxtLink, {
                                                    to: `/snippetsView?id=${snippet.id}&type=world`,
                                                    class: "text-decoration-none"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: snippet.img || "/placeholder-image.jpg",
                                                        height: "200",
                                                        cover: "",
                                                        class: "bg-grey-lighten-2"
                                                      }, {
                                                        placeholder: withCtx(() => [
                                                          createVNode(VRow, {
                                                            align: "center",
                                                            justify: "center",
                                                            class: "fill-height"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VProgressCircular, {
                                                                indeterminate: "",
                                                                color: "primary"
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["src"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"]),
                                                  createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(snippet.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                      createVNode(VChip, {
                                                        color: "primary",
                                                        variant: "outlined",
                                                        size: "small",
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(snippet.framework), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                        createVNode(VAvatar, {
                                                          size: "24",
                                                          class: "mr-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                              alt: "avatar"
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", null, toDisplayString(snippet.username), 1),
                                                        createVNode(VSpacer),
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-calendar")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VDivider),
                                                  createVNode(VCardActions, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: snippet.isFavorite ? "yellow" : "",
                                                        onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                          }, null, 8, ["icon"])
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color", "onClick"]),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: "primary",
                                                        to: `/snippetsView?id=${snippet.id}&type=world`
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" View Details "),
                                                          createVNode(VIcon, { end: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-arrow-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128)),
                                        filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                          key: 0,
                                          cols: "12"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VAlert, {
                                              type: "info",
                                              variant: "tonal"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VWindowItem, { value: "Personal" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center mb-4" }, [
                                      createVNode(VTextField, {
                                        modelValue: searchQuery.value,
                                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                        "prepend-inner-icon": "mdi-magnify",
                                        label: "Search in my snippets",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        class: "mr-4"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VSelect, {
                                        modelValue: frameworkFilter.value,
                                        "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                        items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                        label: "Framework",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        style: { "max-width": "200px" }
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                          return openBlock(), createBlock(VCol, {
                                            key: index,
                                            cols: "12",
                                            sm: "6",
                                            lg: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                class: "mx-auto snippet-card",
                                                "max-width": "400",
                                                elevation: "2",
                                                hover: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_NuxtLink, {
                                                    to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                    class: "text-decoration-none"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: snippet.img || "/placeholder-image.jpg",
                                                        height: "200",
                                                        cover: "",
                                                        class: "bg-grey-lighten-2"
                                                      }, {
                                                        placeholder: withCtx(() => [
                                                          createVNode(VRow, {
                                                            align: "center",
                                                            justify: "center",
                                                            class: "fill-height"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VProgressCircular, {
                                                                indeterminate: "",
                                                                color: "primary"
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["src"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"]),
                                                  createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(snippet.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                      createVNode(VChip, {
                                                        color: "primary",
                                                        variant: "outlined",
                                                        size: "small",
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(snippet.framework), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                        createVNode(VAvatar, {
                                                          size: "24",
                                                          class: "mr-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                              alt: "avatar"
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", null, toDisplayString(snippet.username), 1),
                                                        createVNode(VSpacer),
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-calendar")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VDivider),
                                                  createVNode(VCardActions, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: "error",
                                                        onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-delete")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["onClick"]),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: "primary",
                                                        to: `/snippetsView?id=${snippet.id}&type=personal`
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" View Details "),
                                                          createVNode(VIcon, { end: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-arrow-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128)),
                                        filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                          key: 0,
                                          cols: "12"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VAlert, {
                                              type: "info",
                                              variant: "tonal"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VWindowItem, { value: "Favorites" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center mb-4" }, [
                                      createVNode(VTextField, {
                                        modelValue: searchQuery.value,
                                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                        "prepend-inner-icon": "mdi-magnify",
                                        label: "Search in my favorites",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        class: "mr-4"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VSelect, {
                                        modelValue: frameworkFilter.value,
                                        "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                        items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                        label: "Framework",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        style: { "max-width": "200px" }
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                          return openBlock(), createBlock(VCol, {
                                            key: index,
                                            cols: "12",
                                            sm: "6",
                                            lg: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                class: "mx-auto snippet-card",
                                                "max-width": "400",
                                                elevation: "2",
                                                hover: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_NuxtLink, {
                                                    to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                    class: "text-decoration-none"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: favorite.img || "/placeholder-image.jpg",
                                                        height: "200",
                                                        cover: "",
                                                        class: "bg-grey-lighten-2"
                                                      }, {
                                                        placeholder: withCtx(() => [
                                                          createVNode(VRow, {
                                                            align: "center",
                                                            justify: "center",
                                                            class: "fill-height"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VProgressCircular, {
                                                                indeterminate: "",
                                                                color: "primary"
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["src"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"]),
                                                  createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(favorite.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                      createVNode(VChip, {
                                                        color: "primary",
                                                        variant: "outlined",
                                                        size: "small",
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(favorite.framework), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024),
                                                      createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                        createVNode(VAvatar, {
                                                          size: "24",
                                                          class: "mr-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VImg, {
                                                              src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                              alt: "avatar"
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", null, toDisplayString(favorite.username), 1),
                                                        createVNode(VSpacer),
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-calendar")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode(VDivider),
                                                  createVNode(VCardActions, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: "yellow",
                                                        onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-bookmark")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["onClick"]),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        variant: "text",
                                                        color: "primary",
                                                        to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" View Details "),
                                                          createVNode(VIcon, { end: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-arrow-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128)),
                                        filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                          key: 0,
                                          cols: "12"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VAlert, {
                                              type: "info",
                                              variant: "tonal"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" You don't have any favorite snippets yet. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
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
                          createVNode(VTabs, {
                            modelValue: tab.value,
                            "onUpdate:modelValue": ($event) => tab.value = $event,
                            color: "primary",
                            "align-tabs": "center",
                            class: "mb-6"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTab, {
                                value: "World",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { start: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-earth")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Public Snippets ")
                                ]),
                                _: 1
                              }),
                              createVNode(VTab, {
                                value: "Personal",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { start: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" My Snippets ")
                                ]),
                                _: 1
                              }),
                              createVNode(VTab, {
                                value: "Favorites",
                                class: "text-subtitle-1"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { start: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-star")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Favorites ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(VWindow, {
                            modelValue: tab.value,
                            "onUpdate:modelValue": ($event) => tab.value = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(VWindowItem, { value: "World" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex align-center mb-4" }, [
                                    createVNode(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search snippets",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: index,
                                          cols: "12",
                                          sm: "6",
                                          lg: "4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              class: "mx-auto snippet-card",
                                              "max-width": "400",
                                              elevation: "2",
                                              hover: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_NuxtLink, {
                                                  to: `/snippetsView?id=${snippet.id}&type=world`,
                                                  class: "text-decoration-none"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VImg, {
                                                      src: snippet.img || "/placeholder-image.jpg",
                                                      height: "200",
                                                      cover: "",
                                                      class: "bg-grey-lighten-2"
                                                    }, {
                                                      placeholder: withCtx(() => [
                                                        createVNode(VRow, {
                                                          align: "center",
                                                          justify: "center",
                                                          class: "fill-height"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VProgressCircular, {
                                                              indeterminate: "",
                                                              color: "primary"
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["src"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"]),
                                                createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(snippet.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                    createVNode(VChip, {
                                                      color: "primary",
                                                      variant: "outlined",
                                                      size: "small",
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(snippet.framework), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                      createVNode(VAvatar, {
                                                        size: "24",
                                                        class: "mr-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                            alt: "avatar"
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", null, toDisplayString(snippet.username), 1),
                                                      createVNode(VSpacer),
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-calendar")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VDivider),
                                                createVNode(VCardActions, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: snippet.isFavorite ? "yellow" : "",
                                                      onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                        }, null, 8, ["icon"])
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color", "onClick"]),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: "primary",
                                                      to: `/snippetsView?id=${snippet.id}&type=world`
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" View Details "),
                                                        createVNode(VIcon, { end: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-arrow-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128)),
                                      filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                        key: 0,
                                        cols: "12"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VAlert, {
                                            type: "info",
                                            variant: "tonal"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VWindowItem, { value: "Personal" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex align-center mb-4" }, [
                                    createVNode(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search in my snippets",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: index,
                                          cols: "12",
                                          sm: "6",
                                          lg: "4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              class: "mx-auto snippet-card",
                                              "max-width": "400",
                                              elevation: "2",
                                              hover: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_NuxtLink, {
                                                  to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                  class: "text-decoration-none"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VImg, {
                                                      src: snippet.img || "/placeholder-image.jpg",
                                                      height: "200",
                                                      cover: "",
                                                      class: "bg-grey-lighten-2"
                                                    }, {
                                                      placeholder: withCtx(() => [
                                                        createVNode(VRow, {
                                                          align: "center",
                                                          justify: "center",
                                                          class: "fill-height"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VProgressCircular, {
                                                              indeterminate: "",
                                                              color: "primary"
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["src"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"]),
                                                createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(snippet.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                    createVNode(VChip, {
                                                      color: "primary",
                                                      variant: "outlined",
                                                      size: "small",
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(snippet.framework), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                      createVNode(VAvatar, {
                                                        size: "24",
                                                        class: "mr-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                            alt: "avatar"
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", null, toDisplayString(snippet.username), 1),
                                                      createVNode(VSpacer),
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-calendar")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VDivider),
                                                createVNode(VCardActions, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: "error",
                                                      onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-delete")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick"]),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: "primary",
                                                      to: `/snippetsView?id=${snippet.id}&type=personal`
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" View Details "),
                                                        createVNode(VIcon, { end: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-arrow-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128)),
                                      filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                        key: 0,
                                        cols: "12"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VAlert, {
                                            type: "info",
                                            variant: "tonal"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VWindowItem, { value: "Favorites" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex align-center mb-4" }, [
                                    createVNode(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search in my favorites",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mr-4"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VSelect, {
                                      modelValue: frameworkFilter.value,
                                      "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                      items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                      label: "Framework",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      style: { "max-width": "200px" }
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: index,
                                          cols: "12",
                                          sm: "6",
                                          lg: "4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              class: "mx-auto snippet-card",
                                              "max-width": "400",
                                              elevation: "2",
                                              hover: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_NuxtLink, {
                                                  to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                  class: "text-decoration-none"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VImg, {
                                                      src: favorite.img || "/placeholder-image.jpg",
                                                      height: "200",
                                                      cover: "",
                                                      class: "bg-grey-lighten-2"
                                                    }, {
                                                      placeholder: withCtx(() => [
                                                        createVNode(VRow, {
                                                          align: "center",
                                                          justify: "center",
                                                          class: "fill-height"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VProgressCircular, {
                                                              indeterminate: "",
                                                              color: "primary"
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["src"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"]),
                                                createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(favorite.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                    createVNode(VChip, {
                                                      color: "primary",
                                                      variant: "outlined",
                                                      size: "small",
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(favorite.framework), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024),
                                                    createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                      createVNode(VAvatar, {
                                                        size: "24",
                                                        class: "mr-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VImg, {
                                                            src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                            alt: "avatar"
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", null, toDisplayString(favorite.username), 1),
                                                      createVNode(VSpacer),
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-calendar")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VDivider),
                                                createVNode(VCardActions, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: "yellow",
                                                      onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-bookmark")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["onClick"]),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      variant: "text",
                                                      color: "primary",
                                                      to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" View Details "),
                                                        createVNode(VIcon, { end: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-arrow-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128)),
                                      filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                        key: 0,
                                        cols: "12"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VAlert, {
                                            type: "info",
                                            variant: "tonal"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" You don't have any favorite snippets yet. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, { fluid: "" }, {
                      default: withCtx(() => [
                        createVNode(VTabs, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event,
                          color: "primary",
                          "align-tabs": "center",
                          class: "mb-6"
                        }, {
                          default: withCtx(() => [
                            createVNode(VTab, {
                              value: "World",
                              class: "text-subtitle-1"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-earth")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Public Snippets ")
                              ]),
                              _: 1
                            }),
                            createVNode(VTab, {
                              value: "Personal",
                              class: "text-subtitle-1"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" My Snippets ")
                              ]),
                              _: 1
                            }),
                            createVNode(VTab, {
                              value: "Favorites",
                              class: "text-subtitle-1"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-star")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Favorites ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(VWindow, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(VWindowItem, { value: "World" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-4" }, [
                                  createVNode(VTextField, {
                                    modelValue: searchQuery.value,
                                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                    "prepend-inner-icon": "mdi-magnify",
                                    label: "Search snippets",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    class: "mr-4"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VSelect, {
                                    modelValue: frameworkFilter.value,
                                    "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                    items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                    label: "Framework",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    style: { "max-width": "200px" }
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                      return openBlock(), createBlock(VCol, {
                                        key: index,
                                        cols: "12",
                                        sm: "6",
                                        lg: "4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            class: "mx-auto snippet-card",
                                            "max-width": "400",
                                            elevation: "2",
                                            hover: ""
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                to: `/snippetsView?id=${snippet.id}&type=world`,
                                                class: "text-decoration-none"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VImg, {
                                                    src: snippet.img || "/placeholder-image.jpg",
                                                    height: "200",
                                                    cover: "",
                                                    class: "bg-grey-lighten-2"
                                                  }, {
                                                    placeholder: withCtx(() => [
                                                      createVNode(VRow, {
                                                        align: "center",
                                                        justify: "center",
                                                        class: "fill-height"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VProgressCircular, {
                                                            indeterminate: "",
                                                            color: "primary"
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["src"])
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]),
                                              createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(snippet.title), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardText, null, {
                                                default: withCtx(() => [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                  createVNode(VChip, {
                                                    color: "primary",
                                                    variant: "outlined",
                                                    size: "small",
                                                    class: "mb-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(snippet.framework), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                    createVNode(VAvatar, {
                                                      size: "24",
                                                      class: "mr-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                          alt: "avatar"
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", null, toDisplayString(snippet.username), 1),
                                                    createVNode(VSpacer),
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-calendar")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VDivider),
                                              createVNode(VCardActions, null, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: snippet.isFavorite ? "yellow" : "",
                                                    onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                      }, null, 8, ["icon"])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color", "onClick"]),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: "primary",
                                                    to: `/snippetsView?id=${snippet.id}&type=world`
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" View Details "),
                                                      createVNode(VIcon, { end: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-arrow-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128)),
                                    filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                      key: 0,
                                      cols: "12"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VAlert, {
                                          type: "info",
                                          variant: "tonal"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VWindowItem, { value: "Personal" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-4" }, [
                                  createVNode(VTextField, {
                                    modelValue: searchQuery.value,
                                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                    "prepend-inner-icon": "mdi-magnify",
                                    label: "Search in my snippets",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    class: "mr-4"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VSelect, {
                                    modelValue: frameworkFilter.value,
                                    "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                    items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                    label: "Framework",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    style: { "max-width": "200px" }
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                      return openBlock(), createBlock(VCol, {
                                        key: index,
                                        cols: "12",
                                        sm: "6",
                                        lg: "4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            class: "mx-auto snippet-card",
                                            "max-width": "400",
                                            elevation: "2",
                                            hover: ""
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                to: `/snippetsView?id=${snippet.id}&type=personal`,
                                                class: "text-decoration-none"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VImg, {
                                                    src: snippet.img || "/placeholder-image.jpg",
                                                    height: "200",
                                                    cover: "",
                                                    class: "bg-grey-lighten-2"
                                                  }, {
                                                    placeholder: withCtx(() => [
                                                      createVNode(VRow, {
                                                        align: "center",
                                                        justify: "center",
                                                        class: "fill-height"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VProgressCircular, {
                                                            indeterminate: "",
                                                            color: "primary"
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["src"])
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]),
                                              createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(snippet.title), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardText, null, {
                                                default: withCtx(() => [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                  createVNode(VChip, {
                                                    color: "primary",
                                                    variant: "outlined",
                                                    size: "small",
                                                    class: "mb-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(snippet.framework), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                    createVNode(VAvatar, {
                                                      size: "24",
                                                      class: "mr-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                          alt: "avatar"
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", null, toDisplayString(snippet.username), 1),
                                                    createVNode(VSpacer),
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-calendar")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VDivider),
                                              createVNode(VCardActions, null, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: "error",
                                                    onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-delete")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick"]),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: "primary",
                                                    to: `/snippetsView?id=${snippet.id}&type=personal`
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" View Details "),
                                                      createVNode(VIcon, { end: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-arrow-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128)),
                                    filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                      key: 0,
                                      cols: "12"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VAlert, {
                                          type: "info",
                                          variant: "tonal"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VWindowItem, { value: "Favorites" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-4" }, [
                                  createVNode(VTextField, {
                                    modelValue: searchQuery.value,
                                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                    "prepend-inner-icon": "mdi-magnify",
                                    label: "Search in my favorites",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    class: "mr-4"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VSelect, {
                                    modelValue: frameworkFilter.value,
                                    "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                    items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                    label: "Framework",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    style: { "max-width": "200px" }
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                      return openBlock(), createBlock(VCol, {
                                        key: index,
                                        cols: "12",
                                        sm: "6",
                                        lg: "4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            class: "mx-auto snippet-card",
                                            "max-width": "400",
                                            elevation: "2",
                                            hover: ""
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                                class: "text-decoration-none"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VImg, {
                                                    src: favorite.img || "/placeholder-image.jpg",
                                                    height: "200",
                                                    cover: "",
                                                    class: "bg-grey-lighten-2"
                                                  }, {
                                                    placeholder: withCtx(() => [
                                                      createVNode(VRow, {
                                                        align: "center",
                                                        justify: "center",
                                                        class: "fill-height"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VProgressCircular, {
                                                            indeterminate: "",
                                                            color: "primary"
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["src"])
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]),
                                              createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(favorite.title), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardText, null, {
                                                default: withCtx(() => [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                  createVNode(VChip, {
                                                    color: "primary",
                                                    variant: "outlined",
                                                    size: "small",
                                                    class: "mb-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(favorite.framework), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024),
                                                  createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                    createVNode(VAvatar, {
                                                      size: "24",
                                                      class: "mr-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VImg, {
                                                          src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                          alt: "avatar"
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", null, toDisplayString(favorite.username), 1),
                                                    createVNode(VSpacer),
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-calendar")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VDivider),
                                              createVNode(VCardActions, null, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: "yellow",
                                                    onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-bookmark")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["onClick"]),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    variant: "text",
                                                    color: "primary",
                                                    to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" View Details "),
                                                      createVNode(VIcon, { end: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-arrow-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128)),
                                    filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                      key: 0,
                                      cols: "12"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VAlert, {
                                          type: "info",
                                          variant: "tonal"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" You don't have any favorite snippets yet. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: addSnippets.value,
              "onUpdate:modelValue": ($event) => addSnippets.value = $event,
              "max-width": "700",
              persistent: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VToolbar, {
                          color: "primary",
                          class: "text-white"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VToolbarTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Create a New Snippet`);
                                  } else {
                                    return [
                                      createTextVNode("Create a New Snippet")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VSpacer, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                icon: "",
                                onClick: ($event) => addSnippets.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-close`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-close")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-close")
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
                                createVNode(VToolbarTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Create a New Snippet")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  icon: "",
                                  onClick: ($event) => addSnippets.value = false
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-close")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pt-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VForm, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="d-flex gap-4" data-v-6fc203b4${_scopeId7}>`);
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: newSnippet.value.publishWorld,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                                  label: "Publish Globally",
                                                  color: "primary",
                                                  "hide-details": ""
                                                }, null, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VSwitch, {
                                                  modelValue: newSnippet.value.publishPersonal,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                                  label: "Save as Personal",
                                                  color: "primary",
                                                  "hide-details": ""
                                                }, null, _parent8, _scopeId7));
                                                _push8(`</div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "d-flex gap-4" }, [
                                                    createVNode(VSwitch, {
                                                      modelValue: newSnippet.value.publishWorld,
                                                      "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                                      label: "Publish Globally",
                                                      color: "primary",
                                                      "hide-details": ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VSwitch, {
                                                      modelValue: newSnippet.value.publishPersonal,
                                                      "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                                      label: "Save as Personal",
                                                      color: "primary",
                                                      "hide-details": ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: newSnippet.value.title,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                                  label: "Title",
                                                  variant: "outlined",
                                                  placeholder: "Enter snippet title",
                                                  "prepend-inner-icon": "mdi-format-title"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: newSnippet.value.title,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                                    label: "Title",
                                                    variant: "outlined",
                                                    placeholder: "Enter snippet title",
                                                    "prepend-inner-icon": "mdi-format-title"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextarea, {
                                                  modelValue: newSnippet.value.description,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                                  label: "Description",
                                                  variant: "outlined",
                                                  rows: "3",
                                                  placeholder: "Describe your snippet",
                                                  "prepend-inner-icon": "mdi-text"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextarea, {
                                                    modelValue: newSnippet.value.description,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                                    label: "Description",
                                                    variant: "outlined",
                                                    rows: "3",
                                                    placeholder: "Describe your snippet",
                                                    "prepend-inner-icon": "mdi-text"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSelect, {
                                                  modelValue: newSnippet.value.framework,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                                  items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                                  label: "Framework",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-code-tags"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSelect, {
                                                    modelValue: newSnippet.value.framework,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                                    items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                                    label: "Framework",
                                                    variant: "outlined",
                                                    "prepend-inner-icon": "mdi-code-tags"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VFileInput, {
                                                  modelValue: newSnippet.value.imgFile,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                                  label: "Cover Image",
                                                  variant: "outlined",
                                                  "prepend-icon": "mdi-image",
                                                  accept: "image/*",
                                                  "show-size": ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VFileInput, {
                                                    modelValue: newSnippet.value.imgFile,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                                    label: "Cover Image",
                                                    variant: "outlined",
                                                    "prepend-icon": "mdi-image",
                                                    accept: "image/*",
                                                    "show-size": ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "d-flex gap-4" }, [
                                                  createVNode(VSwitch, {
                                                    modelValue: newSnippet.value.publishWorld,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                                    label: "Publish Globally",
                                                    color: "primary",
                                                    "hide-details": ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VSwitch, {
                                                    modelValue: newSnippet.value.publishPersonal,
                                                    "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                                    label: "Save as Personal",
                                                    color: "primary",
                                                    "hide-details": ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: newSnippet.value.title,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                                  label: "Title",
                                                  variant: "outlined",
                                                  placeholder: "Enter snippet title",
                                                  "prepend-inner-icon": "mdi-format-title"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextarea, {
                                                  modelValue: newSnippet.value.description,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                                  label: "Description",
                                                  variant: "outlined",
                                                  rows: "3",
                                                  placeholder: "Describe your snippet",
                                                  "prepend-inner-icon": "mdi-text"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VSelect, {
                                                  modelValue: newSnippet.value.framework,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                                  items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                                  label: "Framework",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-code-tags"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VFileInput, {
                                                  modelValue: newSnippet.value.imgFile,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                                  label: "Cover Image",
                                                  variant: "outlined",
                                                  "prepend-icon": "mdi-image",
                                                  accept: "image/*",
                                                  "show-size": ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "d-flex gap-4" }, [
                                                createVNode(VSwitch, {
                                                  modelValue: newSnippet.value.publishWorld,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                                  label: "Publish Globally",
                                                  color: "primary",
                                                  "hide-details": ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VSwitch, {
                                                  modelValue: newSnippet.value.publishPersonal,
                                                  "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                                  label: "Save as Personal",
                                                  color: "primary",
                                                  "hide-details": ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: newSnippet.value.title,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                                label: "Title",
                                                variant: "outlined",
                                                placeholder: "Enter snippet title",
                                                "prepend-inner-icon": "mdi-format-title"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextarea, {
                                                modelValue: newSnippet.value.description,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                                label: "Description",
                                                variant: "outlined",
                                                rows: "3",
                                                placeholder: "Describe your snippet",
                                                "prepend-inner-icon": "mdi-text"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VSelect, {
                                                modelValue: newSnippet.value.framework,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                                items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                                label: "Framework",
                                                variant: "outlined",
                                                "prepend-inner-icon": "mdi-code-tags"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VFileInput, {
                                                modelValue: newSnippet.value.imgFile,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                                label: "Cover Image",
                                                variant: "outlined",
                                                "prepend-icon": "mdi-image",
                                                accept: "image/*",
                                                "show-size": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                createVNode(VForm, null, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "d-flex gap-4" }, [
                                              createVNode(VSwitch, {
                                                modelValue: newSnippet.value.publishWorld,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                                label: "Publish Globally",
                                                color: "primary",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VSwitch, {
                                                modelValue: newSnippet.value.publishPersonal,
                                                "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                                label: "Save as Personal",
                                                color: "primary",
                                                "hide-details": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: newSnippet.value.title,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                              label: "Title",
                                              variant: "outlined",
                                              placeholder: "Enter snippet title",
                                              "prepend-inner-icon": "mdi-format-title"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextarea, {
                                              modelValue: newSnippet.value.description,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                              label: "Description",
                                              variant: "outlined",
                                              rows: "3",
                                              placeholder: "Describe your snippet",
                                              "prepend-inner-icon": "mdi-text"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VSelect, {
                                              modelValue: newSnippet.value.framework,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                              items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                              label: "Framework",
                                              variant: "outlined",
                                              "prepend-inner-icon": "mdi-code-tags"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VFileInput, {
                                              modelValue: newSnippet.value.imgFile,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                              label: "Cover Image",
                                              variant: "outlined",
                                              "prepend-icon": "mdi-image",
                                              accept: "image/*",
                                              "show-size": ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                              _push5(ssrRenderComponent(VSpacer, null, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "outlined",
                                onClick: ($event) => addSnippets.value = false,
                                class: "mr-2"
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
                                onClick: sendSnippets,
                                loading: isLoading.value
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Create Snippet `);
                                    _push6(ssrRenderComponent(VIcon, { end: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-check`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-check")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createTextVNode(" Create Snippet "),
                                      createVNode(VIcon, { end: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-check")
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
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  variant: "outlined",
                                  onClick: ($event) => addSnippets.value = false,
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cancel ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "primary",
                                  onClick: sendSnippets,
                                  loading: isLoading.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create Snippet "),
                                    createVNode(VIcon, { end: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-check")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VToolbar, {
                            color: "primary",
                            class: "text-white"
                          }, {
                            default: withCtx(() => [
                              createVNode(VToolbarTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Create a New Snippet")
                                ]),
                                _: 1
                              }),
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                icon: "",
                                onClick: ($event) => addSnippets.value = false
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-close")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pt-4" }, {
                            default: withCtx(() => [
                              createVNode(VForm, null, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "d-flex gap-4" }, [
                                            createVNode(VSwitch, {
                                              modelValue: newSnippet.value.publishWorld,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                              label: "Publish Globally",
                                              color: "primary",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VSwitch, {
                                              modelValue: newSnippet.value.publishPersonal,
                                              "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                              label: "Save as Personal",
                                              color: "primary",
                                              "hide-details": ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: newSnippet.value.title,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                            label: "Title",
                                            variant: "outlined",
                                            placeholder: "Enter snippet title",
                                            "prepend-inner-icon": "mdi-format-title"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextarea, {
                                            modelValue: newSnippet.value.description,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                            label: "Description",
                                            variant: "outlined",
                                            rows: "3",
                                            placeholder: "Describe your snippet",
                                            "prepend-inner-icon": "mdi-text"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VSelect, {
                                            modelValue: newSnippet.value.framework,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                            items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                            label: "Framework",
                                            variant: "outlined",
                                            "prepend-inner-icon": "mdi-code-tags"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VFileInput, {
                                            modelValue: newSnippet.value.imgFile,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                            label: "Cover Image",
                                            variant: "outlined",
                                            "prepend-icon": "mdi-image",
                                            accept: "image/*",
                                            "show-size": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                variant: "outlined",
                                onClick: ($event) => addSnippets.value = false,
                                class: "mr-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cancel ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "primary",
                                onClick: sendSnippets,
                                loading: isLoading.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Create Snippet "),
                                  createVNode(VIcon, { end: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-check")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["loading"])
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
                        createVNode(VToolbar, {
                          color: "primary",
                          class: "text-white"
                        }, {
                          default: withCtx(() => [
                            createVNode(VToolbarTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("Create a New Snippet")
                              ]),
                              _: 1
                            }),
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              icon: "",
                              onClick: ($event) => addSnippets.value = false
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, null, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-close")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pt-4" }, {
                          default: withCtx(() => [
                            createVNode(VForm, null, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex gap-4" }, [
                                          createVNode(VSwitch, {
                                            modelValue: newSnippet.value.publishWorld,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                            label: "Publish Globally",
                                            color: "primary",
                                            "hide-details": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VSwitch, {
                                            modelValue: newSnippet.value.publishPersonal,
                                            "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                            label: "Save as Personal",
                                            color: "primary",
                                            "hide-details": ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: newSnippet.value.title,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                          label: "Title",
                                          variant: "outlined",
                                          placeholder: "Enter snippet title",
                                          "prepend-inner-icon": "mdi-format-title"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode(VTextarea, {
                                          modelValue: newSnippet.value.description,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                          label: "Description",
                                          variant: "outlined",
                                          rows: "3",
                                          placeholder: "Describe your snippet",
                                          "prepend-inner-icon": "mdi-text"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VSelect, {
                                          modelValue: newSnippet.value.framework,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                          items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                          label: "Framework",
                                          variant: "outlined",
                                          "prepend-inner-icon": "mdi-code-tags"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VFileInput, {
                                          modelValue: newSnippet.value.imgFile,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                          label: "Cover Image",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-image",
                                          accept: "image/*",
                                          "show-size": ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              variant: "outlined",
                              onClick: ($event) => addSnippets.value = false,
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "primary",
                              onClick: sendSnippets,
                              loading: isLoading.value
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Create Snippet "),
                                createVNode(VIcon, { end: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-check")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["loading"])
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
                              _push5(` Confirmation de suppression `);
                            } else {
                              return [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-alert-circle")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Confirmation de suppression ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pt-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<p data-v-6fc203b4${_scopeId4}>Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.</p>`);
                            } else {
                              return [
                                createVNode("p", null, "Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.")
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
                                    _push6(`Annuler`);
                                  } else {
                                    return [
                                      createTextVNode("Annuler")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "error",
                                onClick: deleteSnippet
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
                                    _push6(` Supprimer `);
                                  } else {
                                    return [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-delete")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Supprimer ")
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
                                    createTextVNode("Annuler")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "error",
                                  onClick: deleteSnippet
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { start: "" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-delete")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Supprimer ")
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
                              createTextVNode(" Confirmation de suppression ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pt-4" }, {
                            default: withCtx(() => [
                              createVNode("p", null, "Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.")
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
                                  createTextVNode("Annuler")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "error",
                                onClick: deleteSnippet
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { start: "" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-delete")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Supprimer ")
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
                            createTextVNode(" Confirmation de suppression ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pt-4" }, {
                          default: withCtx(() => [
                            createVNode("p", null, "Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.")
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
                                createTextVNode("Annuler")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "error",
                              onClick: deleteSnippet
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { start: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-delete")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Supprimer ")
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
            _push2(ssrRenderComponent(Snackbar, {
              modelValue: snackbar.value,
              "onUpdate:modelValue": ($event) => snackbar.value = $event,
              text: snackbarText.value,
              color: snackbarColor.value,
              icon: snackbarIcon.value,
              timeout: 2e3
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, { fluid: "" }, {
                    default: withCtx(() => [
                      createVNode(VTabs, {
                        modelValue: tab.value,
                        "onUpdate:modelValue": ($event) => tab.value = $event,
                        color: "primary",
                        "align-tabs": "center",
                        class: "mb-6"
                      }, {
                        default: withCtx(() => [
                          createVNode(VTab, {
                            value: "World",
                            class: "text-subtitle-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-earth")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Public Snippets ")
                            ]),
                            _: 1
                          }),
                          createVNode(VTab, {
                            value: "Personal",
                            class: "text-subtitle-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" My Snippets ")
                            ]),
                            _: 1
                          }),
                          createVNode(VTab, {
                            value: "Favorites",
                            class: "text-subtitle-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-star")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Favorites ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(VWindow, {
                        modelValue: tab.value,
                        "onUpdate:modelValue": ($event) => tab.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(VWindowItem, { value: "World" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center mb-4" }, [
                                createVNode(VTextField, {
                                  modelValue: searchQuery.value,
                                  "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                  "prepend-inner-icon": "mdi-magnify",
                                  label: "Search snippets",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  class: "mr-4"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VSelect, {
                                  modelValue: frameworkFilter.value,
                                  "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                  items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                  label: "Framework",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  style: { "max-width": "200px" }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredWorldSnippets.value, (snippet, index) => {
                                    return openBlock(), createBlock(VCol, {
                                      key: index,
                                      cols: "12",
                                      sm: "6",
                                      lg: "4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, {
                                          class: "mx-auto snippet-card",
                                          "max-width": "400",
                                          elevation: "2",
                                          hover: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              to: `/snippetsView?id=${snippet.id}&type=world`,
                                              class: "text-decoration-none"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VImg, {
                                                  src: snippet.img || "/placeholder-image.jpg",
                                                  height: "200",
                                                  cover: "",
                                                  class: "bg-grey-lighten-2"
                                                }, {
                                                  placeholder: withCtx(() => [
                                                    createVNode(VRow, {
                                                      align: "center",
                                                      justify: "center",
                                                      class: "fill-height"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VProgressCircular, {
                                                          indeterminate: "",
                                                          color: "primary"
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["src"])
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]),
                                            createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(snippet.title), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardText, null, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                createVNode(VChip, {
                                                  color: "primary",
                                                  variant: "outlined",
                                                  size: "small",
                                                  class: "mb-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(snippet.framework), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                  createVNode(VAvatar, {
                                                    size: "24",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                        alt: "avatar"
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", null, toDisplayString(snippet.username), 1),
                                                  createVNode(VSpacer),
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-calendar")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VDivider),
                                            createVNode(VCardActions, null, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: snippet.isFavorite ? "yellow" : "",
                                                  onClick: withModifiers(($event) => toggleFavorite(snippet, "world"), ["stop"])
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      icon: snippet.isFavorite ? "mdi-bookmark" : "mdi-bookmark-outline"
                                                    }, null, 8, ["icon"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color", "onClick"]),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: "primary",
                                                  to: `/snippetsView?id=${snippet.id}&type=world`
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" View Details "),
                                                    createVNode(VIcon, { end: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-arrow-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128)),
                                  filteredWorldSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                    key: 0,
                                    cols: "12"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VAlert, {
                                        type: "info",
                                        variant: "tonal"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" No snippets found. Try modifying your search criteria. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VWindowItem, { value: "Personal" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center mb-4" }, [
                                createVNode(VTextField, {
                                  modelValue: searchQuery.value,
                                  "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                  "prepend-inner-icon": "mdi-magnify",
                                  label: "Search in my snippets",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  class: "mr-4"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VSelect, {
                                  modelValue: frameworkFilter.value,
                                  "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                  items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                  label: "Framework",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  style: { "max-width": "200px" }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredPersonalSnippets.value, (snippet, index) => {
                                    return openBlock(), createBlock(VCol, {
                                      key: index,
                                      cols: "12",
                                      sm: "6",
                                      lg: "4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, {
                                          class: "mx-auto snippet-card",
                                          "max-width": "400",
                                          elevation: "2",
                                          hover: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              to: `/snippetsView?id=${snippet.id}&type=personal`,
                                              class: "text-decoration-none"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VImg, {
                                                  src: snippet.img || "/placeholder-image.jpg",
                                                  height: "200",
                                                  cover: "",
                                                  class: "bg-grey-lighten-2"
                                                }, {
                                                  placeholder: withCtx(() => [
                                                    createVNode(VRow, {
                                                      align: "center",
                                                      justify: "center",
                                                      class: "fill-height"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VProgressCircular, {
                                                          indeterminate: "",
                                                          color: "primary"
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["src"])
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]),
                                            createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(snippet.title), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardText, null, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(snippet.description), 1),
                                                createVNode(VChip, {
                                                  color: "primary",
                                                  variant: "outlined",
                                                  size: "small",
                                                  class: "mb-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(snippet.framework), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                  createVNode(VAvatar, {
                                                    size: "24",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                        alt: "avatar"
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", null, toDisplayString(snippet.username), 1),
                                                  createVNode(VSpacer),
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-calendar")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(snippet)), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VDivider),
                                            createVNode(VCardActions, null, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: "error",
                                                  onClick: withModifiers(($event) => confirmDelete(snippet), ["stop"])
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-delete")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"]),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: "primary",
                                                  to: `/snippetsView?id=${snippet.id}&type=personal`
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" View Details "),
                                                    createVNode(VIcon, { end: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-arrow-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128)),
                                  filteredPersonalSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                    key: 0,
                                    cols: "12"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VAlert, {
                                        type: "info",
                                        variant: "tonal"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" You don't have any snippets yet. Create a new one! ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VWindowItem, { value: "Favorites" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center mb-4" }, [
                                createVNode(VTextField, {
                                  modelValue: searchQuery.value,
                                  "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                  "prepend-inner-icon": "mdi-magnify",
                                  label: "Search in my favorites",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  class: "mr-4"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VSelect, {
                                  modelValue: frameworkFilter.value,
                                  "onUpdate:modelValue": ($event) => frameworkFilter.value = $event,
                                  items: ["All", "Vue.js 3", "Nuxt 3", "React", "Angular", "Svelte"],
                                  label: "Framework",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  style: { "max-width": "200px" }
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredFavoriteSnippets.value, (favorite, index) => {
                                    return openBlock(), createBlock(VCol, {
                                      key: index,
                                      cols: "12",
                                      sm: "6",
                                      lg: "4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, {
                                          class: "mx-auto snippet-card",
                                          "max-width": "400",
                                          elevation: "2",
                                          hover: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`,
                                              class: "text-decoration-none"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VImg, {
                                                  src: favorite.img || "/placeholder-image.jpg",
                                                  height: "200",
                                                  cover: "",
                                                  class: "bg-grey-lighten-2"
                                                }, {
                                                  placeholder: withCtx(() => [
                                                    createVNode(VRow, {
                                                      align: "center",
                                                      justify: "center",
                                                      class: "fill-height"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VProgressCircular, {
                                                          indeterminate: "",
                                                          color: "primary"
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["src"])
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]),
                                            createVNode(VCardTitle, { class: "text-h6 font-weight-bold" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(favorite.title), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardText, null, {
                                              default: withCtx(() => [
                                                createVNode("p", { class: "text-body-1 mb-2" }, toDisplayString(favorite.description), 1),
                                                createVNode(VChip, {
                                                  color: "primary",
                                                  variant: "outlined",
                                                  size: "small",
                                                  class: "mb-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(favorite.framework), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode("div", { class: "d-flex align-center text-grey" }, [
                                                  createVNode(VAvatar, {
                                                    size: "24",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VImg, {
                                                        src: "https://cdn.vuetifyjs.com/images/john.jpg",
                                                        alt: "avatar"
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", null, toDisplayString(favorite.username), 1),
                                                  createVNode(VSpacer),
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-calendar")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", { class: "text-caption" }, toDisplayString(formatDisplayDate(favorite)), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VDivider),
                                            createVNode(VCardActions, null, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: "yellow",
                                                  onClick: withModifiers(($event) => toggleFavorite(favorite, "world"), ["stop"])
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-bookmark")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"]),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  variant: "text",
                                                  color: "primary",
                                                  to: `/snippetsView?id=${favorite.id}&type=${favorite.sourceType || "world"}`
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" View Details "),
                                                    createVNode(VIcon, { end: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-arrow-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128)),
                                  filteredFavoriteSnippets.value.length === 0 ? (openBlock(), createBlock(VCol, {
                                    key: 0,
                                    cols: "12"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VAlert, {
                                        type: "info",
                                        variant: "tonal"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" You don't have any favorite snippets yet. ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VDialog, {
                modelValue: addSnippets.value,
                "onUpdate:modelValue": ($event) => addSnippets.value = $event,
                "max-width": "700",
                persistent: ""
              }, {
                default: withCtx(() => [
                  createVNode(VCard, null, {
                    default: withCtx(() => [
                      createVNode(VToolbar, {
                        color: "primary",
                        class: "text-white"
                      }, {
                        default: withCtx(() => [
                          createVNode(VToolbarTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Create a New Snippet")
                            ]),
                            _: 1
                          }),
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            icon: "",
                            onClick: ($event) => addSnippets.value = false
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, null, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-close")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pt-4" }, {
                        default: withCtx(() => [
                          createVNode(VForm, null, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, { cols: "12" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "d-flex gap-4" }, [
                                        createVNode(VSwitch, {
                                          modelValue: newSnippet.value.publishWorld,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.publishWorld = $event,
                                          label: "Publish Globally",
                                          color: "primary",
                                          "hide-details": ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VSwitch, {
                                          modelValue: newSnippet.value.publishPersonal,
                                          "onUpdate:modelValue": ($event) => newSnippet.value.publishPersonal = $event,
                                          label: "Save as Personal",
                                          color: "primary",
                                          "hide-details": ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, { cols: "12" }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: newSnippet.value.title,
                                        "onUpdate:modelValue": ($event) => newSnippet.value.title = $event,
                                        label: "Title",
                                        variant: "outlined",
                                        placeholder: "Enter snippet title",
                                        "prepend-inner-icon": "mdi-format-title"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, { cols: "12" }, {
                                    default: withCtx(() => [
                                      createVNode(VTextarea, {
                                        modelValue: newSnippet.value.description,
                                        "onUpdate:modelValue": ($event) => newSnippet.value.description = $event,
                                        label: "Description",
                                        variant: "outlined",
                                        rows: "3",
                                        placeholder: "Describe your snippet",
                                        "prepend-inner-icon": "mdi-text"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VSelect, {
                                        modelValue: newSnippet.value.framework,
                                        "onUpdate:modelValue": ($event) => newSnippet.value.framework = $event,
                                        items: ["React", "Vue.js 3", "Nuxt 3", "Angular", "Nest.js"],
                                        label: "Framework",
                                        variant: "outlined",
                                        "prepend-inner-icon": "mdi-code-tags"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VFileInput, {
                                        modelValue: newSnippet.value.imgFile,
                                        "onUpdate:modelValue": ($event) => newSnippet.value.imgFile = $event,
                                        label: "Cover Image",
                                        variant: "outlined",
                                        "prepend-icon": "mdi-image",
                                        accept: "image/*",
                                        "show-size": ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            variant: "outlined",
                            onClick: ($event) => addSnippets.value = false,
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: sendSnippets,
                            loading: isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Create Snippet "),
                              createVNode(VIcon, { end: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-check")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"]),
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
                          createTextVNode(" Confirmation de suppression ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pt-4" }, {
                        default: withCtx(() => [
                          createVNode("p", null, "Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.")
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
                              createTextVNode("Annuler")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "error",
                            onClick: deleteSnippet
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { start: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-delete")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Supprimer ")
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
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(Snackbar, {
                modelValue: snackbar.value,
                "onUpdate:modelValue": ($event) => snackbar.value = $event,
                text: snackbarText.value,
                color: snackbarColor.value,
                icon: snackbarIcon.value,
                timeout: 2e3
              }, null, 8, ["modelValue", "onUpdate:modelValue", "text", "color", "icon"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/snippets.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const snippets = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6fc203b4"]]);

export { snippets as default };
//# sourceMappingURL=snippets.vue.mjs.map
