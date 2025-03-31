import { shallowRef, ref, computed, watch, createVNode, mergeProps, defineComponent as defineComponent$1, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { bQ as defineComponent, p as propsFactory, j as clamp, J as convertToUnit, I as useResizeObserver, s as useRender, bR as getEventCoordinates, A as makeComponentProps, bS as HexToHSV, bT as HSVtoHex, bU as HSLtoHSV, bV as HSVtoHSL, bW as RGBtoHSV, bX as HSVtoRGB, bY as has, e as VBtn, bZ as SUPPORTS_EYE_DROPPER, b_ as HSVtoCSS, b$ as parseColor, c0 as RGBtoCSS, a$ as deepEqual, g as VIcon, c1 as getContrast, l as useProxiedModel, c2 as consoleWarn, w as useRtl, O as provideDefaults, az as omit, f as VCard, $ as VCardTitle, d as VSpacer, Y as VCardText, h as VDivider, bp as VSwitch, T as VList, U as VListItem, bo as VBtnToggle, a1 as VSnackbar, S as useUserStore, _ as _export_sfc, V as VApp, W as VListItemTitle, br as VDialog, a0 as VCardActions } from './server.mjs';
import { V as VContainer } from './VContainer.mjs';
import { V as VRow, a as VCol } from './VCol.mjs';
import { V as VTooltip } from './VTooltip.mjs';
import { V as VTabs, a as VTab } from './VTabs.mjs';
import { V as VForm } from './VForm.mjs';
import { V as VTextField } from './VTextField.mjs';
import { V as VSelect } from './VSelect.mjs';
import { V as VWindow, a as VWindowItem } from './VWindowItem.mjs';
import { V as VTextarea } from './VTextarea.mjs';
import { V as VSlider } from './VSlider.mjs';
import { V as VSheet, m as makeVSheetProps } from './VSheet.mjs';
import { V as VToolbar, b as VToolbarTitle } from './VToolbar.mjs';
import { u as useHead } from './v3.mjs';
import { V as VAppBar } from './VAppBar.mjs';
import { V as VMain } from './VMain.mjs';
import { V as VDataTable } from './VDataTable.mjs';
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
import 'deep-pick-omit';
import './VCheckboxBtn.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './VTable.mjs';

const emailTemplates = {
  welcome: {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to our newsletter",
    preheader: "Stay informed with our latest news and updates",
    headline: "Welcome to our newsletter!",
    mainContent: "We are delighted to have you as a subscriber. You will now receive our best news and offers directly in your inbox.\n\nHere's what you can expect from our newsletter:\n- Regular updates on our products and services\n- Exclusive tips and advice\n- Special offers reserved for our subscribers",
    ctaText: "Discover our services",
    ctaUrl: "https://example.com",
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8"
    },
    font: "Arial",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "DevUnity",
    companyAddress: "86000 Poitiers, France"
  },
  update: {
    id: "update",
    name: "Product Update",
    subject: "New features available",
    preheader: "Discover our latest improvements and updates",
    headline: "Discover our new features!",
    mainContent: "We are pleased to announce the launch of new features that will improve your user experience.\n\nHere are the main new features:\n- Redesigned interface for greater simplicity\n- Improved performance for faster loading times\n- New customization options\n\nLog in now to discover them!",
    ctaText: "Discover the new features",
    ctaUrl: "https://example.com/updates",
    colors: {
      primary: "#0891B2",
      secondary: "#06B6D4"
    },
    font: "Helvetica",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "SaaS Company Inc.",
    companyAddress: "123 Innovation Street, 75000 Paris, France"
  },
  promo: {
    id: "promo",
    name: "Special Promotion",
    subject: "Special offer: 25% off our plans",
    preheader: "Limited time offer exclusively for our subscribers",
    headline: "Exclusive offer for our subscribers!",
    mainContent: "Get 25% off all our premium plans for a limited time.\n\nThis offer is reserved for our loyal subscribers and expires in 7 days. Use the promo code NEWSLETTER25 when ordering.",
    ctaText: "Take advantage of the offer",
    ctaUrl: "https://example.com/offer",
    colors: {
      primary: "#D97706",
      secondary: "#F59E0B"
    },
    font: "Arial",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "SaaS Company Inc.",
    companyAddress: "123 Innovation Street, 75000 Paris, France"
  },
  newsletter: {
    id: "newsletter",
    name: "Monthly Newsletter",
    subject: "Monthly newsletter - {{month}} {{year}}",
    preheader: "All the latest news from our company",
    headline: "This month's news",
    mainContent: "Dear subscribers,\n\nHere are the main news items this month:\n\n1. Launch of our new real-time collaboration feature\n2. Exclusive interview with our development team\n3. Tips for optimizing your use of our platform\n\nWe thank you for your loyalty and remain open to any suggestions.",
    ctaText: "Read the full article",
    ctaUrl: "https://example.com/blog",
    colors: {
      primary: "#7C3AED",
      secondary: "#8B5CF6"
    },
    font: "Georgia",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "SaaS Company Inc.",
    companyAddress: "123 Innovation Street, 75000 Paris, France"
  },
  thankYou: {
    id: "thankYou",
    name: "Thank You Email",
    subject: "Thank you for your subscription",
    preheader: "We appreciate your support",
    headline: "Thank you for your subscription!",
    mainContent: "We wanted to personally thank you for subscribing to our premium plan.\n\nYour support helps us continue to develop and improve our services. You now have access to all premium features, including:\n\n- Advanced analytics\n- Priority customer support\n- Unlimited storage\n- Custom integrations\n\nIf you have any questions or need assistance, our support team is here to help.",
    ctaText: "Access your account",
    ctaUrl: "https://example.com/account",
    colors: {
      primary: "#059669",
      secondary: "#10B981"
    },
    font: "Tahoma",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "SaaS Company Inc.",
    companyAddress: "123 Innovation Street, 75000 Paris, France"
  },
  event: {
    id: "event",
    name: "Event Invitation",
    subject: "You're invited to our exclusive webinar",
    preheader: "Join us for an exclusive online event",
    headline: "Join our exclusive webinar!",
    mainContent: 'We are pleased to invite you to our upcoming webinar on "Future Trends in Technology".\n\nDate: October 15, 2023\nTime: 2:00 PM - 3:30 PM (GMT+1)\n\nDuring this session, our experts will discuss:\n\n- Emerging technologies and their impact\n- Industry predictions for the next 5 years\n- How to prepare your business for technological changes\n\nSpaces are limited, so reserve your spot now!',
    ctaText: "Register now",
    ctaUrl: "https://example.com/webinar",
    colors: {
      primary: "#DC2626",
      secondary: "#EF4444"
    },
    font: "Arial",
    darkMode: false,
    logoUrl: "https://via.placeholder.com/150x50?text=Logo",
    companyName: "SaaS Company Inc.",
    companyAddress: "123 Innovation Street, 75000 Paris, France"
  }
};
function getTemplateById(id) {
  return emailTemplates[id] || null;
}
function generateEmailHTML(template) {
  const formattedParagraphs = template.mainContent.split("\n\n").filter((paragraph) => paragraph.trim() !== "").map((p) => `<p>${p}</p>`).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <meta name="description" content="${template.preheader}">
  <style>
    body {
      font-family: ${template.font}, sans-serif;
      margin: 0;
      padding: 0;
      background-color: ${template.darkMode ? "#1a1a1a" : "#f9fafb"};
      color: ${template.darkMode ? "#ffffff" : "#111827"};
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: ${template.darkMode ? "#2a2a2a" : "#ffffff"};
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid ${template.colors.primary};
    }
    .content {
      padding: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: ${template.colors.primary};
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${template.logoUrl}" alt="${template.companyName}" style="max-width: 150px;">
      <h1 style="color: ${template.colors.primary};">${template.headline}</h1>
    </div>
    <div class="content">
      ${formattedParagraphs}
      <center>
        <a href="${template.ctaUrl}" class="button">${template.ctaText}</a>
      </center>
    </div>
    <div class="footer">
      <p>© ${(/* @__PURE__ */ new Date()).getFullYear()} ${template.companyName}. All rights reserved.</p>
      <p>${template.companyAddress}</p>
      <p>To unsubscribe, <a href="#" style="color: ${template.colors.primary};">click here</a>.</p>
    </div>
  </div>
</body>
</html>`;
}
function generateEmailText(template) {
  return `${template.subject}
${template.preheader}

${template.headline}

${template.mainContent}

${template.ctaText}: ${template.ctaUrl}

© ${(/* @__PURE__ */ new Date()).getFullYear()} ${template.companyName}. All rights reserved.
${template.companyAddress}

To unsubscribe, follow this link: [http://localhost:3000/unsubscribe]`;
}
function generateVueEmailTemplate(template) {
  const formattedParagraphs = template.mainContent.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
  return `<template>
  <Head>
    <title>${template.subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Preview>${template.preheader}</Preview>
  </Head>
  <Container>
    <Section>
      <Row>
        <Column>
          <Img src="${template.logoUrl}" alt="${template.companyName}" width="150" />
          <Text :style="{ color: '${template.colors.primary}', fontWeight: 'bold', fontSize: '24px', fontFamily: '${template.font}, sans-serif' }">${template.headline}</Text>
          <Hr :style="{ borderColor: '${template.colors.primary}' }" />
        </Column>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column>
          ${formattedParagraphs.map((p) => `<Text>${p}</Text>`).join("\n          ")}
          <Button :style="{ backgroundColor: '${template.colors.primary}', color: 'white', fontFamily: '${template.font}, sans-serif' }" href="${template.ctaUrl}">
            ${template.ctaText}
          </Button>
        </Column>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column>
          <Hr color="#e5e7eb" />
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            © ${(/* @__PURE__ */ new Date()).getFullYear()} ${template.companyName}. All rights reserved.
          </Text>
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            ${template.companyAddress}
          </Text>
          <Text :style="{ textAlign: 'center', color: '#6b7280', fontSize: '12px', fontFamily: '${template.font}, sans-serif' }">
            To unsubscribe, <Link href="http://localhost:3000/unsubscribe" :style="{ color: '${template.colors.primary}' }">click here</Link>
          </Text>
        </Column>
      </Row>
    </Section>
  </Container>
</template>`;
}

const makeVColorPickerCanvasProps = propsFactory({
  color: {
    type: Object
  },
  disabled: Boolean,
  dotSize: {
    type: [Number, String],
    default: 10
  },
  height: {
    type: [Number, String],
    default: 150
  },
  width: {
    type: [Number, String],
    default: 300
  },
  ...makeComponentProps()
}, "VColorPickerCanvas");
const VColorPickerCanvas = defineComponent({
  name: "VColorPickerCanvas",
  props: makeVColorPickerCanvasProps(),
  emits: {
    "update:color": (color) => true,
    "update:position": (hue) => true
  },
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const isInteracting = shallowRef(false);
    const canvasRef = ref();
    const canvasWidth = shallowRef(parseFloat(props.width));
    const canvasHeight = shallowRef(parseFloat(props.height));
    const _dotPosition = ref({
      x: 0,
      y: 0
    });
    const dotPosition = computed({
      get: () => _dotPosition.value,
      set(val) {
        var _a, _b;
        if (!canvasRef.value) return;
        const {
          x,
          y
        } = val;
        _dotPosition.value = val;
        emit("update:color", {
          h: ((_a = props.color) == null ? void 0 : _a.h) ?? 0,
          s: clamp(x, 0, canvasWidth.value) / canvasWidth.value,
          v: 1 - clamp(y, 0, canvasHeight.value) / canvasHeight.value,
          a: ((_b = props.color) == null ? void 0 : _b.a) ?? 1
        });
      }
    });
    const dotStyles = computed(() => {
      const {
        x,
        y
      } = dotPosition.value;
      const radius = parseInt(props.dotSize, 10) / 2;
      return {
        width: convertToUnit(props.dotSize),
        height: convertToUnit(props.dotSize),
        transform: `translate(${convertToUnit(x - radius)}, ${convertToUnit(y - radius)})`
      };
    });
    const {
      resizeRef
    } = useResizeObserver();
    function updateDotPosition(x, y, rect) {
      const {
        left,
        top,
        width,
        height
      } = rect;
      dotPosition.value = {
        x: clamp(x - left, 0, width),
        y: clamp(y - top, 0, height)
      };
    }
    function handleMouseDown(e) {
      if (e.type === "mousedown") {
        e.preventDefault();
      }
      if (props.disabled) return;
      handleMouseMove(e);
      (void 0).addEventListener("mousemove", handleMouseMove);
      (void 0).addEventListener("mouseup", handleMouseUp);
      (void 0).addEventListener("touchmove", handleMouseMove);
      (void 0).addEventListener("touchend", handleMouseUp);
    }
    function handleMouseMove(e) {
      if (props.disabled || !canvasRef.value) return;
      isInteracting.value = true;
      const coords = getEventCoordinates(e);
      updateDotPosition(coords.clientX, coords.clientY, canvasRef.value.getBoundingClientRect());
    }
    function handleMouseUp() {
      (void 0).removeEventListener("mousemove", handleMouseMove);
      (void 0).removeEventListener("mouseup", handleMouseUp);
      (void 0).removeEventListener("touchmove", handleMouseMove);
      (void 0).removeEventListener("touchend", handleMouseUp);
    }
    function updateCanvas() {
      var _a;
      if (!canvasRef.value) return;
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const saturationGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      saturationGradient.addColorStop(0, "hsla(0, 0%, 100%, 1)");
      saturationGradient.addColorStop(1, `hsla(${((_a = props.color) == null ? void 0 : _a.h) ?? 0}, 100%, 50%, 1)`);
      ctx.fillStyle = saturationGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      valueGradient.addColorStop(0, "hsla(0, 0%, 0%, 0)");
      valueGradient.addColorStop(1, "hsla(0, 0%, 0%, 1)");
      ctx.fillStyle = valueGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    watch(() => {
      var _a;
      return (_a = props.color) == null ? void 0 : _a.h;
    }, updateCanvas, {
      immediate: true
    });
    watch(() => [canvasWidth.value, canvasHeight.value], (newVal, oldVal) => {
      updateCanvas();
      _dotPosition.value = {
        x: dotPosition.value.x * newVal[0] / oldVal[0],
        y: dotPosition.value.y * newVal[1] / oldVal[1]
      };
    }, {
      flush: "post"
    });
    watch(() => props.color, () => {
      if (isInteracting.value) {
        isInteracting.value = false;
        return;
      }
      _dotPosition.value = props.color ? {
        x: props.color.s * canvasWidth.value,
        y: (1 - props.color.v) * canvasHeight.value
      } : {
        x: 0,
        y: 0
      };
    }, {
      deep: true,
      immediate: true
    });
    useRender(() => createVNode("div", {
      "ref": resizeRef,
      "class": ["v-color-picker-canvas", props.class],
      "style": props.style,
      "onMousedown": handleMouseDown,
      "onTouchstartPassive": handleMouseDown
    }, [createVNode("canvas", {
      "ref": canvasRef,
      "width": canvasWidth.value,
      "height": canvasHeight.value
    }, null), props.color && createVNode("div", {
      "class": ["v-color-picker-canvas__dot", {
        "v-color-picker-canvas__dot--disabled": props.disabled
      }],
      "style": dotStyles.value
    }, null)]));
    return {};
  }
});

var _a;
function stripAlpha(color, stripAlpha2) {
  if (stripAlpha2) {
    const {
      a,
      ...rest
    } = color;
    return rest;
  }
  return color;
}
function extractColor(color, input) {
  if (input == null || typeof input === "string") {
    const hex2 = HSVtoHex(color);
    if (color.a === 1) return hex2.slice(0, 7);
    else return hex2;
  }
  if (typeof input === "object") {
    let converted;
    if (has(input, ["r", "g", "b"])) converted = HSVtoRGB(color);
    else if (has(input, ["h", "s", "l"])) converted = HSVtoHSL(color);
    else if (has(input, ["h", "s", "v"])) converted = color;
    return stripAlpha(converted, !has(input, ["a"]) && color.a === 1);
  }
  return color;
}
const nullColor = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
};
const rgba = {
  inputProps: {
    type: "number",
    min: 0
  },
  inputs: [{
    label: "R",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.r),
    getColor: (c, v) => ({
      ...c,
      r: Number(v)
    })
  }, {
    label: "G",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.g),
    getColor: (c, v) => ({
      ...c,
      g: Number(v)
    })
  }, {
    label: "B",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.b),
    getColor: (c, v) => ({
      ...c,
      b: Number(v)
    })
  }, {
    label: "A",
    max: 1,
    step: 0.01,
    getValue: (_ref) => {
      let {
        a
      } = _ref;
      return a != null ? Math.round(a * 100) / 100 : 1;
    },
    getColor: (c, v) => ({
      ...c,
      a: Number(v)
    })
  }],
  to: HSVtoRGB,
  from: RGBtoHSV
};
const rgb = {
  ...rgba,
  inputs: (_a = rgba.inputs) == null ? void 0 : _a.slice(0, 3)
};
const hsla = {
  inputProps: {
    type: "number",
    min: 0
  },
  inputs: [{
    label: "H",
    max: 360,
    step: 1,
    getValue: (c) => Math.round(c.h),
    getColor: (c, v) => ({
      ...c,
      h: Number(v)
    })
  }, {
    label: "S",
    max: 1,
    step: 0.01,
    getValue: (c) => Math.round(c.s * 100) / 100,
    getColor: (c, v) => ({
      ...c,
      s: Number(v)
    })
  }, {
    label: "L",
    max: 1,
    step: 0.01,
    getValue: (c) => Math.round(c.l * 100) / 100,
    getColor: (c, v) => ({
      ...c,
      l: Number(v)
    })
  }, {
    label: "A",
    max: 1,
    step: 0.01,
    getValue: (_ref2) => {
      let {
        a
      } = _ref2;
      return a != null ? Math.round(a * 100) / 100 : 1;
    },
    getColor: (c, v) => ({
      ...c,
      a: Number(v)
    })
  }],
  to: HSVtoHSL,
  from: HSLtoHSV
};
const hsl = {
  ...hsla,
  inputs: hsla.inputs.slice(0, 3)
};
const hexa = {
  inputProps: {
    type: "text"
  },
  inputs: [{
    label: "HEXA",
    getValue: (c) => c,
    getColor: (c, v) => v
  }],
  to: HSVtoHex,
  from: HexToHSV
};
const hex = {
  ...hexa,
  inputs: [{
    label: "HEX",
    getValue: (c) => c.slice(0, 7),
    getColor: (c, v) => v
  }]
};
const modes = {
  rgb,
  rgba,
  hsl,
  hsla,
  hex,
  hexa
};

