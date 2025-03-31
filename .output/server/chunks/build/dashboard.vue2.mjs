import { _ as __nuxt_component_0 } from './client-only.mjs';
import { S as useUserStore, bM as useCookieStore, a2 as useDisplay, V as VApp, h as VDivider, T as VList, U as VListItem, c4 as VListGroup, bw as VListSubheader, g as VIcon, c5 as __nuxt_component_0$1, _ as _export_sfc } from './server.mjs';
import { defineComponent, ref, watch, computed, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, mergeProps, createTextVNode, resolveDynamicComponent, unref, markRaw, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { p as premiumFeatures } from './PremiumFeature.vue.mjs';
import { useRouter, useRoute } from 'vue-router';
import { _ as _sfc_main$1 } from './analytics-collector.vue2.mjs';
import { V as VNavigationDrawer } from './VNavigationDrawer.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VAppBar } from './VAppBar.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'pinia';
import 'pinia-plugin-persistedstate';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './VChip.mjs';
import './VToolbar.mjs';

const _imports_0 = publicAssetsURL("/logo/devunity-letter.png");

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useCookieStore();
    const router = useRouter();
    const route = useRoute();
    const open = ref([]);
    const search = ref("");
    const display = useDisplay();
    const drawer = ref(!display.smAndDown.value);
    const currentPageTitle = ref("Dashboard");
    watch(() => route.path, () => {
      if (display.smAndDown.value) {
        drawer.value = false;
      }
      updatePageTitle();
    });
    watch(() => display.smAndDown.value, (isSmall) => {
      if (!isSmall) {
        drawer.value = true;
      }
    });
    const updatePageTitle = () => {
      const path = route.path;
      if (path === "/dashboard") {
        currentPageTitle.value = "Dashboard";
      } else if (path.includes("/snippets")) {
        currentPageTitle.value = "Snippets";
      } else if (path.includes("/sql-generator")) {
        currentPageTitle.value = "Database Designer";
      } else if (path.includes("/studio")) {
        currentPageTitle.value = "Studio";
      } else if (path.includes("/responsive")) {
        currentPageTitle.value = "Responsive";
      } else if (path.includes("/accessibility")) {
        currentPageTitle.value = "Accessibility";
      } else if (path.includes("/seo-audit")) {
        currentPageTitle.value = "SEO Audit";
      } else if (path.includes("/settings")) {
        currentPageTitle.value = "Settings";
      } else if (path.includes("/newsletter-admin")) {
        currentPageTitle.value = "Newsletter";
      } else {
        const routeName = path.split("/").pop() || "Dashboard";
        currentPageTitle.value = routeName.charAt(0).toUpperCase() + routeName.slice(1);
      }
    };
    const recentSnippets = computed(() => {
      return [...userStore.personalSnippets].sort((a, b) => {
        const dateA = getDateValue(a);
        const dateB = getDateValue(b);
        return dateB - dateA;
      }).slice(0, 5);
    });
    const recentSQLSchemas = computed(() => {
      return [...userStore.sqlSchemas].slice(0, 5);
    });
    const getSchemaTablesCount = (schema) => {
      if (schema && schema.schema_data) {
        try {
          const data = typeof schema.schema_data === "string" ? JSON.parse(schema.schema_data) : schema.schema_data;
          return data.tables ? data.tables.length : 0;
        } catch (e) {
          console.error("Error parsing schema data:", e);
          return 0;
        }
      }
      return 0;
    };
    const getDateValue = (snippet) => {
      if (snippet) {
        const dateStr = snippet.date || snippet.snippet_date;
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date.getTime();
          }
        }
      }
      return 0;
    };
    const getSnippetDate = (snippet) => {
      if (snippet) {
        const dateStr = snippet.date || snippet.snippet_date;
        if (dateStr) {
          return formatDate(dateStr);
        }
      }
      return "Date unknown";
    };
    const formatDate = (dateString) => {
      if (!dateString) return "Date unknown";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        const now = /* @__PURE__ */ new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        if (diffDays === 1) {
          return "Yesterday";
        } else if (diffDays < 7) {
          return `${diffDays} days ago`;
        } else {
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          });
        }
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Date error";
      }
    };
    const getFrameworkIcon = (framework) => {
      switch (framework == null ? void 0 : framework.toLowerCase()) {
        case "react":
          return "mdi-react";
        case "vue.js 3":
        case "vue":
          return "mdi-vuejs";
        case "angular":
          return "mdi-angular";
        case "nest.js":
          return "mdi-nodejs";
        case "nuxt 3":
        case "nuxt":
          return "mdi-nuxt";
        default:
          return "mdi-code-tags";
      }
    };
    const getCurrentPageIcon = () => {
      const path = route.path;
      if (path === "/dashboard") {
        return "mdi-view-dashboard-outline";
      } else if (path.includes("/snippets")) {
        return "mdi-code-tags";
      } else if (path.includes("/sql-generator")) {
        return "mdi-database-cog";
      } else if (path.includes("/studio")) {
        return "mdi-palette";
      } else if (path.includes("/responsive")) {
        return "mdi-responsive";
      } else if (path.includes("/accessibility")) {
        return "mdi-access-point";
      } else if (path.includes("/seo-audit")) {
        return "mdi-magnify";
      } else if (path.includes("/robots")) {
        return "mdi-robot";
      } else if (path.includes("/settings")) {
        return "mdi-cog-outline";
      } else if (path.includes("/newsletter-admin")) {
        return "mdi-email-outline";
      } else {
        return "mdi-application";
      }
    };
    const closeDrawer = () => {
      if (display.smAndDown.value) {
        drawer.value = false;
      }
    };
    const logout = async () => {
      try {
        await userStore.logout();
        closeDrawer();
        router.push("/login");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    watch(() => {
      var _a;
      return (_a = userStore.user) == null ? void 0 : _a.isPremium;
    }, (newValue) => {
      console.log("[DEBUG] Changement du statut premium détecté:", newValue);
    }, { immediate: true });
    function createPremiumMenuItem(title, link, icon, featureKey) {
      var _a;
      if ((_a = userStore.user) == null ? void 0 : _a.isPremium) {
        return {
          title,
          link,
          icon
        };
      } else {
        return {
          title: `${title} (Premium)`,
          link: "#",
          icon,
          component: {
            component: markRaw(premiumFeatures),
            props: {
              type: "list-item",
              title,
              icon,
              featureKey
            }
          }
        };
      }
    }
    const items = computed(() => [
      {
        title: "Frontend",
        prependIcon: "mdi-web",
        link: true,
        children: [
          { title: "Snippets", link: "/snippets", icon: "mdi-code-tags" },
          { title: "Studio", link: "/studio", icon: "mdi-palette" }
        ]
      },
      {
        title: "Backend",
        prependIcon: "mdi-database-outline",
        link: true,
        children: [
          createPremiumMenuItem("Database Designer", "/sql-generator", "mdi-database", "databaseDesigner")
        ]
      },
      {
        title: "UI/UX",
        prependIcon: "mdi-palette",
        link: true,
        children: [
          { title: "Responsive", link: "/responsive", icon: "mdi-responsive" },
          { title: "Accessibility", link: "/accessibility", icon: "mdi-access-point" }
        ]
      },
      {
        title: "SEO",
        prependIcon: "mdi-rocket-launch-outline",
        link: true,
        children: [
          createPremiumMenuItem("SEO Audit", "/seo-audit", "mdi-magnify", "seoAudit"),
          createPremiumMenuItem("Robots & Schema", "/robots", "mdi-robot", "robots")
        ]
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_0$1;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VNavigationDrawer, {
              modelValue: drawer.value,
              "onUpdate:modelValue": ($event) => drawer.value = $event,
              temporary: _ctx.$vuetify.display.smAndDown,
              permanent: !_ctx.$vuetify.display.smAndDown,
              app: "",
              clipped: "",
              class: "elevation-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="drawer-header pa-4" data-v-b5389df5${_scopeId2}><div class="d-flex align-center mb-4" data-v-b5389df5${_scopeId2}><div class="logo-container mr-3" data-v-b5389df5${_scopeId2}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity" class="logo-devunity" data-v-b5389df5${_scopeId2}></div><div data-v-b5389df5${_scopeId2}><div class="text-h6 font-weight-bold" data-v-b5389df5${_scopeId2}>DevUnity</div><div class="text-caption text-medium-emphasis" data-v-b5389df5${_scopeId2}>v1.0.0</div></div></div>`);
                  _push3(ssrRenderComponent(VTextField, {
                    modelValue: search.value,
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    density: "compact",
                    variant: "outlined",
                    placeholder: "Search...",
                    "prepend-inner-icon": "mdi-magnify",
                    "hide-details": "",
                    rounded: "",
                    class: "mb-2",
                    "bg-color": "surface"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(VDivider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VList, {
                    density: "compact",
                    opened: open.value,
                    "onUpdate:opened": ($event) => open.value = $event,
                    nav: "",
                    class: "px-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VListItem, {
                          to: "/dashboard",
                          "prepend-icon": "mdi-view-dashboard-outline",
                          title: "Dashboard",
                          rounded: "lg",
                          class: "mb-1",
                          color: "primary",
                          nuxt: "",
                          onClick: closeDrawer
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListGroup, {
                          value: "Recent Projects",
                          class: "mb-1",
                          "prepend-icon": "mdi-history"
                        }, {
                          activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VListItem, mergeProps(props, {
                                title: "Recent Projects",
                                rounded: "lg",
                                color: "primary"
                              }), null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VListItem, mergeProps(props, {
                                  title: "Recent Projects",
                                  rounded: "lg",
                                  color: "primary"
                                }), null, 16)
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(recentSnippets.value, (snippet, index) => {
                                _push5(ssrRenderComponent(VListItem, {
                                  key: index,
                                  to: `/snippets?id=${snippet.id}`,
                                  title: snippet.title,
                                  "prepend-icon": getFrameworkIcon(snippet.framework),
                                  class: "ml-4",
                                  rounded: "lg",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }, {
                                  subtitle: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<span class="text-caption" data-v-b5389df5${_scopeId5}>${ssrInterpolate(getSnippetDate(snippet))}</span>`);
                                    } else {
                                      return [
                                        createVNode("span", { class: "text-caption" }, toDisplayString(getSnippetDate(snippet)), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                              if (recentSnippets.value.length === 0) {
                                _push5(ssrRenderComponent(VListItem, {
                                  class: "ml-4",
                                  title: "No recent projects",
                                  disabled: ""
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                  return openBlock(), createBlock(VListItem, {
                                    key: index,
                                    to: `/snippets?id=${snippet.id}`,
                                    title: snippet.title,
                                    "prepend-icon": getFrameworkIcon(snippet.framework),
                                    class: "ml-4",
                                    rounded: "lg",
                                    color: "primary",
                                    nuxt: "",
                                    onClick: closeDrawer
                                  }, {
                                    subtitle: withCtx(() => [
                                      createVNode("span", { class: "text-caption" }, toDisplayString(getSnippetDate(snippet)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to", "title", "prepend-icon"]);
                                }), 128)),
                                recentSnippets.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                                  key: 0,
                                  class: "ml-4",
                                  title: "No recent projects",
                                  disabled: ""
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListGroup, {
                          value: "Recent SQL schemas",
                          class: "mb-1",
                          "prepend-icon": "mdi-database-outline"
                        }, {
                          activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VListItem, mergeProps(props, {
                                title: "Recent SQL schemas",
                                rounded: "lg",
                                color: "primary"
                              }), null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VListItem, mergeProps(props, {
                                  title: "Recent SQL schemas",
                                  rounded: "lg",
                                  color: "primary"
                                }), null, 16)
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(recentSQLSchemas.value, (schema, index) => {
                                _push5(ssrRenderComponent(VListItem, {
                                  key: index,
                                  to: `/sql-generator?id=${schema.id}`,
                                  title: schema.database_name,
                                  "prepend-icon": "mdi-database",
                                  class: "ml-4",
                                  rounded: "lg",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }, {
                                  subtitle: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<span class="text-caption" data-v-b5389df5${_scopeId5}>${ssrInterpolate(getSchemaTablesCount(schema))} tables</span>`);
                                    } else {
                                      return [
                                        createVNode("span", { class: "text-caption" }, toDisplayString(getSchemaTablesCount(schema)) + " tables", 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                              if (recentSQLSchemas.value.length === 0) {
                                _push5(ssrRenderComponent(VListItem, {
                                  class: "ml-4",
                                  title: "No recent SQL schemas",
                                  disabled: ""
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(recentSQLSchemas.value, (schema, index) => {
                                  return openBlock(), createBlock(VListItem, {
                                    key: index,
                                    to: `/sql-generator?id=${schema.id}`,
                                    title: schema.database_name,
                                    "prepend-icon": "mdi-database",
                                    class: "ml-4",
                                    rounded: "lg",
                                    color: "primary",
                                    nuxt: "",
                                    onClick: closeDrawer
                                  }, {
                                    subtitle: withCtx(() => [
                                      createVNode("span", { class: "text-caption" }, toDisplayString(getSchemaTablesCount(schema)) + " tables", 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to", "title"]);
                                }), 128)),
                                recentSQLSchemas.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                                  key: 0,
                                  class: "ml-4",
                                  title: "No recent SQL schemas",
                                  disabled: ""
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListSubheader, { class: "mt-2 text-uppercase font-weight-bold text-caption" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Applications`);
                            } else {
                              return [
                                createTextVNode("Applications")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<!--[-->`);
                        ssrRenderList(items.value, (item, index) => {
                          _push4(ssrRenderComponent(VListGroup, {
                            key: index,
                            value: item.title,
                            class: "mb-1",
                            "prepend-icon": item.prependIcon
                          }, {
                            activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItem, mergeProps({ ref_for: true }, props, {
                                  title: item.title,
                                  rounded: "lg",
                                  color: "primary"
                                }), null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItem, mergeProps({ ref_for: true }, props, {
                                    title: item.title,
                                    rounded: "lg",
                                    color: "primary"
                                  }), null, 16, ["title"])
                                ];
                              }
                            }),
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(item.children, (child, idx) => {
                                  _push5(`<!--[-->`);
                                  if (child.component) {
                                    ssrRenderVNode(_push5, createVNode(resolveDynamicComponent(child.component.component), mergeProps({ ref_for: true }, child.component.props, { class: "ml-4 my-1 premium-menu-item" }), null), _parent5, _scopeId4);
                                  } else {
                                    _push5(ssrRenderComponent(VListItem, {
                                      to: child.link,
                                      title: child.title,
                                      "prepend-icon": child.icon || "mdi-circle-small",
                                      class: "ml-4",
                                      rounded: "lg",
                                      color: "primary",
                                      nuxt: "",
                                      onClick: closeDrawer
                                    }, null, _parent5, _scopeId4));
                                  }
                                  _push5(`<!--]-->`);
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child, idx) => {
                                    return openBlock(), createBlock(Fragment, { key: idx }, [
                                      child.component ? (openBlock(), createBlock(resolveDynamicComponent(child.component.component), mergeProps({
                                        key: 0,
                                        ref_for: true
                                      }, child.component.props, { class: "ml-4 my-1 premium-menu-item" }), null, 16)) : (openBlock(), createBlock(VListItem, {
                                        key: 1,
                                        to: child.link,
                                        title: child.title,
                                        "prepend-icon": child.icon || "mdi-circle-small",
                                        class: "ml-4",
                                        rounded: "lg",
                                        color: "primary",
                                        nuxt: "",
                                        onClick: closeDrawer
                                      }, null, 8, ["to", "title", "prepend-icon"]))
                                    ], 64);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                        _push4(ssrRenderComponent(VDivider, { class: "my-3" }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListSubheader, { class: "text-uppercase font-weight-bold text-caption" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`System`);
                            } else {
                              return [
                                createTextVNode("System")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_client_only, null, {}, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListItem, {
                          to: "/settings",
                          "prepend-icon": "mdi-cog-outline",
                          title: "Settings",
                          rounded: "lg",
                          class: "mb-1",
                          color: "primary",
                          nuxt: "",
                          onClick: closeDrawer
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListItem, {
                          onClick: logout,
                          "prepend-icon": "mdi-logout",
                          title: "Logout",
                          rounded: "lg",
                          color: "error"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VListItem, {
                            to: "/dashboard",
                            "prepend-icon": "mdi-view-dashboard-outline",
                            title: "Dashboard",
                            rounded: "lg",
                            class: "mb-1",
                            color: "primary",
                            nuxt: "",
                            onClick: closeDrawer
                          }),
                          createVNode(VListGroup, {
                            value: "Recent Projects",
                            class: "mb-1",
                            "prepend-icon": "mdi-history"
                          }, {
                            activator: withCtx(({ props }) => [
                              createVNode(VListItem, mergeProps(props, {
                                title: "Recent Projects",
                                rounded: "lg",
                                color: "primary"
                              }), null, 16)
                            ]),
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                return openBlock(), createBlock(VListItem, {
                                  key: index,
                                  to: `/snippets?id=${snippet.id}`,
                                  title: snippet.title,
                                  "prepend-icon": getFrameworkIcon(snippet.framework),
                                  class: "ml-4",
                                  rounded: "lg",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }, {
                                  subtitle: withCtx(() => [
                                    createVNode("span", { class: "text-caption" }, toDisplayString(getSnippetDate(snippet)), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to", "title", "prepend-icon"]);
                              }), 128)),
                              recentSnippets.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                                key: 0,
                                class: "ml-4",
                                title: "No recent projects",
                                disabled: ""
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(VListGroup, {
                            value: "Recent SQL schemas",
                            class: "mb-1",
                            "prepend-icon": "mdi-database-outline"
                          }, {
                            activator: withCtx(({ props }) => [
                              createVNode(VListItem, mergeProps(props, {
                                title: "Recent SQL schemas",
                                rounded: "lg",
                                color: "primary"
                              }), null, 16)
                            ]),
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentSQLSchemas.value, (schema, index) => {
                                return openBlock(), createBlock(VListItem, {
                                  key: index,
                                  to: `/sql-generator?id=${schema.id}`,
                                  title: schema.database_name,
                                  "prepend-icon": "mdi-database",
                                  class: "ml-4",
                                  rounded: "lg",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }, {
                                  subtitle: withCtx(() => [
                                    createVNode("span", { class: "text-caption" }, toDisplayString(getSchemaTablesCount(schema)) + " tables", 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to", "title"]);
                              }), 128)),
                              recentSQLSchemas.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                                key: 0,
                                class: "ml-4",
                                title: "No recent SQL schemas",
                                disabled: ""
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(VListSubheader, { class: "mt-2 text-uppercase font-weight-bold text-caption" }, {
                            default: withCtx(() => [
                              createTextVNode("Applications")
                            ]),
                            _: 1
                          }),
                          (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item, index) => {
                            return openBlock(), createBlock(VListGroup, {
                              key: index,
                              value: item.title,
                              class: "mb-1",
                              "prepend-icon": item.prependIcon
                            }, {
                              activator: withCtx(({ props }) => [
                                createVNode(VListItem, mergeProps({ ref_for: true }, props, {
                                  title: item.title,
                                  rounded: "lg",
                                  color: "primary"
                                }), null, 16, ["title"])
                              ]),
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child, idx) => {
                                  return openBlock(), createBlock(Fragment, { key: idx }, [
                                    child.component ? (openBlock(), createBlock(resolveDynamicComponent(child.component.component), mergeProps({
                                      key: 0,
                                      ref_for: true
                                    }, child.component.props, { class: "ml-4 my-1 premium-menu-item" }), null, 16)) : (openBlock(), createBlock(VListItem, {
                                      key: 1,
                                      to: child.link,
                                      title: child.title,
                                      "prepend-icon": child.icon || "mdi-circle-small",
                                      class: "ml-4",
                                      rounded: "lg",
                                      color: "primary",
                                      nuxt: "",
                                      onClick: closeDrawer
                                    }, null, 8, ["to", "title", "prepend-icon"]))
                                  ], 64);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["value", "prepend-icon"]);
                          }), 128)),
                          createVNode(VDivider, { class: "my-3" }),
                          createVNode(VListSubheader, { class: "text-uppercase font-weight-bold text-caption" }, {
                            default: withCtx(() => [
                              createTextVNode("System")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_client_only, null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                ((_a = unref(userStore).user) == null ? void 0 : _a.isAdmin) ? (openBlock(), createBlock(VListGroup, {
                                  key: 0,
                                  value: "Administration",
                                  class: "mb-1",
                                  "prepend-icon": "mdi-shield-account"
                                }, {
                                  activator: withCtx(({ props }) => [
                                    createVNode(VListItem, mergeProps(props, {
                                      title: "Administration",
                                      rounded: "lg",
                                      color: "primary"
                                    }), null, 16)
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(VListItem, {
                                      to: "/admin/newsletter-admin",
                                      "prepend-icon": "mdi-email-outline",
                                      title: "Newsletter",
                                      rounded: "lg",
                                      class: "ml-4",
                                      color: "primary",
                                      nuxt: "",
                                      onClick: closeDrawer
                                    }),
                                    createVNode(VListItem, {
                                      to: "/admin/analytics",
                                      "prepend-icon": "mdi-chart-box",
                                      title: "Analytics",
                                      rounded: "lg",
                                      class: "ml-4",
                                      color: "primary",
                                      nuxt: "",
                                      onClick: closeDrawer
                                    })
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(VListItem, {
                            to: "/settings",
                            "prepend-icon": "mdi-cog-outline",
                            title: "Settings",
                            rounded: "lg",
                            class: "mb-1",
                            color: "primary",
                            nuxt: "",
                            onClick: closeDrawer
                          }),
                          createVNode(VListItem, {
                            onClick: logout,
                            "prepend-icon": "mdi-logout",
                            title: "Logout",
                            rounded: "lg",
                            color: "error"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "drawer-header pa-4" }, [
                      createVNode("div", { class: "d-flex align-center mb-4" }, [
                        createVNode("div", { class: "logo-container mr-3" }, [
                          createVNode("img", {
                            src: _imports_0,
                            alt: "DevUnity",
                            class: "logo-devunity"
                          })
                        ]),
                        createVNode("div", null, [
                          createVNode("div", { class: "text-h6 font-weight-bold" }, "DevUnity"),
                          createVNode("div", { class: "text-caption text-medium-emphasis" }, "v1.0.0")
                        ])
                      ]),
                      createVNode(VTextField, {
                        modelValue: search.value,
                        "onUpdate:modelValue": ($event) => search.value = $event,
                        density: "compact",
                        variant: "outlined",
                        placeholder: "Search...",
                        "prepend-inner-icon": "mdi-magnify",
                        "hide-details": "",
                        rounded: "",
                        class: "mb-2",
                        "bg-color": "surface"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(VDivider),
                    createVNode(VList, {
                      density: "compact",
                      opened: open.value,
                      "onUpdate:opened": ($event) => open.value = $event,
                      nav: "",
                      class: "px-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(VListItem, {
                          to: "/dashboard",
                          "prepend-icon": "mdi-view-dashboard-outline",
                          title: "Dashboard",
                          rounded: "lg",
                          class: "mb-1",
                          color: "primary",
                          nuxt: "",
                          onClick: closeDrawer
                        }),
                        createVNode(VListGroup, {
                          value: "Recent Projects",
                          class: "mb-1",
                          "prepend-icon": "mdi-history"
                        }, {
                          activator: withCtx(({ props }) => [
                            createVNode(VListItem, mergeProps(props, {
                              title: "Recent Projects",
                              rounded: "lg",
                              color: "primary"
                            }), null, 16)
                          ]),
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                              return openBlock(), createBlock(VListItem, {
                                key: index,
                                to: `/snippets?id=${snippet.id}`,
                                title: snippet.title,
                                "prepend-icon": getFrameworkIcon(snippet.framework),
                                class: "ml-4",
                                rounded: "lg",
                                color: "primary",
                                nuxt: "",
                                onClick: closeDrawer
                              }, {
                                subtitle: withCtx(() => [
                                  createVNode("span", { class: "text-caption" }, toDisplayString(getSnippetDate(snippet)), 1)
                                ]),
                                _: 2
                              }, 1032, ["to", "title", "prepend-icon"]);
                            }), 128)),
                            recentSnippets.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                              key: 0,
                              class: "ml-4",
                              title: "No recent projects",
                              disabled: ""
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        createVNode(VListGroup, {
                          value: "Recent SQL schemas",
                          class: "mb-1",
                          "prepend-icon": "mdi-database-outline"
                        }, {
                          activator: withCtx(({ props }) => [
                            createVNode(VListItem, mergeProps(props, {
                              title: "Recent SQL schemas",
                              rounded: "lg",
                              color: "primary"
                            }), null, 16)
                          ]),
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(recentSQLSchemas.value, (schema, index) => {
                              return openBlock(), createBlock(VListItem, {
                                key: index,
                                to: `/sql-generator?id=${schema.id}`,
                                title: schema.database_name,
                                "prepend-icon": "mdi-database",
                                class: "ml-4",
                                rounded: "lg",
                                color: "primary",
                                nuxt: "",
                                onClick: closeDrawer
                              }, {
                                subtitle: withCtx(() => [
                                  createVNode("span", { class: "text-caption" }, toDisplayString(getSchemaTablesCount(schema)) + " tables", 1)
                                ]),
                                _: 2
                              }, 1032, ["to", "title"]);
                            }), 128)),
                            recentSQLSchemas.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                              key: 0,
                              class: "ml-4",
                              title: "No recent SQL schemas",
                              disabled: ""
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        createVNode(VListSubheader, { class: "mt-2 text-uppercase font-weight-bold text-caption" }, {
                          default: withCtx(() => [
                            createTextVNode("Applications")
                          ]),
                          _: 1
                        }),
                        (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item, index) => {
                          return openBlock(), createBlock(VListGroup, {
                            key: index,
                            value: item.title,
                            class: "mb-1",
                            "prepend-icon": item.prependIcon
                          }, {
                            activator: withCtx(({ props }) => [
                              createVNode(VListItem, mergeProps({ ref_for: true }, props, {
                                title: item.title,
                                rounded: "lg",
                                color: "primary"
                              }), null, 16, ["title"])
                            ]),
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child, idx) => {
                                return openBlock(), createBlock(Fragment, { key: idx }, [
                                  child.component ? (openBlock(), createBlock(resolveDynamicComponent(child.component.component), mergeProps({
                                    key: 0,
                                    ref_for: true
                                  }, child.component.props, { class: "ml-4 my-1 premium-menu-item" }), null, 16)) : (openBlock(), createBlock(VListItem, {
                                    key: 1,
                                    to: child.link,
                                    title: child.title,
                                    "prepend-icon": child.icon || "mdi-circle-small",
                                    class: "ml-4",
                                    rounded: "lg",
                                    color: "primary",
                                    nuxt: "",
                                    onClick: closeDrawer
                                  }, null, 8, ["to", "title", "prepend-icon"]))
                                ], 64);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["value", "prepend-icon"]);
                        }), 128)),
                        createVNode(VDivider, { class: "my-3" }),
                        createVNode(VListSubheader, { class: "text-uppercase font-weight-bold text-caption" }, {
                          default: withCtx(() => [
                            createTextVNode("System")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_client_only, null, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              ((_a = unref(userStore).user) == null ? void 0 : _a.isAdmin) ? (openBlock(), createBlock(VListGroup, {
                                key: 0,
                                value: "Administration",
                                class: "mb-1",
                                "prepend-icon": "mdi-shield-account"
                              }, {
                                activator: withCtx(({ props }) => [
                                  createVNode(VListItem, mergeProps(props, {
                                    title: "Administration",
                                    rounded: "lg",
                                    color: "primary"
                                  }), null, 16)
                                ]),
                                default: withCtx(() => [
                                  createVNode(VListItem, {
                                    to: "/admin/newsletter-admin",
                                    "prepend-icon": "mdi-email-outline",
                                    title: "Newsletter",
                                    rounded: "lg",
                                    class: "ml-4",
                                    color: "primary",
                                    nuxt: "",
                                    onClick: closeDrawer
                                  }),
                                  createVNode(VListItem, {
                                    to: "/admin/analytics",
                                    "prepend-icon": "mdi-chart-box",
                                    title: "Analytics",
                                    rounded: "lg",
                                    class: "ml-4",
                                    color: "primary",
                                    nuxt: "",
                                    onClick: closeDrawer
                                  })
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ];
                          }),
                          _: 1
                        }),
                        createVNode(VListItem, {
                          to: "/settings",
                          "prepend-icon": "mdi-cog-outline",
                          title: "Settings",
                          rounded: "lg",
                          class: "mb-1",
                          color: "primary",
                          nuxt: "",
                          onClick: closeDrawer
                        }),
                        createVNode(VListItem, {
                          onClick: logout,
                          "prepend-icon": "mdi-logout",
                          title: "Logout",
                          rounded: "lg",
                          color: "error"
                        })
                      ]),
                      _: 1
                    }, 8, ["opened", "onUpdate:opened"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!_ctx.$vuetify.display.smAndDown) {
                    _push3(ssrRenderComponent(VAppBar, {
                      color: "primary",
                      flat: "",
                      class: "border-b page-header px-4",
                      "scroll-behavior": "elevate",
                      elevation: 0
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="d-flex align-center" data-v-b5389df5${_scopeId3}>`);
                          _push4(ssrRenderComponent(VIcon, {
                            size: "large",
                            class: "mr-3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(getCurrentPageIcon())}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(getCurrentPageIcon()), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<div class="text-h5 font-weight-bold" data-v-b5389df5${_scopeId3}>${ssrInterpolate(currentPageTitle.value)}</div></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode(VIcon, {
                                size: "large",
                                class: "mr-3"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(getCurrentPageIcon()), 1)
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "text-h5 font-weight-bold" }, toDisplayString(currentPageTitle.value), 1)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !_ctx.$vuetify.display.smAndDown ? (openBlock(), createBlock(VAppBar, {
                      key: 0,
                      color: "primary",
                      flat: "",
                      class: "border-b page-header px-4",
                      "scroll-behavior": "elevate",
                      elevation: 0
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "d-flex align-center" }, [
                          createVNode(VIcon, {
                            size: "large",
                            class: "mr-3"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(getCurrentPageIcon()), 1)
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "text-h5 font-weight-bold" }, toDisplayString(currentPageTitle.value), 1)
                        ])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(_component_NuxtPage)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1),
              createVNode(VNavigationDrawer, {
                modelValue: drawer.value,
                "onUpdate:modelValue": ($event) => drawer.value = $event,
                temporary: _ctx.$vuetify.display.smAndDown,
                permanent: !_ctx.$vuetify.display.smAndDown,
                app: "",
                clipped: "",
                class: "elevation-2"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "drawer-header pa-4" }, [
                    createVNode("div", { class: "d-flex align-center mb-4" }, [
                      createVNode("div", { class: "logo-container mr-3" }, [
                        createVNode("img", {
                          src: _imports_0,
                          alt: "DevUnity",
                          class: "logo-devunity"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-h6 font-weight-bold" }, "DevUnity"),
                        createVNode("div", { class: "text-caption text-medium-emphasis" }, "v1.0.0")
                      ])
                    ]),
                    createVNode(VTextField, {
                      modelValue: search.value,
                      "onUpdate:modelValue": ($event) => search.value = $event,
                      density: "compact",
                      variant: "outlined",
                      placeholder: "Search...",
                      "prepend-inner-icon": "mdi-magnify",
                      "hide-details": "",
                      rounded: "",
                      class: "mb-2",
                      "bg-color": "surface"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode(VDivider),
                  createVNode(VList, {
                    density: "compact",
                    opened: open.value,
                    "onUpdate:opened": ($event) => open.value = $event,
                    nav: "",
                    class: "px-2"
                  }, {
                    default: withCtx(() => [
                      createVNode(VListItem, {
                        to: "/dashboard",
                        "prepend-icon": "mdi-view-dashboard-outline",
                        title: "Dashboard",
                        rounded: "lg",
                        class: "mb-1",
                        color: "primary",
                        nuxt: "",
                        onClick: closeDrawer
                      }),
                      createVNode(VListGroup, {
                        value: "Recent Projects",
                        class: "mb-1",
                        "prepend-icon": "mdi-history"
                      }, {
                        activator: withCtx(({ props }) => [
                          createVNode(VListItem, mergeProps(props, {
                            title: "Recent Projects",
                            rounded: "lg",
                            color: "primary"
                          }), null, 16)
                        ]),
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                            return openBlock(), createBlock(VListItem, {
                              key: index,
                              to: `/snippets?id=${snippet.id}`,
                              title: snippet.title,
                              "prepend-icon": getFrameworkIcon(snippet.framework),
                              class: "ml-4",
                              rounded: "lg",
                              color: "primary",
                              nuxt: "",
                              onClick: closeDrawer
                            }, {
                              subtitle: withCtx(() => [
                                createVNode("span", { class: "text-caption" }, toDisplayString(getSnippetDate(snippet)), 1)
                              ]),
                              _: 2
                            }, 1032, ["to", "title", "prepend-icon"]);
                          }), 128)),
                          recentSnippets.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                            key: 0,
                            class: "ml-4",
                            title: "No recent projects",
                            disabled: ""
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }),
                      createVNode(VListGroup, {
                        value: "Recent SQL schemas",
                        class: "mb-1",
                        "prepend-icon": "mdi-database-outline"
                      }, {
                        activator: withCtx(({ props }) => [
                          createVNode(VListItem, mergeProps(props, {
                            title: "Recent SQL schemas",
                            rounded: "lg",
                            color: "primary"
                          }), null, 16)
                        ]),
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(recentSQLSchemas.value, (schema, index) => {
                            return openBlock(), createBlock(VListItem, {
                              key: index,
                              to: `/sql-generator?id=${schema.id}`,
                              title: schema.database_name,
                              "prepend-icon": "mdi-database",
                              class: "ml-4",
                              rounded: "lg",
                              color: "primary",
                              nuxt: "",
                              onClick: closeDrawer
                            }, {
                              subtitle: withCtx(() => [
                                createVNode("span", { class: "text-caption" }, toDisplayString(getSchemaTablesCount(schema)) + " tables", 1)
                              ]),
                              _: 2
                            }, 1032, ["to", "title"]);
                          }), 128)),
                          recentSQLSchemas.value.length === 0 ? (openBlock(), createBlock(VListItem, {
                            key: 0,
                            class: "ml-4",
                            title: "No recent SQL schemas",
                            disabled: ""
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }),
                      createVNode(VListSubheader, { class: "mt-2 text-uppercase font-weight-bold text-caption" }, {
                        default: withCtx(() => [
                          createTextVNode("Applications")
                        ]),
                        _: 1
                      }),
                      (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item, index) => {
                        return openBlock(), createBlock(VListGroup, {
                          key: index,
                          value: item.title,
                          class: "mb-1",
                          "prepend-icon": item.prependIcon
                        }, {
                          activator: withCtx(({ props }) => [
                            createVNode(VListItem, mergeProps({ ref_for: true }, props, {
                              title: item.title,
                              rounded: "lg",
                              color: "primary"
                            }), null, 16, ["title"])
                          ]),
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(item.children, (child, idx) => {
                              return openBlock(), createBlock(Fragment, { key: idx }, [
                                child.component ? (openBlock(), createBlock(resolveDynamicComponent(child.component.component), mergeProps({
                                  key: 0,
                                  ref_for: true
                                }, child.component.props, { class: "ml-4 my-1 premium-menu-item" }), null, 16)) : (openBlock(), createBlock(VListItem, {
                                  key: 1,
                                  to: child.link,
                                  title: child.title,
                                  "prepend-icon": child.icon || "mdi-circle-small",
                                  class: "ml-4",
                                  rounded: "lg",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }, null, 8, ["to", "title", "prepend-icon"]))
                              ], 64);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["value", "prepend-icon"]);
                      }), 128)),
                      createVNode(VDivider, { class: "my-3" }),
                      createVNode(VListSubheader, { class: "text-uppercase font-weight-bold text-caption" }, {
                        default: withCtx(() => [
                          createTextVNode("System")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_client_only, null, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            ((_a = unref(userStore).user) == null ? void 0 : _a.isAdmin) ? (openBlock(), createBlock(VListGroup, {
                              key: 0,
                              value: "Administration",
                              class: "mb-1",
                              "prepend-icon": "mdi-shield-account"
                            }, {
                              activator: withCtx(({ props }) => [
                                createVNode(VListItem, mergeProps(props, {
                                  title: "Administration",
                                  rounded: "lg",
                                  color: "primary"
                                }), null, 16)
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItem, {
                                  to: "/admin/newsletter-admin",
                                  "prepend-icon": "mdi-email-outline",
                                  title: "Newsletter",
                                  rounded: "lg",
                                  class: "ml-4",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                }),
                                createVNode(VListItem, {
                                  to: "/admin/analytics",
                                  "prepend-icon": "mdi-chart-box",
                                  title: "Analytics",
                                  rounded: "lg",
                                  class: "ml-4",
                                  color: "primary",
                                  nuxt: "",
                                  onClick: closeDrawer
                                })
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(VListItem, {
                        to: "/settings",
                        "prepend-icon": "mdi-cog-outline",
                        title: "Settings",
                        rounded: "lg",
                        class: "mb-1",
                        color: "primary",
                        nuxt: "",
                        onClick: closeDrawer
                      }),
                      createVNode(VListItem, {
                        onClick: logout,
                        "prepend-icon": "mdi-logout",
                        title: "Logout",
                        rounded: "lg",
                        color: "error"
                      })
                    ]),
                    _: 1
                  }, 8, ["opened", "onUpdate:opened"])
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue", "temporary", "permanent"]),
              createVNode(VMain, null, {
                default: withCtx(() => [
                  !_ctx.$vuetify.display.smAndDown ? (openBlock(), createBlock(VAppBar, {
                    key: 0,
                    color: "primary",
                    flat: "",
                    class: "border-b page-header px-4",
                    "scroll-behavior": "elevate",
                    elevation: 0
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "d-flex align-center" }, [
                        createVNode(VIcon, {
                          size: "large",
                          class: "mr-3"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(getCurrentPageIcon()), 1)
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "text-h5 font-weight-bold" }, toDisplayString(currentPageTitle.value), 1)
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_NuxtPage)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b5389df5"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard.vue2.mjs.map
