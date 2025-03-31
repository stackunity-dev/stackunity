import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, withCtx, createVNode, createTextVNode, withModifiers, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public.mjs';
import { S as Snackbar } from './snackbar.vue.mjs';
import { u as useHead } from './v3.mjs';
import { V as VApp, d as VSpacer, e as VBtn, f as VCard, _ as _export_sfc } from './server.mjs';
import { V as VAppBar } from './VAppBar.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VSelect } from './VSelect.mjs';
import { V as VTextarea } from './VTextarea.mjs';
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
import './VCheckboxBtn.mjs';
import './VChip.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Contact Us - DevUnity",
      meta: [
        { name: "description", content: "Contact the DevUnity team for any questions, suggestions or support requests. We are here to help you." },
        { name: "keywords", content: "DevUnity, contact, support, questions, suggestions, feedback, help, contact us, support request, contact form, contact us form, contact us page, contact us page design, contact us page development" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Contact Us - DevUnity" },
        { name: "og:description", content: "Contact the DevUnity team for any questions, suggestions or support requests. We are here to help you." },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const form = ref({
      name: "",
      email: "",
      subject: "General Question",
      message: ""
    });
    const subjects = [
      "General Question",
      "Technical Support",
      "Feature Request",
      "Bug Report",
      "Partnership",
      "Other"
    ];
    const loading = ref(false);
    const snackbar = ref({
      show: false,
      text: "",
      color: "success",
      timeout: 2e3
    });
    const submitForm = async () => {
      loading.value = true;
      try {
        if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
          snackbar.value = {
            show: true,
            text: "Please fill out all fields.",
            color: "error",
            timeout: 2e3
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
        form.value = {
          name: "",
          email: "",
          subject: "General Question",
          message: ""
        };
        snackbar.value = {
          show: true,
          text: "Your message has been sent successfully! We will respond soon.",
          color: "success",
          timeout: 2e3
        };
      } catch (error) {
        console.error("Error sending message:", error);
        snackbar.value = {
          show: true,
          text: "An error occurred while sending your message. Please try again.",
          color: "error",
          timeout: 2e3
        };
      } finally {
        loading.value = false;
      }
    };
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
                              _push5(`<div class="d-flex align-center" data-v-ddba1113${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="DevUnity title" width="150" data-v-ddba1113${_scopeId4}></div>`);
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
                                          _push7(`<h1 class="text-h3 font-weight-bold mb-6" data-v-ddba1113${_scopeId6}>Contact Us</h1><p class="text-subtitle-1 mb-6" data-v-ddba1113${_scopeId6}> We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. </p>`);
                                          _push7(ssrRenderComponent(VForm, {
                                            onSubmit: submitForm,
                                            class: "mb-8"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VRow, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VTextField, {
                                                              modelValue: form.value.name,
                                                              "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                              label: "Your name",
                                                              variant: "outlined",
                                                              rules: [(v) => !!v || "Name is required"],
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VTextField, {
                                                                modelValue: form.value.name,
                                                                "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                                label: "Your name",
                                                                variant: "outlined",
                                                                rules: [(v) => !!v || "Name is required"],
                                                                "hide-details": "auto",
                                                                class: "mb-4"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VTextField, {
                                                              modelValue: form.value.email,
                                                              "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                              label: "Your email",
                                                              variant: "outlined",
                                                              type: "email",
                                                              rules: [
                                                                (v) => !!v || "Email is required",
                                                                (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                              ],
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VTextField, {
                                                                modelValue: form.value.email,
                                                                "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                                label: "Your email",
                                                                variant: "outlined",
                                                                type: "email",
                                                                rules: [
                                                                  (v) => !!v || "Email is required",
                                                                  (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                                ],
                                                                "hide-details": "auto",
                                                                class: "mb-4"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, { cols: "12" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VSelect, {
                                                              modelValue: form.value.subject,
                                                              "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                              label: "Subject",
                                                              variant: "outlined",
                                                              items: subjects,
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VSelect, {
                                                                modelValue: form.value.subject,
                                                                "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                                label: "Subject",
                                                                variant: "outlined",
                                                                items: subjects,
                                                                "hide-details": "auto",
                                                                class: "mb-4"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, { cols: "12" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VTextarea, {
                                                              modelValue: form.value.message,
                                                              "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                              label: "Your message",
                                                              variant: "outlined",
                                                              rules: [(v) => !!v || "Message is required"],
                                                              "hide-details": "auto",
                                                              rows: "5",
                                                              class: "mb-4"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VTextarea, {
                                                                modelValue: form.value.message,
                                                                "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                                label: "Your message",
                                                                variant: "outlined",
                                                                rules: [(v) => !!v || "Message is required"],
                                                                "hide-details": "auto",
                                                                rows: "5",
                                                                class: "mb-4"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "6"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTextField, {
                                                              modelValue: form.value.name,
                                                              "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                              label: "Your name",
                                                              variant: "outlined",
                                                              rules: [(v) => !!v || "Name is required"],
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "6"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTextField, {
                                                              modelValue: form.value.email,
                                                              "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                              label: "Your email",
                                                              variant: "outlined",
                                                              type: "email",
                                                              rules: [
                                                                (v) => !!v || "Email is required",
                                                                (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                              ],
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, { cols: "12" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VSelect, {
                                                              modelValue: form.value.subject,
                                                              "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                              label: "Subject",
                                                              variant: "outlined",
                                                              items: subjects,
                                                              "hide-details": "auto",
                                                              class: "mb-4"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, { cols: "12" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTextarea, {
                                                              modelValue: form.value.message,
                                                              "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                              label: "Your message",
                                                              variant: "outlined",
                                                              rules: [(v) => !!v || "Message is required"],
                                                              "hide-details": "auto",
                                                              rows: "5",
                                                              class: "mb-4"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VBtn, {
                                                  type: "submit",
                                                  color: "primary",
                                                  size: "large",
                                                  loading: loading.value,
                                                  class: "mt-4"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(` Send Message `);
                                                    } else {
                                                      return [
                                                        createTextVNode(" Send Message ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTextField, {
                                                            modelValue: form.value.name,
                                                            "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                            label: "Your name",
                                                            variant: "outlined",
                                                            rules: [(v) => !!v || "Name is required"],
                                                            "hide-details": "auto",
                                                            class: "mb-4"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTextField, {
                                                            modelValue: form.value.email,
                                                            "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                            label: "Your email",
                                                            variant: "outlined",
                                                            type: "email",
                                                            rules: [
                                                              (v) => !!v || "Email is required",
                                                              (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                            ],
                                                            "hide-details": "auto",
                                                            class: "mb-4"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, { cols: "12" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VSelect, {
                                                            modelValue: form.value.subject,
                                                            "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                            label: "Subject",
                                                            variant: "outlined",
                                                            items: subjects,
                                                            "hide-details": "auto",
                                                            class: "mb-4"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, { cols: "12" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTextarea, {
                                                            modelValue: form.value.message,
                                                            "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                            label: "Your message",
                                                            variant: "outlined",
                                                            rules: [(v) => !!v || "Message is required"],
                                                            "hide-details": "auto",
                                                            rows: "5",
                                                            class: "mb-4"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VBtn, {
                                                    type: "submit",
                                                    color: "primary",
                                                    size: "large",
                                                    loading: loading.value,
                                                    class: "mt-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Send Message ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["loading"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                            createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                            createVNode(VForm, {
                                              onSubmit: withModifiers(submitForm, ["prevent"]),
                                              class: "mb-8"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "6"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTextField, {
                                                          modelValue: form.value.name,
                                                          "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                          label: "Your name",
                                                          variant: "outlined",
                                                          rules: [(v) => !!v || "Name is required"],
                                                          "hide-details": "auto",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "6"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTextField, {
                                                          modelValue: form.value.email,
                                                          "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                          label: "Your email",
                                                          variant: "outlined",
                                                          type: "email",
                                                          rules: [
                                                            (v) => !!v || "Email is required",
                                                            (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                          ],
                                                          "hide-details": "auto",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, { cols: "12" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VSelect, {
                                                          modelValue: form.value.subject,
                                                          "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                          label: "Subject",
                                                          variant: "outlined",
                                                          items: subjects,
                                                          "hide-details": "auto",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, { cols: "12" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTextarea, {
                                                          modelValue: form.value.message,
                                                          "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                          label: "Your message",
                                                          variant: "outlined",
                                                          rules: [(v) => !!v || "Message is required"],
                                                          "hide-details": "auto",
                                                          rows: "5",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VBtn, {
                                                  type: "submit",
                                                  color: "primary",
                                                  size: "large",
                                                  loading: loading.value,
                                                  class: "mt-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Send Message ")
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCard, { class: "pa-8 mb-8 rounded-xl" }, {
                                        default: withCtx(() => [
                                          createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                          createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                          createVNode(VForm, {
                                            onSubmit: withModifiers(submitForm, ["prevent"]),
                                            class: "mb-8"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "6"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextField, {
                                                        modelValue: form.value.name,
                                                        "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                        label: "Your name",
                                                        variant: "outlined",
                                                        rules: [(v) => !!v || "Name is required"],
                                                        "hide-details": "auto",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "6"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextField, {
                                                        modelValue: form.value.email,
                                                        "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                        label: "Your email",
                                                        variant: "outlined",
                                                        type: "email",
                                                        rules: [
                                                          (v) => !!v || "Email is required",
                                                          (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                        ],
                                                        "hide-details": "auto",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, { cols: "12" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VSelect, {
                                                        modelValue: form.value.subject,
                                                        "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                        label: "Subject",
                                                        variant: "outlined",
                                                        items: subjects,
                                                        "hide-details": "auto",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, { cols: "12" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextarea, {
                                                        modelValue: form.value.message,
                                                        "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                        label: "Your message",
                                                        variant: "outlined",
                                                        rules: [(v) => !!v || "Message is required"],
                                                        "hide-details": "auto",
                                                        rows: "5",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VBtn, {
                                                type: "submit",
                                                color: "primary",
                                                size: "large",
                                                loading: loading.value,
                                                class: "mt-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Send Message ")
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
                                        createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                        createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                        createVNode(VForm, {
                                          onSubmit: withModifiers(submitForm, ["prevent"]),
                                          class: "mb-8"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "6"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextField, {
                                                      modelValue: form.value.name,
                                                      "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                      label: "Your name",
                                                      variant: "outlined",
                                                      rules: [(v) => !!v || "Name is required"],
                                                      "hide-details": "auto",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "6"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextField, {
                                                      modelValue: form.value.email,
                                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                      label: "Your email",
                                                      variant: "outlined",
                                                      type: "email",
                                                      rules: [
                                                        (v) => !!v || "Email is required",
                                                        (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                      ],
                                                      "hide-details": "auto",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, { cols: "12" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VSelect, {
                                                      modelValue: form.value.subject,
                                                      "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                      label: "Subject",
                                                      variant: "outlined",
                                                      items: subjects,
                                                      "hide-details": "auto",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, { cols: "12" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextarea, {
                                                      modelValue: form.value.message,
                                                      "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                      label: "Your message",
                                                      variant: "outlined",
                                                      rules: [(v) => !!v || "Message is required"],
                                                      "hide-details": "auto",
                                                      rows: "5",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VBtn, {
                                              type: "submit",
                                              color: "primary",
                                              size: "large",
                                              loading: loading.value,
                                              class: "mt-4"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Send Message ")
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
                                      createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                      createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                      createVNode(VForm, {
                                        onSubmit: withModifiers(submitForm, ["prevent"]),
                                        class: "mb-8"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: form.value.name,
                                                    "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                    label: "Your name",
                                                    variant: "outlined",
                                                    rules: [(v) => !!v || "Name is required"],
                                                    "hide-details": "auto",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: form.value.email,
                                                    "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                    label: "Your email",
                                                    variant: "outlined",
                                                    type: "email",
                                                    rules: [
                                                      (v) => !!v || "Email is required",
                                                      (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                    ],
                                                    "hide-details": "auto",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode(VSelect, {
                                                    modelValue: form.value.subject,
                                                    "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                    label: "Subject",
                                                    variant: "outlined",
                                                    items: subjects,
                                                    "hide-details": "auto",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextarea, {
                                                    modelValue: form.value.message,
                                                    "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                    label: "Your message",
                                                    variant: "outlined",
                                                    rules: [(v) => !!v || "Message is required"],
                                                    "hide-details": "auto",
                                                    rows: "5",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VBtn, {
                                            type: "submit",
                                            color: "primary",
                                            size: "large",
                                            loading: loading.value,
                                            class: "mt-4"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Send Message ")
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
                                    createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                    createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                    createVNode(VForm, {
                                      onSubmit: withModifiers(submitForm, ["prevent"]),
                                      class: "mb-8"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: form.value.name,
                                                  "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                  label: "Your name",
                                                  variant: "outlined",
                                                  rules: [(v) => !!v || "Name is required"],
                                                  "hide-details": "auto",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: form.value.email,
                                                  "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                  label: "Your email",
                                                  variant: "outlined",
                                                  type: "email",
                                                  rules: [
                                                    (v) => !!v || "Email is required",
                                                    (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                  ],
                                                  "hide-details": "auto",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VSelect, {
                                                  modelValue: form.value.subject,
                                                  "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                  label: "Subject",
                                                  variant: "outlined",
                                                  items: subjects,
                                                  "hide-details": "auto",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextarea, {
                                                  modelValue: form.value.message,
                                                  "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                  label: "Your message",
                                                  variant: "outlined",
                                                  rules: [(v) => !!v || "Message is required"],
                                                  "hide-details": "auto",
                                                  rows: "5",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          type: "submit",
                                          color: "primary",
                                          size: "large",
                                          loading: loading.value,
                                          class: "mt-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Send Message ")
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
                        _push4(`<div class="text-center" data-v-ddba1113${_scopeId3}><p class="text-body-2 text-medium-emphasis" data-v-ddba1113${_scopeId3}> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} DevUnity. All rights reserved. </p></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
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
                          createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(Snackbar, {
              modelValue: snackbar.value.show,
              "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
              color: snackbar.value.color,
              text: snackbar.value.text,
              timeout: snackbar.value.timeout
            }, null, _parent2, _scopeId));
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
                                  createVNode("h1", { class: "text-h3 font-weight-bold mb-6" }, "Contact Us"),
                                  createVNode("p", { class: "text-subtitle-1 mb-6" }, " We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will get back to you as soon as possible. "),
                                  createVNode(VForm, {
                                    onSubmit: withModifiers(submitForm, ["prevent"]),
                                    class: "mb-8"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: form.value.name,
                                                "onUpdate:modelValue": ($event) => form.value.name = $event,
                                                label: "Your name",
                                                variant: "outlined",
                                                rules: [(v) => !!v || "Name is required"],
                                                "hide-details": "auto",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: form.value.email,
                                                "onUpdate:modelValue": ($event) => form.value.email = $event,
                                                label: "Your email",
                                                variant: "outlined",
                                                type: "email",
                                                rules: [
                                                  (v) => !!v || "Email is required",
                                                  (v) => /.+@.+\..+/.test(v) || "Invalid email"
                                                ],
                                                "hide-details": "auto",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VSelect, {
                                                modelValue: form.value.subject,
                                                "onUpdate:modelValue": ($event) => form.value.subject = $event,
                                                label: "Subject",
                                                variant: "outlined",
                                                items: subjects,
                                                "hide-details": "auto",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextarea, {
                                                modelValue: form.value.message,
                                                "onUpdate:modelValue": ($event) => form.value.message = $event,
                                                label: "Your message",
                                                variant: "outlined",
                                                rules: [(v) => !!v || "Message is required"],
                                                "hide-details": "auto",
                                                rows: "5",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        type: "submit",
                                        color: "primary",
                                        size: "large",
                                        loading: loading.value,
                                        class: "mt-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Send Message ")
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
                        createVNode("p", { class: "text-body-2 text-medium-emphasis" }, " © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " DevUnity. All rights reserved. ", 1)
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Snackbar, {
                modelValue: snackbar.value.show,
                "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                color: snackbar.value.color,
                text: snackbar.value.text,
                timeout: snackbar.value.timeout
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ddba1113"]]);

export { contact as default };
//# sourceMappingURL=contact.vue.mjs.map