const VColorPickerInput = (_ref) => {
  let {
    label,
    ...rest
  } = _ref;
  return createVNode("div", {
    "class": "v-color-picker-edit__input"
  }, [createVNode("input", rest, null), createVNode("span", null, [label])]);
};
const makeVColorPickerEditProps = propsFactory({
  color: Object,
  disabled: Boolean,
  mode: {
    type: String,
    default: "rgba",
    validator: (v) => Object.keys(modes).includes(v)
  },
  modes: {
    type: Array,
    default: () => Object.keys(modes),
    validator: (v) => Array.isArray(v) && v.every((m) => Object.keys(modes).includes(m))
  },
  ...makeComponentProps()
}, "VColorPickerEdit");
const VColorPickerEdit = defineComponent({
  name: "VColorPickerEdit",
  props: makeVColorPickerEditProps(),
  emits: {
    "update:color": (color) => true,
    "update:mode": (mode) => true
  },
  setup(props, _ref2) {
    let {
      emit
    } = _ref2;
    const enabledModes = computed(() => {
      return props.modes.map((key) => ({
        ...modes[key],
        name: key
      }));
    });
    const inputs = computed(() => {
      var _a;
      const mode = enabledModes.value.find((m) => m.name === props.mode);
      if (!mode) return [];
      const color = props.color ? mode.to(props.color) : null;
      return (_a = mode.inputs) == null ? void 0 : _a.map((_ref3) => {
        let {
          getValue,
          getColor,
          ...inputProps
        } = _ref3;
        return {
          ...mode.inputProps,
          ...inputProps,
          disabled: props.disabled,
          value: color && getValue(color),
          onChange: (e) => {
            const target = e.target;
            if (!target) return;
            emit("update:color", mode.from(getColor(color ?? mode.to(nullColor), target.value)));
          }
        };
      });
    });
    useRender(() => {
      var _a;
      return createVNode("div", {
        "class": ["v-color-picker-edit", props.class],
        "style": props.style
      }, [(_a = inputs.value) == null ? void 0 : _a.map((props2) => createVNode(VColorPickerInput, props2, null)), enabledModes.value.length > 1 && createVNode(VBtn, {
        "icon": "$unfold",
        "size": "x-small",
        "variant": "plain",
        "onClick": () => {
          const mi = enabledModes.value.findIndex((m) => m.name === props.mode);
          emit("update:mode", enabledModes.value[(mi + 1) % enabledModes.value.length].name);
        }
      }, null)]);
    });
    return {};
  }
});

const makeVColorPickerPreviewProps = propsFactory({
  color: {
    type: Object
  },
  disabled: Boolean,
  hideAlpha: Boolean,
  ...makeComponentProps()
}, "VColorPickerPreview");
const VColorPickerPreview = defineComponent({
  name: "VColorPickerPreview",
  props: makeVColorPickerPreviewProps(),
  emits: {
    "update:color": (color) => true
  },
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    new AbortController();
    useRender(() => {
      var _a, _b;
      return createVNode("div", {
        "class": ["v-color-picker-preview", {
          "v-color-picker-preview--hide-alpha": props.hideAlpha
        }, props.class],
        "style": props.style
      }, [SUPPORTS_EYE_DROPPER, createVNode("div", {
        "class": "v-color-picker-preview__dot"
      }, [createVNode("div", {
        "style": {
          background: HSVtoCSS(props.color ?? nullColor)
        }
      }, null)]), createVNode("div", {
        "class": "v-color-picker-preview__sliders"
      }, [createVNode(VSlider, {
        "class": "v-color-picker-preview__track v-color-picker-preview__hue",
        "modelValue": (_a = props.color) == null ? void 0 : _a.h,
        "onUpdate:modelValue": (h) => emit("update:color", {
          ...props.color ?? nullColor,
          h
        }),
        "step": 0,
        "min": 0,
        "max": 360,
        "disabled": props.disabled,
        "thumbSize": 14,
        "trackSize": 8,
        "trackFillColor": "white",
        "hideDetails": true
      }, null), !props.hideAlpha && createVNode(VSlider, {
        "class": "v-color-picker-preview__track v-color-picker-preview__alpha",
        "modelValue": ((_b = props.color) == null ? void 0 : _b.a) ?? 1,
        "onUpdate:modelValue": (a) => emit("update:color", {
          ...props.color ?? nullColor,
          a
        }),
        "step": 1 / 256,
        "min": 0,
        "max": 1,
        "disabled": props.disabled,
        "thumbSize": 14,
        "trackSize": 8,
        "trackFillColor": "white",
        "hideDetails": true
      }, null)])]);
    });
    return {};
  }
});

const red = {
  base: "#f44336",
  lighten5: "#ffebee",
  lighten4: "#ffcdd2",
  lighten3: "#ef9a9a",
  lighten2: "#e57373",
  lighten1: "#ef5350",
  darken1: "#e53935",
  darken2: "#d32f2f",
  darken3: "#c62828",
  darken4: "#b71c1c",
  accent1: "#ff8a80",
  accent2: "#ff5252",
  accent3: "#ff1744",
  accent4: "#d50000"
};
const pink = {
  base: "#e91e63",
  lighten5: "#fce4ec",
  lighten4: "#f8bbd0",
  lighten3: "#f48fb1",
  lighten2: "#f06292",
  lighten1: "#ec407a",
  darken1: "#d81b60",
  darken2: "#c2185b",
  darken3: "#ad1457",
  darken4: "#880e4f",
  accent1: "#ff80ab",
  accent2: "#ff4081",
  accent3: "#f50057",
  accent4: "#c51162"
};
const purple = {
  base: "#9c27b0",
  lighten5: "#f3e5f5",
  lighten4: "#e1bee7",
  lighten3: "#ce93d8",
  lighten2: "#ba68c8",
  lighten1: "#ab47bc",
  darken1: "#8e24aa",
  darken2: "#7b1fa2",
  darken3: "#6a1b9a",
  darken4: "#4a148c",
  accent1: "#ea80fc",
  accent2: "#e040fb",
  accent3: "#d500f9",
  accent4: "#aa00ff"
};
const deepPurple = {
  base: "#673ab7",
  lighten5: "#ede7f6",
  lighten4: "#d1c4e9",
  lighten3: "#b39ddb",
  lighten2: "#9575cd",
  lighten1: "#7e57c2",
  darken1: "#5e35b1",
  darken2: "#512da8",
  darken3: "#4527a0",
  darken4: "#311b92",
  accent1: "#b388ff",
  accent2: "#7c4dff",
  accent3: "#651fff",
  accent4: "#6200ea"
};
const indigo = {
  base: "#3f51b5",
  lighten5: "#e8eaf6",
  lighten4: "#c5cae9",
  lighten3: "#9fa8da",
  lighten2: "#7986cb",
  lighten1: "#5c6bc0",
  darken1: "#3949ab",
  darken2: "#303f9f",
  darken3: "#283593",
  darken4: "#1a237e",
  accent1: "#8c9eff",
  accent2: "#536dfe",
  accent3: "#3d5afe",
  accent4: "#304ffe"
};
const blue = {
  base: "#2196f3",
  lighten5: "#e3f2fd",
  lighten4: "#bbdefb",
  lighten3: "#90caf9",
  lighten2: "#64b5f6",
  lighten1: "#42a5f5",
  darken1: "#1e88e5",
  darken2: "#1976d2",
  darken3: "#1565c0",
  darken4: "#0d47a1",
  accent1: "#82b1ff",
  accent2: "#448aff",
  accent3: "#2979ff",
  accent4: "#2962ff"
};
const lightBlue = {
  base: "#03a9f4",
  lighten5: "#e1f5fe",
  lighten4: "#b3e5fc",
  lighten3: "#81d4fa",
  lighten2: "#4fc3f7",
  lighten1: "#29b6f6",
  darken1: "#039be5",
  darken2: "#0288d1",
  darken3: "#0277bd",
  darken4: "#01579b",
  accent1: "#80d8ff",
  accent2: "#40c4ff",
  accent3: "#00b0ff",
  accent4: "#0091ea"
};
const cyan = {
  base: "#00bcd4",
  lighten5: "#e0f7fa",
  lighten4: "#b2ebf2",
  lighten3: "#80deea",
  lighten2: "#4dd0e1",
  lighten1: "#26c6da",
  darken1: "#00acc1",
  darken2: "#0097a7",
  darken3: "#00838f",
  darken4: "#006064",
  accent1: "#84ffff",
  accent2: "#18ffff",
  accent3: "#00e5ff",
  accent4: "#00b8d4"
};
const teal = {
  base: "#009688",
  lighten5: "#e0f2f1",
  lighten4: "#b2dfdb",
  lighten3: "#80cbc4",
  lighten2: "#4db6ac",
  lighten1: "#26a69a",
  darken1: "#00897b",
  darken2: "#00796b",
  darken3: "#00695c",
  darken4: "#004d40",
  accent1: "#a7ffeb",
  accent2: "#64ffda",
  accent3: "#1de9b6",
  accent4: "#00bfa5"
};
const green = {
  base: "#4caf50",
  lighten5: "#e8f5e9",
  lighten4: "#c8e6c9",
  lighten3: "#a5d6a7",
  lighten2: "#81c784",
  lighten1: "#66bb6a",
  darken1: "#43a047",
  darken2: "#388e3c",
  darken3: "#2e7d32",
  darken4: "#1b5e20",
  accent1: "#b9f6ca",
  accent2: "#69f0ae",
  accent3: "#00e676",
  accent4: "#00c853"
};
const lightGreen = {
  base: "#8bc34a",
  lighten5: "#f1f8e9",
  lighten4: "#dcedc8",
  lighten3: "#c5e1a5",
  lighten2: "#aed581",
  lighten1: "#9ccc65",
  darken1: "#7cb342",
  darken2: "#689f38",
  darken3: "#558b2f",
  darken4: "#33691e",
  accent1: "#ccff90",
  accent2: "#b2ff59",
  accent3: "#76ff03",
  accent4: "#64dd17"
};
const lime = {
  base: "#cddc39",
  lighten5: "#f9fbe7",
  lighten4: "#f0f4c3",
  lighten3: "#e6ee9c",
  lighten2: "#dce775",
  lighten1: "#d4e157",
  darken1: "#c0ca33",
  darken2: "#afb42b",
  darken3: "#9e9d24",
  darken4: "#827717",
  accent1: "#f4ff81",
  accent2: "#eeff41",
  accent3: "#c6ff00",
  accent4: "#aeea00"
};
const yellow = {
  base: "#ffeb3b",
  lighten5: "#fffde7",
  lighten4: "#fff9c4",
  lighten3: "#fff59d",
  lighten2: "#fff176",
  lighten1: "#ffee58",
  darken1: "#fdd835",
  darken2: "#fbc02d",
  darken3: "#f9a825",
  darken4: "#f57f17",
  accent1: "#ffff8d",
  accent2: "#ffff00",
  accent3: "#ffea00",
  accent4: "#ffd600"
};
const amber = {
  base: "#ffc107",
  lighten5: "#fff8e1",
  lighten4: "#ffecb3",
  lighten3: "#ffe082",
  lighten2: "#ffd54f",
  lighten1: "#ffca28",
  darken1: "#ffb300",
  darken2: "#ffa000",
  darken3: "#ff8f00",
  darken4: "#ff6f00",
  accent1: "#ffe57f",
  accent2: "#ffd740",
  accent3: "#ffc400",
  accent4: "#ffab00"
};
const orange = {
  base: "#ff9800",
  lighten5: "#fff3e0",
  lighten4: "#ffe0b2",
  lighten3: "#ffcc80",
  lighten2: "#ffb74d",
  lighten1: "#ffa726",
  darken1: "#fb8c00",
  darken2: "#f57c00",
  darken3: "#ef6c00",
  darken4: "#e65100",
  accent1: "#ffd180",
  accent2: "#ffab40",
  accent3: "#ff9100",
  accent4: "#ff6d00"
};
const deepOrange = {
  base: "#ff5722",
  lighten5: "#fbe9e7",
  lighten4: "#ffccbc",
  lighten3: "#ffab91",
  lighten2: "#ff8a65",
  lighten1: "#ff7043",
  darken1: "#f4511e",
  darken2: "#e64a19",
  darken3: "#d84315",
  darken4: "#bf360c",
  accent1: "#ff9e80",
  accent2: "#ff6e40",
  accent3: "#ff3d00",
  accent4: "#dd2c00"
};
const brown = {
  base: "#795548",
  lighten5: "#efebe9",
  lighten4: "#d7ccc8",
  lighten3: "#bcaaa4",
  lighten2: "#a1887f",
  lighten1: "#8d6e63",
  darken1: "#6d4c41",
  darken2: "#5d4037",
  darken3: "#4e342e",
  darken4: "#3e2723"
};
const blueGrey = {
  base: "#607d8b",
  lighten5: "#eceff1",
  lighten4: "#cfd8dc",
  lighten3: "#b0bec5",
  lighten2: "#90a4ae",
  lighten1: "#78909c",
  darken1: "#546e7a",
  darken2: "#455a64",
  darken3: "#37474f",
  darken4: "#263238"
};
const grey = {
  base: "#9e9e9e",
  lighten5: "#fafafa",
  lighten4: "#f5f5f5",
  lighten3: "#eeeeee",
  lighten2: "#e0e0e0",
  lighten1: "#bdbdbd",
  darken1: "#757575",
  darken2: "#616161",
  darken3: "#424242",
  darken4: "#212121"
};
const shades = {
  black: "#000000",
  white: "#ffffff",
  transparent: "#ffffff00"
};
const colors = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  blueGrey,
  grey,
  shades
};

const makeVColorPickerSwatchesProps = propsFactory({
  swatches: {
    type: Array,
    default: () => parseDefaultColors(colors)
  },
  disabled: Boolean,
  color: Object,
  maxHeight: [Number, String],
  ...makeComponentProps()
}, "VColorPickerSwatches");
function parseDefaultColors(colors2) {
  return Object.keys(colors2).map((key) => {
    const color = colors2[key];
    return color.base ? [color.base, color.darken4, color.darken3, color.darken2, color.darken1, color.lighten1, color.lighten2, color.lighten3, color.lighten4, color.lighten5] : [color.black, color.white, color.transparent];
  });
}
const VColorPickerSwatches = defineComponent({
  name: "VColorPickerSwatches",
  props: makeVColorPickerSwatchesProps(),
  emits: {
    "update:color": (color) => true
  },
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    useRender(() => createVNode("div", {
      "class": ["v-color-picker-swatches", props.class],
      "style": [{
        maxHeight: convertToUnit(props.maxHeight)
      }, props.style]
    }, [createVNode("div", null, [props.swatches.map((swatch) => createVNode("div", {
      "class": "v-color-picker-swatches__swatch"
    }, [swatch.map((color) => {
      const rgba = parseColor(color);
      const hsva = RGBtoHSV(rgba);
      const background = RGBtoCSS(rgba);
      return createVNode("div", {
        "class": "v-color-picker-swatches__color",
        "onClick": () => hsva && emit("update:color", hsva)
      }, [createVNode("div", {
        "style": {
          background
        }
      }, [props.color && deepEqual(props.color, hsva) ? createVNode(VIcon, {
        "size": "x-small",
        "icon": "$success",
        "color": getContrast(color, "#FFFFFF") > 2 ? "white" : "black"
      }, null) : void 0])]);
    })]))])]));
    return {};
  }
});

