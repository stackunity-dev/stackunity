import { defineComponent, ref, defineAsyncComponent, withCtx, createTextVNode, createVNode, toDisplayString, unref, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { S as useUserStore, V as VApp, f as VCard, $ as VCardTitle, g as VIcon, d as VSpacer, e as VBtn, Y as VCardText, T as VList, U as VListItem, W as VListItemTitle, aC as VListItemSubtitle, bN as VProgressLinear, _ as _export_sfc } from './server.mjs';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { V as VMain } from './VMain.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VChip } from './VChip.mjs';
import { V as VDataTable } from './VDataTable.mjs';
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
import 'vue-router';
import 'pinia-plugin-persistedstate';
import './VSelect.mjs';
import './VTextField.mjs';
import './VCheckboxBtn.mjs';
import './VTable.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics",
  __ssrInlineRender: true,
  setup(__props) {
    use([
      CanvasRenderer,
      LineChart,
      PieChart,
      BarChart,
      GridComponent,
      TooltipComponent,
      LegendComponent,
      TitleComponent
    ]);
    const userStore = useUserStore();
    const loading = ref(false);
    const analyticsData = ref({
      uniqueVisitors: 0,
      visitorGrowth: 0,
      pageViews: 0,
      avgPagesPerVisit: 0,
      avgTimeOnSite: 0,
      bounceRate: 0,
      conversionRate: 0,
      conversionGoal: "5%",
      topPages: [],
      userBehavior: []
    });
    const trafficChartOption = ref({
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: []
      },
      yAxis: {
        type: "value"
      },
      series: [{
        data: [],
        type: "line",
        smooth: true
      }]
    });
    const geoChartOption = ref({
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      series: [{
        type: "pie",
        radius: "50%",
        data: []
      }]
    });
    const devicesChartOption = ref({
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      series: [{
        type: "pie",
        radius: "50%",
        data: []
      }]
    });
    const behaviorHeaders = [
      { title: "Comportement", key: "type" },
      { title: "Nombre d'utilisateurs", key: "count" },
      { title: "Pourcentage", key: "percentage" }
    ];
    const getBehaviorColor = (type) => {
      const colors = {
        "Nouveau visiteur": "primary",
        "Retour": "success",
        "Conversion": "info",
        "Abandon": "error"
      };
      return colors[type] || "grey";
    };
    const fetchAnalyticsData = async () => {
      try {
        loading.value = true;
        const token = userStore.getTokenFromCookie();
        const url = "/api/analytics";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données analytiques");
        }
        const data = await response.json();
        console.log(data);
        analyticsData.value = {
          uniqueVisitors: data.uniqueVisitors || 0,
          visitorGrowth: data.visitorGrowth || 0,
          pageViews: data.pageViews || 0,
          avgPagesPerVisit: data.avgPagesPerVisit || 0,
          avgTimeOnSite: data.avgTimeOnSite || 0,
          bounceRate: data.bounceRate || 0,
          conversionRate: data.conversionRate || 0,
          conversionGoal: "5%",
          topPages: data.topPages || [],
          userBehavior: data.userBehavior || []
        };
        if (data.traffic && data.traffic.length > 0) {
          trafficChartOption.value.xAxis.data = data.traffic.map((item) => item.date);
          trafficChartOption.value.series[0].data = data.traffic.map((item) => item.count);
        }
        if (data.geographicDistribution && data.geographicDistribution.length > 0) {
          geoChartOption.value.series[0].data = data.geographicDistribution.map((item) => ({
            name: item.country,
            value: item.count
          }));
        }
        if (data.deviceUsage && data.deviceUsage.length > 0) {
          devicesChartOption.value.series[0].data = data.deviceUsage.map((item) => ({
            name: item.deviceType,
            value: item.count
          }));
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        loading.value = false;
      }
    };
    const refreshData = () => {
      fetchAnalyticsData();
    };
    const VChart = defineAsyncComponent(() => {
      return new Promise((resolve) => {
        {
          resolve({ template: "<div></div>" });
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, {
                    fluid: "",
                    class: "pa-6"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, { cols: "12" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VCard, {
                                      class: "rounded-lg",
                                      elevation: "2"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VIcon, {
                                                  color: "white",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-chart-box`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-chart-box")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`<span data-v-c182631d${_scopeId7}>Tableau de bord analytique</span>`);
                                                _push8(ssrRenderComponent(VSpacer, null, null, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VBtn, {
                                                  color: "white",
                                                  variant: "text",
                                                  onClick: refreshData,
                                                  loading: loading.value
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VIcon, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-refresh`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-refresh")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(` Rafraîchir `);
                                                    } else {
                                                      return [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-refresh")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Rafraîchir ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VIcon, {
                                                    color: "white",
                                                    class: "mr-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-chart-box")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("span", null, "Tableau de bord analytique"),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    color: "white",
                                                    variant: "text",
                                                    onClick: refreshData,
                                                    loading: loading.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-refresh")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Rafraîchir ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["loading"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VRow, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "3"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`<div class="text-h6 mb-2" data-v-c182631d${_scopeId11}>Visiteurs uniques</div><div class="text-h4" data-v-c182631d${_scopeId11}>${ssrInterpolate(analyticsData.value.uniqueVisitors)}</div><div class="text-caption text-grey" data-v-c182631d${_scopeId11}> +${ssrInterpolate(analyticsData.value.visitorGrowth)}% vs mois dernier </div>`);
                                                                      } else {
                                                                        return [
                                                                          createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                          createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                        createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                      createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "3"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`<div class="text-h6 mb-2" data-v-c182631d${_scopeId11}>Pages vues</div><div class="text-h4" data-v-c182631d${_scopeId11}>${ssrInterpolate(analyticsData.value.pageViews)}</div><div class="text-caption text-grey" data-v-c182631d${_scopeId11}> Moyenne: ${ssrInterpolate(analyticsData.value.avgPagesPerVisit)}</div>`);
                                                                      } else {
                                                                        return [
                                                                          createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                          createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                        createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                      createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "3"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`<div class="text-h6 mb-2" data-v-c182631d${_scopeId11}>Temps moyen</div><div class="text-h4" data-v-c182631d${_scopeId11}>${ssrInterpolate(analyticsData.value.avgTimeOnSite)}s</div><div class="text-caption text-grey" data-v-c182631d${_scopeId11}> Taux de rebond: ${ssrInterpolate(analyticsData.value.bounceRate)}% </div>`);
                                                                      } else {
                                                                        return [
                                                                          createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                          createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                        createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                      createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "3"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`<div class="text-h6 mb-2" data-v-c182631d${_scopeId11}>Taux de conversion</div><div class="text-h4" data-v-c182631d${_scopeId11}>${ssrInterpolate(analyticsData.value.conversionRate)}%</div><div class="text-caption text-grey" data-v-c182631d${_scopeId11}> Objectif: ${ssrInterpolate(analyticsData.value.conversionGoal)}</div>`);
                                                                      } else {
                                                                        return [
                                                                          createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                          createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                        createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                      createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "3"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                    createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                    createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                          md: "3"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                    createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                    createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                          md: "3"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                    createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                    createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                          md: "3"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                    createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                    createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VRow, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "8"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VIcon, { start: "" }, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`mdi-chart-line`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode("mdi-chart-line")
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                        _push12(` Trafic par jour `);
                                                                      } else {
                                                                        return [
                                                                          createVNode(VIcon, { start: "" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-chart-line")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createTextVNode(" Trafic par jour ")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(unref(VChart), {
                                                                          class: "chart",
                                                                          option: trafficChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, _parent12, _scopeId11));
                                                                      } else {
                                                                        return [
                                                                          createVNode(unref(VChart), {
                                                                            class: "chart",
                                                                            option: trafficChartOption.value,
                                                                            autoresize: ""
                                                                          }, null, 8, ["option"])
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { start: "" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-chart-line")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createTextVNode(" Trafic par jour ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(VChart), {
                                                                          class: "chart",
                                                                          option: trafficChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, 8, ["option"])
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, { start: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-chart-line")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createTextVNode(" Trafic par jour ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(VChart), {
                                                                        class: "chart",
                                                                        option: trafficChartOption.value,
                                                                        autoresize: ""
                                                                      }, null, 8, ["option"])
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
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "4"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VIcon, { start: "" }, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`mdi-map-marker`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode("mdi-map-marker")
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                        _push12(` Répartition géographique `);
                                                                      } else {
                                                                        return [
                                                                          createVNode(VIcon, { start: "" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-map-marker")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createTextVNode(" Répartition géographique ")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(unref(VChart), {
                                                                          class: "chart",
                                                                          option: geoChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, _parent12, _scopeId11));
                                                                      } else {
                                                                        return [
                                                                          createVNode(unref(VChart), {
                                                                            class: "chart",
                                                                            option: geoChartOption.value,
                                                                            autoresize: ""
                                                                          }, null, 8, ["option"])
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { start: "" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-map-marker")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createTextVNode(" Répartition géographique ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(VChart), {
                                                                          class: "chart",
                                                                          option: geoChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, 8, ["option"])
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, { start: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-map-marker")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createTextVNode(" Répartition géographique ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(VChart), {
                                                                        class: "chart",
                                                                        option: geoChartOption.value,
                                                                        autoresize: ""
                                                                      }, null, 8, ["option"])
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
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "8"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { start: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-chart-line")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createTextVNode(" Trafic par jour ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(VChart), {
                                                                      class: "chart",
                                                                      option: trafficChartOption.value,
                                                                      autoresize: ""
                                                                    }, null, 8, ["option"])
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
                                                          md: "4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { start: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-map-marker")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createTextVNode(" Répartition géographique ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(VChart), {
                                                                      class: "chart",
                                                                      option: geoChartOption.value,
                                                                      autoresize: ""
                                                                    }, null, 8, ["option"])
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
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VRow, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VIcon, { start: "" }, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`mdi-web`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode("mdi-web")
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                        _push12(` Pages les plus visitées `);
                                                                      } else {
                                                                        return [
                                                                          createVNode(VIcon, { start: "" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-web")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createTextVNode(" Pages les plus visitées ")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VList, null, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`<!--[-->`);
                                                                              ssrRenderList(analyticsData.value.topPages, (page) => {
                                                                                _push13(ssrRenderComponent(VListItem, {
                                                                                  key: page.url
                                                                                }, {
                                                                                  append: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                    if (_push14) {
                                                                                      _push14(ssrRenderComponent(VChip, {
                                                                                        size: "small",
                                                                                        color: "primary"
                                                                                      }, {
                                                                                        default: withCtx((_14, _push15, _parent15, _scopeId14) => {
                                                                                          if (_push15) {
                                                                                            _push15(`${ssrInterpolate(page.views)} vues`);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent14, _scopeId13));
                                                                                    } else {
                                                                                      return [
                                                                                        createVNode(VChip, {
                                                                                          size: "small",
                                                                                          color: "primary"
                                                                                        }, {
                                                                                          default: withCtx(() => [
                                                                                            createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                          ]),
                                                                                          _: 2
                                                                                        }, 1024)
                                                                                      ];
                                                                                    }
                                                                                  }),
                                                                                  default: withCtx((_13, _push14, _parent14, _scopeId13) => {
                                                                                    if (_push14) {
                                                                                      _push14(ssrRenderComponent(VListItemTitle, null, {
                                                                                        default: withCtx((_14, _push15, _parent15, _scopeId14) => {
                                                                                          if (_push15) {
                                                                                            _push15(`${ssrInterpolate(page.title)}`);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(toDisplayString(page.title), 1)
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent14, _scopeId13));
                                                                                      _push14(ssrRenderComponent(VListItemSubtitle, null, {
                                                                                        default: withCtx((_14, _push15, _parent15, _scopeId14) => {
                                                                                          if (_push15) {
                                                                                            _push15(`${ssrInterpolate(page.url)}`);
                                                                                          } else {
                                                                                            return [
                                                                                              createTextVNode(toDisplayString(page.url), 1)
                                                                                            ];
                                                                                          }
                                                                                        }),
                                                                                        _: 2
                                                                                      }, _parent14, _scopeId13));
                                                                                    } else {
                                                                                      return [
                                                                                        createVNode(VListItemTitle, null, {
                                                                                          default: withCtx(() => [
                                                                                            createTextVNode(toDisplayString(page.title), 1)
                                                                                          ]),
                                                                                          _: 2
                                                                                        }, 1024),
                                                                                        createVNode(VListItemSubtitle, null, {
                                                                                          default: withCtx(() => [
                                                                                            createTextVNode(toDisplayString(page.url), 1)
                                                                                          ]),
                                                                                          _: 2
                                                                                        }, 1024)
                                                                                      ];
                                                                                    }
                                                                                  }),
                                                                                  _: 2
                                                                                }, _parent13, _scopeId12));
                                                                              });
                                                                              _push13(`<!--]-->`);
                                                                            } else {
                                                                              return [
                                                                                (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                                  return openBlock(), createBlock(VListItem, {
                                                                                    key: page.url
                                                                                  }, {
                                                                                    append: withCtx(() => [
                                                                                      createVNode(VChip, {
                                                                                        size: "small",
                                                                                        color: "primary"
                                                                                      }, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                        ]),
                                                                                        _: 2
                                                                                      }, 1024)
                                                                                    ]),
                                                                                    default: withCtx(() => [
                                                                                      createVNode(VListItemTitle, null, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(toDisplayString(page.title), 1)
                                                                                        ]),
                                                                                        _: 2
                                                                                      }, 1024),
                                                                                      createVNode(VListItemSubtitle, null, {
                                                                                        default: withCtx(() => [
                                                                                          createTextVNode(toDisplayString(page.url), 1)
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
                                                                        }, _parent12, _scopeId11));
                                                                      } else {
                                                                        return [
                                                                          createVNode(VList, null, {
                                                                            default: withCtx(() => [
                                                                              (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                                return openBlock(), createBlock(VListItem, {
                                                                                  key: page.url
                                                                                }, {
                                                                                  append: withCtx(() => [
                                                                                    createVNode(VChip, {
                                                                                      size: "small",
                                                                                      color: "primary"
                                                                                    }, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                      ]),
                                                                                      _: 2
                                                                                    }, 1024)
                                                                                  ]),
                                                                                  default: withCtx(() => [
                                                                                    createVNode(VListItemTitle, null, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(toDisplayString(page.title), 1)
                                                                                      ]),
                                                                                      _: 2
                                                                                    }, 1024),
                                                                                    createVNode(VListItemSubtitle, null, {
                                                                                      default: withCtx(() => [
                                                                                        createTextVNode(toDisplayString(page.url), 1)
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
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { start: "" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-web")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createTextVNode(" Pages les plus visitées ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VList, null, {
                                                                          default: withCtx(() => [
                                                                            (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                              return openBlock(), createBlock(VListItem, {
                                                                                key: page.url
                                                                              }, {
                                                                                append: withCtx(() => [
                                                                                  createVNode(VChip, {
                                                                                    size: "small",
                                                                                    color: "primary"
                                                                                  }, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                    ]),
                                                                                    _: 2
                                                                                  }, 1024)
                                                                                ]),
                                                                                default: withCtx(() => [
                                                                                  createVNode(VListItemTitle, null, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(toDisplayString(page.title), 1)
                                                                                    ]),
                                                                                    _: 2
                                                                                  }, 1024),
                                                                                  createVNode(VListItemSubtitle, null, {
                                                                                    default: withCtx(() => [
                                                                                      createTextVNode(toDisplayString(page.url), 1)
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
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, { start: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-web")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createTextVNode(" Pages les plus visitées ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VList, null, {
                                                                        default: withCtx(() => [
                                                                          (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                            return openBlock(), createBlock(VListItem, {
                                                                              key: page.url
                                                                            }, {
                                                                              append: withCtx(() => [
                                                                                createVNode(VChip, {
                                                                                  size: "small",
                                                                                  color: "primary"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1024)
                                                                              ]),
                                                                              default: withCtx(() => [
                                                                                createVNode(VListItemTitle, null, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(toDisplayString(page.title), 1)
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1024),
                                                                                createVNode(VListItemSubtitle, null, {
                                                                                  default: withCtx(() => [
                                                                                    createTextVNode(toDisplayString(page.url), 1)
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
                                                      }, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VIcon, { start: "" }, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`mdi-devices`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode("mdi-devices")
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                        _push12(` Appareils utilisés `);
                                                                      } else {
                                                                        return [
                                                                          createVNode(VIcon, { start: "" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-devices")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createTextVNode(" Appareils utilisés ")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(unref(VChart), {
                                                                          class: "chart",
                                                                          option: devicesChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, _parent12, _scopeId11));
                                                                      } else {
                                                                        return [
                                                                          createVNode(unref(VChart), {
                                                                            class: "chart",
                                                                            option: devicesChartOption.value,
                                                                            autoresize: ""
                                                                          }, null, 8, ["option"])
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { start: "" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-devices")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createTextVNode(" Appareils utilisés ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(unref(VChart), {
                                                                          class: "chart",
                                                                          option: devicesChartOption.value,
                                                                          autoresize: ""
                                                                        }, null, 8, ["option"])
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, { start: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-devices")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createTextVNode(" Appareils utilisés ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(unref(VChart), {
                                                                        class: "chart",
                                                                        option: devicesChartOption.value,
                                                                        autoresize: ""
                                                                      }, null, 8, ["option"])
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
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "6"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { start: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-web")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createTextVNode(" Pages les plus visitées ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VList, null, {
                                                                      default: withCtx(() => [
                                                                        (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                          return openBlock(), createBlock(VListItem, {
                                                                            key: page.url
                                                                          }, {
                                                                            append: withCtx(() => [
                                                                              createVNode(VChip, {
                                                                                size: "small",
                                                                                color: "primary"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                                ]),
                                                                                _: 2
                                                                              }, 1024)
                                                                            ]),
                                                                            default: withCtx(() => [
                                                                              createVNode(VListItemTitle, null, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(page.title), 1)
                                                                                ]),
                                                                                _: 2
                                                                              }, 1024),
                                                                              createVNode(VListItemSubtitle, null, {
                                                                                default: withCtx(() => [
                                                                                  createTextVNode(toDisplayString(page.url), 1)
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
                                                        }),
                                                        createVNode(VCol, {
                                                          cols: "12",
                                                          md: "6"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { start: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-devices")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createTextVNode(" Appareils utilisés ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(unref(VChart), {
                                                                      class: "chart",
                                                                      option: devicesChartOption.value,
                                                                      autoresize: ""
                                                                    }, null, 8, ["option"])
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
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VRow, null, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCol, { cols: "12" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VIcon, { start: "" }, {
                                                                          default: withCtx((_12, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(`mdi-account-group`);
                                                                            } else {
                                                                              return [
                                                                                createTextVNode("mdi-account-group")
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                        _push12(` Comportement des utilisateurs `);
                                                                      } else {
                                                                        return [
                                                                          createVNode(VIcon, { start: "" }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode("mdi-account-group")
                                                                            ]),
                                                                            _: 1
                                                                          }),
                                                                          createTextVNode(" Comportement des utilisateurs ")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                  _push11(ssrRenderComponent(VCardText, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(ssrRenderComponent(VDataTable, {
                                                                          headers: behaviorHeaders,
                                                                          items: analyticsData.value.userBehavior,
                                                                          "items-per-page": 5,
                                                                          class: "elevation-1"
                                                                        }, {
                                                                          "item.percentage": withCtx(({ item }, _push13, _parent13, _scopeId12) => {
                                                                            if (_push13) {
                                                                              _push13(ssrRenderComponent(VProgressLinear, {
                                                                                "model-value": item.percentage,
                                                                                color: getBehaviorColor(item.type),
                                                                                height: "20"
                                                                              }, {
                                                                                default: withCtx((_12, _push14, _parent14, _scopeId13) => {
                                                                                  if (_push14) {
                                                                                    _push14(`<strong data-v-c182631d${_scopeId13}>${ssrInterpolate(item.percentage)}%</strong>`);
                                                                                  } else {
                                                                                    return [
                                                                                      createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                                    ];
                                                                                  }
                                                                                }),
                                                                                _: 2
                                                                              }, _parent13, _scopeId12));
                                                                            } else {
                                                                              return [
                                                                                createVNode(VProgressLinear, {
                                                                                  "model-value": item.percentage,
                                                                                  color: getBehaviorColor(item.type),
                                                                                  height: "20"
                                                                                }, {
                                                                                  default: withCtx(() => [
                                                                                    createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                                  ]),
                                                                                  _: 2
                                                                                }, 1032, ["model-value", "color"])
                                                                              ];
                                                                            }
                                                                          }),
                                                                          _: 1
                                                                        }, _parent12, _scopeId11));
                                                                      } else {
                                                                        return [
                                                                          createVNode(VDataTable, {
                                                                            headers: behaviorHeaders,
                                                                            items: analyticsData.value.userBehavior,
                                                                            "items-per-page": 5,
                                                                            class: "elevation-1"
                                                                          }, {
                                                                            "item.percentage": withCtx(({ item }) => [
                                                                              createVNode(VProgressLinear, {
                                                                                "model-value": item.percentage,
                                                                                color: getBehaviorColor(item.type),
                                                                                height: "20"
                                                                              }, {
                                                                                default: withCtx(() => [
                                                                                  createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                                ]),
                                                                                _: 2
                                                                              }, 1032, ["model-value", "color"])
                                                                            ]),
                                                                            _: 1
                                                                          }, 8, ["items"])
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VIcon, { start: "" }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode("mdi-account-group")
                                                                          ]),
                                                                          _: 1
                                                                        }),
                                                                        createTextVNode(" Comportement des utilisateurs ")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createVNode(VCardText, null, {
                                                                      default: withCtx(() => [
                                                                        createVNode(VDataTable, {
                                                                          headers: behaviorHeaders,
                                                                          items: analyticsData.value.userBehavior,
                                                                          "items-per-page": 5,
                                                                          class: "elevation-1"
                                                                        }, {
                                                                          "item.percentage": withCtx(({ item }) => [
                                                                            createVNode(VProgressLinear, {
                                                                              "model-value": item.percentage,
                                                                              color: getBehaviorColor(item.type),
                                                                              height: "20"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                              ]),
                                                                              _: 2
                                                                            }, 1032, ["model-value", "color"])
                                                                          ]),
                                                                          _: 1
                                                                        }, 8, ["items"])
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                          } else {
                                                            return [
                                                              createVNode(VCard, {
                                                                variant: "outlined",
                                                                class: "mb-4"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VIcon, { start: "" }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode("mdi-account-group")
                                                                        ]),
                                                                        _: 1
                                                                      }),
                                                                      createTextVNode(" Comportement des utilisateurs ")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createVNode(VCardText, null, {
                                                                    default: withCtx(() => [
                                                                      createVNode(VDataTable, {
                                                                        headers: behaviorHeaders,
                                                                        items: analyticsData.value.userBehavior,
                                                                        "items-per-page": 5,
                                                                        class: "elevation-1"
                                                                      }, {
                                                                        "item.percentage": withCtx(({ item }) => [
                                                                          createVNode(VProgressLinear, {
                                                                            "model-value": item.percentage,
                                                                            color: getBehaviorColor(item.type),
                                                                            height: "20"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1032, ["model-value", "color"])
                                                                        ]),
                                                                        _: 1
                                                                      }, 8, ["items"])
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
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCol, { cols: "12" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCard, {
                                                              variant: "outlined",
                                                              class: "mb-4"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VIcon, { start: "" }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-account-group")
                                                                      ]),
                                                                      _: 1
                                                                    }),
                                                                    createTextVNode(" Comportement des utilisateurs ")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createVNode(VCardText, null, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VDataTable, {
                                                                      headers: behaviorHeaders,
                                                                      items: analyticsData.value.userBehavior,
                                                                      "items-per-page": 5,
                                                                      class: "elevation-1"
                                                                    }, {
                                                                      "item.percentage": withCtx(({ item }) => [
                                                                        createVNode(VProgressLinear, {
                                                                          "model-value": item.percentage,
                                                                          color: getBehaviorColor(item.type),
                                                                          height: "20"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1032, ["model-value", "color"])
                                                                      ]),
                                                                      _: 1
                                                                    }, 8, ["items"])
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
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "3"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                  createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                  createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                        md: "3"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                  createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                  createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                        md: "3"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                  createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                  createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                        md: "3"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                  createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                  createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "8"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { start: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-chart-line")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createTextVNode(" Trafic par jour ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(VChart), {
                                                                    class: "chart",
                                                                    option: trafficChartOption.value,
                                                                    autoresize: ""
                                                                  }, null, 8, ["option"])
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
                                                        md: "4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { start: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-map-marker")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createTextVNode(" Répartition géographique ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(VChart), {
                                                                    class: "chart",
                                                                    option: geoChartOption.value,
                                                                    autoresize: ""
                                                                  }, null, 8, ["option"])
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
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { start: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-web")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createTextVNode(" Pages les plus visitées ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(VList, null, {
                                                                    default: withCtx(() => [
                                                                      (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                        return openBlock(), createBlock(VListItem, {
                                                                          key: page.url
                                                                        }, {
                                                                          append: withCtx(() => [
                                                                            createVNode(VChip, {
                                                                              size: "small",
                                                                              color: "primary"
                                                                            }, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                              ]),
                                                                              _: 2
                                                                            }, 1024)
                                                                          ]),
                                                                          default: withCtx(() => [
                                                                            createVNode(VListItemTitle, null, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(page.title), 1)
                                                                              ]),
                                                                              _: 2
                                                                            }, 1024),
                                                                            createVNode(VListItemSubtitle, null, {
                                                                              default: withCtx(() => [
                                                                                createTextVNode(toDisplayString(page.url), 1)
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
                                                      }),
                                                      createVNode(VCol, {
                                                        cols: "12",
                                                        md: "6"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { start: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-devices")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createTextVNode(" Appareils utilisés ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(unref(VChart), {
                                                                    class: "chart",
                                                                    option: devicesChartOption.value,
                                                                    autoresize: ""
                                                                  }, null, 8, ["option"])
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
                                                  createVNode(VRow, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VCol, { cols: "12" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCard, {
                                                            variant: "outlined",
                                                            class: "mb-4"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VIcon, { start: "" }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-account-group")
                                                                    ]),
                                                                    _: 1
                                                                  }),
                                                                  createTextVNode(" Comportement des utilisateurs ")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VCardText, null, {
                                                                default: withCtx(() => [
                                                                  createVNode(VDataTable, {
                                                                    headers: behaviorHeaders,
                                                                    items: analyticsData.value.userBehavior,
                                                                    "items-per-page": 5,
                                                                    class: "elevation-1"
                                                                  }, {
                                                                    "item.percentage": withCtx(({ item }) => [
                                                                      createVNode(VProgressLinear, {
                                                                        "model-value": item.percentage,
                                                                        color: getBehaviorColor(item.type),
                                                                        height: "20"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1032, ["model-value", "color"])
                                                                    ]),
                                                                    _: 1
                                                                  }, 8, ["items"])
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
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  color: "white",
                                                  class: "mr-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-chart-box")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("span", null, "Tableau de bord analytique"),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  color: "white",
                                                  variant: "text",
                                                  onClick: refreshData,
                                                  loading: loading.value
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-refresh")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" Rafraîchir ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["loading"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCardText, { class: "pa-4" }, {
                                              default: withCtx(() => [
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                                createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                                createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                      md: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                                createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                                createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                      md: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                                createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                                createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                      md: "3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                                createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                                createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "8"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { start: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-chart-line")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createTextVNode(" Trafic par jour ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(VChart), {
                                                                  class: "chart",
                                                                  option: trafficChartOption.value,
                                                                  autoresize: ""
                                                                }, null, 8, ["option"])
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
                                                      md: "4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { start: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-map-marker")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createTextVNode(" Répartition géographique ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(VChart), {
                                                                  class: "chart",
                                                                  option: geoChartOption.value,
                                                                  autoresize: ""
                                                                }, null, 8, ["option"])
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
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "6"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { start: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-web")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createTextVNode(" Pages les plus visitées ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode(VList, null, {
                                                                  default: withCtx(() => [
                                                                    (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                      return openBlock(), createBlock(VListItem, {
                                                                        key: page.url
                                                                      }, {
                                                                        append: withCtx(() => [
                                                                          createVNode(VChip, {
                                                                            size: "small",
                                                                            color: "primary"
                                                                          }, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024)
                                                                        ]),
                                                                        default: withCtx(() => [
                                                                          createVNode(VListItemTitle, null, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(page.title), 1)
                                                                            ]),
                                                                            _: 2
                                                                          }, 1024),
                                                                          createVNode(VListItemSubtitle, null, {
                                                                            default: withCtx(() => [
                                                                              createTextVNode(toDisplayString(page.url), 1)
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
                                                    }),
                                                    createVNode(VCol, {
                                                      cols: "12",
                                                      md: "6"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { start: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-devices")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createTextVNode(" Appareils utilisés ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode(unref(VChart), {
                                                                  class: "chart",
                                                                  option: devicesChartOption.value,
                                                                  autoresize: ""
                                                                }, null, 8, ["option"])
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
                                                createVNode(VRow, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VCol, { cols: "12" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCard, {
                                                          variant: "outlined",
                                                          class: "mb-4"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                              default: withCtx(() => [
                                                                createVNode(VIcon, { start: "" }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-account-group")
                                                                  ]),
                                                                  _: 1
                                                                }),
                                                                createTextVNode(" Comportement des utilisateurs ")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VCardText, null, {
                                                              default: withCtx(() => [
                                                                createVNode(VDataTable, {
                                                                  headers: behaviorHeaders,
                                                                  items: analyticsData.value.userBehavior,
                                                                  "items-per-page": 5,
                                                                  class: "elevation-1"
                                                                }, {
                                                                  "item.percentage": withCtx(({ item }) => [
                                                                    createVNode(VProgressLinear, {
                                                                      "model-value": item.percentage,
                                                                      color: getBehaviorColor(item.type),
                                                                      height: "20"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1032, ["model-value", "color"])
                                                                  ]),
                                                                  _: 1
                                                                }, 8, ["items"])
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
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCard, {
                                        class: "rounded-lg",
                                        elevation: "2"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                color: "white",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-chart-box")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("span", null, "Tableau de bord analytique"),
                                              createVNode(VSpacer),
                                              createVNode(VBtn, {
                                                color: "white",
                                                variant: "text",
                                                onClick: refreshData,
                                                loading: loading.value
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-refresh")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Rafraîchir ")
                                                ]),
                                                _: 1
                                              }, 8, ["loading"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCardText, { class: "pa-4" }, {
                                            default: withCtx(() => [
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                              createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                              createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                    md: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                              createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                              createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                    md: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                              createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                              createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                    md: "3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                              createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                              createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "8"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-chart-line")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Trafic par jour ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(VChart), {
                                                                class: "chart",
                                                                option: trafficChartOption.value,
                                                                autoresize: ""
                                                              }, null, 8, ["option"])
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
                                                    md: "4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-map-marker")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Répartition géographique ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(VChart), {
                                                                class: "chart",
                                                                option: geoChartOption.value,
                                                                autoresize: ""
                                                              }, null, 8, ["option"])
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
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "6"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-web")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Pages les plus visitées ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VList, null, {
                                                                default: withCtx(() => [
                                                                  (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                    return openBlock(), createBlock(VListItem, {
                                                                      key: page.url
                                                                    }, {
                                                                      append: withCtx(() => [
                                                                        createVNode(VChip, {
                                                                          size: "small",
                                                                          color: "primary"
                                                                        }, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024)
                                                                      ]),
                                                                      default: withCtx(() => [
                                                                        createVNode(VListItemTitle, null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(page.title), 1)
                                                                          ]),
                                                                          _: 2
                                                                        }, 1024),
                                                                        createVNode(VListItemSubtitle, null, {
                                                                          default: withCtx(() => [
                                                                            createTextVNode(toDisplayString(page.url), 1)
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
                                                  }),
                                                  createVNode(VCol, {
                                                    cols: "12",
                                                    md: "6"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-devices")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Appareils utilisés ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(unref(VChart), {
                                                                class: "chart",
                                                                option: devicesChartOption.value,
                                                                autoresize: ""
                                                              }, null, 8, ["option"])
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
                                              createVNode(VRow, null, {
                                                default: withCtx(() => [
                                                  createVNode(VCol, { cols: "12" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCard, {
                                                        variant: "outlined",
                                                        class: "mb-4"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                            default: withCtx(() => [
                                                              createVNode(VIcon, { start: "" }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-account-group")
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createTextVNode(" Comportement des utilisateurs ")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VCardText, null, {
                                                            default: withCtx(() => [
                                                              createVNode(VDataTable, {
                                                                headers: behaviorHeaders,
                                                                items: analyticsData.value.userBehavior,
                                                                "items-per-page": 5,
                                                                class: "elevation-1"
                                                              }, {
                                                                "item.percentage": withCtx(({ item }) => [
                                                                  createVNode(VProgressLinear, {
                                                                    "model-value": item.percentage,
                                                                    color: getBehaviorColor(item.type),
                                                                    height: "20"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1032, ["model-value", "color"])
                                                                ]),
                                                                _: 1
                                                              }, 8, ["items"])
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VCard, {
                                      class: "rounded-lg",
                                      elevation: "2"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-chart-box")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("span", null, "Tableau de bord analytique"),
                                            createVNode(VSpacer),
                                            createVNode(VBtn, {
                                              color: "white",
                                              variant: "text",
                                              onClick: refreshData,
                                              loading: loading.value
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-refresh")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Rafraîchir ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCardText, { class: "pa-4" }, {
                                          default: withCtx(() => [
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                            createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                            createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                  md: "3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                            createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                            createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                  md: "3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                            createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                            createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                  md: "3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                            createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                            createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "8"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-chart-line")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Trafic par jour ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(VChart), {
                                                              class: "chart",
                                                              option: trafficChartOption.value,
                                                              autoresize: ""
                                                            }, null, 8, ["option"])
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
                                                  md: "4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-map-marker")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Répartition géographique ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(VChart), {
                                                              class: "chart",
                                                              option: geoChartOption.value,
                                                              autoresize: ""
                                                            }, null, 8, ["option"])
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
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "6"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-web")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Pages les plus visitées ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VList, null, {
                                                              default: withCtx(() => [
                                                                (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                  return openBlock(), createBlock(VListItem, {
                                                                    key: page.url
                                                                  }, {
                                                                    append: withCtx(() => [
                                                                      createVNode(VChip, {
                                                                        size: "small",
                                                                        color: "primary"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024)
                                                                    ]),
                                                                    default: withCtx(() => [
                                                                      createVNode(VListItemTitle, null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(page.title), 1)
                                                                        ]),
                                                                        _: 2
                                                                      }, 1024),
                                                                      createVNode(VListItemSubtitle, null, {
                                                                        default: withCtx(() => [
                                                                          createTextVNode(toDisplayString(page.url), 1)
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
                                                }),
                                                createVNode(VCol, {
                                                  cols: "12",
                                                  md: "6"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-devices")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Appareils utilisés ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(unref(VChart), {
                                                              class: "chart",
                                                              option: devicesChartOption.value,
                                                              autoresize: ""
                                                            }, null, 8, ["option"])
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
                                            createVNode(VRow, null, {
                                              default: withCtx(() => [
                                                createVNode(VCol, { cols: "12" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCard, {
                                                      variant: "outlined",
                                                      class: "mb-4"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                          default: withCtx(() => [
                                                            createVNode(VIcon, { start: "" }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-account-group")
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createTextVNode(" Comportement des utilisateurs ")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VCardText, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VDataTable, {
                                                              headers: behaviorHeaders,
                                                              items: analyticsData.value.userBehavior,
                                                              "items-per-page": 5,
                                                              class: "elevation-1"
                                                            }, {
                                                              "item.percentage": withCtx(({ item }) => [
                                                                createVNode(VProgressLinear, {
                                                                  "model-value": item.percentage,
                                                                  color: getBehaviorColor(item.type),
                                                                  height: "20"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1032, ["model-value", "color"])
                                                              ]),
                                                              _: 1
                                                            }, 8, ["items"])
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
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(VCard, {
                                    class: "rounded-lg",
                                    elevation: "2"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            color: "white",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-chart-box")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("span", null, "Tableau de bord analytique"),
                                          createVNode(VSpacer),
                                          createVNode(VBtn, {
                                            color: "white",
                                            variant: "text",
                                            onClick: refreshData,
                                            loading: loading.value
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-refresh")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Rafraîchir ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                          createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                                md: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                          createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                                md: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                          createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                                md: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                          createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                          createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "8"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-chart-line")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Trafic par jour ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(VChart), {
                                                            class: "chart",
                                                            option: trafficChartOption.value,
                                                            autoresize: ""
                                                          }, null, 8, ["option"])
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
                                                md: "4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-map-marker")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Répartition géographique ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(VChart), {
                                                            class: "chart",
                                                            option: geoChartOption.value,
                                                            autoresize: ""
                                                          }, null, 8, ["option"])
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
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-web")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Pages les plus visitées ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VList, null, {
                                                            default: withCtx(() => [
                                                              (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                                return openBlock(), createBlock(VListItem, {
                                                                  key: page.url
                                                                }, {
                                                                  append: withCtx(() => [
                                                                    createVNode(VChip, {
                                                                      size: "small",
                                                                      color: "primary"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024)
                                                                  ]),
                                                                  default: withCtx(() => [
                                                                    createVNode(VListItemTitle, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(page.title), 1)
                                                                      ]),
                                                                      _: 2
                                                                    }, 1024),
                                                                    createVNode(VListItemSubtitle, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode(toDisplayString(page.url), 1)
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
                                              }),
                                              createVNode(VCol, {
                                                cols: "12",
                                                md: "6"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-devices")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Appareils utilisés ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(VChart), {
                                                            class: "chart",
                                                            option: devicesChartOption.value,
                                                            autoresize: ""
                                                          }, null, 8, ["option"])
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
                                          createVNode(VRow, null, {
                                            default: withCtx(() => [
                                              createVNode(VCol, { cols: "12" }, {
                                                default: withCtx(() => [
                                                  createVNode(VCard, {
                                                    variant: "outlined",
                                                    class: "mb-4"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                        default: withCtx(() => [
                                                          createVNode(VIcon, { start: "" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-account-group")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createTextVNode(" Comportement des utilisateurs ")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VCardText, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VDataTable, {
                                                            headers: behaviorHeaders,
                                                            items: analyticsData.value.userBehavior,
                                                            "items-per-page": 5,
                                                            class: "elevation-1"
                                                          }, {
                                                            "item.percentage": withCtx(({ item }) => [
                                                              createVNode(VProgressLinear, {
                                                                "model-value": item.percentage,
                                                                color: getBehaviorColor(item.type),
                                                                height: "20"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                                ]),
                                                                _: 2
                                                              }, 1032, ["model-value", "color"])
                                                            ]),
                                                            _: 1
                                                          }, 8, ["items"])
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
                    createVNode(VContainer, {
                      fluid: "",
                      class: "pa-6"
                    }, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VCard, {
                                  class: "rounded-lg",
                                  elevation: "2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          color: "white",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-chart-box")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("span", null, "Tableau de bord analytique"),
                                        createVNode(VSpacer),
                                        createVNode(VBtn, {
                                          color: "white",
                                          variant: "text",
                                          onClick: refreshData,
                                          loading: loading.value
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, null, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-refresh")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Rafraîchir ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-4" }, {
                                      default: withCtx(() => [
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                        createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                              md: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                        createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                              md: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                        createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                              md: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                        createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                        createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "8"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-chart-line")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Trafic par jour ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(VChart), {
                                                          class: "chart",
                                                          option: trafficChartOption.value,
                                                          autoresize: ""
                                                        }, null, 8, ["option"])
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
                                              md: "4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-map-marker")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Répartition géographique ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(VChart), {
                                                          class: "chart",
                                                          option: geoChartOption.value,
                                                          autoresize: ""
                                                        }, null, 8, ["option"])
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
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-web")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Pages les plus visitées ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VList, null, {
                                                          default: withCtx(() => [
                                                            (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                              return openBlock(), createBlock(VListItem, {
                                                                key: page.url
                                                              }, {
                                                                append: withCtx(() => [
                                                                  createVNode(VChip, {
                                                                    size: "small",
                                                                    color: "primary"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024)
                                                                ]),
                                                                default: withCtx(() => [
                                                                  createVNode(VListItemTitle, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(page.title), 1)
                                                                    ]),
                                                                    _: 2
                                                                  }, 1024),
                                                                  createVNode(VListItemSubtitle, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(toDisplayString(page.url), 1)
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
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-devices")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Appareils utilisés ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(VChart), {
                                                          class: "chart",
                                                          option: devicesChartOption.value,
                                                          autoresize: ""
                                                        }, null, 8, ["option"])
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
                                        createVNode(VRow, null, {
                                          default: withCtx(() => [
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VCard, {
                                                  variant: "outlined",
                                                  class: "mb-4"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                      default: withCtx(() => [
                                                        createVNode(VIcon, { start: "" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-account-group")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Comportement des utilisateurs ")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VCardText, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VDataTable, {
                                                          headers: behaviorHeaders,
                                                          items: analyticsData.value.userBehavior,
                                                          "items-per-page": 5,
                                                          class: "elevation-1"
                                                        }, {
                                                          "item.percentage": withCtx(({ item }) => [
                                                            createVNode(VProgressLinear, {
                                                              "model-value": item.percentage,
                                                              color: getBehaviorColor(item.type),
                                                              height: "20"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                              ]),
                                                              _: 2
                                                            }, 1032, ["model-value", "color"])
                                                          ]),
                                                          _: 1
                                                        }, 8, ["items"])
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
                  createVNode(VContainer, {
                    fluid: "",
                    class: "pa-6"
                  }, {
                    default: withCtx(() => [
                      createVNode(VRow, null, {
                        default: withCtx(() => [
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VCard, {
                                class: "rounded-lg",
                                elevation: "2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        color: "white",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-chart-box")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("span", null, "Tableau de bord analytique"),
                                      createVNode(VSpacer),
                                      createVNode(VBtn, {
                                        color: "white",
                                        variant: "text",
                                        onClick: refreshData,
                                        loading: loading.value
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, null, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-refresh")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Rafraîchir ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-h6 mb-2" }, "Visiteurs uniques"),
                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.uniqueVisitors), 1),
                                                      createVNode("div", { class: "text-caption text-grey" }, " +" + toDisplayString(analyticsData.value.visitorGrowth) + "% vs mois dernier ", 1)
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
                                            md: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-h6 mb-2" }, "Pages vues"),
                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.pageViews), 1),
                                                      createVNode("div", { class: "text-caption text-grey" }, " Moyenne: " + toDisplayString(analyticsData.value.avgPagesPerVisit), 1)
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
                                            md: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-h6 mb-2" }, "Temps moyen"),
                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.avgTimeOnSite) + "s", 1),
                                                      createVNode("div", { class: "text-caption text-grey" }, " Taux de rebond: " + toDisplayString(analyticsData.value.bounceRate) + "% ", 1)
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
                                            md: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-h6 mb-2" }, "Taux de conversion"),
                                                      createVNode("div", { class: "text-h4" }, toDisplayString(analyticsData.value.conversionRate) + "%", 1),
                                                      createVNode("div", { class: "text-caption text-grey" }, " Objectif: " + toDisplayString(analyticsData.value.conversionGoal), 1)
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
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "8"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-chart-line")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Trafic par jour ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(VChart), {
                                                        class: "chart",
                                                        option: trafficChartOption.value,
                                                        autoresize: ""
                                                      }, null, 8, ["option"])
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
                                            md: "4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-map-marker")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Répartition géographique ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(VChart), {
                                                        class: "chart",
                                                        option: geoChartOption.value,
                                                        autoresize: ""
                                                      }, null, 8, ["option"])
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
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-web")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Pages les plus visitées ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VList, null, {
                                                        default: withCtx(() => [
                                                          (openBlock(true), createBlock(Fragment, null, renderList(analyticsData.value.topPages, (page) => {
                                                            return openBlock(), createBlock(VListItem, {
                                                              key: page.url
                                                            }, {
                                                              append: withCtx(() => [
                                                                createVNode(VChip, {
                                                                  size: "small",
                                                                  color: "primary"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(page.views) + " vues", 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024)
                                                              ]),
                                                              default: withCtx(() => [
                                                                createVNode(VListItemTitle, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(page.title), 1)
                                                                  ]),
                                                                  _: 2
                                                                }, 1024),
                                                                createVNode(VListItemSubtitle, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode(toDisplayString(page.url), 1)
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
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-devices")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Appareils utilisés ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(VChart), {
                                                        class: "chart",
                                                        option: devicesChartOption.value,
                                                        autoresize: ""
                                                      }, null, 8, ["option"])
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
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VCard, {
                                                variant: "outlined",
                                                class: "mb-4"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardTitle, { class: "text-subtitle-1" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, { start: "" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-account-group")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Comportement des utilisateurs ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VCardText, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VDataTable, {
                                                        headers: behaviorHeaders,
                                                        items: analyticsData.value.userBehavior,
                                                        "items-per-page": 5,
                                                        class: "elevation-1"
                                                      }, {
                                                        "item.percentage": withCtx(({ item }) => [
                                                          createVNode(VProgressLinear, {
                                                            "model-value": item.percentage,
                                                            color: getBehaviorColor(item.type),
                                                            height: "20"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("strong", null, toDisplayString(item.percentage) + "%", 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["model-value", "color"])
                                                        ]),
                                                        _: 1
                                                      }, 8, ["items"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const analytics = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c182631d"]]);

export { analytics as default };
//# sourceMappingURL=analytics.vue.mjs.map
