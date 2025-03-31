import { defineComponent, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VExpansionPanels, a as VExpansionPanel, b as VExpansionPanelTitle, c as VExpansionPanelText } from './VExpansionPanels.mjs';
import './server.mjs';
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
import 'vue-router';
import 'pinia-plugin-persistedstate';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    const faqItems = [
      {
        question: "What is DevUnity?",
        answer: "DevUnity is an all-in-one platform for developers who want to create, manage and optimize their web projects. It combines development tools, monitoring, SEO audit and much more."
      },
      {
        question: "Is there a freemium model?",
        answer: "Yes, you can access the application free of charge with paid premium extensions."
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time. If you cancel, you can continue using DevUnity forever."
      },
      {
        question: "Are there any limitations in the free plan?",
        answer: "The free plan allows you to create up to 5 personal snippets and use basic features. For unlimited usage and advanced features, we recommend upgrading to the lifetime access plan."
      },
      {
        question: "How does technical support work?",
        answer: "All users have access to community support. Premium Users benefit from priority support via email."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-center mb-12"${_scopeId}><h2 class="text-h3 font-weight-bold mb-3"${_scopeId}>Frequently Asked Questions</h2><p class="text-subtitle-1 text-medium-emphasis mx-auto" style="${ssrRenderStyle({ "max-width": "700px" })}"${_scopeId}> You have questions? We have answers. </p></div>`);
            _push2(ssrRenderComponent(VRow, { justify: "center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    md: "8"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VExpansionPanels, { variant: "accordion" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(faqItems, (item, i) => {
                                _push5(ssrRenderComponent(VExpansionPanel, { key: i }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(item.question)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(item.question), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VExpansionPanelText, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<p class="text-body-1 pt-2"${_scopeId6}>${ssrInterpolate(item.answer)}</p>`);
                                          } else {
                                            return [
                                              createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.question), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(VExpansionPanelText, null, {
                                          default: withCtx(() => [
                                            createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
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
                                (openBlock(), createBlock(Fragment, null, renderList(faqItems, (item, i) => {
                                  return createVNode(VExpansionPanel, { key: i }, {
                                    default: withCtx(() => [
                                      createVNode(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.question), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VExpansionPanelText, null, {
                                        default: withCtx(() => [
                                          createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
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
                          createVNode(VExpansionPanels, { variant: "accordion" }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(faqItems, (item, i) => {
                                return createVNode(VExpansionPanel, { key: i }, {
                                  default: withCtx(() => [
                                    createVNode(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.question), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(VExpansionPanelText, null, {
                                      default: withCtx(() => [
                                        createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
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
                } else {
                  return [
                    createVNode(VCol, {
                      cols: "12",
                      md: "8"
                    }, {
                      default: withCtx(() => [
                        createVNode(VExpansionPanels, { variant: "accordion" }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(faqItems, (item, i) => {
                              return createVNode(VExpansionPanel, { key: i }, {
                                default: withCtx(() => [
                                  createVNode(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.question), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(VExpansionPanelText, null, {
                                    default: withCtx(() => [
                                      createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
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
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "text-center mb-12" }, [
                createVNode("h2", { class: "text-h3 font-weight-bold mb-3" }, "Frequently Asked Questions"),
                createVNode("p", {
                  class: "text-subtitle-1 text-medium-emphasis mx-auto",
                  style: { "max-width": "700px" }
                }, " You have questions? We have answers. ")
              ]),
              createVNode(VRow, { justify: "center" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    md: "8"
                  }, {
                    default: withCtx(() => [
                      createVNode(VExpansionPanels, { variant: "accordion" }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(faqItems, (item, i) => {
                            return createVNode(VExpansionPanel, { key: i }, {
                              default: withCtx(() => [
                                createVNode(VExpansionPanelTitle, { class: "text-subtitle-1 font-weight-medium" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.question), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(VExpansionPanelText, null, {
                                  default: withCtx(() => [
                                    createVNode("p", { class: "text-body-1 pt-2" }, toDisplayString(item.answer), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faq.vue.mjs.map