const makeVColorPickerProps = propsFactory({
  canvasHeight: {
    type: [String, Number],
    default: 150
  },
  disabled: Boolean,
  dotSize: {
    type: [Number, String],
    default: 10
  },
  hideCanvas: Boolean,
  hideSliders: Boolean,
  hideInputs: Boolean,
  mode: {
    type: String,
    default: "rgba",
    validator: (v) => Object.keys(modes).includes(v)
  },
  modes: {
    type: Array,
    default: () => Object.keys(modes),
    validator: (v) => Array.isArray(v) && v.every((m) => Object.keys(modes).includes(m))
  },
  showSwatches: Boolean,
  swatches: Array,
  swatchesMaxHeight: {
    type: [Number, String],
    default: 150
  },
  modelValue: {
    type: [Object, String]
  },
  ...omit(makeVSheetProps({
    width: 300
  }), ["height", "location", "minHeight", "maxHeight", "minWidth", "maxWidth"])
}, "VColorPicker");
const VColorPicker = defineComponent({
  name: "VColorPicker",
  props: makeVColorPickerProps(),
  emits: {
    "update:modelValue": (color) => true,
    "update:mode": (mode) => true
  },
  setup(props) {
    const mode = useProxiedModel(props, "mode");
    const hue = ref(null);
    const model = useProxiedModel(props, "modelValue", void 0, (v) => {
      if (v == null || v === "") return null;
      let c;
      try {
        c = RGBtoHSV(parseColor(v));
      } catch (err) {
        consoleWarn(err);
        return null;
      }
      return c;
    }, (v) => {
      if (!v) return null;
      return extractColor(v, props.modelValue);
    });
    const currentColor = computed(() => {
      return model.value ? {
        ...model.value,
        h: hue.value ?? model.value.h
      } : null;
    });
    const {
      rtlClasses
    } = useRtl();
    let externalChange = true;
    watch(model, (v) => {
      if (!externalChange) {
        externalChange = true;
        return;
      }
      if (!v) return;
      hue.value = v.h;
    }, {
      immediate: true
    });
    const updateColor = (hsva) => {
      externalChange = false;
      hue.value = hsva.h;
      model.value = hsva;
    };
    provideDefaults({
      VSlider: {
        color: void 0,
        trackColor: void 0,
        trackFillColor: void 0
      }
    });
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      return createVNode(VSheet, mergeProps({
        "rounded": props.rounded,
        "elevation": props.elevation,
        "theme": props.theme,
        "class": ["v-color-picker", rtlClasses.value, props.class],
        "style": [{
          "--v-color-picker-color-hsv": HSVtoCSS({
            ...currentColor.value ?? nullColor,
            a: 1
          })
        }, props.style]
      }, sheetProps, {
        "maxWidth": props.width
      }), {
        default: () => [!props.hideCanvas && createVNode(VColorPickerCanvas, {
          "key": "canvas",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled,
          "dotSize": props.dotSize,
          "width": props.width,
          "height": props.canvasHeight
        }, null), (!props.hideSliders || !props.hideInputs) && createVNode("div", {
          "key": "controls",
          "class": "v-color-picker__controls"
        }, [!props.hideSliders && createVNode(VColorPickerPreview, {
          "key": "preview",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "hideAlpha": !mode.value.endsWith("a"),
          "disabled": props.disabled
        }, null), !props.hideInputs && createVNode(VColorPickerEdit, {
          "key": "edit",
          "modes": props.modes,
          "mode": mode.value,
          "onUpdate:mode": (m) => mode.value = m,
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled
        }, null)]), props.showSwatches && createVNode(VColorPickerSwatches, {
          "key": "swatches",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "maxHeight": props.swatchesMaxHeight,
          "swatches": props.swatches,
          "disabled": props.disabled
        }, null)]
      });
    });
    return {};
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent$1({
  __name: "email-editor",
  __ssrInlineRender: true,
  setup(__props) {
    const form = ref(null);
    const emailPreview = ref(null);
    const viewMode = ref("desktop");
    const codeTab = ref("preview");
    const configTab = ref("content");
    const templates = computed(() => {
      return Object.values(emailTemplates).map((template) => ({
        title: template.name,
        value: template.id
      }));
    });
    const fonts = [
      { title: "Arial", value: "Arial" },
      { title: "Helvetica", value: "Helvetica" },
      { title: "Georgia", value: "Georgia" },
      { title: "Tahoma", value: "Tahoma" },
      { title: "Verdana", value: "Verdana" }
    ];
    const emailData = ref({
      id: "custom",
      name: "Custom Template",
      subject: "Welcome to our newsletter",
      template: "welcome",
      preheader: "Stay informed with our latest news and updates",
      headline: "Welcome to our newsletter!",
      mainContent: "We are delighted to have you as a subscriber. You will now receive our best news and offers directly in your inbox.\n\nHere's what you can expect from our newsletter:\n- Regular updates on our products and services\n- Exclusive tips and advice\n- Special offers reserved for our subscribers",
      ctaText: "Discover our services",
      ctaUrl: "https://example.com",
      colors: {
        primary: "#4F46E5",
        secondary: "#818CF8"
      },
      font: "Arial",
      darkMode: false,
      logoUrl: "https://via.placeholder.com/150x50?text=Logo",
      companyName: "SaaS Company Inc.",
      companyAddress: "123 Innovation Street, 75000 Paris, France"
    });
    const snackbar = ref({
      show: false,
      text: "",
      color: "success"
    });
    const generatedHtml = ref("");
    const generatedText = ref("");
    const emailTemplate = ref("");
    const formattedParagraphs = computed(() => {
      return emailData.value.mainContent.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
    });
    const loadTemplate = () => {
      const selectedTemplate = getTemplateById(emailData.value.template);
      if (selectedTemplate) {
        const currentId = emailData.value.template;
        emailData.value = { ...selectedTemplate, template: currentId };
        generateEmailCode();
      }
    };
    const generateEmailCode = async () => {
      try {
        generatedHtml.value = generateEmailHTML(emailData.value);
        generatedText.value = generateEmailText(emailData.value);
        emailTemplate.value = generateVueEmailTemplate(emailData.value);
      } catch (error) {
        console.error("Error generating email code:", error);
        showSnackbar("Error generating HTML code", "error");
      }
    };
    const copyHtml = () => {
      (void 0).clipboard.writeText(generatedHtml.value).then(() => {
        showSnackbar("HTML code copied to clipboard", "success");
      }).catch((err) => {
        console.error("Error copying:", err);
        showSnackbar("Error copying code", "error");
      });
    };
    const copyVueEmailTemplate = () => {
      (void 0).clipboard.writeText(emailTemplate.value).then(() => {
        showSnackbar("Vue Email template copied to clipboard", "success");
      }).catch((err) => {
        console.error("Error copying:", err);
        showSnackbar("Error copying template", "error");
      });
    };
    const copyText = () => {
      (void 0).clipboard.writeText(generatedText.value).then(() => {
        showSnackbar("Text copied to clipboard", "success");
      }).catch((err) => {
        console.error("Error copying:", err);
        showSnackbar("Error copying text", "error");
      });
    };
    const sendEmail = async () => {
      try {
        const store = useUserStore();
        const emailDataPayload = {
          subject: emailData.value.subject,
          html: generatedHtml.value,
          text: generatedText.value
        };
        const response = await store.sendEmail(emailDataPayload);
        if (response) {
          const result = await response.json();
          console.log("Réponse du serveur:", result);
          if (result.success) {
            showSnackbar("Email envoyé avec succès", "success");
          } else {
            showSnackbar(`Erreur d'envoi: ${result.message || "Erreur inconnue"}`, "error");
          }
        } else {
          showSnackbar("Erreur lors de la connexion au serveur", "error");
        }
      } catch (error) {
        console.error("Erreur détaillée lors de l'envoi:", error);
        showSnackbar(`Erreur d'envoi: ${error.message}`, "error");
      }
    };
    const showSnackbar = (text, color) => {
      snackbar.value = {
        show: true,
        text,
        color
      };
    };
    watch(
      () => emailData.value,
      () => {
        generateEmailCode();
      },
      { deep: true, immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, mergeProps({
        fluid: "",
        class: "pa-0 ma-0"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, { "no-gutters": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    md: "4",
                    lg: "3",
                    class: "pa-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          elevation: "2",
                          class: "rounded-lg"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 d-flex align-center" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, { class: "mr-2" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-email-edit`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-email-edit")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(` Email Editor `);
                                    _push6(ssrRenderComponent(VSpacer, null, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VBtn, {
                                      icon: "mdi-send",
                                      color: "white",
                                      variant: "text",
                                      onClick: sendEmail,
                                      class: "mr-n2"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VTooltip, {
                                            activator: "parent",
                                            location: "bottom"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Send email`);
                                              } else {
                                                return [
                                                  createTextVNode("Send email")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VTooltip, {
                                              activator: "parent",
                                              location: "bottom"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Send email")
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
                                      createVNode(VIcon, { class: "mr-2" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-email-edit")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Email Editor "),
                                      createVNode(VSpacer),
                                      createVNode(VBtn, {
                                        icon: "mdi-send",
                                        color: "white",
                                        variant: "text",
                                        onClick: sendEmail,
                                        class: "mr-n2"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTooltip, {
                                            activator: "parent",
                                            location: "bottom"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Send email")
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
                              _push5(ssrRenderComponent(VTabs, {
                                modelValue: configTab.value,
                                "onUpdate:modelValue": ($event) => configTab.value = $event,
                                "bg-color": "primary",
                                "show-arrows": ""
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTab, {
                                      value: "content",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-file-document-outline`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-file-document-outline")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Content `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-file-document-outline")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Content ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VTab, {
                                      value: "style",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-palette-outline`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-palette-outline")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Style `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-palette-outline")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Style ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VTab, {
                                      value: "company",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-domain`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-domain")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Company `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-domain")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Company ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VTab, {
                                      value: "actions",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-cog`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-cog")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Actions `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-cog")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Actions ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VTab, {
                                        value: "content",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-file-document-outline")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Content ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VTab, {
                                        value: "style",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-palette-outline")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Style ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VTab, {
                                        value: "company",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-domain")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Company ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VTab, {
                                        value: "actions",
                                        class: "text-caption"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-cog")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Actions ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VForm, {
                                      ref_key: "form",
                                      ref: form
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VTextField, {
                                            modelValue: emailData.value.subject,
                                            "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                            label: "Email subject",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-format-title",
                                            clearable: ""
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VSelect, {
                                            modelValue: emailData.value.template,
                                            "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                            items: templates.value,
                                            label: "Template type",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-file-document-outline"
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VWindow, {
                                            modelValue: configTab.value,
                                            "onUpdate:modelValue": ($event) => configTab.value = $event
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VWindowItem, { value: "content" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.preheader,
                                                        "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                        label: "Pre-header",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-text-short",
                                                        hint: "Text visible in email previews",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.headline,
                                                        "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                        label: "Title",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-format-header-1",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextarea, {
                                                        modelValue: emailData.value.mainContent,
                                                        "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                        label: "Main content",
                                                        variant: "outlined",
                                                        rows: "6",
                                                        "auto-grow": "",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-text",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.ctaText,
                                                        "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                        label: "Button text",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-button-cursor",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.ctaUrl,
                                                        "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                        label: "Button URL",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-link",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.preheader,
                                                          "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                          label: "Pre-header",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-text-short",
                                                          hint: "Text visible in email previews",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.headline,
                                                          "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                          label: "Title",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-format-header-1",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextarea, {
                                                          modelValue: emailData.value.mainContent,
                                                          "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                          label: "Main content",
                                                          variant: "outlined",
                                                          rows: "6",
                                                          "auto-grow": "",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-text",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.ctaText,
                                                          "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                          label: "Button text",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-button-cursor",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.ctaUrl,
                                                          "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                          label: "Button URL",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-link",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VWindowItem, { value: "style" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`<div class="d-flex align-center mb-2" data-v-99b6e9a1${_scopeId8}>`);
                                                      _push9(ssrRenderComponent(VIcon, { class: "mr-2" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-palette`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-palette")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(`<div class="text-subtitle-1" data-v-99b6e9a1${_scopeId8}>Primary color</div></div>`);
                                                      _push9(ssrRenderComponent(VColorPicker, {
                                                        modelValue: emailData.value.colors.primary,
                                                        "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                        "dot-size": "25",
                                                        class: "mb-4"
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(`<div class="d-flex align-center mb-2" data-v-99b6e9a1${_scopeId8}>`);
                                                      _push9(ssrRenderComponent(VIcon, { class: "mr-2" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-palette-outline`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-palette-outline")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(`<div class="text-subtitle-1" data-v-99b6e9a1${_scopeId8}>Secondary color</div></div>`);
                                                      _push9(ssrRenderComponent(VColorPicker, {
                                                        modelValue: emailData.value.colors.secondary,
                                                        "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                        "dot-size": "25",
                                                        class: "mb-4"
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VSelect, {
                                                        modelValue: emailData.value.font,
                                                        "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                        items: fonts,
                                                        label: "Font family",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-format-font"
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VSwitch, {
                                                        modelValue: emailData.value.darkMode,
                                                        "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                        color: "primary",
                                                        label: "Dark mode",
                                                        "hide-details": "",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-theme-light-dark"
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                          createVNode(VIcon, { class: "mr-2" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-palette")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                                        ]),
                                                        createVNode(VColorPicker, {
                                                          modelValue: emailData.value.colors.primary,
                                                          "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                          "dot-size": "25",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                          createVNode(VIcon, { class: "mr-2" }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-palette-outline")
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                                        ]),
                                                        createVNode(VColorPicker, {
                                                          modelValue: emailData.value.colors.secondary,
                                                          "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                          "dot-size": "25",
                                                          class: "mb-4"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VSelect, {
                                                          modelValue: emailData.value.font,
                                                          "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                          items: fonts,
                                                          label: "Font family",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-format-font"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VSwitch, {
                                                          modelValue: emailData.value.darkMode,
                                                          "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                          color: "primary",
                                                          label: "Dark mode",
                                                          "hide-details": "",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-theme-light-dark"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VWindowItem, { value: "company" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.logoUrl,
                                                        "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                        label: "Logo URL",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-image"
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.companyName,
                                                        "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                        label: "Company name",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-domain",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                      _push9(ssrRenderComponent(VTextField, {
                                                        modelValue: emailData.value.companyAddress,
                                                        "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                        label: "Company address",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-map-marker",
                                                        clearable: ""
                                                      }, null, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.logoUrl,
                                                          "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                          label: "Logo URL",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-image"
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.companyName,
                                                          "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                          label: "Company name",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-domain",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                        createVNode(VTextField, {
                                                          modelValue: emailData.value.companyAddress,
                                                          "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                          label: "Company address",
                                                          variant: "outlined",
                                                          density: "comfortable",
                                                          class: "mb-4",
                                                          "prepend-icon": "mdi-map-marker",
                                                          clearable: ""
                                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VWindowItem, { value: "actions" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VList, null, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(ssrRenderComponent(VListItem, {
                                                              "prepend-icon": "mdi-content-copy",
                                                              title: "Copy HTML",
                                                              onClick: copyHtml,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VIcon, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`mdi-chevron-right`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("mdi-chevron-right")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VIcon, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-chevron-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItem, {
                                                              "prepend-icon": "mdi-code-tags",
                                                              title: "Copy Vue Email",
                                                              onClick: copyVueEmailTemplate,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VIcon, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`mdi-chevron-right`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("mdi-chevron-right")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VIcon, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-chevron-right")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VListItem, {
                                                              "prepend-icon": "mdi-send",
                                                              title: "Send email",
                                                              onClick: sendEmail,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VIcon, null, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`mdi-chevron-right`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("mdi-chevron-right")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VIcon, null, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("mdi-chevron-right")
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
                                                              createVNode(VListItem, {
                                                                "prepend-icon": "mdi-content-copy",
                                                                title: "Copy HTML",
                                                                onClick: copyHtml,
                                                                class: "mb-2"
                                                              }, {
                                                                append: withCtx(() => [
                                                                  createVNode(VIcon, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-chevron-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItem, {
                                                                "prepend-icon": "mdi-code-tags",
                                                                title: "Copy Vue Email",
                                                                onClick: copyVueEmailTemplate,
                                                                class: "mb-2"
                                                              }, {
                                                                append: withCtx(() => [
                                                                  createVNode(VIcon, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-chevron-right")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              }),
                                                              createVNode(VListItem, {
                                                                "prepend-icon": "mdi-send",
                                                                title: "Send email",
                                                                onClick: sendEmail,
                                                                class: "mb-2"
                                                              }, {
                                                                append: withCtx(() => [
                                                                  createVNode(VIcon, null, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("mdi-chevron-right")
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
                                                        createVNode(VList, null, {
                                                          default: withCtx(() => [
                                                            createVNode(VListItem, {
                                                              "prepend-icon": "mdi-content-copy",
                                                              title: "Copy HTML",
                                                              onClick: copyHtml,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx(() => [
                                                                createVNode(VIcon, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-chevron-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItem, {
                                                              "prepend-icon": "mdi-code-tags",
                                                              title: "Copy Vue Email",
                                                              onClick: copyVueEmailTemplate,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx(() => [
                                                                createVNode(VIcon, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-chevron-right")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            }),
                                                            createVNode(VListItem, {
                                                              "prepend-icon": "mdi-send",
                                                              title: "Send email",
                                                              onClick: sendEmail,
                                                              class: "mb-2"
                                                            }, {
                                                              append: withCtx(() => [
                                                                createVNode(VIcon, null, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("mdi-chevron-right")
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
                                                  createVNode(VWindowItem, { value: "content" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.preheader,
                                                        "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                        label: "Pre-header",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-text-short",
                                                        hint: "Text visible in email previews",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.headline,
                                                        "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                        label: "Title",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-format-header-1",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextarea, {
                                                        modelValue: emailData.value.mainContent,
                                                        "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                        label: "Main content",
                                                        variant: "outlined",
                                                        rows: "6",
                                                        "auto-grow": "",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-text",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.ctaText,
                                                        "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                        label: "Button text",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-button-cursor",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.ctaUrl,
                                                        "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                        label: "Button URL",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-link",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VWindowItem, { value: "style" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                        createVNode(VIcon, { class: "mr-2" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-palette")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                                      ]),
                                                      createVNode(VColorPicker, {
                                                        modelValue: emailData.value.colors.primary,
                                                        "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                        "dot-size": "25",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                        createVNode(VIcon, { class: "mr-2" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-palette-outline")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                                      ]),
                                                      createVNode(VColorPicker, {
                                                        modelValue: emailData.value.colors.secondary,
                                                        "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                        "dot-size": "25",
                                                        class: "mb-4"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VSelect, {
                                                        modelValue: emailData.value.font,
                                                        "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                        items: fonts,
                                                        label: "Font family",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-format-font"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VSwitch, {
                                                        modelValue: emailData.value.darkMode,
                                                        "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                        color: "primary",
                                                        label: "Dark mode",
                                                        "hide-details": "",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-theme-light-dark"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VWindowItem, { value: "company" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.logoUrl,
                                                        "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                        label: "Logo URL",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-image"
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.companyName,
                                                        "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                        label: "Company name",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-domain",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                      createVNode(VTextField, {
                                                        modelValue: emailData.value.companyAddress,
                                                        "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                        label: "Company address",
                                                        variant: "outlined",
                                                        density: "comfortable",
                                                        class: "mb-4",
                                                        "prepend-icon": "mdi-map-marker",
                                                        clearable: ""
                                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VWindowItem, { value: "actions" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VList, null, {
                                                        default: withCtx(() => [
                                                          createVNode(VListItem, {
                                                            "prepend-icon": "mdi-content-copy",
                                                            title: "Copy HTML",
                                                            onClick: copyHtml,
                                                            class: "mb-2"
                                                          }, {
                                                            append: withCtx(() => [
                                                              createVNode(VIcon, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-chevron-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItem, {
                                                            "prepend-icon": "mdi-code-tags",
                                                            title: "Copy Vue Email",
                                                            onClick: copyVueEmailTemplate,
                                                            class: "mb-2"
                                                          }, {
                                                            append: withCtx(() => [
                                                              createVNode(VIcon, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-chevron-right")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          }),
                                                          createVNode(VListItem, {
                                                            "prepend-icon": "mdi-send",
                                                            title: "Send email",
                                                            onClick: sendEmail,
                                                            class: "mb-2"
                                                          }, {
                                                            append: withCtx(() => [
                                                              createVNode(VIcon, null, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("mdi-chevron-right")
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
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.subject,
                                              "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                              label: "Email subject",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-format-title",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VSelect, {
                                              modelValue: emailData.value.template,
                                              "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                              items: templates.value,
                                              label: "Template type",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-file-document-outline"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                            createVNode(VDivider, { class: "my-4" }),
                                            createVNode(VWindow, {
                                              modelValue: configTab.value,
                                              "onUpdate:modelValue": ($event) => configTab.value = $event
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VWindowItem, { value: "content" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.preheader,
                                                      "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                      label: "Pre-header",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-text-short",
                                                      hint: "Text visible in email previews",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.headline,
                                                      "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                      label: "Title",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-format-header-1",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextarea, {
                                                      modelValue: emailData.value.mainContent,
                                                      "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                      label: "Main content",
                                                      variant: "outlined",
                                                      rows: "6",
                                                      "auto-grow": "",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-text",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.ctaText,
                                                      "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                      label: "Button text",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-button-cursor",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.ctaUrl,
                                                      "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                      label: "Button URL",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-link",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VWindowItem, { value: "style" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                      createVNode(VIcon, { class: "mr-2" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-palette")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                                    ]),
                                                    createVNode(VColorPicker, {
                                                      modelValue: emailData.value.colors.primary,
                                                      "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                      "dot-size": "25",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                      createVNode(VIcon, { class: "mr-2" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-palette-outline")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                                    ]),
                                                    createVNode(VColorPicker, {
                                                      modelValue: emailData.value.colors.secondary,
                                                      "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                      "dot-size": "25",
                                                      class: "mb-4"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VSelect, {
                                                      modelValue: emailData.value.font,
                                                      "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                      items: fonts,
                                                      label: "Font family",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-format-font"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VSwitch, {
                                                      modelValue: emailData.value.darkMode,
                                                      "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                      color: "primary",
                                                      label: "Dark mode",
                                                      "hide-details": "",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-theme-light-dark"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VWindowItem, { value: "company" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.logoUrl,
                                                      "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                      label: "Logo URL",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-image"
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.companyName,
                                                      "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                      label: "Company name",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-domain",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                    createVNode(VTextField, {
                                                      modelValue: emailData.value.companyAddress,
                                                      "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                      label: "Company address",
                                                      variant: "outlined",
                                                      density: "comfortable",
                                                      class: "mb-4",
                                                      "prepend-icon": "mdi-map-marker",
                                                      clearable: ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VWindowItem, { value: "actions" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VList, null, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-content-copy",
                                                          title: "Copy HTML",
                                                          onClick: copyHtml,
                                                          class: "mb-2"
                                                        }, {
                                                          append: withCtx(() => [
                                                            createVNode(VIcon, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-chevron-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-code-tags",
                                                          title: "Copy Vue Email",
                                                          onClick: copyVueEmailTemplate,
                                                          class: "mb-2"
                                                        }, {
                                                          append: withCtx(() => [
                                                            createVNode(VIcon, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-chevron-right")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createVNode(VListItem, {
                                                          "prepend-icon": "mdi-send",
                                                          title: "Send email",
                                                          onClick: sendEmail,
                                                          class: "mb-2"
                                                        }, {
                                                          append: withCtx(() => [
                                                            createVNode(VIcon, null, {
                                                              default: withCtx(() => [
                                                                createTextVNode("mdi-chevron-right")
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
                                            }, 8, ["modelValue", "onUpdate:modelValue"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VForm, {
                                        ref_key: "form",
                                        ref: form
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.subject,
                                            "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                            label: "Email subject",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-format-title",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VSelect, {
                                            modelValue: emailData.value.template,
                                            "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                            items: templates.value,
                                            label: "Template type",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-file-document-outline"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                          createVNode(VDivider, { class: "my-4" }),
                                          createVNode(VWindow, {
                                            modelValue: configTab.value,
                                            "onUpdate:modelValue": ($event) => configTab.value = $event
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VWindowItem, { value: "content" }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.preheader,
                                                    "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                    label: "Pre-header",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-text-short",
                                                    hint: "Text visible in email previews",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.headline,
                                                    "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                    label: "Title",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-format-header-1",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextarea, {
                                                    modelValue: emailData.value.mainContent,
                                                    "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                    label: "Main content",
                                                    variant: "outlined",
                                                    rows: "6",
                                                    "auto-grow": "",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-text",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.ctaText,
                                                    "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                    label: "Button text",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-button-cursor",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.ctaUrl,
                                                    "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                    label: "Button URL",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-link",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VWindowItem, { value: "style" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                    createVNode(VIcon, { class: "mr-2" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-palette")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                                  ]),
                                                  createVNode(VColorPicker, {
                                                    modelValue: emailData.value.colors.primary,
                                                    "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                    "dot-size": "25",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                    createVNode(VIcon, { class: "mr-2" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-palette-outline")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                                  ]),
                                                  createVNode(VColorPicker, {
                                                    modelValue: emailData.value.colors.secondary,
                                                    "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                    "dot-size": "25",
                                                    class: "mb-4"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VSelect, {
                                                    modelValue: emailData.value.font,
                                                    "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                    items: fonts,
                                                    label: "Font family",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-format-font"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VSwitch, {
                                                    modelValue: emailData.value.darkMode,
                                                    "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                    color: "primary",
                                                    label: "Dark mode",
                                                    "hide-details": "",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-theme-light-dark"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VWindowItem, { value: "company" }, {
                                                default: withCtx(() => [
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.logoUrl,
                                                    "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                    label: "Logo URL",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-image"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.companyName,
                                                    "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                    label: "Company name",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-domain",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                  createVNode(VTextField, {
                                                    modelValue: emailData.value.companyAddress,
                                                    "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                    label: "Company address",
                                                    variant: "outlined",
                                                    density: "comfortable",
                                                    class: "mb-4",
                                                    "prepend-icon": "mdi-map-marker",
                                                    clearable: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VWindowItem, { value: "actions" }, {
                                                default: withCtx(() => [
                                                  createVNode(VList, null, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-content-copy",
                                                        title: "Copy HTML",
                                                        onClick: copyHtml,
                                                        class: "mb-2"
                                                      }, {
                                                        append: withCtx(() => [
                                                          createVNode(VIcon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-chevron-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-code-tags",
                                                        title: "Copy Vue Email",
                                                        onClick: copyVueEmailTemplate,
                                                        class: "mb-2"
                                                      }, {
                                                        append: withCtx(() => [
                                                          createVNode(VIcon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-chevron-right")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(VListItem, {
                                                        "prepend-icon": "mdi-send",
                                                        title: "Send email",
                                                        onClick: sendEmail,
                                                        class: "mb-2"
                                                      }, {
                                                        append: withCtx(() => [
                                                          createVNode(VIcon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-chevron-right")
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
                                          }, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }, 512)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { class: "mr-2" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-email-edit")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Email Editor "),
                                    createVNode(VSpacer),
                                    createVNode(VBtn, {
                                      icon: "mdi-send",
                                      color: "white",
                                      variant: "text",
                                      onClick: sendEmail,
                                      class: "mr-n2"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTooltip, {
                                          activator: "parent",
                                          location: "bottom"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Send email")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTabs, {
                                  modelValue: configTab.value,
                                  "onUpdate:modelValue": ($event) => configTab.value = $event,
                                  "bg-color": "primary",
                                  "show-arrows": ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTab, {
                                      value: "content",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "small",
                                          class: "mr-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-file-document-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Content ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VTab, {
                                      value: "style",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "small",
                                          class: "mr-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-palette-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Style ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VTab, {
                                      value: "company",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "small",
                                          class: "mr-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-domain")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Company ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VTab, {
                                      value: "actions",
                                      class: "text-caption"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "small",
                                          class: "mr-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cog")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Actions ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VForm, {
                                      ref_key: "form",
                                      ref: form
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: emailData.value.subject,
                                          "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                          label: "Email subject",
                                          variant: "outlined",
                                          density: "comfortable",
                                          class: "mb-4",
                                          "prepend-icon": "mdi-format-title",
                                          clearable: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VSelect, {
                                          modelValue: emailData.value.template,
                                          "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                          items: templates.value,
                                          label: "Template type",
                                          variant: "outlined",
                                          density: "comfortable",
                                          class: "mb-4",
                                          "prepend-icon": "mdi-file-document-outline"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                        createVNode(VDivider, { class: "my-4" }),
                                        createVNode(VWindow, {
                                          modelValue: configTab.value,
                                          "onUpdate:modelValue": ($event) => configTab.value = $event
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VWindowItem, { value: "content" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.preheader,
                                                  "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                  label: "Pre-header",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-text-short",
                                                  hint: "Text visible in email previews",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.headline,
                                                  "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                  label: "Title",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-format-header-1",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextarea, {
                                                  modelValue: emailData.value.mainContent,
                                                  "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                  label: "Main content",
                                                  variant: "outlined",
                                                  rows: "6",
                                                  "auto-grow": "",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-text",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.ctaText,
                                                  "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                  label: "Button text",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-button-cursor",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.ctaUrl,
                                                  "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                  label: "Button URL",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-link",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VWindowItem, { value: "style" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                  createVNode(VIcon, { class: "mr-2" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-palette")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                                ]),
                                                createVNode(VColorPicker, {
                                                  modelValue: emailData.value.colors.primary,
                                                  "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                  "dot-size": "25",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                  createVNode(VIcon, { class: "mr-2" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-palette-outline")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                                ]),
                                                createVNode(VColorPicker, {
                                                  modelValue: emailData.value.colors.secondary,
                                                  "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                  "dot-size": "25",
                                                  class: "mb-4"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VSelect, {
                                                  modelValue: emailData.value.font,
                                                  "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                  items: fonts,
                                                  label: "Font family",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-format-font"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VSwitch, {
                                                  modelValue: emailData.value.darkMode,
                                                  "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                  color: "primary",
                                                  label: "Dark mode",
                                                  "hide-details": "",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-theme-light-dark"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VWindowItem, { value: "company" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.logoUrl,
                                                  "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                  label: "Logo URL",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-image"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.companyName,
                                                  "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                  label: "Company name",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-domain",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                                createVNode(VTextField, {
                                                  modelValue: emailData.value.companyAddress,
                                                  "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                  label: "Company address",
                                                  variant: "outlined",
                                                  density: "comfortable",
                                                  class: "mb-4",
                                                  "prepend-icon": "mdi-map-marker",
                                                  clearable: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VWindowItem, { value: "actions" }, {
                                              default: withCtx(() => [
                                                createVNode(VList, null, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-content-copy",
                                                      title: "Copy HTML",
                                                      onClick: copyHtml,
                                                      class: "mb-2"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-chevron-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-code-tags",
                                                      title: "Copy Vue Email",
                                                      onClick: copyVueEmailTemplate,
                                                      class: "mb-2"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-chevron-right")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(VListItem, {
                                                      "prepend-icon": "mdi-send",
                                                      title: "Send email",
                                                      onClick: sendEmail,
                                                      class: "mb-2"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode(VIcon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-chevron-right")
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
                                        }, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }, 512)
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
                            elevation: "2",
                            class: "rounded-lg"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { class: "mr-2" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-email-edit")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Email Editor "),
                                  createVNode(VSpacer),
                                  createVNode(VBtn, {
                                    icon: "mdi-send",
                                    color: "white",
                                    variant: "text",
                                    onClick: sendEmail,
                                    class: "mr-n2"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTooltip, {
                                        activator: "parent",
                                        location: "bottom"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Send email")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VTabs, {
                                modelValue: configTab.value,
                                "onUpdate:modelValue": ($event) => configTab.value = $event,
                                "bg-color": "primary",
                                "show-arrows": ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTab, {
                                    value: "content",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-file-document-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Content ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VTab, {
                                    value: "style",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-palette-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Style ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VTab, {
                                    value: "company",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-domain")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Company ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VTab, {
                                    value: "actions",
                                    class: "text-caption"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cog")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Actions ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VForm, {
                                    ref_key: "form",
                                    ref: form
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: emailData.value.subject,
                                        "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                        label: "Email subject",
                                        variant: "outlined",
                                        density: "comfortable",
                                        class: "mb-4",
                                        "prepend-icon": "mdi-format-title",
                                        clearable: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VSelect, {
                                        modelValue: emailData.value.template,
                                        "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                        items: templates.value,
                                        label: "Template type",
                                        variant: "outlined",
                                        density: "comfortable",
                                        class: "mb-4",
                                        "prepend-icon": "mdi-file-document-outline"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                      createVNode(VDivider, { class: "my-4" }),
                                      createVNode(VWindow, {
                                        modelValue: configTab.value,
                                        "onUpdate:modelValue": ($event) => configTab.value = $event
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VWindowItem, { value: "content" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.preheader,
                                                "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                                label: "Pre-header",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-text-short",
                                                hint: "Text visible in email previews",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.headline,
                                                "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                                label: "Title",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-format-header-1",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextarea, {
                                                modelValue: emailData.value.mainContent,
                                                "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                                label: "Main content",
                                                variant: "outlined",
                                                rows: "6",
                                                "auto-grow": "",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-text",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.ctaText,
                                                "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                                label: "Button text",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-button-cursor",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.ctaUrl,
                                                "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                                label: "Button URL",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-link",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VWindowItem, { value: "style" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                createVNode(VIcon, { class: "mr-2" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-palette")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                              ]),
                                              createVNode(VColorPicker, {
                                                modelValue: emailData.value.colors.primary,
                                                "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                                "dot-size": "25",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode("div", { class: "d-flex align-center mb-2" }, [
                                                createVNode(VIcon, { class: "mr-2" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-palette-outline")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                              ]),
                                              createVNode(VColorPicker, {
                                                modelValue: emailData.value.colors.secondary,
                                                "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                                "dot-size": "25",
                                                class: "mb-4"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VSelect, {
                                                modelValue: emailData.value.font,
                                                "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                                items: fonts,
                                                label: "Font family",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-format-font"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VSwitch, {
                                                modelValue: emailData.value.darkMode,
                                                "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                                color: "primary",
                                                label: "Dark mode",
                                                "hide-details": "",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-theme-light-dark"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VWindowItem, { value: "company" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.logoUrl,
                                                "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                                label: "Logo URL",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-image"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.companyName,
                                                "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                                label: "Company name",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-domain",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                              createVNode(VTextField, {
                                                modelValue: emailData.value.companyAddress,
                                                "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                                label: "Company address",
                                                variant: "outlined",
                                                density: "comfortable",
                                                class: "mb-4",
                                                "prepend-icon": "mdi-map-marker",
                                                clearable: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VWindowItem, { value: "actions" }, {
                                            default: withCtx(() => [
                                              createVNode(VList, null, {
                                                default: withCtx(() => [
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-content-copy",
                                                    title: "Copy HTML",
                                                    onClick: copyHtml,
                                                    class: "mb-2"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-chevron-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-code-tags",
                                                    title: "Copy Vue Email",
                                                    onClick: copyVueEmailTemplate,
                                                    class: "mb-2"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-chevron-right")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VListItem, {
                                                    "prepend-icon": "mdi-send",
                                                    title: "Send email",
                                                    onClick: sendEmail,
                                                    class: "mb-2"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode(VIcon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-chevron-right")
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
                                      }, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }, 512)
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
                    md: "8",
                    lg: "9",
                    class: "pa-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          elevation: "2",
                          class: "rounded-lg"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VToolbar, {
                                color: "primary",
                                flat: ""
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VToolbarTitle, { class: "text-white" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Email preview`);
                                        } else {
                                          return [
                                            createTextVNode("Email preview")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VSpacer, null, null, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VBtnToggle, {
                                      modelValue: viewMode.value,
                                      "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                      color: "white",
                                      density: "comfortable",
                                      class: "mr-2",
                                      mandatory: ""
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VBtn, {
                                            value: "desktop",
                                            class: "mr-2",
                                            "prepend-icon": "mdi-monitor"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Desktop`);
                                              } else {
                                                return [
                                                  createTextVNode("Desktop")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VBtn, {
                                            value: "mobile",
                                            "prepend-icon": "mdi-cellphone"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`Mobile`);
                                              } else {
                                                return [
                                                  createTextVNode("Mobile")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VBtn, {
                                              value: "desktop",
                                              class: "mr-2",
                                              "prepend-icon": "mdi-monitor"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Desktop")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VBtn, {
                                              value: "mobile",
                                              "prepend-icon": "mdi-cellphone"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Mobile")
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
                                      createVNode(VToolbarTitle, { class: "text-white" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Email preview")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VSpacer),
                                      createVNode(VBtnToggle, {
                                        modelValue: viewMode.value,
                                        "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                        color: "white",
                                        density: "comfortable",
                                        class: "mr-2",
                                        mandatory: ""
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VBtn, {
                                            value: "desktop",
                                            class: "mr-2",
                                            "prepend-icon": "mdi-monitor"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Desktop")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VBtn, {
                                            value: "mobile",
                                            "prepend-icon": "mdi-cellphone"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Mobile")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="${ssrRenderClass([viewMode.value, "email-preview-container"])}" data-v-99b6e9a1${_scopeId5}><div class="email-preview" data-v-99b6e9a1${_scopeId5}><div class="email-template" style="${ssrRenderStyle({ backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" })}" data-v-99b6e9a1${_scopeId5}><div class="email-header" style="${ssrRenderStyle(`border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`)}" data-v-99b6e9a1${_scopeId5}><img${ssrRenderAttr("src", emailData.value.logoUrl)}${ssrRenderAttr("alt", emailData.value.companyName)} style="${ssrRenderStyle({ "max-width": "150px" })}" data-v-99b6e9a1${_scopeId5}><h1 style="${ssrRenderStyle(`color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`)}" data-v-99b6e9a1${_scopeId5}>${ssrInterpolate(emailData.value.headline)}</h1></div><div class="email-content" style="${ssrRenderStyle(`padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`)}" data-v-99b6e9a1${_scopeId5}><!--[-->`);
                                    ssrRenderList(formattedParagraphs.value, (paragraph, i) => {
                                      _push6(`<p style="${ssrRenderStyle({ "margin-bottom": "16px", "line-height": "1.5" })}" data-v-99b6e9a1${_scopeId5}>${ssrInterpolate(paragraph)}</p>`);
                                    });
                                    _push6(`<!--]--><div style="${ssrRenderStyle({ "text-align": "center", "margin": "30px 0" })}" data-v-99b6e9a1${_scopeId5}><a${ssrRenderAttr("href", emailData.value.ctaUrl)} style="${ssrRenderStyle(`display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`)}" data-v-99b6e9a1${_scopeId5}>${ssrInterpolate(emailData.value.ctaText)}</a></div></div><div class="email-footer" style="${ssrRenderStyle(`text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`)}" data-v-99b6e9a1${_scopeId5}><p data-v-99b6e9a1${_scopeId5}>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} ${ssrInterpolate(emailData.value.companyName)}. All rights reserved.</p><p data-v-99b6e9a1${_scopeId5}>${ssrInterpolate(emailData.value.companyAddress)}</p><p data-v-99b6e9a1${_scopeId5}>To unsubscribe, <a href="http://localhost:3000/unsubscribe" style="${ssrRenderStyle(`color: ${emailData.value.colors.primary}; text-decoration: underline;`)}" data-v-99b6e9a1${_scopeId5}>click here</a>. </p></div></div></div></div>`);
                                    _push6(ssrRenderComponent(VCard, {
                                      class: "mt-4",
                                      elevation: "1"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VTabs, {
                                            modelValue: codeTab.value,
                                            "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                            "bg-color": "grey-lighten-4"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTab, { value: "html" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-language-html5`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-language-html5")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(` HTML `);
                                                    } else {
                                                      return [
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-language-html5")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" HTML ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VTab, { value: "vueEmail" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-vuejs`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-vuejs")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(` Vue Email `);
                                                    } else {
                                                      return [
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-vuejs")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Vue Email ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VTab, { value: "text" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`mdi-text`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-text")
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                      _push9(` Text `);
                                                    } else {
                                                      return [
                                                        createVNode(VIcon, {
                                                          size: "small",
                                                          class: "mr-1"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-text")
                                                          ]),
                                                          _: 1
                                                        }),
                                                        createTextVNode(" Text ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTab, { value: "html" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-language-html5")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" HTML ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VTab, { value: "vueEmail" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-vuejs")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Vue Email ")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VTab, { value: "text" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VIcon, {
                                                        size: "small",
                                                        class: "mr-1"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-text")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createTextVNode(" Text ")
                                                    ]),
                                                    _: 1
                                                  })
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VWindow, {
                                            modelValue: codeTab.value,
                                            "onUpdate:modelValue": ($event) => codeTab.value = $event
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VWindowItem, { value: "html" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" data-v-99b6e9a1${_scopeId9}><span class="text-caption text-white" data-v-99b6e9a1${_scopeId9}>HTML Code</span>`);
                                                            _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyHtml
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`Copy HTML`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("Copy HTML")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy HTML")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(`</div><pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto" style="${ssrRenderStyle({ "max-height": "300px", "margin": "0" })}" data-v-99b6e9a1${_scopeId9}><code data-v-99b6e9a1${_scopeId9}>${ssrInterpolate(generatedHtml.value)}</code></pre>`);
                                                          } else {
                                                            return [
                                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                                createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  icon: "mdi-content-copy",
                                                                  density: "comfortable",
                                                                  color: "white",
                                                                  variant: "text",
                                                                  onClick: copyHtml
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy HTML")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              createVNode("pre", {
                                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                                style: { "max-height": "300px", "margin": "0" }
                                                              }, [
                                                                createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCardText, { class: "code-container pa-0" }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                              createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                icon: "mdi-content-copy",
                                                                density: "comfortable",
                                                                color: "white",
                                                                variant: "text",
                                                                onClick: copyHtml
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Copy HTML")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            createVNode("pre", {
                                                              class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                              style: { "max-height": "300px", "margin": "0" }
                                                            }, [
                                                              createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VWindowItem, { value: "vueEmail" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" data-v-99b6e9a1${_scopeId9}><span class="text-caption text-white" data-v-99b6e9a1${_scopeId9}>Vue Email Template</span>`);
                                                            _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyVueEmailTemplate
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`Copy template`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("Copy template")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy template")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(`</div><pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto" style="${ssrRenderStyle({ "max-height": "300px", "margin": "0" })}" data-v-99b6e9a1${_scopeId9}><code data-v-99b6e9a1${_scopeId9}>${ssrInterpolate(emailTemplate.value)}</code></pre>`);
                                                          } else {
                                                            return [
                                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                                createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  icon: "mdi-content-copy",
                                                                  density: "comfortable",
                                                                  color: "white",
                                                                  variant: "text",
                                                                  onClick: copyVueEmailTemplate
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy template")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              createVNode("pre", {
                                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                                style: { "max-height": "300px", "margin": "0" }
                                                              }, [
                                                                createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCardText, { class: "code-container pa-0" }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                              createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                icon: "mdi-content-copy",
                                                                density: "comfortable",
                                                                color: "white",
                                                                variant: "text",
                                                                onClick: copyVueEmailTemplate
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Copy template")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            createVNode("pre", {
                                                              class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                              style: { "max-height": "300px", "margin": "0" }
                                                            }, [
                                                              createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                            ])
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(ssrRenderComponent(VWindowItem, { value: "text" }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(ssrRenderComponent(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                          if (_push10) {
                                                            _push10(`<div class="code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" data-v-99b6e9a1${_scopeId9}><span class="text-caption text-white" data-v-99b6e9a1${_scopeId9}>Text Version</span>`);
                                                            _push10(ssrRenderComponent(VSpacer, null, null, _parent10, _scopeId9));
                                                            _push10(ssrRenderComponent(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyText
                                                            }, {
                                                              default: withCtx((_10, _push11, _parent11, _scopeId10) => {
                                                                if (_push11) {
                                                                  _push11(ssrRenderComponent(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx((_11, _push12, _parent12, _scopeId11) => {
                                                                      if (_push12) {
                                                                        _push12(`Copy text`);
                                                                      } else {
                                                                        return [
                                                                          createTextVNode("Copy text")
                                                                        ];
                                                                      }
                                                                    }),
                                                                    _: 1
                                                                  }, _parent11, _scopeId10));
                                                                } else {
                                                                  return [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy text")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ];
                                                                }
                                                              }),
                                                              _: 1
                                                            }, _parent10, _scopeId9));
                                                            _push10(`</div><pre class="code-block pa-4 bg-grey-darken-4 text-white overflow-auto" style="${ssrRenderStyle({ "max-height": "300px", "margin": "0" })}" data-v-99b6e9a1${_scopeId9}><code data-v-99b6e9a1${_scopeId9}>${ssrInterpolate(generatedText.value)}</code></pre>`);
                                                          } else {
                                                            return [
                                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                                createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                                createVNode(VSpacer),
                                                                createVNode(VBtn, {
                                                                  icon: "mdi-content-copy",
                                                                  density: "comfortable",
                                                                  color: "white",
                                                                  variant: "text",
                                                                  onClick: copyText
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createVNode(VTooltip, {
                                                                      activator: "parent",
                                                                      location: "top"
                                                                    }, {
                                                                      default: withCtx(() => [
                                                                        createTextVNode("Copy text")
                                                                      ]),
                                                                      _: 1
                                                                    })
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              createVNode("pre", {
                                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                                style: { "max-height": "300px", "margin": "0" }
                                                              }, [
                                                                createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                              ])
                                                            ];
                                                          }
                                                        }),
                                                        _: 1
                                                      }, _parent9, _scopeId8));
                                                    } else {
                                                      return [
                                                        createVNode(VCardText, { class: "code-container pa-0" }, {
                                                          default: withCtx(() => [
                                                            createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                              createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                              createVNode(VSpacer),
                                                              createVNode(VBtn, {
                                                                icon: "mdi-content-copy",
                                                                density: "comfortable",
                                                                color: "white",
                                                                variant: "text",
                                                                onClick: copyText
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createVNode(VTooltip, {
                                                                    activator: "parent",
                                                                    location: "top"
                                                                  }, {
                                                                    default: withCtx(() => [
                                                                      createTextVNode("Copy text")
                                                                    ]),
                                                                    _: 1
                                                                  })
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            createVNode("pre", {
                                                              class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                              style: { "max-height": "300px", "margin": "0" }
                                                            }, [
                                                              createVNode("code", null, toDisplayString(generatedText.value), 1)
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
                                                  createVNode(VWindowItem, { value: "html" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                            createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyHtml
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VTooltip, {
                                                                  activator: "parent",
                                                                  location: "top"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Copy HTML")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          createVNode("pre", {
                                                            class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                            style: { "max-height": "300px", "margin": "0" }
                                                          }, [
                                                            createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                          ])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VWindowItem, { value: "vueEmail" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                            createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyVueEmailTemplate
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VTooltip, {
                                                                  activator: "parent",
                                                                  location: "top"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Copy template")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          createVNode("pre", {
                                                            class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                            style: { "max-height": "300px", "margin": "0" }
                                                          }, [
                                                            createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                          ])
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(VWindowItem, { value: "text" }, {
                                                    default: withCtx(() => [
                                                      createVNode(VCardText, { class: "code-container pa-0" }, {
                                                        default: withCtx(() => [
                                                          createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                            createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                            createVNode(VSpacer),
                                                            createVNode(VBtn, {
                                                              icon: "mdi-content-copy",
                                                              density: "comfortable",
                                                              color: "white",
                                                              variant: "text",
                                                              onClick: copyText
                                                            }, {
                                                              default: withCtx(() => [
                                                                createVNode(VTooltip, {
                                                                  activator: "parent",
                                                                  location: "top"
                                                                }, {
                                                                  default: withCtx(() => [
                                                                    createTextVNode("Copy text")
                                                                  ]),
                                                                  _: 1
                                                                })
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          createVNode("pre", {
                                                            class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                            style: { "max-height": "300px", "margin": "0" }
                                                          }, [
                                                            createVNode("code", null, toDisplayString(generatedText.value), 1)
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
                                            createVNode(VTabs, {
                                              modelValue: codeTab.value,
                                              "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                              "bg-color": "grey-lighten-4"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTab, { value: "html" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-language-html5")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" HTML ")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VTab, { value: "vueEmail" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-vuejs")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" Vue Email ")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VTab, { value: "text" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VIcon, {
                                                      size: "small",
                                                      class: "mr-1"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-text")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createTextVNode(" Text ")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VWindow, {
                                              modelValue: codeTab.value,
                                              "onUpdate:modelValue": ($event) => codeTab.value = $event
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VWindowItem, { value: "html" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "code-container pa-0" }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                          createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            icon: "mdi-content-copy",
                                                            density: "comfortable",
                                                            color: "white",
                                                            variant: "text",
                                                            onClick: copyHtml
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VTooltip, {
                                                                activator: "parent",
                                                                location: "top"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Copy HTML")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        createVNode("pre", {
                                                          class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                          style: { "max-height": "300px", "margin": "0" }
                                                        }, [
                                                          createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VWindowItem, { value: "vueEmail" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "code-container pa-0" }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                          createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            icon: "mdi-content-copy",
                                                            density: "comfortable",
                                                            color: "white",
                                                            variant: "text",
                                                            onClick: copyVueEmailTemplate
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VTooltip, {
                                                                activator: "parent",
                                                                location: "top"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Copy template")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        createVNode("pre", {
                                                          class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                          style: { "max-height": "300px", "margin": "0" }
                                                        }, [
                                                          createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VWindowItem, { value: "text" }, {
                                                  default: withCtx(() => [
                                                    createVNode(VCardText, { class: "code-container pa-0" }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                          createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                          createVNode(VSpacer),
                                                          createVNode(VBtn, {
                                                            icon: "mdi-content-copy",
                                                            density: "comfortable",
                                                            color: "white",
                                                            variant: "text",
                                                            onClick: copyText
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode(VTooltip, {
                                                                activator: "parent",
                                                                location: "top"
                                                              }, {
                                                                default: withCtx(() => [
                                                                  createTextVNode("Copy text")
                                                                ]),
                                                                _: 1
                                                              })
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        createVNode("pre", {
                                                          class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                          style: { "max-height": "300px", "margin": "0" }
                                                        }, [
                                                          createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                        ])
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["modelValue", "onUpdate:modelValue"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", {
                                        class: ["email-preview-container", viewMode.value]
                                      }, [
                                        createVNode("div", {
                                          ref_key: "emailPreview",
                                          ref: emailPreview,
                                          class: "email-preview"
                                        }, [
                                          createVNode("div", {
                                            class: "email-template",
                                            style: { backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" }
                                          }, [
                                            createVNode("div", {
                                              class: "email-header",
                                              style: `border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`
                                            }, [
                                              createVNode("img", {
                                                src: emailData.value.logoUrl,
                                                alt: emailData.value.companyName,
                                                style: { "max-width": "150px" }
                                              }, null, 8, ["src", "alt"]),
                                              createVNode("h1", {
                                                style: `color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`
                                              }, toDisplayString(emailData.value.headline), 5)
                                            ], 4),
                                            createVNode("div", {
                                              class: "email-content",
                                              style: `padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`
                                            }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(formattedParagraphs.value, (paragraph, i) => {
                                                return openBlock(), createBlock("p", {
                                                  key: i,
                                                  style: { "margin-bottom": "16px", "line-height": "1.5" }
                                                }, toDisplayString(paragraph), 1);
                                              }), 128)),
                                              createVNode("div", { style: { "text-align": "center", "margin": "30px 0" } }, [
                                                createVNode("a", {
                                                  href: emailData.value.ctaUrl,
                                                  style: `display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`
                                                }, toDisplayString(emailData.value.ctaText), 13, ["href"])
                                              ])
                                            ], 4),
                                            createVNode("div", {
                                              class: "email-footer",
                                              style: `text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`
                                            }, [
                                              createVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " " + toDisplayString(emailData.value.companyName) + ". All rights reserved.", 1),
                                              createVNode("p", null, toDisplayString(emailData.value.companyAddress), 1),
                                              createVNode("p", null, [
                                                createTextVNode("To unsubscribe, "),
                                                createVNode("a", {
                                                  href: "http://localhost:3000/unsubscribe",
                                                  style: `color: ${emailData.value.colors.primary}; text-decoration: underline;`
                                                }, "click here", 4),
                                                createTextVNode(". ")
                                              ])
                                            ], 4)
                                          ], 4)
                                        ], 512)
                                      ], 2),
                                      createVNode(VCard, {
                                        class: "mt-4",
                                        elevation: "1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTabs, {
                                            modelValue: codeTab.value,
                                            "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                            "bg-color": "grey-lighten-4"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTab, { value: "html" }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-language-html5")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" HTML ")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VTab, { value: "vueEmail" }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-vuejs")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Vue Email ")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VTab, { value: "text" }, {
                                                default: withCtx(() => [
                                                  createVNode(VIcon, {
                                                    size: "small",
                                                    class: "mr-1"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-text")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createTextVNode(" Text ")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VWindow, {
                                            modelValue: codeTab.value,
                                            "onUpdate:modelValue": ($event) => codeTab.value = $event
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VWindowItem, { value: "html" }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "code-container pa-0" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                        createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          icon: "mdi-content-copy",
                                                          density: "comfortable",
                                                          color: "white",
                                                          variant: "text",
                                                          onClick: copyHtml
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTooltip, {
                                                              activator: "parent",
                                                              location: "top"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Copy HTML")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      createVNode("pre", {
                                                        class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                        style: { "max-height": "300px", "margin": "0" }
                                                      }, [
                                                        createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VWindowItem, { value: "vueEmail" }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "code-container pa-0" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                        createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          icon: "mdi-content-copy",
                                                          density: "comfortable",
                                                          color: "white",
                                                          variant: "text",
                                                          onClick: copyVueEmailTemplate
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTooltip, {
                                                              activator: "parent",
                                                              location: "top"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Copy template")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      createVNode("pre", {
                                                        class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                        style: { "max-height": "300px", "margin": "0" }
                                                      }, [
                                                        createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VWindowItem, { value: "text" }, {
                                                default: withCtx(() => [
                                                  createVNode(VCardText, { class: "code-container pa-0" }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                        createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                        createVNode(VSpacer),
                                                        createVNode(VBtn, {
                                                          icon: "mdi-content-copy",
                                                          density: "comfortable",
                                                          color: "white",
                                                          variant: "text",
                                                          onClick: copyText
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode(VTooltip, {
                                                              activator: "parent",
                                                              location: "top"
                                                            }, {
                                                              default: withCtx(() => [
                                                                createTextVNode("Copy text")
                                                              ]),
                                                              _: 1
                                                            })
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      createVNode("pre", {
                                                        class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                        style: { "max-height": "300px", "margin": "0" }
                                                      }, [
                                                        createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                      ])
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["modelValue", "onUpdate:modelValue"])
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
                                createVNode(VToolbar, {
                                  color: "primary",
                                  flat: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VToolbarTitle, { class: "text-white" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Email preview")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VSpacer),
                                    createVNode(VBtnToggle, {
                                      modelValue: viewMode.value,
                                      "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                      color: "white",
                                      density: "comfortable",
                                      class: "mr-2",
                                      mandatory: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VBtn, {
                                          value: "desktop",
                                          class: "mr-2",
                                          "prepend-icon": "mdi-monitor"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Desktop")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VBtn, {
                                          value: "mobile",
                                          "prepend-icon": "mdi-cellphone"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Mobile")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode("div", {
                                      class: ["email-preview-container", viewMode.value]
                                    }, [
                                      createVNode("div", {
                                        ref_key: "emailPreview",
                                        ref: emailPreview,
                                        class: "email-preview"
                                      }, [
                                        createVNode("div", {
                                          class: "email-template",
                                          style: { backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" }
                                        }, [
                                          createVNode("div", {
                                            class: "email-header",
                                            style: `border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`
                                          }, [
                                            createVNode("img", {
                                              src: emailData.value.logoUrl,
                                              alt: emailData.value.companyName,
                                              style: { "max-width": "150px" }
                                            }, null, 8, ["src", "alt"]),
                                            createVNode("h1", {
                                              style: `color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`
                                            }, toDisplayString(emailData.value.headline), 5)
                                          ], 4),
                                          createVNode("div", {
                                            class: "email-content",
                                            style: `padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`
                                          }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(formattedParagraphs.value, (paragraph, i) => {
                                              return openBlock(), createBlock("p", {
                                                key: i,
                                                style: { "margin-bottom": "16px", "line-height": "1.5" }
                                              }, toDisplayString(paragraph), 1);
                                            }), 128)),
                                            createVNode("div", { style: { "text-align": "center", "margin": "30px 0" } }, [
                                              createVNode("a", {
                                                href: emailData.value.ctaUrl,
                                                style: `display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`
                                              }, toDisplayString(emailData.value.ctaText), 13, ["href"])
                                            ])
                                          ], 4),
                                          createVNode("div", {
                                            class: "email-footer",
                                            style: `text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`
                                          }, [
                                            createVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " " + toDisplayString(emailData.value.companyName) + ". All rights reserved.", 1),
                                            createVNode("p", null, toDisplayString(emailData.value.companyAddress), 1),
                                            createVNode("p", null, [
                                              createTextVNode("To unsubscribe, "),
                                              createVNode("a", {
                                                href: "http://localhost:3000/unsubscribe",
                                                style: `color: ${emailData.value.colors.primary}; text-decoration: underline;`
                                              }, "click here", 4),
                                              createTextVNode(". ")
                                            ])
                                          ], 4)
                                        ], 4)
                                      ], 512)
                                    ], 2),
                                    createVNode(VCard, {
                                      class: "mt-4",
                                      elevation: "1"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTabs, {
                                          modelValue: codeTab.value,
                                          "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                          "bg-color": "grey-lighten-4"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTab, { value: "html" }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  size: "small",
                                                  class: "mr-1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-language-html5")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" HTML ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VTab, { value: "vueEmail" }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  size: "small",
                                                  class: "mr-1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-vuejs")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Vue Email ")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VTab, { value: "text" }, {
                                              default: withCtx(() => [
                                                createVNode(VIcon, {
                                                  size: "small",
                                                  class: "mr-1"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-text")
                                                  ]),
                                                  _: 1
                                                }),
                                                createTextVNode(" Text ")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VWindow, {
                                          modelValue: codeTab.value,
                                          "onUpdate:modelValue": ($event) => codeTab.value = $event
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VWindowItem, { value: "html" }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "code-container pa-0" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                      createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        icon: "mdi-content-copy",
                                                        density: "comfortable",
                                                        color: "white",
                                                        variant: "text",
                                                        onClick: copyHtml
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTooltip, {
                                                            activator: "parent",
                                                            location: "top"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Copy HTML")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    createVNode("pre", {
                                                      class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                      style: { "max-height": "300px", "margin": "0" }
                                                    }, [
                                                      createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VWindowItem, { value: "vueEmail" }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "code-container pa-0" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                      createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        icon: "mdi-content-copy",
                                                        density: "comfortable",
                                                        color: "white",
                                                        variant: "text",
                                                        onClick: copyVueEmailTemplate
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTooltip, {
                                                            activator: "parent",
                                                            location: "top"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Copy template")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    createVNode("pre", {
                                                      class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                      style: { "max-height": "300px", "margin": "0" }
                                                    }, [
                                                      createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VWindowItem, { value: "text" }, {
                                              default: withCtx(() => [
                                                createVNode(VCardText, { class: "code-container pa-0" }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                      createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                      createVNode(VSpacer),
                                                      createVNode(VBtn, {
                                                        icon: "mdi-content-copy",
                                                        density: "comfortable",
                                                        color: "white",
                                                        variant: "text",
                                                        onClick: copyText
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(VTooltip, {
                                                            activator: "parent",
                                                            location: "top"
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode("Copy text")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    createVNode("pre", {
                                                      class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                      style: { "max-height": "300px", "margin": "0" }
                                                    }, [
                                                      createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                    ])
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["modelValue", "onUpdate:modelValue"])
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
                          createVNode(VCard, {
                            elevation: "2",
                            class: "rounded-lg"
                          }, {
                            default: withCtx(() => [
                              createVNode(VToolbar, {
                                color: "primary",
                                flat: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(VToolbarTitle, { class: "text-white" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Email preview")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VSpacer),
                                  createVNode(VBtnToggle, {
                                    modelValue: viewMode.value,
                                    "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                    color: "white",
                                    density: "comfortable",
                                    class: "mr-2",
                                    mandatory: ""
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VBtn, {
                                        value: "desktop",
                                        class: "mr-2",
                                        "prepend-icon": "mdi-monitor"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Desktop")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VBtn, {
                                        value: "mobile",
                                        "prepend-icon": "mdi-cellphone"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Mobile")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: ["email-preview-container", viewMode.value]
                                  }, [
                                    createVNode("div", {
                                      ref_key: "emailPreview",
                                      ref: emailPreview,
                                      class: "email-preview"
                                    }, [
                                      createVNode("div", {
                                        class: "email-template",
                                        style: { backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" }
                                      }, [
                                        createVNode("div", {
                                          class: "email-header",
                                          style: `border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`
                                        }, [
                                          createVNode("img", {
                                            src: emailData.value.logoUrl,
                                            alt: emailData.value.companyName,
                                            style: { "max-width": "150px" }
                                          }, null, 8, ["src", "alt"]),
                                          createVNode("h1", {
                                            style: `color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`
                                          }, toDisplayString(emailData.value.headline), 5)
                                        ], 4),
                                        createVNode("div", {
                                          class: "email-content",
                                          style: `padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`
                                        }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(formattedParagraphs.value, (paragraph, i) => {
                                            return openBlock(), createBlock("p", {
                                              key: i,
                                              style: { "margin-bottom": "16px", "line-height": "1.5" }
                                            }, toDisplayString(paragraph), 1);
                                          }), 128)),
                                          createVNode("div", { style: { "text-align": "center", "margin": "30px 0" } }, [
                                            createVNode("a", {
                                              href: emailData.value.ctaUrl,
                                              style: `display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`
                                            }, toDisplayString(emailData.value.ctaText), 13, ["href"])
                                          ])
                                        ], 4),
                                        createVNode("div", {
                                          class: "email-footer",
                                          style: `text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`
                                        }, [
                                          createVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " " + toDisplayString(emailData.value.companyName) + ". All rights reserved.", 1),
                                          createVNode("p", null, toDisplayString(emailData.value.companyAddress), 1),
                                          createVNode("p", null, [
                                            createTextVNode("To unsubscribe, "),
                                            createVNode("a", {
                                              href: "http://localhost:3000/unsubscribe",
                                              style: `color: ${emailData.value.colors.primary}; text-decoration: underline;`
                                            }, "click here", 4),
                                            createTextVNode(". ")
                                          ])
                                        ], 4)
                                      ], 4)
                                    ], 512)
                                  ], 2),
                                  createVNode(VCard, {
                                    class: "mt-4",
                                    elevation: "1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTabs, {
                                        modelValue: codeTab.value,
                                        "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                        "bg-color": "grey-lighten-4"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTab, { value: "html" }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-language-html5")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" HTML ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VTab, { value: "vueEmail" }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-vuejs")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Vue Email ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VTab, { value: "text" }, {
                                            default: withCtx(() => [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-text")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" Text ")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VWindow, {
                                        modelValue: codeTab.value,
                                        "onUpdate:modelValue": ($event) => codeTab.value = $event
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VWindowItem, { value: "html" }, {
                                            default: withCtx(() => [
                                              createVNode(VCardText, { class: "code-container pa-0" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                    createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      icon: "mdi-content-copy",
                                                      density: "comfortable",
                                                      color: "white",
                                                      variant: "text",
                                                      onClick: copyHtml
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTooltip, {
                                                          activator: "parent",
                                                          location: "top"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Copy HTML")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  createVNode("pre", {
                                                    class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                    style: { "max-height": "300px", "margin": "0" }
                                                  }, [
                                                    createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VWindowItem, { value: "vueEmail" }, {
                                            default: withCtx(() => [
                                              createVNode(VCardText, { class: "code-container pa-0" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                    createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      icon: "mdi-content-copy",
                                                      density: "comfortable",
                                                      color: "white",
                                                      variant: "text",
                                                      onClick: copyVueEmailTemplate
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTooltip, {
                                                          activator: "parent",
                                                          location: "top"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Copy template")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  createVNode("pre", {
                                                    class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                    style: { "max-height": "300px", "margin": "0" }
                                                  }, [
                                                    createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VWindowItem, { value: "text" }, {
                                            default: withCtx(() => [
                                              createVNode(VCardText, { class: "code-container pa-0" }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                    createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                    createVNode(VSpacer),
                                                    createVNode(VBtn, {
                                                      icon: "mdi-content-copy",
                                                      density: "comfortable",
                                                      color: "white",
                                                      variant: "text",
                                                      onClick: copyText
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VTooltip, {
                                                          activator: "parent",
                                                          location: "top"
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("Copy text")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  createVNode("pre", {
                                                    class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                    style: { "max-height": "300px", "margin": "0" }
                                                  }, [
                                                    createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                  ])
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue"])
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
                    createVNode(VCol, {
                      cols: "12",
                      md: "4",
                      lg: "3",
                      class: "pa-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          elevation: "2",
                          class: "rounded-lg"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 d-flex align-center" }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { class: "mr-2" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-email-edit")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Email Editor "),
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  icon: "mdi-send",
                                  color: "white",
                                  variant: "text",
                                  onClick: sendEmail,
                                  class: "mr-n2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTooltip, {
                                      activator: "parent",
                                      location: "bottom"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Send email")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VTabs, {
                              modelValue: configTab.value,
                              "onUpdate:modelValue": ($event) => configTab.value = $event,
                              "bg-color": "primary",
                              "show-arrows": ""
                            }, {
                              default: withCtx(() => [
                                createVNode(VTab, {
                                  value: "content",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "small",
                                      class: "mr-1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-file-document-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Content ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTab, {
                                  value: "style",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "small",
                                      class: "mr-1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-palette-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Style ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTab, {
                                  value: "company",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "small",
                                      class: "mr-1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-domain")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Company ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VTab, {
                                  value: "actions",
                                  class: "text-caption"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "small",
                                      class: "mr-1"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-cog")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Actions ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode(VForm, {
                                  ref_key: "form",
                                  ref: form
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: emailData.value.subject,
                                      "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                      label: "Email subject",
                                      variant: "outlined",
                                      density: "comfortable",
                                      class: "mb-4",
                                      "prepend-icon": "mdi-format-title",
                                      clearable: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VSelect, {
                                      modelValue: emailData.value.template,
                                      "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                      items: templates.value,
                                      label: "Template type",
                                      variant: "outlined",
                                      density: "comfortable",
                                      class: "mb-4",
                                      "prepend-icon": "mdi-file-document-outline"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                    createVNode(VDivider, { class: "my-4" }),
                                    createVNode(VWindow, {
                                      modelValue: configTab.value,
                                      "onUpdate:modelValue": ($event) => configTab.value = $event
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VWindowItem, { value: "content" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.preheader,
                                              "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                              label: "Pre-header",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-text-short",
                                              hint: "Text visible in email previews",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.headline,
                                              "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                              label: "Title",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-format-header-1",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextarea, {
                                              modelValue: emailData.value.mainContent,
                                              "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                              label: "Main content",
                                              variant: "outlined",
                                              rows: "6",
                                              "auto-grow": "",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-text",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.ctaText,
                                              "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                              label: "Button text",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-button-cursor",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.ctaUrl,
                                              "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                              label: "Button URL",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-link",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VWindowItem, { value: "style" }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "d-flex align-center mb-2" }, [
                                              createVNode(VIcon, { class: "mr-2" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-palette")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                            ]),
                                            createVNode(VColorPicker, {
                                              modelValue: emailData.value.colors.primary,
                                              "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                              "dot-size": "25",
                                              class: "mb-4"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode("div", { class: "d-flex align-center mb-2" }, [
                                              createVNode(VIcon, { class: "mr-2" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-palette-outline")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                            ]),
                                            createVNode(VColorPicker, {
                                              modelValue: emailData.value.colors.secondary,
                                              "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                              "dot-size": "25",
                                              class: "mb-4"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VSelect, {
                                              modelValue: emailData.value.font,
                                              "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                              items: fonts,
                                              label: "Font family",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-format-font"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VSwitch, {
                                              modelValue: emailData.value.darkMode,
                                              "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                              color: "primary",
                                              label: "Dark mode",
                                              "hide-details": "",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-theme-light-dark"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VWindowItem, { value: "company" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.logoUrl,
                                              "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                              label: "Logo URL",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-image"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.companyName,
                                              "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                              label: "Company name",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-domain",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VTextField, {
                                              modelValue: emailData.value.companyAddress,
                                              "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                              label: "Company address",
                                              variant: "outlined",
                                              density: "comfortable",
                                              class: "mb-4",
                                              "prepend-icon": "mdi-map-marker",
                                              clearable: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VWindowItem, { value: "actions" }, {
                                          default: withCtx(() => [
                                            createVNode(VList, null, {
                                              default: withCtx(() => [
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-content-copy",
                                                  title: "Copy HTML",
                                                  onClick: copyHtml,
                                                  class: "mb-2"
                                                }, {
                                                  append: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-chevron-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-code-tags",
                                                  title: "Copy Vue Email",
                                                  onClick: copyVueEmailTemplate,
                                                  class: "mb-2"
                                                }, {
                                                  append: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-chevron-right")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(VListItem, {
                                                  "prepend-icon": "mdi-send",
                                                  title: "Send email",
                                                  onClick: sendEmail,
                                                  class: "mb-2"
                                                }, {
                                                  append: withCtx(() => [
                                                    createVNode(VIcon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-chevron-right")
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
                                    }, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }, 512)
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
                      md: "8",
                      lg: "9",
                      class: "pa-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          elevation: "2",
                          class: "rounded-lg"
                        }, {
                          default: withCtx(() => [
                            createVNode(VToolbar, {
                              color: "primary",
                              flat: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(VToolbarTitle, { class: "text-white" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Email preview")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VSpacer),
                                createVNode(VBtnToggle, {
                                  modelValue: viewMode.value,
                                  "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                  color: "white",
                                  density: "comfortable",
                                  class: "mr-2",
                                  mandatory: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VBtn, {
                                      value: "desktop",
                                      class: "mr-2",
                                      "prepend-icon": "mdi-monitor"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Desktop")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VBtn, {
                                      value: "mobile",
                                      "prepend-icon": "mdi-cellphone"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Mobile")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, { class: "pa-4" }, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: ["email-preview-container", viewMode.value]
                                }, [
                                  createVNode("div", {
                                    ref_key: "emailPreview",
                                    ref: emailPreview,
                                    class: "email-preview"
                                  }, [
                                    createVNode("div", {
                                      class: "email-template",
                                      style: { backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" }
                                    }, [
                                      createVNode("div", {
                                        class: "email-header",
                                        style: `border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`
                                      }, [
                                        createVNode("img", {
                                          src: emailData.value.logoUrl,
                                          alt: emailData.value.companyName,
                                          style: { "max-width": "150px" }
                                        }, null, 8, ["src", "alt"]),
                                        createVNode("h1", {
                                          style: `color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`
                                        }, toDisplayString(emailData.value.headline), 5)
                                      ], 4),
                                      createVNode("div", {
                                        class: "email-content",
                                        style: `padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`
                                      }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(formattedParagraphs.value, (paragraph, i) => {
                                          return openBlock(), createBlock("p", {
                                            key: i,
                                            style: { "margin-bottom": "16px", "line-height": "1.5" }
                                          }, toDisplayString(paragraph), 1);
                                        }), 128)),
                                        createVNode("div", { style: { "text-align": "center", "margin": "30px 0" } }, [
                                          createVNode("a", {
                                            href: emailData.value.ctaUrl,
                                            style: `display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`
                                          }, toDisplayString(emailData.value.ctaText), 13, ["href"])
                                        ])
                                      ], 4),
                                      createVNode("div", {
                                        class: "email-footer",
                                        style: `text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`
                                      }, [
                                        createVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " " + toDisplayString(emailData.value.companyName) + ". All rights reserved.", 1),
                                        createVNode("p", null, toDisplayString(emailData.value.companyAddress), 1),
                                        createVNode("p", null, [
                                          createTextVNode("To unsubscribe, "),
                                          createVNode("a", {
                                            href: "http://localhost:3000/unsubscribe",
                                            style: `color: ${emailData.value.colors.primary}; text-decoration: underline;`
                                          }, "click here", 4),
                                          createTextVNode(". ")
                                        ])
                                      ], 4)
                                    ], 4)
                                  ], 512)
                                ], 2),
                                createVNode(VCard, {
                                  class: "mt-4",
                                  elevation: "1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTabs, {
                                      modelValue: codeTab.value,
                                      "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                      "bg-color": "grey-lighten-4"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTab, { value: "html" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-language-html5")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" HTML ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VTab, { value: "vueEmail" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-vuejs")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Vue Email ")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VTab, { value: "text" }, {
                                          default: withCtx(() => [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-text")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Text ")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VWindow, {
                                      modelValue: codeTab.value,
                                      "onUpdate:modelValue": ($event) => codeTab.value = $event
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VWindowItem, { value: "html" }, {
                                          default: withCtx(() => [
                                            createVNode(VCardText, { class: "code-container pa-0" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                  createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    icon: "mdi-content-copy",
                                                    density: "comfortable",
                                                    color: "white",
                                                    variant: "text",
                                                    onClick: copyHtml
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTooltip, {
                                                        activator: "parent",
                                                        location: "top"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Copy HTML")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                createVNode("pre", {
                                                  class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                  style: { "max-height": "300px", "margin": "0" }
                                                }, [
                                                  createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VWindowItem, { value: "vueEmail" }, {
                                          default: withCtx(() => [
                                            createVNode(VCardText, { class: "code-container pa-0" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                  createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    icon: "mdi-content-copy",
                                                    density: "comfortable",
                                                    color: "white",
                                                    variant: "text",
                                                    onClick: copyVueEmailTemplate
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTooltip, {
                                                        activator: "parent",
                                                        location: "top"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Copy template")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                createVNode("pre", {
                                                  class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                  style: { "max-height": "300px", "margin": "0" }
                                                }, [
                                                  createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VWindowItem, { value: "text" }, {
                                          default: withCtx(() => [
                                            createVNode(VCardText, { class: "code-container pa-0" }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                  createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                  createVNode(VSpacer),
                                                  createVNode(VBtn, {
                                                    icon: "mdi-content-copy",
                                                    density: "comfortable",
                                                    color: "white",
                                                    variant: "text",
                                                    onClick: copyText
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VTooltip, {
                                                        activator: "parent",
                                                        location: "top"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Copy text")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                createVNode("pre", {
                                                  class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                  style: { "max-height": "300px", "margin": "0" }
                                                }, [
                                                  createVNode("code", null, toDisplayString(generatedText.value), 1)
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue"])
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
            _push2(ssrRenderComponent(VSnackbar, {
              modelValue: snackbar.value.show,
              "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
              color: snackbar.value.color,
              timeout: "3000",
              location: "top"
            }, {
              actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VBtn, {
                    icon: "mdi-close",
                    variant: "text",
                    onClick: ($event) => snackbar.value.show = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VBtn, {
                      icon: "mdi-close",
                      variant: "text",
                      onClick: ($event) => snackbar.value.show = false
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex align-center" data-v-99b6e9a1${_scopeId2}>`);
                  _push3(ssrRenderComponent(VIcon, {
                    class: "mr-2",
                    icon: snackbar.value.color === "success" ? "mdi-check-circle" : "mdi-alert-circle"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(snackbar.value.text)}</div>`);
                } else {
                  return [
                    createVNode("div", { class: "d-flex align-center" }, [
                      createVNode(VIcon, {
                        class: "mr-2",
                        icon: snackbar.value.color === "success" ? "mdi-check-circle" : "mdi-alert-circle"
                      }, null, 8, ["icon"]),
                      createTextVNode(" " + toDisplayString(snackbar.value.text), 1)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VRow, { "no-gutters": "" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    md: "4",
                    lg: "3",
                    class: "pa-2"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        elevation: "2",
                        class: "rounded-lg"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 d-flex align-center" }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { class: "mr-2" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-email-edit")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Email Editor "),
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                icon: "mdi-send",
                                color: "white",
                                variant: "text",
                                onClick: sendEmail,
                                class: "mr-n2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTooltip, {
                                    activator: "parent",
                                    location: "bottom"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Send email")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VTabs, {
                            modelValue: configTab.value,
                            "onUpdate:modelValue": ($event) => configTab.value = $event,
                            "bg-color": "primary",
                            "show-arrows": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(VTab, {
                                value: "content",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "small",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-file-document-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Content ")
                                ]),
                                _: 1
                              }),
                              createVNode(VTab, {
                                value: "style",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "small",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-palette-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Style ")
                                ]),
                                _: 1
                              }),
                              createVNode(VTab, {
                                value: "company",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "small",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-domain")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Company ")
                                ]),
                                _: 1
                              }),
                              createVNode(VTab, {
                                value: "actions",
                                class: "text-caption"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "small",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-cog")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Actions ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(VCardText, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode(VForm, {
                                ref_key: "form",
                                ref: form
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: emailData.value.subject,
                                    "onUpdate:modelValue": ($event) => emailData.value.subject = $event,
                                    label: "Email subject",
                                    variant: "outlined",
                                    density: "comfortable",
                                    class: "mb-4",
                                    "prepend-icon": "mdi-format-title",
                                    clearable: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VSelect, {
                                    modelValue: emailData.value.template,
                                    "onUpdate:modelValue": [($event) => emailData.value.template = $event, loadTemplate],
                                    items: templates.value,
                                    label: "Template type",
                                    variant: "outlined",
                                    density: "comfortable",
                                    class: "mb-4",
                                    "prepend-icon": "mdi-file-document-outline"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode(VWindow, {
                                    modelValue: configTab.value,
                                    "onUpdate:modelValue": ($event) => configTab.value = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VWindowItem, { value: "content" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.preheader,
                                            "onUpdate:modelValue": ($event) => emailData.value.preheader = $event,
                                            label: "Pre-header",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-text-short",
                                            hint: "Text visible in email previews",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.headline,
                                            "onUpdate:modelValue": ($event) => emailData.value.headline = $event,
                                            label: "Title",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-format-header-1",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextarea, {
                                            modelValue: emailData.value.mainContent,
                                            "onUpdate:modelValue": ($event) => emailData.value.mainContent = $event,
                                            label: "Main content",
                                            variant: "outlined",
                                            rows: "6",
                                            "auto-grow": "",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-text",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.ctaText,
                                            "onUpdate:modelValue": ($event) => emailData.value.ctaText = $event,
                                            label: "Button text",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-button-cursor",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.ctaUrl,
                                            "onUpdate:modelValue": ($event) => emailData.value.ctaUrl = $event,
                                            label: "Button URL",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-link",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VWindowItem, { value: "style" }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "d-flex align-center mb-2" }, [
                                            createVNode(VIcon, { class: "mr-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-palette")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "text-subtitle-1" }, "Primary color")
                                          ]),
                                          createVNode(VColorPicker, {
                                            modelValue: emailData.value.colors.primary,
                                            "onUpdate:modelValue": ($event) => emailData.value.colors.primary = $event,
                                            "dot-size": "25",
                                            class: "mb-4"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode("div", { class: "d-flex align-center mb-2" }, [
                                            createVNode(VIcon, { class: "mr-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-palette-outline")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "text-subtitle-1" }, "Secondary color")
                                          ]),
                                          createVNode(VColorPicker, {
                                            modelValue: emailData.value.colors.secondary,
                                            "onUpdate:modelValue": ($event) => emailData.value.colors.secondary = $event,
                                            "dot-size": "25",
                                            class: "mb-4"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VSelect, {
                                            modelValue: emailData.value.font,
                                            "onUpdate:modelValue": ($event) => emailData.value.font = $event,
                                            items: fonts,
                                            label: "Font family",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-format-font"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VSwitch, {
                                            modelValue: emailData.value.darkMode,
                                            "onUpdate:modelValue": ($event) => emailData.value.darkMode = $event,
                                            color: "primary",
                                            label: "Dark mode",
                                            "hide-details": "",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-theme-light-dark"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VWindowItem, { value: "company" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.logoUrl,
                                            "onUpdate:modelValue": ($event) => emailData.value.logoUrl = $event,
                                            label: "Logo URL",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-image"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.companyName,
                                            "onUpdate:modelValue": ($event) => emailData.value.companyName = $event,
                                            label: "Company name",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-domain",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VTextField, {
                                            modelValue: emailData.value.companyAddress,
                                            "onUpdate:modelValue": ($event) => emailData.value.companyAddress = $event,
                                            label: "Company address",
                                            variant: "outlined",
                                            density: "comfortable",
                                            class: "mb-4",
                                            "prepend-icon": "mdi-map-marker",
                                            clearable: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VWindowItem, { value: "actions" }, {
                                        default: withCtx(() => [
                                          createVNode(VList, null, {
                                            default: withCtx(() => [
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-content-copy",
                                                title: "Copy HTML",
                                                onClick: copyHtml,
                                                class: "mb-2"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode(VIcon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-chevron-right")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-code-tags",
                                                title: "Copy Vue Email",
                                                onClick: copyVueEmailTemplate,
                                                class: "mb-2"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode(VIcon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-chevron-right")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(VListItem, {
                                                "prepend-icon": "mdi-send",
                                                title: "Send email",
                                                onClick: sendEmail,
                                                class: "mb-2"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode(VIcon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-chevron-right")
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
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }, 512)
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
                    md: "8",
                    lg: "9",
                    class: "pa-2"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        elevation: "2",
                        class: "rounded-lg"
                      }, {
                        default: withCtx(() => [
                          createVNode(VToolbar, {
                            color: "primary",
                            flat: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(VToolbarTitle, { class: "text-white" }, {
                                default: withCtx(() => [
                                  createTextVNode("Email preview")
                                ]),
                                _: 1
                              }),
                              createVNode(VSpacer),
                              createVNode(VBtnToggle, {
                                modelValue: viewMode.value,
                                "onUpdate:modelValue": ($event) => viewMode.value = $event,
                                color: "white",
                                density: "comfortable",
                                class: "mr-2",
                                mandatory: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(VBtn, {
                                    value: "desktop",
                                    class: "mr-2",
                                    "prepend-icon": "mdi-monitor"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Desktop")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VBtn, {
                                    value: "mobile",
                                    "prepend-icon": "mdi-cellphone"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Mobile")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pa-4" }, {
                            default: withCtx(() => [
                              createVNode("div", {
                                class: ["email-preview-container", viewMode.value]
                              }, [
                                createVNode("div", {
                                  ref_key: "emailPreview",
                                  ref: emailPreview,
                                  class: "email-preview"
                                }, [
                                  createVNode("div", {
                                    class: "email-template",
                                    style: { backgroundColor: emailData.value.darkMode ? "#2a2a2a" : "#ffffff", color: emailData.value.darkMode ? "#ffffff" : "#111827" }
                                  }, [
                                    createVNode("div", {
                                      class: "email-header",
                                      style: `border-bottom: 2px solid ${emailData.value.colors.primary}; padding: 20px; text-align: center;`
                                    }, [
                                      createVNode("img", {
                                        src: emailData.value.logoUrl,
                                        alt: emailData.value.companyName,
                                        style: { "max-width": "150px" }
                                      }, null, 8, ["src", "alt"]),
                                      createVNode("h1", {
                                        style: `color: ${emailData.value.colors.primary}; font-family: ${emailData.value.font}, sans-serif; margin-top: 15px;`
                                      }, toDisplayString(emailData.value.headline), 5)
                                    ], 4),
                                    createVNode("div", {
                                      class: "email-content",
                                      style: `padding: 30px 20px; font-family: ${emailData.value.font}, sans-serif;`
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(formattedParagraphs.value, (paragraph, i) => {
                                        return openBlock(), createBlock("p", {
                                          key: i,
                                          style: { "margin-bottom": "16px", "line-height": "1.5" }
                                        }, toDisplayString(paragraph), 1);
                                      }), 128)),
                                      createVNode("div", { style: { "text-align": "center", "margin": "30px 0" } }, [
                                        createVNode("a", {
                                          href: emailData.value.ctaUrl,
                                          style: `display: inline-block; padding: 12px 24px; background-color: ${emailData.value.colors.primary}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;`
                                        }, toDisplayString(emailData.value.ctaText), 13, ["href"])
                                      ])
                                    ], 4),
                                    createVNode("div", {
                                      class: "email-footer",
                                      style: `text-align: center; padding: 20px; border-top: 1px solid ${emailData.value.darkMode ? "#444" : "#eee"}; font-size: 12px; color: ${emailData.value.darkMode ? "#aaa" : "#666"}; font-family: ${emailData.value.font}, sans-serif;`
                                    }, [
                                      createVNode("p", null, "© " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " " + toDisplayString(emailData.value.companyName) + ". All rights reserved.", 1),
                                      createVNode("p", null, toDisplayString(emailData.value.companyAddress), 1),
                                      createVNode("p", null, [
                                        createTextVNode("To unsubscribe, "),
                                        createVNode("a", {
                                          href: "http://localhost:3000/unsubscribe",
                                          style: `color: ${emailData.value.colors.primary}; text-decoration: underline;`
                                        }, "click here", 4),
                                        createTextVNode(". ")
                                      ])
                                    ], 4)
                                  ], 4)
                                ], 512)
                              ], 2),
                              createVNode(VCard, {
                                class: "mt-4",
                                elevation: "1"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTabs, {
                                    modelValue: codeTab.value,
                                    "onUpdate:modelValue": ($event) => codeTab.value = $event,
                                    "bg-color": "grey-lighten-4"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTab, { value: "html" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-language-html5")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" HTML ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VTab, { value: "vueEmail" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-vuejs")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Vue Email ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VTab, { value: "text" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-text")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Text ")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VWindow, {
                                    modelValue: codeTab.value,
                                    "onUpdate:modelValue": ($event) => codeTab.value = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VWindowItem, { value: "html" }, {
                                        default: withCtx(() => [
                                          createVNode(VCardText, { class: "code-container pa-0" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                createVNode("span", { class: "text-caption text-white" }, "HTML Code"),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  icon: "mdi-content-copy",
                                                  density: "comfortable",
                                                  color: "white",
                                                  variant: "text",
                                                  onClick: copyHtml
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTooltip, {
                                                      activator: "parent",
                                                      location: "top"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Copy HTML")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              createVNode("pre", {
                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                style: { "max-height": "300px", "margin": "0" }
                                              }, [
                                                createVNode("code", null, toDisplayString(generatedHtml.value), 1)
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VWindowItem, { value: "vueEmail" }, {
                                        default: withCtx(() => [
                                          createVNode(VCardText, { class: "code-container pa-0" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                createVNode("span", { class: "text-caption text-white" }, "Vue Email Template"),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  icon: "mdi-content-copy",
                                                  density: "comfortable",
                                                  color: "white",
                                                  variant: "text",
                                                  onClick: copyVueEmailTemplate
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTooltip, {
                                                      activator: "parent",
                                                      location: "top"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Copy template")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              createVNode("pre", {
                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                style: { "max-height": "300px", "margin": "0" }
                                              }, [
                                                createVNode("code", null, toDisplayString(emailTemplate.value), 1)
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VWindowItem, { value: "text" }, {
                                        default: withCtx(() => [
                                          createVNode(VCardText, { class: "code-container pa-0" }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "code-toolbar d-flex align-center px-4 py-2 bg-grey-darken-3" }, [
                                                createVNode("span", { class: "text-caption text-white" }, "Text Version"),
                                                createVNode(VSpacer),
                                                createVNode(VBtn, {
                                                  icon: "mdi-content-copy",
                                                  density: "comfortable",
                                                  color: "white",
                                                  variant: "text",
                                                  onClick: copyText
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VTooltip, {
                                                      activator: "parent",
                                                      location: "top"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Copy text")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              createVNode("pre", {
                                                class: "code-block pa-4 bg-grey-darken-4 text-white overflow-auto",
                                                style: { "max-height": "300px", "margin": "0" }
                                              }, [
                                                createVNode("code", null, toDisplayString(generatedText.value), 1)
                                              ])
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"])
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
              createVNode(VSnackbar, {
                modelValue: snackbar.value.show,
                "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                color: snackbar.value.color,
                timeout: "3000",
                location: "top"
              }, {
                actions: withCtx(() => [
                  createVNode(VBtn, {
                    icon: "mdi-close",
                    variant: "text",
                    onClick: ($event) => snackbar.value.show = false
                  }, null, 8, ["onClick"])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex align-center" }, [
                    createVNode(VIcon, {
                      class: "mr-2",
                      icon: snackbar.value.color === "success" ? "mdi-check-circle" : "mdi-alert-circle"
                    }, null, 8, ["icon"]),
                    createTextVNode(" " + toDisplayString(snackbar.value.text), 1)
                  ])
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

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/email-editor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EmailEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-99b6e9a1"]]);

const _sfc_main = /* @__PURE__ */ defineComponent$1({
  __name: "newsletter-admin",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Newsletter Admin - DevUnity",
      meta: [
        { name: "description", content: "Admin dashboard for managing newsletters" },
        { name: "keywords", content: "DevUnity, newsletter, admin, dashboard, management" },
        { name: "author", content: "DevUnity" },
        { name: "robots", content: "noindex, nofollow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "og:title", content: "Newsletter Admin - DevUnity" },
        { name: "og:description", content: "Admin dashboard for managing newsletters" },
        { name: "og:image", content: "/logo/devunity-title.png" }
      ]
    });
    const userStore = useUserStore();
    ref(false);
    const newsletterName = ref("");
    const subscriberCount = ref(0);
    const sentEmails = ref(0);
    const subscribersList = ref([]);
    const newsletters = ref([]);
    const newsletter = ref(null);
    const addNewsletter = ref(false);
    const loadStats = async () => {
      try {
        const response = await fetch("/api/newsletter/stats", {
          headers: {
            "Authorization": `Bearer ${userStore.token}`
          }
        });
        const data = await response.json();
        if (data.stats && data.stats.length > 0) {
          newsletters.value = data.stats;
          newsletter.value = data.stats[0];
          newsletterName.value = newsletters.value[0].name;
          subscriberCount.value = newsletters.value[0].subscribers;
          sentEmails.value = newsletters.value[0].emails_sent;
          console.log("Newsletters chargées:", newsletters.value);
          console.log("Newsletter actuelle:", newsletter.value);
        } else {
          console.warn("Aucune newsletter trouvée dans les données");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        showSnackbar("Erreur lors du chargement des statistiques", "error");
      }
    };
    ref({
      subject: "",
      template: "welcome",
      content: ""
    });
    const emailHistory = ref([
      { subject: "Welcome to our newsletter", date: "2023-10-15", status: "sent", opens: 45 },
      { subject: "New features - October 2023", date: "2023-10-01", status: "sent", opens: 38 },
      { subject: "Special offer for our subscribers", date: "2023-09-15", status: "sent", opens: 42 }
    ]);
    const headers = ref([
      { title: "Email", key: "email" },
      { title: "Subscription Date", key: "date" },
      { title: "Status", key: "status" }
    ]);
    const search = ref("");
    const loading = ref(false);
    const snackbar = ref({
      show: false,
      text: "",
      color: "success"
    });
    const createNewsletter = async () => {
      try {
        await userStore.addNewsletter(newsletterName.value);
        loadStats();
        showSnackbar("Newsletter créé avec succès", "success");
        addNewsletter.value = false;
      } catch (error) {
        console.error("Erreur lors de la création de la newsletter:", error);
        showSnackbar("Erreur lors de la création de la newsletter", "error");
      }
    };
    const exportSubscribers = () => {
      const headers2 = ["Email", "Subscription Date", "Status"];
      const csvContent = [
        headers2.join(","),
        ...subscribersList.value.map((sub) => [
          sub.email,
          new Date(sub.date).toLocaleDateString("en-US"),
          sub.status
        ].join(","))
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = (void 0).createElement("a");
      link.href = url;
      link.setAttribute("download", `newsletter_subscribers_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
      (void 0).body.appendChild(link);
      link.click();
      (void 0).body.removeChild(link);
      showSnackbar("CSV export successful", "success");
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    };
    const getStatusColor = (status) => {
      switch (status) {
        case "sent":
          return "success";
        case "draft":
          return "info";
        case "failed":
          return "error";
        default:
          return "grey";
      }
    };
    const showSnackbar = (text, color) => {
      snackbar.value = {
        show: true,
        text,
        color
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VAppBar, {
              flat: "",
              color: "primary",
              class: "px-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VIcon, {
                    size: "large",
                    class: "mr-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`mdi-email-newsletter`);
                      } else {
                        return [
                          createTextVNode("mdi-email-newsletter")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(newsletterName.value)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(newsletterName.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VSpacer, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VBtn, {
                    "prepend-icon": "mdi-download",
                    variant: "text",
                    onClick: exportSubscribers
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Export CSV `);
                      } else {
                        return [
                          createTextVNode(" Export CSV ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VBtn, {
                    "prepend-icon": "mdi-plus",
                    variant: "text",
                    onClick: ($event) => addNewsletter.value = true
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Add Newsletter `);
                      } else {
                        return [
                          createTextVNode(" Add Newsletter ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VIcon, {
                      size: "large",
                      class: "mr-3"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-email-newsletter")
                      ]),
                      _: 1
                    }),
                    createVNode(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(newsletterName.value), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(VSpacer),
                    createVNode(VBtn, {
                      "prepend-icon": "mdi-download",
                      variant: "text",
                      onClick: exportSubscribers
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Export CSV ")
                      ]),
                      _: 1
                    }),
                    createVNode(VBtn, {
                      "prepend-icon": "mdi-plus",
                      variant: "text",
                      onClick: ($event) => addNewsletter.value = true
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Add Newsletter ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, { class: "ma-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "6"
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
                                            color: "primary",
                                            class: "mb-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-account-group`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-account-group")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`<div class="text-h4 font-weight-bold" data-v-c9610d37${_scopeId6}>${ssrInterpolate(subscriberCount.value)}</div><div class="text-subtitle-1 text-medium-emphasis" data-v-c9610d37${_scopeId6}>Subscribers</div>`);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "48",
                                              color: "primary",
                                              class: "mb-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-account-group")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                            createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "48",
                                            color: "primary",
                                            class: "mb-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-account-group")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                          createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
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
                                  elevation: "2",
                                  height: "100%"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "48",
                                          color: "primary",
                                          class: "mb-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-account-group")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                        createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
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
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "6"
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
                                            color: "info",
                                            class: "mb-2"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-email-outline`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-email-outline")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`<div class="text-h4 font-weight-bold" data-v-c9610d37${_scopeId6}>${ssrInterpolate(sentEmails.value)}</div><div class="text-subtitle-1 text-medium-emphasis" data-v-c9610d37${_scopeId6}>Emails sent</div>`);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              size: "48",
                                              color: "info",
                                              class: "mb-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-email-outline")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                            createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, {
                                            size: "48",
                                            color: "info",
                                            class: "mb-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-email-outline")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                          createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
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
                                  elevation: "2",
                                  height: "100%"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, {
                                          size: "48",
                                          color: "info",
                                          class: "mb-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-email-outline")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                        createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
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
                          createVNode(VCol, {
                            cols: "12",
                            md: "6"
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
                                        color: "primary",
                                        class: "mb-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-account-group")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                      createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
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
                                class: "rounded-lg",
                                elevation: "2",
                                height: "100%"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        size: "48",
                                        color: "info",
                                        class: "mb-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-email-outline")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                      createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
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
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "8"
                        }, {
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
                                                _push8(`mdi-account-group`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-account-group")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Subscribers List `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-account-group")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Subscribers List ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VCardText, { class: "pa-4" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VTextField, {
                                            modelValue: search.value,
                                            "onUpdate:modelValue": ($event) => search.value = $event,
                                            "prepend-inner-icon": "mdi-magnify",
                                            label: "Search subscriber",
                                            "single-line": "",
                                            variant: "outlined",
                                            density: "comfortable",
                                            "hide-details": "",
                                            class: "mb-4"
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VDataTable, {
                                            headers: headers.value,
                                            items: subscribersList.value,
                                            search: search.value,
                                            loading: loading.value,
                                            class: "elevation-1 rounded"
                                          }, {
                                            "item.status": withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VChip, {
                                                  color: item.status === "active" ? "success" : "error",
                                                  size: "small"
                                                }, {
                                                  default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`${ssrInterpolate(item.status === "active" ? "Active" : "Unsubscribed")}`);
                                                    } else {
                                                      return [
                                                        createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VChip, {
                                                    color: item.status === "active" ? "success" : "error",
                                                    size: "small"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ];
                                              }
                                            }),
                                            "item.date": withCtx(({ item }, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`${ssrInterpolate(new Date(item.date).toLocaleDateString("en-US"))}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VTextField, {
                                              modelValue: search.value,
                                              "onUpdate:modelValue": ($event) => search.value = $event,
                                              "prepend-inner-icon": "mdi-magnify",
                                              label: "Search subscriber",
                                              "single-line": "",
                                              variant: "outlined",
                                              density: "comfortable",
                                              "hide-details": "",
                                              class: "mb-4"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                            createVNode(VDataTable, {
                                              headers: headers.value,
                                              items: subscribersList.value,
                                              search: search.value,
                                              loading: loading.value,
                                              class: "elevation-1 rounded"
                                            }, {
                                              "item.status": withCtx(({ item }) => [
                                                createVNode(VChip, {
                                                  color: item.status === "active" ? "success" : "error",
                                                  size: "small"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              "item.date": withCtx(({ item }) => [
                                                createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["headers", "items", "search", "loading"])
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
                                              createTextVNode("mdi-account-group")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Subscribers List ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-4" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: search.value,
                                            "onUpdate:modelValue": ($event) => search.value = $event,
                                            "prepend-inner-icon": "mdi-magnify",
                                            label: "Search subscriber",
                                            "single-line": "",
                                            variant: "outlined",
                                            density: "comfortable",
                                            "hide-details": "",
                                            class: "mb-4"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(VDataTable, {
                                            headers: headers.value,
                                            items: subscribersList.value,
                                            search: search.value,
                                            loading: loading.value,
                                            class: "elevation-1 rounded"
                                          }, {
                                            "item.status": withCtx(({ item }) => [
                                              createVNode(VChip, {
                                                color: item.status === "active" ? "success" : "error",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            "item.date": withCtx(({ item }) => [
                                              createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["headers", "items", "search", "loading"])
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
                                            createTextVNode("mdi-account-group")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Subscribers List ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-4" }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: search.value,
                                          "onUpdate:modelValue": ($event) => search.value = $event,
                                          "prepend-inner-icon": "mdi-magnify",
                                          label: "Search subscriber",
                                          "single-line": "",
                                          variant: "outlined",
                                          density: "comfortable",
                                          "hide-details": "",
                                          class: "mb-4"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode(VDataTable, {
                                          headers: headers.value,
                                          items: subscribersList.value,
                                          search: search.value,
                                          loading: loading.value,
                                          class: "elevation-1 rounded"
                                        }, {
                                          "item.status": withCtx(({ item }) => [
                                            createVNode(VChip, {
                                              color: item.status === "active" ? "success" : "error",
                                              size: "small"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          "item.date": withCtx(({ item }) => [
                                            createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["headers", "items", "search", "loading"])
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
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "4"
                        }, {
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
                                                _push8(`mdi-history`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-history")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Email History `);
                                        } else {
                                          return [
                                            createVNode(VIcon, {
                                              color: "white",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-history")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Email History ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VCardText, { class: "pa-0" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VList, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(emailHistory.value, (item, index) => {
                                                  _push8(ssrRenderComponent(VListItem, {
                                                    key: index,
                                                    subtitle: formatDate(item.date),
                                                    "prepend-icon": "mdi-email-outline"
                                                  }, {
                                                    append: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VChip, {
                                                          size: "x-small",
                                                          color: getStatusColor(item.status)
                                                        }, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(item.status)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(item.status), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VChip, {
                                                            size: "x-small",
                                                            color: getStatusColor(item.status)
                                                          }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(item.status), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1032, ["color"])
                                                        ];
                                                      }
                                                    }),
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(item.subject)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(item.subject), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(item.subject), 1)
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
                                                  (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                                    return openBlock(), createBlock(VListItem, {
                                                      key: index,
                                                      subtitle: formatDate(item.date),
                                                      "prepend-icon": "mdi-email-outline"
                                                    }, {
                                                      append: withCtx(() => [
                                                        createVNode(VChip, {
                                                          size: "x-small",
                                                          color: getStatusColor(item.status)
                                                        }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(item.status), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1032, ["color"])
                                                      ]),
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(item.subject), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["subtitle"]);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VList, null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                                  return openBlock(), createBlock(VListItem, {
                                                    key: index,
                                                    subtitle: formatDate(item.date),
                                                    "prepend-icon": "mdi-email-outline"
                                                  }, {
                                                    append: withCtx(() => [
                                                      createVNode(VChip, {
                                                        size: "x-small",
                                                        color: getStatusColor(item.status)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(item.status), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ]),
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(item.subject), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["subtitle"]);
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
                                              createTextVNode("mdi-history")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Email History ")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCardText, { class: "pa-0" }, {
                                        default: withCtx(() => [
                                          createVNode(VList, null, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                                return openBlock(), createBlock(VListItem, {
                                                  key: index,
                                                  subtitle: formatDate(item.date),
                                                  "prepend-icon": "mdi-email-outline"
                                                }, {
                                                  append: withCtx(() => [
                                                    createVNode(VChip, {
                                                      size: "x-small",
                                                      color: getStatusColor(item.status)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(item.status), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ]),
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(item.subject), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["subtitle"]);
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
                                            createTextVNode("mdi-history")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Email History ")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCardText, { class: "pa-0" }, {
                                      default: withCtx(() => [
                                        createVNode(VList, null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                              return openBlock(), createBlock(VListItem, {
                                                key: index,
                                                subtitle: formatDate(item.date),
                                                "prepend-icon": "mdi-email-outline"
                                              }, {
                                                append: withCtx(() => [
                                                  createVNode(VChip, {
                                                    size: "x-small",
                                                    color: getStatusColor(item.status)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.status), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.subject), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["subtitle"]);
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
                          createVNode(VCol, {
                            cols: "12",
                            md: "8"
                          }, {
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
                                          createTextVNode("mdi-account-group")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Subscribers List ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-4" }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: search.value,
                                        "onUpdate:modelValue": ($event) => search.value = $event,
                                        "prepend-inner-icon": "mdi-magnify",
                                        label: "Search subscriber",
                                        "single-line": "",
                                        variant: "outlined",
                                        density: "comfortable",
                                        "hide-details": "",
                                        class: "mb-4"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(VDataTable, {
                                        headers: headers.value,
                                        items: subscribersList.value,
                                        search: search.value,
                                        loading: loading.value,
                                        class: "elevation-1 rounded"
                                      }, {
                                        "item.status": withCtx(({ item }) => [
                                          createVNode(VChip, {
                                            color: item.status === "active" ? "success" : "error",
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        "item.date": withCtx(({ item }) => [
                                          createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["headers", "items", "search", "loading"])
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
                                          createTextVNode("mdi-history")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Email History ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCardText, { class: "pa-0" }, {
                                    default: withCtx(() => [
                                      createVNode(VList, null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                            return openBlock(), createBlock(VListItem, {
                                              key: index,
                                              subtitle: formatDate(item.date),
                                              "prepend-icon": "mdi-email-outline"
                                            }, {
                                              append: withCtx(() => [
                                                createVNode(VChip, {
                                                  size: "x-small",
                                                  color: getStatusColor(item.status)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.status), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.subject), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["subtitle"]);
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
                  _push3(ssrRenderComponent(EmailEditor, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "6"
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
                                      color: "primary",
                                      class: "mb-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-account-group")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                    createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
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
                              class: "rounded-lg",
                              elevation: "2",
                              height: "100%"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      size: "48",
                                      color: "info",
                                      class: "mb-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-email-outline")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                    createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
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
                        createVNode(VCol, {
                          cols: "12",
                          md: "8"
                        }, {
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
                                        createTextVNode("mdi-account-group")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Subscribers List ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-4" }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: search.value,
                                      "onUpdate:modelValue": ($event) => search.value = $event,
                                      "prepend-inner-icon": "mdi-magnify",
                                      label: "Search subscriber",
                                      "single-line": "",
                                      variant: "outlined",
                                      density: "comfortable",
                                      "hide-details": "",
                                      class: "mb-4"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode(VDataTable, {
                                      headers: headers.value,
                                      items: subscribersList.value,
                                      search: search.value,
                                      loading: loading.value,
                                      class: "elevation-1 rounded"
                                    }, {
                                      "item.status": withCtx(({ item }) => [
                                        createVNode(VChip, {
                                          color: item.status === "active" ? "success" : "error",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"])
                                      ]),
                                      "item.date": withCtx(({ item }) => [
                                        createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["headers", "items", "search", "loading"])
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
                                        createTextVNode("mdi-history")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Email History ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, { class: "pa-0" }, {
                                  default: withCtx(() => [
                                    createVNode(VList, null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                          return openBlock(), createBlock(VListItem, {
                                            key: index,
                                            subtitle: formatDate(item.date),
                                            "prepend-icon": "mdi-email-outline"
                                          }, {
                                            append: withCtx(() => [
                                              createVNode(VChip, {
                                                size: "x-small",
                                                color: getStatusColor(item.status)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.status), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.subject), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["subtitle"]);
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
                    createVNode(EmailEditor)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: addNewsletter.value,
              "onUpdate:modelValue": ($event) => addNewsletter.value = $event,
              "max-width": "700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Add Newsletter `);
                            } else {
                              return [
                                createTextVNode(" Add Newsletter ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VTextField, {
                                modelValue: newsletterName.value,
                                "onUpdate:modelValue": ($event) => newsletterName.value = $event,
                                label: "Newsletter Name",
                                "prepend-inner-icon": "mdi-email-outline",
                                variant: "outlined",
                                density: "comfortable",
                                "hide-details": "",
                                class: "mb-4"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VTextField, {
                                  modelValue: newsletterName.value,
                                  "onUpdate:modelValue": ($event) => newsletterName.value = $event,
                                  label: "Newsletter Name",
                                  "prepend-inner-icon": "mdi-email-outline",
                                  variant: "outlined",
                                  density: "comfortable",
                                  "hide-details": "",
                                  class: "mb-4"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardActions, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VBtn, {
                                color: "error",
                                variant: "tonal",
                                onClick: ($event) => addNewsletter.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Cancel `);
                                  } else {
                                    return [
                                      createTextVNode(" Cancel ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "success",
                                variant: "tonal",
                                onClick: createNewsletter
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Create `);
                                  } else {
                                    return [
                                      createTextVNode(" Create ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VBtn, {
                                  color: "error",
                                  variant: "tonal",
                                  onClick: ($event) => addNewsletter.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cancel ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "success",
                                  variant: "tonal",
                                  onClick: createNewsletter
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create ")
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
                              createTextVNode(" Add Newsletter ")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: newsletterName.value,
                                "onUpdate:modelValue": ($event) => newsletterName.value = $event,
                                label: "Newsletter Name",
                                "prepend-inner-icon": "mdi-email-outline",
                                variant: "outlined",
                                density: "comfortable",
                                "hide-details": "",
                                class: "mb-4"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCardActions, null, {
                            default: withCtx(() => [
                              createVNode(VBtn, {
                                color: "error",
                                variant: "tonal",
                                onClick: ($event) => addNewsletter.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cancel ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "success",
                                variant: "tonal",
                                onClick: createNewsletter
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Create ")
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
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                          default: withCtx(() => [
                            createTextVNode(" Add Newsletter ")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VTextField, {
                              modelValue: newsletterName.value,
                              "onUpdate:modelValue": ($event) => newsletterName.value = $event,
                              label: "Newsletter Name",
                              "prepend-inner-icon": "mdi-email-outline",
                              variant: "outlined",
                              density: "comfortable",
                              "hide-details": "",
                              class: "mb-4"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VBtn, {
                              color: "error",
                              variant: "tonal",
                              onClick: ($event) => addNewsletter.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "success",
                              variant: "tonal",
                              onClick: createNewsletter
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Create ")
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
            _push2(ssrRenderComponent(VSnackbar, {
              modelValue: snackbar.value.show,
              "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
              color: snackbar.value.color,
              timeout: "3000",
              location: "top"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(snackbar.value.text)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(snackbar.value.text), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VAppBar, {
                flat: "",
                color: "primary",
                class: "px-4"
              }, {
                default: withCtx(() => [
                  createVNode(VIcon, {
                    size: "large",
                    class: "mr-3"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("mdi-email-newsletter")
                    ]),
                    _: 1
                  }),
                  createVNode(VToolbarTitle, { class: "text-h5 font-weight-bold" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(newsletterName.value), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(VSpacer),
                  createVNode(VBtn, {
                    "prepend-icon": "mdi-download",
                    variant: "text",
                    onClick: exportSubscribers
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Export CSV ")
                    ]),
                    _: 1
                  }),
                  createVNode(VBtn, {
                    "prepend-icon": "mdi-plus",
                    variant: "text",
                    onClick: ($event) => addNewsletter.value = true
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add Newsletter ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              }),
              createVNode(VMain, { class: "ma-4" }, {
                default: withCtx(() => [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(VCol, {
                        cols: "12",
                        md: "6"
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
                                    color: "primary",
                                    class: "mb-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account-group")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(subscriberCount.value), 1),
                                  createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Subscribers")
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
                            class: "rounded-lg",
                            elevation: "2",
                            height: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardText, { class: "d-flex flex-column align-center justify-center" }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    size: "48",
                                    color: "info",
                                    class: "mb-2"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-email-outline")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-h4 font-weight-bold" }, toDisplayString(sentEmails.value), 1),
                                  createVNode("div", { class: "text-subtitle-1 text-medium-emphasis" }, "Emails sent")
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
                      createVNode(VCol, {
                        cols: "12",
                        md: "8"
                      }, {
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
                                      createTextVNode("mdi-account-group")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Subscribers List ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-4" }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: search.value,
                                    "onUpdate:modelValue": ($event) => search.value = $event,
                                    "prepend-inner-icon": "mdi-magnify",
                                    label: "Search subscriber",
                                    "single-line": "",
                                    variant: "outlined",
                                    density: "comfortable",
                                    "hide-details": "",
                                    class: "mb-4"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(VDataTable, {
                                    headers: headers.value,
                                    items: subscribersList.value,
                                    search: search.value,
                                    loading: loading.value,
                                    class: "elevation-1 rounded"
                                  }, {
                                    "item.status": withCtx(({ item }) => [
                                      createVNode(VChip, {
                                        color: item.status === "active" ? "success" : "error",
                                        size: "small"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.status === "active" ? "Active" : "Unsubscribed"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["color"])
                                    ]),
                                    "item.date": withCtx(({ item }) => [
                                      createTextVNode(toDisplayString(new Date(item.date).toLocaleDateString("en-US")), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["headers", "items", "search", "loading"])
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
                                      createTextVNode("mdi-history")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Email History ")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, { class: "pa-0" }, {
                                default: withCtx(() => [
                                  createVNode(VList, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(emailHistory.value, (item, index) => {
                                        return openBlock(), createBlock(VListItem, {
                                          key: index,
                                          subtitle: formatDate(item.date),
                                          "prepend-icon": "mdi-email-outline"
                                        }, {
                                          append: withCtx(() => [
                                            createVNode(VChip, {
                                              size: "x-small",
                                              color: getStatusColor(item.status)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.status), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"])
                                          ]),
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.subject), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["subtitle"]);
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
                  createVNode(EmailEditor)
                ]),
                _: 1
              }),
              createVNode(VDialog, {
                modelValue: addNewsletter.value,
                "onUpdate:modelValue": ($event) => addNewsletter.value = $event,
                "max-width": "700"
              }, {
                default: withCtx(() => [
                  createVNode(VCard, null, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, { class: "bg-primary text-white py-3 px-4 rounded-t-lg" }, {
                        default: withCtx(() => [
                          createTextVNode(" Add Newsletter ")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VTextField, {
                            modelValue: newsletterName.value,
                            "onUpdate:modelValue": ($event) => newsletterName.value = $event,
                            label: "Newsletter Name",
                            "prepend-inner-icon": "mdi-email-outline",
                            variant: "outlined",
                            density: "comfortable",
                            "hide-details": "",
                            class: "mb-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VBtn, {
                            color: "error",
                            variant: "tonal",
                            onClick: ($event) => addNewsletter.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "success",
                            variant: "tonal",
                            onClick: createNewsletter
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Create ")
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
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VSnackbar, {
                modelValue: snackbar.value.show,
                "onUpdate:modelValue": ($event) => snackbar.value.show = $event,
                color: snackbar.value.color,
                timeout: "3000",
                location: "top"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(snackbar.value.text), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/newsletter-admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const newsletterAdmin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c9610d37"]]);

export { newsletterAdmin as default };
//# sourceMappingURL=newsletter-admin.vue.mjs.map
