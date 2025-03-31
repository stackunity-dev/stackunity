import { ref, watch, createVNode, mergeProps, Fragment, defineComponent, computed, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { k as genericComponent, p as propsFactory, l as useProxiedModel, aI as useLocale, s as useRender, J as convertToUnit, Q as VDefaultsProvider, e as VBtn, bN as VProgressLinear, ap as IconValue, P as VImg, bO as makeVImgProps, S as useUserStore, V as VApp, f as VCard, Y as VCardText, g as VIcon, $ as VCardTitle, i as VAvatar, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VChip } from './VChip.mjs';
import { V as VAlert } from './VAlert.mjs';
import { V as VWindow, m as makeVWindowProps, a as VWindowItem, b as makeVWindowItemProps } from './VWindowItem.mjs';
import { V as VSheet } from './VSheet.mjs';
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
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const makeVCarouselProps = propsFactory({
  color: String,
  cycle: Boolean,
  delimiterIcon: {
    type: IconValue,
    default: "$delimiter"
  },
  height: {
    type: [Number, String],
    default: 500
  },
  hideDelimiters: Boolean,
  hideDelimiterBackground: Boolean,
  interval: {
    type: [Number, String],
    default: 6e3,
    validator: (value) => Number(value) > 0
  },
  progress: [Boolean, String],
  verticalDelimiters: [Boolean, String],
  ...makeVWindowProps({
    continuous: true,
    mandatory: "force",
    showArrows: true
  })
}, "VCarousel");
const VCarousel = genericComponent()({
  name: "VCarousel",
  props: makeVCarouselProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      t
    } = useLocale();
    const windowRef = ref();
    let slideTimeout = -1;
    watch(model, restartTimeout);
    watch(() => props.interval, restartTimeout);
    watch(() => props.cycle, (val) => {
      if (val) restartTimeout();
      else (void 0).clearTimeout(slideTimeout);
    });
    function startTimeout() {
      if (!props.cycle || !windowRef.value) return;
      slideTimeout = (void 0).setTimeout(windowRef.value.group.next, Number(props.interval) > 0 ? Number(props.interval) : 6e3);
    }
    function restartTimeout() {
      (void 0).clearTimeout(slideTimeout);
      (void 0).requestAnimationFrame(startTimeout);
    }
    useRender(() => {
      const windowProps = VWindow.filterProps(props);
      return createVNode(VWindow, mergeProps({
        "ref": windowRef
      }, windowProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-carousel", {
          "v-carousel--hide-delimiter-background": props.hideDelimiterBackground,
          "v-carousel--vertical-delimiters": props.verticalDelimiters
        }, props.class],
        "style": [{
          height: convertToUnit(props.height)
        }, props.style]
      }), {
        default: slots.default,
        additional: (_ref2) => {
          let {
            group
          } = _ref2;
          return createVNode(Fragment, null, [!props.hideDelimiters && createVNode("div", {
            "class": "v-carousel__controls",
            "style": {
              left: props.verticalDelimiters === "left" && props.verticalDelimiters ? 0 : "auto",
              right: props.verticalDelimiters === "right" ? 0 : "auto"
            }
          }, [group.items.value.length > 0 && createVNode(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                color: props.color,
                icon: props.delimiterIcon,
                size: "x-small",
                variant: "text"
              }
            },
            "scoped": true
          }, {
            default: () => [group.items.value.map((item, index) => {
              const props2 = {
                id: `carousel-item-${item.id}`,
                "aria-label": t("$vuetify.carousel.ariaLabel.delimiter", index + 1, group.items.value.length),
                class: ["v-carousel__controls__item", group.isSelected(item.id) && "v-btn--active"],
                onClick: () => group.select(item.id, true)
              };
              return slots.item ? slots.item({
                props: props2,
                item
              }) : createVNode(VBtn, mergeProps(item, props2), null);
            })]
          })]), props.progress && createVNode(VProgressLinear, {
            "class": "v-carousel__progress",
            "color": typeof props.progress === "string" ? props.progress : void 0,
            "modelValue": (group.getItemIndex(model.value) + 1) / group.items.value.length * 100
          }, null)]);
        },
        prev: slots.prev,
        next: slots.next
      });
    });
    return {};
  }
});

