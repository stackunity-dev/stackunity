import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public2.mjs';
import { u as useHead } from './v3.mjs';
import { V as VContainer } from './VContainer.mjs';
import { f as VCard, _ as _export_sfc } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Terms of Service - DevUnity",
      meta: [
        { name: "description", content: "Read the Terms of Service for the DevUnity platform. By using our services, you agree to be bound by these terms." },
        { name: "author", content: "DevUnity" },
        { name: "keywords", content: "DevUnity, terms of service, usage, services, bound, terms" },
        { name: "robots", content: "index,follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Terms of Service - DevUnity" },
        { name: "og:description", content: "Read the Terms of Service for the DevUnity platform. By using our services, you agree to be bound by these terms." },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ],
      link: [
        { rel: "canonical", href: "https://devunity.com/terms" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "terms-page pa-4 pa-sm-6 pa-md-8 pa-lg-12" }, _attrs))} data-v-ffa90a98>`);
      _push(ssrRenderComponent(VContainer, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex flex-column align-center mb-6" data-v-ffa90a98${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "mb-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" data-v-ffa90a98${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: _imports_0,
                      alt: "DevUnity title",
                      width: "150"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<h1 class="text-h3 font-weight-bold text-center" data-v-ffa90a98${_scopeId}>Terms of Service</h1></div>`);
            _push2(ssrRenderComponent(VCard, { class: "pa-6 mb-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="terms-content" data-v-ffa90a98${_scopeId2}><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>1. Acceptance of Terms</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> Welcome to DevUnity. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>2. Registration and Account</h2><p class="mb-2" data-v-ffa90a98${_scopeId2}> To use certain features of our platform, you may need to register and create an account. You agree to: </p><ul class="mb-4" data-v-ffa90a98${_scopeId2}><li data-v-ffa90a98${_scopeId2}>Provide accurate and complete information</li><li data-v-ffa90a98${_scopeId2}>Maintain the security and confidentiality of your login credentials</li><li data-v-ffa90a98${_scopeId2}>Take responsibility for all activities that occur under your account</li><li data-v-ffa90a98${_scopeId2}>Notify us immediately of any unauthorized use of your account</li></ul><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>3. User Content</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> You retain ownership of any content you submit to DevUnity. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute such content for the purpose of providing and promoting our services. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>4. Acceptable Use</h2><p class="mb-2" data-v-ffa90a98${_scopeId2}> When using our platform, you agree not to: </p><ul class="mb-4" data-v-ffa90a98${_scopeId2}><li data-v-ffa90a98${_scopeId2}>Violate any applicable laws or regulations</li><li data-v-ffa90a98${_scopeId2}>Infringe upon the rights of others</li><li data-v-ffa90a98${_scopeId2}>Submit unauthorized commercial communications</li><li data-v-ffa90a98${_scopeId2}>Upload viruses or malicious code</li><li data-v-ffa90a98${_scopeId2}>Attempt to access data not intended for you</li><li data-v-ffa90a98${_scopeId2}>Impair the proper functioning of the website</li></ul><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>5. Intellectual Property</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> The DevUnity platform, including its design, layout, text, graphics, and other content, is the exclusive property of DevUnity and is protected by national and international copyright laws. You may not reproduce, modify, distribute, or create derivative works based on our platform without our express permission. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>6. Limitation of Liability</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> To the fullest extent permitted by law, DevUnity shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use or inability to use our services. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>7. Indemnification</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> You agree to defend, indemnify, and hold harmless DevUnity, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of your use of our platform or your violation of these Terms. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>8. Termination</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>9. Changes to Terms</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> We may modify these Terms at any time. We will notify you of any significant changes by posting the new Terms on our website. Your continued use of our platform after such modifications constitutes your acceptance of the revised Terms. </p><h2 class="text-h5 font-weight-bold mb-4" data-v-ffa90a98${_scopeId2}>10. Contact Us</h2><p class="mb-4" data-v-ffa90a98${_scopeId2}> If you have any questions about these Terms, please contact us at <a href="mailto:legal@devunity.com" class="text-decoration-underline" data-v-ffa90a98${_scopeId2}>legal@devunity.com</a>. </p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "terms-content" }, [
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "1. Acceptance of Terms"),
                      createVNode("p", { class: "mb-4" }, " Welcome to DevUnity. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "2. Registration and Account"),
                      createVNode("p", { class: "mb-2" }, " To use certain features of our platform, you may need to register and create an account. You agree to: "),
                      createVNode("ul", { class: "mb-4" }, [
                        createVNode("li", null, "Provide accurate and complete information"),
                        createVNode("li", null, "Maintain the security and confidentiality of your login credentials"),
                        createVNode("li", null, "Take responsibility for all activities that occur under your account"),
                        createVNode("li", null, "Notify us immediately of any unauthorized use of your account")
                      ]),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "3. User Content"),
                      createVNode("p", { class: "mb-4" }, " You retain ownership of any content you submit to DevUnity. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute such content for the purpose of providing and promoting our services. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "4. Acceptable Use"),
                      createVNode("p", { class: "mb-2" }, " When using our platform, you agree not to: "),
                      createVNode("ul", { class: "mb-4" }, [
                        createVNode("li", null, "Violate any applicable laws or regulations"),
                        createVNode("li", null, "Infringe upon the rights of others"),
                        createVNode("li", null, "Submit unauthorized commercial communications"),
                        createVNode("li", null, "Upload viruses or malicious code"),
                        createVNode("li", null, "Attempt to access data not intended for you"),
                        createVNode("li", null, "Impair the proper functioning of the website")
                      ]),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "5. Intellectual Property"),
                      createVNode("p", { class: "mb-4" }, " The DevUnity platform, including its design, layout, text, graphics, and other content, is the exclusive property of DevUnity and is protected by national and international copyright laws. You may not reproduce, modify, distribute, or create derivative works based on our platform without our express permission. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "6. Limitation of Liability"),
                      createVNode("p", { class: "mb-4" }, " To the fullest extent permitted by law, DevUnity shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use or inability to use our services. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "7. Indemnification"),
                      createVNode("p", { class: "mb-4" }, " You agree to defend, indemnify, and hold harmless DevUnity, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of your use of our platform or your violation of these Terms. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "8. Termination"),
                      createVNode("p", { class: "mb-4" }, " We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "9. Changes to Terms"),
                      createVNode("p", { class: "mb-4" }, " We may modify these Terms at any time. We will notify you of any significant changes by posting the new Terms on our website. Your continued use of our platform after such modifications constitutes your acceptance of the revised Terms. "),
                      createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "10. Contact Us"),
                      createVNode("p", { class: "mb-4" }, [
                        createTextVNode(" If you have any questions about these Terms, please contact us at "),
                        createVNode("a", {
                          href: "mailto:legal@devunity.com",
                          class: "text-decoration-underline"
                        }, "legal@devunity.com"),
                        createTextVNode(". ")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="text-center" data-v-ffa90a98${_scopeId}><p class="text-caption text-medium-emphasis" data-v-ffa90a98${_scopeId}> Last updated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p><p class="text-caption text-medium-emphasis" data-v-ffa90a98${_scopeId}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </p></div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex flex-column align-center mb-6" }, [
                createVNode(_component_NuxtLink, {
                  to: "/",
                  class: "mb-4"
                }, {
                  default: withCtx(() => [
                    createVNode("img", {
                      src: _imports_0,
                      alt: "DevUnity title",
                      width: "150"
                    })
                  ]),
                  _: 1
                }),
                createVNode("h1", { class: "text-h3 font-weight-bold text-center" }, "Terms of Service")
              ]),
              createVNode(VCard, { class: "pa-6 mb-6" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "terms-content" }, [
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "1. Acceptance of Terms"),
                    createVNode("p", { class: "mb-4" }, " Welcome to DevUnity. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "2. Registration and Account"),
                    createVNode("p", { class: "mb-2" }, " To use certain features of our platform, you may need to register and create an account. You agree to: "),
                    createVNode("ul", { class: "mb-4" }, [
                      createVNode("li", null, "Provide accurate and complete information"),
                      createVNode("li", null, "Maintain the security and confidentiality of your login credentials"),
                      createVNode("li", null, "Take responsibility for all activities that occur under your account"),
                      createVNode("li", null, "Notify us immediately of any unauthorized use of your account")
                    ]),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "3. User Content"),
                    createVNode("p", { class: "mb-4" }, " You retain ownership of any content you submit to DevUnity. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute such content for the purpose of providing and promoting our services. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "4. Acceptable Use"),
                    createVNode("p", { class: "mb-2" }, " When using our platform, you agree not to: "),
                    createVNode("ul", { class: "mb-4" }, [
                      createVNode("li", null, "Violate any applicable laws or regulations"),
                      createVNode("li", null, "Infringe upon the rights of others"),
                      createVNode("li", null, "Submit unauthorized commercial communications"),
                      createVNode("li", null, "Upload viruses or malicious code"),
                      createVNode("li", null, "Attempt to access data not intended for you"),
                      createVNode("li", null, "Impair the proper functioning of the website")
                    ]),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "5. Intellectual Property"),
                    createVNode("p", { class: "mb-4" }, " The DevUnity platform, including its design, layout, text, graphics, and other content, is the exclusive property of DevUnity and is protected by national and international copyright laws. You may not reproduce, modify, distribute, or create derivative works based on our platform without our express permission. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "6. Limitation of Liability"),
                    createVNode("p", { class: "mb-4" }, " To the fullest extent permitted by law, DevUnity shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use or inability to use our services. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "7. Indemnification"),
                    createVNode("p", { class: "mb-4" }, " You agree to defend, indemnify, and hold harmless DevUnity, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses, including legal fees, arising out of your use of our platform or your violation of these Terms. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "8. Termination"),
                    createVNode("p", { class: "mb-4" }, " We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "9. Changes to Terms"),
                    createVNode("p", { class: "mb-4" }, " We may modify these Terms at any time. We will notify you of any significant changes by posting the new Terms on our website. Your continued use of our platform after such modifications constitutes your acceptance of the revised Terms. "),
                    createVNode("h2", { class: "text-h5 font-weight-bold mb-4" }, "10. Contact Us"),
                    createVNode("p", { class: "mb-4" }, [
                      createTextVNode(" If you have any questions about these Terms, please contact us at "),
                      createVNode("a", {
                        href: "mailto:legal@devunity.com",
                        class: "text-decoration-underline"
                      }, "legal@devunity.com"),
                      createTextVNode(". ")
                    ])
                  ])
                ]),
                _: 1
              }),
              createVNode("div", { class: "text-center" }, [
                createVNode("p", { class: "text-caption text-medium-emphasis" }, " Last updated: " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1),
                createVNode("p", { class: "text-caption text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const terms = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ffa90a98"]]);

export { terms as default };
//# sourceMappingURL=terms.vue.mjs.map
