import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public3.mjs';
import { useRouter } from 'vue-router';
import { S as Snackbar } from './snackbar.vue.mjs';
import { S as useUserStore, g as VIcon, f as VCard, e as VBtn, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VCheckbox } from './VCheckbox.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import './VCheckboxBtn.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Sign In - DevUnity",
      meta: [
        { name: "author", content: "Nûr" },
        { name: "description", content: "Sign in to your DevUnity account to access all features" },
        { name: "robots", content: "index,follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Sign In - DevUnity" },
        { name: "og:description", content: "Sign in to your DevUnity account to access all features" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ],
      link: [
        { rel: "canonical", href: "https://devunity.com/login" }
      ]
    });
    const router = useRouter();
    const userStore = useUserStore();
    const form = ref({
      email: "",
      password: ""
    });
    const features = ref([
      {
        icon: "mdi-palette-outline",
        title: "Vuetify Components",
        description: "Custom Vuetify components ready to use"
      },
      {
        icon: "mdi-database-outline",
        title: "SQL Generator",
        description: "Generate SQL databases quickly and easily"
      },
      {
        icon: "mdi-chart-box-outline",
        title: "SEO and Accessibility Statistics",
        description: "Track your performance and improve your site"
      }
    ]);
    const loading = ref(false);
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const showSnackbar = ref(false);
    const snackbarColor = ref("");
    const snackbarText = ref("");
    const handleSignin = async () => {
      loading.value = true;
      try {
        const response = await userStore.login(form.value.email, form.value.password);
        if (response.success) {
          router.push("/dashboard");
        } else {
          snackbarColor.value = "error";
          snackbarText.value = response.error || "Login error";
          showSnackbar.value = true;
        }
      } catch (err) {
        console.error(err.message);
        snackbarColor.value = "error";
        snackbarText.value = err.message || "Unexpected error";
        showSnackbar.value = true;
      } finally {
        loading.value = false;
      }
    };
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "auth-screen" }, _attrs))} data-v-eb563a3d>`);
      _push(ssrRenderComponent(VContainer, {
        fluid: "",
        class: "fill-height pa-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, { class: "fill-height ma-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    md: "6",
                    class: "d-none d-md-flex left-panel align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="left-content text-center" data-v-eb563a3d${_scopeId3}><h1 data-v-eb563a3d${_scopeId3}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity - Develop faster and better with DevUnity" class="logo mb-8" width="350" data-v-eb563a3d${_scopeId3}><span class="sr-only" data-v-eb563a3d${_scopeId3}>Devunity - Develop faster and better with DevUnity</span></h1><div class="features-list" data-v-eb563a3d${_scopeId3}><!--[-->`);
                        ssrRenderList(features.value, (feature, index) => {
                          _push4(`<div class="${ssrRenderClass([{ "mb-6": index !== features.value.length - 1 }, "feature-item d-flex align-center"])}" data-v-eb563a3d${_scopeId3}>`);
                          _push4(ssrRenderComponent(VIcon, {
                            color: "primary",
                            size: "x-large",
                            class: "mr-3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(feature.icon)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(feature.icon), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`<div class="text-left" data-v-eb563a3d${_scopeId3}><p class="text-body-1 font-weight-medium text-white mb-1" data-v-eb563a3d${_scopeId3}>${ssrInterpolate(feature.title)}</p><p class="text-body-2 text-white-darken-2" data-v-eb563a3d${_scopeId3}>${ssrInterpolate(feature.description)}</p></div></div>`);
                        });
                        _push4(`<!--]--></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "left-content text-center" }, [
                            createVNode("h1", null, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "Devunity - Develop faster and better with DevUnity",
                                class: "logo mb-8",
                                width: "350"
                              }),
                              createVNode("span", { class: "sr-only" }, "Devunity - Develop faster and better with DevUnity")
                            ]),
                            createVNode("div", { class: "features-list" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(features.value, (feature, index) => {
                                return openBlock(), createBlock("div", {
                                  key: index,
                                  class: ["feature-item d-flex align-center", { "mb-6": index !== features.value.length - 1 }]
                                }, [
                                  createVNode(VIcon, {
                                    color: "primary",
                                    size: "x-large",
                                    class: "mr-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(feature.icon), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode("div", { class: "text-left" }, [
                                    createVNode("p", { class: "text-body-1 font-weight-medium text-white mb-1" }, toDisplayString(feature.title), 1),
                                    createVNode("p", { class: "text-body-2 text-white-darken-2" }, toDisplayString(feature.description), 1)
                                  ])
                                ], 2);
                              }), 128))
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    md: "6",
                    class: "right-panel d-flex align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "login-card pa-8 elevation-0",
                          "max-width": "450",
                          width: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex justify-center d-md-none mb-8" data-v-eb563a3d${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity Logo" width="300" data-v-eb563a3d${_scopeId4}></div><h2 class="text-h5 font-weight-bold mb-2" data-v-eb563a3d${_scopeId4}>Sign In</h2><p class="text-subtitle-1 text-medium-emphasis mb-8" data-v-eb563a3d${_scopeId4}>Pick up where you left off</p>`);
                              _push5(ssrRenderComponent(VForm, { onSubmit: handleSignin }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      label: "Email address",
                                      type: "email",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                      "hide-details": "auto"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: form.value.password,
                                      "onUpdate:modelValue": ($event) => form.value.password = $event,
                                      type: showPassword.value ? "text" : "password",
                                      label: "Password",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-lock-outline",
                                      "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                      "onClick:appendInner": togglePasswordVisibility,
                                      class: "mb-2 mt-4",
                                      rules: [(v) => !!v || "Password required"],
                                      "hide-details": "auto"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<div class="d-flex justify-space-between align-center mb-8" data-v-eb563a3d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VCheckbox, {
                                      modelValue: rememberMe.value,
                                      "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                      label: "Remember me",
                                      color: "primary",
                                      density: "compact",
                                      "hide-details": ""
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "48",
                                      class: "text-none font-weight-medium"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Sign in `);
                                        } else {
                                          return [
                                            createTextVNode(" Sign in ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="text-center mt-8" data-v-eb563a3d${_scopeId5}><span class="text-medium-emphasis" data-v-eb563a3d${_scopeId5}>Don&#39;t have an account?</span>`);
                                    _push6(ssrRenderComponent(_component_NuxtLink, {
                                      class: "text-decoration-none ml-1 font-weight-medium",
                                      to: "/signup"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Create account `);
                                        } else {
                                          return [
                                            createTextVNode(" Create account ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        modelValue: form.value.email,
                                        "onUpdate:modelValue": ($event) => form.value.email = $event,
                                        label: "Email address",
                                        type: "email",
                                        variant: "outlined",
                                        "prepend-inner-icon": "mdi-email-outline",
                                        rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                        "hide-details": "auto"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                      createVNode(VTextField, {
                                        modelValue: form.value.password,
                                        "onUpdate:modelValue": ($event) => form.value.password = $event,
                                        type: showPassword.value ? "text" : "password",
                                        label: "Password",
                                        variant: "outlined",
                                        "prepend-inner-icon": "mdi-lock-outline",
                                        "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                        "onClick:appendInner": togglePasswordVisibility,
                                        class: "mb-2 mt-4",
                                        rules: [(v) => !!v || "Password required"],
                                        "hide-details": "auto"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                      createVNode("div", { class: "d-flex justify-space-between align-center mb-8" }, [
                                        createVNode(VCheckbox, {
                                          modelValue: rememberMe.value,
                                          "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                          label: "Remember me",
                                          color: "primary",
                                          density: "compact",
                                          "hide-details": ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode(VBtn, {
                                        block: "",
                                        color: "primary",
                                        type: "submit",
                                        loading: loading.value,
                                        "min-height": "48",
                                        class: "text-none font-weight-medium"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Sign in ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"]),
                                      createVNode("div", { class: "text-center mt-8" }, [
                                        createVNode("span", { class: "text-medium-emphasis" }, "Don't have an account?"),
                                        createVNode(_component_NuxtLink, {
                                          class: "text-decoration-none ml-1 font-weight-medium",
                                          to: "/signup"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Create account ")
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                                  createVNode("img", {
                                    src: _imports_0,
                                    alt: "Devunity Logo",
                                    width: "300"
                                  })
                                ]),
                                createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Sign In"),
                                createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Pick up where you left off"),
                                createVNode(VForm, {
                                  onSubmit: withModifiers(handleSignin, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      label: "Email address",
                                      type: "email",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                      "hide-details": "auto"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                    createVNode(VTextField, {
                                      modelValue: form.value.password,
                                      "onUpdate:modelValue": ($event) => form.value.password = $event,
                                      type: showPassword.value ? "text" : "password",
                                      label: "Password",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-lock-outline",
                                      "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                      "onClick:appendInner": togglePasswordVisibility,
                                      class: "mb-2 mt-4",
                                      rules: [(v) => !!v || "Password required"],
                                      "hide-details": "auto"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                    createVNode("div", { class: "d-flex justify-space-between align-center mb-8" }, [
                                      createVNode(VCheckbox, {
                                        modelValue: rememberMe.value,
                                        "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                        label: "Remember me",
                                        color: "primary",
                                        density: "compact",
                                        "hide-details": ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "48",
                                      class: "text-none font-weight-medium"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Sign in ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"]),
                                    createVNode("div", { class: "text-center mt-8" }, [
                                      createVNode("span", { class: "text-medium-emphasis" }, "Don't have an account?"),
                                      createVNode(_component_NuxtLink, {
                                        class: "text-decoration-none ml-1 font-weight-medium",
                                        to: "/signup"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create account ")
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCard, {
                            class: "login-card pa-8 elevation-0",
                            "max-width": "450",
                            width: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                                createVNode("img", {
                                  src: _imports_0,
                                  alt: "Devunity Logo",
                                  width: "300"
                                })
                              ]),
                              createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Sign In"),
                              createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Pick up where you left off"),
                              createVNode(VForm, {
                                onSubmit: withModifiers(handleSignin, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: form.value.email,
                                    "onUpdate:modelValue": ($event) => form.value.email = $event,
                                    label: "Email address",
                                    type: "email",
                                    variant: "outlined",
                                    "prepend-inner-icon": "mdi-email-outline",
                                    rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                    "hide-details": "auto"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                  createVNode(VTextField, {
                                    modelValue: form.value.password,
                                    "onUpdate:modelValue": ($event) => form.value.password = $event,
                                    type: showPassword.value ? "text" : "password",
                                    label: "Password",
                                    variant: "outlined",
                                    "prepend-inner-icon": "mdi-lock-outline",
                                    "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                    "onClick:appendInner": togglePasswordVisibility,
                                    class: "mb-2 mt-4",
                                    rules: [(v) => !!v || "Password required"],
                                    "hide-details": "auto"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-8" }, [
                                    createVNode(VCheckbox, {
                                      modelValue: rememberMe.value,
                                      "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                      label: "Remember me",
                                      color: "primary",
                                      density: "compact",
                                      "hide-details": ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode(VBtn, {
                                    block: "",
                                    color: "primary",
                                    type: "submit",
                                    loading: loading.value,
                                    "min-height": "48",
                                    class: "text-none font-weight-medium"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Sign in ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"]),
                                  createVNode("div", { class: "text-center mt-8" }, [
                                    createVNode("span", { class: "text-medium-emphasis" }, "Don't have an account?"),
                                    createVNode(_component_NuxtLink, {
                                      class: "text-decoration-none ml-1 font-weight-medium",
                                      to: "/signup"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create account ")
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, {
                      cols: "12",
                      md: "6",
                      class: "d-none d-md-flex left-panel align-center justify-center"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "left-content text-center" }, [
                          createVNode("h1", null, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "Devunity - Develop faster and better with DevUnity",
                              class: "logo mb-8",
                              width: "350"
                            }),
                            createVNode("span", { class: "sr-only" }, "Devunity - Develop faster and better with DevUnity")
                          ]),
                          createVNode("div", { class: "features-list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(features.value, (feature, index) => {
                              return openBlock(), createBlock("div", {
                                key: index,
                                class: ["feature-item d-flex align-center", { "mb-6": index !== features.value.length - 1 }]
                              }, [
                                createVNode(VIcon, {
                                  color: "primary",
                                  size: "x-large",
                                  class: "mr-3"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(feature.icon), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode("div", { class: "text-left" }, [
                                  createVNode("p", { class: "text-body-1 font-weight-medium text-white mb-1" }, toDisplayString(feature.title), 1),
                                  createVNode("p", { class: "text-body-2 text-white-darken-2" }, toDisplayString(feature.description), 1)
                                ])
                              ], 2);
                            }), 128))
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(VCol, {
                      cols: "12",
                      md: "6",
                      class: "right-panel d-flex align-center justify-center"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "login-card pa-8 elevation-0",
                          "max-width": "450",
                          width: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "Devunity Logo",
                                width: "300"
                              })
                            ]),
                            createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Sign In"),
                            createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Pick up where you left off"),
                            createVNode(VForm, {
                              onSubmit: withModifiers(handleSignin, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: form.value.email,
                                  "onUpdate:modelValue": ($event) => form.value.email = $event,
                                  label: "Email address",
                                  type: "email",
                                  variant: "outlined",
                                  "prepend-inner-icon": "mdi-email-outline",
                                  rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                  "hide-details": "auto"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                createVNode(VTextField, {
                                  modelValue: form.value.password,
                                  "onUpdate:modelValue": ($event) => form.value.password = $event,
                                  type: showPassword.value ? "text" : "password",
                                  label: "Password",
                                  variant: "outlined",
                                  "prepend-inner-icon": "mdi-lock-outline",
                                  "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                  "onClick:appendInner": togglePasswordVisibility,
                                  class: "mb-2 mt-4",
                                  rules: [(v) => !!v || "Password required"],
                                  "hide-details": "auto"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                createVNode("div", { class: "d-flex justify-space-between align-center mb-8" }, [
                                  createVNode(VCheckbox, {
                                    modelValue: rememberMe.value,
                                    "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                    label: "Remember me",
                                    color: "primary",
                                    density: "compact",
                                    "hide-details": ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode(VBtn, {
                                  block: "",
                                  color: "primary",
                                  type: "submit",
                                  loading: loading.value,
                                  "min-height": "48",
                                  class: "text-none font-weight-medium"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Sign in ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode("div", { class: "text-center mt-8" }, [
                                  createVNode("span", { class: "text-medium-emphasis" }, "Don't have an account?"),
                                  createVNode(_component_NuxtLink, {
                                    class: "text-decoration-none ml-1 font-weight-medium",
                                    to: "/signup"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Create account ")
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VRow, { class: "fill-height ma-0" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    md: "6",
                    class: "d-none d-md-flex left-panel align-center justify-center"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "left-content text-center" }, [
                        createVNode("h1", null, [
                          createVNode("img", {
                            src: _imports_0,
                            alt: "Devunity - Develop faster and better with DevUnity",
                            class: "logo mb-8",
                            width: "350"
                          }),
                          createVNode("span", { class: "sr-only" }, "Devunity - Develop faster and better with DevUnity")
                        ]),
                        createVNode("div", { class: "features-list" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(features.value, (feature, index) => {
                            return openBlock(), createBlock("div", {
                              key: index,
                              class: ["feature-item d-flex align-center", { "mb-6": index !== features.value.length - 1 }]
                            }, [
                              createVNode(VIcon, {
                                color: "primary",
                                size: "x-large",
                                class: "mr-3"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(feature.icon), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode("div", { class: "text-left" }, [
                                createVNode("p", { class: "text-body-1 font-weight-medium text-white mb-1" }, toDisplayString(feature.title), 1),
                                createVNode("p", { class: "text-body-2 text-white-darken-2" }, toDisplayString(feature.description), 1)
                              ])
                            ], 2);
                          }), 128))
                        ])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    cols: "12",
                    md: "6",
                    class: "right-panel d-flex align-center justify-center"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "login-card pa-8 elevation-0",
                        "max-width": "450",
                        width: "100%"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "Devunity Logo",
                              width: "300"
                            })
                          ]),
                          createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Sign In"),
                          createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Pick up where you left off"),
                          createVNode(VForm, {
                            onSubmit: withModifiers(handleSignin, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: form.value.email,
                                "onUpdate:modelValue": ($event) => form.value.email = $event,
                                label: "Email address",
                                type: "email",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-email-outline",
                                rules: [(v) => !!v || "Email required", (v) => /.+@.+\..+/.test(v) || "Invalid email format"],
                                "hide-details": "auto"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                              createVNode(VTextField, {
                                modelValue: form.value.password,
                                "onUpdate:modelValue": ($event) => form.value.password = $event,
                                type: showPassword.value ? "text" : "password",
                                label: "Password",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-lock-outline",
                                "append-inner-icon": showPassword.value ? "mdi-eye" : "mdi-eye-off",
                                "onClick:appendInner": togglePasswordVisibility,
                                class: "mb-2 mt-4",
                                rules: [(v) => !!v || "Password required"],
                                "hide-details": "auto"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                              createVNode("div", { class: "d-flex justify-space-between align-center mb-8" }, [
                                createVNode(VCheckbox, {
                                  modelValue: rememberMe.value,
                                  "onUpdate:modelValue": ($event) => rememberMe.value = $event,
                                  label: "Remember me",
                                  color: "primary",
                                  density: "compact",
                                  "hide-details": ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode(VBtn, {
                                block: "",
                                color: "primary",
                                type: "submit",
                                loading: loading.value,
                                "min-height": "48",
                                class: "text-none font-weight-medium"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Sign in ")
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode("div", { class: "text-center mt-8" }, [
                                createVNode("span", { class: "text-medium-emphasis" }, "Don't have an account?"),
                                createVNode(_component_NuxtLink, {
                                  class: "text-decoration-none ml-1 font-weight-medium",
                                  to: "/signup"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create account ")
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
      }, _parent));
      _push(ssrRenderComponent(Snackbar, {
        modelValue: showSnackbar.value,
        "onUpdate:modelValue": ($event) => showSnackbar.value = $event,
        color: snackbarColor.value,
        text: snackbarText.value,
        timeout: 3e3
      }, null, _parent));
      _push(`</section>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb563a3d"]]);

export { login as default };
//# sourceMappingURL=login.vue.mjs.map
