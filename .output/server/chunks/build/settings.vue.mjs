import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, unref, createBlock, openBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { S as Snackbar } from './snackbar.vue.mjs';
import { bx as useTheme, S as useUserStore, f as VCard, T as VList, U as VListItem, h as VDivider, $ as VCardTitle, g as VIcon, Y as VCardText, e as VBtn, W as VListItemTitle, aC as VListItemSubtitle, bp as VSwitch, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VAlert } from './VAlert.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VChip } from './VChip.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Settings - DevUnity",
      meta: [
        { name: "description", content: "Manage your account settings and preferences" },
        { name: "keywords", content: "DevUnity, settings, preferences, account, user settings" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Settings - DevUnity" },
        { name: "og:description", content: "Manage your account settings and preferences" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    useTheme();
    const userStore = useUserStore();
    const activeTab = ref("security");
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const showDeleteAccount = ref(false);
    const deleteAccountConfirmation = ref("");
    const theme = ref("dark");
    const changeTheme = (newTheme) => {
      if (["light", "dark", "system"].includes(newTheme)) {
        theme.value = newTheme;
      }
    };
    const security = ref({
      newPassword: "",
      confirmPassword: ""
    });
    const cookies = ref({
      essential: true,
      functional: true,
      analytics: false,
      marketing: false
    });
    const saveAppearance = () => {
      setTimeout(() => {
        showSnackbar("Appearance settings updated", "success");
      }, 500);
    };
    const saveSecurity = async () => {
      try {
        if (!security.value.newPassword || !security.value.confirmPassword) {
          snackbarText.value = "New password and confirm password are required";
          snackbarColor.value = "error";
          snackbar.value = true;
          return;
        }
        if (security.value.newPassword !== security.value.confirmPassword) {
          snackbarText.value = "Passwords do not match";
          snackbarColor.value = "error";
          snackbar.value = true;
          return;
        }
        await userStore.resetPassword(security.value.newPassword);
        snackbarText.value = "Password updated successfully";
        snackbarColor.value = "success";
        snackbar.value = true;
      } catch (error) {
        snackbarText.value = "An error occurred while updating the password";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    const saveCookies = () => {
      showSnackbar("Cookie preferences updated", "success");
    };
    const resetCookies = () => {
      cookies.value.functional = false;
      cookies.value.analytics = false;
      cookies.value.marketing = false;
      showSnackbar("Cookies deleted successfully", "success");
    };
    const exportUserData = () => {
      setTimeout(() => {
        snackbarText.value = "Your data has been prepared for download";
        snackbarColor.value = "success";
        snackbar.value = true;
      }, 1e3);
    };
    const confirmDeleteAccount = async () => {
      try {
        await userStore.deleteAccount();
        snackbarText.value = "Your account has been deleted successfully";
        snackbarColor.value = "success";
        snackbar.value = true;
        setTimeout(() => {
          (void 0).location.href = "/login";
        }, 2e3);
      } catch (error) {
        snackbarText.value = "An error occurred while deleting your account";
        snackbarColor.value = "error";
        snackbar.value = true;
      }
    };
    const showSnackbar = (text, color) => {
      snackbarText.value = text;
      snackbarColor.value = color;
      snackbar.value = true;
    };
    const isActiveTheme = (themeName) => {
      return theme.value === themeName;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, mergeProps({
        fluid: "",
        class: "pa-6"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    lg: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "rounded-lg mb-4",
                          elevation: "2"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VList, { nav: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VListItem, {
                                      "prepend-icon": "mdi-palette-outline",
                                      title: "Appearance",
                                      value: "appearance",
                                      onClick: ($event) => activeTab.value = "appearance",
                                      rounded: "lg",
                                      active: activeTab.value === "appearance",
                                      color: "primary"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, {
                                      "prepend-icon": "mdi-shield-outline",
                                      title: "Security",
                                      value: "security",
                                      onClick: ($event) => activeTab.value = "security",
                                      rounded: "lg",
                                      active: activeTab.value === "security",
                                      color: "primary"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, {
                                      "prepend-icon": "mdi-cookie-settings-outline",
                                      title: "Cookies",
                                      value: "cookies",
                                      onClick: ($event) => activeTab.value = "cookies",
                                      rounded: "lg",
                                      active: activeTab.value === "cookies",
                                      color: "primary"
                                    }, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItem, {
                                      "prepend-icon": "mdi-delete-outline",
                                      title: "Data & Privacy",
                                      value: "privacy",
                                      onClick: ($event) => activeTab.value = "privacy",
                                      rounded: "lg",
                                      active: activeTab.value === "privacy",
                                      color: "primary"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VListItem, {
                                        "prepend-icon": "mdi-palette-outline",
                                        title: "Appearance",
                                        value: "appearance",
                                        onClick: ($event) => activeTab.value = "appearance",
                                        rounded: "lg",
                                        active: activeTab.value === "appearance",
                                        color: "primary"
                                      }, null, 8, ["onClick", "active"]),
                                      createVNode(VListItem, {
                                        "prepend-icon": "mdi-shield-outline",
                                        title: "Security",
                                        value: "security",
                                        onClick: ($event) => activeTab.value = "security",
                                        rounded: "lg",
                                        active: activeTab.value === "security",
                                        color: "primary"
                                      }, null, 8, ["onClick", "active"]),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, {
                                        "prepend-icon": "mdi-cookie-settings-outline",
                                        title: "Cookies",
                                        value: "cookies",
                                        onClick: ($event) => activeTab.value = "cookies",
                                        rounded: "lg",
                                        active: activeTab.value === "cookies",
                                        color: "primary"
                                      }, null, 8, ["onClick", "active"]),
                                      createVNode(VListItem, {
                                        "prepend-icon": "mdi-delete-outline",
                                        title: "Data & Privacy",
                                        value: "privacy",
                                        onClick: ($event) => activeTab.value = "privacy",
                                        rounded: "lg",
                                        active: activeTab.value === "privacy",
                                        color: "primary"
                                      }, null, 8, ["onClick", "active"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VList, { nav: "" }, {
                                  default: withCtx(() => [
                                    createVNode(VListItem, {
                                      "prepend-icon": "mdi-palette-outline",
                                      title: "Appearance",
                                      value: "appearance",
                                      onClick: ($event) => activeTab.value = "appearance",
                                      rounded: "lg",
                                      active: activeTab.value === "appearance",
                                      color: "primary"
                                    }, null, 8, ["onClick", "active"]),
                                    createVNode(VListItem, {
                                      "prepend-icon": "mdi-shield-outline",
                                      title: "Security",
                                      value: "security",
                                      onClick: ($event) => activeTab.value = "security",
                                      rounded: "lg",
                                      active: activeTab.value === "security",
                                      color: "primary"
                                    }, null, 8, ["onClick", "active"]),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, {
                                      "prepend-icon": "mdi-cookie-settings-outline",
                                      title: "Cookies",
                                      value: "cookies",
                                      onClick: ($event) => activeTab.value = "cookies",
                                      rounded: "lg",
                                      active: activeTab.value === "cookies",
                                      color: "primary"
                                    }, null, 8, ["onClick", "active"]),
                                    createVNode(VListItem, {
                                      "prepend-icon": "mdi-delete-outline",
                                      title: "Data & Privacy",
                                      value: "privacy",
                                      onClick: ($event) => activeTab.value = "privacy",
                                      rounded: "lg",
                                      active: activeTab.value === "privacy",
                                      color: "primary"
                                    }, null, 8, ["onClick", "active"])
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
                            class: "rounded-lg mb-4",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VList, { nav: "" }, {
                                default: withCtx(() => [
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-palette-outline",
                                    title: "Appearance",
                                    value: "appearance",
                                    onClick: ($event) => activeTab.value = "appearance",
                                    rounded: "lg",
                                    active: activeTab.value === "appearance",
                                    color: "primary"
                                  }, null, 8, ["onClick", "active"]),
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-shield-outline",
                                    title: "Security",
                                    value: "security",
                                    onClick: ($event) => activeTab.value = "security",
                                    rounded: "lg",
                                    active: activeTab.value === "security",
                                    color: "primary"
                                  }, null, 8, ["onClick", "active"]),
                                  createVNode(VDivider, { class: "my-2" }),
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-cookie-settings-outline",
                                    title: "Cookies",
                                    value: "cookies",
                                    onClick: ($event) => activeTab.value = "cookies",
                                    rounded: "lg",
                                    active: activeTab.value === "cookies",
                                    color: "primary"
                                  }, null, 8, ["onClick", "active"]),
                                  createVNode(VListItem, {
                                    "prepend-icon": "mdi-delete-outline",
                                    title: "Data & Privacy",
                                    value: "privacy",
                                    onClick: ($event) => activeTab.value = "privacy",
                                    rounded: "lg",
                                    active: activeTab.value === "privacy",
                                    color: "primary"
                                  }, null, 8, ["onClick", "active"])
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
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    lg: "9"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "rounded-lg",
                          elevation: "2"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (activeTab.value === "appearance") {
                                _push5(`<div data-v-be6d8b82${_scopeId4}>`);
                                _push5(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-palette-outline`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-palette-outline")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` Appearance `);
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-palette-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Appearance ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VRow, { class: "mb-4" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`<div class="text-subtitle-1 font-weight-bold mb-3" data-v-be6d8b82${_scopeId7}>Theme</div>`);
                                                  _push8(ssrRenderComponent(VRow, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VCard, {
                                                                color: isActiveTheme("light") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("light")
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("light") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-weather-sunny`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-weather-sunny")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(`<span class="${ssrRenderClass([{ "text-white": isActiveTheme("light") }, "mt-2"])}" data-v-be6d8b82${_scopeId10}>Light</span>`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        size: "large",
                                                                        color: isActiveTheme("light") ? "white" : "primary"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-weather-sunny")
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["color"]),
                                                                      createVNode("span", {
                                                                        class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                                      }, "Light", 2)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VCard, {
                                                                  color: isActiveTheme("light") ? "primary" : "surface",
                                                                  variant: "outlined",
                                                                  class: "d-flex flex-column align-center pa-4",
                                                                  hover: "",
                                                                  onClick: ($event) => changeTheme("light")
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("light") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-weather-sunny")
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"]),
                                                                    createVNode("span", {
                                                                      class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                                    }, "Light", 2)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color", "onClick"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VCard, {
                                                                color: isActiveTheme("dark") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("dark")
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("dark") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-weather-night`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-weather-night")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(`<span class="${ssrRenderClass([{ "text-white": isActiveTheme("dark") }, "mt-2"])}" data-v-be6d8b82${_scopeId10}>Dark</span>`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        size: "large",
                                                                        color: isActiveTheme("dark") ? "white" : "primary"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-weather-night")
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["color"]),
                                                                      createVNode("span", {
                                                                        class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                                      }, "Dark", 2)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VCard, {
                                                                  color: isActiveTheme("dark") ? "primary" : "surface",
                                                                  variant: "outlined",
                                                                  class: "d-flex flex-column align-center pa-4",
                                                                  hover: "",
                                                                  onClick: ($event) => changeTheme("dark")
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("dark") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-weather-night")
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"]),
                                                                    createVNode("span", {
                                                                      class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                                    }, "Dark", 2)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color", "onClick"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(ssrRenderComponent(VCard, {
                                                                color: isActiveTheme("system") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("system")
                                                              }, {
                                                                default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                  if (_push11) {
                                                                    _push11(ssrRenderComponent(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("system") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                        if (_push12) {
                                                                          _push12(`mdi-theme-light-dark`);
                                                                        } else {
                                                                          return [
                                                                            createTextVNode("mdi-theme-light-dark")
                                                                          ];
                                                                        }
                                                                      }),
                                                                      _: 1
                                                                    }, _parent11, _scopeId10));
                                                                    _push11(`<span class="${ssrRenderClass([{ "text-white": isActiveTheme("system") }, "mt-2"])}" data-v-be6d8b82${_scopeId10}>System</span>`);
                                                                  } else {
                                                                    return [
                                                                      createVNode(VIcon, {
                                                                        size: "large",
                                                                        color: isActiveTheme("system") ? "white" : "primary"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-theme-light-dark")
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["color"]),
                                                                      createVNode("span", {
                                                                        class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                                      }, "System", 2)
                                                                    ];
                                                                  }
                                                                }),
                                                                _: 1
                                                              }, _parent10, _scopeId9));
                                                            } else {
                                                              return [
                                                                createVNode(VCard, {
                                                                  color: isActiveTheme("system") ? "primary" : "surface",
                                                                  variant: "outlined",
                                                                  class: "d-flex flex-column align-center pa-4",
                                                                  hover: "",
                                                                  onClick: ($event) => changeTheme("system")
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, {
                                                                      size: "large",
                                                                      color: isActiveTheme("system") ? "white" : "primary"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-theme-light-dark")
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["color"]),
                                                                    createVNode("span", {
                                                                      class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                                    }, "System", 2)
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color", "onClick"])
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VCol, {
                                                            cols: "12",
                                                            sm: "4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCard, {
                                                                color: isActiveTheme("light") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("light")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    size: "large",
                                                                    color: isActiveTheme("light") ? "white" : "primary"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-weather-sunny")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"]),
                                                                  createVNode("span", {
                                                                    class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                                  }, "Light", 2)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color", "onClick"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCol, {
                                                            cols: "12",
                                                            sm: "4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCard, {
                                                                color: isActiveTheme("dark") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("dark")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    size: "large",
                                                                    color: isActiveTheme("dark") ? "white" : "primary"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-weather-night")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"]),
                                                                  createVNode("span", {
                                                                    class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                                  }, "Dark", 2)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color", "onClick"])
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCol, {
                                                            cols: "12",
                                                            sm: "4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCard, {
                                                                color: isActiveTheme("system") ? "primary" : "surface",
                                                                variant: "outlined",
                                                                class: "d-flex flex-column align-center pa-4",
                                                                hover: "",
                                                                onClick: ($event) => changeTheme("system")
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, {
                                                                    size: "large",
                                                                    color: isActiveTheme("system") ? "white" : "primary"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-theme-light-dark")
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["color"]),
                                                                  createVNode("span", {
                                                                    class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                                  }, "System", 2)
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color", "onClick"])
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
                                                    createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                                    createVNode(VRow, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              color: isActiveTheme("light") ? "primary" : "surface",
                                                              variant: "outlined",
                                                              class: "d-flex flex-column align-center pa-4",
                                                              hover: "",
                                                              onClick: ($event) => changeTheme("light")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  size: "large",
                                                                  color: isActiveTheme("light") ? "white" : "primary"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-weather-sunny")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"]),
                                                                createVNode("span", {
                                                                  class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                                }, "Light", 2)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color", "onClick"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              color: isActiveTheme("dark") ? "primary" : "surface",
                                                              variant: "outlined",
                                                              class: "d-flex flex-column align-center pa-4",
                                                              hover: "",
                                                              onClick: ($event) => changeTheme("dark")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  size: "large",
                                                                  color: isActiveTheme("dark") ? "white" : "primary"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-weather-night")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"]),
                                                                createVNode("span", {
                                                                  class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                                }, "Dark", 2)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color", "onClick"])
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          sm: "4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              color: isActiveTheme("system") ? "primary" : "surface",
                                                              variant: "outlined",
                                                              class: "d-flex flex-column align-center pa-4",
                                                              hover: "",
                                                              onClick: ($event) => changeTheme("system")
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, {
                                                                  size: "large",
                                                                  color: isActiveTheme("system") ? "white" : "primary"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-theme-light-dark")
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["color"]),
                                                                createVNode("span", {
                                                                  class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                                }, "System", 2)
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color", "onClick"])
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
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        sm: "4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            color: isActiveTheme("light") ? "primary" : "surface",
                                                            variant: "outlined",
                                                            class: "d-flex flex-column align-center pa-4",
                                                            hover: "",
                                                            onClick: ($event) => changeTheme("light")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                size: "large",
                                                                color: isActiveTheme("light") ? "white" : "primary"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-weather-sunny")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"]),
                                                              createVNode("span", {
                                                                class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                              }, "Light", 2)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color", "onClick"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        sm: "4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            color: isActiveTheme("dark") ? "primary" : "surface",
                                                            variant: "outlined",
                                                            class: "d-flex flex-column align-center pa-4",
                                                            hover: "",
                                                            onClick: ($event) => changeTheme("dark")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                size: "large",
                                                                color: isActiveTheme("dark") ? "white" : "primary"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-weather-night")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"]),
                                                              createVNode("span", {
                                                                class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                              }, "Dark", 2)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color", "onClick"])
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        sm: "4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            color: isActiveTheme("system") ? "primary" : "surface",
                                                            variant: "outlined",
                                                            class: "d-flex flex-column align-center pa-4",
                                                            hover: "",
                                                            onClick: ($event) => changeTheme("system")
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, {
                                                                size: "large",
                                                                color: isActiveTheme("system") ? "white" : "primary"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-theme-light-dark")
                                                                ]),
                                                                _: 1
                                                              }, 8, ["color"]),
                                                              createVNode("span", {
                                                                class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                              }, "System", 2)
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color", "onClick"])
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
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                      _push6(`<div class="d-flex justify-end" data-v-be6d8b82${_scopeId5}>`);
                                      _push6(ssrRenderComponent(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveAppearance
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { start: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-content-save`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-content-save")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(` Save `);
                                          } else {
                                            return [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Save ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode(VRow, { class: "mb-4" }, {
                                          default: withCtx(() => [
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      sm: "4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          color: isActiveTheme("light") ? "primary" : "surface",
                                                          variant: "outlined",
                                                          class: "d-flex flex-column align-center pa-4",
                                                          hover: "",
                                                          onClick: ($event) => changeTheme("light")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              size: "large",
                                                              color: isActiveTheme("light") ? "white" : "primary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-weather-sunny")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"]),
                                                            createVNode("span", {
                                                              class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                            }, "Light", 2)
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color", "onClick"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      sm: "4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          color: isActiveTheme("dark") ? "primary" : "surface",
                                                          variant: "outlined",
                                                          class: "d-flex flex-column align-center pa-4",
                                                          hover: "",
                                                          onClick: ($event) => changeTheme("dark")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              size: "large",
                                                              color: isActiveTheme("dark") ? "white" : "primary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-weather-night")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"]),
                                                            createVNode("span", {
                                                              class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                            }, "Dark", 2)
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color", "onClick"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      sm: "4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          color: isActiveTheme("system") ? "primary" : "surface",
                                                          variant: "outlined",
                                                          class: "d-flex flex-column align-center pa-4",
                                                          hover: "",
                                                          onClick: ($event) => changeTheme("system")
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, {
                                                              size: "large",
                                                              color: isActiveTheme("system") ? "white" : "primary"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-theme-light-dark")
                                                              ]),
                                                              _: 1
                                                            }, 8, ["color"]),
                                                            createVNode("span", {
                                                              class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                            }, "System", 2)
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color", "onClick"])
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
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "d-flex justify-end" }, [
                                          createVNode(VBtn, {
                                            color: "primary",
                                            variant: "elevated",
                                            onClick: saveAppearance
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Save ")
                                            ]),
                                            _: 1
                                          })
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (activeTab.value === "security") {
                                _push5(`<div data-v-be6d8b82${_scopeId4}>`);
                                _push5(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-shield-outline`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-shield-outline")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` Security `);
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-shield-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Security ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VAlert, {
                                        type: "info",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Manage your account security settings. We recommend using a strong password and changing it regularly. `);
                                          } else {
                                            return [
                                              createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(`<div class="text-subtitle-1 font-weight-bold mb-3" data-v-be6d8b82${_scopeId5}>Change Password</div>`);
                                      _push6(ssrRenderComponent(VForm, { class: "mb-6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VTextField, {
                                              modelValue: security.value.newPassword,
                                              "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                              label: "New Password",
                                              variant: "outlined",
                                              type: "password",
                                              class: "mb-3"
                                            }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VTextField, {
                                              modelValue: security.value.confirmPassword,
                                              "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                              label: "Confirm New Password",
                                              variant: "outlined",
                                              type: "password",
                                              class: "mb-3"
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VTextField, {
                                                modelValue: security.value.newPassword,
                                                "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                                label: "New Password",
                                                variant: "outlined",
                                                type: "password",
                                                class: "mb-3"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: security.value.confirmPassword,
                                                "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                                label: "Confirm New Password",
                                                variant: "outlined",
                                                type: "password",
                                                class: "mb-3"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                      _push6(`<div class="d-flex justify-end" data-v-be6d8b82${_scopeId5}>`);
                                      _push6(ssrRenderComponent(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveSecurity
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { start: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-content-save`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-content-save")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(` Update Password `);
                                          } else {
                                            return [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Update Password ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode(VAlert, {
                                          type: "info",
                                          variant: "tonal",
                                          class: "mb-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Change Password"),
                                        createVNode(VForm, { class: "mb-6" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: security.value.newPassword,
                                              "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                              label: "New Password",
                                              variant: "outlined",
                                              type: "password",
                                              class: "mb-3"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: security.value.confirmPassword,
                                              "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                              label: "Confirm New Password",
                                              variant: "outlined",
                                              type: "password",
                                              class: "mb-3"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "d-flex justify-end" }, [
                                          createVNode(VBtn, {
                                            color: "primary",
                                            variant: "elevated",
                                            onClick: saveSecurity
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Update Password ")
                                            ]),
                                            _: 1
                                          })
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (activeTab.value === "cookies") {
                                _push5(`<div data-v-be6d8b82${_scopeId4}>`);
                                _push5(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-cookie-settings-outline`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-cookie-settings-outline")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` Cookie Preferences `);
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cookie-settings-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Cookie Preferences ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VAlert, {
                                        type: "info",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. `);
                                          } else {
                                            return [
                                              createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCard, {
                                        color: "surface",
                                        variant: "outlined",
                                        class: "mb-6 pa-4"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<h3 class="text-h6 font-weight-bold mb-3" data-v-be6d8b82${_scopeId6}>Current Preferences Status</h3>`);
                                            _push7(ssrRenderComponent(VList, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VListItem, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Essential cookies:`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Essential cookies:")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VListItemSubtitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Enabled`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Enabled")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Essential cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Enabled")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItem, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Functional cookies:`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Functional cookies:")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VListItemSubtitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(cookies.value.functional ? "Enabled" : "Disabled")}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Functional cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItem, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Analytics cookies:`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Analytics cookies:")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VListItemSubtitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(cookies.value.analytics ? "Enabled" : "Disabled")}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Analytics cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItem, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`Marketing cookies:`);
                                                            } else {
                                                              return [
                                                                createTextVNode("Marketing cookies:")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                        _push9(ssrRenderComponent(VListItemSubtitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(cookies.value.marketing ? "Enabled" : "Disabled")}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Marketing cookies:")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItemSubtitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Essential cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Enabled")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Functional cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Analytics cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Marketing cookies:")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItemSubtitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                              createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                              createVNode(VList, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Essential cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Enabled")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Functional cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Analytics cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Marketing cookies:")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItemSubtitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                      _push6(ssrRenderComponent(VList, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VListItem, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VListItemTitle, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VSwitch, {
                                                          modelValue: cookies.value.essential,
                                                          "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                          label: "Essential cookies",
                                                          color: "primary",
                                                          disabled: "",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VSwitch, {
                                                            modelValue: cookies.value.essential,
                                                            "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                            label: "Essential cookies",
                                                            color: "primary",
                                                            disabled: "",
                                                            "hide-details": "",
                                                            inset: ""
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` Required for the site to function, they cannot be disabled. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VSwitch, {
                                                          modelValue: cookies.value.essential,
                                                          "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                          label: "Essential cookies",
                                                          color: "primary",
                                                          disabled: "",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VListItem, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VListItemTitle, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VSwitch, {
                                                          modelValue: cookies.value.functional,
                                                          "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                          label: "Functional cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VSwitch, {
                                                            modelValue: cookies.value.functional,
                                                            "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                            label: "Functional cookies",
                                                            color: "primary",
                                                            "hide-details": "",
                                                            inset: ""
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` Allow us to remember your preferences and personalize your experience. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VSwitch, {
                                                          modelValue: cookies.value.functional,
                                                          "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                          label: "Functional cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VListItem, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VListItemTitle, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VSwitch, {
                                                          modelValue: cookies.value.analytics,
                                                          "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                          label: "Analytics cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VSwitch, {
                                                            modelValue: cookies.value.analytics,
                                                            "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                            label: "Analytics cookies",
                                                            color: "primary",
                                                            "hide-details": "",
                                                            inset: ""
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` Help us understand how you use our site to improve it. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" Help us understand how you use our site to improve it. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VSwitch, {
                                                          modelValue: cookies.value.analytics,
                                                          "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                          label: "Analytics cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Help us understand how you use our site to improve it. ")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VDivider, { class: "my-2" }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(VListItem, null, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(VListItemTitle, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VSwitch, {
                                                          modelValue: cookies.value.marketing,
                                                          "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                          label: "Marketing cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VSwitch, {
                                                            modelValue: cookies.value.marketing,
                                                            "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                            label: "Marketing cookies",
                                                            color: "primary",
                                                            "hide-details": "",
                                                            inset: ""
                                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                  _push8(ssrRenderComponent(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(` Used to provide you with personalized advertisements. `);
                                                      } else {
                                                        return [
                                                          createTextVNode(" Used to provide you with personalized advertisements. ")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VSwitch, {
                                                          modelValue: cookies.value.marketing,
                                                          "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                          label: "Marketing cookies",
                                                          color: "primary",
                                                          "hide-details": "",
                                                          inset: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(" Used to provide you with personalized advertisements. ")
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
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VSwitch, {
                                                        modelValue: cookies.value.essential,
                                                        "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                        label: "Essential cookies",
                                                        color: "primary",
                                                        disabled: "",
                                                        "hide-details": "",
                                                        inset: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VDivider, { class: "my-2" }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VSwitch, {
                                                        modelValue: cookies.value.functional,
                                                        "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                        label: "Functional cookies",
                                                        color: "primary",
                                                        "hide-details": "",
                                                        inset: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VDivider, { class: "my-2" }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VSwitch, {
                                                        modelValue: cookies.value.analytics,
                                                        "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                        label: "Analytics cookies",
                                                        color: "primary",
                                                        "hide-details": "",
                                                        inset: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Help us understand how you use our site to improve it. ")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VDivider, { class: "my-2" }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VSwitch, {
                                                        modelValue: cookies.value.marketing,
                                                        "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                        label: "Marketing cookies",
                                                        color: "primary",
                                                        "hide-details": "",
                                                        inset: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(" Used to provide you with personalized advertisements. ")
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
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                      _push6(`<div class="d-flex justify-space-between" data-v-be6d8b82${_scopeId5}>`);
                                      _push6(ssrRenderComponent(VBtn, {
                                        color: "error",
                                        variant: "outlined",
                                        onClick: resetCookies
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { start: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-cookie-remove`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-cookie-remove")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(` Delete all cookies `);
                                          } else {
                                            return [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-remove")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Delete all cookies ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveCookies
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { start: "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-content-save`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-content-save")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(` Save `);
                                          } else {
                                            return [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Save ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode(VAlert, {
                                          type: "info",
                                          variant: "tonal",
                                          class: "mb-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCard, {
                                          color: "surface",
                                          variant: "outlined",
                                          class: "mb-6 pa-4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                            createVNode(VList, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Essential cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Enabled")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Functional cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Analytics cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Marketing cookies:")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItemSubtitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                        createVNode(VList, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VSwitch, {
                                                      modelValue: cookies.value.essential,
                                                      "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                      label: "Essential cookies",
                                                      color: "primary",
                                                      disabled: "",
                                                      "hide-details": "",
                                                      inset: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VDivider, { class: "my-2" }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VSwitch, {
                                                      modelValue: cookies.value.functional,
                                                      "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                      label: "Functional cookies",
                                                      color: "primary",
                                                      "hide-details": "",
                                                      inset: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VDivider, { class: "my-2" }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VSwitch, {
                                                      modelValue: cookies.value.analytics,
                                                      "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                      label: "Analytics cookies",
                                                      color: "primary",
                                                      "hide-details": "",
                                                      inset: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Help us understand how you use our site to improve it. ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VDivider, { class: "my-2" }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VSwitch, {
                                                      modelValue: cookies.value.marketing,
                                                      "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                      label: "Marketing cookies",
                                                      color: "primary",
                                                      "hide-details": "",
                                                      inset: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Used to provide you with personalized advertisements. ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "d-flex justify-space-between" }, [
                                          createVNode(VBtn, {
                                            color: "error",
                                            variant: "outlined",
                                            onClick: resetCookies
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cookie-remove")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Delete all cookies ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VBtn, {
                                            color: "primary",
                                            variant: "elevated",
                                            onClick: saveCookies
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, { start: "" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-content-save")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Save ")
                                            ]),
                                            _: 1
                                          })
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (activeTab.value === "privacy") {
                                _push5(`<div data-v-be6d8b82${_scopeId4}>`);
                                _push5(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-delete-outline`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-delete-outline")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` Data &amp; Privacy `);
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-delete-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Data & Privacy ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    var _a, _b;
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VAlert, {
                                        type: "warning",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(` Warning: Actions on this page regarding your data are irreversible. `);
                                          } else {
                                            return [
                                              createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(`<div class="text-subtitle-1 font-weight-bold mb-3" data-v-be6d8b82${_scopeId5}>Data Export</div><p class="mb-4" data-v-be6d8b82${_scopeId5}>You can download all your personal data stored on our platform.</p>`);
                                      _push6(ssrRenderComponent(VBtn, {
                                        color: "primary",
                                        variant: "outlined",
                                        "prepend-icon": "mdi-download",
                                        onClick: exportUserData,
                                        class: "mb-6",
                                        disabled: ""
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Export my data`);
                                          } else {
                                            return [
                                              createTextVNode("Export my data")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                      _push6(`<div class="text-subtitle-1 font-weight-bold mb-3 text-success" data-v-be6d8b82${_scopeId5}>Premium Status</div><p class="mb-4" data-v-be6d8b82${_scopeId5}> Current status: `);
                                      if ((_a = unref(userStore).user) == null ? void 0 : _a.isPremium) {
                                        _push6(ssrRenderComponent(VChip, { color: "success" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Premium `);
                                            } else {
                                              return [
                                                createTextVNode(" Premium ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(ssrRenderComponent(VChip, { color: "error" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Free `);
                                            } else {
                                              return [
                                                createTextVNode(" Free ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      }
                                      _push6(`</p>`);
                                      _push6(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent6, _scopeId5));
                                      _push6(`<div class="text-subtitle-1 font-weight-bold mb-3 text-error" data-v-be6d8b82${_scopeId5}>Account Deletion</div><p class="mb-4" data-v-be6d8b82${_scopeId5}>Deleting your account will permanently erase all your personal data, including your projects, settings, and history.</p>`);
                                      if (showDeleteAccount.value) {
                                        _push6(`<div data-v-be6d8b82${_scopeId5}>`);
                                        _push6(ssrRenderComponent(VTextField, {
                                          modelValue: deleteAccountConfirmation.value,
                                          "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                          label: "Type 'DELETE' to confirm",
                                          variant: "outlined",
                                          hint: "This action is irreversible",
                                          "persistent-hint": "",
                                          class: "mb-4"
                                        }, null, _parent6, _scopeId5));
                                        _push6(`<div class="d-flex" data-v-be6d8b82${_scopeId5}>`);
                                        _push6(ssrRenderComponent(VBtn, {
                                          color: "error",
                                          variant: "tonal",
                                          disabled: deleteAccountConfirmation.value !== "DELETE",
                                          onClick: confirmDeleteAccount,
                                          class: "mr-2"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Confirm deletion `);
                                            } else {
                                              return [
                                                createTextVNode(" Confirm deletion ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(VBtn, {
                                          color: "grey",
                                          variant: "text",
                                          onClick: ($event) => showDeleteAccount.value = false
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Cancel `);
                                            } else {
                                              return [
                                                createTextVNode(" Cancel ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                        _push6(`</div></div>`);
                                      } else {
                                        _push6(ssrRenderComponent(VBtn, {
                                          color: "error",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-account-remove",
                                          onClick: ($event) => showDeleteAccount.value = true
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(` Delete my account `);
                                            } else {
                                              return [
                                                createTextVNode(" Delete my account ")
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      }
                                    } else {
                                      return [
                                        createVNode(VAlert, {
                                          type: "warning",
                                          variant: "tonal",
                                          class: "mb-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Data Export"),
                                        createVNode("p", { class: "mb-4" }, "You can download all your personal data stored on our platform."),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-download",
                                          onClick: exportUserData,
                                          class: "mb-6",
                                          disabled: ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Export my data")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-success" }, "Premium Status"),
                                        createVNode("p", { class: "mb-4" }, [
                                          createTextVNode(" Current status: "),
                                          ((_b = unref(userStore).user) == null ? void 0 : _b.isPremium) ? (openBlock(), createBlock(VChip, {
                                            key: 0,
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Premium ")
                                            ]),
                                            _: 1
                                          })) : (openBlock(), createBlock(VChip, {
                                            key: 1,
                                            color: "error"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Free ")
                                            ]),
                                            _: 1
                                          }))
                                        ]),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-error" }, "Account Deletion"),
                                        createVNode("p", { class: "mb-4" }, "Deleting your account will permanently erase all your personal data, including your projects, settings, and history."),
                                        showDeleteAccount.value ? (openBlock(), createBlock("div", { key: 0 }, [
                                          createVNode(VTextField, {
                                            modelValue: deleteAccountConfirmation.value,
                                            "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                            label: "Type 'DELETE' to confirm",
                                            variant: "outlined",
                                            hint: "This action is irreversible",
                                            "persistent-hint": "",
                                            class: "mb-4"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode("div", { class: "d-flex" }, [
                                            createVNode(VBtn, {
                                              color: "error",
                                              variant: "tonal",
                                              disabled: deleteAccountConfirmation.value !== "DELETE",
                                              onClick: confirmDeleteAccount,
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Confirm deletion ")
                                              ]),
                                              _: 1
                                            }, 8, ["disabled"]),
                                            createVNode(VBtn, {
                                              color: "grey",
                                              variant: "text",
                                              onClick: ($event) => showDeleteAccount.value = false
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Cancel ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ])
                                        ])) : (openBlock(), createBlock(VBtn, {
                                          key: 1,
                                          color: "error",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-account-remove",
                                          onClick: ($event) => showDeleteAccount.value = true
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Delete my account ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]))
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(`</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                activeTab.value === "appearance" ? (openBlock(), createBlock("div", { key: 0 }, [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-palette-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Appearance ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VRow, { class: "mb-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    sm: "4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        color: isActiveTheme("light") ? "primary" : "surface",
                                                        variant: "outlined",
                                                        class: "d-flex flex-column align-center pa-4",
                                                        hover: "",
                                                        onClick: ($event) => changeTheme("light")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            size: "large",
                                                            color: isActiveTheme("light") ? "white" : "primary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-weather-sunny")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"]),
                                                          createVNode("span", {
                                                            class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                          }, "Light", 2)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color", "onClick"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    sm: "4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        color: isActiveTheme("dark") ? "primary" : "surface",
                                                        variant: "outlined",
                                                        class: "d-flex flex-column align-center pa-4",
                                                        hover: "",
                                                        onClick: ($event) => changeTheme("dark")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            size: "large",
                                                            color: isActiveTheme("dark") ? "white" : "primary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-weather-night")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"]),
                                                          createVNode("span", {
                                                            class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                          }, "Dark", 2)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color", "onClick"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    sm: "4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        color: isActiveTheme("system") ? "primary" : "surface",
                                                        variant: "outlined",
                                                        class: "d-flex flex-column align-center pa-4",
                                                        hover: "",
                                                        onClick: ($event) => changeTheme("system")
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, {
                                                            size: "large",
                                                            color: isActiveTheme("system") ? "white" : "primary"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-theme-light-dark")
                                                            ]),
                                                            _: 1
                                                          }, 8, ["color"]),
                                                          createVNode("span", {
                                                            class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                          }, "System", 2)
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color", "onClick"])
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
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode("div", { class: "d-flex justify-end" }, [
                                        createVNode(VBtn, {
                                          color: "primary",
                                          variant: "elevated",
                                          onClick: saveAppearance
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-content-save")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Save ")
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ]),
                                    _: 1
                                  })
                                ])) : createCommentVNode("", true),
                                activeTab.value === "security" ? (openBlock(), createBlock("div", { key: 1 }, [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-shield-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Security ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VAlert, {
                                        type: "info",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Change Password"),
                                      createVNode(VForm, { class: "mb-6" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: security.value.newPassword,
                                            "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                            label: "New Password",
                                            variant: "outlined",
                                            type: "password",
                                            class: "mb-3"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: security.value.confirmPassword,
                                            "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                            label: "Confirm New Password",
                                            variant: "outlined",
                                            type: "password",
                                            class: "mb-3"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode("div", { class: "d-flex justify-end" }, [
                                        createVNode(VBtn, {
                                          color: "primary",
                                          variant: "elevated",
                                          onClick: saveSecurity
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-content-save")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Update Password ")
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ]),
                                    _: 1
                                  })
                                ])) : createCommentVNode("", true),
                                activeTab.value === "cookies" ? (openBlock(), createBlock("div", { key: 2 }, [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cookie-settings-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Cookie Preferences ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VAlert, {
                                        type: "info",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCard, {
                                        color: "surface",
                                        variant: "outlined",
                                        class: "mb-6 pa-4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                          createVNode(VList, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Essential cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Enabled")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Functional cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Analytics cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Marketing cookies:")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItemSubtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                      createVNode(VList, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createVNode(VSwitch, {
                                                    modelValue: cookies.value.essential,
                                                    "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                    label: "Essential cookies",
                                                    color: "primary",
                                                    disabled: "",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VDivider, { class: "my-2" }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createVNode(VSwitch, {
                                                    modelValue: cookies.value.functional,
                                                    "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                    label: "Functional cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VDivider, { class: "my-2" }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createVNode(VSwitch, {
                                                    modelValue: cookies.value.analytics,
                                                    "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                    label: "Analytics cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Help us understand how you use our site to improve it. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VDivider, { class: "my-2" }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createVNode(VSwitch, {
                                                    modelValue: cookies.value.marketing,
                                                    "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                    label: "Marketing cookies",
                                                    color: "primary",
                                                    "hide-details": "",
                                                    inset: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Used to provide you with personalized advertisements. ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode("div", { class: "d-flex justify-space-between" }, [
                                        createVNode(VBtn, {
                                          color: "error",
                                          variant: "outlined",
                                          onClick: resetCookies
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-cookie-remove")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Delete all cookies ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          variant: "elevated",
                                          onClick: saveCookies
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, { start: "" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-content-save")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Save ")
                                          ]),
                                          _: 1
                                        })
                                      ])
                                    ]),
                                    _: 1
                                  })
                                ])) : createCommentVNode("", true),
                                activeTab.value === "privacy" ? (openBlock(), createBlock("div", { key: 3 }, [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-delete-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Data & Privacy ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => {
                                      var _a;
                                      return [
                                        createVNode(VAlert, {
                                          type: "warning",
                                          variant: "tonal",
                                          class: "mb-4"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Data Export"),
                                        createVNode("p", { class: "mb-4" }, "You can download all your personal data stored on our platform."),
                                        createVNode(VBtn, {
                                          color: "primary",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-download",
                                          onClick: exportUserData,
                                          class: "mb-6",
                                          disabled: ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Export my data")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-success" }, "Premium Status"),
                                        createVNode("p", { class: "mb-4" }, [
                                          createTextVNode(" Current status: "),
                                          ((_a = unref(userStore).user) == null ? void 0 : _a.isPremium) ? (openBlock(), createBlock(VChip, {
                                            key: 0,
                                            color: "success"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Premium ")
                                            ]),
                                            _: 1
                                          })) : (openBlock(), createBlock(VChip, {
                                            key: 1,
                                            color: "error"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Free ")
                                            ]),
                                            _: 1
                                          }))
                                        ]),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-error" }, "Account Deletion"),
                                        createVNode("p", { class: "mb-4" }, "Deleting your account will permanently erase all your personal data, including your projects, settings, and history."),
                                        showDeleteAccount.value ? (openBlock(), createBlock("div", { key: 0 }, [
                                          createVNode(VTextField, {
                                            modelValue: deleteAccountConfirmation.value,
                                            "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                            label: "Type 'DELETE' to confirm",
                                            variant: "outlined",
                                            hint: "This action is irreversible",
                                            "persistent-hint": "",
                                            class: "mb-4"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode("div", { class: "d-flex" }, [
                                            createVNode(VBtn, {
                                              color: "error",
                                              variant: "tonal",
                                              disabled: deleteAccountConfirmation.value !== "DELETE",
                                              onClick: confirmDeleteAccount,
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Confirm deletion ")
                                              ]),
                                              _: 1
                                            }, 8, ["disabled"]),
                                            createVNode(VBtn, {
                                              color: "grey",
                                              variant: "text",
                                              onClick: ($event) => showDeleteAccount.value = false
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Cancel ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ])
                                        ])) : (openBlock(), createBlock(VBtn, {
                                          key: 1,
                                          color: "error",
                                          variant: "outlined",
                                          "prepend-icon": "mdi-account-remove",
                                          onClick: ($event) => showDeleteAccount.value = true
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Delete my account ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]))
                                      ];
                                    }),
                                    _: 1
                                  })
                                ])) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCard, {
                            class: "rounded-lg",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              activeTab.value === "appearance" ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-palette-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Appearance ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VRow, { class: "mb-4" }, {
                                      default: withCtx(() => [
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  sm: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      color: isActiveTheme("light") ? "primary" : "surface",
                                                      variant: "outlined",
                                                      class: "d-flex flex-column align-center pa-4",
                                                      hover: "",
                                                      onClick: ($event) => changeTheme("light")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          size: "large",
                                                          color: isActiveTheme("light") ? "white" : "primary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-weather-sunny")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color"]),
                                                        createVNode("span", {
                                                          class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                        }, "Light", 2)
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color", "onClick"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  sm: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      color: isActiveTheme("dark") ? "primary" : "surface",
                                                      variant: "outlined",
                                                      class: "d-flex flex-column align-center pa-4",
                                                      hover: "",
                                                      onClick: ($event) => changeTheme("dark")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          size: "large",
                                                          color: isActiveTheme("dark") ? "white" : "primary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-weather-night")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color"]),
                                                        createVNode("span", {
                                                          class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                        }, "Dark", 2)
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color", "onClick"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  sm: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      color: isActiveTheme("system") ? "primary" : "surface",
                                                      variant: "outlined",
                                                      class: "d-flex flex-column align-center pa-4",
                                                      hover: "",
                                                      onClick: ($event) => changeTheme("system")
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, {
                                                          size: "large",
                                                          color: isActiveTheme("system") ? "white" : "primary"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-theme-light-dark")
                                                          ]),
                                                          _: 1
                                                        }, 8, ["color"]),
                                                        createVNode("span", {
                                                          class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                        }, "System", 2)
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color", "onClick"])
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
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode("div", { class: "d-flex justify-end" }, [
                                      createVNode(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveAppearance
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-content-save")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Save ")
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                })
                              ])) : createCommentVNode("", true),
                              activeTab.value === "security" ? (openBlock(), createBlock("div", { key: 1 }, [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-shield-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Security ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VAlert, {
                                      type: "info",
                                      variant: "tonal",
                                      class: "mb-4"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Change Password"),
                                    createVNode(VForm, { class: "mb-6" }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: security.value.newPassword,
                                          "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                          label: "New Password",
                                          variant: "outlined",
                                          type: "password",
                                          class: "mb-3"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VTextField, {
                                          modelValue: security.value.confirmPassword,
                                          "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                          label: "Confirm New Password",
                                          variant: "outlined",
                                          type: "password",
                                          class: "mb-3"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode("div", { class: "d-flex justify-end" }, [
                                      createVNode(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveSecurity
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-content-save")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Update Password ")
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                })
                              ])) : createCommentVNode("", true),
                              activeTab.value === "cookies" ? (openBlock(), createBlock("div", { key: 2 }, [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-cookie-settings-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Cookie Preferences ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VAlert, {
                                      type: "info",
                                      variant: "tonal",
                                      class: "mb-4"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCard, {
                                      color: "surface",
                                      variant: "outlined",
                                      class: "mb-6 pa-4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                        createVNode(VList, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Essential cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Enabled")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Functional cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Analytics cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItem, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Marketing cookies:")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                    createVNode(VList, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: cookies.value.essential,
                                                  "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                  label: "Essential cookies",
                                                  color: "primary",
                                                  disabled: "",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-2" }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: cookies.value.functional,
                                                  "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                  label: "Functional cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-2" }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: cookies.value.analytics,
                                                  "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                  label: "Analytics cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Help us understand how you use our site to improve it. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VDivider, { class: "my-2" }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createVNode(VSwitch, {
                                                  modelValue: cookies.value.marketing,
                                                  "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                  label: "Marketing cookies",
                                                  color: "primary",
                                                  "hide-details": "",
                                                  inset: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Used to provide you with personalized advertisements. ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode("div", { class: "d-flex justify-space-between" }, [
                                      createVNode(VBtn, {
                                        color: "error",
                                        variant: "outlined",
                                        onClick: resetCookies
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-cookie-remove")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Delete all cookies ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        color: "primary",
                                        variant: "elevated",
                                        onClick: saveCookies
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { start: "" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-content-save")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Save ")
                                        ]),
                                        _: 1
                                      })
                                    ])
                                  ]),
                                  _: 1
                                })
                              ])) : createCommentVNode("", true),
                              activeTab.value === "privacy" ? (openBlock(), createBlock("div", { key: 3 }, [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      color: "white",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-delete-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Data & Privacy ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createVNode(VAlert, {
                                        type: "warning",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Data Export"),
                                      createVNode("p", { class: "mb-4" }, "You can download all your personal data stored on our platform."),
                                      createVNode(VBtn, {
                                        color: "primary",
                                        variant: "outlined",
                                        "prepend-icon": "mdi-download",
                                        onClick: exportUserData,
                                        class: "mb-6",
                                        disabled: ""
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Export my data")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-success" }, "Premium Status"),
                                      createVNode("p", { class: "mb-4" }, [
                                        createTextVNode(" Current status: "),
                                        ((_a = unref(userStore).user) == null ? void 0 : _a.isPremium) ? (openBlock(), createBlock(VChip, {
                                          key: 0,
                                          color: "success"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Premium ")
                                          ]),
                                          _: 1
                                        })) : (openBlock(), createBlock(VChip, {
                                          key: 1,
                                          color: "error"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Free ")
                                          ]),
                                          _: 1
                                        }))
                                      ]),
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-error" }, "Account Deletion"),
                                      createVNode("p", { class: "mb-4" }, "Deleting your account will permanently erase all your personal data, including your projects, settings, and history."),
                                      showDeleteAccount.value ? (openBlock(), createBlock("div", { key: 0 }, [
                                        createVNode(VTextField, {
                                          modelValue: deleteAccountConfirmation.value,
                                          "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                          label: "Type 'DELETE' to confirm",
                                          variant: "outlined",
                                          hint: "This action is irreversible",
                                          "persistent-hint": "",
                                          class: "mb-4"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode("div", { class: "d-flex" }, [
                                          createVNode(VBtn, {
                                            color: "error",
                                            variant: "tonal",
                                            disabled: deleteAccountConfirmation.value !== "DELETE",
                                            onClick: confirmDeleteAccount,
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Confirm deletion ")
                                            ]),
                                            _: 1
                                          }, 8, ["disabled"]),
                                          createVNode(VBtn, {
                                            color: "grey",
                                            variant: "text",
                                            onClick: ($event) => showDeleteAccount.value = false
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Cancel ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ])
                                      ])) : (openBlock(), createBlock(VBtn, {
                                        key: 1,
                                        color: "error",
                                        variant: "outlined",
                                        "prepend-icon": "mdi-account-remove",
                                        onClick: ($event) => showDeleteAccount.value = true
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Delete my account ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]))
                                    ];
                                  }),
                                  _: 1
                                })
                              ])) : createCommentVNode("", true)
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
                      lg: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "rounded-lg mb-4",
                          elevation: "2"
                        }, {
                          default: withCtx(() => [
                            createVNode(VList, { nav: "" }, {
                              default: withCtx(() => [
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-palette-outline",
                                  title: "Appearance",
                                  value: "appearance",
                                  onClick: ($event) => activeTab.value = "appearance",
                                  rounded: "lg",
                                  active: activeTab.value === "appearance",
                                  color: "primary"
                                }, null, 8, ["onClick", "active"]),
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-shield-outline",
                                  title: "Security",
                                  value: "security",
                                  onClick: ($event) => activeTab.value = "security",
                                  rounded: "lg",
                                  active: activeTab.value === "security",
                                  color: "primary"
                                }, null, 8, ["onClick", "active"]),
                                createVNode(VDivider, { class: "my-2" }),
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-cookie-settings-outline",
                                  title: "Cookies",
                                  value: "cookies",
                                  onClick: ($event) => activeTab.value = "cookies",
                                  rounded: "lg",
                                  active: activeTab.value === "cookies",
                                  color: "primary"
                                }, null, 8, ["onClick", "active"]),
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-delete-outline",
                                  title: "Data & Privacy",
                                  value: "privacy",
                                  onClick: ($event) => activeTab.value = "privacy",
                                  rounded: "lg",
                                  active: activeTab.value === "privacy",
                                  color: "primary"
                                }, null, 8, ["onClick", "active"])
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
                      lg: "9"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "rounded-lg",
                          elevation: "2"
                        }, {
                          default: withCtx(() => [
                            activeTab.value === "appearance" ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-palette-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Appearance ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VRow, { class: "mb-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, {
                                                cols: "12",
                                                sm: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    color: isActiveTheme("light") ? "primary" : "surface",
                                                    variant: "outlined",
                                                    class: "d-flex flex-column align-center pa-4",
                                                    hover: "",
                                                    onClick: ($event) => changeTheme("light")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "large",
                                                        color: isActiveTheme("light") ? "white" : "primary"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-weather-sunny")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"]),
                                                      createVNode("span", {
                                                        class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                      }, "Light", 2)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color", "onClick"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                sm: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    color: isActiveTheme("dark") ? "primary" : "surface",
                                                    variant: "outlined",
                                                    class: "d-flex flex-column align-center pa-4",
                                                    hover: "",
                                                    onClick: ($event) => changeTheme("dark")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "large",
                                                        color: isActiveTheme("dark") ? "white" : "primary"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-weather-night")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"]),
                                                      createVNode("span", {
                                                        class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                      }, "Dark", 2)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color", "onClick"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                sm: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    color: isActiveTheme("system") ? "primary" : "surface",
                                                    variant: "outlined",
                                                    class: "d-flex flex-column align-center pa-4",
                                                    hover: "",
                                                    onClick: ($event) => changeTheme("system")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "large",
                                                        color: isActiveTheme("system") ? "white" : "primary"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-theme-light-dark")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["color"]),
                                                      createVNode("span", {
                                                        class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                      }, "System", 2)
                                                    ]),
                                                    _: 1
                                                  }, 8, ["color", "onClick"])
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
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("div", { class: "d-flex justify-end" }, [
                                    createVNode(VBtn, {
                                      color: "primary",
                                      variant: "elevated",
                                      onClick: saveAppearance
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-content-save")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Save ")
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              })
                            ])) : createCommentVNode("", true),
                            activeTab.value === "security" ? (openBlock(), createBlock("div", { key: 1 }, [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-shield-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Security ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VAlert, {
                                    type: "info",
                                    variant: "tonal",
                                    class: "mb-4"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Change Password"),
                                  createVNode(VForm, { class: "mb-6" }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: security.value.newPassword,
                                        "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                        label: "New Password",
                                        variant: "outlined",
                                        type: "password",
                                        class: "mb-3"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VTextField, {
                                        modelValue: security.value.confirmPassword,
                                        "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                        label: "Confirm New Password",
                                        variant: "outlined",
                                        type: "password",
                                        class: "mb-3"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("div", { class: "d-flex justify-end" }, [
                                    createVNode(VBtn, {
                                      color: "primary",
                                      variant: "elevated",
                                      onClick: saveSecurity
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-content-save")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Update Password ")
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              })
                            ])) : createCommentVNode("", true),
                            activeTab.value === "cookies" ? (openBlock(), createBlock("div", { key: 2 }, [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-cookie-settings-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Cookie Preferences ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VAlert, {
                                    type: "info",
                                    variant: "tonal",
                                    class: "mb-4"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCard, {
                                    color: "surface",
                                    variant: "outlined",
                                    class: "mb-6 pa-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                      createVNode(VList, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Essential cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Enabled")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Functional cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Analytics cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItem, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Marketing cookies:")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                  createVNode(VList, null, {
                                    default: withCtx(() => [
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: cookies.value.essential,
                                                "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                                label: "Essential cookies",
                                                color: "primary",
                                                disabled: "",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: cookies.value.functional,
                                                "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                                label: "Functional cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: cookies.value.analytics,
                                                "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                                label: "Analytics cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Help us understand how you use our site to improve it. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VDivider, { class: "my-2" }),
                                      createVNode(VListItem, null, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createVNode(VSwitch, {
                                                modelValue: cookies.value.marketing,
                                                "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                                label: "Marketing cookies",
                                                color: "primary",
                                                "hide-details": "",
                                                inset: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Used to provide you with personalized advertisements. ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("div", { class: "d-flex justify-space-between" }, [
                                    createVNode(VBtn, {
                                      color: "error",
                                      variant: "outlined",
                                      onClick: resetCookies
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cookie-remove")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Delete all cookies ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VBtn, {
                                      color: "primary",
                                      variant: "elevated",
                                      onClick: saveCookies
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { start: "" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-content-save")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Save ")
                                      ]),
                                      _: 1
                                    })
                                  ])
                                ]),
                                _: 1
                              })
                            ])) : createCommentVNode("", true),
                            activeTab.value === "privacy" ? (openBlock(), createBlock("div", { key: 3 }, [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    color: "white",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-delete-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Data & Privacy ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createVNode(VAlert, {
                                      type: "warning",
                                      variant: "tonal",
                                      class: "mb-4"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Data Export"),
                                    createVNode("p", { class: "mb-4" }, "You can download all your personal data stored on our platform."),
                                    createVNode(VBtn, {
                                      color: "primary",
                                      variant: "outlined",
                                      "prepend-icon": "mdi-download",
                                      onClick: exportUserData,
                                      class: "mb-6",
                                      disabled: ""
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Export my data")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-success" }, "Premium Status"),
                                    createVNode("p", { class: "mb-4" }, [
                                      createTextVNode(" Current status: "),
                                      ((_a = unref(userStore).user) == null ? void 0 : _a.isPremium) ? (openBlock(), createBlock(VChip, {
                                        key: 0,
                                        color: "success"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Premium ")
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(VChip, {
                                        key: 1,
                                        color: "error"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Free ")
                                        ]),
                                        _: 1
                                      }))
                                    ]),
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-error" }, "Account Deletion"),
                                    createVNode("p", { class: "mb-4" }, "Deleting your account will permanently erase all your personal data, including your projects, settings, and history."),
                                    showDeleteAccount.value ? (openBlock(), createBlock("div", { key: 0 }, [
                                      createVNode(VTextField, {
                                        modelValue: deleteAccountConfirmation.value,
                                        "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                        label: "Type 'DELETE' to confirm",
                                        variant: "outlined",
                                        hint: "This action is irreversible",
                                        "persistent-hint": "",
                                        class: "mb-4"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode("div", { class: "d-flex" }, [
                                        createVNode(VBtn, {
                                          color: "error",
                                          variant: "tonal",
                                          disabled: deleteAccountConfirmation.value !== "DELETE",
                                          onClick: confirmDeleteAccount,
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Confirm deletion ")
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"]),
                                        createVNode(VBtn, {
                                          color: "grey",
                                          variant: "text",
                                          onClick: ($event) => showDeleteAccount.value = false
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Cancel ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ])
                                    ])) : (openBlock(), createBlock(VBtn, {
                                      key: 1,
                                      color: "error",
                                      variant: "outlined",
                                      "prepend-icon": "mdi-account-remove",
                                      onClick: ($event) => showDeleteAccount.value = true
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Delete my account ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]))
                                  ];
                                }),
                                _: 1
                              })
                            ])) : createCommentVNode("", true)
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
            _push2(ssrRenderComponent(Snackbar, {
              modelValue: snackbar.value,
              "onUpdate:modelValue": ($event) => snackbar.value = $event,
              text: snackbarText.value,
              color: snackbarColor.value,
              timeout: 2e3
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(VRow, null, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    lg: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "rounded-lg mb-4",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VList, { nav: "" }, {
                            default: withCtx(() => [
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-palette-outline",
                                title: "Appearance",
                                value: "appearance",
                                onClick: ($event) => activeTab.value = "appearance",
                                rounded: "lg",
                                active: activeTab.value === "appearance",
                                color: "primary"
                              }, null, 8, ["onClick", "active"]),
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-shield-outline",
                                title: "Security",
                                value: "security",
                                onClick: ($event) => activeTab.value = "security",
                                rounded: "lg",
                                active: activeTab.value === "security",
                                color: "primary"
                              }, null, 8, ["onClick", "active"]),
                              createVNode(VDivider, { class: "my-2" }),
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-cookie-settings-outline",
                                title: "Cookies",
                                value: "cookies",
                                onClick: ($event) => activeTab.value = "cookies",
                                rounded: "lg",
                                active: activeTab.value === "cookies",
                                color: "primary"
                              }, null, 8, ["onClick", "active"]),
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-delete-outline",
                                title: "Data & Privacy",
                                value: "privacy",
                                onClick: ($event) => activeTab.value = "privacy",
                                rounded: "lg",
                                active: activeTab.value === "privacy",
                                color: "primary"
                              }, null, 8, ["onClick", "active"])
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
                    lg: "9"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "rounded-lg",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          activeTab.value === "appearance" ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  color: "white",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-palette-outline")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Appearance ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VRow, { class: "mb-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Theme"),
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, {
                                              cols: "12",
                                              sm: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  color: isActiveTheme("light") ? "primary" : "surface",
                                                  variant: "outlined",
                                                  class: "d-flex flex-column align-center pa-4",
                                                  hover: "",
                                                  onClick: ($event) => changeTheme("light")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "large",
                                                      color: isActiveTheme("light") ? "white" : "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-weather-sunny")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color"]),
                                                    createVNode("span", {
                                                      class: ["mt-2", { "text-white": isActiveTheme("light") }]
                                                    }, "Light", 2)
                                                  ]),
                                                  _: 1
                                                }, 8, ["color", "onClick"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              sm: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  color: isActiveTheme("dark") ? "primary" : "surface",
                                                  variant: "outlined",
                                                  class: "d-flex flex-column align-center pa-4",
                                                  hover: "",
                                                  onClick: ($event) => changeTheme("dark")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "large",
                                                      color: isActiveTheme("dark") ? "white" : "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-weather-night")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color"]),
                                                    createVNode("span", {
                                                      class: ["mt-2", { "text-white": isActiveTheme("dark") }]
                                                    }, "Dark", 2)
                                                  ]),
                                                  _: 1
                                                }, 8, ["color", "onClick"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              sm: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  color: isActiveTheme("system") ? "primary" : "surface",
                                                  variant: "outlined",
                                                  class: "d-flex flex-column align-center pa-4",
                                                  hover: "",
                                                  onClick: ($event) => changeTheme("system")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "large",
                                                      color: isActiveTheme("system") ? "white" : "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-theme-light-dark")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["color"]),
                                                    createVNode("span", {
                                                      class: ["mt-2", { "text-white": isActiveTheme("system") }]
                                                    }, "System", 2)
                                                  ]),
                                                  _: 1
                                                }, 8, ["color", "onClick"])
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
                                createVNode(VDivider, { class: "my-4" }),
                                createVNode("div", { class: "d-flex justify-end" }, [
                                  createVNode(VBtn, {
                                    color: "primary",
                                    variant: "elevated",
                                    onClick: saveAppearance
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-content-save")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Save ")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeTab.value === "security" ? (openBlock(), createBlock("div", { key: 1 }, [
                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  color: "white",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-shield-outline")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Security ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VAlert, {
                                  type: "info",
                                  variant: "tonal",
                                  class: "mb-4"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Manage your account security settings. We recommend using a strong password and changing it regularly. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Change Password"),
                                createVNode(VForm, { class: "mb-6" }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: security.value.newPassword,
                                      "onUpdate:modelValue": ($event) => security.value.newPassword = $event,
                                      label: "New Password",
                                      variant: "outlined",
                                      type: "password",
                                      class: "mb-3"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VTextField, {
                                      modelValue: security.value.confirmPassword,
                                      "onUpdate:modelValue": ($event) => security.value.confirmPassword = $event,
                                      label: "Confirm New Password",
                                      variant: "outlined",
                                      type: "password",
                                      class: "mb-3"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-4" }),
                                createVNode("div", { class: "d-flex justify-end" }, [
                                  createVNode(VBtn, {
                                    color: "primary",
                                    variant: "elevated",
                                    onClick: saveSecurity
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-content-save")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Update Password ")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeTab.value === "cookies" ? (openBlock(), createBlock("div", { key: 2 }, [
                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  color: "white",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-cookie-settings-outline")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Cookie Preferences ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VAlert, {
                                  type: "info",
                                  variant: "tonal",
                                  class: "mb-4"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be disabled. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCard, {
                                  color: "surface",
                                  variant: "outlined",
                                  class: "mb-6 pa-4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("h3", { class: "text-h6 font-weight-bold mb-3" }, "Current Preferences Status"),
                                    createVNode(VList, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Essential cookies:")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Enabled")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Functional cookies:")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(cookies.value.functional ? "Enabled" : "Disabled"), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Analytics cookies:")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(cookies.value.analytics ? "Enabled" : "Disabled"), 1)
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItem, null, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Marketing cookies:")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VListItemSubtitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(cookies.value.marketing ? "Enabled" : "Disabled"), 1)
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
                                createVNode(VList, null, {
                                  default: withCtx(() => [
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: cookies.value.essential,
                                              "onUpdate:modelValue": ($event) => cookies.value.essential = $event,
                                              label: "Essential cookies",
                                              color: "primary",
                                              disabled: "",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Required for the site to function, they cannot be disabled. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: cookies.value.functional,
                                              "onUpdate:modelValue": ($event) => cookies.value.functional = $event,
                                              label: "Functional cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Allow us to remember your preferences and personalize your experience. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: cookies.value.analytics,
                                              "onUpdate:modelValue": ($event) => cookies.value.analytics = $event,
                                              label: "Analytics cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Help us understand how you use our site to improve it. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VDivider, { class: "my-2" }),
                                    createVNode(VListItem, null, {
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createVNode(VSwitch, {
                                              modelValue: cookies.value.marketing,
                                              "onUpdate:modelValue": ($event) => cookies.value.marketing = $event,
                                              label: "Marketing cookies",
                                              color: "primary",
                                              "hide-details": "",
                                              inset: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VListItemSubtitle, { class: "text-caption mt-1" }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Used to provide you with personalized advertisements. ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VDivider, { class: "my-4" }),
                                createVNode("div", { class: "d-flex justify-space-between" }, [
                                  createVNode(VBtn, {
                                    color: "error",
                                    variant: "outlined",
                                    onClick: resetCookies
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cookie-remove")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Delete all cookies ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    color: "primary",
                                    variant: "elevated",
                                    onClick: saveCookies
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { start: "" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-content-save")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Save ")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ]),
                              _: 1
                            })
                          ])) : createCommentVNode("", true),
                          activeTab.value === "privacy" ? (openBlock(), createBlock("div", { key: 3 }, [
                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  color: "white",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-delete-outline")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Data & Privacy ")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  createVNode(VAlert, {
                                    type: "warning",
                                    variant: "tonal",
                                    class: "mb-4"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Warning: Actions on this page regarding your data are irreversible. ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3" }, "Data Export"),
                                  createVNode("p", { class: "mb-4" }, "You can download all your personal data stored on our platform."),
                                  createVNode(VBtn, {
                                    color: "primary",
                                    variant: "outlined",
                                    "prepend-icon": "mdi-download",
                                    onClick: exportUserData,
                                    class: "mb-6",
                                    disabled: ""
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Export my data")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-success" }, "Premium Status"),
                                  createVNode("p", { class: "mb-4" }, [
                                    createTextVNode(" Current status: "),
                                    ((_a = unref(userStore).user) == null ? void 0 : _a.isPremium) ? (openBlock(), createBlock(VChip, {
                                      key: 0,
                                      color: "success"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Premium ")
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock(VChip, {
                                      key: 1,
                                      color: "error"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Free ")
                                      ]),
                                      _: 1
                                    }))
                                  ]),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("div", { class: "text-subtitle-1 font-weight-bold mb-3 text-error" }, "Account Deletion"),
                                  createVNode("p", { class: "mb-4" }, "Deleting your account will permanently erase all your personal data, including your projects, settings, and history."),
                                  showDeleteAccount.value ? (openBlock(), createBlock("div", { key: 0 }, [
                                    createVNode(VTextField, {
                                      modelValue: deleteAccountConfirmation.value,
                                      "onUpdate:modelValue": ($event) => deleteAccountConfirmation.value = $event,
                                      label: "Type 'DELETE' to confirm",
                                      variant: "outlined",
                                      hint: "This action is irreversible",
                                      "persistent-hint": "",
                                      class: "mb-4"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode("div", { class: "d-flex" }, [
                                      createVNode(VBtn, {
                                        color: "error",
                                        variant: "tonal",
                                        disabled: deleteAccountConfirmation.value !== "DELETE",
                                        onClick: confirmDeleteAccount,
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Confirm deletion ")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"]),
                                      createVNode(VBtn, {
                                        color: "grey",
                                        variant: "text",
                                        onClick: ($event) => showDeleteAccount.value = false
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Cancel ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
                                  ])) : (openBlock(), createBlock(VBtn, {
                                    key: 1,
                                    color: "error",
                                    variant: "outlined",
                                    "prepend-icon": "mdi-account-remove",
                                    onClick: ($event) => showDeleteAccount.value = true
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Delete my account ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"]))
                                ];
                              }),
                              _: 1
                            })
                          ])) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(Snackbar, {
                modelValue: snackbar.value,
                "onUpdate:modelValue": ($event) => snackbar.value = $event,
                text: snackbarText.value,
                color: snackbarColor.value,
                timeout: 2e3
              }, null, 8, ["modelValue", "onUpdate:modelValue", "text", "color"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-be6d8b82"]]);

export { settings as default };
//# sourceMappingURL=settings.vue.mjs.map
