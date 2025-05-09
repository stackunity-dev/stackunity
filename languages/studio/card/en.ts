export default {
  accessibilityPanel: {
    title: "Card customization panel",
    frameworkIndicators: "Framework indicators"
  },
  frameworks: {
    vue: "Vue.js",
    vuetify: "Vuetify",
    studio: "Studio",
    seo: "SEO"
  },
  visionTypes: {
    menu: "Try different vision types",
    normal: "Normal vision",
    protanopia: "Protanopia (red-blind)",
    deuteranopia: "Deuteranopia (green-blind)",
    tritanopia: "Tritanopia (blue-blind)",
    achromatopsia: "Achromatopsia (no color)",
    blurredVision: "Blurred vision",
    intensity: "Intensity"
  },
  tabs: {
    content: "Content",
    style: "Style",
    actions: "Actions",
    data: "Data",
    aria: "ARIA",
    templates: "Templates"
  },
  content: {
    title: "Title",
    subtitle: "Subtitle",
    text: "Text",
    imageUrl: "Image URL",
    imageOptions: {
      none: "None",
      mountains: "Mountains",
      beach: "Beach",
      forest: "Forest"
    },
    icon: "Icon",
    iconColor: "Icon color"
  },
  style: {
    elevation: "Elevation",
    variant: "Variant",
    color: "Color",
    loading: "Loading",
    disabled: "Disabled",
    hoverEffect: "Hover effect",
    padding: "Padding",
    borderRadius: "Border radius"
  },
  actions: {
    showButtons: "Show buttons",
    buttonText: "Button text",
    buttonStyle: "Button style",
    buttonColor: "Button color",
    buttonWidth: "Button width",
    auto: "Auto",
    buttonPosition: "Button position",
    alignLeft: "Align left",
    alignCenter: "Align center",
    alignRight: "Align right",
    spaceBetween: "Space between",
    buttonIcon: "Button icon",
    buttonLink: "Link"
  },
  dataVisualization: {
    title: "Data visualization",
    subtitle: "Subtitle",
    showSparkline: "Show sparkline",
    showTimeline: "Show timeline",
    sparklineColor: "Sparkline color",
    sparklineGradient: "Sparkline gradient",
    sparklineLineWidth: "Sparkline line width"
  },
  variations: {
    flat: "Flat",
    elevated: "Elevated",
    tonal: "Tonal",
    outlined: "Outlined",
    text: "Text",
    plain: "Plain"
  },
  templates: {
    applyTemplate: "Apply template",
    chooseTemplate: "Choose template",
    applyingTemplate: "Applying template",
    saveTemplate: "Save Template",
    templateName: "Template Name",
    saveCurrentConfig: "Save current configuration",
    save: "Save",
    cancel: "Cancel",
    savedSuccessfully: "Template saved successfully",
    errorSaving: "Error saving template",
    nameRequired: "Template name is required"
  },
  aria: {
    roleLabel: "ARIA Role",
    roleDescription: "Role Description",
    labelText: "ARIA Label",
    labelledBy: "Labelled By (Element ID)",
    describedBy: "Described By (Element ID)",
    expanded: "Expanded",
    hidden: "Hidden",
    level: "Level (1-6)",
    modal: "Modal",
    multiline: "Multiline",
    multiselectable: "Multiselectable",
    orientation: "Orientation",
    placeholder: "Placeholder",
    posInSet: "Position in Set",
    pressed: "Pressed",
    readOnly: "Read Only",
    required: "Required",
    selected: "Selected",
    setSize: "Set Size",
    sort: "Sort"
  },
  preview: {
    title: "Card Preview",
    generatedCode: "Generated Code",
    copyCode: "Copy Code",
    codeCopied: "Code copied!",
    htmlTab: "HTML",
    cssTab: "CSS",
    jsTab: "JavaScript",
    previewTab: "Preview",
    livePreview: "Live Preview"
  },
  cardProperties: {
    title: 'Premium features',
    subtitle: 'Unlock all UI components with a premium plan',
    text: 'Lifetime access to all premium features and updates for only 300€ one time payment',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    icon: 'mdi-crown',
    elevation: 2,
    padding: 8,
    rounded: 'md',
    loading: false,
    disabled: false,
    hoverEffect: false,
    showButtons: true,
    buttonText: 'Checkout',
    buttonWidth: 0,
    buttonLink: '/checkout',
    buttonPosition: 'start',
    buttonIcon: 'mdi-cart-outline',
    showProgress: false,
    progressValue: 75,
    indeterminate: false,
    progressWidth: 6,
    progressPosition: 'inline',
    showProgressLabel: false,
    progressLabelStyle: 'value',
    progressLabelText: '',
    showProgressBg: false,
    showTimeline: false,
    showSparkline: false,
    sparklineData: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    sparklineColor: 'primary',
    sparklineGradient: false,
    sparklineLineWidth: 2,
    sparklineShowLabels: false,
    sparklineLabels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
    ariaLabel: 'Card with a title, subtitle, text, image, sparkline, timeline, buttons, and progress',
    ariaLabelledBy: 'card-title, card-subtitle, card-text, card-image, card-sparkline, card-timeline, card-buttons, card-progress',
    ariaRole: 'region',
    ariaDescribedBy: 'card-description',
    ariaControls: 'card-actions',
  }
} 