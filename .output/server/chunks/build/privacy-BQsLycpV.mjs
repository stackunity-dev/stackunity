import { _ as __nuxt_component_0 } from './nuxt-link-DxjINoOo.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-BNA1C2Ca.mjs';
import { u as useHead } from './index-C2merokO.mjs';
import { _ as _export_sfc, V as VApp, e as VSpacer, f as VBtn, g as VCard } from './server.mjs';
import { V as VAppBar } from './VAppBar-Dcl-vB5D.mjs';
import { V as VContainer } from './VContainer-fRL-Auqv.mjs';
import { V as VMain } from './VMain-BRDwGZ62.mjs';
import { V as VRow, a as VCol } from './VRow-5FS9XbeV.mjs';
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
  __name: "privacy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Privacy Policy - DevUnity",
      meta: [
        { name: "description", content: "Learn how DevUnity collects, uses, and protects your personal data when you use our platform." },
        { name: "keywords", content: "DevUnity, privacy, policy, data protection, personal data" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Privacy Policy - DevUnity" },
        { name: "og:description", content: "Learn how DevUnity collects, uses, and protects your personal data when you use our platform." }
      ]
    });
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
                              _push5(`<div class="d-flex align-center" data-v-a031c454${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" data-v-a031c454${_scopeId4}></div>`);
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
                                          _push7(`<h1 class="text-h3 font-weight-bold mb-6" data-v-a031c454${_scopeId6}>Privacy Policy</h1><p class="text-body-1 mb-6 font-italic" data-v-a031c454${_scopeId6}> Last updated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p><p class="text-subtitle-1 mb-6" data-v-a031c454${_scopeId6}> At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Information We Collect</h2><p class="text-body-1 mb-4" data-v-a031c454${_scopeId6}> We collect the following types of information: </p><ul class="mb-6" data-v-a031c454${_scopeId6}><li class="mb-2" data-v-a031c454${_scopeId6}><strong data-v-a031c454${_scopeId6}>Identification Information</strong>: when you create an account, we collect your name, email address, password, and optionally, your profile picture. </li><li class="mb-2" data-v-a031c454${_scopeId6}><strong data-v-a031c454${_scopeId6}>Usage Information</strong>: we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. </li><li class="mb-2" data-v-a031c454${_scopeId6}><strong data-v-a031c454${_scopeId6}>User Content</strong>: any content you create, upload, or share on our platform. </li></ul><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>How We Use Your Information</h2><p class="text-body-1 mb-4" data-v-a031c454${_scopeId6}> We use your information to: </p><ul class="mb-6" data-v-a031c454${_scopeId6}><li class="mb-2" data-v-a031c454${_scopeId6}>Provide, maintain, and improve our services</li><li class="mb-2" data-v-a031c454${_scopeId6}>Personalize your experience on our platform</li><li class="mb-2" data-v-a031c454${_scopeId6}>Communicate with you about our services</li><li class="mb-2" data-v-a031c454${_scopeId6}>Protect the security of our platform and our users</li><li class="mb-2" data-v-a031c454${_scopeId6}>Comply with legal obligations</li></ul><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Information Sharing</h2><p class="text-body-1 mb-6" data-v-a031c454${_scopeId6}> We do not sell your personal data to third parties. We may share your information with: </p><ul class="mb-6" data-v-a031c454${_scopeId6}><li class="mb-2" data-v-a031c454${_scopeId6}>Service providers who help us operate our platform</li><li class="mb-2" data-v-a031c454${_scopeId6}>Business partners, with your consent</li><li class="mb-2" data-v-a031c454${_scopeId6}>Legal authorities, if necessary to comply with the law</li></ul><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Data Security</h2><p class="text-body-1 mb-6" data-v-a031c454${_scopeId6}> We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Your Rights</h2><p class="text-body-1 mb-4" data-v-a031c454${_scopeId6}> Depending on your place of residence, you may have certain rights regarding your personal data, including: </p><ul class="mb-6" data-v-a031c454${_scopeId6}><li class="mb-2" data-v-a031c454${_scopeId6}>The right to access your data</li><li class="mb-2" data-v-a031c454${_scopeId6}>The right to rectify your data</li><li class="mb-2" data-v-a031c454${_scopeId6}>The right to delete your data</li><li class="mb-2" data-v-a031c454${_scopeId6}>The right to restrict the processing of your data</li><li class="mb-2" data-v-a031c454${_scopeId6}>The right to data portability</li><li class="mb-2" data-v-a031c454${_scopeId6}>The right to object to the processing of your data</li></ul><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Cookies and Similar Technologies</h2><p class="text-body-1 mb-6" data-v-a031c454${_scopeId6}> We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our `);
                                          _push7(ssrRenderComponent(_component_NuxtLink, {
                                            to: "/cookies",
                                            class: "text-decoration-underline"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Cookie Policy`);
                                              } else {
                                                return [
                                                  createTextVNode("Cookie Policy")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Changes to This Policy</h2><p class="text-body-1 mb-6" data-v-a031c454${_scopeId6}> We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. </p><h2 class="text-h4 font-weight-bold mb-4" data-v-a031c454${_scopeId6}>Contact Us</h2><p class="text-body-1 mb-6" data-v-a031c454${_scopeId6}> If you have any questions about this privacy policy or our data protection practices, please don&#39;t hesitate to contact us at <a href="mailto:privacy@devunity.com" class="text-decoration-underline" data-v-a031c454${_scopeId6}>privacy@devunity.com</a>. </p>`);
                                        } else {
                                          return [
                                            createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                            createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                            createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                            createVNode("ul", { class: "mb-6" }, [
                                              createVNode("li", { class: "mb-2" }, [
                                                createVNode("strong", null, "Identification Information"),
                                                createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                              ]),
                                              createVNode("li", { class: "mb-2" }, [
                                                createVNode("strong", null, "Usage Information"),
                                                createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                              ]),
                                              createVNode("li", { class: "mb-2" }, [
                                                createVNode("strong", null, "User Content"),
                                                createTextVNode(": any content you create, upload, or share on our platform. ")
                                              ])
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                            createVNode("ul", { class: "mb-6" }, [
                                              createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                              createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                              createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                              createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                              createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                            createVNode("ul", { class: "mb-6" }, [
                                              createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                              createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                              createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                            createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                            createVNode("ul", { class: "mb-6" }, [
                                              createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                              createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                              createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                              createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                              createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                              createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, [
                                              createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                              createVNode(_component_NuxtLink, {
                                                to: "/cookies",
                                                class: "text-decoration-underline"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Cookie Policy")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(". ")
                                            ]),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                            createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                            createVNode("p", { class: "text-body-1 mb-6" }, [
                                              createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
                                          createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                          createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                          createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                          createVNode("ul", { class: "mb-6" }, [
                                            createVNode("li", { class: "mb-2" }, [
                                              createVNode("strong", null, "Identification Information"),
                                              createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                            ]),
                                            createVNode("li", { class: "mb-2" }, [
                                              createVNode("strong", null, "Usage Information"),
                                              createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                            ]),
                                            createVNode("li", { class: "mb-2" }, [
                                              createVNode("strong", null, "User Content"),
                                              createTextVNode(": any content you create, upload, or share on our platform. ")
                                            ])
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                          createVNode("ul", { class: "mb-6" }, [
                                            createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                            createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                            createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                            createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                            createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                          createVNode("ul", { class: "mb-6" }, [
                                            createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                            createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                            createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                          createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                          createVNode("ul", { class: "mb-6" }, [
                                            createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                            createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                            createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                            createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                            createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                            createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, [
                                            createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                            createVNode(_component_NuxtLink, {
                                              to: "/cookies",
                                              class: "text-decoration-underline"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Cookie Policy")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(". ")
                                          ]),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                          createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                          createVNode("p", { class: "text-body-1 mb-6" }, [
                                            createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
                                        createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                        createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                        createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                        createVNode("ul", { class: "mb-6" }, [
                                          createVNode("li", { class: "mb-2" }, [
                                            createVNode("strong", null, "Identification Information"),
                                            createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                          ]),
                                          createVNode("li", { class: "mb-2" }, [
                                            createVNode("strong", null, "Usage Information"),
                                            createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                          ]),
                                          createVNode("li", { class: "mb-2" }, [
                                            createVNode("strong", null, "User Content"),
                                            createTextVNode(": any content you create, upload, or share on our platform. ")
                                          ])
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                        createVNode("ul", { class: "mb-6" }, [
                                          createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                          createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                          createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                          createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                          createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                        createVNode("ul", { class: "mb-6" }, [
                                          createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                          createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                          createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                        createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                        createVNode("ul", { class: "mb-6" }, [
                                          createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                          createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                          createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                          createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                          createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                          createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, [
                                          createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                          createVNode(_component_NuxtLink, {
                                            to: "/cookies",
                                            class: "text-decoration-underline"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Cookie Policy")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(". ")
                                        ]),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                        createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                        createVNode("p", { class: "text-body-1 mb-6" }, [
                                          createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
                                      createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                      createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                      createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                      createVNode("ul", { class: "mb-6" }, [
                                        createVNode("li", { class: "mb-2" }, [
                                          createVNode("strong", null, "Identification Information"),
                                          createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                        ]),
                                        createVNode("li", { class: "mb-2" }, [
                                          createVNode("strong", null, "Usage Information"),
                                          createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                        ]),
                                        createVNode("li", { class: "mb-2" }, [
                                          createVNode("strong", null, "User Content"),
                                          createTextVNode(": any content you create, upload, or share on our platform. ")
                                        ])
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                      createVNode("ul", { class: "mb-6" }, [
                                        createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                        createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                        createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                        createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                        createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                      createVNode("ul", { class: "mb-6" }, [
                                        createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                        createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                        createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                      createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                      createVNode("ul", { class: "mb-6" }, [
                                        createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                        createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                        createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                        createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                        createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                        createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, [
                                        createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                        createVNode(_component_NuxtLink, {
                                          to: "/cookies",
                                          class: "text-decoration-underline"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Cookie Policy")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(". ")
                                      ]),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                      createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                      createVNode("p", { class: "text-body-1 mb-6" }, [
                                        createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
                                    createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                    createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                    createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                    createVNode("ul", { class: "mb-6" }, [
                                      createVNode("li", { class: "mb-2" }, [
                                        createVNode("strong", null, "Identification Information"),
                                        createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                      ]),
                                      createVNode("li", { class: "mb-2" }, [
                                        createVNode("strong", null, "Usage Information"),
                                        createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                      ]),
                                      createVNode("li", { class: "mb-2" }, [
                                        createVNode("strong", null, "User Content"),
                                        createTextVNode(": any content you create, upload, or share on our platform. ")
                                      ])
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                    createVNode("ul", { class: "mb-6" }, [
                                      createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                      createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                      createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                      createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                      createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                    createVNode("ul", { class: "mb-6" }, [
                                      createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                      createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                      createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                    createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                    createVNode("ul", { class: "mb-6" }, [
                                      createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                      createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                      createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                      createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                      createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                      createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, [
                                      createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                      createVNode(_component_NuxtLink, {
                                        to: "/cookies",
                                        class: "text-decoration-underline"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Cookie Policy")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(". ")
                                    ]),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                    createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                    createVNode("p", { class: "text-body-1 mb-6" }, [
                                      createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
                        _push4(`<div class="text-center" data-v-a031c454${_scopeId3}><p class="text-body-2 text-medium-emphasis" data-v-a031c454${_scopeId3}> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </p></div>`);
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
                                  createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Privacy Policy"),
                                  createVNode("p", { class: "text-body-1 mb-6 font-italic" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                                  createVNode("p", { class: "text-subtitle-1 mb-6" }, " At DevUnity, we place great importance on protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information We Collect"),
                                  createVNode("p", { class: "text-body-1 mb-4" }, " We collect the following types of information: "),
                                  createVNode("ul", { class: "mb-6" }, [
                                    createVNode("li", { class: "mb-2" }, [
                                      createVNode("strong", null, "Identification Information"),
                                      createTextVNode(": when you create an account, we collect your name, email address, password, and optionally, your profile picture. ")
                                    ]),
                                    createVNode("li", { class: "mb-2" }, [
                                      createVNode("strong", null, "Usage Information"),
                                      createTextVNode(": we collect data about how you interact with our platform, including the pages you visit, the features you use, and the time spent on the platform. ")
                                    ]),
                                    createVNode("li", { class: "mb-2" }, [
                                      createVNode("strong", null, "User Content"),
                                      createTextVNode(": any content you create, upload, or share on our platform. ")
                                    ])
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "How We Use Your Information"),
                                  createVNode("p", { class: "text-body-1 mb-4" }, " We use your information to: "),
                                  createVNode("ul", { class: "mb-6" }, [
                                    createVNode("li", { class: "mb-2" }, "Provide, maintain, and improve our services"),
                                    createVNode("li", { class: "mb-2" }, "Personalize your experience on our platform"),
                                    createVNode("li", { class: "mb-2" }, "Communicate with you about our services"),
                                    createVNode("li", { class: "mb-2" }, "Protect the security of our platform and our users"),
                                    createVNode("li", { class: "mb-2" }, "Comply with legal obligations")
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Information Sharing"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, " We do not sell your personal data to third parties. We may share your information with: "),
                                  createVNode("ul", { class: "mb-6" }, [
                                    createVNode("li", { class: "mb-2" }, "Service providers who help us operate our platform"),
                                    createVNode("li", { class: "mb-2" }, "Business partners, with your consent"),
                                    createVNode("li", { class: "mb-2" }, "Legal authorities, if necessary to comply with the law")
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Data Security"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, " We take the security of your data very seriously. We have implemented appropriate technical and organizational measures to protect your information against unauthorized access, use, or disclosure. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Your Rights"),
                                  createVNode("p", { class: "text-body-1 mb-4" }, " Depending on your place of residence, you may have certain rights regarding your personal data, including: "),
                                  createVNode("ul", { class: "mb-6" }, [
                                    createVNode("li", { class: "mb-2" }, "The right to access your data"),
                                    createVNode("li", { class: "mb-2" }, "The right to rectify your data"),
                                    createVNode("li", { class: "mb-2" }, "The right to delete your data"),
                                    createVNode("li", { class: "mb-2" }, "The right to restrict the processing of your data"),
                                    createVNode("li", { class: "mb-2" }, "The right to data portability"),
                                    createVNode("li", { class: "mb-2" }, "The right to object to the processing of your data")
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Cookies and Similar Technologies"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, [
                                    createTextVNode(" We use cookies and other similar technologies to improve your experience on our platform, understand how you use our services, and personalize our offerings. You can manage your cookie preferences in your browser settings. For more information, see our "),
                                    createVNode(_component_NuxtLink, {
                                      to: "/cookies",
                                      class: "text-decoration-underline"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Cookie Policy")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(". ")
                                  ]),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Changes to This Policy"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, " We may update this privacy policy from time to time. The most recent version will always be available on our website, and we will notify you of any significant changes. "),
                                  createVNode("h2", { class: "text-h4 font-weight-bold mb-4" }, "Contact Us"),
                                  createVNode("p", { class: "text-body-1 mb-6" }, [
                                    createTextVNode(" If you have any questions about this privacy policy or our data protection practices, please don't hesitate to contact us at "),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const privacy = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a031c454"]]);

export { privacy as default };
//# sourceMappingURL=privacy-BQsLycpV.mjs.map
