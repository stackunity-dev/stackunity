import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, defineAsyncComponent, ref, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, Fragment, renderList, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public2.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { S as useUserStore, V as VApp, d as VSpacer, e as VBtn, g as VIcon, T as VList, U as VListItem, W as VListItemTitle, X as VResponsive, P as VImg, f as VCard, Y as VCardText, i as VAvatar, Z as VCardItem, $ as VCardTitle, a0 as VCardActions, h as VDivider, _ as _export_sfc } from './server.mjs';
import { S as Snackbar } from './snackbar.vue.mjs';
import { u as useHead } from './v3.mjs';
import { V as VAppBar } from './VAppBar.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VNavigationDrawer } from './VNavigationDrawer.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VTextField } from './VTextField.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'deep-pick-omit';
import './VToolbar.mjs';

const _imports_1 = publicAssetsURL("/images/preview-devunity.avif");

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "DevUnity - The all-in-one platform for developers who want to create, manage and optimize their web projects.",
      meta: [
        { name: "description", content: "DevUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects." },
        { name: "keywords", content: "DevUnity, web development, all-in-one platform, web applications, web application platform, web application development tools, web application development framework, web application development platform" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "DevUnity - The all-in-one platform for developers who want to create, manage and optimize their web projects." }
      ]
    });
    const Pricing = defineAsyncComponent(() => import('./pricing.vue.mjs'));
    const Faq = defineAsyncComponent(() => import('./faq.vue.mjs'));
    const stats = [
      { value: "2x", label: "Faster Development" },
      { value: "50+", label: "Ready-to-use Components" },
      { value: "99.9%", label: "Guaranteed Uptime" },
      { value: "24/7", label: "Reactive Support" }
    ];
    const features = [
      {
        title: "Code Snippets",
        description: "Create, share and reuse code snippets to speed up your development.",
        icon: "mdi-code-tags",
        color: "primary"
      },
      {
        title: "SQL Generator",
        description: "Visually design your database schemas and generate the corresponding SQL code.",
        icon: "mdi-database",
        color: "info"
      },
      {
        title: "SEO Audit",
        description: "Analyze and optimize your websites' SEO to improve their visibility.",
        icon: "mdi-magnify",
        color: "success"
      },
      {
        title: "Sitemaps",
        description: "Generate and setup all your sitemaps in our sitemaps container.",
        icon: "mdi-sitemap",
        color: "warning"
      },
      {
        title: "Accessibility",
        description: "Check and improve the accessibility of your websites for all users.",
        icon: "mdi-access-point",
        color: "error"
      },
      {
        title: "Design Studio",
        description: "Create modern user interfaces with our integrated design studio.",
        icon: "mdi-palette",
        color: "secondary"
      }
    ];
    const steps = [
      {
        title: "Create your account",
        description: "Sign up for free and set up your developer profile in minutes.",
        link: "/signup",
        color: "primary"
      },
      {
        title: "Choose your tools",
        description: "Select the tools you need for your project from our wide range of features.",
        link: "/signup",
        color: "info"
      },
      {
        title: "Develop faster",
        description: "Use our tools to speed up your development and improve the quality of your projects.",
        link: "/signup",
        color: "success"
      }
    ];
    const menuItems = [
      { title: "Features", href: "#features", icon: "mdi-apps-box" },
      { title: "Pricing", href: "#pricing", icon: "mdi-tag-outline" },
      { title: "FAQ", href: "#faq", icon: "mdi-frequently-asked-questions" }
    ];
    const footerColumns = [
      {
        title: "Product",
        links: [
          { title: "Features", to: "#features" },
          { title: "Pricing", to: "#pricing" },
          { title: "FAQ", to: "#faq" }
        ]
      },
      {
        title: "Company",
        links: [
          { title: "About", to: "/about" },
          { title: "Contact", to: "/contact" },
          { title: "Blog", to: "/blog" }
        ]
      },
      {
        title: "Legal",
        links: [
          { title: "Privacy", to: "/privacy" },
          { title: "Terms", to: "/terms" },
          { title: "Cookies", to: "/cookies" }
        ]
      }
    ];
    const drawer = ref(false);
    const activeSection = ref("");
    const showAppBar = ref(true);
    const email = ref("");
    const showSnackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("");
    const snackbarTimeout = ref(2e3);
    const loading = ref(false);
    const userStore = useUserStore();
    const submitEmail = async () => {
      if (!email.value) {
        showMessage("Please enter your email address", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showMessage("Please enter a valid email address", "error");
        return;
      }
      loading.value = true;
      try {
        await userStore.subscribeToNewsletter(email.value);
        showMessage("Thanks for subscribing! You'll receive our latest updates soon.", "success");
        email.value = "";
      } catch (error) {
        console.error("Error during subscription:", error);
        showMessage("An error occurred. Please try again later.", "error");
      } finally {
        loading.value = false;
      }
    };
    const showMessage = (message, type = "info", timeout = 3e3) => {
      snackbarText.value = message;
      snackbarColor.value = type;
      snackbarTimeout.value = timeout;
      showSnackbar.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, mergeProps({ class: "landing-screen" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VAppBar, {
              app: "",
              elevation: 2,
              color: "surface",
              class: "px-0 nav-bar",
              modelValue: showAppBar.value,
              "onUpdate:modelValue": ($event) => showAppBar.value = $event
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
                              _push5(`<div class="d-flex align-center brand-container" data-v-c6c0e7a8${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" class="logo-image" data-v-c6c0e7a8${_scopeId4}><div class="brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left" data-v-c6c0e7a8${_scopeId4}><span class="text-caption font-weight-medium text-gradient" data-v-c6c0e7a8${_scopeId4}>PROPULSE YOUR CODE</span></div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "d-flex align-center brand-container" }, [
                                  createVNode("img", {
                                    src: _imports_0,
                                    alt: "DevUnity title",
                                    width: "150",
                                    class: "logo-image"
                                  }),
                                  createVNode("div", { class: "brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left" }, [
                                    createVNode("span", { class: "text-caption font-weight-medium text-gradient" }, "PROPULSE YOUR CODE")
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        if (_ctx.$vuetify.display.smAndUp) {
                          _push4(`<div class="d-flex align-center custom-nav-menu" data-v-c6c0e7a8${_scopeId3}><div class="nav-links-wrapper" data-v-c6c0e7a8${_scopeId3}><!--[-->`);
                          ssrRenderList(menuItems, (item) => {
                            _push4(ssrRenderComponent(VBtn, {
                              key: item.href,
                              class: ["nav-btn custom-btn", { "active-nav-btn": activeSection.value === item.href.substring(1) }],
                              href: item.href,
                              variant: "text"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="nav-text" data-v-c6c0e7a8${_scopeId4}>${ssrInterpolate(item.title)}</span><span class="nav-btn-background" data-v-c6c0e7a8${_scopeId4}></span>`);
                                } else {
                                  return [
                                    createVNode("span", { class: "nav-text" }, toDisplayString(item.title), 1),
                                    createVNode("span", { class: "nav-btn-background" })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]--></div><div class="auth-buttons ml-6" data-v-c6c0e7a8${_scopeId3}>`);
                          _push4(ssrRenderComponent(VBtn, {
                            color: "primary",
                            class: "login-btn",
                            to: "/login",
                            variant: "tonal",
                            rounded: "rounded-xl",
                            "prepend-icon": "mdi-login"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Login `);
                              } else {
                                return [
                                  createTextVNode(" Login ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div></div>`);
                        } else {
                          _push4(`<div class="d-flex align-center" data-v-c6c0e7a8${_scopeId3}>`);
                          _push4(ssrRenderComponent(VBtn, {
                            color: "primary",
                            class: "mr-2",
                            to: "/login",
                            size: "small",
                            rounded: "pill"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VIcon, {
                                  size: "small",
                                  class: "mr-1"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-login`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-login")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(` Login `);
                              } else {
                                return [
                                  createVNode(VIcon, {
                                    size: "small",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-login")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Login ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VBtn, {
                            icon: "",
                            onClick: ($event) => drawer.value = !drawer.value,
                            class: "menu-toggle-btn",
                            "aria-label": "Toggle navigation menu"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="${ssrRenderClass([{ "active": drawer.value }, "hamburger-icon"])}" data-v-c6c0e7a8${_scopeId4}><span data-v-c6c0e7a8${_scopeId4}></span><span data-v-c6c0e7a8${_scopeId4}></span><span data-v-c6c0e7a8${_scopeId4}></span></div>`);
                              } else {
                                return [
                                  createVNode("div", {
                                    class: ["hamburger-icon", { "active": drawer.value }]
                                  }, [
                                    createVNode("span"),
                                    createVNode("span"),
                                    createVNode("span")
                                  ], 2)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        }
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: "/",
                            class: "text-decoration-none"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center brand-container" }, [
                                createVNode("img", {
                                  src: _imports_0,
                                  alt: "DevUnity title",
                                  width: "150",
                                  class: "logo-image"
                                }),
                                createVNode("div", { class: "brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left" }, [
                                  createVNode("span", { class: "text-caption font-weight-medium text-gradient" }, "PROPULSE YOUR CODE")
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(VSpacer),
                          _ctx.$vuetify.display.smAndUp ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "d-flex align-center custom-nav-menu"
                          }, [
                            createVNode("div", { class: "nav-links-wrapper" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                                return createVNode(VBtn, {
                                  key: item.href,
                                  class: ["nav-btn custom-btn", { "active-nav-btn": activeSection.value === item.href.substring(1) }],
                                  href: item.href,
                                  variant: "text"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "nav-text" }, toDisplayString(item.title), 1),
                                    createVNode("span", { class: "nav-btn-background" })
                                  ]),
                                  _: 2
                                }, 1032, ["href", "class"]);
                              }), 64))
                            ]),
                            createVNode("div", { class: "auth-buttons ml-6" }, [
                              createVNode(VBtn, {
                                color: "primary",
                                class: "login-btn",
                                to: "/login",
                                variant: "tonal",
                                rounded: "rounded-xl",
                                "prepend-icon": "mdi-login"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Login ")
                                ]),
                                _: 1
                              })
                            ])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "d-flex align-center"
                          }, [
                            createVNode(VBtn, {
                              color: "primary",
                              class: "mr-2",
                              to: "/login",
                              size: "small",
                              rounded: "pill"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "small",
                                  class: "mr-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-login")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Login ")
                              ]),
                              _: 1
                            }),
                            createVNode(VBtn, {
                              icon: "",
                              onClick: ($event) => drawer.value = !drawer.value,
                              class: "menu-toggle-btn",
                              "aria-label": "Toggle navigation menu"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: ["hamburger-icon", { "active": drawer.value }]
                                }, [
                                  createVNode("span"),
                                  createVNode("span"),
                                  createVNode("span")
                                ], 2)
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]))
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
                            createVNode("div", { class: "d-flex align-center brand-container" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "DevUnity title",
                                width: "150",
                                class: "logo-image"
                              }),
                              createVNode("div", { class: "brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left" }, [
                                createVNode("span", { class: "text-caption font-weight-medium text-gradient" }, "PROPULSE YOUR CODE")
                              ])
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(VSpacer),
                        _ctx.$vuetify.display.smAndUp ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "d-flex align-center custom-nav-menu"
                        }, [
                          createVNode("div", { class: "nav-links-wrapper" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                              return createVNode(VBtn, {
                                key: item.href,
                                class: ["nav-btn custom-btn", { "active-nav-btn": activeSection.value === item.href.substring(1) }],
                                href: item.href,
                                variant: "text"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "nav-text" }, toDisplayString(item.title), 1),
                                  createVNode("span", { class: "nav-btn-background" })
                                ]),
                                _: 2
                              }, 1032, ["href", "class"]);
                            }), 64))
                          ]),
                          createVNode("div", { class: "auth-buttons ml-6" }, [
                            createVNode(VBtn, {
                              color: "primary",
                              class: "login-btn",
                              to: "/login",
                              variant: "tonal",
                              rounded: "rounded-xl",
                              "prepend-icon": "mdi-login"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Login ")
                              ]),
                              _: 1
                            })
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "d-flex align-center"
                        }, [
                          createVNode(VBtn, {
                            color: "primary",
                            class: "mr-2",
                            to: "/login",
                            size: "small",
                            rounded: "pill"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "small",
                                class: "mr-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-login")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Login ")
                            ]),
                            _: 1
                          }),
                          createVNode(VBtn, {
                            icon: "",
                            onClick: ($event) => drawer.value = !drawer.value,
                            class: "menu-toggle-btn",
                            "aria-label": "Toggle navigation menu"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", {
                                class: ["hamburger-icon", { "active": drawer.value }]
                              }, [
                                createVNode("span"),
                                createVNode("span"),
                                createVNode("span")
                              ], 2)
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VNavigationDrawer, {
              modelValue: drawer.value,
              "onUpdate:modelValue": ($event) => drawer.value = $event,
              location: "right",
              temporary: "",
              class: "mobile-nav-drawer d-md-none pa-6"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="drawer-header mb-8 d-flex justify-space-between align-center" data-v-c6c0e7a8${_scopeId2}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="120" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VBtn, {
                    icon: "",
                    variant: "text",
                    onClick: ($event) => drawer.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-close`);
                            } else {
                              return [
                                createTextVNode("mdi-close")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
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
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="mobile-nav-links" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VList, { nav: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(menuItems, (item) => {
                          _push4(ssrRenderComponent(VListItem, {
                            key: item.href,
                            href: item.href,
                            onClick: ($event) => drawer.value = false,
                            class: "mobile-nav-item mb-3",
                            rounded: "lg"
                          }, {
                            prepend: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VIcon, {
                                  class: "mr-2",
                                  icon: item.icon,
                                  color: "primary"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VIcon, {
                                    class: "mr-2",
                                    icon: item.icon,
                                    color: "primary"
                                  }, null, 8, ["icon"])
                                ];
                              }
                            }),
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItemTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(item.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(item.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItemTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.title), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                            return createVNode(VListItem, {
                              key: item.href,
                              href: item.href,
                              onClick: ($event) => drawer.value = false,
                              class: "mobile-nav-item mb-3",
                              rounded: "lg"
                            }, {
                              prepend: withCtx(() => [
                                createVNode(VIcon, {
                                  class: "mr-2",
                                  icon: item.icon,
                                  color: "primary"
                                }, null, 8, ["icon"])
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItemTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.title), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["href", "onClick"]);
                          }), 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="drawer-footer mt-auto pt-6" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VBtn, {
                    block: "",
                    color: "primary",
                    to: "/signup",
                    class: "mb-4",
                    size: "large",
                    rounded: "pill"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, { start: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-rocket-launch-outline`);
                            } else {
                              return [
                                createTextVNode("mdi-rocket-launch-outline")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` Get started `);
                      } else {
                        return [
                          createVNode(VIcon, { start: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-rocket-launch-outline")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Get started ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-caption text-center text-medium-emphasis" data-v-c6c0e7a8${_scopeId2}>Join our community of developers and propulse your web projects to new horizons.</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "drawer-header mb-8 d-flex justify-space-between align-center" }, [
                      createVNode("img", {
                        src: _imports_0,
                        alt: "DevUnity title",
                        width: "120"
                      }),
                      createVNode(VBtn, {
                        icon: "",
                        variant: "text",
                        onClick: ($event) => drawer.value = false
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
                    createVNode("div", { class: "mobile-nav-links" }, [
                      createVNode(VList, { nav: "" }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                            return createVNode(VListItem, {
                              key: item.href,
                              href: item.href,
                              onClick: ($event) => drawer.value = false,
                              class: "mobile-nav-item mb-3",
                              rounded: "lg"
                            }, {
                              prepend: withCtx(() => [
                                createVNode(VIcon, {
                                  class: "mr-2",
                                  icon: item.icon,
                                  color: "primary"
                                }, null, 8, ["icon"])
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItemTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.title), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["href", "onClick"]);
                          }), 64))
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "drawer-footer mt-auto pt-6" }, [
                      createVNode(VBtn, {
                        block: "",
                        color: "primary",
                        to: "/signup",
                        class: "mb-4",
                        size: "large",
                        rounded: "pill"
                      }, {
                        default: withCtx(() => [
                          createVNode(VIcon, { start: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-rocket-launch-outline")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Get started ")
                        ]),
                        _: 1
                      }),
                      createVNode("p", { class: "text-caption text-center text-medium-emphasis" }, "Join our community of developers and propulse your web projects to new horizons.")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, { class: "main-content" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<section id="hero" class="hero-section" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, { class: "py-16" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { class: "align-center justify-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "6",
                                class: "text-center text-md-left"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VResponsive, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<h1 class="text-h2 font-weight-bold mb-4" data-v-c6c0e7a8${_scopeId6}>Develop faster with DevUnity</h1><p class="text-subtitle-1 text-medium-emphasis mb-8" data-v-c6c0e7a8${_scopeId6}> The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. </p><div class="d-flex flex-column flex-sm-row justify-center justify-md-start" data-v-c6c0e7a8${_scopeId6}>`);
                                          _push7(ssrRenderComponent(VBtn, {
                                            "x-large": "",
                                            color: "primary",
                                            variant: "tonal",
                                            class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                            to: "/signup"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Get started `);
                                              } else {
                                                return [
                                                  createTextVNode(" Get started ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VBtn, {
                                            "x-large": "",
                                            outlined: "",
                                            color: "info",
                                            variant: "tonal",
                                            class: "px-6",
                                            href: "#features"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Learn more `);
                                                _push8(ssrRenderComponent(VIcon, { right: "" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-arrow-right`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-arrow-right")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createTextVNode(" Learn more "),
                                                  createVNode(VIcon, { right: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-arrow-right")
                                                    ]),
                                                    _: 1
                                                  })
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`</div>`);
                                        } else {
                                          return [
                                            createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                            createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                            createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                              createVNode(VBtn, {
                                                "x-large": "",
                                                color: "primary",
                                                variant: "tonal",
                                                class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                                to: "/signup"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Get started ")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VBtn, {
                                                "x-large": "",
                                                outlined: "",
                                                color: "info",
                                                variant: "tonal",
                                                class: "px-6",
                                                href: "#features"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Learn more "),
                                                  createVNode(VIcon, { right: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-arrow-right")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VResponsive, null, {
                                        default: withCtx(() => [
                                          createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                          createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                          createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                            createVNode(VBtn, {
                                              "x-large": "",
                                              color: "primary",
                                              variant: "tonal",
                                              class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                              to: "/signup"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Get started ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VBtn, {
                                              "x-large": "",
                                              outlined: "",
                                              color: "info",
                                              variant: "tonal",
                                              class: "px-6",
                                              href: "#features"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Learn more "),
                                                createVNode(VIcon, { right: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-arrow-right")
                                                  ]),
                                                  _: 1
                                                })
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
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "6",
                                class: "d-flex justify-center mt-8 mt-md-0"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VImg, {
                                      src: _imports_1,
                                      "max-width": "90%",
                                      contain: "",
                                      class: "hero-image rounded-xl elevation-10",
                                      alt: "Devroid Platform"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VImg, {
                                        src: _imports_1,
                                        "max-width": "90%",
                                        contain: "",
                                        class: "hero-image rounded-xl elevation-10",
                                        alt: "Devroid Platform"
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
                                  md: "6",
                                  class: "text-center text-md-left"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VResponsive, null, {
                                      default: withCtx(() => [
                                        createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                        createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                        createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                          createVNode(VBtn, {
                                            "x-large": "",
                                            color: "primary",
                                            variant: "tonal",
                                            class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                            to: "/signup"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Get started ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VBtn, {
                                            "x-large": "",
                                            outlined: "",
                                            color: "info",
                                            variant: "tonal",
                                            class: "px-6",
                                            href: "#features"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Learn more "),
                                              createVNode(VIcon, { right: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-arrow-right")
                                                ]),
                                                _: 1
                                              })
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
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "6",
                                  class: "d-flex justify-center mt-8 mt-md-0"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VImg, {
                                      src: _imports_1,
                                      "max-width": "90%",
                                      contain: "",
                                      class: "hero-image rounded-xl elevation-10",
                                      alt: "Devroid Platform"
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
                          createVNode(VRow, { class: "align-center justify-center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "6",
                                class: "text-center text-md-left"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VResponsive, null, {
                                    default: withCtx(() => [
                                      createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                      createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                      createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                        createVNode(VBtn, {
                                          "x-large": "",
                                          color: "primary",
                                          variant: "tonal",
                                          class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                          to: "/signup"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Get started ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          "x-large": "",
                                          outlined: "",
                                          color: "info",
                                          variant: "tonal",
                                          class: "px-6",
                                          href: "#features"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Learn more "),
                                            createVNode(VIcon, { right: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-arrow-right")
                                              ]),
                                              _: 1
                                            })
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
                              createVNode(VCol, {
                                cols: "12",
                                md: "6",
                                class: "d-flex justify-center mt-8 mt-md-0"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VImg, {
                                    src: _imports_1,
                                    "max-width": "90%",
                                    contain: "",
                                    class: "hero-image rounded-xl elevation-10",
                                    alt: "Devroid Platform"
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
                  _push3(`</section><section class="stats-section py-8" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { class: "align-center justify-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(stats, (stat, i) => {
                                _push5(ssrRenderComponent(VCol, {
                                  key: i,
                                  cols: "6",
                                  sm: "3",
                                  class: "text-center"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="stat-value text-h3 font-weight-bold primary--text mb-1" data-v-c6c0e7a8${_scopeId5}>${ssrInterpolate(stat.value)}</div><div class="stat-label text-subtitle-2 text-medium-emphasis" data-v-c6c0e7a8${_scopeId5}>${ssrInterpolate(stat.label)}</div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "stat-value text-h3 font-weight-bold primary--text mb-1" }, toDisplayString(stat.value), 1),
                                        createVNode("div", { class: "stat-label text-subtitle-2 text-medium-emphasis" }, toDisplayString(stat.label), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                                  return createVNode(VCol, {
                                    key: i,
                                    cols: "6",
                                    sm: "3",
                                    class: "text-center"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "stat-value text-h3 font-weight-bold primary--text mb-1" }, toDisplayString(stat.value), 1),
                                      createVNode("div", { class: "stat-label text-subtitle-2 text-medium-emphasis" }, toDisplayString(stat.label), 1)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VRow, { class: "align-center justify-center" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                                return createVNode(VCol, {
                                  key: i,
                                  cols: "6",
                                  sm: "3",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "stat-value text-h3 font-weight-bold primary--text mb-1" }, toDisplayString(stat.value), 1),
                                    createVNode("div", { class: "stat-label text-subtitle-2 text-medium-emphasis" }, toDisplayString(stat.label), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</section><section id="features" class="py-16" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center mb-12" data-v-c6c0e7a8${_scopeId3}><span class="section-subtitle" data-v-c6c0e7a8${_scopeId3}>POWERFUL TOOLS</span><h2 class="text-h3 font-weight-bold mb-3" data-v-c6c0e7a8${_scopeId3}>Features That Boost Your Productivity</h2><p class="text-subtitle-1 text-medium-emphasis mx-auto" style="${ssrRenderStyle({ "max-width": "700px" })}" data-v-c6c0e7a8${_scopeId3}> DevUnity combines all the tools you need to develop modern web applications in one intuitive platform. </p></div>`);
                        _push4(ssrRenderComponent(VRow, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(features, (feature, index) => {
                                _push5(ssrRenderComponent(VCol, {
                                  key: index,
                                  cols: "12",
                                  md: "4",
                                  class: "mb-8"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VCard, {
                                        class: "feature-card h-100 rounded-lg",
                                        flat: ""
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VCardText, { class: "pa-6" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VAvatar, {
                                                    color: feature.color,
                                                    size: "56",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VIcon, {
                                                          dark: "",
                                                          size: "32"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(feature.icon)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(feature.icon), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VIcon, {
                                                            dark: "",
                                                            size: "32"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(feature.icon), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                  _push8(`<h3 class="text-h5 font-weight-bold mb-3" data-v-c6c0e7a8${_scopeId7}>${ssrInterpolate(feature.title)}</h3><p class="text-body-1 text-medium-emphasis" data-v-c6c0e7a8${_scopeId7}>${ssrInterpolate(feature.description)}</p>`);
                                                } else {
                                                  return [
                                                    createVNode(VAvatar, {
                                                      color: feature.color,
                                                      size: "56",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          dark: "",
                                                          size: "32"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(feature.icon), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"]),
                                                    createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                                    createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VCardText, { class: "pa-6" }, {
                                                default: withCtx(() => [
                                                  createVNode(VAvatar, {
                                                    color: feature.color,
                                                    size: "56",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        dark: "",
                                                        size: "32"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(feature.icon), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"]),
                                                  createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                                  createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCard, {
                                          class: "feature-card h-100 rounded-lg",
                                          flat: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCardText, { class: "pa-6" }, {
                                              default: withCtx(() => [
                                                createVNode(VAvatar, {
                                                  color: feature.color,
                                                  size: "56",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      dark: "",
                                                      size: "32"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(feature.icon), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"]),
                                                createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                                createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
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
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(features, (feature, index) => {
                                  return createVNode(VCol, {
                                    key: index,
                                    cols: "12",
                                    md: "4",
                                    class: "mb-8"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, {
                                        class: "feature-card h-100 rounded-lg",
                                        flat: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardText, { class: "pa-6" }, {
                                            default: withCtx(() => [
                                              createVNode(VAvatar, {
                                                color: feature.color,
                                                size: "56",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, {
                                                    dark: "",
                                                    size: "32"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(feature.icon), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                              createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "text-center mb-12" }, [
                            createVNode("span", { class: "section-subtitle" }, "POWERFUL TOOLS"),
                            createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "Features That Boost Your Productivity"),
                            createVNode("p", {
                              class: "text-subtitle-1 text-medium-emphasis mx-auto",
                              style: { "max-width": "700px" }
                            }, " DevUnity combines all the tools you need to develop modern web applications in one intuitive platform. ")
                          ]),
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(features, (feature, index) => {
                                return createVNode(VCol, {
                                  key: index,
                                  cols: "12",
                                  md: "4",
                                  class: "mb-8"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: "feature-card h-100 rounded-lg",
                                      flat: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardText, { class: "pa-6" }, {
                                          default: withCtx(() => [
                                            createVNode(VAvatar, {
                                              color: feature.color,
                                              size: "56",
                                              class: "mb-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  dark: "",
                                                  size: "32"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(feature.icon), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"]),
                                            createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                            createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</section><section class="py-16" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-center mb-12" data-v-c6c0e7a8${_scopeId3}><h2 class="text-h3 font-weight-bold mb-3" data-v-c6c0e7a8${_scopeId3}>How It Works</h2><p class="text-subtitle-1 text-medium-emphasis mx-auto" style="${ssrRenderStyle({ "max-width": "700px" })}" data-v-c6c0e7a8${_scopeId3}> Three simple steps to start using Devroid and transform your development workflow. </p></div>`);
                        _push4(ssrRenderComponent(VRow, {
                          justify: "center",
                          class: "mt-8"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(steps, (step, i) => {
                                _push5(ssrRenderComponent(VCol, {
                                  key: i,
                                  cols: "12",
                                  md: "4",
                                  class: "px-4"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VCard, {
                                        class: ["h-100 rounded-xl", `border-${step.color}`],
                                        elevation: "3",
                                        style: { "border-top": "#00658b 4px solid" }
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VCardItem, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VAvatar, {
                                                    color: step.color,
                                                    size: "56",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<span class="text-h5 font-weight-bold white--text" data-v-c6c0e7a8${_scopeId8}>${ssrInterpolate(i + 1)}</span>`);
                                                      } else {
                                                        return [
                                                          createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VAvatar, {
                                                      color: step.color,
                                                      size: "56",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(step.title)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(step.title), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VCardText, { class: "text-body-1" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(step.description)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(step.description), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VCardActions, { class: "pa-4" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VBtn, {
                                                    color: step.color,
                                                    variant: "text",
                                                    class: "text-none",
                                                    to: step.link
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`Learn more `);
                                                        _push9(ssrRenderComponent(VIcon, { right: "" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`mdi-arrow-right`);
                                                            } else {
                                                              return [
                                                                createTextVNode("mdi-arrow-right")
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createTextVNode("Learn more "),
                                                          createVNode(VIcon, { right: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-arrow-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VBtn, {
                                                      color: step.color,
                                                      variant: "text",
                                                      class: "text-none",
                                                      to: step.link
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Learn more "),
                                                        createVNode(VIcon, { right: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-arrow-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color", "to"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VCardItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VAvatar, {
                                                    color: step.color,
                                                    size: "56",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(step.title), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardText, { class: "text-body-1" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(step.description), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VCardActions, { class: "pa-4" }, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    color: step.color,
                                                    variant: "text",
                                                    class: "text-none",
                                                    to: step.link
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Learn more "),
                                                      createVNode(VIcon, { right: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-arrow-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color", "to"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCard, {
                                          class: ["h-100 rounded-xl", `border-${step.color}`],
                                          elevation: "3",
                                          style: { "border-top": "#00658b 4px solid" }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCardItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VAvatar, {
                                                  color: step.color,
                                                  size: "56",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(step.title), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardText, { class: "text-body-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(step.description), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VCardActions, { class: "pa-4" }, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  color: step.color,
                                                  variant: "text",
                                                  class: "text-none",
                                                  to: step.link
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Learn more "),
                                                    createVNode(VIcon, { right: "" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-arrow-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color", "to"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["class"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(steps, (step, i) => {
                                  return createVNode(VCol, {
                                    key: i,
                                    cols: "12",
                                    md: "4",
                                    class: "px-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, {
                                        class: ["h-100 rounded-xl", `border-${step.color}`],
                                        elevation: "3",
                                        style: { "border-top": "#00658b 4px solid" }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VAvatar, {
                                                color: step.color,
                                                size: "56",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(step.title), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VCardText, { class: "text-body-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(step.description), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VCardActions, { class: "pa-4" }, {
                                            default: withCtx(() => [
                                              createVNode(VBtn, {
                                                color: step.color,
                                                variant: "text",
                                                class: "text-none",
                                                to: step.link
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Learn more "),
                                                  createVNode(VIcon, { right: "" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-arrow-right")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 2
                                              }, 1032, ["color", "to"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="d-flex justify-center mt-12" data-v-c6c0e7a8${_scopeId3}>`);
                        _push4(ssrRenderComponent(VBtn, {
                          size: "large",
                          color: "info",
                          variant: "tonal",
                          class: "px-8 rounded-pill",
                          elevation: "2",
                          to: "/signup",
                          nuxt: ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Get Started Now `);
                              _push5(ssrRenderComponent(VIcon, { end: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-rocket-launch-outline`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-rocket-launch-outline")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createTextVNode(" Get Started Now "),
                                createVNode(VIcon, { end: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-rocket-launch-outline")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center mb-12" }, [
                            createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "How It Works"),
                            createVNode("p", {
                              class: "text-subtitle-1 text-medium-emphasis mx-auto",
                              style: { "max-width": "700px" }
                            }, " Three simple steps to start using Devroid and transform your development workflow. ")
                          ]),
                          createVNode(VRow, {
                            justify: "center",
                            class: "mt-8"
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(steps, (step, i) => {
                                return createVNode(VCol, {
                                  key: i,
                                  cols: "12",
                                  md: "4",
                                  class: "px-4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: ["h-100 rounded-xl", `border-${step.color}`],
                                      elevation: "3",
                                      style: { "border-top": "#00658b 4px solid" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VAvatar, {
                                              color: step.color,
                                              size: "56",
                                              class: "mb-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(step.title), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardText, { class: "text-body-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(step.description), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardActions, { class: "pa-4" }, {
                                          default: withCtx(() => [
                                            createVNode(VBtn, {
                                              color: step.color,
                                              variant: "text",
                                              class: "text-none",
                                              to: step.link
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Learn more "),
                                                createVNode(VIcon, { right: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-arrow-right")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 2
                                            }, 1032, ["color", "to"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["class"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "d-flex justify-center mt-12" }, [
                            createVNode(VBtn, {
                              size: "large",
                              color: "info",
                              variant: "tonal",
                              class: "px-8 rounded-pill",
                              elevation: "2",
                              to: "/signup",
                              nuxt: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Get Started Now "),
                                createVNode(VIcon, { end: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-rocket-launch-outline")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</section><section id="pricing" class="py-16" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Pricing), null, null, _parent3, _scopeId2));
                  _push3(`</section><section id="faq" class="py-16" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Faq), null, null, _parent3, _scopeId2));
                  _push3(`</section><section class="py-16 primary" data-v-c6c0e7a8${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { justify: "center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "8",
                                class: "text-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h2 class="text-h3 font-weight-bold white--text mb-4" data-v-c6c0e7a8${_scopeId5}>Ready to get started?</h2><p class="text-subtitle-1 white--text text-opacity-high mb-8" data-v-c6c0e7a8${_scopeId5}> Join the community already using DevUnity for their projects. </p>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      "x-large": "",
                                      color: "info",
                                      variant: "tonal",
                                      elevation: "2",
                                      class: "px-8",
                                      to: "/signup"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Create free account `);
                                        } else {
                                          return [
                                            createTextVNode(" Create free account ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("h2", { class: "text-h3 font-weight-bold white--text mb-4" }, "Ready to get started?"),
                                      createVNode("p", { class: "text-subtitle-1 white--text text-opacity-high mb-8" }, " Join the community already using DevUnity for their projects. "),
                                      createVNode(VBtn, {
                                        "x-large": "",
                                        color: "info",
                                        variant: "tonal",
                                        elevation: "2",
                                        class: "px-8",
                                        to: "/signup"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create free account ")
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
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h2", { class: "text-h3 font-weight-bold white--text mb-4" }, "Ready to get started?"),
                                    createVNode("p", { class: "text-subtitle-1 white--text text-opacity-high mb-8" }, " Join the community already using DevUnity for their projects. "),
                                    createVNode(VBtn, {
                                      "x-large": "",
                                      color: "info",
                                      variant: "tonal",
                                      elevation: "2",
                                      class: "px-8",
                                      to: "/signup"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create free account ")
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
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h2", { class: "text-h3 font-weight-bold white--text mb-4" }, "Ready to get started?"),
                                  createVNode("p", { class: "text-subtitle-1 white--text text-opacity-high mb-8" }, " Join the community already using DevUnity for their projects. "),
                                  createVNode(VBtn, {
                                    "x-large": "",
                                    color: "info",
                                    variant: "tonal",
                                    elevation: "2",
                                    class: "px-8",
                                    to: "/signup"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Create free account ")
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
                  _push3(`</section>`);
                } else {
                  return [
                    createVNode("section", {
                      id: "hero",
                      class: "hero-section"
                    }, [
                      createVNode(VContainer, { class: "py-16" }, {
                        default: withCtx(() => [
                          createVNode(VRow, { class: "align-center justify-center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "6",
                                class: "text-center text-md-left"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VResponsive, null, {
                                    default: withCtx(() => [
                                      createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                      createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                      createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                        createVNode(VBtn, {
                                          "x-large": "",
                                          color: "primary",
                                          variant: "tonal",
                                          class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                          to: "/signup"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Get started ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          "x-large": "",
                                          outlined: "",
                                          color: "info",
                                          variant: "tonal",
                                          class: "px-6",
                                          href: "#features"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Learn more "),
                                            createVNode(VIcon, { right: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-arrow-right")
                                              ]),
                                              _: 1
                                            })
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
                              createVNode(VCol, {
                                cols: "12",
                                md: "6",
                                class: "d-flex justify-center mt-8 mt-md-0"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VImg, {
                                    src: _imports_1,
                                    "max-width": "90%",
                                    contain: "",
                                    class: "hero-image rounded-xl elevation-10",
                                    alt: "Devroid Platform"
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
                    createVNode("section", { class: "stats-section py-8" }, [
                      createVNode(VContainer, null, {
                        default: withCtx(() => [
                          createVNode(VRow, { class: "align-center justify-center" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                                return createVNode(VCol, {
                                  key: i,
                                  cols: "6",
                                  sm: "3",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "stat-value text-h3 font-weight-bold primary--text mb-1" }, toDisplayString(stat.value), 1),
                                    createVNode("div", { class: "stat-label text-subtitle-2 text-medium-emphasis" }, toDisplayString(stat.label), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("section", {
                      id: "features",
                      class: "py-16"
                    }, [
                      createVNode(VContainer, null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center mb-12" }, [
                            createVNode("span", { class: "section-subtitle" }, "POWERFUL TOOLS"),
                            createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "Features That Boost Your Productivity"),
                            createVNode("p", {
                              class: "text-subtitle-1 text-medium-emphasis mx-auto",
                              style: { "max-width": "700px" }
                            }, " DevUnity combines all the tools you need to develop modern web applications in one intuitive platform. ")
                          ]),
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(features, (feature, index) => {
                                return createVNode(VCol, {
                                  key: index,
                                  cols: "12",
                                  md: "4",
                                  class: "mb-8"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: "feature-card h-100 rounded-lg",
                                      flat: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardText, { class: "pa-6" }, {
                                          default: withCtx(() => [
                                            createVNode(VAvatar, {
                                              color: feature.color,
                                              size: "56",
                                              class: "mb-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  dark: "",
                                                  size: "32"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(feature.icon), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"]),
                                            createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                            createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("section", { class: "py-16" }, [
                      createVNode(VContainer, null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-center mb-12" }, [
                            createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "How It Works"),
                            createVNode("p", {
                              class: "text-subtitle-1 text-medium-emphasis mx-auto",
                              style: { "max-width": "700px" }
                            }, " Three simple steps to start using Devroid and transform your development workflow. ")
                          ]),
                          createVNode(VRow, {
                            justify: "center",
                            class: "mt-8"
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(steps, (step, i) => {
                                return createVNode(VCol, {
                                  key: i,
                                  cols: "12",
                                  md: "4",
                                  class: "px-4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: ["h-100 rounded-xl", `border-${step.color}`],
                                      elevation: "3",
                                      style: { "border-top": "#00658b 4px solid" }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VAvatar, {
                                              color: step.color,
                                              size: "56",
                                              class: "mb-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(step.title), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardText, { class: "text-body-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(step.description), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VCardActions, { class: "pa-4" }, {
                                          default: withCtx(() => [
                                            createVNode(VBtn, {
                                              color: step.color,
                                              variant: "text",
                                              class: "text-none",
                                              to: step.link
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Learn more "),
                                                createVNode(VIcon, { right: "" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-arrow-right")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 2
                                            }, 1032, ["color", "to"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["class"])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 64))
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "d-flex justify-center mt-12" }, [
                            createVNode(VBtn, {
                              size: "large",
                              color: "info",
                              variant: "tonal",
                              class: "px-8 rounded-pill",
                              elevation: "2",
                              to: "/signup",
                              nuxt: ""
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Get Started Now "),
                                createVNode(VIcon, { end: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-rocket-launch-outline")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("section", {
                      id: "pricing",
                      class: "py-16"
                    }, [
                      createVNode(unref(Pricing))
                    ]),
                    createVNode("section", {
                      id: "faq",
                      class: "py-16"
                    }, [
                      createVNode(unref(Faq))
                    ]),
                    createVNode("section", { class: "py-16 primary" }, [
                      createVNode(VContainer, null, {
                        default: withCtx(() => [
                          createVNode(VRow, { justify: "center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "8",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h2", { class: "text-h3 font-weight-bold white--text mb-4" }, "Ready to get started?"),
                                  createVNode("p", { class: "text-subtitle-1 white--text text-opacity-high mb-8" }, " Join the community already using DevUnity for their projects. "),
                                  createVNode(VBtn, {
                                    "x-large": "",
                                    color: "info",
                                    variant: "tonal",
                                    elevation: "2",
                                    class: "px-8",
                                    to: "/signup"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Create free account ")
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
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<footer class="py-8" data-v-c6c0e7a8${_scopeId}>`);
            _push2(ssrRenderComponent(VContainer, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "5",
                          lg: "5",
                          class: "mb-6 mb-md-0"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex align-center mb-4" data-v-c6c0e7a8${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="180" data-v-c6c0e7a8${_scopeId4}></div><p class="text-body-2 text-medium-emphasis mb-4" data-v-c6c0e7a8${_scopeId4}> The all-in-one platform for developers who want to create, manage and optimize their web projects. </p><div class="newsletter-signup mb-6" data-v-c6c0e7a8${_scopeId4}><div class="d-flex" data-v-c6c0e7a8${_scopeId4}>`);
                              _push5(ssrRenderComponent(VTextField, {
                                modelValue: email.value,
                                "onUpdate:modelValue": ($event) => email.value = $event,
                                density: "compact",
                                placeholder: "Your email address",
                                variant: "outlined",
                                "hide-details": "",
                                class: "mr-2",
                                "prepend-inner-icon": "mdi-email-outline"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "info",
                                variant: "tonal",
                                class: "ml-n1",
                                loading: loading.value,
                                onClick: submitEmail
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Subscribe `);
                                  } else {
                                    return [
                                      createTextVNode(" Subscribe ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><p class="text-caption text-medium-emphasis mt-1" data-v-c6c0e7a8${_scopeId4}> Receive our latest news and development tips </p></div><div class="d-flex" data-v-c6c0e7a8${_scopeId4}>`);
                              _push5(ssrRenderComponent(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://twitter.com",
                                target: "_blank"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-twitter`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-twitter")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-twitter")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://github.com",
                                target: "_blank"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-github`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-github")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-github")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://linkedin.com",
                                target: "_blank"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-linkedin`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-linkedin")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-linkedin")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "d-flex align-center mb-4" }, [
                                  createVNode("img", {
                                    src: _imports_0,
                                    alt: "DevUnity title",
                                    width: "180"
                                  })
                                ]),
                                createVNode("p", { class: "text-body-2 text-medium-emphasis mb-4" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects. "),
                                createVNode("div", { class: "newsletter-signup mb-6" }, [
                                  createVNode("div", { class: "d-flex" }, [
                                    createVNode(VTextField, {
                                      modelValue: email.value,
                                      "onUpdate:modelValue": ($event) => email.value = $event,
                                      density: "compact",
                                      placeholder: "Your email address",
                                      variant: "outlined",
                                      "hide-details": "",
                                      class: "mr-2",
                                      "prepend-inner-icon": "mdi-email-outline"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VBtn, {
                                      color: "info",
                                      variant: "tonal",
                                      class: "ml-n1",
                                      loading: loading.value,
                                      onClick: submitEmail
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Subscribe ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
                                  ]),
                                  createVNode("p", { class: "text-caption text-medium-emphasis mt-1" }, " Receive our latest news and development tips ")
                                ]),
                                createVNode("div", { class: "d-flex" }, [
                                  createVNode(VBtn, {
                                    icon: "",
                                    variant: "text",
                                    class: "mr-3",
                                    href: "https://twitter.com",
                                    target: "_blank"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-twitter")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    icon: "",
                                    variant: "text",
                                    class: "mr-3",
                                    href: "https://github.com",
                                    target: "_blank"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-github")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    icon: "",
                                    variant: "text",
                                    class: "mr-3",
                                    href: "https://linkedin.com",
                                    target: "_blank"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-linkedin")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "7",
                          lg: "7"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VRow, { class: "footer-columns-container" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(footerColumns, (column, index) => {
                                      _push6(ssrRenderComponent(VCol, {
                                        key: index,
                                        cols: "6",
                                        md: "4",
                                        class: "footer-column px-4"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<h4 class="text-subtitle-1 font-weight-bold mb-4" data-v-c6c0e7a8${_scopeId6}>${ssrInterpolate(column.title)}</h4><div class="footer-links" data-v-c6c0e7a8${_scopeId6}><!--[-->`);
                                            ssrRenderList(column.links, (link, linkIndex) => {
                                              _push7(ssrRenderComponent(_component_NuxtLink, {
                                                key: linkIndex,
                                                to: link.to,
                                                class: "footer-link d-block mb-3"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(link.title)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(link.title), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]--></div>`);
                                          } else {
                                            return [
                                              createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                              createVNode("div", { class: "footer-links" }, [
                                                (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                                  return openBlock(), createBlock(_component_NuxtLink, {
                                                    key: linkIndex,
                                                    to: link.to,
                                                    class: "footer-link d-block mb-3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(link.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"]);
                                                }), 128))
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(), createBlock(Fragment, null, renderList(footerColumns, (column, index) => {
                                        return createVNode(VCol, {
                                          key: index,
                                          cols: "6",
                                          md: "4",
                                          class: "footer-column px-4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                            createVNode("div", { class: "footer-links" }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                                return openBlock(), createBlock(_component_NuxtLink, {
                                                  key: linkIndex,
                                                  to: link.to,
                                                  class: "footer-link d-block mb-3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(link.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"]);
                                              }), 128))
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 64))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VRow, { class: "footer-columns-container" }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock(Fragment, null, renderList(footerColumns, (column, index) => {
                                      return createVNode(VCol, {
                                        key: index,
                                        cols: "6",
                                        md: "4",
                                        class: "footer-column px-4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                          createVNode("div", { class: "footer-links" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                              return openBlock(), createBlock(_component_NuxtLink, {
                                                key: linkIndex,
                                                to: link.to,
                                                class: "footer-link d-block mb-3"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(link.title), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["to"]);
                                            }), 128))
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 64))
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
                            md: "5",
                            lg: "5",
                            class: "mb-6 mb-md-0"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center mb-4" }, [
                                createVNode("img", {
                                  src: _imports_0,
                                  alt: "DevUnity title",
                                  width: "180"
                                })
                              ]),
                              createVNode("p", { class: "text-body-2 text-medium-emphasis mb-4" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects. "),
                              createVNode("div", { class: "newsletter-signup mb-6" }, [
                                createVNode("div", { class: "d-flex" }, [
                                  createVNode(VTextField, {
                                    modelValue: email.value,
                                    "onUpdate:modelValue": ($event) => email.value = $event,
                                    density: "compact",
                                    placeholder: "Your email address",
                                    variant: "outlined",
                                    "hide-details": "",
                                    class: "mr-2",
                                    "prepend-inner-icon": "mdi-email-outline"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VBtn, {
                                    color: "info",
                                    variant: "tonal",
                                    class: "ml-n1",
                                    loading: loading.value,
                                    onClick: submitEmail
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Subscribe ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
                                ]),
                                createVNode("p", { class: "text-caption text-medium-emphasis mt-1" }, " Receive our latest news and development tips ")
                              ]),
                              createVNode("div", { class: "d-flex" }, [
                                createVNode(VBtn, {
                                  icon: "",
                                  variant: "text",
                                  class: "mr-3",
                                  href: "https://twitter.com",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-twitter")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VBtn, {
                                  icon: "",
                                  variant: "text",
                                  class: "mr-3",
                                  href: "https://github.com",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-github")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VBtn, {
                                  icon: "",
                                  variant: "text",
                                  class: "mr-3",
                                  href: "https://linkedin.com",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-linkedin")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "7",
                            lg: "7"
                          }, {
                            default: withCtx(() => [
                              createVNode(VRow, { class: "footer-columns-container" }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock(Fragment, null, renderList(footerColumns, (column, index) => {
                                    return createVNode(VCol, {
                                      key: index,
                                      cols: "6",
                                      md: "4",
                                      class: "footer-column px-4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                        createVNode("div", { class: "footer-links" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                            return openBlock(), createBlock(_component_NuxtLink, {
                                              key: linkIndex,
                                              to: link.to,
                                              class: "footer-link d-block mb-3"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(link.title), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]);
                                          }), 128))
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 64))
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
                  _push3(ssrRenderComponent(VDivider, { class: "my-6" }, null, _parent3, _scopeId2));
                  _push3(`<div class="d-flex flex-column flex-sm-row justify-space-between align-center" data-v-c6c0e7a8${_scopeId2}><div class="text-body-2 text-medium-emphasis mb-3 mb-sm-0" data-v-c6c0e7a8${_scopeId2}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </div><div class="d-flex align-center" data-v-c6c0e7a8${_scopeId2}><a href="mailto:contact@devunity.com" class="text-body-2 text-decoration-none text-medium-emphasis" data-v-c6c0e7a8${_scopeId2}>contact@devunity.com</a></div></div>`);
                } else {
                  return [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "5",
                          lg: "5",
                          class: "mb-6 mb-md-0"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex align-center mb-4" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "DevUnity title",
                                width: "180"
                              })
                            ]),
                            createVNode("p", { class: "text-body-2 text-medium-emphasis mb-4" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects. "),
                            createVNode("div", { class: "newsletter-signup mb-6" }, [
                              createVNode("div", { class: "d-flex" }, [
                                createVNode(VTextField, {
                                  modelValue: email.value,
                                  "onUpdate:modelValue": ($event) => email.value = $event,
                                  density: "compact",
                                  placeholder: "Your email address",
                                  variant: "outlined",
                                  "hide-details": "",
                                  class: "mr-2",
                                  "prepend-inner-icon": "mdi-email-outline"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VBtn, {
                                  color: "info",
                                  variant: "tonal",
                                  class: "ml-n1",
                                  loading: loading.value,
                                  onClick: submitEmail
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Subscribe ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              createVNode("p", { class: "text-caption text-medium-emphasis mt-1" }, " Receive our latest news and development tips ")
                            ]),
                            createVNode("div", { class: "d-flex" }, [
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://twitter.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-twitter")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://github.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-github")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://linkedin.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-linkedin")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "7",
                          lg: "7"
                        }, {
                          default: withCtx(() => [
                            createVNode(VRow, { class: "footer-columns-container" }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(footerColumns, (column, index) => {
                                  return createVNode(VCol, {
                                    key: index,
                                    cols: "6",
                                    md: "4",
                                    class: "footer-column px-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                      createVNode("div", { class: "footer-links" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                          return openBlock(), createBlock(_component_NuxtLink, {
                                            key: linkIndex,
                                            to: link.to,
                                            class: "footer-link d-block mb-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(link.title), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]);
                                        }), 128))
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VDivider, { class: "my-6" }),
                    createVNode("div", { class: "d-flex flex-column flex-sm-row justify-space-between align-center" }, [
                      createVNode("div", { class: "text-body-2 text-medium-emphasis mb-3 mb-sm-0" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1),
                      createVNode("div", { class: "d-flex align-center" }, [
                        createVNode("a", {
                          href: "mailto:contact@devunity.com",
                          class: "text-body-2 text-decoration-none text-medium-emphasis"
                        }, "contact@devunity.com")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</footer>`);
            _push2(ssrRenderComponent(Snackbar, {
              modelValue: showSnackbar.value,
              "onUpdate:modelValue": ($event) => showSnackbar.value = $event,
              color: snackbarColor.value,
              text: snackbarText.value,
              timeout: snackbarTimeout.value
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(VAppBar, {
                app: "",
                elevation: 2,
                color: "surface",
                class: "px-0 nav-bar",
                modelValue: showAppBar.value,
                "onUpdate:modelValue": ($event) => showAppBar.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(VContainer, { class: "d-flex align-center py-0 my-0" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, {
                        to: "/",
                        class: "text-decoration-none"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex align-center brand-container" }, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "DevUnity title",
                              width: "150",
                              class: "logo-image"
                            }),
                            createVNode("div", { class: "brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left" }, [
                              createVNode("span", { class: "text-caption font-weight-medium text-gradient" }, "PROPULSE YOUR CODE")
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(VSpacer),
                      _ctx.$vuetify.display.smAndUp ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "d-flex align-center custom-nav-menu"
                      }, [
                        createVNode("div", { class: "nav-links-wrapper" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                            return createVNode(VBtn, {
                              key: item.href,
                              class: ["nav-btn custom-btn", { "active-nav-btn": activeSection.value === item.href.substring(1) }],
                              href: item.href,
                              variant: "text"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "nav-text" }, toDisplayString(item.title), 1),
                                createVNode("span", { class: "nav-btn-background" })
                              ]),
                              _: 2
                            }, 1032, ["href", "class"]);
                          }), 64))
                        ]),
                        createVNode("div", { class: "auth-buttons ml-6" }, [
                          createVNode(VBtn, {
                            color: "primary",
                            class: "login-btn",
                            to: "/login",
                            variant: "tonal",
                            rounded: "rounded-xl",
                            "prepend-icon": "mdi-login"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Login ")
                            ]),
                            _: 1
                          })
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "d-flex align-center"
                      }, [
                        createVNode(VBtn, {
                          color: "primary",
                          class: "mr-2",
                          to: "/login",
                          size: "small",
                          rounded: "pill"
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, {
                              size: "small",
                              class: "mr-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-login")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Login ")
                          ]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          icon: "",
                          onClick: ($event) => drawer.value = !drawer.value,
                          class: "menu-toggle-btn",
                          "aria-label": "Toggle navigation menu"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", {
                              class: ["hamburger-icon", { "active": drawer.value }]
                            }, [
                              createVNode("span"),
                              createVNode("span"),
                              createVNode("span")
                            ], 2)
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VNavigationDrawer, {
                modelValue: drawer.value,
                "onUpdate:modelValue": ($event) => drawer.value = $event,
                location: "right",
                temporary: "",
                class: "mobile-nav-drawer d-md-none pa-6"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "drawer-header mb-8 d-flex justify-space-between align-center" }, [
                    createVNode("img", {
                      src: _imports_0,
                      alt: "DevUnity title",
                      width: "120"
                    }),
                    createVNode(VBtn, {
                      icon: "",
                      variant: "text",
                      onClick: ($event) => drawer.value = false
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
                  createVNode("div", { class: "mobile-nav-links" }, [
                    createVNode(VList, { nav: "" }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                          return createVNode(VListItem, {
                            key: item.href,
                            href: item.href,
                            onClick: ($event) => drawer.value = false,
                            class: "mobile-nav-item mb-3",
                            rounded: "lg"
                          }, {
                            prepend: withCtx(() => [
                              createVNode(VIcon, {
                                class: "mr-2",
                                icon: item.icon,
                                color: "primary"
                              }, null, 8, ["icon"])
                            ]),
                            default: withCtx(() => [
                              createVNode(VListItemTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.title), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1032, ["href", "onClick"]);
                        }), 64))
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "drawer-footer mt-auto pt-6" }, [
                    createVNode(VBtn, {
                      block: "",
                      color: "primary",
                      to: "/signup",
                      class: "mb-4",
                      size: "large",
                      rounded: "pill"
                    }, {
                      default: withCtx(() => [
                        createVNode(VIcon, { start: "" }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-rocket-launch-outline")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Get started ")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-caption text-center text-medium-emphasis" }, "Join our community of developers and propulse your web projects to new horizons.")
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VMain, { class: "main-content" }, {
                default: withCtx(() => [
                  createVNode("section", {
                    id: "hero",
                    class: "hero-section"
                  }, [
                    createVNode(VContainer, { class: "py-16" }, {
                      default: withCtx(() => [
                        createVNode(VRow, { class: "align-center justify-center" }, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "6",
                              class: "text-center text-md-left"
                            }, {
                              default: withCtx(() => [
                                createVNode(VResponsive, null, {
                                  default: withCtx(() => [
                                    createVNode("h1", { class: "text-h2 font-weight-bold mb-4" }, "Develop faster with DevUnity"),
                                    createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects with unparalleled speed and efficiency. "),
                                    createVNode("div", { class: "d-flex flex-column flex-sm-row justify-center justify-md-start" }, [
                                      createVNode(VBtn, {
                                        "x-large": "",
                                        color: "primary",
                                        variant: "tonal",
                                        class: "px-6 mb-3 mb-sm-0 mr-sm-4",
                                        to: "/signup"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Get started ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        "x-large": "",
                                        outlined: "",
                                        color: "info",
                                        variant: "tonal",
                                        class: "px-6",
                                        href: "#features"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Learn more "),
                                          createVNode(VIcon, { right: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-arrow-right")
                                            ]),
                                            _: 1
                                          })
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
                            createVNode(VCol, {
                              cols: "12",
                              md: "6",
                              class: "d-flex justify-center mt-8 mt-md-0"
                            }, {
                              default: withCtx(() => [
                                createVNode(VImg, {
                                  src: _imports_1,
                                  "max-width": "90%",
                                  contain: "",
                                  class: "hero-image rounded-xl elevation-10",
                                  alt: "Devroid Platform"
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
                  createVNode("section", { class: "stats-section py-8" }, [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode(VRow, { class: "align-center justify-center" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(stats, (stat, i) => {
                              return createVNode(VCol, {
                                key: i,
                                cols: "6",
                                sm: "3",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "stat-value text-h3 font-weight-bold primary--text mb-1" }, toDisplayString(stat.value), 1),
                                  createVNode("div", { class: "stat-label text-subtitle-2 text-medium-emphasis" }, toDisplayString(stat.label), 1)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("section", {
                    id: "features",
                    class: "py-16"
                  }, [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-center mb-12" }, [
                          createVNode("span", { class: "section-subtitle" }, "POWERFUL TOOLS"),
                          createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "Features That Boost Your Productivity"),
                          createVNode("p", {
                            class: "text-subtitle-1 text-medium-emphasis mx-auto",
                            style: { "max-width": "700px" }
                          }, " DevUnity combines all the tools you need to develop modern web applications in one intuitive platform. ")
                        ]),
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(features, (feature, index) => {
                              return createVNode(VCol, {
                                key: index,
                                cols: "12",
                                md: "4",
                                class: "mb-8"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCard, {
                                    class: "feature-card h-100 rounded-lg",
                                    flat: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCardText, { class: "pa-6" }, {
                                        default: withCtx(() => [
                                          createVNode(VAvatar, {
                                            color: feature.color,
                                            size: "56",
                                            class: "mb-4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                dark: "",
                                                size: "32"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(feature.icon), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          createVNode("h3", { class: "text-h5 font-weight-bold mb-3" }, toDisplayString(feature.title), 1),
                                          createVNode("p", { class: "text-body-1 text-medium-emphasis" }, toDisplayString(feature.description), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("section", { class: "py-16" }, [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-center mb-12" }, [
                          createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "How It Works"),
                          createVNode("p", {
                            class: "text-subtitle-1 text-medium-emphasis mx-auto",
                            style: { "max-width": "700px" }
                          }, " Three simple steps to start using Devroid and transform your development workflow. ")
                        ]),
                        createVNode(VRow, {
                          justify: "center",
                          class: "mt-8"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(steps, (step, i) => {
                              return createVNode(VCol, {
                                key: i,
                                cols: "12",
                                md: "4",
                                class: "px-4"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCard, {
                                    class: ["h-100 rounded-xl", `border-${step.color}`],
                                    elevation: "3",
                                    style: { "border-top": "#00658b 4px solid" }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCardItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VAvatar, {
                                            color: step.color,
                                            size: "56",
                                            class: "mb-4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("span", { class: "text-h5 font-weight-bold white--text" }, toDisplayString(i + 1), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VCardTitle, { class: "text-h5 font-weight-bold" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(step.title), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VCardText, { class: "text-body-1" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(step.description), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VCardActions, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VBtn, {
                                            color: step.color,
                                            variant: "text",
                                            class: "text-none",
                                            to: step.link
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Learn more "),
                                              createVNode(VIcon, { right: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-arrow-right")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 2
                                          }, 1032, ["color", "to"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["class"])
                                ]),
                                _: 2
                              }, 1024);
                            }), 64))
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "d-flex justify-center mt-12" }, [
                          createVNode(VBtn, {
                            size: "large",
                            color: "info",
                            variant: "tonal",
                            class: "px-8 rounded-pill",
                            elevation: "2",
                            to: "/signup",
                            nuxt: ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Get Started Now "),
                              createVNode(VIcon, { end: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-rocket-launch-outline")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("section", {
                    id: "pricing",
                    class: "py-16"
                  }, [
                    createVNode(unref(Pricing))
                  ]),
                  createVNode("section", {
                    id: "faq",
                    class: "py-16"
                  }, [
                    createVNode(unref(Faq))
                  ]),
                  createVNode("section", { class: "py-16 primary" }, [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode(VRow, { justify: "center" }, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "8",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                createVNode("h2", { class: "text-h3 font-weight-bold white--text mb-4" }, "Ready to get started?"),
                                createVNode("p", { class: "text-subtitle-1 white--text text-opacity-high mb-8" }, " Join the community already using DevUnity for their projects. "),
                                createVNode(VBtn, {
                                  "x-large": "",
                                  color: "info",
                                  variant: "tonal",
                                  elevation: "2",
                                  class: "px-8",
                                  to: "/signup"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create free account ")
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
                  ])
                ]),
                _: 1
              }),
              createVNode("footer", { class: "py-8" }, [
                createVNode(VContainer, null, {
                  default: withCtx(() => [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "5",
                          lg: "5",
                          class: "mb-6 mb-md-0"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex align-center mb-4" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "DevUnity title",
                                width: "180"
                              })
                            ]),
                            createVNode("p", { class: "text-body-2 text-medium-emphasis mb-4" }, " The all-in-one platform for developers who want to create, manage and optimize their web projects. "),
                            createVNode("div", { class: "newsletter-signup mb-6" }, [
                              createVNode("div", { class: "d-flex" }, [
                                createVNode(VTextField, {
                                  modelValue: email.value,
                                  "onUpdate:modelValue": ($event) => email.value = $event,
                                  density: "compact",
                                  placeholder: "Your email address",
                                  variant: "outlined",
                                  "hide-details": "",
                                  class: "mr-2",
                                  "prepend-inner-icon": "mdi-email-outline"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VBtn, {
                                  color: "info",
                                  variant: "tonal",
                                  class: "ml-n1",
                                  loading: loading.value,
                                  onClick: submitEmail
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Subscribe ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ]),
                              createVNode("p", { class: "text-caption text-medium-emphasis mt-1" }, " Receive our latest news and development tips ")
                            ]),
                            createVNode("div", { class: "d-flex" }, [
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://twitter.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-twitter")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://github.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-github")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                icon: "",
                                variant: "text",
                                class: "mr-3",
                                href: "https://linkedin.com",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-linkedin")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "7",
                          lg: "7"
                        }, {
                          default: withCtx(() => [
                            createVNode(VRow, { class: "footer-columns-container" }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(footerColumns, (column, index) => {
                                  return createVNode(VCol, {
                                    key: index,
                                    cols: "6",
                                    md: "4",
                                    class: "footer-column px-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h4", { class: "text-subtitle-1 font-weight-bold mb-4" }, toDisplayString(column.title), 1),
                                      createVNode("div", { class: "footer-links" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(column.links, (link, linkIndex) => {
                                          return openBlock(), createBlock(_component_NuxtLink, {
                                            key: linkIndex,
                                            to: link.to,
                                            class: "footer-link d-block mb-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(link.title), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]);
                                        }), 128))
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 64))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VDivider, { class: "my-6" }),
                    createVNode("div", { class: "d-flex flex-column flex-sm-row justify-space-between align-center" }, [
                      createVNode("div", { class: "text-body-2 text-medium-emphasis mb-3 mb-sm-0" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1),
                      createVNode("div", { class: "d-flex align-center" }, [
                        createVNode("a", {
                          href: "mailto:contact@devunity.com",
                          class: "text-body-2 text-decoration-none text-medium-emphasis"
                        }, "contact@devunity.com")
                      ])
                    ])
                  ]),
                  _: 1
                })
              ]),
              createVNode(Snackbar, {
                modelValue: showSnackbar.value,
                "onUpdate:modelValue": ($event) => showSnackbar.value = $event,
                color: snackbarColor.value,
                text: snackbarText.value,
                timeout: snackbarTimeout.value
              }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "text", "timeout"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c6c0e7a8"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
