import { defineComponent, ref, computed, watch, withCtx, createTextVNode, createVNode, withKeys, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { S as useUserStore, V as VApp, f as VCard, bp as VSwitch, e as VBtn, Y as VCardText, g as VIcon, bo as VBtnToggle, d as VSpacer, a1 as VSnackbar, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VSelect } from './VSelect.mjs';
import { a as VChipGroup, V as VChip } from './VChip.mjs';
import { V as VTabs, a as VTab } from './VTabs.mjs';
import { V as VWindow, a as VWindowItem } from './VWindowItem.mjs';
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
import 'pinia-plugin-persistedstate';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './VCheckboxBtn.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "responsive",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Responsive Viewer",
      meta: [
        { name: "description", content: "View your websites on different devices" },
        { name: "keywords", content: "responsive, viewer, responsive viewer, responsive design, responsive design viewer, responsive design preview, responsive design preview tool, responsive design preview tool, responsive design preview tool, responsive design preview tool" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Responsive Viewer" },
        { name: "og:description", content: "View your websites on different devices" }
      ]
    });
    useUserStore();
    const url = ref("");
    const displayUrl = ref("");
    const tab = ref("mobile");
    const iframeRefs = ref({});
    const iframeKey = ref(0);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const xFrameError = ref(false);
    const orientation = ref("portrait");
    const sideBySideMode = ref(false);
    ref(false);
    ref(false);
    const urlHistory = ref([]);
    const selectedDevices = ref(["iphone"]);
    const autoRefresh = ref(false);
    const refreshInterval = ref(5);
    let refreshTimer = null;
    const refreshIntervals = [
      { title: "5 seconds", value: 5 },
      { title: "10 seconds", value: 10 },
      { title: "30 seconds", value: 30 },
      { title: "1 minute", value: 60 }
    ];
    const devices = [
      { id: "iphone", name: "iPhone", icon: "mdi-cellphone", width: 375, height: 667 },
      { id: "android", name: "Android", icon: "mdi-android", width: 360, height: 640 },
      { id: "ipad", name: "iPad", icon: "mdi-apple", width: 768, height: 1024 },
      { id: "tablet", name: "Tablet", icon: "mdi-tablet", width: 600, height: 960 },
      { id: "laptop", name: "Laptop", icon: "mdi-laptop", width: 1024, height: 768 },
      { id: "desktop", name: "Desktop", icon: "mdi-monitor", width: 1280, height: 800 },
      { id: "tv", name: "TV", icon: "mdi-television", width: 1920, height: 1080 }
    ];
    const isValidUrl = computed(() => {
      if (!url.value) return false;
      try {
        new URL(url.value);
        return true;
      } catch (e) {
        return false;
      }
    });
    const getDeviceById = (id) => {
      return devices.find((device) => device.id === id) || devices[0];
    };
    const getDeviceDimensions = (deviceId) => {
      const device = getDeviceById(deviceId);
      if (orientation.value === "landscape") {
        return `${device.height}×${device.width}`;
      }
      return `${device.width}×${device.height}`;
    };
    const getIframeStyle = (deviceId) => {
      const device = getDeviceById(deviceId);
      if (orientation.value === "landscape") {
        return {
          width: `${device.height}px`,
          height: `${device.width}px`
        };
      }
      return {
        width: `${device.width}px`,
        height: `${device.height}px`
      };
    };
    const loadUrl = () => {
      if (!isValidUrl.value) {
        snackbarText.value = "Please enter a valid URL";
        snackbarColor.value = "error";
        snackbar.value = true;
        return;
      }
      if (!url.value.startsWith("http://") && !url.value.startsWith("https://")) {
        url.value = "https://" + url.value;
      }
      xFrameError.value = false;
      displayUrl.value = url.value;
      iframeKey.value++;
      if (!urlHistory.value.includes(url.value)) {
        urlHistory.value.unshift(url.value);
        if (urlHistory.value.length > 10) {
          urlHistory.value.pop();
        }
      }
      setupAutoRefresh();
    };
    const refreshIframe = () => {
      if (displayUrl.value) {
        iframeKey.value++;
        xFrameError.value = false;
      } else {
        snackbarText.value = "No URL to refresh";
        snackbarColor.value = "warning";
        snackbar.value = true;
      }
    };
    const refreshCurrentIframe = () => {
      if (displayUrl.value) {
        iframeKey.value++;
        xFrameError.value = false;
      }
    };
    const refreshSpecificIframe = (deviceId) => {
      if (displayUrl.value) {
        iframeKey.value++;
        xFrameError.value = false;
      }
    };
    const setupAutoRefresh = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
      if (autoRefresh.value && displayUrl.value) {
        refreshTimer = (void 0).setInterval(() => {
          refreshIframe();
        }, refreshInterval.value * 1e3);
      }
    };
    watch([autoRefresh, refreshInterval], () => {
      setupAutoRefresh();
    });
    watch(selectedDevices, (newValue) => {
      if (newValue.length > 1) {
        selectedDevices.value = [newValue[newValue.length - 1]];
      }
    });
    watch(orientation, (newOrientation) => {
      if (newOrientation === "landscape" && selectedDevices.value.length > 1) {
        selectedDevices.value = [selectedDevices.value[0]];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, { class: "d-flex flex-column align-center justify-center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, {
                    width: "100%",
                    "max-width": "800px",
                    class: "ma-12 pa-4",
                    elevation: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VTextField, {
                          modelValue: url.value,
                          "onUpdate:modelValue": ($event) => url.value = $event,
                          label: "Enter a URL",
                          density: "comfortable",
                          "prepend-inner-icon": "mdi-web",
                          variant: "outlined",
                          placeholder: "https://example.com",
                          clearable: "",
                          onKeyup: loadUrl
                        }, null, _parent4, _scopeId3));
                        _push4(`<div class="d-flex flex-wrap justify-space-between align-center mt-2" data-v-9252cc7a${_scopeId3}><div class="d-flex align-center" data-v-9252cc7a${_scopeId3}>`);
                        _push4(ssrRenderComponent(VSwitch, {
                          modelValue: autoRefresh.value,
                          "onUpdate:modelValue": ($event) => autoRefresh.value = $event,
                          color: "primary",
                          "hide-details": "",
                          label: "Auto-refresh",
                          class: "mr-4"
                        }, null, _parent4, _scopeId3));
                        if (autoRefresh.value) {
                          _push4(ssrRenderComponent(VSelect, {
                            modelValue: refreshInterval.value,
                            "onUpdate:modelValue": ($event) => refreshInterval.value = $event,
                            items: refreshIntervals,
                            label: "Interval",
                            density: "compact",
                            variant: "outlined",
                            "hide-details": "",
                            style: { "width": "120px" }
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          onClick: loadUrl,
                          disabled: !isValidUrl.value,
                          "prepend-icon": "mdi-eye"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` View `);
                            } else {
                              return [
                                createTextVNode(" View ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode(VTextField, {
                            modelValue: url.value,
                            "onUpdate:modelValue": ($event) => url.value = $event,
                            label: "Enter a URL",
                            density: "comfortable",
                            "prepend-inner-icon": "mdi-web",
                            variant: "outlined",
                            placeholder: "https://example.com",
                            clearable: "",
                            onKeyup: withKeys(loadUrl, ["enter"])
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("div", { class: "d-flex flex-wrap justify-space-between align-center mt-2" }, [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode(VSwitch, {
                                modelValue: autoRefresh.value,
                                "onUpdate:modelValue": ($event) => autoRefresh.value = $event,
                                color: "primary",
                                "hide-details": "",
                                label: "Auto-refresh",
                                class: "mr-4"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              autoRefresh.value ? (openBlock(), createBlock(VSelect, {
                                key: 0,
                                modelValue: refreshInterval.value,
                                "onUpdate:modelValue": ($event) => refreshInterval.value = $event,
                                items: refreshIntervals,
                                label: "Interval",
                                density: "compact",
                                variant: "outlined",
                                "hide-details": "",
                                style: { "width": "120px" }
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                            ]),
                            createVNode(VBtn, {
                              color: "primary",
                              onClick: loadUrl,
                              disabled: !isValidUrl.value,
                              "prepend-icon": "mdi-eye"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" View ")
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCard, {
                    width: "100%",
                    class: "mb-4",
                    elevation: "1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardText, { class: "d-flex flex-wrap justify-space-between align-center py-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex align-center" data-v-9252cc7a${_scopeId4}>`);
                              _push5(ssrRenderComponent(VChipGroup, {
                                modelValue: selectedDevices.value,
                                "onUpdate:modelValue": ($event) => selectedDevices.value = $event,
                                multiple: "",
                                column: "",
                                class: "mr-4",
                                max: 1
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(devices, (device) => {
                                      _push6(ssrRenderComponent(VChip, {
                                        key: device.id,
                                        value: device.id,
                                        filter: ""
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { start: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(device.icon)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(device.icon), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(` ${ssrInterpolate(device.name)}`);
                                          } else {
                                            return [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(device.icon), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createTextVNode(" " + toDisplayString(device.name), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                        return createVNode(VChip, {
                                          key: device.id,
                                          value: device.id,
                                          filter: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(device.icon), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createTextVNode(" " + toDisplayString(device.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 64))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</div><div class="d-flex align-center" data-v-9252cc7a${_scopeId4}>`);
                              _push5(ssrRenderComponent(VBtnToggle, {
                                modelValue: orientation.value,
                                "onUpdate:modelValue": ($event) => orientation.value = $event,
                                color: "primary",
                                density: "comfortable"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VBtn, {
                                      value: "portrait",
                                      "prepend-icon": "mdi-phone-portrait"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Portrait`);
                                        } else {
                                          return [
                                            createTextVNode("Portrait")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VBtn, {
                                      value: "landscape",
                                      "prepend-icon": "mdi-phone-landscape"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Landscape`);
                                        } else {
                                          return [
                                            createTextVNode("Landscape")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VBtn, {
                                        value: "portrait",
                                        "prepend-icon": "mdi-phone-portrait"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Portrait")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        value: "landscape",
                                        "prepend-icon": "mdi-phone-landscape"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Landscape")
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
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode(VChipGroup, {
                                    modelValue: selectedDevices.value,
                                    "onUpdate:modelValue": ($event) => selectedDevices.value = $event,
                                    multiple: "",
                                    column: "",
                                    class: "mr-4",
                                    max: 1
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                        return createVNode(VChip, {
                                          key: device.id,
                                          value: device.id,
                                          filter: ""
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(device.icon), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createTextVNode(" " + toDisplayString(device.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode(VBtnToggle, {
                                    modelValue: orientation.value,
                                    "onUpdate:modelValue": ($event) => orientation.value = $event,
                                    color: "primary",
                                    density: "comfortable"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VBtn, {
                                        value: "portrait",
                                        "prepend-icon": "mdi-phone-portrait"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Portrait")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        value: "landscape",
                                        "prepend-icon": "mdi-phone-landscape"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Landscape")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardText, { class: "d-flex flex-wrap justify-space-between align-center py-2" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "d-flex align-center" }, [
                                createVNode(VChipGroup, {
                                  modelValue: selectedDevices.value,
                                  "onUpdate:modelValue": ($event) => selectedDevices.value = $event,
                                  multiple: "",
                                  column: "",
                                  class: "mr-4",
                                  max: 1
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                      return createVNode(VChip, {
                                        key: device.id,
                                        value: device.id,
                                        filter: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(device.icon), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createTextVNode(" " + toDisplayString(device.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 64))
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "d-flex align-center" }, [
                                createVNode(VBtnToggle, {
                                  modelValue: orientation.value,
                                  "onUpdate:modelValue": ($event) => orientation.value = $event,
                                  color: "primary",
                                  density: "comfortable"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VBtn, {
                                      value: "portrait",
                                      "prepend-icon": "mdi-phone-portrait"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Portrait")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VBtn, {
                                      value: "landscape",
                                      "prepend-icon": "mdi-phone-landscape"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Landscape")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (sideBySideMode.value) {
                    _push3(`<div class="d-flex flex-wrap justify-center gap-4 w-100" data-v-9252cc7a${_scopeId2}><!--[-->`);
                    ssrRenderList(selectedDevices.value, (deviceId) => {
                      _push3(`<div class="device-container" data-v-9252cc7a${_scopeId2}><div class="${ssrRenderClass([{ "landscape": orientation.value === "landscape" }, "iframe-container"])}" data-v-9252cc7a${_scopeId2}><div class="iframe-header d-flex align-center px-2" data-v-9252cc7a${_scopeId2}>`);
                      _push3(ssrRenderComponent(VIcon, {
                        size: "small",
                        class: "mr-2"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(getDeviceById(deviceId).icon)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(getDeviceById(deviceId).icon), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<span class="text-caption" data-v-9252cc7a${_scopeId2}>${ssrInterpolate(getDeviceDimensions(deviceId))}</span>`);
                      _push3(ssrRenderComponent(VSpacer, null, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(VBtn, {
                        density: "compact",
                        icon: "mdi-refresh",
                        size: "small",
                        variant: "text",
                        onClick: ($event) => refreshSpecificIframe()
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                      if (displayUrl.value) {
                        _push3(`<div class="iframe-wrapper" data-v-9252cc7a${_scopeId2}><iframe${ssrRenderAttr("src", displayUrl.value)} class="overflow-scroll shadow rounded-b-lg" sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes" style="${ssrRenderStyle(getIframeStyle(deviceId))}" data-v-9252cc7a${_scopeId2}></iframe>`);
                        if (xFrameError.value) {
                          _push3(`<div class="iframe-error" data-v-9252cc7a${_scopeId2}>`);
                          _push3(ssrRenderComponent(VIcon, {
                            color: "error",
                            size: "large",
                            class: "mb-2"
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`mdi-alert-circle`);
                              } else {
                                return [
                                  createTextVNode("mdi-alert-circle")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                          _push3(`<p data-v-9252cc7a${_scopeId2}>This site cannot be displayed in an iframe because it has set &#39;X-Frame-Options&#39; to &#39;sameorigin&#39;. </p>`);
                          _push3(ssrRenderComponent(VBtn, {
                            color: "primary",
                            size: "small",
                            href: displayUrl.value,
                            target: "_blank",
                            class: "mt-2"
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(` Open in a new tab `);
                              } else {
                                return [
                                  createTextVNode(" Open in a new tab ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                          _push3(`</div>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      } else {
                        _push3(`<div class="iframe-placeholder d-flex flex-column align-center justify-center" data-v-9252cc7a${_scopeId2}>`);
                        _push3(ssrRenderComponent(VIcon, {
                          size: "large",
                          color: "grey-lighten-1"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`mdi-web-off`);
                            } else {
                              return [
                                createTextVNode("mdi-web-off")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`<p class="text-grey-darken-1 mt-2" data-v-9252cc7a${_scopeId2}>Enter a URL to preview the site</p></div>`);
                      }
                      _push3(`</div></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(ssrRenderComponent(VCard, {
                      width: "100%",
                      class: "overflow-hidden",
                      elevation: "3"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VTabs, {
                            modelValue: tab.value,
                            "onUpdate:modelValue": ($event) => tab.value = $event,
                            density: "comfortable",
                            "align-tabs": "center",
                            "bg-color": "primary",
                            "slider-color": "secondary",
                            color: "white"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(devices, (device) => {
                                  _push5(ssrRenderComponent(VTab, {
                                    key: device.id,
                                    value: device.id
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(VIcon, {
                                          icon: device.icon,
                                          class: "mr-2"
                                        }, null, _parent6, _scopeId5));
                                        _push6(` ${ssrInterpolate(device.name)} <span class="text-caption ml-1" data-v-9252cc7a${_scopeId5}>(${ssrInterpolate(getDeviceDimensions(device.id))})</span>`);
                                      } else {
                                        return [
                                          createVNode(VIcon, {
                                            icon: device.icon,
                                            class: "mr-2"
                                          }, null, 8, ["icon"]),
                                          createTextVNode(" " + toDisplayString(device.name) + " ", 1),
                                          createVNode("span", { class: "text-caption ml-1" }, "(" + toDisplayString(getDeviceDimensions(device.id)) + ")", 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                    return createVNode(VTab, {
                                      key: device.id,
                                      value: device.id
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          icon: device.icon,
                                          class: "mr-2"
                                        }, null, 8, ["icon"]),
                                        createTextVNode(" " + toDisplayString(device.name) + " ", 1),
                                        createVNode("span", { class: "text-caption ml-1" }, "(" + toDisplayString(getDeviceDimensions(device.id)) + ")", 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 64))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VWindow, {
                            modelValue: tab.value,
                            "onUpdate:modelValue": ($event) => tab.value = $event,
                            class: "pa-4"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(devices, (device) => {
                                  _push5(ssrRenderComponent(VWindowItem, {
                                    key: device.id,
                                    value: device.id,
                                    class: "d-flex justify-center"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="${ssrRenderClass([{ "landscape": orientation.value === "landscape" }, "iframe-container"])}" data-v-9252cc7a${_scopeId5}><div class="iframe-header d-flex align-center px-2" data-v-9252cc7a${_scopeId5}>`);
                                        _push6(ssrRenderComponent(VIcon, {
                                          size: "small",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(device.icon)}`);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(device.icon), 1)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(`<span class="text-caption" data-v-9252cc7a${_scopeId5}>${ssrInterpolate(getDeviceDimensions(device.id))}</span>`);
                                        _push6(ssrRenderComponent(VSpacer, null, null, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(VBtn, {
                                          density: "compact",
                                          icon: "mdi-refresh",
                                          size: "small",
                                          variant: "text",
                                          onClick: refreshCurrentIframe
                                        }, null, _parent6, _scopeId5));
                                        _push6(`</div>`);
                                        if (displayUrl.value) {
                                          _push6(`<div class="iframe-wrapper" data-v-9252cc7a${_scopeId5}>`);
                                          if (tab.value === device.id) {
                                            _push6(`<iframe${ssrRenderAttr("src", displayUrl.value)} class="overflow-scroll shadow rounded-b-lg" sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes" style="${ssrRenderStyle(getIframeStyle(device.id))}" data-v-9252cc7a${_scopeId5}></iframe>`);
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          if (xFrameError.value) {
                                            _push6(`<div class="iframe-error" data-v-9252cc7a${_scopeId5}>`);
                                            _push6(ssrRenderComponent(VIcon, {
                                              color: "error",
                                              size: "large",
                                              class: "mb-2"
                                            }, {
                                              default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(`mdi-alert-circle`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-alert-circle")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                            _push6(`<p data-v-9252cc7a${_scopeId5}>This site cannot be displayed in an iframe because it has set &#39;X-Frame-Options&#39; to &#39;sameorigin&#39;. </p>`);
                                            _push6(ssrRenderComponent(VBtn, {
                                              color: "primary",
                                              size: "small",
                                              href: displayUrl.value,
                                              target: "_blank",
                                              class: "mt-2"
                                            }, {
                                              default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  _push7(` Open in a new tab `);
                                                } else {
                                                  return [
                                                    createTextVNode(" Open in a new tab ")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                            _push6(`</div>`);
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                          _push6(`</div>`);
                                        } else {
                                          _push6(`<div class="iframe-placeholder d-flex flex-column align-center justify-center" data-v-9252cc7a${_scopeId5}>`);
                                          _push6(ssrRenderComponent(VIcon, {
                                            size: "large",
                                            color: "grey-lighten-1"
                                          }, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`mdi-web-off`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-web-off")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                          _push6(`<p class="text-grey-darken-1 mt-2" data-v-9252cc7a${_scopeId5}>Enter a URL to preview the site</p></div>`);
                                        }
                                        _push6(`</div>`);
                                      } else {
                                        return [
                                          createVNode("div", {
                                            class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                                          }, [
                                            createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(device.icon), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(device.id)), 1),
                                              createVNode(VSpacer),
                                              createVNode(VBtn, {
                                                density: "compact",
                                                icon: "mdi-refresh",
                                                size: "small",
                                                variant: "text",
                                                onClick: refreshCurrentIframe
                                              })
                                            ]),
                                            displayUrl.value ? (openBlock(), createBlock("div", {
                                              key: 0,
                                              class: "iframe-wrapper"
                                            }, [
                                              tab.value === device.id ? (openBlock(), createBlock("iframe", {
                                                src: displayUrl.value,
                                                class: "overflow-scroll shadow rounded-b-lg",
                                                sandbox: "allow-forms allow-same-origin allow-scripts",
                                                scrolling: "yes",
                                                style: getIframeStyle(device.id),
                                                ref_for: true,
                                                ref: (el) => {
                                                  if (el) iframeRefs.value[device.id] = el;
                                                },
                                                key: `${device.id}-${iframeKey.value}`
                                              }, null, 12, ["src"])) : createCommentVNode("", true),
                                              xFrameError.value ? (openBlock(), createBlock("div", {
                                                key: 1,
                                                class: "iframe-error"
                                              }, [
                                                createVNode(VIcon, {
                                                  color: "error",
                                                  size: "large",
                                                  class: "mb-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-alert-circle")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                                createVNode(VBtn, {
                                                  color: "primary",
                                                  size: "small",
                                                  href: displayUrl.value,
                                                  target: "_blank",
                                                  class: "mt-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Open in a new tab ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["href"])
                                              ])) : createCommentVNode("", true)
                                            ])) : (openBlock(), createBlock("div", {
                                              key: 1,
                                              class: "iframe-placeholder d-flex flex-column align-center justify-center"
                                            }, [
                                              createVNode(VIcon, {
                                                size: "large",
                                                color: "grey-lighten-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-web-off")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                                            ]))
                                          ], 2)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                    return createVNode(VWindowItem, {
                                      key: device.id,
                                      value: device.id,
                                      class: "d-flex justify-center"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", {
                                          class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                                        }, [
                                          createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(device.icon), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(device.id)), 1),
                                            createVNode(VSpacer),
                                            createVNode(VBtn, {
                                              density: "compact",
                                              icon: "mdi-refresh",
                                              size: "small",
                                              variant: "text",
                                              onClick: refreshCurrentIframe
                                            })
                                          ]),
                                          displayUrl.value ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "iframe-wrapper"
                                          }, [
                                            tab.value === device.id ? (openBlock(), createBlock("iframe", {
                                              src: displayUrl.value,
                                              class: "overflow-scroll shadow rounded-b-lg",
                                              sandbox: "allow-forms allow-same-origin allow-scripts",
                                              scrolling: "yes",
                                              style: getIframeStyle(device.id),
                                              ref_for: true,
                                              ref: (el) => {
                                                if (el) iframeRefs.value[device.id] = el;
                                              },
                                              key: `${device.id}-${iframeKey.value}`
                                            }, null, 12, ["src"])) : createCommentVNode("", true),
                                            xFrameError.value ? (openBlock(), createBlock("div", {
                                              key: 1,
                                              class: "iframe-error"
                                            }, [
                                              createVNode(VIcon, {
                                                color: "error",
                                                size: "large",
                                                class: "mb-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-alert-circle")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                              createVNode(VBtn, {
                                                color: "primary",
                                                size: "small",
                                                href: displayUrl.value,
                                                target: "_blank",
                                                class: "mt-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Open in a new tab ")
                                                ]),
                                                _: 1
                                              }, 8, ["href"])
                                            ])) : createCommentVNode("", true)
                                          ])) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "iframe-placeholder d-flex flex-column align-center justify-center"
                                          }, [
                                            createVNode(VIcon, {
                                              size: "large",
                                              color: "grey-lighten-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-web-off")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                                          ]))
                                        ], 2)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 64))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VTabs, {
                              modelValue: tab.value,
                              "onUpdate:modelValue": ($event) => tab.value = $event,
                              density: "comfortable",
                              "align-tabs": "center",
                              "bg-color": "primary",
                              "slider-color": "secondary",
                              color: "white"
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                  return createVNode(VTab, {
                                    key: device.id,
                                    value: device.id
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        icon: device.icon,
                                        class: "mr-2"
                                      }, null, 8, ["icon"]),
                                      createTextVNode(" " + toDisplayString(device.name) + " ", 1),
                                      createVNode("span", { class: "text-caption ml-1" }, "(" + toDisplayString(getDeviceDimensions(device.id)) + ")", 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 64))
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(VWindow, {
                              modelValue: tab.value,
                              "onUpdate:modelValue": ($event) => tab.value = $event,
                              class: "pa-4"
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                  return createVNode(VWindowItem, {
                                    key: device.id,
                                    value: device.id,
                                    class: "d-flex justify-center"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", {
                                        class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                                      }, [
                                        createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(device.icon), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(device.id)), 1),
                                          createVNode(VSpacer),
                                          createVNode(VBtn, {
                                            density: "compact",
                                            icon: "mdi-refresh",
                                            size: "small",
                                            variant: "text",
                                            onClick: refreshCurrentIframe
                                          })
                                        ]),
                                        displayUrl.value ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "iframe-wrapper"
                                        }, [
                                          tab.value === device.id ? (openBlock(), createBlock("iframe", {
                                            src: displayUrl.value,
                                            class: "overflow-scroll shadow rounded-b-lg",
                                            sandbox: "allow-forms allow-same-origin allow-scripts",
                                            scrolling: "yes",
                                            style: getIframeStyle(device.id),
                                            ref_for: true,
                                            ref: (el) => {
                                              if (el) iframeRefs.value[device.id] = el;
                                            },
                                            key: `${device.id}-${iframeKey.value}`
                                          }, null, 12, ["src"])) : createCommentVNode("", true),
                                          xFrameError.value ? (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "iframe-error"
                                          }, [
                                            createVNode(VIcon, {
                                              color: "error",
                                              size: "large",
                                              class: "mb-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-alert-circle")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                            createVNode(VBtn, {
                                              color: "primary",
                                              size: "small",
                                              href: displayUrl.value,
                                              target: "_blank",
                                              class: "mt-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Open in a new tab ")
                                              ]),
                                              _: 1
                                            }, 8, ["href"])
                                          ])) : createCommentVNode("", true)
                                        ])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "iframe-placeholder d-flex flex-column align-center justify-center"
                                        }, [
                                          createVNode(VIcon, {
                                            size: "large",
                                            color: "grey-lighten-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-web-off")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                                        ]))
                                      ], 2)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 64))
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    createVNode(VCard, {
                      width: "100%",
                      "max-width": "800px",
                      class: "ma-12 pa-4",
                      elevation: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VTextField, {
                          modelValue: url.value,
                          "onUpdate:modelValue": ($event) => url.value = $event,
                          label: "Enter a URL",
                          density: "comfortable",
                          "prepend-inner-icon": "mdi-web",
                          variant: "outlined",
                          placeholder: "https://example.com",
                          clearable: "",
                          onKeyup: withKeys(loadUrl, ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("div", { class: "d-flex flex-wrap justify-space-between align-center mt-2" }, [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VSwitch, {
                              modelValue: autoRefresh.value,
                              "onUpdate:modelValue": ($event) => autoRefresh.value = $event,
                              color: "primary",
                              "hide-details": "",
                              label: "Auto-refresh",
                              class: "mr-4"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            autoRefresh.value ? (openBlock(), createBlock(VSelect, {
                              key: 0,
                              modelValue: refreshInterval.value,
                              "onUpdate:modelValue": ($event) => refreshInterval.value = $event,
                              items: refreshIntervals,
                              label: "Interval",
                              density: "compact",
                              variant: "outlined",
                              "hide-details": "",
                              style: { "width": "120px" }
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                          ]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: loadUrl,
                            disabled: !isValidUrl.value,
                            "prepend-icon": "mdi-eye"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" View ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(VCard, {
                      width: "100%",
                      class: "mb-4",
                      elevation: "1"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardText, { class: "d-flex flex-wrap justify-space-between align-center py-2" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode(VChipGroup, {
                                modelValue: selectedDevices.value,
                                "onUpdate:modelValue": ($event) => selectedDevices.value = $event,
                                multiple: "",
                                column: "",
                                class: "mr-4",
                                max: 1
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                    return createVNode(VChip, {
                                      key: device.id,
                                      value: device.id,
                                      filter: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(device.icon), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createTextVNode(" " + toDisplayString(device.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 64))
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode(VBtnToggle, {
                                modelValue: orientation.value,
                                "onUpdate:modelValue": ($event) => orientation.value = $event,
                                color: "primary",
                                density: "comfortable"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VBtn, {
                                    value: "portrait",
                                    "prepend-icon": "mdi-phone-portrait"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Portrait")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    value: "landscape",
                                    "prepend-icon": "mdi-phone-landscape"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Landscape")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    sideBySideMode.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "d-flex flex-wrap justify-center gap-4 w-100"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(selectedDevices.value, (deviceId) => {
                        return openBlock(), createBlock("div", {
                          key: deviceId,
                          class: "device-container"
                        }, [
                          createVNode("div", {
                            class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                          }, [
                            createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                              createVNode(VIcon, {
                                size: "small",
                                class: "mr-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(getDeviceById(deviceId).icon), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(deviceId)), 1),
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                density: "compact",
                                icon: "mdi-refresh",
                                size: "small",
                                variant: "text",
                                onClick: ($event) => refreshSpecificIframe()
                              }, null, 8, ["onClick"])
                            ]),
                            displayUrl.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "iframe-wrapper"
                            }, [
                              (openBlock(), createBlock("iframe", {
                                src: displayUrl.value,
                                class: "overflow-scroll shadow rounded-b-lg",
                                sandbox: "allow-forms allow-same-origin allow-scripts",
                                scrolling: "yes",
                                style: getIframeStyle(deviceId),
                                ref_for: true,
                                ref: (el) => {
                                  if (el) iframeRefs.value[deviceId] = el;
                                },
                                key: `${deviceId}-${iframeKey.value}`
                              }, null, 12, ["src"])),
                              xFrameError.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "iframe-error"
                              }, [
                                createVNode(VIcon, {
                                  color: "error",
                                  size: "large",
                                  class: "mb-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-alert-circle")
                                  ]),
                                  _: 1
                                }),
                                createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                createVNode(VBtn, {
                                  color: "primary",
                                  size: "small",
                                  href: displayUrl.value,
                                  target: "_blank",
                                  class: "mt-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Open in a new tab ")
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ])) : createCommentVNode("", true)
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "iframe-placeholder d-flex flex-column align-center justify-center"
                            }, [
                              createVNode(VIcon, {
                                size: "large",
                                color: "grey-lighten-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-web-off")
                                ]),
                                _: 1
                              }),
                              createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                            ]))
                          ], 2)
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock(VCard, {
                      key: 1,
                      width: "100%",
                      class: "overflow-hidden",
                      elevation: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VTabs, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event,
                          density: "comfortable",
                          "align-tabs": "center",
                          "bg-color": "primary",
                          "slider-color": "secondary",
                          color: "white"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                              return createVNode(VTab, {
                                key: device.id,
                                value: device.id
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    icon: device.icon,
                                    class: "mr-2"
                                  }, null, 8, ["icon"]),
                                  createTextVNode(" " + toDisplayString(device.name) + " ", 1),
                                  createVNode("span", { class: "text-caption ml-1" }, "(" + toDisplayString(getDeviceDimensions(device.id)) + ")", 1)
                                ]),
                                _: 2
                              }, 1032, ["value"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(VWindow, {
                          modelValue: tab.value,
                          "onUpdate:modelValue": ($event) => tab.value = $event,
                          class: "pa-4"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                              return createVNode(VWindowItem, {
                                key: device.id,
                                value: device.id,
                                class: "d-flex justify-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                                  }, [
                                    createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(device.icon), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(device.id)), 1),
                                      createVNode(VSpacer),
                                      createVNode(VBtn, {
                                        density: "compact",
                                        icon: "mdi-refresh",
                                        size: "small",
                                        variant: "text",
                                        onClick: refreshCurrentIframe
                                      })
                                    ]),
                                    displayUrl.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "iframe-wrapper"
                                    }, [
                                      tab.value === device.id ? (openBlock(), createBlock("iframe", {
                                        src: displayUrl.value,
                                        class: "overflow-scroll shadow rounded-b-lg",
                                        sandbox: "allow-forms allow-same-origin allow-scripts",
                                        scrolling: "yes",
                                        style: getIframeStyle(device.id),
                                        ref_for: true,
                                        ref: (el) => {
                                          if (el) iframeRefs.value[device.id] = el;
                                        },
                                        key: `${device.id}-${iframeKey.value}`
                                      }, null, 12, ["src"])) : createCommentVNode("", true),
                                      xFrameError.value ? (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "iframe-error"
                                      }, [
                                        createVNode(VIcon, {
                                          color: "error",
                                          size: "large",
                                          class: "mb-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-alert-circle")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          size: "small",
                                          href: displayUrl.value,
                                          target: "_blank",
                                          class: "mt-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Open in a new tab ")
                                          ]),
                                          _: 1
                                        }, 8, ["href"])
                                      ])) : createCommentVNode("", true)
                                    ])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "iframe-placeholder d-flex flex-column align-center justify-center"
                                    }, [
                                      createVNode(VIcon, {
                                        size: "large",
                                        color: "grey-lighten-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-web-off")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                                    ]))
                                  ], 2)
                                ]),
                                _: 2
                              }, 1032, ["value"]);
                            }), 64))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VSnackbar, {
              modelValue: snackbar.value,
              "onUpdate:modelValue": ($event) => snackbar.value = $event,
              color: snackbarColor.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(snackbarText.value)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(snackbarText.value), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, { class: "d-flex flex-column align-center justify-center" }, {
                default: withCtx(() => [
                  createVNode(VCard, {
                    width: "100%",
                    "max-width": "800px",
                    class: "ma-12 pa-4",
                    elevation: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VTextField, {
                        modelValue: url.value,
                        "onUpdate:modelValue": ($event) => url.value = $event,
                        label: "Enter a URL",
                        density: "comfortable",
                        "prepend-inner-icon": "mdi-web",
                        variant: "outlined",
                        placeholder: "https://example.com",
                        clearable: "",
                        onKeyup: withKeys(loadUrl, ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("div", { class: "d-flex flex-wrap justify-space-between align-center mt-2" }, [
                        createVNode("div", { class: "d-flex align-center" }, [
                          createVNode(VSwitch, {
                            modelValue: autoRefresh.value,
                            "onUpdate:modelValue": ($event) => autoRefresh.value = $event,
                            color: "primary",
                            "hide-details": "",
                            label: "Auto-refresh",
                            class: "mr-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          autoRefresh.value ? (openBlock(), createBlock(VSelect, {
                            key: 0,
                            modelValue: refreshInterval.value,
                            "onUpdate:modelValue": ($event) => refreshInterval.value = $event,
                            items: refreshIntervals,
                            label: "Interval",
                            density: "compact",
                            variant: "outlined",
                            "hide-details": "",
                            style: { "width": "120px" }
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                        ]),
                        createVNode(VBtn, {
                          color: "primary",
                          onClick: loadUrl,
                          disabled: !isValidUrl.value,
                          "prepend-icon": "mdi-eye"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" View ")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(VCard, {
                    width: "100%",
                    class: "mb-4",
                    elevation: "1"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardText, { class: "d-flex flex-wrap justify-space-between align-center py-2" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VChipGroup, {
                              modelValue: selectedDevices.value,
                              "onUpdate:modelValue": ($event) => selectedDevices.value = $event,
                              multiple: "",
                              column: "",
                              class: "mr-4",
                              max: 1
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                                  return createVNode(VChip, {
                                    key: device.id,
                                    value: device.id,
                                    filter: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(device.icon), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createTextVNode(" " + toDisplayString(device.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 64))
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VBtnToggle, {
                              modelValue: orientation.value,
                              "onUpdate:modelValue": ($event) => orientation.value = $event,
                              color: "primary",
                              density: "comfortable"
                            }, {
                              default: withCtx(() => [
                                createVNode(VBtn, {
                                  value: "portrait",
                                  "prepend-icon": "mdi-phone-portrait"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Portrait")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VBtn, {
                                  value: "landscape",
                                  "prepend-icon": "mdi-phone-landscape"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Landscape")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  sideBySideMode.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "d-flex flex-wrap justify-center gap-4 w-100"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(selectedDevices.value, (deviceId) => {
                      return openBlock(), createBlock("div", {
                        key: deviceId,
                        class: "device-container"
                      }, [
                        createVNode("div", {
                          class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                        }, [
                          createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                            createVNode(VIcon, {
                              size: "small",
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(getDeviceById(deviceId).icon), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(deviceId)), 1),
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              density: "compact",
                              icon: "mdi-refresh",
                              size: "small",
                              variant: "text",
                              onClick: ($event) => refreshSpecificIframe()
                            }, null, 8, ["onClick"])
                          ]),
                          displayUrl.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "iframe-wrapper"
                          }, [
                            (openBlock(), createBlock("iframe", {
                              src: displayUrl.value,
                              class: "overflow-scroll shadow rounded-b-lg",
                              sandbox: "allow-forms allow-same-origin allow-scripts",
                              scrolling: "yes",
                              style: getIframeStyle(deviceId),
                              ref_for: true,
                              ref: (el) => {
                                if (el) iframeRefs.value[deviceId] = el;
                              },
                              key: `${deviceId}-${iframeKey.value}`
                            }, null, 12, ["src"])),
                            xFrameError.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "iframe-error"
                            }, [
                              createVNode(VIcon, {
                                color: "error",
                                size: "large",
                                class: "mb-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-alert-circle")
                                ]),
                                _: 1
                              }),
                              createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                              createVNode(VBtn, {
                                color: "primary",
                                size: "small",
                                href: displayUrl.value,
                                target: "_blank",
                                class: "mt-2"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Open in a new tab ")
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ])) : createCommentVNode("", true)
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "iframe-placeholder d-flex flex-column align-center justify-center"
                          }, [
                            createVNode(VIcon, {
                              size: "large",
                              color: "grey-lighten-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-web-off")
                              ]),
                              _: 1
                            }),
                            createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                          ]))
                        ], 2)
                      ]);
                    }), 128))
                  ])) : (openBlock(), createBlock(VCard, {
                    key: 1,
                    width: "100%",
                    class: "overflow-hidden",
                    elevation: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VTabs, {
                        modelValue: tab.value,
                        "onUpdate:modelValue": ($event) => tab.value = $event,
                        density: "comfortable",
                        "align-tabs": "center",
                        "bg-color": "primary",
                        "slider-color": "secondary",
                        color: "white"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                            return createVNode(VTab, {
                              key: device.id,
                              value: device.id
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  icon: device.icon,
                                  class: "mr-2"
                                }, null, 8, ["icon"]),
                                createTextVNode(" " + toDisplayString(device.name) + " ", 1),
                                createVNode("span", { class: "text-caption ml-1" }, "(" + toDisplayString(getDeviceDimensions(device.id)) + ")", 1)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 64))
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(VWindow, {
                        modelValue: tab.value,
                        "onUpdate:modelValue": ($event) => tab.value = $event,
                        class: "pa-4"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(Fragment, null, renderList(devices, (device) => {
                            return createVNode(VWindowItem, {
                              key: device.id,
                              value: device.id,
                              class: "d-flex justify-center"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: ["iframe-container", { "landscape": orientation.value === "landscape" }]
                                }, [
                                  createVNode("div", { class: "iframe-header d-flex align-center px-2" }, [
                                    createVNode(VIcon, {
                                      size: "small",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(device.icon), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode("span", { class: "text-caption" }, toDisplayString(getDeviceDimensions(device.id)), 1),
                                    createVNode(VSpacer),
                                    createVNode(VBtn, {
                                      density: "compact",
                                      icon: "mdi-refresh",
                                      size: "small",
                                      variant: "text",
                                      onClick: refreshCurrentIframe
                                    })
                                  ]),
                                  displayUrl.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "iframe-wrapper"
                                  }, [
                                    tab.value === device.id ? (openBlock(), createBlock("iframe", {
                                      src: displayUrl.value,
                                      class: "overflow-scroll shadow rounded-b-lg",
                                      sandbox: "allow-forms allow-same-origin allow-scripts",
                                      scrolling: "yes",
                                      style: getIframeStyle(device.id),
                                      ref_for: true,
                                      ref: (el) => {
                                        if (el) iframeRefs.value[device.id] = el;
                                      },
                                      key: `${device.id}-${iframeKey.value}`
                                    }, null, 12, ["src"])) : createCommentVNode("", true),
                                    xFrameError.value ? (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "iframe-error"
                                    }, [
                                      createVNode(VIcon, {
                                        color: "error",
                                        size: "large",
                                        class: "mb-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-alert-circle")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", null, "This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'. "),
                                      createVNode(VBtn, {
                                        color: "primary",
                                        size: "small",
                                        href: displayUrl.value,
                                        target: "_blank",
                                        class: "mt-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Open in a new tab ")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ])) : createCommentVNode("", true)
                                  ])) : (openBlock(), createBlock("div", {
                                    key: 1,
                                    class: "iframe-placeholder d-flex flex-column align-center justify-center"
                                  }, [
                                    createVNode(VIcon, {
                                      size: "large",
                                      color: "grey-lighten-1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-web-off")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "text-grey-darken-1 mt-2" }, "Enter a URL to preview the site")
                                  ]))
                                ], 2)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 64))
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }))
                ]),
                _: 1
              }),
              createVNode(VSnackbar, {
                modelValue: snackbar.value,
                "onUpdate:modelValue": ($event) => snackbar.value = $event,
                color: snackbarColor.value
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(snackbarText.value), 1)
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue", "color"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/responsive.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const responsive = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9252cc7a"]]);

export { responsive as default };
//# sourceMappingURL=responsive.vue.mjs.map
