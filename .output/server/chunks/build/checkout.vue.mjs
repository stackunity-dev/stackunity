import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public3.mjs';
import { useRouter } from 'vue-router';
import { S as useUserStore, g as VIcon, f as VCard, h as VDivider, e as VBtn, bl as VProgressCircular, a1 as VSnackbar, _ as _export_sfc } from './server.mjs';
import { u as useHead } from './v3.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VSelect } from './VSelect.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import 'pinia';
import 'deep-pick-omit';
import './VCheckboxBtn.mjs';
import './VChip.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Payment - DevUnity",
      meta: [
        { name: "author", content: "Nûr" },
        { name: "description", content: "Pay to access premium features of DevUnity" },
        { name: "robots", content: "index,follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Payment - DevUnity" },
        { name: "og:description", content: "Pay to access premium features of DevUnity" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ],
      link: [
        { rel: "canonical", href: "https://devunity.com/checkout" }
      ]
    });
    const router = useRouter();
    const userStore = useUserStore();
    const cardholderName = ref("");
    const cardElement = ref(null);
    const stripe = ref(null);
    const elements = ref(null);
    const loading = ref(false);
    const cardError = ref("");
    const showSnackbar = ref(false);
    const snackbarColor = ref("");
    const snackbarText = ref("");
    const billingCountry = ref("FR");
    const countries = [
      { code: "FR", name: "France" },
      { code: "DE", name: "Germany" },
      { code: "IT", name: "Italy" },
      { code: "ES", name: "Spain" },
      { code: "GB", name: "United Kingdom" },
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
      { code: "BE", name: "Belgium" },
      { code: "CH", name: "Switzerland" },
      { code: "LU", name: "Luxembourg" },
      { code: "NL", name: "Netherlands" },
      { code: "PT", name: "Portugal" },
      { code: "AT", name: "Austria" },
      { code: "DK", name: "Denmark" },
      { code: "SE", name: "Sweden" },
      { code: "NO", name: "Norway" },
      { code: "FI", name: "Finland" }
    ];
    const taxDetails = ref({
      baseAmount: 300,
      taxAmount: 0,
      totalAmount: 300,
      taxPercentage: 0
    });
    const features = ref([
      {
        icon: "mdi-database-outline",
        title: "Database Designer",
        description: "Create and visually manage your database schemas"
      },
      {
        icon: "mdi-magnify",
        title: "SEO Audit",
        description: "Analyze and optimize your SEO performance"
      },
      {
        icon: "mdi-robot",
        title: "Robots & Schema",
        description: "Generate robots.txt and schema.org data structures"
      },
      {
        icon: "mdi-palette",
        title: "Premium Components",
        description: "Access all components and development tools"
      }
    ]);
    const updateTaxRates = async () => {
      try {
        loading.value = true;
        const result = await userStore.checkout(cardholderName.value || "Client", billingCountry.value);
        if (result.success && result.taxDetails) {
          taxDetails.value = result.taxDetails;
          console.log("Tax rates updated for", billingCountry.value, ":", taxDetails.value);
        } else {
          console.error("Error updating tax rates:", result.error);
          showSnackbar.value = true;
          snackbarColor.value = "warning";
          snackbarText.value = "Unable to update taxes for this country.";
        }
      } catch (error) {
        console.error("Error updating tax rates:", error);
      } finally {
        loading.value = false;
      }
    };
    const processPayment = async () => {
      if (!stripe.value || !elements.value) {
        showSnackbar.value = true;
        snackbarColor.value = "error";
        snackbarText.value = "Unable to connect to Stripe. Please try again.";
        return;
      }
      loading.value = true;
      try {
        const result = await userStore.checkout(cardholderName.value, billingCountry.value);
        if (!result.success || !result.clientSecret) {
          throw new Error(result.error || "Error creating payment intent");
        }
        if (result.taxDetails) {
          taxDetails.value = result.taxDetails;
        }
        const { error, paymentIntent } = await stripe.value.confirmCardPayment(
          result.clientSecret,
          {
            payment_method: {
              card: elements.value.getElement("card"),
              billing_details: {
                name: cardholderName.value,
                address: {
                  country: billingCountry.value
                }
              }
            }
          }
        );
        if (error) {
          throw new Error(error.message || "Error confirming payment");
        }
        if (paymentIntent.status === "succeeded") {
          await userStore.updatePremiumStatus(true);
          showSnackbar.value = true;
          snackbarColor.value = "success";
          snackbarText.value = "Payment successful! Premium access activated.";
          setTimeout(() => {
            router.push("/dashboard");
          }, 2e3);
        } else {
          throw new Error("Payment was not completed");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        showSnackbar.value = true;
        snackbarColor.value = "error";
        snackbarText.value = error instanceof Error ? error.message : "An error occurred while processing payment.";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "auth-screen" }, _attrs))} data-v-fb455e9a>`);
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
                    class: "d-none d-md-flex left-panel-checkout align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="left-content text-center" data-v-fb455e9a${_scopeId3}><h1 data-v-fb455e9a${_scopeId3}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity - Develop faster and better with DevUnity" class="logo mb-8" width="350" data-v-fb455e9a${_scopeId3}><span class="sr-only" data-v-fb455e9a${_scopeId3}>Devunity - Develop faster and better with DevUnity</span></h1><div class="features-list" data-v-fb455e9a${_scopeId3}><!--[-->`);
                        ssrRenderList(features.value, (feature, index) => {
                          _push4(`<div class="${ssrRenderClass([{ "mb-6": index !== features.value.length - 1 }, "feature-item d-flex align-center"])}" data-v-fb455e9a${_scopeId3}>`);
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
                          _push4(`<div class="text-left" data-v-fb455e9a${_scopeId3}><p class="text-body-1 font-weight-medium text-white mb-1" data-v-fb455e9a${_scopeId3}>${ssrInterpolate(feature.title)}</p><p class="text-body-2 text-white-darken-2" data-v-fb455e9a${_scopeId3}>${ssrInterpolate(feature.description)}</p></div></div>`);
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
                    class: "right-panel-checkout d-flex align-center justify-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "checkout-card pa-8 elevation-0",
                          "max-width": "500",
                          width: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="d-flex justify-center d-md-none mb-8" data-v-fb455e9a${_scopeId4}><img${ssrRenderAttr("src", _imports_0)} alt="Devunity Logo" width="300" data-v-fb455e9a${_scopeId4}></div><h2 class="text-h5 font-weight-bold mb-2" data-v-fb455e9a${_scopeId4}>Premium Payment</h2><p class="text-subtitle-1 text-medium-emphasis mb-8" data-v-fb455e9a${_scopeId4}>Lifetime access to all premium features</p><div class="mb-6 px-3 py-4 bg-surface-variant rounded-lg" data-v-fb455e9a${_scopeId4}><div class="d-flex justify-space-between align-center mb-3" data-v-fb455e9a${_scopeId4}><span class="text-subtitle-1 font-weight-medium" data-v-fb455e9a${_scopeId4}>Lifetime Premium Access</span><span class="text-h6 font-weight-bold" data-v-fb455e9a${_scopeId4}>${ssrInterpolate(taxDetails.value.baseAmount)}€</span></div>`);
                              _push5(ssrRenderComponent(VDivider, { class: "mb-3" }, null, _parent5, _scopeId4));
                              _push5(`<div class="d-flex justify-space-between align-center mb-1" data-v-fb455e9a${_scopeId4}><span class="text-body-2 text-medium-emphasis" data-v-fb455e9a${_scopeId4}>Subtotal</span><span class="text-body-2" data-v-fb455e9a${_scopeId4}>${ssrInterpolate(taxDetails.value.baseAmount)}€</span></div><div class="d-flex justify-space-between align-center" data-v-fb455e9a${_scopeId4}><span class="text-body-2 text-medium-emphasis" data-v-fb455e9a${_scopeId4}>VAT (${ssrInterpolate(taxDetails.value.taxPercentage)}%)</span><span class="text-body-2" data-v-fb455e9a${_scopeId4}>${ssrInterpolate(taxDetails.value.taxAmount)}€</span></div>`);
                              _push5(ssrRenderComponent(VDivider, { class: "my-3" }, null, _parent5, _scopeId4));
                              _push5(`<div class="d-flex justify-space-between align-center" data-v-fb455e9a${_scopeId4}><span class="text-subtitle-1 font-weight-medium" data-v-fb455e9a${_scopeId4}>Total</span><span class="text-h6 font-weight-bold" data-v-fb455e9a${_scopeId4}>${ssrInterpolate(taxDetails.value.totalAmount)}€</span></div></div>`);
                              _push5(ssrRenderComponent(VForm, { onSubmit: processPayment }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="credit-card-container mb-6" data-v-fb455e9a${_scopeId5}><div class="credit-card-wrapper" data-v-fb455e9a${_scopeId5}><div class="credit-card-header d-flex justify-space-between align-center mb-4" data-v-fb455e9a${_scopeId5}><div class="credit-card-chip" data-v-fb455e9a${_scopeId5}></div><div class="d-flex" data-v-fb455e9a${_scopeId5}><img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg" class="credit-card-brand-icon" alt="Visa" data-v-fb455e9a${_scopeId5}><img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg" class="credit-card-brand-icon" alt="Mastercard" data-v-fb455e9a${_scopeId5}><img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg" class="credit-card-brand-icon" alt="American Express" data-v-fb455e9a${_scopeId5}></div></div>`);
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: cardholderName.value,
                                                  "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                  label: "Cardholder Name",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-account-outline",
                                                  class: "mb-4",
                                                  rules: [(v) => !!v || "Name required"],
                                                  "hide-details": "auto"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: cardholderName.value,
                                                    "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                    label: "Cardholder Name",
                                                    variant: "outlined",
                                                    "prepend-inner-icon": "mdi-account-outline",
                                                    class: "mb-4",
                                                    rules: [(v) => !!v || "Name required"],
                                                    "hide-details": "auto"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VSelect, {
                                                  modelValue: billingCountry.value,
                                                  "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                  items: countries,
                                                  "item-title": "name",
                                                  "item-value": "code",
                                                  label: "Billing Country",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-earth",
                                                  class: "mb-4",
                                                  "hide-details": "auto"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VSelect, {
                                                    modelValue: billingCountry.value,
                                                    "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                    items: countries,
                                                    "item-title": "name",
                                                    "item-value": "code",
                                                    label: "Billing Country",
                                                    variant: "outlined",
                                                    "prepend-inner-icon": "mdi-earth",
                                                    class: "mb-4",
                                                    "hide-details": "auto"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: cardholderName.value,
                                                  "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                  label: "Cardholder Name",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-account-outline",
                                                  class: "mb-4",
                                                  rules: [(v) => !!v || "Name required"],
                                                  "hide-details": "auto"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VSelect, {
                                                  modelValue: billingCountry.value,
                                                  "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                  items: countries,
                                                  "item-title": "name",
                                                  "item-value": "code",
                                                  label: "Billing Country",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-earth",
                                                  class: "mb-4",
                                                  "hide-details": "auto"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="stripe-card-element mb-2" data-v-fb455e9a${_scopeId5}></div>`);
                                    if (cardError.value) {
                                      _push6(`<div class="text-error mb-4 text-body-2" data-v-fb455e9a${_scopeId5}>${ssrInterpolate(cardError.value)}</div>`);
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    _push6(`</div></div>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "52",
                                      class: "text-none font-weight-medium rounded-lg"
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
                                          _push7(ssrRenderComponent(VIcon, {
                                            start: "",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-credit-card-check-outline`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-credit-card-check-outline")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Pay ${ssrInterpolate(taxDetails.value.totalAmount)}€ `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              start: "",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-credit-card-check-outline")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="d-flex align-center justify-center mt-5" data-v-fb455e9a${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VIcon, {
                                      icon: "mdi-shield-check-outline",
                                      size: "small",
                                      class: "mr-2"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<span class="text-caption text-medium-emphasis" data-v-fb455e9a${_scopeId5}>Secure payment via Stripe</span></div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "credit-card-container mb-6" }, [
                                        createVNode("div", { class: "credit-card-wrapper" }, [
                                          createVNode("div", { class: "credit-card-header d-flex justify-space-between align-center mb-4" }, [
                                            createVNode("div", { class: "credit-card-chip" }),
                                            createVNode("div", { class: "d-flex" }, [
                                              createVNode("img", {
                                                src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
                                                class: "credit-card-brand-icon",
                                                alt: "Visa"
                                              }),
                                              createVNode("img", {
                                                src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
                                                class: "credit-card-brand-icon",
                                                alt: "Mastercard"
                                              }),
                                              createVNode("img", {
                                                src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
                                                class: "credit-card-brand-icon",
                                                alt: "American Express"
                                              })
                                            ])
                                          ]),
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: cardholderName.value,
                                                    "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                    label: "Cardholder Name",
                                                    variant: "outlined",
                                                    "prepend-inner-icon": "mdi-account-outline",
                                                    class: "mb-4",
                                                    rules: [(v) => !!v || "Name required"],
                                                    "hide-details": "auto"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode(VSelect, {
                                                    modelValue: billingCountry.value,
                                                    "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                    items: countries,
                                                    "item-title": "name",
                                                    "item-value": "code",
                                                    label: "Billing Country",
                                                    variant: "outlined",
                                                    "prepend-inner-icon": "mdi-earth",
                                                    class: "mb-4",
                                                    "hide-details": "auto"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", {
                                            ref_key: "cardElement",
                                            ref: cardElement,
                                            class: "stripe-card-element mb-2"
                                          }, null, 512),
                                          cardError.value ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "text-error mb-4 text-body-2"
                                          }, toDisplayString(cardError.value), 1)) : createCommentVNode("", true)
                                        ])
                                      ]),
                                      createVNode(VBtn, {
                                        block: "",
                                        color: "primary",
                                        type: "submit",
                                        loading: loading.value,
                                        "min-height": "52",
                                        class: "text-none font-weight-medium rounded-lg"
                                      }, {
                                        loader: withCtx(() => [
                                          createVNode(VProgressCircular, { indeterminate: "" })
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            start: "",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-credit-card-check-outline")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                        ]),
                                        _: 1
                                      }, 8, ["loading"]),
                                      createVNode("div", { class: "d-flex align-center justify-center mt-5" }, [
                                        createVNode(VIcon, {
                                          icon: "mdi-shield-check-outline",
                                          size: "small",
                                          class: "mr-2"
                                        }),
                                        createVNode("span", { class: "text-caption text-medium-emphasis" }, "Secure payment via Stripe")
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
                                createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Premium Payment"),
                                createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Lifetime access to all premium features"),
                                createVNode("div", { class: "mb-6 px-3 py-4 bg-surface-variant rounded-lg" }, [
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-3" }, [
                                    createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Lifetime Premium Access"),
                                    createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                                  ]),
                                  createVNode(VDivider, { class: "mb-3" }),
                                  createVNode("div", { class: "d-flex justify-space-between align-center mb-1" }, [
                                    createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "Subtotal"),
                                    createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                                  ]),
                                  createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                    createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "VAT (" + toDisplayString(taxDetails.value.taxPercentage) + "%)", 1),
                                    createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.taxAmount) + "€", 1)
                                  ]),
                                  createVNode(VDivider, { class: "my-3" }),
                                  createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                    createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Total"),
                                    createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.totalAmount) + "€", 1)
                                  ])
                                ]),
                                createVNode(VForm, {
                                  onSubmit: withModifiers(processPayment, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "credit-card-container mb-6" }, [
                                      createVNode("div", { class: "credit-card-wrapper" }, [
                                        createVNode("div", { class: "credit-card-header d-flex justify-space-between align-center mb-4" }, [
                                          createVNode("div", { class: "credit-card-chip" }),
                                          createVNode("div", { class: "d-flex" }, [
                                            createVNode("img", {
                                              src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
                                              class: "credit-card-brand-icon",
                                              alt: "Visa"
                                            }),
                                            createVNode("img", {
                                              src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
                                              class: "credit-card-brand-icon",
                                              alt: "Mastercard"
                                            }),
                                            createVNode("img", {
                                              src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
                                              class: "credit-card-brand-icon",
                                              alt: "American Express"
                                            })
                                          ])
                                        ]),
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: cardholderName.value,
                                                  "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                  label: "Cardholder Name",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-account-outline",
                                                  class: "mb-4",
                                                  rules: [(v) => !!v || "Name required"],
                                                  "hide-details": "auto"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VSelect, {
                                                  modelValue: billingCountry.value,
                                                  "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                  items: countries,
                                                  "item-title": "name",
                                                  "item-value": "code",
                                                  label: "Billing Country",
                                                  variant: "outlined",
                                                  "prepend-inner-icon": "mdi-earth",
                                                  class: "mb-4",
                                                  "hide-details": "auto"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", {
                                          ref_key: "cardElement",
                                          ref: cardElement,
                                          class: "stripe-card-element mb-2"
                                        }, null, 512),
                                        cardError.value ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "text-error mb-4 text-body-2"
                                        }, toDisplayString(cardError.value), 1)) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    createVNode(VBtn, {
                                      block: "",
                                      color: "primary",
                                      type: "submit",
                                      loading: loading.value,
                                      "min-height": "52",
                                      class: "text-none font-weight-medium rounded-lg"
                                    }, {
                                      loader: withCtx(() => [
                                        createVNode(VProgressCircular, { indeterminate: "" })
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          start: "",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-credit-card-check-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                      ]),
                                      _: 1
                                    }, 8, ["loading"]),
                                    createVNode("div", { class: "d-flex align-center justify-center mt-5" }, [
                                      createVNode(VIcon, {
                                        icon: "mdi-shield-check-outline",
                                        size: "small",
                                        class: "mr-2"
                                      }),
                                      createVNode("span", { class: "text-caption text-medium-emphasis" }, "Secure payment via Stripe")
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
                            class: "checkout-card pa-8 elevation-0",
                            "max-width": "500",
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
                              createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Premium Payment"),
                              createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Lifetime access to all premium features"),
                              createVNode("div", { class: "mb-6 px-3 py-4 bg-surface-variant rounded-lg" }, [
                                createVNode("div", { class: "d-flex justify-space-between align-center mb-3" }, [
                                  createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Lifetime Premium Access"),
                                  createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                                ]),
                                createVNode(VDivider, { class: "mb-3" }),
                                createVNode("div", { class: "d-flex justify-space-between align-center mb-1" }, [
                                  createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "Subtotal"),
                                  createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                                ]),
                                createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                  createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "VAT (" + toDisplayString(taxDetails.value.taxPercentage) + "%)", 1),
                                  createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.taxAmount) + "€", 1)
                                ]),
                                createVNode(VDivider, { class: "my-3" }),
                                createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                  createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Total"),
                                  createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.totalAmount) + "€", 1)
                                ])
                              ]),
                              createVNode(VForm, {
                                onSubmit: withModifiers(processPayment, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "credit-card-container mb-6" }, [
                                    createVNode("div", { class: "credit-card-wrapper" }, [
                                      createVNode("div", { class: "credit-card-header d-flex justify-space-between align-center mb-4" }, [
                                        createVNode("div", { class: "credit-card-chip" }),
                                        createVNode("div", { class: "d-flex" }, [
                                          createVNode("img", {
                                            src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
                                            class: "credit-card-brand-icon",
                                            alt: "Visa"
                                          }),
                                          createVNode("img", {
                                            src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
                                            class: "credit-card-brand-icon",
                                            alt: "Mastercard"
                                          }),
                                          createVNode("img", {
                                            src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
                                            class: "credit-card-brand-icon",
                                            alt: "American Express"
                                          })
                                        ])
                                      ]),
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: cardholderName.value,
                                                "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                                label: "Cardholder Name",
                                                variant: "outlined",
                                                "prepend-inner-icon": "mdi-account-outline",
                                                class: "mb-4",
                                                rules: [(v) => !!v || "Name required"],
                                                "hide-details": "auto"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VSelect, {
                                                modelValue: billingCountry.value,
                                                "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                                items: countries,
                                                "item-title": "name",
                                                "item-value": "code",
                                                label: "Billing Country",
                                                variant: "outlined",
                                                "prepend-inner-icon": "mdi-earth",
                                                class: "mb-4",
                                                "hide-details": "auto"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", {
                                        ref_key: "cardElement",
                                        ref: cardElement,
                                        class: "stripe-card-element mb-2"
                                      }, null, 512),
                                      cardError.value ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-error mb-4 text-body-2"
                                      }, toDisplayString(cardError.value), 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  createVNode(VBtn, {
                                    block: "",
                                    color: "primary",
                                    type: "submit",
                                    loading: loading.value,
                                    "min-height": "52",
                                    class: "text-none font-weight-medium rounded-lg"
                                  }, {
                                    loader: withCtx(() => [
                                      createVNode(VProgressCircular, { indeterminate: "" })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        start: "",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-credit-card-check-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                    ]),
                                    _: 1
                                  }, 8, ["loading"]),
                                  createVNode("div", { class: "d-flex align-center justify-center mt-5" }, [
                                    createVNode(VIcon, {
                                      icon: "mdi-shield-check-outline",
                                      size: "small",
                                      class: "mr-2"
                                    }),
                                    createVNode("span", { class: "text-caption text-medium-emphasis" }, "Secure payment via Stripe")
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
                      class: "d-none d-md-flex left-panel-checkout align-center justify-center"
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
                      class: "right-panel-checkout d-flex align-center justify-center"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "checkout-card pa-8 elevation-0",
                          "max-width": "500",
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
                            createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Premium Payment"),
                            createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Lifetime access to all premium features"),
                            createVNode("div", { class: "mb-6 px-3 py-4 bg-surface-variant rounded-lg" }, [
                              createVNode("div", { class: "d-flex justify-space-between align-center mb-3" }, [
                                createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Lifetime Premium Access"),
                                createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                              ]),
                              createVNode(VDivider, { class: "mb-3" }),
                              createVNode("div", { class: "d-flex justify-space-between align-center mb-1" }, [
                                createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "Subtotal"),
                                createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                              ]),
                              createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "VAT (" + toDisplayString(taxDetails.value.taxPercentage) + "%)", 1),
                                createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.taxAmount) + "€", 1)
                              ]),
                              createVNode(VDivider, { class: "my-3" }),
                              createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                                createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Total"),
                                createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.totalAmount) + "€", 1)
                              ])
                            ]),
                            createVNode(VForm, {
                              onSubmit: withModifiers(processPayment, ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "credit-card-container mb-6" }, [
                                  createVNode("div", { class: "credit-card-wrapper" }, [
                                    createVNode("div", { class: "credit-card-header d-flex justify-space-between align-center mb-4" }, [
                                      createVNode("div", { class: "credit-card-chip" }),
                                      createVNode("div", { class: "d-flex" }, [
                                        createVNode("img", {
                                          src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
                                          class: "credit-card-brand-icon",
                                          alt: "Visa"
                                        }),
                                        createVNode("img", {
                                          src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
                                          class: "credit-card-brand-icon",
                                          alt: "Mastercard"
                                        }),
                                        createVNode("img", {
                                          src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
                                          class: "credit-card-brand-icon",
                                          alt: "American Express"
                                        })
                                      ])
                                    ]),
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: cardholderName.value,
                                              "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                              label: "Cardholder Name",
                                              variant: "outlined",
                                              "prepend-inner-icon": "mdi-account-outline",
                                              class: "mb-4",
                                              rules: [(v) => !!v || "Name required"],
                                              "hide-details": "auto"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode(VSelect, {
                                              modelValue: billingCountry.value,
                                              "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                              items: countries,
                                              "item-title": "name",
                                              "item-value": "code",
                                              label: "Billing Country",
                                              variant: "outlined",
                                              "prepend-inner-icon": "mdi-earth",
                                              class: "mb-4",
                                              "hide-details": "auto"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", {
                                      ref_key: "cardElement",
                                      ref: cardElement,
                                      class: "stripe-card-element mb-2"
                                    }, null, 512),
                                    cardError.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "text-error mb-4 text-body-2"
                                    }, toDisplayString(cardError.value), 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode(VBtn, {
                                  block: "",
                                  color: "primary",
                                  type: "submit",
                                  loading: loading.value,
                                  "min-height": "52",
                                  class: "text-none font-weight-medium rounded-lg"
                                }, {
                                  loader: withCtx(() => [
                                    createVNode(VProgressCircular, { indeterminate: "" })
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      start: "",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-credit-card-check-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                  ]),
                                  _: 1
                                }, 8, ["loading"]),
                                createVNode("div", { class: "d-flex align-center justify-center mt-5" }, [
                                  createVNode(VIcon, {
                                    icon: "mdi-shield-check-outline",
                                    size: "small",
                                    class: "mr-2"
                                  }),
                                  createVNode("span", { class: "text-caption text-medium-emphasis" }, "Secure payment via Stripe")
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
                    class: "d-none d-md-flex left-panel-checkout align-center justify-center"
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
                    class: "right-panel-checkout d-flex align-center justify-center"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "checkout-card pa-8 elevation-0",
                        "max-width": "500",
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
                          createVNode("h2", { class: "text-h5 font-weight-bold mb-2" }, "Premium Payment"),
                          createVNode("p", { class: "text-subtitle-1 text-medium-emphasis mb-8" }, "Lifetime access to all premium features"),
                          createVNode("div", { class: "mb-6 px-3 py-4 bg-surface-variant rounded-lg" }, [
                            createVNode("div", { class: "d-flex justify-space-between align-center mb-3" }, [
                              createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Lifetime Premium Access"),
                              createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                            ]),
                            createVNode(VDivider, { class: "mb-3" }),
                            createVNode("div", { class: "d-flex justify-space-between align-center mb-1" }, [
                              createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "Subtotal"),
                              createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.baseAmount) + "€", 1)
                            ]),
                            createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                              createVNode("span", { class: "text-body-2 text-medium-emphasis" }, "VAT (" + toDisplayString(taxDetails.value.taxPercentage) + "%)", 1),
                              createVNode("span", { class: "text-body-2" }, toDisplayString(taxDetails.value.taxAmount) + "€", 1)
                            ]),
                            createVNode(VDivider, { class: "my-3" }),
                            createVNode("div", { class: "d-flex justify-space-between align-center" }, [
                              createVNode("span", { class: "text-subtitle-1 font-weight-medium" }, "Total"),
                              createVNode("span", { class: "text-h6 font-weight-bold" }, toDisplayString(taxDetails.value.totalAmount) + "€", 1)
                            ])
                          ]),
                          createVNode(VForm, {
                            onSubmit: withModifiers(processPayment, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "credit-card-container mb-6" }, [
                                createVNode("div", { class: "credit-card-wrapper" }, [
                                  createVNode("div", { class: "credit-card-header d-flex justify-space-between align-center mb-4" }, [
                                    createVNode("div", { class: "credit-card-chip" }),
                                    createVNode("div", { class: "d-flex" }, [
                                      createVNode("img", {
                                        src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg",
                                        class: "credit-card-brand-icon",
                                        alt: "Visa"
                                      }),
                                      createVNode("img", {
                                        src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg",
                                        class: "credit-card-brand-icon",
                                        alt: "Mastercard"
                                      }),
                                      createVNode("img", {
                                        src: "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg",
                                        class: "credit-card-brand-icon",
                                        alt: "American Express"
                                      })
                                    ])
                                  ]),
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: cardholderName.value,
                                            "onUpdate:modelValue": ($event) => cardholderName.value = $event,
                                            label: "Cardholder Name",
                                            variant: "outlined",
                                            "prepend-inner-icon": "mdi-account-outline",
                                            class: "mb-4",
                                            rules: [(v) => !!v || "Name required"],
                                            "hide-details": "auto"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode(VSelect, {
                                            modelValue: billingCountry.value,
                                            "onUpdate:modelValue": [($event) => billingCountry.value = $event, updateTaxRates],
                                            items: countries,
                                            "item-title": "name",
                                            "item-value": "code",
                                            label: "Billing Country",
                                            variant: "outlined",
                                            "prepend-inner-icon": "mdi-earth",
                                            class: "mb-4",
                                            "hide-details": "auto"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", {
                                    ref_key: "cardElement",
                                    ref: cardElement,
                                    class: "stripe-card-element mb-2"
                                  }, null, 512),
                                  cardError.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "text-error mb-4 text-body-2"
                                  }, toDisplayString(cardError.value), 1)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode(VBtn, {
                                block: "",
                                color: "primary",
                                type: "submit",
                                loading: loading.value,
                                "min-height": "52",
                                class: "text-none font-weight-medium rounded-lg"
                              }, {
                                loader: withCtx(() => [
                                  createVNode(VProgressCircular, { indeterminate: "" })
                                ]),
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    start: "",
                                    class: "mr-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-credit-card-check-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Pay " + toDisplayString(taxDetails.value.totalAmount) + "€ ", 1)
                                ]),
                                _: 1
                              }, 8, ["loading"]),
                              createVNode("div", { class: "d-flex align-center justify-center mt-5" }, [
                                createVNode(VIcon, {
                                  icon: "mdi-shield-check-outline",
                                  size: "small",
                                  class: "mr-2"
                                }),
                                createVNode("span", { class: "text-caption text-medium-emphasis" }, "Secure payment via Stripe")
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
      _push(ssrRenderComponent(VSnackbar, {
        modelValue: showSnackbar.value,
        "onUpdate:modelValue": ($event) => showSnackbar.value = $event,
        color: snackbarColor.value,
        timeout: 3e3
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VBtn, {
              icon: "mdi-close",
              onClick: ($event) => showSnackbar.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(VBtn, {
                icon: "mdi-close",
                onClick: ($event) => showSnackbar.value = false
              }, null, 8, ["onClick"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(snackbarText.value)} `);
          } else {
            return [
              createTextVNode(toDisplayString(snackbarText.value) + " ", 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fb455e9a"]]);

export { checkout as default };
//# sourceMappingURL=checkout.vue.mjs.map
