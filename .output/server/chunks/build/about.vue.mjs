import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public.mjs';
import { u as useHead } from './v3.mjs';
import { V as VApp, d as VSpacer, e as VBtn, f as VCard, g as VIcon, h as VDivider, i as VAvatar, _ as _export_sfc } from './server.mjs';
import { V as VAppBar } from './VAppBar.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VFooter } from './VFooter.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'pinia-plugin-persistedstate';
import './VToolbar.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "About - DevUnity",
      meta: [
        { name: "description", content: "Discover the mission and values behind DevUnity, the all-in-one platform for web developers." },
        { name: "keywords", content: "DevUnity, web development, all-in-one platform, web applications, web application platform, web application development tools, web application development framework, web application development platform" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "About - DevUnity" },
        { name: "og:description", content: "Discover the mission and values behind DevUnity, the all-in-one platform for web developers." },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const companyValues = [
      {
        title: "Innovation",
        description: "We are constantly looking for new ways to improve our platform and offer more value to our users.",
        icon: "mdi-lightbulb-on",
        color: "info"
      },
      {
        title: "Simplicity",
        description: "We believe that the best tools are those that are easy to use, while being powerful and flexible.",
        icon: "mdi-leaf",
        color: "success"
      },
      {
        title: "Excellence",
        description: "We strive to provide tools of the highest quality, reliable and performant for our users.",
        icon: "mdi-trophy",
        color: "warning"
      },
      {
        title: "Community",
        description: "We value collaboration and mutual support within our developer community.",
        icon: "mdi-account-group",
        color: "primary"
      }
    ];
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
                              _push5(`<div class="d-flex align-center" data-v-f83c144b${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" data-v-f83c144b${_scopeId4}></div>`);
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
                  _push3(`<div class="about-hero py-16" data-v-f83c144b${_scopeId2}>`);
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, { justify: "center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "10",
                                lg: "8",
                                class: "text-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h1 class="text-h2 font-weight-bold mb-4 text-white" data-v-f83c144b${_scopeId5}>About DevUnity</h1>`);
                                  } else {
                                    return [
                                      createVNode("h1", { class: "text-h2 font-weight-bold mb-4 text-white" }, "About DevUnity")
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
                                  lg: "8",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h1", { class: "text-h2 font-weight-bold mb-4 text-white" }, "About DevUnity")
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
                                lg: "8",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h1", { class: "text-h2 font-weight-bold mb-4 text-white" }, "About DevUnity")
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
                  _push3(`</div>`);
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
                                    _push6(ssrRenderComponent(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<section class="mb-12" data-v-f83c144b${_scopeId6}><h2 class="text-h4 font-weight-bold mb-6 primary--text" data-v-f83c144b${_scopeId6}>Our Mission</h2><p class="text-body-1 mb-4" data-v-f83c144b${_scopeId6}> At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. </p><p class="text-body-1 mb-4" data-v-f83c144b${_scopeId6}> We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer&#39;s work. </p><div class="quote-block my-8 pa-8 rounded-lg" data-v-f83c144b${_scopeId6}>`);
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "42",
                                            color: "primary",
                                            class: "mb-4"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-format-quote-open`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-format-quote-open")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`<p class="text-h5 font-italic mb-4" data-v-f83c144b${_scopeId6}> &quot;Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools.&quot; </p><p class="text-subtitle-1 font-weight-bold" data-v-f83c144b${_scopeId6}>— Nûr Djedidi, Founder</p></div></section>`);
                                          _push7(ssrRenderComponent(VDivider, { class: "mb-12" }, null, _parent7, _scopeId6));
                                          _push7(`<section class="mb-12" data-v-f83c144b${_scopeId6}><h2 class="text-h4 font-weight-bold mb-6 primary--text" data-v-f83c144b${_scopeId6}>Our Values</h2>`);
                                          _push7(ssrRenderComponent(VRow, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(companyValues, (value, index) => {
                                                  _push8(ssrRenderComponent(VCol, {
                                                    cols: "12",
                                                    sm: "6",
                                                    key: index
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VCard, {
                                                          flat: "",
                                                          class: "value-card pa-6 h-100"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<div class="d-flex align-center mb-4" data-v-f83c144b${_scopeId9}>`);
                                                              _push10(ssrRenderComponent(VAvatar, {
                                                                color: value.color,
                                                                size: "56",
                                                                class: "mr-4"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      dark: "",
                                                                      size: "28"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(value.icon)}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(value.icon), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        dark: "",
                                                                        size: "28"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(value.icon), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<h3 class="text-h5 font-weight-bold" data-v-f83c144b${_scopeId9}>${ssrInterpolate(value.title)}</h3></div><p class="text-body-1" data-v-f83c144b${_scopeId9}>${ssrInterpolate(value.description)}</p>`);
                                                            } else {
                                                              return [
                                                                createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                                  createVNode(VAvatar, {
                                                                    color: value.color,
                                                                    size: "56",
                                                                    class: "mr-4"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, {
                                                                        dark: "",
                                                                        size: "28"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(value.icon), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"]),
                                                                  createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                                ]),
                                                                createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VCard, {
                                                            flat: "",
                                                            class: "value-card pa-6 h-100"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                                createVNode(VAvatar, {
                                                                  color: value.color,
                                                                  size: "56",
                                                                  class: "mr-4"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      dark: "",
                                                                      size: "28"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(value.icon), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                              ]),
                                                              createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                                    return createVNode(VCol, {
                                                      cols: "12",
                                                      sm: "6",
                                                      key: index
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          flat: "",
                                                          class: "value-card pa-6 h-100"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                              createVNode(VAvatar, {
                                                                color: value.color,
                                                                size: "56",
                                                                class: "mr-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    dark: "",
                                                                    size: "28"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(value.icon), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                            ]),
                                                            createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                          }, _parent7, _scopeId6));
                                          _push7(`</section>`);
                                          _push7(ssrRenderComponent(VDivider, { class: "mb-12" }, null, _parent7, _scopeId6));
                                          _push7(`<section data-v-f83c144b${_scopeId6}><h2 class="text-h4 font-weight-bold mb-6 primary--text" data-v-f83c144b${_scopeId6}>Get in Touch</h2><p class="text-body-1 mb-6" data-v-f83c144b${_scopeId6}> Have questions about DevUnity or want to learn more about our company? Don&#39;t hesitate to reach out to us. </p>`);
                                          _push7(ssrRenderComponent(VBtn, {
                                            color: "primary",
                                            to: "/contact",
                                            size: "large",
                                            class: "px-8 py-3 rounded-pill",
                                            elevation: "2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Contact Us `);
                                                _push8(ssrRenderComponent(VIcon, { end: "" }, {
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
                                                  createTextVNode(" Contact Us "),
                                                  createVNode(VIcon, { end: "" }, {
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
                                          _push7(`</section>`);
                                        } else {
                                          return [
                                            createVNode("section", { class: "mb-12" }, [
                                              createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                              createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                              createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                              createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                                createVNode(VIcon, {
                                                  size: "42",
                                                  color: "primary",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-format-quote-open")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                                createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                              ])
                                            ]),
                                            createVNode(VDivider, { class: "mb-12" }),
                                            createVNode("section", { class: "mb-12" }, [
                                              createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                                    return createVNode(VCol, {
                                                      cols: "12",
                                                      sm: "6",
                                                      key: index
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          flat: "",
                                                          class: "value-card pa-6 h-100"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                              createVNode(VAvatar, {
                                                                color: value.color,
                                                                size: "56",
                                                                class: "mr-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    dark: "",
                                                                    size: "28"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(value.icon), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                            ]),
                                                            createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                            createVNode(VDivider, { class: "mb-12" }),
                                            createVNode("section", null, [
                                              createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                              createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                              createVNode(VBtn, {
                                                color: "primary",
                                                to: "/contact",
                                                size: "large",
                                                class: "px-8 py-3 rounded-pill",
                                                elevation: "2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Contact Us "),
                                                  createVNode(VIcon, { end: "" }, {
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
                                      createVNode(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                        default: withCtx(() => [
                                          createVNode("section", { class: "mb-12" }, [
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                            createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                              createVNode(VIcon, {
                                                size: "42",
                                                color: "primary",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-format-quote-open")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                              createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                            ])
                                          ]),
                                          createVNode(VDivider, { class: "mb-12" }),
                                          createVNode("section", { class: "mb-12" }, [
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                                  return createVNode(VCol, {
                                                    cols: "12",
                                                    sm: "6",
                                                    key: index
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        flat: "",
                                                        class: "value-card pa-6 h-100"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                            createVNode(VAvatar, {
                                                              color: value.color,
                                                              size: "56",
                                                              class: "mr-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  dark: "",
                                                                  size: "28"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(value.icon), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                          ]),
                                                          createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                          createVNode(VDivider, { class: "mb-12" }),
                                          createVNode("section", null, [
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                            createVNode(VBtn, {
                                              color: "primary",
                                              to: "/contact",
                                              size: "large",
                                              class: "px-8 py-3 rounded-pill",
                                              elevation: "2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Contact Us "),
                                                createVNode(VIcon, { end: "" }, {
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
                            } else {
                              return [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "10",
                                  lg: "8"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                      default: withCtx(() => [
                                        createVNode("section", { class: "mb-12" }, [
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                          createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                            createVNode(VIcon, {
                                              size: "42",
                                              color: "primary",
                                              class: "mb-4"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-format-quote-open")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                            createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                          ])
                                        ]),
                                        createVNode(VDivider, { class: "mb-12" }),
                                        createVNode("section", { class: "mb-12" }, [
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                                return createVNode(VCol, {
                                                  cols: "12",
                                                  sm: "6",
                                                  key: index
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      flat: "",
                                                      class: "value-card pa-6 h-100"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                          createVNode(VAvatar, {
                                                            color: value.color,
                                                            size: "56",
                                                            class: "mr-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                dark: "",
                                                                size: "28"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(value.icon), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                        ]),
                                                        createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                        createVNode(VDivider, { class: "mb-12" }),
                                        createVNode("section", null, [
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                          createVNode(VBtn, {
                                            color: "primary",
                                            to: "/contact",
                                            size: "large",
                                            class: "px-8 py-3 rounded-pill",
                                            elevation: "2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Contact Us "),
                                              createVNode(VIcon, { end: "" }, {
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
                                  createVNode(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                    default: withCtx(() => [
                                      createVNode("section", { class: "mb-12" }, [
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                        createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                          createVNode(VIcon, {
                                            size: "42",
                                            color: "primary",
                                            class: "mb-4"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-format-quote-open")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                          createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                        ])
                                      ]),
                                      createVNode(VDivider, { class: "mb-12" }),
                                      createVNode("section", { class: "mb-12" }, [
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                              return createVNode(VCol, {
                                                cols: "12",
                                                sm: "6",
                                                key: index
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    flat: "",
                                                    class: "value-card pa-6 h-100"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                        createVNode(VAvatar, {
                                                          color: value.color,
                                                          size: "56",
                                                          class: "mr-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              dark: "",
                                                              size: "28"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(value.icon), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                      ]),
                                                      createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                      createVNode(VDivider, { class: "mb-12" }),
                                      createVNode("section", null, [
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          to: "/contact",
                                          size: "large",
                                          class: "px-8 py-3 rounded-pill",
                                          elevation: "2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Contact Us "),
                                            createVNode(VIcon, { end: "" }, {
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
                    createVNode("div", { class: "about-hero py-16" }, [
                      createVNode(VContainer, null, {
                        default: withCtx(() => [
                          createVNode(VRow, { justify: "center" }, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "10",
                                lg: "8",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("h1", { class: "text-h2 font-weight-bold mb-4 text-white" }, "About DevUnity")
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
                                createVNode(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                  default: withCtx(() => [
                                    createVNode("section", { class: "mb-12" }, [
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                      createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                        createVNode(VIcon, {
                                          size: "42",
                                          color: "primary",
                                          class: "mb-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-format-quote-open")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                        createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                      ])
                                    ]),
                                    createVNode(VDivider, { class: "mb-12" }),
                                    createVNode("section", { class: "mb-12" }, [
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                            return createVNode(VCol, {
                                              cols: "12",
                                              sm: "6",
                                              key: index
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  flat: "",
                                                  class: "value-card pa-6 h-100"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                      createVNode(VAvatar, {
                                                        color: value.color,
                                                        size: "56",
                                                        class: "mr-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            dark: "",
                                                            size: "28"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(value.icon), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                    ]),
                                                    createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                    createVNode(VDivider, { class: "mb-12" }),
                                    createVNode("section", null, [
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                      createVNode(VBtn, {
                                        color: "primary",
                                        to: "/contact",
                                        size: "large",
                                        class: "px-8 py-3 rounded-pill",
                                        elevation: "2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Contact Us "),
                                          createVNode(VIcon, { end: "" }, {
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
            _push2(ssrRenderComponent(VFooter, { class: "py-6 bg-surface" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex flex-column flex-md-row justify-space-between align-center" data-v-f83c144b${_scopeId3}><div class="mb-4 mb-md-0" data-v-f83c144b${_scopeId3}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="120" data-v-f83c144b${_scopeId3}></div><div class="text-body-2 text-medium-emphasis" data-v-f83c144b${_scopeId3}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex flex-column flex-md-row justify-space-between align-center" }, [
                            createVNode("div", { class: "mb-4 mb-md-0" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "DevUnity title",
                                width: "120"
                              })
                            ]),
                            createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
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
                        createVNode("div", { class: "d-flex flex-column flex-md-row justify-space-between align-center" }, [
                          createVNode("div", { class: "mb-4 mb-md-0" }, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "DevUnity title",
                              width: "120"
                            })
                          ]),
                          createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                        ])
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
                  createVNode("div", { class: "about-hero py-16" }, [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode(VRow, { justify: "center" }, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "10",
                              lg: "8",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                createVNode("h1", { class: "text-h2 font-weight-bold mb-4 text-white" }, "About DevUnity")
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
                              createVNode(VCard, { class: "pa-8 mb-8 rounded-xl elevation-3" }, {
                                default: withCtx(() => [
                                  createVNode("section", { class: "mb-12" }, [
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Mission"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " At DevUnity, our mission is to empower developers by providing them with the tools they need to create exceptional web applications, while reducing complexity and development time. "),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " We believe that web development should be accessible to everyone, from beginners to experts, and that the right tools can make all the difference in the quality and efficiency of a developer's work. "),
                                    createVNode("div", { class: "quote-block my-8 pa-8 rounded-lg" }, [
                                      createVNode(VIcon, {
                                        size: "42",
                                        color: "primary",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-format-quote-open")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-h5 font-italic mb-4" }, ' "Our vision is to create an ecosystem where every developer can easily transform their ideas into functional, beautiful, and high-performing web applications, without having to master a multitude of different tools." '),
                                      createVNode("p", { class: "text-subtitle-1 font-weight-bold" }, "— Nûr Djedidi, Founder")
                                    ])
                                  ]),
                                  createVNode(VDivider, { class: "mb-12" }),
                                  createVNode("section", { class: "mb-12" }, [
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Our Values"),
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(companyValues, (value, index) => {
                                          return createVNode(VCol, {
                                            cols: "12",
                                            sm: "6",
                                            key: index
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                flat: "",
                                                class: "value-card pa-6 h-100"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "d-flex align-center mb-4" }, [
                                                    createVNode(VAvatar, {
                                                      color: value.color,
                                                      size: "56",
                                                      class: "mr-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          dark: "",
                                                          size: "28"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(value.icon), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"]),
                                                    createVNode("h3", { class: "text-h5 font-weight-bold" }, toDisplayString(value.title), 1)
                                                  ]),
                                                  createVNode("p", { class: "text-body-1" }, toDisplayString(value.description), 1)
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
                                  createVNode(VDivider, { class: "mb-12" }),
                                  createVNode("section", null, [
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-6 primary--text" }, "Get in Touch"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " Have questions about DevUnity or want to learn more about our company? Don't hesitate to reach out to us. "),
                                    createVNode(VBtn, {
                                      color: "primary",
                                      to: "/contact",
                                      size: "large",
                                      class: "px-8 py-3 rounded-pill",
                                      elevation: "2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Contact Us "),
                                        createVNode(VIcon, { end: "" }, {
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
              createVNode(VFooter, { class: "py-6 bg-surface" }, {
                default: withCtx(() => [
                  createVNode(VContainer, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "d-flex flex-column flex-md-row justify-space-between align-center" }, [
                        createVNode("div", { class: "mb-4 mb-md-0" }, [
                          createVNode("img", {
                            src: _imports_0,
                            alt: "DevUnity title",
                            width: "120"
                          })
                        ]),
                        createVNode("div", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
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
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f83c144b"]]);

export { about as default };
//# sourceMappingURL=about.vue.mjs.map
