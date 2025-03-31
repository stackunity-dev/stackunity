import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public.mjs';
import { useRouter } from 'vue-router';
import { S as useUserStore, g as VIcon, f as VCard, e as VBtn, bl as VProgressCircular, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VForm } from './VForm.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'deep-pick-omit';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Create Account - DevUnity",
      meta: [
        { name: "author", content: "Nûr" },
        { name: "description", content: "Create your DevUnity account to access all features" },
        { name: "robots", content: "index,follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Create Account - DevUnity" },
        { name: "og:description", content: "Create your DevUnity account to access all features" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ],
      link: [
        { rel: "canonical", href: "https://devunity.com/signup" }
      ]
    });
    const router = useRouter();
    const userStore = useUserStore();
    const form = ref({
      username: "",
      email: "",
      password: ""
    });
    const features = ref([
      {
        icon: "mdi-email-newsletter",
        title: "Professional Templates",
        description: "A studio with customized Vuetify component templates",
        color: "primary"
      },
      {
        icon: "mdi-chart-box-outline",
        title: "Detailed Analytics",
        description: "Accessibility and SEO audit, test all aspects of your site",
        color: "secondary"
      },
      {
        icon: "mdi-account-group-outline",
        title: "Monitoring and SQL Generator",
        description: "Site monitoring and a ready-to-use SQL generator",
        color: "tertiary"
      },
      {
        icon: "mdi-shield-check-outline",
        title: "Clean Interface",
        description: "A simple and intuitive interface for easier use",
        color: "primary"
      }
    ]);
    const loading = ref(false);
    const showPassword = ref(false);
    const handleSignup = async () => {
      loading.value = true;
      try {
        await userStore.signUp(form.value.username, form.value.email, form.value.password);
        router.push("/dashboard");
      } catch (err) {
        console.error(err.message);
      } finally {
        loading.value = false;
      }
    };
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "auth-screen" }, _attrs))} data-v-ed49b4dd>`);
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
                    class: "d-none d-md-flex left-panel-signup align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="left-content text-center" data-v-ed49b4dd${_scopeId3}><h1 data-v-ed49b4dd${_scopeId3}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity - Develop faster and better with DevUnity" class="logo mb-8" width="350" data-v-ed49b4dd${_scopeId3}><span class="sr-only" data-v-ed49b4dd${_scopeId3}>Devunity - Develop faster and better with DevUnity</span></h1><div class="features-list" data-v-ed49b4dd${_scopeId3}><!--[-->`);
                        ssrRenderList(features.value, (feature, index) => {
                          _push4(`<div class="${ssrRenderClass([{ "mb-6": index !== features.value.length - 1 }, "feature-item d-flex align-center"])}" data-v-ed49b4dd${_scopeId3}>`);
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
                          _push4(`<div class="text-left" data-v-ed49b4dd${_scopeId3}><p class="text-body-1 font-weight-medium text-white mb-1" data-v-ed49b4dd${_scopeId3}>${ssrInterpolate(feature.title)}</p><p class="text-body-2 text-white-darken-2" data-v-ed49b4dd${_scopeId3}>${ssrInterpolate(feature.description)}</p></div></div>`);
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
                    class: "right-panel-signup d-flex align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "signup-card pa-8 elevation-0",
                          "max-width": "450",
                          width: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex justify-center d-md-none mb-8" data-v-ed49b4dd${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity Logo" width="350" data-v-ed49b4dd${_scopeId4}></div><h2 class="text-h5 font-weight-bold mb-2" data-v-ed49b4dd${_scopeId4}>Create an account</h2><p class="text-subtitle-1 text-medium-emphasis mb-8" data-v-ed49b4dd${_scopeId4}>Join Devunity and start your experience</p>`);
                              _push5(ssrRenderComponent(VForm, { onSubmit: handleSignup }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: form.value.username,
                                      "onUpdate:modelValue": ($event) => form.value.username = $event,
                                      label: "Username",
                                      type: "text",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-account-outline",
                                      class: "mb-4",
                                      rules: [(v) => !!v || "Username required"],
                                      "hide-details": "auto"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      label: "Email address",
                                      type: "email",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      class: "mb-4",
                                      rules: [
                                        (v) => !!v || "Email required",
                                        (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                      ],
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
                                      class: "mb-6",
                                      rules: [
                                        (v) => !!v || "Password required",
                                        (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                      ],
                                      "hide-details": "auto"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "48",
                                      class: "text-none font-weight-medium"
                                    }, {
                                      loader: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VProgressCircular, { indeterminate: "" }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VProgressCircular, { indeterminate: "" })
                                          ];
                                        }
                                      }),
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
                                    _push6(`<div class="text-center mt-8" data-v-ed49b4dd${_scopeId5}><span class="text-medium-emphasis" data-v-ed49b4dd${_scopeId5}>Already have an account?</span>`);
                                    _push6(ssrRenderComponent(_component_NuxtLink, {
                                      class: "text-decoration-none ml-1 font-weight-medium",
                                      to: "/login"
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
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        modelValue: form.value.username,
                                        "onUpdate:modelValue": ($event) => form.value.username = $event,
                                        label: "Username",
                                        type: "text",
                                        variant: "outlined",
                                        "prepend-inner-icon": "mdi-account-outline",
                                        class: "mb-4",
                                        rules: [(v) => !!v || "Username required"],
                                        "hide-details": "auto"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                      createVNode(VTextField, {
                                        modelValue: form.value.email,
                                        "onUpdate:modelValue": ($event) => form.value.email = $event,
                                        label: "Email address",
                                        type: "email",
                                        variant: "outlined",
                                        "prepend-inner-icon": "mdi-email-outline",
                                        class: "mb-4",
                                        rules: [
                                          (v) => !!v || "Email required",
                                          (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                        ],
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
                                        class: "mb-6",
                                        rules: [
                                          (v) => !!v || "Password required",
                                          (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                        ],
                                        "hide-details": "auto"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                      createVNode(VBtn, {
                                        block: "",
                                        color: "primary",
                                        type: "submit",
                                        loading: loading.value,
                                        "min-height": "48",
                                        class: "text-none font-weight-medium"
                                      }, {
                                        loader: withCtx(() => [
                                          createVNode(VProgressCircular, { indeterminate: "" })
                                        ]),
                                        default: withCtx(() => [
                                          createTextVNode(" Create account ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"]),
                                      createVNode("div", { class: "text-center mt-8" }, [
                                        createVNode("span", { class: "text-medium-emphasis" }, "Already have an account?"),
                                        createVNode(_component_NuxtLink, {
                                          class: "text-decoration-none ml-1 font-weight-medium",
                                          to: "/login"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Sign in ")
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
                                    width: "350"
                                  })
                                ]),
                                createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Create an account"),
                                createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Join Devunity and start your experience"),
                                createVNode(VForm, {
                                  onSubmit: withModifiers(handleSignup, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: form.value.username,
                                      "onUpdate:modelValue": ($event) => form.value.username = $event,
                                      label: "Username",
                                      type: "text",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-account-outline",
                                      class: "mb-4",
                                      rules: [(v) => !!v || "Username required"],
                                      "hide-details": "auto"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                    createVNode(VTextField, {
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      label: "Email address",
                                      type: "email",
                                      variant: "outlined",
                                      "prepend-inner-icon": "mdi-email-outline",
                                      class: "mb-4",
                                      rules: [
                                        (v) => !!v || "Email required",
                                        (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                      ],
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
                                      class: "mb-6",
                                      rules: [
                                        (v) => !!v || "Password required",
                                        (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                      ],
                                      "hide-details": "auto"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                    createVNode(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "48",
                                      class: "text-none font-weight-medium"
                                    }, {
                                      loader: withCtx(() => [
                                        createVNode(VProgressCircular, { indeterminate: "" })
                                      ]),
                                      default: withCtx(() => [
                                        createTextVNode(" Create account ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"]),
                                    createVNode("div", { class: "text-center mt-8" }, [
                                      createVNode("span", { class: "text-medium-emphasis" }, "Already have an account?"),
                                      createVNode(_component_NuxtLink, {
                                        class: "text-decoration-none ml-1 font-weight-medium",
                                        to: "/login"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Sign in ")
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
                            class: "signup-card pa-8 elevation-0",
                            "max-width": "450",
                            width: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                                createVNode("img", {
                                  src: _imports_0,
                                  alt: "Devunity Logo",
                                  width: "350"
                                })
                              ]),
                              createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Create an account"),
                              createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Join Devunity and start your experience"),
                              createVNode(VForm, {
                                onSubmit: withModifiers(handleSignup, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: form.value.username,
                                    "onUpdate:modelValue": ($event) => form.value.username = $event,
                                    label: "Username",
                                    type: "text",
                                    variant: "outlined",
                                    "prepend-inner-icon": "mdi-account-outline",
                                    class: "mb-4",
                                    rules: [(v) => !!v || "Username required"],
                                    "hide-details": "auto"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                  createVNode(VTextField, {
                                    modelValue: form.value.email,
                                    "onUpdate:modelValue": ($event) => form.value.email = $event,
                                    label: "Email address",
                                    type: "email",
                                    variant: "outlined",
                                    "prepend-inner-icon": "mdi-email-outline",
                                    class: "mb-4",
                                    rules: [
                                      (v) => !!v || "Email required",
                                      (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                    ],
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
                                    class: "mb-6",
                                    rules: [
                                      (v) => !!v || "Password required",
                                      (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                    ],
                                    "hide-details": "auto"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                  createVNode(VBtn, {
                                    block: "",
                                    color: "primary",
                                    type: "submit",
                                    loading: loading.value,
                                    "min-height": "48",
                                    class: "text-none font-weight-medium"
                                  }, {
                                    loader: withCtx(() => [
                                      createVNode(VProgressCircular, { indeterminate: "" })
                                    ]),
                                    default: withCtx(() => [
                                      createTextVNode(" Create account ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"]),
                                  createVNode("div", { class: "text-center mt-8" }, [
                                    createVNode("span", { class: "text-medium-emphasis" }, "Already have an account?"),
                                    createVNode(_component_NuxtLink, {
                                      class: "text-decoration-none ml-1 font-weight-medium",
                                      to: "/login"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Sign in ")
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
                      class: "d-none d-md-flex left-panel-signup align-center justify-center"
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
                      class: "right-panel-signup d-flex align-center justify-center"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "signup-card pa-8 elevation-0",
                          "max-width": "450",
                          width: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                              createVNode("img", {
                                src: _imports_0,
                                alt: "Devunity Logo",
                                width: "350"
                              })
                            ]),
                            createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Create an account"),
                            createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Join Devunity and start your experience"),
                            createVNode(VForm, {
                              onSubmit: withModifiers(handleSignup, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: form.value.username,
                                  "onUpdate:modelValue": ($event) => form.value.username = $event,
                                  label: "Username",
                                  type: "text",
                                  variant: "outlined",
                                  "prepend-inner-icon": "mdi-account-outline",
                                  class: "mb-4",
                                  rules: [(v) => !!v || "Username required"],
                                  "hide-details": "auto"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                createVNode(VTextField, {
                                  modelValue: form.value.email,
                                  "onUpdate:modelValue": ($event) => form.value.email = $event,
                                  label: "Email address",
                                  type: "email",
                                  variant: "outlined",
                                  "prepend-inner-icon": "mdi-email-outline",
                                  class: "mb-4",
                                  rules: [
                                    (v) => !!v || "Email required",
                                    (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                  ],
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
                                  class: "mb-6",
                                  rules: [
                                    (v) => !!v || "Password required",
                                    (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                  ],
                                  "hide-details": "auto"
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                                createVNode(VBtn, {
                                  block: "",
                                  color: "primary",
                                  type: "submit",
                                  loading: loading.value,
                                  "min-height": "48",
                                  class: "text-none font-weight-medium"
                                }, {
                                  loader: withCtx(() => [
                                    createVNode(VProgressCircular, { indeterminate: "" })
                                  ]),
                                  default: withCtx(() => [
                                    createTextVNode(" Create account ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode("div", { class: "text-center mt-8" }, [
                                  createVNode("span", { class: "text-medium-emphasis" }, "Already have an account?"),
                                  createVNode(_component_NuxtLink, {
                                    class: "text-decoration-none ml-1 font-weight-medium",
                                    to: "/login"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Sign in ")
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
                    class: "d-none d-md-flex left-panel-signup align-center justify-center"
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
                    class: "right-panel-signup d-flex align-center justify-center"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "signup-card pa-8 elevation-0",
                        "max-width": "450",
                        width: "100%"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex justify-center d-md-none mb-8" }, [
                            createVNode("img", {
                              src: _imports_0,
                              alt: "Devunity Logo",
                              width: "350"
                            })
                          ]),
                          createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Create an account"),
                          createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Join Devunity and start your experience"),
                          createVNode(VForm, {
                            onSubmit: withModifiers(handleSignup, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: form.value.username,
                                "onUpdate:modelValue": ($event) => form.value.username = $event,
                                label: "Username",
                                type: "text",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-account-outline",
                                class: "mb-4",
                                rules: [(v) => !!v || "Username required"],
                                "hide-details": "auto"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                              createVNode(VTextField, {
                                modelValue: form.value.email,
                                "onUpdate:modelValue": ($event) => form.value.email = $event,
                                label: "Email address",
                                type: "email",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-email-outline",
                                class: "mb-4",
                                rules: [
                                  (v) => !!v || "Email required",
                                  (v) => /.+@.+\..+/.test(v) || "Invalid email format"
                                ],
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
                                class: "mb-6",
                                rules: [
                                  (v) => !!v || "Password required",
                                  (v) => v.length >= 8 || "Password must contain at least 8 characters"
                                ],
                                "hide-details": "auto"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "rules"]),
                              createVNode(VBtn, {
                                block: "",
                                color: "primary",
                                type: "submit",
                                loading: loading.value,
                                "min-height": "48",
                                class: "text-none font-weight-medium"
                              }, {
                                loader: withCtx(() => [
                                  createVNode(VProgressCircular, { indeterminate: "" })
                                ]),
                                default: withCtx(() => [
                                  createTextVNode(" Create account ")
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode("div", { class: "text-center mt-8" }, [
                                createVNode("span", { class: "text-medium-emphasis" }, "Already have an account?"),
                                createVNode(_component_NuxtLink, {
                                  class: "text-decoration-none ml-1 font-weight-medium",
                                  to: "/login"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Sign in ")
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
      _push(`</section>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const signup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ed49b4dd"]]);

export { signup as default };
//# sourceMappingURL=signup.vue.mjs.map
