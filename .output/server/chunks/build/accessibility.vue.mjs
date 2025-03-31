import { p as premiumFeatures } from './PremiumFeature.vue.mjs';
import { toRef, computed, createVNode, mergeProps, defineComponent, ref, withCtx, createTextVNode, withKeys, unref, createBlock, openBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { k as genericComponent, p as propsFactory, E as useBackgroundColor, x as useDimension, G as useElevation, D as provideTheme, aI as useLocale, b0 as wrapInArray, s as useRender, K as makeThemeProps, M as makeElevationProps, z as makeDimensionProps, S as useUserStore, V as VApp, f as VCard, $ as VCardTitle, Y as VCardText, e as VBtn, g as VIcon, h as VDivider } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VChip } from './VChip.mjs';
import 'vue-router';
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
import 'pinia';
import 'pinia-plugin-persistedstate';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const rootTypes = {
  actions: "button@2",
  article: "heading, paragraph",
  avatar: "avatar",
  button: "button",
  card: "image, heading",
  "card-avatar": "image, list-item-avatar",
  chip: "chip",
  "date-picker": "list-item, heading, divider, date-picker-options, date-picker-days, actions",
  "date-picker-options": "text, avatar@2",
  "date-picker-days": "avatar@28",
  divider: "divider",
  heading: "heading",
  image: "image",
  "list-item": "text",
  "list-item-avatar": "avatar, text",
  "list-item-two-line": "sentences",
  "list-item-avatar-two-line": "avatar, sentences",
  "list-item-three-line": "paragraph",
  "list-item-avatar-three-line": "avatar, paragraph",
  ossein: "ossein",
  paragraph: "text@3",
  sentences: "text@2",
  subtitle: "text",
  table: "table-heading, table-thead, table-tbody, table-tfoot",
  "table-heading": "chip, text",
  "table-thead": "heading@6",
  "table-tbody": "table-row-divider@6",
  "table-row-divider": "table-row, divider",
  "table-row": "text@6",
  "table-tfoot": "text@2, avatar@2",
  text: "text"
};
function genBone(type) {
  let children = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return createVNode("div", {
    "class": ["v-skeleton-loader__bone", `v-skeleton-loader__${type}`]
  }, [children]);
}
function genBones(bone) {
  const [type, length] = bone.split("@");
  return Array.from({
    length
  }).map(() => genStructure(type));
}
function genStructure(type) {
  let children = [];
  if (!type) return children;
  const bone = rootTypes[type];
  if (type === bone) ;
  else if (type.includes(",")) return mapBones(type);
  else if (type.includes("@")) return genBones(type);
  else if (bone.includes(",")) children = mapBones(bone);
  else if (bone.includes("@")) children = genBones(bone);
  else if (bone) children.push(genStructure(bone));
  return [genBone(type, children)];
}
function mapBones(bones) {
  return bones.replace(/\s/g, "").split(",").map(genStructure);
}
const makeVSkeletonLoaderProps = propsFactory({
  boilerplate: Boolean,
  color: String,
  loading: Boolean,
  loadingText: {
    type: String,
    default: "$vuetify.loading"
  },
  type: {
    type: [String, Array],
    default: "ossein"
  },
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeThemeProps()
}, "VSkeletonLoader");
const VSkeletonLoader = genericComponent()({
  name: "VSkeletonLoader",
  props: makeVSkeletonLoaderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      t
    } = useLocale();
    const items = computed(() => genStructure(wrapInArray(props.type).join(",")));
    useRender(() => {
      var _a;
      const isLoading = !slots.default || props.loading;
      const loadingProps = props.boilerplate || !isLoading ? {} : {
        ariaLive: "polite",
        ariaLabel: t(props.loadingText),
        role: "alert"
      };
      return createVNode("div", mergeProps({
        "class": ["v-skeleton-loader", {
          "v-skeleton-loader--boilerplate": props.boilerplate
        }, themeClasses.value, backgroundColorClasses.value, elevationClasses.value],
        "style": [backgroundColorStyles.value, isLoading ? dimensionStyles.value : {}]
      }, loadingProps), [isLoading ? items.value : (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    });
    return {};
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "accessibility",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    useHead({
      title: "Accessibility - DevUnity",
      meta: [
        { name: "description", content: "Accessibility tools for web developers" },
        { name: "keywords", content: "accessibility, web accessibility, web accessibility tools, accessibility testing, web accessibility testing, accessibility guidelines, web accessibility guidelines, accessibility best practices, web accessibility best practices" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Accessibility - DevUnity" },
        { name: "og:description", content: "Accessibility tools for web developers" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const url = ref("");
    const loading = ref(false);
    const auditData = ref(null);
    const textColor = ref("rgb(33, 33, 33)");
    const backgroundColor = ref("rgb(255, 255, 255)");
    const contrast = ref(0);
    const getContrast = async () => {
      const srgbText = extractRGB(textColor.value);
      const srgbBackground = extractRGB(backgroundColor.value);
      console.log(srgbText, srgbBackground);
      if (srgbText && srgbBackground) {
        const contrastRatio = calculateContrastRatio(srgbText, srgbBackground);
        contrast.value = contrastRatio;
        console.log(contrastRatio);
      }
    };
    function extractRGB(rgb) {
      const trimmed = rgb.trim();
      if (trimmed.toLowerCase().startsWith("rgb(")) {
        const match = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (match) {
          return {
            red: parseInt(match[1], 10) / 255,
            green: parseInt(match[2], 10) / 255,
            blue: parseInt(match[3], 10) / 255
          };
        }
      } else {
        const parts = trimmed.split(/\s+/);
        if (parts.length === 3) {
          return {
            red: parseInt(parts[0], 10) / 255,
            green: parseInt(parts[1], 10) / 255,
            blue: parseInt(parts[2], 10) / 255
          };
        }
      }
      return null;
    }
    function calculateLuminance(srgb) {
      const transform = (channel) => channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      const R = transform(srgb.red);
      const G = transform(srgb.green);
      const B = transform(srgb.blue);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    function calculateContrastRatio(srgbText, srgbBackground) {
      const luminanceText = calculateLuminance(srgbText);
      const luminanceBackground = calculateLuminance(srgbBackground);
      const brighter = Math.max(luminanceText, luminanceBackground);
      const darker = Math.min(luminanceText, luminanceBackground);
      return (brighter + 0.05) / (darker + 0.05);
    }
    const getAudit = async () => {
      loading.value = true;
      console.log(url.value);
      const response = await $fetch("/api/audit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userStore.token}`
        },
        body: { url: url.value }
      });
      if (response) {
        auditData.value = response.data;
        console.log(auditData.value);
        loading.value = false;
      } else {
        console.error("Error retrieving audit data");
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_premium_feature = premiumFeatures;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "mb-8 pa-4 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, { class: "text-h6 pb-2" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Analyze a website`);
                                  } else {
                                    return [
                                      createTextVNode("Analyze a website")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "9"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: url.value,
                                                  "onUpdate:modelValue": ($event) => url.value = $event,
                                                  label: "Website URL to analyze",
                                                  placeholder: "https://example.com",
                                                  "prepend-inner-icon": "mdi-web",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  clearable: "",
                                                  onKeyup: getAudit
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: url.value,
                                                    "onUpdate:modelValue": ($event) => url.value = $event,
                                                    label: "Website URL to analyze",
                                                    placeholder: "https://example.com",
                                                    "prepend-inner-icon": "mdi-web",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    clearable: "",
                                                    onKeyup: withKeys(getAudit, ["enter"])
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "3",
                                            class: "d-flex align-center"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                if (unref(userStore).user.isPremium) {
                                                  _push8(ssrRenderComponent(VBtn, {
                                                    onClick: getAudit,
                                                    color: "primary",
                                                    block: "",
                                                    loading: loading.value,
                                                    "prepend-icon": "mdi-magnify"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` Analyze `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" Analyze ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  _push8(ssrRenderComponent(_component_premium_feature, {
                                                    type: "button",
                                                    title: "Analyze",
                                                    icon: "mdi-magnify",
                                                    "feature-key": "audit"
                                                  }, null, _parent8, _scopeId7));
                                                }
                                              } else {
                                                return [
                                                  unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                                    key: 0,
                                                    onClick: getAudit,
                                                    color: "primary",
                                                    block: "",
                                                    loading: loading.value,
                                                    "prepend-icon": "mdi-magnify"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Analyze ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                                    key: 1,
                                                    type: "button",
                                                    title: "Analyze",
                                                    icon: "mdi-magnify",
                                                    "feature-key": "audit"
                                                  }))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "9"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: url.value,
                                                  "onUpdate:modelValue": ($event) => url.value = $event,
                                                  label: "Website URL to analyze",
                                                  placeholder: "https://example.com",
                                                  "prepend-inner-icon": "mdi-web",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  clearable: "",
                                                  onKeyup: withKeys(getAudit, ["enter"])
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "3",
                                              class: "d-flex align-center"
                                            }, {
                                              default: withCtx(() => [
                                                unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                                  key: 0,
                                                  onClick: getAudit,
                                                  color: "primary",
                                                  block: "",
                                                  loading: loading.value,
                                                  "prepend-icon": "mdi-magnify"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Analyze ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                                  key: 1,
                                                  type: "button",
                                                  title: "Analyze",
                                                  icon: "mdi-magnify",
                                                  "feature-key": "audit"
                                                }))
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
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "9"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: url.value,
                                                "onUpdate:modelValue": ($event) => url.value = $event,
                                                label: "Website URL to analyze",
                                                placeholder: "https://example.com",
                                                "prepend-inner-icon": "mdi-web",
                                                variant: "outlined",
                                                density: "comfortable",
                                                clearable: "",
                                                onKeyup: withKeys(getAudit, ["enter"])
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "3",
                                            class: "d-flex align-center"
                                          }, {
                                            default: withCtx(() => [
                                              unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                                key: 0,
                                                onClick: getAudit,
                                                color: "primary",
                                                block: "",
                                                loading: loading.value,
                                                "prepend-icon": "mdi-magnify"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Analyze ")
                                                ]),
                                                _: 1
                                              }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                                key: 1,
                                                type: "button",
                                                title: "Analyze",
                                                icon: "mdi-magnify",
                                                "feature-key": "audit"
                                              }))
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
                                createVNode(VCardTitle, { class: "text-h6 pb-2" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Analyze a website")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "9"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: url.value,
                                              "onUpdate:modelValue": ($event) => url.value = $event,
                                              label: "Website URL to analyze",
                                              placeholder: "https://example.com",
                                              "prepend-inner-icon": "mdi-web",
                                              variant: "outlined",
                                              density: "comfortable",
                                              clearable: "",
                                              onKeyup: withKeys(getAudit, ["enter"])
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "3",
                                          class: "d-flex align-center"
                                        }, {
                                          default: withCtx(() => [
                                            unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                              key: 0,
                                              onClick: getAudit,
                                              color: "primary",
                                              block: "",
                                              loading: loading.value,
                                              "prepend-icon": "mdi-magnify"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Analyze ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                              key: 1,
                                              type: "button",
                                              title: "Analyze",
                                              icon: "mdi-magnify",
                                              "feature-key": "audit"
                                            }))
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
                        if (loading.value) {
                          _push4(ssrRenderComponent(VSkeletonLoader, {
                            type: "card, article, actions",
                            class: "mb-6"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (auditData.value && !loading.value) {
                          _push4(`<!--[-->`);
                          _push4(ssrRenderComponent(VCard, {
                            class: "mb-6 pa-4 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VRow, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VCol, {
                                        cols: "12",
                                        md: "8"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          var _a, _b, _c, _d, _e, _f;
                                          if (_push7) {
                                            _push7(`<h2 class="text-h5 d-flex align-center mb-4"${_scopeId6}>`);
                                            _push7(ssrRenderComponent(VIcon, {
                                              size: "large",
                                              color: "primary",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-web`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-web")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(` ${ssrInterpolate(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site")}</h2><p class="mb-2"${_scopeId6}><strong${_scopeId6}>URL: </strong><a${ssrRenderAttr("href", (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl)} target="_blank" class="text-decoration-none text-primary"${_scopeId6}>${ssrInterpolate((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl)} `);
                                            _push7(ssrRenderComponent(VIcon, { size: "small" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-open-in-new`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-open-in-new")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(`</a></p>`);
                                            _push7(ssrRenderComponent(VChip, {
                                              class: "mr-2 mb-2",
                                              color: "success",
                                              size: "small"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                var _a2, _b2;
                                                if (_push8) {
                                                  _push8(` Analysis in ${ssrInterpolate((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time)}s `);
                                                } else {
                                                  return [
                                                    createTextVNode(" Analysis in " + toDisplayString((_b2 = auditData.value.statistics) == null ? void 0 : _b2.time) + "s ", 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VChip, {
                                              class: "mb-2",
                                              color: "info",
                                              size: "small"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                var _a2, _b2;
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements)} elements analyzed `);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString((_b2 = auditData.value.statistics) == null ? void 0 : _b2.totalelements) + " elements analyzed ", 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                                createVNode(VIcon, {
                                                  size: "large",
                                                  color: "primary",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-web")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" " + toDisplayString(((_d = auditData.value.statistics) == null ? void 0 : _d.pagetitle) || "Analyzed Site"), 1)
                                              ]),
                                              createVNode("p", { class: "mb-2" }, [
                                                createVNode("strong", null, "URL: "),
                                                createVNode("a", {
                                                  href: (_e = auditData.value.statistics) == null ? void 0 : _e.pageurl,
                                                  target: "_blank",
                                                  class: "text-decoration-none text-primary"
                                                }, [
                                                  createTextVNode(toDisplayString((_f = auditData.value.statistics) == null ? void 0 : _f.pageurl) + " ", 1),
                                                  createVNode(VIcon, { size: "small" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-open-in-new")
                                                    ]),
                                                    _: 1
                                                  })
                                                ], 8, ["href"])
                                              ]),
                                              createVNode(VChip, {
                                                class: "mr-2 mb-2",
                                                color: "success",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => {
                                                  var _a2;
                                                  return [
                                                    createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                                  ];
                                                }),
                                                _: 1
                                              }),
                                              createVNode(VChip, {
                                                class: "mb-2",
                                                color: "info",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => {
                                                  var _a2;
                                                  return [
                                                    createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                                  ];
                                                }),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, {
                                        cols: "12",
                                        md: "4",
                                        class: "d-flex align-center justify-center"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          var _a, _b;
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VBtn, {
                                              variant: "elevated",
                                              color: "primary",
                                              href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                              target: "_blank",
                                              "prepend-icon": "mdi-link-variant",
                                              "append-icon": "mdi-open-in-new",
                                              class: "px-4"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(` View complete WAVE report `);
                                                } else {
                                                  return [
                                                    createTextVNode(" View complete WAVE report ")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VBtn, {
                                                variant: "elevated",
                                                color: "primary",
                                                href: (_b = auditData.value.statistics) == null ? void 0 : _b.waveurl,
                                                target: "_blank",
                                                "prepend-icon": "mdi-link-variant",
                                                "append-icon": "mdi-open-in-new",
                                                class: "px-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" View complete WAVE report ")
                                                ]),
                                                _: 1
                                              }, 8, ["href"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "8"
                                        }, {
                                          default: withCtx(() => {
                                            var _a, _b, _c;
                                            return [
                                              createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                                createVNode(VIcon, {
                                                  size: "large",
                                                  color: "primary",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-web")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" " + toDisplayString(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site"), 1)
                                              ]),
                                              createVNode("p", { class: "mb-2" }, [
                                                createVNode("strong", null, "URL: "),
                                                createVNode("a", {
                                                  href: (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl,
                                                  target: "_blank",
                                                  class: "text-decoration-none text-primary"
                                                }, [
                                                  createTextVNode(toDisplayString((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl) + " ", 1),
                                                  createVNode(VIcon, { size: "small" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-open-in-new")
                                                    ]),
                                                    _: 1
                                                  })
                                                ], 8, ["href"])
                                              ]),
                                              createVNode(VChip, {
                                                class: "mr-2 mb-2",
                                                color: "success",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => {
                                                  var _a2;
                                                  return [
                                                    createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                                  ];
                                                }),
                                                _: 1
                                              }),
                                              createVNode(VChip, {
                                                class: "mb-2",
                                                color: "info",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => {
                                                  var _a2;
                                                  return [
                                                    createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                                  ];
                                                }),
                                                _: 1
                                              })
                                            ];
                                          }),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "4",
                                          class: "d-flex align-center justify-center"
                                        }, {
                                          default: withCtx(() => {
                                            var _a;
                                            return [
                                              createVNode(VBtn, {
                                                variant: "elevated",
                                                color: "primary",
                                                href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                                target: "_blank",
                                                "prepend-icon": "mdi-link-variant",
                                                "append-icon": "mdi-open-in-new",
                                                class: "px-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" View complete WAVE report ")
                                                ]),
                                                _: 1
                                              }, 8, ["href"])
                                            ];
                                          }),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "8"
                                      }, {
                                        default: withCtx(() => {
                                          var _a, _b, _c;
                                          return [
                                            createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                              createVNode(VIcon, {
                                                size: "large",
                                                color: "primary",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-web")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" " + toDisplayString(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site"), 1)
                                            ]),
                                            createVNode("p", { class: "mb-2" }, [
                                              createVNode("strong", null, "URL: "),
                                              createVNode("a", {
                                                href: (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl,
                                                target: "_blank",
                                                class: "text-decoration-none text-primary"
                                              }, [
                                                createTextVNode(toDisplayString((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl) + " ", 1),
                                                createVNode(VIcon, { size: "small" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-open-in-new")
                                                  ]),
                                                  _: 1
                                                })
                                              ], 8, ["href"])
                                            ]),
                                            createVNode(VChip, {
                                              class: "mr-2 mb-2",
                                              color: "success",
                                              size: "small"
                                            }, {
                                              default: withCtx(() => {
                                                var _a2;
                                                return [
                                                  createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                                ];
                                              }),
                                              _: 1
                                            }),
                                            createVNode(VChip, {
                                              class: "mb-2",
                                              color: "info",
                                              size: "small"
                                            }, {
                                              default: withCtx(() => {
                                                var _a2;
                                                return [
                                                  createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                                ];
                                              }),
                                              _: 1
                                            })
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "4",
                                        class: "d-flex align-center justify-center"
                                      }, {
                                        default: withCtx(() => {
                                          var _a;
                                          return [
                                            createVNode(VBtn, {
                                              variant: "elevated",
                                              color: "primary",
                                              href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                              target: "_blank",
                                              "prepend-icon": "mdi-link-variant",
                                              "append-icon": "mdi-open-in-new",
                                              class: "px-4"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" View complete WAVE report ")
                                              ]),
                                              _: 1
                                            }, 8, ["href"])
                                          ];
                                        }),
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
                          _push4(ssrRenderComponent(VCard, {
                            class: "mb-8 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardTitle, { class: "text-h6 pa-4 bg-primary text-white" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Analysis Results `);
                                    } else {
                                      return [
                                        createTextVNode(" Analysis Results ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VRow, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(auditData.value.categories, (category, key) => {
                                              _push7(ssrRenderComponent(VCol, {
                                                key,
                                                cols: "12",
                                                sm: "6",
                                                md: "4"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(VCard, {
                                                      class: "h-100",
                                                      variant: "outlined",
                                                      color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(VCardText, { class: "d-flex align-center" }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(VIcon, {
                                                                  color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(`${ssrInterpolate(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle")}`);
                                                                    } else {
                                                                      return [
                                                                        createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                                _push10(`<div${_scopeId9}><div class="font-weight-medium"${_scopeId9}>${ssrInterpolate(category.description)}</div><div class="text-subtitle-2"${_scopeId9}>${ssrInterpolate(category.count)} elements</div></div>`);
                                                              } else {
                                                                return [
                                                                  createVNode(VIcon, {
                                                                    color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"]),
                                                                  createVNode("div", null, [
                                                                    createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                                    createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                                  ])
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(VCardText, { class: "d-flex align-center" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode("div", null, [
                                                                  createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                                  createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                                ])
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
                                                        class: "h-100",
                                                        variant: "outlined",
                                                        color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, { class: "d-flex align-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("div", null, [
                                                                createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                                createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                                return openBlock(), createBlock(VCol, {
                                                  key,
                                                  cols: "12",
                                                  sm: "6",
                                                  md: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      class: "h-100",
                                                      variant: "outlined",
                                                      color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, { class: "d-flex align-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode("div", null, [
                                                              createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                              createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                              return openBlock(), createBlock(VCol, {
                                                key,
                                                cols: "12",
                                                sm: "6",
                                                md: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    class: "h-100",
                                                    variant: "outlined",
                                                    color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "d-flex align-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                            class: "mr-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode("div", null, [
                                                            createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                            createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
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
                                  createVNode(VCardTitle, { class: "text-h6 pa-4 bg-primary text-white" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Analysis Results ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                            return openBlock(), createBlock(VCol, {
                                              key,
                                              cols: "12",
                                              sm: "6",
                                              md: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  class: "h-100",
                                                  variant: "outlined",
                                                  color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "d-flex align-center" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                          class: "mr-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode("div", null, [
                                                          createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                          createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
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
                          _push4(`<!--]-->`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(VCard, {
                          class: "mb-8 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, { class: "text-h6 pa-4 bg-secondary text-white" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, {
                                      size: "large",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-contrast-circle`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-contrast-circle")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` Contrast Checker `);
                                  } else {
                                    return [
                                      createVNode(VIcon, {
                                        size: "large",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-contrast-circle")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Contrast Checker ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
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
                                                              modelValue: textColor.value,
                                                              "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                              label: "Text color",
                                                              placeholder: "rgb(0, 0, 0)",
                                                              variant: "outlined",
                                                              density: "comfortable",
                                                              "prepend-inner-icon": "mdi-format-color-text"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VTextField, {
                                                                modelValue: textColor.value,
                                                                "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                                label: "Text color",
                                                                placeholder: "rgb(0, 0, 0)",
                                                                variant: "outlined",
                                                                density: "comfortable",
                                                                "prepend-inner-icon": "mdi-format-color-text"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                                                              modelValue: backgroundColor.value,
                                                              "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                              label: "Background color",
                                                              placeholder: "rgb(255, 255, 255)",
                                                              variant: "outlined",
                                                              density: "comfortable",
                                                              "prepend-inner-icon": "mdi-format-color-fill"
                                                            }, null, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VTextField, {
                                                                modelValue: backgroundColor.value,
                                                                "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                                label: "Background color",
                                                                placeholder: "rgb(255, 255, 255)",
                                                                variant: "outlined",
                                                                density: "comfortable",
                                                                "prepend-inner-icon": "mdi-format-color-fill"
                                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        class: "d-flex justify-center"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VBtn, {
                                                              onClick: getContrast,
                                                              color: "primary",
                                                              "prepend-icon": "mdi-calculator",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(` Calculate contrast `);
                                                                } else {
                                                                  return [
                                                                    createTextVNode(" Calculate contrast ")
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VBtn, {
                                                                onClick: getContrast,
                                                                color: "primary",
                                                                "prepend-icon": "mdi-calculator",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" Calculate contrast ")
                                                                ]),
                                                                _: 1
                                                              })
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
                                                              modelValue: textColor.value,
                                                              "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                              label: "Text color",
                                                              placeholder: "rgb(0, 0, 0)",
                                                              variant: "outlined",
                                                              density: "comfortable",
                                                              "prepend-inner-icon": "mdi-format-color-text"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "6"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTextField, {
                                                              modelValue: backgroundColor.value,
                                                              "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                              label: "Background color",
                                                              placeholder: "rgb(255, 255, 255)",
                                                              variant: "outlined",
                                                              density: "comfortable",
                                                              "prepend-inner-icon": "mdi-format-color-fill"
                                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          class: "d-flex justify-center"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VBtn, {
                                                              onClick: getContrast,
                                                              color: "primary",
                                                              "prepend-icon": "mdi-calculator",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" Calculate contrast ")
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
                                                            modelValue: textColor.value,
                                                            "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                            label: "Text color",
                                                            placeholder: "rgb(0, 0, 0)",
                                                            variant: "outlined",
                                                            density: "comfortable",
                                                            "prepend-inner-icon": "mdi-format-color-text"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTextField, {
                                                            modelValue: backgroundColor.value,
                                                            "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                            label: "Background color",
                                                            placeholder: "rgb(255, 255, 255)",
                                                            variant: "outlined",
                                                            density: "comfortable",
                                                            "prepend-inner-icon": "mdi-format-color-fill"
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        class: "d-flex justify-center"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VBtn, {
                                                            onClick: getContrast,
                                                            color: "primary",
                                                            "prepend-icon": "mdi-calculator",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" Calculate contrast ")
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
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VCard, {
                                                  color: backgroundColor.value,
                                                  class: "pa-4 rounded-lg h-100",
                                                  elevation: "1"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCardTitle, {
                                                        style: `color: ${textColor.value}`,
                                                        class: "text-center"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(` Contrast Preview `);
                                                          } else {
                                                            return [
                                                              createTextVNode(" Contrast Preview ")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCardText, {
                                                        style: `color: ${textColor.value}`,
                                                        class: "text-center"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<div class="mb-4"${_scopeId9}><p class="text-body-1 mb-2"${_scopeId9}>Normal Text (16px)</p><p class="text-body-1"${_scopeId9}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div><div class="mb-4"${_scopeId9}><p class="text-body-1 mb-2"${_scopeId9}>Large Text (18px+)</p><p class="text-h6"${_scopeId9}>Lorem ipsum dolor sit amet</p></div><div class="mb-4"${_scopeId9}><p class="text-body-1 mb-2"${_scopeId9}>Bold Text</p><p class="text-body-1 font-weight-bold"${_scopeId9}>Lorem ipsum dolor sit amet</p></div><div class="mb-4"${_scopeId9}><p class="text-body-1 mb-2"${_scopeId9}>Italic Text</p><p class="text-body-1 font-italic"${_scopeId9}>Lorem ipsum dolor sit amet</p></div><div${_scopeId9}><p class="text-body-1 mb-2"${_scopeId9}>Link Example</p><a style="${ssrRenderStyle(`color: ${textColor.value}`)}" href="#" class="text-decoration-underline"${_scopeId9}>Lorem ipsum dolor</a></div>`);
                                                          } else {
                                                            return [
                                                              createVNode("div", { class: "mb-4" }, [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                                createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                              ]),
                                                              createVNode("div", { class: "mb-4" }, [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                                createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                              ]),
                                                              createVNode("div", { class: "mb-4" }, [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                                createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                              ]),
                                                              createVNode("div", { class: "mb-4" }, [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                                createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                              ]),
                                                              createVNode("div", null, [
                                                                createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                                createVNode("a", {
                                                                  style: `color: ${textColor.value}`,
                                                                  href: "#",
                                                                  class: "text-decoration-underline"
                                                                }, "Lorem ipsum dolor", 4)
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCardTitle, {
                                                          style: `color: ${textColor.value}`,
                                                          class: "text-center"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Contrast Preview ")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["style"]),
                                                        createVNode(VCardText, {
                                                          style: `color: ${textColor.value}`,
                                                          class: "text-center"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "mb-4" }, [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                              createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                            ]),
                                                            createVNode("div", { class: "mb-4" }, [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                              createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                            ]),
                                                            createVNode("div", { class: "mb-4" }, [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                              createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                            ]),
                                                            createVNode("div", { class: "mb-4" }, [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                              createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                            ]),
                                                            createVNode("div", null, [
                                                              createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                              createVNode("a", {
                                                                style: `color: ${textColor.value}`,
                                                                href: "#",
                                                                class: "text-decoration-underline"
                                                              }, "Lorem ipsum dolor", 4)
                                                            ])
                                                          ]),
                                                          _: 1
                                                        }, 8, ["style"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VCard, {
                                                    color: backgroundColor.value,
                                                    class: "pa-4 rounded-lg h-100",
                                                    elevation: "1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, {
                                                        style: `color: ${textColor.value}`,
                                                        class: "text-center"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" Contrast Preview ")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["style"]),
                                                      createVNode(VCardText, {
                                                        style: `color: ${textColor.value}`,
                                                        class: "text-center"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "mb-4" }, [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                            createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                          ]),
                                                          createVNode("div", { class: "mb-4" }, [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                            createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                          ]),
                                                          createVNode("div", { class: "mb-4" }, [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                            createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                          ]),
                                                          createVNode("div", { class: "mb-4" }, [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                            createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                          ]),
                                                          createVNode("div", null, [
                                                            createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                            createVNode("a", {
                                                              style: `color: ${textColor.value}`,
                                                              href: "#",
                                                              class: "text-decoration-underline"
                                                            }, "Lorem ipsum dolor", 4)
                                                          ])
                                                        ]),
                                                        _: 1
                                                      }, 8, ["style"])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
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
                                                          modelValue: textColor.value,
                                                          "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                          label: "Text color",
                                                          placeholder: "rgb(0, 0, 0)",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          "prepend-inner-icon": "mdi-format-color-text"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "6"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTextField, {
                                                          modelValue: backgroundColor.value,
                                                          "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                          label: "Background color",
                                                          placeholder: "rgb(255, 255, 255)",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          "prepend-inner-icon": "mdi-format-color-fill"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      class: "d-flex justify-center"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VBtn, {
                                                          onClick: getContrast,
                                                          color: "primary",
                                                          "prepend-icon": "mdi-calculator",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" Calculate contrast ")
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
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  color: backgroundColor.value,
                                                  class: "pa-4 rounded-lg h-100",
                                                  elevation: "1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, {
                                                      style: `color: ${textColor.value}`,
                                                      class: "text-center"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Contrast Preview ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["style"]),
                                                    createVNode(VCardText, {
                                                      style: `color: ${textColor.value}`,
                                                      class: "text-center"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "mb-4" }, [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                          createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                        ]),
                                                        createVNode("div", { class: "mb-4" }, [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                          createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                        ]),
                                                        createVNode("div", { class: "mb-4" }, [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                          createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                        ]),
                                                        createVNode("div", { class: "mb-4" }, [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                          createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                        ]),
                                                        createVNode("div", null, [
                                                          createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                          createVNode("a", {
                                                            style: `color: ${textColor.value}`,
                                                            href: "#",
                                                            class: "text-decoration-underline"
                                                          }, "Lorem ipsum dolor", 4)
                                                        ])
                                                      ]),
                                                      _: 1
                                                    }, 8, ["style"])
                                                  ]),
                                                  _: 1
                                                }, 8, ["color"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    if (contrast.value > 0) {
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (contrast.value > 0) {
                                      _push6(ssrRenderComponent(VRow, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VCol, {
                                              cols: "12",
                                              md: "6",
                                              class: "mx-auto"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VCard, {
                                                    class: "pa-4 rounded-lg",
                                                    elevation: "3"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VCardTitle, { class: "text-center" }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<div class="text-h4 font-weight-bold mb-2"${_scopeId9}>Contrast Ratio: ${ssrInterpolate(Math.round(contrast.value * 100) / 100)}:1 </div>`);
                                                              _push10(ssrRenderComponent(VChip, {
                                                                color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`${ssrInterpolate(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast")}`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                                createVNode(VChip, {
                                                                  color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCardText, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VRow, null, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VCol, { cols: "6" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(VCard, {
                                                                            variant: "outlined",
                                                                            color: contrast.value < 4.5 ? "error" : "success",
                                                                            class: "pa-2"
                                                                          }, {
                                                                            default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                              if (_push13) {
                                                                                _push13(`<div class="d-flex align-center justify-center"${_scopeId12}>`);
                                                                                _push13(ssrRenderComponent(VIcon, {
                                                                                  color: contrast.value < 4.5 ? "error" : "success",
                                                                                  class: "mr-2"
                                                                                }, {
                                                                                  default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                    if (_push14) {
                                                                                      _push14(`${ssrInterpolate(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle")}`);
                                                                                    } else {
                                                                                      return [
                                                                                        createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                      ];
                                                                                    }
                                                                                  }),
                                                                                  _: 1
                                                                                }, _parent13, _scopeId12));
                                                                                _push13(`<span${_scopeId12}>Normal Text (min. 4.5:1)</span></div>`);
                                                                              } else {
                                                                                return [
                                                                                  createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                    createVNode(VIcon, {
                                                                                      color: contrast.value < 4.5 ? "error" : "success",
                                                                                      class: "mr-2"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                      ]),
                                                                                      _: 1
                                                                                    }, 8, ["color"]),
                                                                                    createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                                  ])
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 1
                                                                          }, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(VCard, {
                                                                              variant: "outlined",
                                                                              color: contrast.value < 4.5 ? "error" : "success",
                                                                              class: "pa-2"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                  createVNode(VIcon, {
                                                                                    color: contrast.value < 4.5 ? "error" : "success",
                                                                                    class: "mr-2"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                    ]),
                                                                                    _: 1
                                                                                  }, 8, ["color"]),
                                                                                  createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                                ])
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["color"])
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(ssrRenderComponent(VCol, { cols: "6" }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(ssrRenderComponent(VCard, {
                                                                            variant: "outlined",
                                                                            color: contrast.value < 3 ? "error" : "success",
                                                                            class: "pa-2"
                                                                          }, {
                                                                            default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                              if (_push13) {
                                                                                _push13(`<div class="d-flex align-center justify-center"${_scopeId12}>`);
                                                                                _push13(ssrRenderComponent(VIcon, {
                                                                                  color: contrast.value < 3 ? "error" : "success",
                                                                                  class: "mr-2"
                                                                                }, {
                                                                                  default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                    if (_push14) {
                                                                                      _push14(`${ssrInterpolate(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle")}`);
                                                                                    } else {
                                                                                      return [
                                                                                        createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                      ];
                                                                                    }
                                                                                  }),
                                                                                  _: 1
                                                                                }, _parent13, _scopeId12));
                                                                                _push13(`<span${_scopeId12}>Large Text (min. 3:1)</span></div>`);
                                                                              } else {
                                                                                return [
                                                                                  createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                    createVNode(VIcon, {
                                                                                      color: contrast.value < 3 ? "error" : "success",
                                                                                      class: "mr-2"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                      ]),
                                                                                      _: 1
                                                                                    }, 8, ["color"]),
                                                                                    createVNode("span", null, "Large Text (min. 3:1)")
                                                                                  ])
                                                                                ];
                                                                              }
                                                                            }),
                                                                            _: 1
                                                                          }, _parent12, _scopeId11));
                                                                        } else {
                                                                          return [
                                                                            createVNode(VCard, {
                                                                              variant: "outlined",
                                                                              color: contrast.value < 3 ? "error" : "success",
                                                                              class: "pa-2"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                  createVNode(VIcon, {
                                                                                    color: contrast.value < 3 ? "error" : "success",
                                                                                    class: "mr-2"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                    ]),
                                                                                    _: 1
                                                                                  }, 8, ["color"]),
                                                                                  createVNode("span", null, "Large Text (min. 3:1)")
                                                                                ])
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["color"])
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                  } else {
                                                                    return [
                                                                      createVNode(VCol, { cols: "6" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VCard, {
                                                                            variant: "outlined",
                                                                            color: contrast.value < 4.5 ? "error" : "success",
                                                                            class: "pa-2"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                createVNode(VIcon, {
                                                                                  color: contrast.value < 4.5 ? "error" : "success",
                                                                                  class: "mr-2"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["color"]),
                                                                                createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                              ])
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["color"])
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createVNode(VCol, { cols: "6" }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VCard, {
                                                                            variant: "outlined",
                                                                            color: contrast.value < 3 ? "error" : "success",
                                                                            class: "pa-2"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                                createVNode(VIcon, {
                                                                                  color: contrast.value < 3 ? "error" : "success",
                                                                                  class: "mr-2"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                  ]),
                                                                                  _: 1
                                                                                }, 8, ["color"]),
                                                                                createVNode("span", null, "Large Text (min. 3:1)")
                                                                              ])
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["color"])
                                                                        ]),
                                                                        _: 1
                                                                      })
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<div class="mt-4 text-center"${_scopeId9}><p class="text-body-1"${_scopeId9}>${ssrInterpolate(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site.")}</p></div>`);
                                                            } else {
                                                              return [
                                                                createVNode(VRow, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VCol, { cols: "6" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VCard, {
                                                                          variant: "outlined",
                                                                          color: contrast.value < 4.5 ? "error" : "success",
                                                                          class: "pa-2"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                              createVNode(VIcon, {
                                                                                color: contrast.value < 4.5 ? "error" : "success",
                                                                                class: "mr-2"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["color"]),
                                                                              createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                            ])
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["color"])
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCol, { cols: "6" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VCard, {
                                                                          variant: "outlined",
                                                                          color: contrast.value < 3 ? "error" : "success",
                                                                          class: "pa-2"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                              createVNode(VIcon, {
                                                                                color: contrast.value < 3 ? "error" : "success",
                                                                                class: "mr-2"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                                ]),
                                                                                _: 1
                                                                              }, 8, ["color"]),
                                                                              createVNode("span", null, "Large Text (min. 3:1)")
                                                                            ])
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["color"])
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode("div", { class: "mt-4 text-center" }, [
                                                                  createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VCardTitle, { class: "text-center" }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                              createVNode(VChip, {
                                                                color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VRow, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCol, { cols: "6" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VCard, {
                                                                        variant: "outlined",
                                                                        color: contrast.value < 4.5 ? "error" : "success",
                                                                        class: "pa-2"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                            createVNode(VIcon, {
                                                                              color: contrast.value < 4.5 ? "error" : "success",
                                                                              class: "mr-2"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["color"]),
                                                                            createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                          ])
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["color"])
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCol, { cols: "6" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VCard, {
                                                                        variant: "outlined",
                                                                        color: contrast.value < 3 ? "error" : "success",
                                                                        class: "pa-2"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                            createVNode(VIcon, {
                                                                              color: contrast.value < 3 ? "error" : "success",
                                                                              class: "mr-2"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                              ]),
                                                                              _: 1
                                                                            }, 8, ["color"]),
                                                                            createVNode("span", null, "Large Text (min. 3:1)")
                                                                          ])
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["color"])
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode("div", { class: "mt-4 text-center" }, [
                                                                createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
                                                              ])
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VCard, {
                                                      class: "pa-4 rounded-lg",
                                                      elevation: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-center" }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                            createVNode(VChip, {
                                                              color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VRow, null, {
                                                              default: withCtx(() => [
                                                                createVNode(VCol, { cols: "6" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VCard, {
                                                                      variant: "outlined",
                                                                      color: contrast.value < 4.5 ? "error" : "success",
                                                                      class: "pa-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                          createVNode(VIcon, {
                                                                            color: contrast.value < 4.5 ? "error" : "success",
                                                                            class: "mr-2"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["color"]),
                                                                          createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                        ])
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"])
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCol, { cols: "6" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VCard, {
                                                                      variant: "outlined",
                                                                      color: contrast.value < 3 ? "error" : "success",
                                                                      class: "pa-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                          createVNode(VIcon, {
                                                                            color: contrast.value < 3 ? "error" : "success",
                                                                            class: "mr-2"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["color"]),
                                                                          createVNode("span", null, "Large Text (min. 3:1)")
                                                                        ])
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"])
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode("div", { class: "mt-4 text-center" }, [
                                                              createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6",
                                                class: "mx-auto"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    class: "pa-4 rounded-lg",
                                                    elevation: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-center" }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                          createVNode(VChip, {
                                                            color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VRow, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VCol, { cols: "6" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCard, {
                                                                    variant: "outlined",
                                                                    color: contrast.value < 4.5 ? "error" : "success",
                                                                    class: "pa-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                        createVNode(VIcon, {
                                                                          color: contrast.value < 4.5 ? "error" : "success",
                                                                          class: "mr-2"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["color"]),
                                                                        createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                      ])
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"])
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCol, { cols: "6" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCard, {
                                                                    variant: "outlined",
                                                                    color: contrast.value < 3 ? "error" : "success",
                                                                    class: "pa-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                        createVNode(VIcon, {
                                                                          color: contrast.value < 3 ? "error" : "success",
                                                                          class: "mr-2"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["color"]),
                                                                        createVNode("span", null, "Large Text (min. 3:1)")
                                                                      ])
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"])
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("div", { class: "mt-4 text-center" }, [
                                                            createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
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
                                                        modelValue: textColor.value,
                                                        "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                        label: "Text color",
                                                        placeholder: "rgb(0, 0, 0)",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        "prepend-inner-icon": "mdi-format-color-text"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "6"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextField, {
                                                        modelValue: backgroundColor.value,
                                                        "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                        label: "Background color",
                                                        placeholder: "rgb(255, 255, 255)",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        "prepend-inner-icon": "mdi-format-color-fill"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    class: "d-flex justify-center"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VBtn, {
                                                        onClick: getContrast,
                                                        color: "primary",
                                                        "prepend-icon": "mdi-calculator",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" Calculate contrast ")
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
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                color: backgroundColor.value,
                                                class: "pa-4 rounded-lg h-100",
                                                elevation: "1"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, {
                                                    style: `color: ${textColor.value}`,
                                                    class: "text-center"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Contrast Preview ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["style"]),
                                                  createVNode(VCardText, {
                                                    style: `color: ${textColor.value}`,
                                                    class: "text-center"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "mb-4" }, [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                        createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                      ]),
                                                      createVNode("div", { class: "mb-4" }, [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                        createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                      ]),
                                                      createVNode("div", { class: "mb-4" }, [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                        createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                      ]),
                                                      createVNode("div", { class: "mb-4" }, [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                        createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                      ]),
                                                      createVNode("div", null, [
                                                        createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                        createVNode("a", {
                                                          style: `color: ${textColor.value}`,
                                                          href: "#",
                                                          class: "text-decoration-underline"
                                                        }, "Lorem ipsum dolor", 4)
                                                      ])
                                                    ]),
                                                    _: 1
                                                  }, 8, ["style"])
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      contrast.value > 0 ? (openBlock(), createBlock(VDivider, {
                                        key: 0,
                                        class: "my-4"
                                      })) : createCommentVNode("", true),
                                      contrast.value > 0 ? (openBlock(), createBlock(VRow, { key: 1 }, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6",
                                            class: "mx-auto"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                class: "pa-4 rounded-lg",
                                                elevation: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-center" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                      createVNode(VChip, {
                                                        color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VRow, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VCol, { cols: "6" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                color: contrast.value < 4.5 ? "error" : "success",
                                                                class: "pa-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                    createVNode(VIcon, {
                                                                      color: contrast.value < 4.5 ? "error" : "success",
                                                                      class: "mr-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"]),
                                                                    createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                  ])
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCol, { cols: "6" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                color: contrast.value < 3 ? "error" : "success",
                                                                class: "pa-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                    createVNode(VIcon, {
                                                                      color: contrast.value < 3 ? "error" : "success",
                                                                      class: "mr-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"]),
                                                                    createVNode("span", null, "Large Text (min. 3:1)")
                                                                  ])
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"])
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("div", { class: "mt-4 text-center" }, [
                                                        createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                                      })) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardTitle, { class: "text-h6 pa-4 bg-secondary text-white" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "large",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-contrast-circle")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Contrast Checker ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
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
                                                      modelValue: textColor.value,
                                                      "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                      label: "Text color",
                                                      placeholder: "rgb(0, 0, 0)",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      "prepend-inner-icon": "mdi-format-color-text"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "6"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextField, {
                                                      modelValue: backgroundColor.value,
                                                      "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                      label: "Background color",
                                                      placeholder: "rgb(255, 255, 255)",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      "prepend-inner-icon": "mdi-format-color-fill"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  class: "d-flex justify-center"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VBtn, {
                                                      onClick: getContrast,
                                                      color: "primary",
                                                      "prepend-icon": "mdi-calculator",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Calculate contrast ")
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
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              color: backgroundColor.value,
                                              class: "pa-4 rounded-lg h-100",
                                              elevation: "1"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCardTitle, {
                                                  style: `color: ${textColor.value}`,
                                                  class: "text-center"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Contrast Preview ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["style"]),
                                                createVNode(VCardText, {
                                                  style: `color: ${textColor.value}`,
                                                  class: "text-center"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "mb-4" }, [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                      createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                    ]),
                                                    createVNode("div", { class: "mb-4" }, [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                      createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                    ]),
                                                    createVNode("div", { class: "mb-4" }, [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                      createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                    ]),
                                                    createVNode("div", { class: "mb-4" }, [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                      createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                    ]),
                                                    createVNode("div", null, [
                                                      createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                      createVNode("a", {
                                                        style: `color: ${textColor.value}`,
                                                        href: "#",
                                                        class: "text-decoration-underline"
                                                      }, "Lorem ipsum dolor", 4)
                                                    ])
                                                  ]),
                                                  _: 1
                                                }, 8, ["style"])
                                              ]),
                                              _: 1
                                            }, 8, ["color"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    contrast.value > 0 ? (openBlock(), createBlock(VDivider, {
                                      key: 0,
                                      class: "my-4"
                                    })) : createCommentVNode("", true),
                                    contrast.value > 0 ? (openBlock(), createBlock(VRow, { key: 1 }, {
                                      default: withCtx(() => [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6",
                                          class: "mx-auto"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              class: "pa-4 rounded-lg",
                                              elevation: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCardTitle, { class: "text-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                    createVNode(VChip, {
                                                      color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VRow, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VCol, { cols: "6" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              color: contrast.value < 4.5 ? "error" : "success",
                                                              class: "pa-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                  createVNode(VIcon, {
                                                                    color: contrast.value < 4.5 ? "error" : "success",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"]),
                                                                  createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                                ])
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, { cols: "6" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              color: contrast.value < 3 ? "error" : "success",
                                                              class: "pa-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                  createVNode(VIcon, {
                                                                    color: contrast.value < 3 ? "error" : "success",
                                                                    class: "mr-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"]),
                                                                  createVNode("span", null, "Large Text (min. 3:1)")
                                                                ])
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", { class: "mt-4 text-center" }, [
                                                      createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                                    })) : createCommentVNode("", true)
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
                            class: "mb-8 pa-4 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "text-h6 pb-2" }, {
                                default: withCtx(() => [
                                  createTextVNode("Analyze a website")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "9"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: url.value,
                                            "onUpdate:modelValue": ($event) => url.value = $event,
                                            label: "Website URL to analyze",
                                            placeholder: "https://example.com",
                                            "prepend-inner-icon": "mdi-web",
                                            variant: "outlined",
                                            density: "comfortable",
                                            clearable: "",
                                            onKeyup: withKeys(getAudit, ["enter"])
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "3",
                                        class: "d-flex align-center"
                                      }, {
                                        default: withCtx(() => [
                                          unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                            key: 0,
                                            onClick: getAudit,
                                            color: "primary",
                                            block: "",
                                            loading: loading.value,
                                            "prepend-icon": "mdi-magnify"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Analyze ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                            key: 1,
                                            type: "button",
                                            title: "Analyze",
                                            icon: "mdi-magnify",
                                            "feature-key": "audit"
                                          }))
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
                          loading.value ? (openBlock(), createBlock(VSkeletonLoader, {
                            key: 0,
                            type: "card, article, actions",
                            class: "mb-6"
                          })) : createCommentVNode("", true),
                          auditData.value && !loading.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createVNode(VCard, {
                              class: "mb-6 pa-4 rounded-lg",
                              elevation: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "8"
                                    }, {
                                      default: withCtx(() => {
                                        var _a, _b, _c;
                                        return [
                                          createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                            createVNode(VIcon, {
                                              size: "large",
                                              color: "primary",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-web")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" " + toDisplayString(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site"), 1)
                                          ]),
                                          createVNode("p", { class: "mb-2" }, [
                                            createVNode("strong", null, "URL: "),
                                            createVNode("a", {
                                              href: (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl,
                                              target: "_blank",
                                              class: "text-decoration-none text-primary"
                                            }, [
                                              createTextVNode(toDisplayString((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl) + " ", 1),
                                              createVNode(VIcon, { size: "small" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-open-in-new")
                                                ]),
                                                _: 1
                                              })
                                            ], 8, ["href"])
                                          ]),
                                          createVNode(VChip, {
                                            class: "mr-2 mb-2",
                                            color: "success",
                                            size: "small"
                                          }, {
                                            default: withCtx(() => {
                                              var _a2;
                                              return [
                                                createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                              ];
                                            }),
                                            _: 1
                                          }),
                                          createVNode(VChip, {
                                            class: "mb-2",
                                            color: "info",
                                            size: "small"
                                          }, {
                                            default: withCtx(() => {
                                              var _a2;
                                              return [
                                                createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                              ];
                                            }),
                                            _: 1
                                          })
                                        ];
                                      }),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "4",
                                      class: "d-flex align-center justify-center"
                                    }, {
                                      default: withCtx(() => {
                                        var _a;
                                        return [
                                          createVNode(VBtn, {
                                            variant: "elevated",
                                            color: "primary",
                                            href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                            target: "_blank",
                                            "prepend-icon": "mdi-link-variant",
                                            "append-icon": "mdi-open-in-new",
                                            class: "px-4"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" View complete WAVE report ")
                                            ]),
                                            _: 1
                                          }, 8, ["href"])
                                        ];
                                      }),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VCard, {
                              class: "mb-8 rounded-lg",
                              elevation: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardTitle, { class: "text-h6 pa-4 bg-primary text-white" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Analysis Results ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                          return openBlock(), createBlock(VCol, {
                                            key,
                                            cols: "12",
                                            sm: "6",
                                            md: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                class: "h-100",
                                                variant: "outlined",
                                                color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "d-flex align-center" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                        class: "mr-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode("div", null, [
                                                        createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                        createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ], 64)) : createCommentVNode("", true),
                          createVNode(VCard, {
                            class: "mb-8 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "text-h6 pa-4 bg-secondary text-white" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "large",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-contrast-circle")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Contrast Checker ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
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
                                                    modelValue: textColor.value,
                                                    "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                    label: "Text color",
                                                    placeholder: "rgb(0, 0, 0)",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    "prepend-inner-icon": "mdi-format-color-text"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: backgroundColor.value,
                                                    "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                    label: "Background color",
                                                    placeholder: "rgb(255, 255, 255)",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    "prepend-inner-icon": "mdi-format-color-fill"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                class: "d-flex justify-center"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VBtn, {
                                                    onClick: getContrast,
                                                    color: "primary",
                                                    "prepend-icon": "mdi-calculator",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Calculate contrast ")
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
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            color: backgroundColor.value,
                                            class: "pa-4 rounded-lg h-100",
                                            elevation: "1"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCardTitle, {
                                                style: `color: ${textColor.value}`,
                                                class: "text-center"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Contrast Preview ")
                                                ]),
                                                _: 1
                                              }, 8, ["style"]),
                                              createVNode(VCardText, {
                                                style: `color: ${textColor.value}`,
                                                class: "text-center"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "mb-4" }, [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                    createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                  ]),
                                                  createVNode("div", { class: "mb-4" }, [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                    createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                  ]),
                                                  createVNode("div", { class: "mb-4" }, [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                    createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                  ]),
                                                  createVNode("div", { class: "mb-4" }, [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                    createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                  ]),
                                                  createVNode("div", null, [
                                                    createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                    createVNode("a", {
                                                      style: `color: ${textColor.value}`,
                                                      href: "#",
                                                      class: "text-decoration-underline"
                                                    }, "Lorem ipsum dolor", 4)
                                                  ])
                                                ]),
                                                _: 1
                                              }, 8, ["style"])
                                            ]),
                                            _: 1
                                          }, 8, ["color"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  contrast.value > 0 ? (openBlock(), createBlock(VDivider, {
                                    key: 0,
                                    class: "my-4"
                                  })) : createCommentVNode("", true),
                                  contrast.value > 0 ? (openBlock(), createBlock(VRow, { key: 1 }, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6",
                                        class: "mx-auto"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            class: "pa-4 rounded-lg",
                                            elevation: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCardTitle, { class: "text-center" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                  createVNode(VChip, {
                                                    color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                    class: "mb-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCardText, null, {
                                                default: withCtx(() => [
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, { cols: "6" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            color: contrast.value < 4.5 ? "error" : "success",
                                                            class: "pa-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                createVNode(VIcon, {
                                                                  color: contrast.value < 4.5 ? "error" : "success",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"]),
                                                                createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                              ])
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, { cols: "6" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            color: contrast.value < 3 ? "error" : "success",
                                                            class: "pa-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                                createVNode(VIcon, {
                                                                  color: contrast.value < 3 ? "error" : "success",
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"]),
                                                                createVNode("span", null, "Large Text (min. 3:1)")
                                                              ])
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", { class: "mt-4 text-center" }, [
                                                    createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, null, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "mb-8 pa-4 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, { class: "text-h6 pb-2" }, {
                              default: withCtx(() => [
                                createTextVNode("Analyze a website")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "9"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: url.value,
                                          "onUpdate:modelValue": ($event) => url.value = $event,
                                          label: "Website URL to analyze",
                                          placeholder: "https://example.com",
                                          "prepend-inner-icon": "mdi-web",
                                          variant: "outlined",
                                          density: "comfortable",
                                          clearable: "",
                                          onKeyup: withKeys(getAudit, ["enter"])
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "3",
                                      class: "d-flex align-center"
                                    }, {
                                      default: withCtx(() => [
                                        unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                          key: 0,
                                          onClick: getAudit,
                                          color: "primary",
                                          block: "",
                                          loading: loading.value,
                                          "prepend-icon": "mdi-magnify"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Analyze ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                          key: 1,
                                          type: "button",
                                          title: "Analyze",
                                          icon: "mdi-magnify",
                                          "feature-key": "audit"
                                        }))
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
                        loading.value ? (openBlock(), createBlock(VSkeletonLoader, {
                          key: 0,
                          type: "card, article, actions",
                          class: "mb-6"
                        })) : createCommentVNode("", true),
                        auditData.value && !loading.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createVNode(VCard, {
                            class: "mb-6 pa-4 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "8"
                                  }, {
                                    default: withCtx(() => {
                                      var _a, _b, _c;
                                      return [
                                        createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                          createVNode(VIcon, {
                                            size: "large",
                                            color: "primary",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-web")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" " + toDisplayString(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site"), 1)
                                        ]),
                                        createVNode("p", { class: "mb-2" }, [
                                          createVNode("strong", null, "URL: "),
                                          createVNode("a", {
                                            href: (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl,
                                            target: "_blank",
                                            class: "text-decoration-none text-primary"
                                          }, [
                                            createTextVNode(toDisplayString((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl) + " ", 1),
                                            createVNode(VIcon, { size: "small" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-open-in-new")
                                              ]),
                                              _: 1
                                            })
                                          ], 8, ["href"])
                                        ]),
                                        createVNode(VChip, {
                                          class: "mr-2 mb-2",
                                          color: "success",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => {
                                            var _a2;
                                            return [
                                              createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                            ];
                                          }),
                                          _: 1
                                        }),
                                        createVNode(VChip, {
                                          class: "mb-2",
                                          color: "info",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => {
                                            var _a2;
                                            return [
                                              createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                            ];
                                          }),
                                          _: 1
                                        })
                                      ];
                                    }),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "4",
                                    class: "d-flex align-center justify-center"
                                  }, {
                                    default: withCtx(() => {
                                      var _a;
                                      return [
                                        createVNode(VBtn, {
                                          variant: "elevated",
                                          color: "primary",
                                          href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                          target: "_blank",
                                          "prepend-icon": "mdi-link-variant",
                                          "append-icon": "mdi-open-in-new",
                                          class: "px-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" View complete WAVE report ")
                                          ]),
                                          _: 1
                                        }, 8, ["href"])
                                      ];
                                    }),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCard, {
                            class: "mb-8 rounded-lg",
                            elevation: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "text-h6 pa-4 bg-primary text-white" }, {
                                default: withCtx(() => [
                                  createTextVNode(" Analysis Results ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                        return openBlock(), createBlock(VCol, {
                                          key,
                                          cols: "12",
                                          sm: "6",
                                          md: "4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              class: "h-100",
                                              variant: "outlined",
                                              color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "d-flex align-center" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                      class: "mr-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"]),
                                                    createVNode("div", null, [
                                                      createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                      createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ], 64)) : createCommentVNode("", true),
                        createVNode(VCard, {
                          class: "mb-8 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, { class: "text-h6 pa-4 bg-secondary text-white" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "large",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-contrast-circle")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Contrast Checker ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
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
                                                  modelValue: textColor.value,
                                                  "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                  label: "Text color",
                                                  placeholder: "rgb(0, 0, 0)",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  "prepend-inner-icon": "mdi-format-color-text"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: backgroundColor.value,
                                                  "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                  label: "Background color",
                                                  placeholder: "rgb(255, 255, 255)",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  "prepend-inner-icon": "mdi-format-color-fill"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              class: "d-flex justify-center"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VBtn, {
                                                  onClick: getContrast,
                                                  color: "primary",
                                                  "prepend-icon": "mdi-calculator",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Calculate contrast ")
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
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, {
                                          color: backgroundColor.value,
                                          class: "pa-4 rounded-lg h-100",
                                          elevation: "1"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCardTitle, {
                                              style: `color: ${textColor.value}`,
                                              class: "text-center"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Contrast Preview ")
                                              ]),
                                              _: 1
                                            }, 8, ["style"]),
                                            createVNode(VCardText, {
                                              style: `color: ${textColor.value}`,
                                              class: "text-center"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "mb-4" }, [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                  createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                                ]),
                                                createVNode("div", { class: "mb-4" }, [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                  createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                                ]),
                                                createVNode("div", { class: "mb-4" }, [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                  createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                                ]),
                                                createVNode("div", { class: "mb-4" }, [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                  createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                                ]),
                                                createVNode("div", null, [
                                                  createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                  createVNode("a", {
                                                    style: `color: ${textColor.value}`,
                                                    href: "#",
                                                    class: "text-decoration-underline"
                                                  }, "Lorem ipsum dolor", 4)
                                                ])
                                              ]),
                                              _: 1
                                            }, 8, ["style"])
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                contrast.value > 0 ? (openBlock(), createBlock(VDivider, {
                                  key: 0,
                                  class: "my-4"
                                })) : createCommentVNode("", true),
                                contrast.value > 0 ? (openBlock(), createBlock(VRow, { key: 1 }, {
                                  default: withCtx(() => [
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6",
                                      class: "mx-auto"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCard, {
                                          class: "pa-4 rounded-lg",
                                          elevation: "3"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCardTitle, { class: "text-center" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                                createVNode(VChip, {
                                                  color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                  class: "mb-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                  ]),
                                                  _: 1
                                                }, 8, ["color"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCardText, null, {
                                              default: withCtx(() => [
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, { cols: "6" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          color: contrast.value < 4.5 ? "error" : "success",
                                                          class: "pa-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                              createVNode(VIcon, {
                                                                color: contrast.value < 4.5 ? "error" : "success",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"]),
                                                              createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                            ])
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, { cols: "6" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          color: contrast.value < 3 ? "error" : "success",
                                                          class: "pa-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                              createVNode(VIcon, {
                                                                color: contrast.value < 3 ? "error" : "success",
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"]),
                                                              createVNode("span", null, "Large Text (min. 3:1)")
                                                            ])
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color"])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", { class: "mt-4 text-center" }, [
                                                  createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                                })) : createCommentVNode("", true)
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
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, null, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mb-8 pa-4 rounded-lg",
                        elevation: "3"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, { class: "text-h6 pb-2" }, {
                            default: withCtx(() => [
                              createTextVNode("Analyze a website")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "9"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: url.value,
                                        "onUpdate:modelValue": ($event) => url.value = $event,
                                        label: "Website URL to analyze",
                                        placeholder: "https://example.com",
                                        "prepend-inner-icon": "mdi-web",
                                        variant: "outlined",
                                        density: "comfortable",
                                        clearable: "",
                                        onKeyup: withKeys(getAudit, ["enter"])
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "3",
                                    class: "d-flex align-center"
                                  }, {
                                    default: withCtx(() => [
                                      unref(userStore).user.isPremium ? (openBlock(), createBlock(VBtn, {
                                        key: 0,
                                        onClick: getAudit,
                                        color: "primary",
                                        block: "",
                                        loading: loading.value,
                                        "prepend-icon": "mdi-magnify"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Analyze ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])) : (openBlock(), createBlock(_component_premium_feature, {
                                        key: 1,
                                        type: "button",
                                        title: "Analyze",
                                        icon: "mdi-magnify",
                                        "feature-key": "audit"
                                      }))
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
                      loading.value ? (openBlock(), createBlock(VSkeletonLoader, {
                        key: 0,
                        type: "card, article, actions",
                        class: "mb-6"
                      })) : createCommentVNode("", true),
                      auditData.value && !loading.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createVNode(VCard, {
                          class: "mb-6 pa-4 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "8"
                                }, {
                                  default: withCtx(() => {
                                    var _a, _b, _c;
                                    return [
                                      createVNode("h2", { class: "text-h5 d-flex align-center mb-4" }, [
                                        createVNode(VIcon, {
                                          size: "large",
                                          color: "primary",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-web")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" " + toDisplayString(((_a = auditData.value.statistics) == null ? void 0 : _a.pagetitle) || "Analyzed Site"), 1)
                                      ]),
                                      createVNode("p", { class: "mb-2" }, [
                                        createVNode("strong", null, "URL: "),
                                        createVNode("a", {
                                          href: (_b = auditData.value.statistics) == null ? void 0 : _b.pageurl,
                                          target: "_blank",
                                          class: "text-decoration-none text-primary"
                                        }, [
                                          createTextVNode(toDisplayString((_c = auditData.value.statistics) == null ? void 0 : _c.pageurl) + " ", 1),
                                          createVNode(VIcon, { size: "small" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-open-in-new")
                                            ]),
                                            _: 1
                                          })
                                        ], 8, ["href"])
                                      ]),
                                      createVNode(VChip, {
                                        class: "mr-2 mb-2",
                                        color: "success",
                                        size: "small"
                                      }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(" Analysis in " + toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.time) + "s ", 1)
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode(VChip, {
                                        class: "mb-2",
                                        color: "info",
                                        size: "small"
                                      }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(toDisplayString((_a2 = auditData.value.statistics) == null ? void 0 : _a2.totalelements) + " elements analyzed ", 1)
                                          ];
                                        }),
                                        _: 1
                                      })
                                    ];
                                  }),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "4",
                                  class: "d-flex align-center justify-center"
                                }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createVNode(VBtn, {
                                        variant: "elevated",
                                        color: "primary",
                                        href: (_a = auditData.value.statistics) == null ? void 0 : _a.waveurl,
                                        target: "_blank",
                                        "prepend-icon": "mdi-link-variant",
                                        "append-icon": "mdi-open-in-new",
                                        class: "px-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" View complete WAVE report ")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ];
                                  }),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCard, {
                          class: "mb-8 rounded-lg",
                          elevation: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, { class: "text-h6 pa-4 bg-primary text-white" }, {
                              default: withCtx(() => [
                                createTextVNode(" Analysis Results ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(auditData.value.categories, (category, key) => {
                                      return openBlock(), createBlock(VCol, {
                                        key,
                                        cols: "12",
                                        sm: "6",
                                        md: "4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCard, {
                                            class: "h-100",
                                            variant: "outlined",
                                            color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCardText, { class: "d-flex align-center" }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, {
                                                    color: category.description.toLowerCase().includes("error") ? "error" : ["feature", "elements", "aria"].some((word) => category.description.toLowerCase().includes(word)) ? "success" : "warning",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(category.description.toLowerCase().includes("error") ? "mdi-alert-circle" : "mdi-check-circle"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"]),
                                                  createVNode("div", null, [
                                                    createVNode("div", { class: "font-weight-medium" }, toDisplayString(category.description), 1),
                                                    createVNode("div", { class: "text-subtitle-2" }, toDisplayString(category.count) + " elements", 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ], 64)) : createCommentVNode("", true),
                      createVNode(VCard, {
                        class: "mb-8 rounded-lg",
                        elevation: "3"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, { class: "text-h6 pa-4 bg-secondary text-white" }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "large",
                                class: "mr-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-contrast-circle")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Contrast Checker ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
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
                                                modelValue: textColor.value,
                                                "onUpdate:modelValue": ($event) => textColor.value = $event,
                                                label: "Text color",
                                                placeholder: "rgb(0, 0, 0)",
                                                variant: "outlined",
                                                density: "comfortable",
                                                "prepend-inner-icon": "mdi-format-color-text"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: backgroundColor.value,
                                                "onUpdate:modelValue": ($event) => backgroundColor.value = $event,
                                                label: "Background color",
                                                placeholder: "rgb(255, 255, 255)",
                                                variant: "outlined",
                                                density: "comfortable",
                                                "prepend-inner-icon": "mdi-format-color-fill"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            class: "d-flex justify-center"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VBtn, {
                                                onClick: getContrast,
                                                color: "primary",
                                                "prepend-icon": "mdi-calculator",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Calculate contrast ")
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
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, {
                                        color: backgroundColor.value,
                                        class: "pa-4 rounded-lg h-100",
                                        elevation: "1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, {
                                            style: `color: ${textColor.value}`,
                                            class: "text-center"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Contrast Preview ")
                                            ]),
                                            _: 1
                                          }, 8, ["style"]),
                                          createVNode(VCardText, {
                                            style: `color: ${textColor.value}`,
                                            class: "text-center"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "mb-4" }, [
                                                createVNode("p", { class: "text-body-1 mb-2" }, "Normal Text (16px)"),
                                                createVNode("p", { class: "text-body-1" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
                                              ]),
                                              createVNode("div", { class: "mb-4" }, [
                                                createVNode("p", { class: "text-body-1 mb-2" }, "Large Text (18px+)"),
                                                createVNode("p", { class: "text-h6" }, "Lorem ipsum dolor sit amet")
                                              ]),
                                              createVNode("div", { class: "mb-4" }, [
                                                createVNode("p", { class: "text-body-1 mb-2" }, "Bold Text"),
                                                createVNode("p", { class: "text-body-1 font-weight-bold" }, "Lorem ipsum dolor sit amet")
                                              ]),
                                              createVNode("div", { class: "mb-4" }, [
                                                createVNode("p", { class: "text-body-1 mb-2" }, "Italic Text"),
                                                createVNode("p", { class: "text-body-1 font-italic" }, "Lorem ipsum dolor sit amet")
                                              ]),
                                              createVNode("div", null, [
                                                createVNode("p", { class: "text-body-1 mb-2" }, "Link Example"),
                                                createVNode("a", {
                                                  style: `color: ${textColor.value}`,
                                                  href: "#",
                                                  class: "text-decoration-underline"
                                                }, "Lorem ipsum dolor", 4)
                                              ])
                                            ]),
                                            _: 1
                                          }, 8, ["style"])
                                        ]),
                                        _: 1
                                      }, 8, ["color"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              contrast.value > 0 ? (openBlock(), createBlock(VDivider, {
                                key: 0,
                                class: "my-4"
                              })) : createCommentVNode("", true),
                              contrast.value > 0 ? (openBlock(), createBlock(VRow, { key: 1 }, {
                                default: withCtx(() => [
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6",
                                    class: "mx-auto"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCard, {
                                        class: "pa-4 rounded-lg",
                                        elevation: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, { class: "text-center" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "text-h4 font-weight-bold mb-2" }, "Contrast Ratio: " + toDisplayString(Math.round(contrast.value * 100) / 100) + ":1 ", 1),
                                              createVNode(VChip, {
                                                color: contrast.value < 4.5 ? "error" : contrast.value < 7 ? "warning" : "success",
                                                class: "mb-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(contrast.value < 4.5 ? "Insufficient Contrast" : contrast.value < 7 ? "Acceptable Contrast" : "Excellent Contrast"), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCardText, null, {
                                            default: withCtx(() => [
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, { cols: "6" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        color: contrast.value < 4.5 ? "error" : "success",
                                                        class: "pa-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                            createVNode(VIcon, {
                                                              color: contrast.value < 4.5 ? "error" : "success",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(contrast.value < 4.5 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"]),
                                                            createVNode("span", null, "Normal Text (min. 4.5:1)")
                                                          ])
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, { cols: "6" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        color: contrast.value < 3 ? "error" : "success",
                                                        class: "pa-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center justify-center" }, [
                                                            createVNode(VIcon, {
                                                              color: contrast.value < 3 ? "error" : "success",
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(contrast.value < 3 ? "mdi-close-circle" : "mdi-check-circle"), 1)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"]),
                                                            createVNode("span", null, "Large Text (min. 3:1)")
                                                          ])
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", { class: "mt-4 text-center" }, [
                                                createVNode("p", { class: "text-body-1" }, toDisplayString(contrast.value < 4.5 ? "The contrast is insufficient for good readability. Try more contrasting colors." : "Congratulations! Your colors meet contrast standards for an accessible site."), 1)
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
                              })) : createCommentVNode("", true)
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
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accessibility.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=accessibility.vue.mjs.map