const makeVCarouselItemProps = propsFactory({
  ...makeVImgProps(),
  ...makeVWindowItemProps()
}, "VCarouselItem");
const VCarouselItem = genericComponent()({
  name: "VCarouselItem",
  inheritAttrs: false,
  props: makeVCarouselItemProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    useRender(() => {
      const imgProps = VImg.filterProps(props);
      const windowItemProps = VWindowItem.filterProps(props);
      return createVNode(VWindowItem, mergeProps({
        "class": ["v-carousel-item", props.class]
      }, windowItemProps), {
        default: () => [createVNode(VImg, mergeProps(attrs, imgProps), slots)]
      });
    });
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Dashboard - DevUnity",
      meta: [
        { name: "description", content: "Dashboard for DevUnity" },
        { name: "keywords", content: "DevUnity, dashboard, tools, snippets, SQL, Studio, Sitemaps" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Dashboard - DevUnity" },
        { name: "og:description", content: "Dashboard for DevUnity" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const userStore = useUserStore();
    const systemData = computed(() => userStore.systemData);
    const recentSnippets = computed(() => {
      return [...userStore.personalSnippets].sort((a, b) => new Date(b.date || b.snippet_date).getTime() - new Date(a.date || a.snippet_date).getTime()).slice(0, 5);
    });
    const dashboardCards = computed(() => [
      {
        icon: "mdi-code-tags",
        color: "primary",
        count: userStore.personalSnippets.length,
        title: "Snippets"
      },
      {
        icon: "mdi-database",
        color: "info",
        count: userStore.sqlSchemas.length,
        title: "SQL Schemas"
      },
      {
        icon: "mdi-palette",
        color: "purple",
        count: userStore.studioComponents.length,
        title: "Studio"
      },
      {
        icon: "mdi-sitemap",
        color: "warning",
        count: 0,
        title: "Sitemaps"
      }
    ]);
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
      switch (framework.toLowerCase()) {
        case "react":
          return "mdi-react";
        case "vue.js 3":
          return "mdi-vuejs";
        case "angular":
          return "mdi-angular";
        case "nest.js":
          return "mdi-nodejs";
        case "nuxt 3":
          return "mdi-nuxt";
        default:
          return "mdi-code-tags";
      }
    };
    const getFrameworkColor = (framework) => {
      switch (framework.toLowerCase()) {
        case "react":
          return "#61DAFB";
        case "vue.js 3":
          return "#42B883";
        case "angular":
          return "#DD0031";
        case "nest.js":
          return "#68A063";
        case "nuxt 3":
          return "#00DC82";
        default:
          return "#9E9E9E";
      }
    };
    const quickTools = ref([
      {
        title: "SEO Audit",
        icon: "mdi-magnify",
        color: "primary",
        link: "/seo-audit",
        disabled: !userStore.user.isPremium
      },
      {
        title: "SQL Generator",
        icon: "mdi-database",
        color: "info",
        link: "/sql-generator",
        disabled: !userStore.user.isPremium
      },
      {
        title: "Robots.txt & Schema.org",
        icon: "mdi-robot",
        color: "success",
        link: "/robots",
        disabled: !userStore.user.isPremium
      },
      {
        title: "Accessibility",
        icon: "mdi-access-point",
        color: "warning",
        link: "/accessibility",
        disabled: false
      },
      {
        title: "Responsive",
        icon: "mdi-responsive",
        color: "error",
        link: "/responsive",
        disabled: false
      },
      {
        title: "Snippets",
        icon: "mdi-code-tags",
        color: "secondary",
        link: "/snippets",
        disabled: false
      },
      {
        title: "Studio",
        icon: "mdi-palette",
        color: "purple",
        link: "/studio",
        disabled: false
      },
      {
        title: "Sitemaps",
        icon: "mdi-sitemap",
        color: "grey",
        link: "/seo-audit",
        disabled: !userStore.user.isPremium
      }
    ]);
    const tips = ref([
      {
        title: "Optimize Your SEO",
        description: "Use the SEO audit tool to analyze and improve your website's search engine ranking.",
        icon: "mdi-magnify",
        color: "primary"
      },
      {
        title: "Create Reusable Snippets",
        description: "Save time by creating code snippets that you can reuse in your projects.",
        icon: "mdi-code-tags",
        color: "info"
      },
      {
        title: "Test Responsiveness",
        description: "Make sure your website displays correctly on all devices with the Responsive tool.",
        icon: "mdi-responsive",
        color: "error"
      },
      {
        title: "Improve Accessibility",
        description: "Make your website accessible to all users with the accessibility tool.",
        icon: "mdi-access-point",
        color: "warning"
      }
    ]);
    const getSnippetDate = (snippet) => {
      if (snippet && (snippet.date || snippet.snippet_date)) {
        return formatDate(snippet.date || snippet.snippet_date);
      }
      return "Date unknown";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, { class: "ma-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(dashboardCards.value, (card, index) => {
                          _push4(ssrRenderComponent(VCol, {
                            key: index,
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2",
                                  height: "100%"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, {
                                              size: "48",
                                              color: card.color,
                                              class: "mb-2"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(card.icon)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(card.icon), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(`<div class="text-h4 font-weight-bold" data-v-8dcb631f${_scopeId6}>${ssrInterpolate(card.count)}</div><div class="text-subtitle-1 text-medium-emphasis" data-v-8dcb631f${_scopeId6}>${ssrInterpolate(card.title)}</div>`);
                                          } else {
                                            return [
                                              createVNode(VIcon, {
                                                size: "48",
                                                color: card.color,
                                                class: "mb-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(card.icon), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                              createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              size: "48",
                                              color: card.color,
                                              class: "mb-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(card.icon), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"]),
                                            createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                            createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCard, {
                                    class: "rounded-lg",
                                    elevation: "2",
                                    height: "100%"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "48",
                                            color: card.color,
                                            class: "mb-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(card.icon), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                          createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
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
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(dashboardCards.value, (card, index) => {
                            return openBlock(), createBlock(VCol, {
                              key: index,
                              cols: "12",
                              md: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2",
                                  height: "100%"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "48",
                                          color: card.color,
                                          class: "mb-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(card.icon), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"]),
                                        createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                        createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCard, {
                    class: "rounded-lg mt-6 mb-2",
                    elevation: "2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, {
                                color: "white",
                                class: "mr-2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-chart-line`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-chart-line")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` System Performance `);
                            } else {
                              return [
                                createVNode(VIcon, {
                                  color: "white",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-chart-line")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" System Performance ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VRow, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCol, { cols: "12" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<div class="d-flex justify-space-between align-center mb-2" data-v-8dcb631f${_scopeId6}><div class="text-subtitle-1" data-v-8dcb631f${_scopeId6}>CPU Usage</div><div class="text-subtitle-2" data-v-8dcb631f${_scopeId6}>${ssrInterpolate(systemData.value.cpu.usage.toFixed(2))}%</div></div>`);
                                          _push7(ssrRenderComponent(VProgressLinear, {
                                            "model-value": systemData.value.cpu.usage,
                                            color: "primary",
                                            height: "10",
                                            rounded: "",
                                            class: "mb-4"
                                          }, null, _parent7, _scopeId6));
                                          _push7(`<div class="d-flex justify-space-between align-center mb-2" data-v-8dcb631f${_scopeId6}><div class="text-subtitle-1" data-v-8dcb631f${_scopeId6}>Memory Usage</div><div class="text-subtitle-2" data-v-8dcb631f${_scopeId6}>${ssrInterpolate(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100))}%</div></div>`);
                                          _push7(ssrRenderComponent(VProgressLinear, {
                                            "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                            color: "info",
                                            height: "10",
                                            rounded: "",
                                            class: "mb-4"
                                          }, null, _parent7, _scopeId6));
                                          _push7(`<div class="d-flex justify-space-between align-center mb-2" data-v-8dcb631f${_scopeId6}><div class="text-subtitle-1" data-v-8dcb631f${_scopeId6}>Disk Space</div>`);
                                          if (systemData.value.disks && systemData.value.disks.length > 0) {
                                            _push7(`<div class="text-subtitle-2" data-v-8dcb631f${_scopeId6}>${ssrInterpolate(Math.round(systemData.value.disks[0].use))}% </div>`);
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(`</div>`);
                                          if (systemData.value.disks && systemData.value.disks.length > 0) {
                                            _push7(ssrRenderComponent(VProgressLinear, {
                                              "model-value": systemData.value.disks[0].use,
                                              color: "success",
                                              height: "10",
                                              rounded: "",
                                              class: "mb-4"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                              createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                              createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                            ]),
                                            createVNode(VProgressLinear, {
                                              "model-value": systemData.value.cpu.usage,
                                              color: "primary",
                                              height: "10",
                                              rounded: "",
                                              class: "mb-4"
                                            }, null, 8, ["model-value"]),
                                            createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                              createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                              createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                            ]),
                                            createVNode(VProgressLinear, {
                                              "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                              color: "info",
                                              height: "10",
                                              rounded: "",
                                              class: "mb-4"
                                            }, null, 8, ["model-value"]),
                                            createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                              createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                              systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                                key: 0,
                                                class: "text-subtitle-2"
                                              }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                            ]),
                                            systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                              key: 0,
                                              "model-value": systemData.value.disks[0].use,
                                              color: "success",
                                              height: "10",
                                              rounded: "",
                                              class: "mb-4"
                                            }, null, 8, ["model-value"])) : createCommentVNode("", true)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                            createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                            createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                          ]),
                                          createVNode(VProgressLinear, {
                                            "model-value": systemData.value.cpu.usage,
                                            color: "primary",
                                            height: "10",
                                            rounded: "",
                                            class: "mb-4"
                                          }, null, 8, ["model-value"]),
                                          createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                            createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                            createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                          ]),
                                          createVNode(VProgressLinear, {
                                            "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                            color: "info",
                                            height: "10",
                                            rounded: "",
                                            class: "mb-4"
                                          }, null, 8, ["model-value"]),
                                          createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                            createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                            systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                              key: 0,
                                              class: "text-subtitle-2"
                                            }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                          ]),
                                          systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                            key: 0,
                                            "model-value": systemData.value.disks[0].use,
                                            color: "success",
                                            height: "10",
                                            rounded: "",
                                            class: "mb-4"
                                          }, null, 8, ["model-value"])) : createCommentVNode("", true)
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
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                          createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                          createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                        ]),
                                        createVNode(VProgressLinear, {
                                          "model-value": systemData.value.cpu.usage,
                                          color: "primary",
                                          height: "10",
                                          rounded: "",
                                          class: "mb-4"
                                        }, null, 8, ["model-value"]),
                                        createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                          createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                          createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                        ]),
                                        createVNode(VProgressLinear, {
                                          "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                          color: "info",
                                          height: "10",
                                          rounded: "",
                                          class: "mb-4"
                                        }, null, 8, ["model-value"]),
                                        createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                          createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                          systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "text-subtitle-2"
                                          }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                        ]),
                                        systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                          key: 0,
                                          "model-value": systemData.value.disks[0].use,
                                          color: "success",
                                          height: "10",
                                          rounded: "",
                                          class: "mb-4"
                                        }, null, 8, ["model-value"])) : createCommentVNode("", true)
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
                          createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                color: "white",
                                class: "mr-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-chart-line")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" System Performance ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, { cols: "12" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                        createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                        createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                      ]),
                                      createVNode(VProgressLinear, {
                                        "model-value": systemData.value.cpu.usage,
                                        color: "primary",
                                        height: "10",
                                        rounded: "",
                                        class: "mb-4"
                                      }, null, 8, ["model-value"]),
                                      createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                        createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                        createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                      ]),
                                      createVNode(VProgressLinear, {
                                        "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                        color: "info",
                                        height: "10",
                                        rounded: "",
                                        class: "mb-4"
                                      }, null, 8, ["model-value"]),
                                      createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                        createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                        systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "text-subtitle-2"
                                        }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                      ]),
                                      systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                        key: 0,
                                        "model-value": systemData.value.disks[0].use,
                                        color: "success",
                                        height: "10",
                                        rounded: "",
                                        class: "mb-4"
                                      }, null, 8, ["model-value"])) : createCommentVNode("", true)
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
                  _push3(ssrRenderComponent(VRow, { class: "mt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, { cols: "12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-folder-multiple`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-folder-multiple")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Recent Projects `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-folder-multiple")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Recent Projects ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (recentSnippets.value.length > 0) {
                                            _push7(ssrRenderComponent(VRow, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<!--[-->`);
                                                  ssrRenderList(recentSnippets.value, (snippet, index) => {
                                                    _push8(ssrRenderComponent(VCol, {
                                                      key: snippet.id,
                                                      cols: "12",
                                                      sm: "6",
                                                      md: "4"
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(VCard, {
                                                            to: `/snippets?id=${snippet.id}`,
                                                            class: "project-card",
                                                            flat: "",
                                                            hover: ""
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                                                  default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                    if (_push11) {
                                                                      _push11(`<div class="d-flex align-center mb-2" data-v-8dcb631f${_scopeId10}>`);
                                                                      _push11(ssrRenderComponent(VAvatar, {
                                                                        color: getFrameworkColor(snippet.framework),
                                                                        size: "36",
                                                                        class: "mr-3"
                                                                      }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(ssrRenderComponent(VIcon, { color: "white" }, {
                                                                              default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                if (_push13) {
                                                                                  _push13(`${ssrInterpolate(getFrameworkIcon(snippet.framework))}`);
                                                                                } else {
                                                                                  return [
                                                                                    createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                                  ];
                                                                                }
                                                                              }),
                                                                              _: 2
                                                                            }, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createVNode(VIcon, { color: "white" }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                                ]),
                                                                                _: 2
                                                                              }, 1024)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(`<div data-v-8dcb631f${_scopeId10}><div class="text-subtitle-1 font-weight-medium text-truncate" data-v-8dcb631f${_scopeId10}>${ssrInterpolate(snippet.title)}</div><div class="text-caption text-grey" data-v-8dcb631f${_scopeId10}>${ssrInterpolate(getSnippetDate(snippet))}</div></div></div><p class="text-body-2 text-truncate-2 mb-2" data-v-8dcb631f${_scopeId10}>${ssrInterpolate(snippet.description || "No description available")}</p><div class="d-flex align-center justify-space-between" data-v-8dcb631f${_scopeId10}>`);
                                                                      _push11(ssrRenderComponent(VChip, {
                                                                        size: "x-small",
                                                                        color: getFrameworkColor(snippet.framework),
                                                                        class: "mr-2"
                                                                      }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(`${ssrInterpolate(snippet.framework)}`);
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(toDisplayString(snippet.framework), 1)
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(ssrRenderComponent(VBtn, {
                                                                        size: "small",
                                                                        variant: "text",
                                                                        color: "primary",
                                                                        to: `/snippets?id=${snippet.id}`
                                                                      }, {
                                                                        default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                          if (_push12) {
                                                                            _push12(` View `);
                                                                            _push12(ssrRenderComponent(VIcon, {
                                                                              end: "",
                                                                              size: "small"
                                                                            }, {
                                                                              default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                                if (_push13) {
                                                                                  _push13(`mdi-arrow-right`);
                                                                                } else {
                                                                                  return [
                                                                                    createTextVNode("mdi-arrow-right")
                                                                                  ];
                                                                                }
                                                                              }),
                                                                              _: 2
                                                                            }, _parent12, _scopeId11));
                                                                          } else {
                                                                            return [
                                                                              createTextVNode(" View "),
                                                                              createVNode(VIcon, {
                                                                                end: "",
                                                                                size: "small"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("mdi-arrow-right")
                                                                                ]),
                                                                                _: 1
                                                                              })
                                                                            ];
                                                                          }
                                                                        }),
                                                                        _: 2
                                                                      }, _parent11, _scopeId10));
                                                                      _push11(`</div>`);
                                                                    } else {
                                                                      return [
                                                                        createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                                          createVNode(VAvatar, {
                                                                            color: getFrameworkColor(snippet.framework),
                                                                            size: "36",
                                                                            class: "mr-3"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode(VIcon, { color: "white" }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                                ]),
                                                                                _: 2
                                                                              }, 1024)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["color"]),
                                                                          createVNode("div", null, [
                                                                            createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                                          ])
                                                                        ]),
                                                                        createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                                        createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                                          createVNode(VChip, {
                                                                            size: "x-small",
                                                                            color: getFrameworkColor(snippet.framework),
                                                                            class: "mr-2"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(snippet.framework), 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["color"]),
                                                                          createVNode(VBtn, {
                                                                            size: "small",
                                                                            variant: "text",
                                                                            color: "primary",
                                                                            to: `/snippets?id=${snippet.id}`
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(" View "),
                                                                              createVNode(VIcon, {
                                                                                end: "",
                                                                                size: "small"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode("mdi-arrow-right")
                                                                                ]),
                                                                                _: 1
                                                                              })
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["to"])
                                                                        ])
                                                                      ];
                                                                    }
                                                                  }),
                                                                  _: 2
                                                                }, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode(VCardText, { class: "pa-4" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                                        createVNode(VAvatar, {
                                                                          color: getFrameworkColor(snippet.framework),
                                                                          size: "36",
                                                                          class: "mr-3"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode(VIcon, { color: "white" }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                              ]),
                                                                              _: 2
                                                                            }, 1024)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["color"]),
                                                                        createVNode("div", null, [
                                                                          createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                                        ])
                                                                      ]),
                                                                      createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                                      createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                                        createVNode(VChip, {
                                                                          size: "x-small",
                                                                          color: getFrameworkColor(snippet.framework),
                                                                          class: "mr-2"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(snippet.framework), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["color"]),
                                                                        createVNode(VBtn, {
                                                                          size: "small",
                                                                          variant: "text",
                                                                          color: "primary",
                                                                          to: `/snippets?id=${snippet.id}`
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(" View "),
                                                                            createVNode(VIcon, {
                                                                              end: "",
                                                                              size: "small"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode("mdi-arrow-right")
                                                                              ]),
                                                                              _: 1
                                                                            })
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["to"])
                                                                      ])
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ];
                                                              }
                                                            }),
                                                            _: 2
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          return [
                                                            createVNode(VCard, {
                                                              to: `/snippets?id=${snippet.id}`,
                                                              class: "project-card",
                                                              flat: "",
                                                              hover: ""
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardText, { class: "pa-4" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                                      createVNode(VAvatar, {
                                                                        color: getFrameworkColor(snippet.framework),
                                                                        size: "36",
                                                                        class: "mr-3"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode(VIcon, { color: "white" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"]),
                                                                      createVNode("div", null, [
                                                                        createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                        createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                                      ])
                                                                    ]),
                                                                    createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                                    createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                                      createVNode(VChip, {
                                                                        size: "x-small",
                                                                        color: getFrameworkColor(snippet.framework),
                                                                        class: "mr-2"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(snippet.framework), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"]),
                                                                      createVNode(VBtn, {
                                                                        size: "small",
                                                                        variant: "text",
                                                                        color: "primary",
                                                                        to: `/snippets?id=${snippet.id}`
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(" View "),
                                                                          createVNode(VIcon, {
                                                                            end: "",
                                                                            size: "small"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-arrow-right")
                                                                            ]),
                                                                            _: 1
                                                                          })
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["to"])
                                                                    ])
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["to"])
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  });
                                                  _push8(`<!--]-->`);
                                                } else {
                                                  return [
                                                    (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                                      return openBlock(), createBlock(VCol, {
                                                        key: snippet.id,
                                                        cols: "12",
                                                        sm: "6",
                                                        md: "4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            to: `/snippets?id=${snippet.id}`,
                                                            class: "project-card",
                                                            flat: "",
                                                            hover: ""
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, { class: "pa-4" }, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                                    createVNode(VAvatar, {
                                                                      color: getFrameworkColor(snippet.framework),
                                                                      size: "36",
                                                                      class: "mr-3"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { color: "white" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"]),
                                                                    createVNode("div", null, [
                                                                      createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                      createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                                    ])
                                                                  ]),
                                                                  createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                                  createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                                    createVNode(VChip, {
                                                                      size: "x-small",
                                                                      color: getFrameworkColor(snippet.framework),
                                                                      class: "mr-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(snippet.framework), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"]),
                                                                    createVNode(VBtn, {
                                                                      size: "small",
                                                                      variant: "text",
                                                                      color: "primary",
                                                                      to: `/snippets?id=${snippet.id}`
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(" View "),
                                                                        createVNode(VIcon, {
                                                                          end: "",
                                                                          size: "small"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-arrow-right")
                                                                          ]),
                                                                          _: 1
                                                                        })
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["to"])
                                                                  ])
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"])
                                                        ]),
                                                        _: 2
                                                      }, 1024);
                                                    }), 128))
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(ssrRenderComponent(VAlert, {
                                              type: "info",
                                              variant: "tonal",
                                              class: "mb-0"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(` You don&#39;t have any recent projects. Start by creating a new snippet! `);
                                                } else {
                                                  return [
                                                    createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          }
                                        } else {
                                          return [
                                            recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                                  return openBlock(), createBlock(VCol, {
                                                    key: snippet.id,
                                                    cols: "12",
                                                    sm: "6",
                                                    md: "4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        to: `/snippets?id=${snippet.id}`,
                                                        class: "project-card",
                                                        flat: "",
                                                        hover: ""
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, { class: "pa-4" }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                                createVNode(VAvatar, {
                                                                  color: getFrameworkColor(snippet.framework),
                                                                  size: "36",
                                                                  class: "mr-3"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { color: "white" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode("div", null, [
                                                                  createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                  createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                                ])
                                                              ]),
                                                              createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                              createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                                createVNode(VChip, {
                                                                  size: "x-small",
                                                                  color: getFrameworkColor(snippet.framework),
                                                                  class: "mr-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(snippet.framework), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode(VBtn, {
                                                                  size: "small",
                                                                  variant: "text",
                                                                  color: "primary",
                                                                  to: `/snippets?id=${snippet.id}`
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(" View "),
                                                                    createVNode(VIcon, {
                                                                      end: "",
                                                                      size: "small"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-arrow-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["to"])
                                                              ])
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"])
                                                    ]),
                                                    _: 2
                                                  }, 1024);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })) : (openBlock(), createBlock(VAlert, {
                                              key: 1,
                                              type: "info",
                                              variant: "tonal",
                                              class: "mb-0"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                              ]),
                                              _: 1
                                            }))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-folder-multiple")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Recent Projects ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                                return openBlock(), createBlock(VCol, {
                                                  key: snippet.id,
                                                  cols: "12",
                                                  sm: "6",
                                                  md: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      to: `/snippets?id=${snippet.id}`,
                                                      class: "project-card",
                                                      flat: "",
                                                      hover: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, { class: "pa-4" }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                              createVNode(VAvatar, {
                                                                color: getFrameworkColor(snippet.framework),
                                                                size: "36",
                                                                class: "mr-3"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { color: "white" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("div", null, [
                                                                createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                                createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                              ])
                                                            ]),
                                                            createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                            createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                              createVNode(VChip, {
                                                                size: "x-small",
                                                                color: getFrameworkColor(snippet.framework),
                                                                class: "mr-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(snippet.framework), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode(VBtn, {
                                                                size: "small",
                                                                variant: "text",
                                                                color: "primary",
                                                                to: `/snippets?id=${snippet.id}`
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(" View "),
                                                                  createVNode(VIcon, {
                                                                    end: "",
                                                                    size: "small"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-arrow-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["to"])
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["to"])
                                                  ]),
                                                  _: 2
                                                }, 1024);
                                              }), 128))
                                            ]),
                                            _: 1
                                          })) : (openBlock(), createBlock(VAlert, {
                                            key: 1,
                                            type: "info",
                                            variant: "tonal",
                                            class: "mb-0"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                            ]),
                                            _: 1
                                          }))
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
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-folder-multiple")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Recent Projects ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-4" }, {
                                      default: withCtx(() => [
                                        recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                              return openBlock(), createBlock(VCol, {
                                                key: snippet.id,
                                                cols: "12",
                                                sm: "6",
                                                md: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    to: `/snippets?id=${snippet.id}`,
                                                    class: "project-card",
                                                    flat: "",
                                                    hover: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "pa-4" }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                            createVNode(VAvatar, {
                                                              color: getFrameworkColor(snippet.framework),
                                                              size: "36",
                                                              class: "mr-3"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { color: "white" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode("div", null, [
                                                              createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                              createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                            ])
                                                          ]),
                                                          createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                          createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                            createVNode(VChip, {
                                                              size: "x-small",
                                                              color: getFrameworkColor(snippet.framework),
                                                              class: "mr-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(snippet.framework), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode(VBtn, {
                                                              size: "small",
                                                              variant: "text",
                                                              color: "primary",
                                                              to: `/snippets?id=${snippet.id}`
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(" View "),
                                                                createVNode(VIcon, {
                                                                  end: "",
                                                                  size: "small"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-arrow-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["to"])
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["to"])
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock(VAlert, {
                                          key: 1,
                                          type: "info",
                                          variant: "tonal",
                                          class: "mb-0"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                          ]),
                                          _: 1
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-folder-multiple")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Recent Projects ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                            return openBlock(), createBlock(VCol, {
                                              key: snippet.id,
                                              cols: "12",
                                              sm: "6",
                                              md: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  to: `/snippets?id=${snippet.id}`,
                                                  class: "project-card",
                                                  flat: "",
                                                  hover: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "pa-4" }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                          createVNode(VAvatar, {
                                                            color: getFrameworkColor(snippet.framework),
                                                            size: "36",
                                                            class: "mr-3"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { color: "white" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode("div", null, [
                                                            createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                          ])
                                                        ]),
                                                        createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                        createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                          createVNode(VChip, {
                                                            size: "x-small",
                                                            color: getFrameworkColor(snippet.framework),
                                                            class: "mr-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(snippet.framework), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode(VBtn, {
                                                            size: "small",
                                                            variant: "text",
                                                            color: "primary",
                                                            to: `/snippets?id=${snippet.id}`
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(" View "),
                                                              createVNode(VIcon, {
                                                                end: "",
                                                                size: "small"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-arrow-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["to"])
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["to"])
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(VAlert, {
                                        key: 1,
                                        type: "info",
                                        variant: "tonal",
                                        class: "mb-0"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                        ]),
                                        _: 1
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VRow, { class: "mt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, { cols: "12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-tools`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-tools")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Quick Tools `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-tools")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Quick Tools ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VRow, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(quickTools.value, (tool, index) => {
                                                  _push8(ssrRenderComponent(VCol, {
                                                    key: index,
                                                    cols: "6",
                                                    md: "3"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VCard, {
                                                          disabled: tool.disabled,
                                                          to: tool.link,
                                                          class: "rounded-lg tool-card",
                                                          flat: ""
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      size: "36",
                                                                      color: tool.color,
                                                                      class: "mb-2"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`${ssrInterpolate(tool.icon)}`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode(toDisplayString(tool.icon), 1)
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 2
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(`<div class="text-subtitle-1 text-center" data-v-8dcb631f${_scopeId10}>${ssrInterpolate(tool.title)}</div>`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        size: "36",
                                                                        color: tool.color,
                                                                        class: "mb-2"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(tool.icon), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["color"]),
                                                                      createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      size: "36",
                                                                      color: tool.color,
                                                                      class: "mb-2"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(tool.icon), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["color"]),
                                                                    createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VCard, {
                                                            disabled: tool.disabled,
                                                            to: tool.link,
                                                            class: "rounded-lg tool-card",
                                                            flat: ""
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    size: "36",
                                                                    color: tool.color,
                                                                    class: "mb-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(tool.icon), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"]),
                                                                  createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1024)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["disabled", "to"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                                    return openBlock(), createBlock(VCol, {
                                                      key: index,
                                                      cols: "6",
                                                      md: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          disabled: tool.disabled,
                                                          to: tool.link,
                                                          class: "rounded-lg tool-card",
                                                          flat: ""
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  size: "36",
                                                                  color: tool.color,
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(tool.icon), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["disabled", "to"])
                                                      ]),
                                                      _: 2
                                                    }, 1024);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                                  return openBlock(), createBlock(VCol, {
                                                    key: index,
                                                    cols: "6",
                                                    md: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        disabled: tool.disabled,
                                                        to: tool.link,
                                                        class: "rounded-lg tool-card",
                                                        flat: ""
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                size: "36",
                                                                color: tool.color,
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(tool.icon), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["disabled", "to"])
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-tools")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Quick Tools ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                                return openBlock(), createBlock(VCol, {
                                                  key: index,
                                                  cols: "6",
                                                  md: "3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      disabled: tool.disabled,
                                                      to: tool.link,
                                                      class: "rounded-lg tool-card",
                                                      flat: ""
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              size: "36",
                                                              color: tool.color,
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(tool.icon), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["disabled", "to"])
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-tools")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Quick Tools ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-4" }, {
                                      default: withCtx(() => [
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                              return openBlock(), createBlock(VCol, {
                                                key: index,
                                                cols: "6",
                                                md: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    disabled: tool.disabled,
                                                    to: tool.link,
                                                    class: "rounded-lg tool-card",
                                                    flat: ""
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            size: "36",
                                                            color: tool.color,
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(tool.icon), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["disabled", "to"])
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
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-tools")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Quick Tools ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                            return openBlock(), createBlock(VCol, {
                                              key: index,
                                              cols: "6",
                                              md: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  disabled: tool.disabled,
                                                  to: tool.link,
                                                  class: "rounded-lg tool-card",
                                                  flat: ""
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          size: "36",
                                                          color: tool.color,
                                                          class: "mb-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(tool.icon), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["disabled", "to"])
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
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VRow, { class: "mt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, { cols: "12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-lightbulb`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-lightbulb")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Tips and Tricks `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-lightbulb")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Tips and Tricks ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCarousel, {
                                            "hide-delimiters": "",
                                            height: "200",
                                            "show-arrows": "hover",
                                            cycle: "",
                                            interval: "10000"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(tips.value, (tip, i) => {
                                                  _push8(ssrRenderComponent(VCarouselItem, { key: i }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VSheet, {
                                                          height: "100%",
                                                          class: "d-flex align-center justify-center"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`<div class="text-center px-4" data-v-8dcb631f${_scopeId9}>`);
                                                              _push10(ssrRenderComponent(VIcon, {
                                                                size: "36",
                                                                color: tip.color,
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(`${ssrInterpolate(tip.icon)}`);
                                                                  } else {
                                                                    return [
                                                                      createTextVNode(toDisplayString(tip.icon), 1)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 2
                                                              }, _parent10, _scopeId9));
                                                              _push10(`<h3 class="text-h6 mb-2" data-v-8dcb631f${_scopeId9}>${ssrInterpolate(tip.title)}</h3><p data-v-8dcb631f${_scopeId9}>${ssrInterpolate(tip.description)}</p></div>`);
                                                            } else {
                                                              return [
                                                                createVNode("div", { class: "text-center px-4" }, [
                                                                  createVNode(VIcon, {
                                                                    size: "36",
                                                                    color: tip.color,
                                                                    class: "mb-2"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(tip.icon), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["color"]),
                                                                  createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                                  createVNode("p", null, toDisplayString(tip.description), 1)
                                                                ])
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VSheet, {
                                                            height: "100%",
                                                            class: "d-flex align-center justify-center"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-center px-4" }, [
                                                                createVNode(VIcon, {
                                                                  size: "36",
                                                                  color: tip.color,
                                                                  class: "mb-2"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(tip.icon), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["color"]),
                                                                createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                                createVNode("p", null, toDisplayString(tip.description), 1)
                                                              ])
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
                                                  (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                                    return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                                      default: withCtx(() => [
                                                        createVNode(VSheet, {
                                                          height: "100%",
                                                          class: "d-flex align-center justify-center"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-center px-4" }, [
                                                              createVNode(VIcon, {
                                                                size: "36",
                                                                color: tip.color,
                                                                class: "mb-2"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode(toDisplayString(tip.icon), 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["color"]),
                                                              createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                              createVNode("p", null, toDisplayString(tip.description), 1)
                                                            ])
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1024);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCarousel, {
                                              "hide-delimiters": "",
                                              height: "200",
                                              "show-arrows": "hover",
                                              cycle: "",
                                              interval: "10000"
                                            }, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                                  return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                                    default: withCtx(() => [
                                                      createVNode(VSheet, {
                                                        height: "100%",
                                                        class: "d-flex align-center justify-center"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-center px-4" }, [
                                                            createVNode(VIcon, {
                                                              size: "36",
                                                              color: tip.color,
                                                              class: "mb-2"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(tip.icon), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["color"]),
                                                            createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                            createVNode("p", null, toDisplayString(tip.description), 1)
                                                          ])
                                                        ]),
                                                        _: 2
                                                      }, 1024)
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-lightbulb")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Tips and Tricks ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VCarousel, {
                                            "hide-delimiters": "",
                                            height: "200",
                                            "show-arrows": "hover",
                                            cycle: "",
                                            interval: "10000"
                                          }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                                return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                                  default: withCtx(() => [
                                                    createVNode(VSheet, {
                                                      height: "100%",
                                                      class: "d-flex align-center justify-center"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-center px-4" }, [
                                                          createVNode(VIcon, {
                                                            size: "36",
                                                            color: tip.color,
                                                            class: "mb-2"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(tip.icon), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"]),
                                                          createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                          createVNode("p", null, toDisplayString(tip.description), 1)
                                                        ])
                                                      ]),
                                                      _: 2
                                                    }, 1024)
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-lightbulb")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Tips and Tricks ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-4" }, {
                                      default: withCtx(() => [
                                        createVNode(VCarousel, {
                                          "hide-delimiters": "",
                                          height: "200",
                                          "show-arrows": "hover",
                                          cycle: "",
                                          interval: "10000"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                              return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                                default: withCtx(() => [
                                                  createVNode(VSheet, {
                                                    height: "100%",
                                                    class: "d-flex align-center justify-center"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-center px-4" }, [
                                                        createVNode(VIcon, {
                                                          size: "36",
                                                          color: tip.color,
                                                          class: "mb-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(tip.icon), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                        createVNode("p", null, toDisplayString(tip.description), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
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
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-lightbulb")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Tips and Tricks ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VCarousel, {
                                        "hide-delimiters": "",
                                        height: "200",
                                        "show-arrows": "hover",
                                        cycle: "",
                                        interval: "10000"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                            return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                              default: withCtx(() => [
                                                createVNode(VSheet, {
                                                  height: "100%",
                                                  class: "d-flex align-center justify-center"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "text-center px-4" }, [
                                                      createVNode(VIcon, {
                                                        size: "36",
                                                        color: tip.color,
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(tip.icon), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                      createVNode("p", null, toDisplayString(tip.description), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024)
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
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(dashboardCards.value, (card, index) => {
                          return openBlock(), createBlock(VCol, {
                            key: index,
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "2",
                                height: "100%"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "48",
                                        color: card.color,
                                        class: "mb-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(card.icon), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["color"]),
                                      createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                      createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    }),
                    createVNode(VCard, {
                      class: "rounded-lg mt-6 mb-2",
                      elevation: "2"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                          default: withCtx(() => [
                            createVNode(VIcon, {
                              color: "white",
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-chart-line")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" System Performance ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pa-4" }, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                      createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                      createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                    ]),
                                    createVNode(VProgressLinear, {
                                      "model-value": systemData.value.cpu.usage,
                                      color: "primary",
                                      height: "10",
                                      rounded: "",
                                      class: "mb-4"
                                    }, null, 8, ["model-value"]),
                                    createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                      createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                      createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                    ]),
                                    createVNode(VProgressLinear, {
                                      "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                      color: "info",
                                      height: "10",
                                      rounded: "",
                                      class: "mb-4"
                                    }, null, 8, ["model-value"]),
                                    createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                      createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                      systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-subtitle-2"
                                      }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                    ]),
                                    systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                      key: 0,
                                      "model-value": systemData.value.disks[0].use,
                                      color: "success",
                                      height: "10",
                                      rounded: "",
                                      class: "mb-4"
                                    }, null, 8, ["model-value"])) : createCommentVNode("", true)
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
                    createVNode(VRow, { class: "mt-4" }, {
                      default: withCtx(() => [
                        createVNode(VCol, { cols: "12" }, {
                          default: withCtx(() => [
                            createVNode(VCard, {
                              class: "rounded-lg",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-folder-multiple")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Recent Projects ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                          return openBlock(), createBlock(VCol, {
                                            key: snippet.id,
                                            cols: "12",
                                            sm: "6",
                                            md: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                to: `/snippets?id=${snippet.id}`,
                                                class: "project-card",
                                                flat: "",
                                                hover: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "pa-4" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                        createVNode(VAvatar, {
                                                          color: getFrameworkColor(snippet.framework),
                                                          size: "36",
                                                          class: "mr-3"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { color: "white" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                              ]),
                                                              _: 2
                                                            }, 1024)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode("div", null, [
                                                          createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                        ])
                                                      ]),
                                                      createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                      createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                        createVNode(VChip, {
                                                          size: "x-small",
                                                          color: getFrameworkColor(snippet.framework),
                                                          class: "mr-2"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(snippet.framework), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"]),
                                                        createVNode(VBtn, {
                                                          size: "small",
                                                          variant: "text",
                                                          color: "primary",
                                                          to: `/snippets?id=${snippet.id}`
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(" View "),
                                                            createVNode(VIcon, {
                                                              end: "",
                                                              size: "small"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-arrow-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["to"])
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["to"])
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock(VAlert, {
                                      key: 1,
                                      type: "info",
                                      variant: "tonal",
                                      class: "mb-0"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                      ]),
                                      _: 1
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
                    createVNode(VRow, { class: "mt-4" }, {
                      default: withCtx(() => [
                        createVNode(VCol, { cols: "12" }, {
                          default: withCtx(() => [
                            createVNode(VCard, {
                              class: "rounded-lg",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-tools")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Quick Tools ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                          return openBlock(), createBlock(VCol, {
                                            key: index,
                                            cols: "6",
                                            md: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                disabled: tool.disabled,
                                                to: tool.link,
                                                class: "rounded-lg tool-card",
                                                flat: ""
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "36",
                                                        color: tool.color,
                                                        class: "mb-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(tool.icon), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["disabled", "to"])
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
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VRow, { class: "mt-4" }, {
                      default: withCtx(() => [
                        createVNode(VCol, { cols: "12" }, {
                          default: withCtx(() => [
                            createVNode(VCard, {
                              class: "rounded-lg",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-lightbulb")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Tips and Tricks ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VCarousel, {
                                      "hide-delimiters": "",
                                      height: "200",
                                      "show-arrows": "hover",
                                      cycle: "",
                                      interval: "10000"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                          return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                            default: withCtx(() => [
                                              createVNode(VSheet, {
                                                height: "100%",
                                                class: "d-flex align-center justify-center"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "text-center px-4" }, [
                                                    createVNode(VIcon, {
                                                      size: "36",
                                                      color: tip.color,
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(tip.icon), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"]),
                                                    createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                    createVNode("p", null, toDisplayString(tip.description), 1)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1024)
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
              createVNode(VMain, { class: "ma-4" }, {
                default: withCtx(() => [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(dashboardCards.value, (card, index) => {
                        return openBlock(), createBlock(VCol, {
                          key: index,
                          cols: "12",
                          md: "3"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCard, {
                              class: "rounded-lg",
                              elevation: "2",
                              height: "100%"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "48",
                                      color: card.color,
                                      class: "mb-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(card.icon), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["color"]),
                                    createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(card.count), 1),
                                    createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, toDisplayString(card.title), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  }),
                  createVNode(VCard, {
                    class: "rounded-lg mt-6 mb-2",
                    elevation: "2"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                        default: withCtx(() => [
                          createVNode(VIcon, {
                            color: "white",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-chart-line")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" System Performance ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pa-4" }, {
                        default: withCtx(() => [
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                    createVNode("div", { class: "text-subtitle-1" }, "CPU Usage"),
                                    createVNode("div", { class: "text-subtitle-2" }, toDisplayString(systemData.value.cpu.usage.toFixed(2)) + "%", 1)
                                  ]),
                                  createVNode(VProgressLinear, {
                                    "model-value": systemData.value.cpu.usage,
                                    color: "primary",
                                    height: "10",
                                    rounded: "",
                                    class: "mb-4"
                                  }, null, 8, ["model-value"]),
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                    createVNode("div", { class: "text-subtitle-1" }, "Memory Usage"),
                                    createVNode("div", { class: "text-subtitle-2" }, toDisplayString(Math.round(systemData.value.memory.used / systemData.value.memory.total * 100)) + "%", 1)
                                  ]),
                                  createVNode(VProgressLinear, {
                                    "model-value": systemData.value.memory.used / systemData.value.memory.total * 100,
                                    color: "info",
                                    height: "10",
                                    rounded: "",
                                    class: "mb-4"
                                  }, null, 8, ["model-value"]),
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-2" }, [
                                    createVNode("div", { class: "text-subtitle-1" }, "Disk Space"),
                                    systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "text-subtitle-2"
                                    }, toDisplayString(Math.round(systemData.value.disks[0].use)) + "% ", 1)) : createCommentVNode("", true)
                                  ]),
                                  systemData.value.disks && systemData.value.disks.length > 0 ? (openBlock(), createBlock(VProgressLinear, {
                                    key: 0,
                                    "model-value": systemData.value.disks[0].use,
                                    color: "success",
                                    height: "10",
                                    rounded: "",
                                    class: "mb-4"
                                  }, null, 8, ["model-value"])) : createCommentVNode("", true)
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
                  createVNode(VRow, { class: "mt-4" }, {
                    default: withCtx(() => [
                      createVNode(VCol, { cols: "12" }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "rounded-lg",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-folder-multiple")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Recent Projects ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  recentSnippets.value.length > 0 ? (openBlock(), createBlock(VRow, { key: 0 }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(recentSnippets.value, (snippet, index) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: snippet.id,
                                          cols: "12",
                                          sm: "6",
                                          md: "4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              to: `/snippets?id=${snippet.id}`,
                                              class: "project-card",
                                              flat: "",
                                              hover: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "pa-4" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                      createVNode(VAvatar, {
                                                        color: getFrameworkColor(snippet.framework),
                                                        size: "36",
                                                        class: "mr-3"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { color: "white" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(getFrameworkIcon(snippet.framework)), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode("div", null, [
                                                        createVNode("div", { class: "text-subtitle-1 font-weight-medium text-truncate" }, toDisplayString(snippet.title), 1),
                                                        createVNode("div", { class: "text-caption text-grey" }, toDisplayString(getSnippetDate(snippet)), 1)
                                                      ])
                                                    ]),
                                                    createVNode("p", { class: "text-body-2 text-truncate-2 mb-2" }, toDisplayString(snippet.description || "No description available"), 1),
                                                    createVNode("div", { class: "d-flex align-center justify-space-between" }, [
                                                      createVNode(VChip, {
                                                        size: "x-small",
                                                        color: getFrameworkColor(snippet.framework),
                                                        class: "mr-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(snippet.framework), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"]),
                                                      createVNode(VBtn, {
                                                        size: "small",
                                                        variant: "text",
                                                        color: "primary",
                                                        to: `/snippets?id=${snippet.id}`
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" View "),
                                                          createVNode(VIcon, {
                                                            end: "",
                                                            size: "small"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-arrow-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["to"])
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"])
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock(VAlert, {
                                    key: 1,
                                    type: "info",
                                    variant: "tonal",
                                    class: "mb-0"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" You don't have any recent projects. Start by creating a new snippet! ")
                                    ]),
                                    _: 1
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
                  createVNode(VRow, { class: "mt-4" }, {
                    default: withCtx(() => [
                      createVNode(VCol, { cols: "12" }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "rounded-lg",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-tools")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Quick Tools ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(quickTools.value, (tool, index) => {
                                        return openBlock(), createBlock(VCol, {
                                          key: index,
                                          cols: "6",
                                          md: "3"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VCard, {
                                              disabled: tool.disabled,
                                              to: tool.link,
                                              class: "rounded-lg tool-card",
                                              flat: ""
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "d-flex flex-column align-center justify-center pa-4" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "36",
                                                      color: tool.color,
                                                      class: "mb-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(tool.icon), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"]),
                                                    createVNode("div", { class: "text-subtitle-1 text-center" }, toDisplayString(tool.title), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["disabled", "to"])
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
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VRow, { class: "mt-4" }, {
                    default: withCtx(() => [
                      createVNode(VCol, { cols: "12" }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "rounded-lg",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-lightbulb")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Tips and Tricks ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VCarousel, {
                                    "hide-delimiters": "",
                                    height: "200",
                                    "show-arrows": "hover",
                                    cycle: "",
                                    interval: "10000"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(tips.value, (tip, i) => {
                                        return openBlock(), createBlock(VCarouselItem, { key: i }, {
                                          default: withCtx(() => [
                                            createVNode(VSheet, {
                                              height: "100%",
                                              class: "d-flex align-center justify-center"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "text-center px-4" }, [
                                                  createVNode(VIcon, {
                                                    size: "36",
                                                    color: tip.color,
                                                    class: "mb-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(tip.icon), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"]),
                                                  createVNode("h3", { class: "text-h6 mb-2" }, toDisplayString(tip.title), 1),
                                                  createVNode("p", null, toDisplayString(tip.description), 1)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1024)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8dcb631f"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard.vue.mjs.map
